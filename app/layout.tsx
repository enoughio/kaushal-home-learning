
import type { Metadata } from "next";
import { Urbanist, Syne,Gothic_A1 } from "next/font/google";
import "./globals.css";
// NavBar was previously imported but is unused in RootLayout. Keep import removed to satisfy lint.
import Fotter from "@/components/Fotter";


// Configure Google Fonts
const urbanist = Urbanist({
  subsets: ["latin"],
  variable: "--urbanist",
  display: "swap",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const gothicA1 = Gothic_A1({
  subsets: ["latin"],
  variable: "--gothic",
  display: "swap",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"], // Gothic A1 requires weight specification
});

const syne = Syne({
  subsets: ["latin"],
  variable: "--syne",
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Kaushalya Home Learning",
  description: "Nurture Skills, Build Future",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${urbanist.variable} ${gothicA1.variable}  ${syne.variable} antialiased`}
      >
        {/* <NavBar /> */}
        {children}
        <Fotter />
      </body>
    </html>
  );
}
