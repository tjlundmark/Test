import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HomePlate - Home Kitchen Marketplace",
  description:
    "Order delicious homemade food from talented local cooks in your neighborhood. Real food, real people, real delicious.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans">{children}</body>
    </html>
  );
}
