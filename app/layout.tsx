import type { Metadata } from "next";
import { Outfit, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
  weight: ["300", "400", "500", "600"],
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  display: "swap",
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Sarthak Jets — Luxury Private Aviation",
  description:
    "Private aviation, refined for the modern traveler. Experience the world in quiet luxury with Sarthak Jets.",
  openGraph: {
    title: "Sarthak Jets — Luxury Private Aviation",
    description: "Private aviation, refined for the modern traveler.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${outfit.variable} ${cormorant.variable}`} suppressHydrationWarning>
      <body className="bg-[#050505] text-white antialiased overflow-x-clip">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
