resource "yandex_dns_zone" "main_domain_public_zone" {
  name   = "public-zone"
  zone   = "${var.domain}."
  public = true
}

# Registrar must delegate the domain to these name servers — see the
# `dns_zone_name_servers` output after the first apply.
resource "yandex_dns_recordset" "frontend_apex_record" {
  zone_id = yandex_dns_zone.main_domain_public_zone.id
  name    = "${var.domain}."
  type    = "ANAME"
  ttl     = 600
  data    = ["${var.domain}.website.yandexcloud.net"]
}
