import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Live Spotify Play Data Viewer",
  description: "Track Spotify listening activity in real-time with our Next.js application. Get insights into your current music and manage your listening habits effortlessly.",
  keywords: "Spotify, live music data, real-time tracking, Next.js, music activity, Spotify integration",
  openGraph: {
    title: "Live Spotify Play Data Viewer",
    description: "Track your Spotify listening activity in real-time with our Next.js application. Get insights into your current music and manage your listening habits effortlessly.",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Live Spotify Play Data Viewer",
    description: "Track your Spotify listening activity in real-time with our Next.js application. Get insights into your current music and manage your listening habits effortlessly.",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
