# Object Storage is accessed via an S3-compatible API that does not accept
# IAM tokens — it needs static access keys tied to a service account.
# See: https://github.com/yandex-cloud/terraform-provider-yandex/issues/474

resource "yandex_iam_service_account" "storage_admin" {
  name        = "wedding-storage-admin"
  description = "Manages the frontend Object Storage bucket (S3 API static-key auth only)."
  folder_id   = var.folder_id
}

resource "yandex_resourcemanager_folder_iam_member" "storage_admin_role" {
  folder_id = var.folder_id
  # storage.editor can't manage bucket ACLs (yandex_storage_bucket_grant needs
  # PutBucketAcl) — storage.admin is required for that.
  role   = "storage.admin"
  member = "serviceAccount:${yandex_iam_service_account.storage_admin.id}"
}

resource "yandex_iam_service_account_static_access_key" "storage_admin_key" {
  service_account_id = yandex_iam_service_account.storage_admin.id
  description         = "Static key for yandex_storage_bucket/yandex_storage_bucket_grant S3 API auth."
}
