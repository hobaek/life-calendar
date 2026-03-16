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
          <div className="fixed top-4 right-4 z-40 flex items-center gap-2">
            <LocaleSwitcher />
            <a
              href="https://github.com/hobaek/life-calendar"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full bg-card-bg shadow-card flex items-center justify-center text-lc-text-light hover:text-coral transition-all"
              aria-label="GitHub"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="currentColor"
              >
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0016 8c0-4.42-3.58-8-8-8z" />
              </svg>
            </a>
          </div>
          {children}
        </NextIntlClientProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
