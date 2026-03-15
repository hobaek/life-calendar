import type { Metadata } from "next";
import { Lora, Nunito } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getLocale } from "next-intl/server";
import LocaleSwitcher from "@/components/LocaleSwitcher";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
  display: "swap",
});

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Life Calendar — How many Saturdays do you have left?",
  description:
    "Visualize the time remaining with the people and companions you love. Every square is a day, a week, a moment — make each one count.",
  keywords: [
    "life calendar",
    "memento mori",
    "time visualization",
    "remaining time",
    "life grid",
    "weeks left",
  ],
  openGraph: {
    title: "Life Calendar — How many Saturdays do you have left?",
    description:
      "Visualize the time remaining with the people and companions you love.",
    url: "https://life-calendar-gray.vercel.app",
    siteName: "Life Calendar",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Life Calendar — How many Saturdays do you have left?",
    description:
      "Visualize the time remaining with the people and companions you love.",
  },
  metadataBase: new URL("https://life-calendar-gray.vercel.app"),
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const messages = await getMessages();
  const locale = await getLocale();
  return (
    <html lang={locale} className={`${lora.variable} ${nunito.variable}`}>
      <body className="bg-bg font-sans text-lc-text min-h-screen">
        <NextIntlClientProvider messages={messages} locale={locale}>
          <div className="fixed top-4 right-4 z-40">
            <LocaleSwitcher />
          </div>
          {children}
        </NextIntlClientProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
