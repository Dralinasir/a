
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "UOS Helpdesk Assistant",
    template: "%s | UOS Helpdesk",
  },
  description:
    "University of Sargodha student helpdesk portal for academic services, admissions, fee guidance, announcements and student support.",
  applicationName: "UOS Helpdesk Assistant",
  keywords: [
    "UOS",
    "University of Sargodha",
    "student helpdesk",
    "admissions",
    "student services",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  );
}
