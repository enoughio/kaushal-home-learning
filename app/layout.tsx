
import type { Metadata } from "next";
import { Urbanist, Syne,Gothic_A1 } from "next/font/google";
import "./globals.css";
import NavBar from '@/components/NavBar';


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
  title: "Kaushalay Home Learning",
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
        <NavBar />
        {children}
      </body>
    </html>
  );
}
