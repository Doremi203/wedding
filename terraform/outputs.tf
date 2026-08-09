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

output "cdn_resource_id" {
  value = yandex_cdn_resource.frontend_cdn.id
}
