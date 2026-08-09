terraform {
  required_providers {
    yandex = {
      source  = "yandex-cloud/yandex"
      version = "0.178.0"
    }
  }
  required_version = ">= 0.13"

  # Bucket must exist before `terraform init` (chicken-and-egg: Terraform
  # can't create the bucket it stores its own state in). Create it once,
  # by hand or via the CLI, in the same cloud folder as the rest of this
  # config:
  #   yc storage bucket create --name sacred-castle-wedding-terraform-state
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
