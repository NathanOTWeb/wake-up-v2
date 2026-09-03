import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "WAKE UP — From unconscious living to disciplined, Christ-centered leadership",
  description: "Heal the Boy. Build the Man. Awaken the Lion. Qrown the King.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Inter:wght@300;400;500;600&family=Merriweather:wght@300;400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={inter.variable} style={{ margin: 0, padding: 0 }}>
        {children}
      </body>
    </html>
  );
}