import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Life Calendar",
  description: "Visualize remaining time with your loved ones",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
