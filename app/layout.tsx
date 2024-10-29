import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";

import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";

import Header from "@/custom-components/header";

export const metadata: Metadata = {
  title: "Content Craft",
  description: "Craft your content with ease.",
};

export const viewport: Viewport = {
  maximumScale: 1,
};

const manrope = Manrope({ subsets: ["latin"] });

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <html
      lang="en"
      className={`bg-white dark:bg-gray-950 text-black dark:text-white ${manrope.className}`}
    >
      <body className="min-h-[100dvh] bg-gray-50">
        <SessionProvider session={session}>
          <section className="flex flex-col min-h-screen">
            <Header />
            {children}
          </section>
        </SessionProvider>
      </body>
    </html>
  );
}
