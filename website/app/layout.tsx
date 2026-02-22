import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "SteerByPhone - Turn Your Smartphone Into a Steering Wheel",
  description: "Transform your smartphone into a powerful steering wheel for PC racing games. Download our Mac receiver and mobile client apps to get started.",
  keywords: ["steering wheel", "racing games", "smartphone controller", "mobile gaming", "Mac app", "Android app"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
