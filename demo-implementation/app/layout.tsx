import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";
import MobileFrame from "@/components/mobile-frame";

const noto = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "RUNdio",
  description: "ラン×レディオ — あなただけのランニング用ラジオ",
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
          <MobileFrame>{children}</MobileFrame>
        </Providers>
      </body>
    </html>
  );
}
