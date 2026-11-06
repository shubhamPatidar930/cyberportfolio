import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Anton, Caveat_Brush, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geist = Geist({ variable: "--font-geist", subsets: ["latin"] });
const mono = Geist_Mono({ variable: "--font-mono", subsets: ["latin"] });
const anton = Anton({ variable: "--font-anton", weight: "400", subsets: ["latin"] });
const brush = Caveat_Brush({ variable: "--font-brush", weight: "400", subsets: ["latin"] });

export const metadata: Metadata = { title: "Shubham Patidar | Cybersecurity", description: "Cybersecurity and GRC portfolio" };

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return <html lang="en" suppressHydrationWarning><head><script dangerouslySetInnerHTML={{ __html: `document.documentElement.classList.add('build-mode')` }} /></head><body className={`${geist.variable} ${mono.variable} ${anton.variable} ${brush.variable}`}>{children}</body></html>;
}
