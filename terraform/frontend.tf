resource "yandex_storage_bucket" "frontend_s3" {
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
  bucket = yandex_storage_bucket.frontend_s3.bucket
  acl    = "public-read"
}

# CDN in front of the bucket for HTTPS on the custom domain + edge caching.
# The apex DNS record currently bypasses this and points straight at the
# bucket's website endpoint (see dns.tf) to keep the initial setup simple;
# re-point it at this resource once CDN caching behaviour has been verified.
resource "yandex_cdn_origin_group" "frontend_origin_group" {
  name     = "sacred-castle-wedding-origin-group"
  use_next = true
  origin {
    source = "${var.domain}.website.yandexcloud.net"
  }
}

resource "yandex_cdn_resource" "frontend_cdn" {
  cname             = var.domain
  active            = true
  origin_protocol   = "http"
  origin_group_name = yandex_cdn_origin_group.frontend_origin_group.name
  options {
    custom_host_header     = "${var.domain}.website.yandexcloud.net"
    redirect_http_to_https = true
  }

  ssl_certificate {
    type                   = "certificate_manager"
    certificate_manager_id = yandex_cm_certificate.main_domain_cert.id
  }
}
