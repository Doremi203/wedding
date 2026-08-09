# Terraform — Yandex Cloud

Провижионит: DNS-зону + сертификат для домена, бакет Object Storage под статику сайта (website hosting), сервисный аккаунт со статическим ключом для управления бакетом (S3 API не принимает IAM-токен).

## Установка инструментов

`registry.terraform.io` и `releases.hashicorp.com` блокируют скачивание по региону (RU) — ставим `terraform` и провайдер через зеркала Yandex Cloud.

```bash
# terraform CLI — с зеркала hashicorp-releases.yandexcloud.net
# (актуальную версию/архив под свою платформу смотреть на
# https://hashicorp-releases.yandexcloud.net/terraform/)

# провайдеры — через network_mirror в ~/.terraformrc:
cat <<'EOF' > ~/.terraformrc
provider_installation {
  network_mirror {
    url     = "https://terraform-mirror.yandexcloud.net/"
    include = ["registry.terraform.io/*/*"]
  }
  direct {
    exclude = ["registry.terraform.io/*/*"]
  }
}
EOF

# yc CLI
brew install yandex-cloud-cli
```

## Авторизация

```bash
yc init   # OAuth-логин в браузере, выбор облака/каталога (folder)
```

Terraform-провайдер сам подхватывает `YC_TOKEN` из окружения — перед каждым `terraform` вызовом:

```bash
export YC_TOKEN=$(yc iam create-token)
```

IAM-токен живёт ограниченное время, перегенерировать перед каждой сессией работы с terraform.

## Переменные

```bash
cp terraform.tfvars.example terraform.tfvars
# folder_id — взять из `yc config get folder-id`
```

## Remote state (S3 backend)

Стейт хранится в приватном бакете Object Storage (`sacred-castle-wedding-terraform-state`, ресурс `yandex_storage_bucket.terraform_state` в `state_backend.tf`), не локально и не в git. У этого backend'а нет native locking (у Yandex Object Storage нет DynamoDB-style lock-таблицы) — не запускать `apply` параллельно из двух мест.

Backend-блок в `main.tf` не хранит креды — они передаются через переменные окружения:

```bash
export AWS_ACCESS_KEY_ID=$(terraform output -raw storage_access_key_id)
export AWS_SECRET_ACCESS_KEY=$(terraform output -raw storage_secret_access_key)
```

(тот же статический ключ service account'а `storage_admin`, что используется для бакета фронтенда — см. `storage_sa.tf`).

## Обычный цикл

```bash
export YC_TOKEN=$(yc iam create-token)
export AWS_ACCESS_KEY_ID=$(terraform output -raw storage_access_key_id)
export AWS_SECRET_ACCESS_KEY=$(terraform output -raw storage_secret_access_key)

terraform init
terraform plan -out=tfplan.out
# показать план человеку, дождаться подтверждения — см. CLAUDE.md → Git Workflow
terraform apply tfplan.out
```

`tfplan*.out`/`*.tfplan` не коммитить — файл плана сериализует значения ресурсов, включая секреты (`storage_secret_access_key`), см. `.gitignore`.

## После первого apply

- `terraform output dns_zone_id` — если домен ещё не делегирован у регистратора, прописать NS `ns1.yandexcloud.net` / `ns2.yandexcloud.net` (общие anycast-неймсерверы Yandex Cloud DNS, фиксированные для всех публичных зон).
- Сертификат (`yandex_cm_certificate`) проходит DNS-валидацию асинхронно после apply — статус смотреть через `yc certificate-manager certificate list`, обычно занимает от нескольких минут до пары часов.
- `terraform output -raw storage_secret_access_key` / `storage_access_key_id` — креды для заливки статики, см. `README.md` в корне репозитория (`aws s3 sync`).
