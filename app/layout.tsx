import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SENIOR STUCK - Proven Online Business Strategies for 55+",
  description: "Weekly, no-fluff guidance from Dr. Mark Johnson to build online income. Get unstuck with proven strategies tailored for seniors.",
  keywords: "senior entrepreneurs, online business, 55+, work from home, online income, Dr. Mark Johnson",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className="antialiased"
      >
        {children}
      </body>
    </html>
  );
}
