terraform {
  required_providers {
    yandex = {
      source  = "yandex-cloud/yandex"
      version = "0.178.0"
    }
  }
  required_version = ">= 0.13"

  # State stays local (terraform.tfstate, gitignored) — no remote backend.
}

provider "yandex" {
  zone      = var.zone
  folder_id = var.folder_id
}
