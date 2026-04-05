import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "RUNdio | パーソナル・ランニング・ラジオ",
  description: "あなたのペースに合わせたAI実況で、毎日のランニングが特別な体験に変わります。走る。聴く。もっと、楽しむ。",
  openGraph: {
    title: "RUNdio | パーソナル・ランニング・ラジオ",
    description: "あなたのペースに合わせたAI実況で、毎日のランニングが特別な体験に変わります。走る。聴く。もっと、楽しむ。",
    url: "https://rundio.example.com",
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

export default function LpLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
