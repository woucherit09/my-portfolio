import type { Metadata, Viewport } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["cyrillic", "latin"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-space",
  subsets: ["cyrillic", "latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://woucherit09.github.io/my-portfolio"),
  title: "Константин Матейкович — Fullstack-разработчик",
  description:
    "Портфолио fullstack-разработчика Константина Матейковича: веб-приложения, сайты, Telegram-боты и мобильные решения.",
  keywords: ["fullstack-разработчик", "веб-разработка", "React", "Next.js", "Python", "Telegram-боты"],
  authors: [{ name: "Константин Матейкович" }],
  openGraph: {
    title: "Константин Матейкович — Fullstack-разработчик",
    description: "Цифровые продукты от интерфейса до API, базы данных и деплоя.",
    type: "website",
    locale: "ru_RU",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0a0a0f",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru" data-theme="dark">
      <body className={`${inter.variable} ${manrope.variable}`}>{children}</body>
    </html>
  );
}
