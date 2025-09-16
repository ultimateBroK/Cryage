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
  title: "Cryage - Crypto agent",
  description: "Crypto agent for cryptocurrency insights, blockchain analysis, and trading guidance",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: '/favicon.svg?v=6', type: 'image/svg+xml' },
      { url: '/favicon.svg?v=6', type: 'image/svg+xml', sizes: '32x32' },
      { url: '/favicon.svg?v=6', type: 'image/svg+xml', sizes: '16x16' },
    ],
    shortcut: '/favicon.svg?v=6',
    apple: '/favicon.svg?v=6',
    other: [
      { rel: 'icon', type: 'image/svg+xml', url: '/favicon.svg?v=6' },
      { rel: 'mask-icon', url: '/favicon.svg?v=6', color: '#00f7be' },
    ],
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#00f7be",
  colorScheme: "dark light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased overflow-hidden`}
        style={{
          height: '100vh',
          width: '100vw',
          position: 'fixed',
          top: 0,
          left: 0,
        }}
      >
        {children}
      </body>
    </html>
  );
}
