output "dns_zone_id" {
  description = "After apply, run `yc dns zone list-records <id>` (or check the console) for the NS records to delegate the domain to at the registrar — the yandex provider doesn't expose them as a resource attribute."
  value       = yandex_dns_zone.main_domain_public_zone.id
}

output "bucket_website_endpoint" {
  description = "Raw Object Storage website endpoint behind the domain."
  value       = "${var.domain}.website.yandexcloud.net"
}

output "bucket_name" {
  value = yandex_storage_bucket.frontend_s3.bucket
}

output "storage_access_key_id" {
  description = "Access key id for the `aws s3 sync out/ s3://<bucket> --endpoint-url https://storage.yandexcloud.net` deploy step."
  value       = yandex_iam_service_account_static_access_key.storage_admin_key.access_key
}

output "storage_secret_access_key" {
  description = "Secret key for the deploy step. Retrieve with `terraform output -raw storage_secret_access_key`."
  value       = yandex_iam_service_account_static_access_key.storage_admin_key.secret_key
  sensitive   = true
}
