import type { Metadata } from "next";
import { Geist, JetBrains_Mono } from "next/font/google";
import "../styles/globals.css";
import { PageTransitionWrapper } from "@/components/common/page-transition-wrapper";
import { NotificationProvider } from "@/components/providers/notification-provider";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
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
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${geist.variable} ${jetbrainsMono.variable} antialiased font-sans`}
      >
        <NotificationProvider>
          <PageTransitionWrapper>{children}</PageTransitionWrapper>
        </NotificationProvider>
      </body>
    </html>
  );
}
