variable "domain" {
  type        = string
  description = "Root domain the site is served from."
  default     = "sacred-castle-wedding.ru"
}

variable "folder_id" {
  type        = string
  description = "Yandex Cloud folder to create resources in. No default on purpose — set via terraform.tfvars (untracked) or TF_VAR_folder_id."
}

variable "zone" {
  type        = string
  description = "Default Yandex Cloud availability zone for the provider."
  default     = "ru-central1-d"
}
