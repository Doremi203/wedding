terraform {
  required_providers {
    yandex = {
      source  = "yandex-cloud/yandex"
      version = "0.178.0"
    }
  }
  required_version = ">= 0.13"

  # Remote state in Yandex Object Storage (S3-compatible API). No native
  # locking on this backend (Yandex has no DynamoDB-style lock table) —
  # avoid concurrent applies. Credentials come from AWS_ACCESS_KEY_ID /
  # AWS_SECRET_ACCESS_KEY env vars (the storage_admin static key, see
  # `terraform output -raw storage_access_key_id`), not from this file.
  backend "s3" {
    endpoints = {
      s3 = "https://storage.yandexcloud.net"
    }
    bucket = "sacred-castle-wedding-terraform-state"
    region = "ru-central1"
    key    = "terraform.tfstate"

    skip_region_validation      = true
    skip_credentials_validation = true
    skip_requesting_account_id  = true
    skip_s3_checksum            = true
  }
}

provider "yandex" {
  zone      = var.zone
  folder_id = var.folder_id
}
