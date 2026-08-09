# Private bucket that holds this workspace's own remote state (S3 backend
# in main.tf). Created with the local backend on the first apply — a state
# bucket can't manage the state it will itself hold (chicken-and-egg) — then
# state is migrated into it via `terraform init -migrate-state`.

resource "yandex_storage_bucket" "terraform_state" {
  access_key = yandex_iam_service_account_static_access_key.storage_admin_key.access_key
  secret_key = yandex_iam_service_account_static_access_key.storage_admin_key.secret_key

  bucket = "sacred-castle-wedding-terraform-state"

  # Protect against accidental overwrite/corruption of tfstate.
  versioning {
    enabled = true
  }
}
