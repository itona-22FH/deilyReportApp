import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
// import { RecoilRoot } from "recoil";
import ClientRootLayout from "@/components/ClientRootLayout";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "日報アプリ",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
          <ClientRootLayout>{children}</ClientRootLayout>
      </body>
    </html>
  );
}
