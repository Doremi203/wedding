import type { Metadata } from "next";
import { Cinzel, Cormorant_Garamond, EB_Garamond } from "next/font/google";
import "./globals.css";

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-cinzel",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const ebGaramond = EB_Garamond({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  variable: "--font-eb-garamond",
  display: "swap",
});

const SITE_TITLE = "Ирина и Максим — 13 сентября 2026";
const SITE_DESCRIPTION = "Приглашение на свадьбу";

export const metadata: Metadata = {
  // Абсолютный базовый URL нужен для og:image: при static export сервера нет,
  // и без metadataBase Next подставил бы localhost.
  metadataBase: new URL("https://sacred-castle-wedding.ru"),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    // og:url намеренно не задаём: страниц две (/ и /invitation?n=Имя), и
    // общий canonical увёл бы карточку упрощённой ссылки на ENTRY.
    siteName: SITE_TITLE,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    // Картинка подхватывается из src/app/opengraph-image.jpg по конвенции
    // App Router — сюда её дублировать не нужно.
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${cinzel.variable} ${cormorant.variable} ${ebGaramond.variable}`}>
      <body>{children}</body>
    </html>
  );
}
