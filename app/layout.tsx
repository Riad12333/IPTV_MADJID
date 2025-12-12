import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "IPTV Player - Watch Live TV Channels Online",
  description: "Stream thousands of live TV channels from around the world. Watch news, sports, movies, music and more with our modern IPTV player.",
  keywords: ["IPTV", "live TV", "streaming", "channels", "online TV", "free TV"],
  authors: [{ name: "IPTV Player" }],
  viewport: "width=device-width, initial-scale=1, maximum-scale=5",
  themeColor: "#ef4444",
  openGraph: {
    title: "IPTV Player - Watch Live TV Channels Online",
    description: "Stream thousands of live TV channels from around the world",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}

