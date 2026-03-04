import { GoogleAnalytics } from '@next/third-parties/google';
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Papa-Quest | 産後クライシス予防・パパ向け育児支援アプリ",
  description: "毎日1つ送られてくる「育児・家事ミッション」をクリアし、パパとしてのレベルを上げていくクエスト型アプリ。妻をケアし、夫婦で産後の大変な時期を乗り切ろう！",
  keywords: ["育児", "パパ", "男性育休", "産後クライシス", "家事分担", "タスク管理"],
  manifest: "/manifest.json",
  openGraph: {
    title: "Papa-Quest",
    description: "毎日1ミッション。新米パパのための育児支援クエストアプリ",
    url: "https://papa-quest.vercel.app",
    siteName: "Papa-Quest",
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Papa-Quest",
    description: "毎日1ミッション。新米パパのための育児支援クエストアプリ",
  },
  icons: {
    apple: "/icon512_maskable.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Papa-Quest",
  },
};

export const viewport = {
  themeColor: "#1f2937",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID || ''} />
      </body>
    </html>
  );
}
