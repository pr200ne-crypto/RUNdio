import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";
import AppLayout from "@/components/AppLayout";

const noto = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "RUNdio | パーソナル・ランニング・ラジオ",
  description: "あなたのペースに合わせたAI実況で、毎日のランニングが特別な体験に変わります。",
  openGraph: {
    title: "RUNdio | パーソナル・ランニング・ラジオ",
    description: "あなたのペースに合わせたAI実況で、毎日のランニングが特別な体験に変わります。",
    url: "https://demo-implementation.vercel.app",
    siteName: "RUNdio",
    images: [
      {
        url: "https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=1200&q=80",
        width: 1200,
        height: 630,
        alt: "RUNdio - パーソナル・ランニング・ラジオ",
      },
    ],
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "RUNdio | パーソナル・ランニング・ラジオ",
    description: "あなたのペースに合わせたAI実況で、毎日のランニングが特別な体験に変わります。",
    images: ["https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=1200&q=80"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={noto.className}>
      <body>
        <Providers>
          <AppLayout>
            {children}
          </AppLayout>
        </Providers>
      </body>
    </html>
  );
}
