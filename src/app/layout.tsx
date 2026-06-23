import type { Metadata, Viewport } from "next";
import { Heebo, Rubik } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const heebo = Heebo({
  variable: "--font-heebo",
  subsets: ["hebrew", "latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const rubik = Rubik({
  variable: "--font-rubik",
  subsets: ["hebrew", "latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "מה עדיף? | Pick One — משחק הבחירות הכי מהיר וממכר",
  description:
    "משחק הבחירות הכי מהיר, מצחיק וממכר שיש. בחרו בין שתי אפשרויות, ראו את הטעם שלכם, ושתפו את התוצאה.",
  keywords: ["מה עדיף", "Pick One", "משחק בחירות", "Tinder לבחירות", "סקר", "טריוויה"],
  authors: [{ name: "Pick One" }],
  openGraph: {
    title: "מה עדיף? — משחק הבחירות הכי מהיר וממכר",
    description: "בחרו מהר. אל תחשבו יותר מדי. גלו את הטעם שלכם אחרי 10 בחירות.",
    type: "website",
    locale: "he_IL",
  },
  twitter: {
    card: "summary_large_image",
    title: "מה עדיף? — משחק הבחירות הכי מהיר וממכר",
    description: "בחרו מהר. אל תחשבו יותר מדי. גלו את הטעם שלכם אחרי 10 בחירות.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#1a1428",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl" suppressHydrationWarning>
      <body
        className={`${heebo.variable} ${rubik.variable} font-sans antialiased`}
      >
        {/* Ambient aurora background */}
        <div className="aurora-bg" aria-hidden />
        <div className="aurora-sweep" aria-hidden />
        <div className="noise" aria-hidden />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
