import type { Metadata } from "next";
import { Geist, JetBrains_Mono } from "next/font/google";
import "../styles/globals.css";
import { PageTransitionWrapper } from "@/components/common/page-transition-wrapper";
import { NotificationProvider } from "@/stores/notification-provider";

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
      { url: '/favicon-16x16.svg', type: 'image/svg+xml', sizes: '16x16' },
      { url: '/favicon-32x32.svg', type: 'image/svg+xml', sizes: '32x32' },
      { url: '/favicon-48x48.svg', type: 'image/svg+xml', sizes: '48x48' },
      { url: '/favicon-64x64.svg', type: 'image/svg+xml', sizes: '64x64' },
    ],
    shortcut: '/favicon-32x32.svg',
    apple: [
      { url: '/apple-touch-icon-152x152.svg', sizes: '152x152', type: 'image/svg+xml' },
      { url: '/apple-touch-icon-180x180.svg', sizes: '180x180', type: 'image/svg+xml' },
    ],
    other: [
      { rel: 'icon', type: 'image/svg+xml', url: '/favicon-32x32.svg', sizes: '32x32' },
      { rel: 'mask-icon', url: '/favicon-32x32.svg', color: '#00f7be' },
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
