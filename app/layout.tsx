import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Liflet",
  description: "一人暮らしの“今”を、ひとつの画面に。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}