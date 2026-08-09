resource "yandex_cm_certificate" "main_domain_cert" {
  name    = "main-domain-cert"
  domains = [var.domain, "*.${var.domain}"]
  managed {
    challenge_type  = "DNS_CNAME"
    challenge_count = 1
  }
}

resource "yandex_dns_recordset" "main_domain_cert_challenge" {
  count   = yandex_cm_certificate.main_domain_cert.managed[0].challenge_count
  zone_id = yandex_dns_zone.main_domain_public_zone.id
  name    = yandex_cm_certificate.main_domain_cert.challenges[count.index].dns_name
  type    = yandex_cm_certificate.main_domain_cert.challenges[count.index].dns_type
  data    = [yandex_cm_certificate.main_domain_cert.challenges[count.index].dns_value]
  ttl     = 60
}
