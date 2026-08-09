resource "yandex_storage_bucket" "frontend_s3" {
  access_key = yandex_iam_service_account_static_access_key.storage_admin_key.access_key
  secret_key = yandex_iam_service_account_static_access_key.storage_admin_key.secret_key

  bucket = var.domain

  # `next build` with `output: 'export'` produces a single-route app;
  # falling back to index.html on 404 keeps deep links/refreshes working.
  website {
    index_document = "index.html"
    error_document = "index.html"
  }

  https {
    certificate_id = yandex_cm_certificate.main_domain_cert.id
  }
}

resource "yandex_storage_bucket_grant" "public_read" {
  access_key = yandex_iam_service_account_static_access_key.storage_admin_key.access_key
  secret_key = yandex_iam_service_account_static_access_key.storage_admin_key.secret_key

  bucket = yandex_storage_bucket.frontend_s3.bucket
  acl    = "public-read"
}
