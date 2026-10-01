import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import { AppShell } from "@/components/AppShell";
import { ContentProvider } from "@/content/ContentProvider";
import { getSiteContent } from "@/content/loadSite";
import "./globals.css";

const display = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["300", "400", "500", "600", "700"],
});

const body = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["300", "400", "500", "600"],
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500", "700"],
});

const site = getSiteContent();

export const metadata: Metadata = {
  title: site.identity.seoTitle,
  description: site.identity.seoDescription,
  metadataBase: new URL("https://localhost"),
  openGraph: {
    title: site.identity.seoTitle,
    description: site.identity.seoDescription,
    images: ["/og-image.png"],
    type: "website",
  },
  icons: {
    icon: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body className="bg-bg font-body text-text antialiased">
        <ContentProvider content={site}>
          <AppShell>{children}</AppShell>
        </ContentProvider>
      </body>
    </html>
  );
}
