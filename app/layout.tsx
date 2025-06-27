import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Bright Orion - MLM Platform",
  description: "Multi-Level Marketing Platform for Bright Orion - Join the network and start earning today!",
  keywords: "MLM, Multi-Level Marketing, Bright Orion, Network Marketing, Earn Money",
  authors: [{ name: "Bright Orion Team" }],
  openGraph: {
    title: "Bright Orion - MLM Platform",
    description: "Join the Bright Orion network and start earning today!",
    type: "website",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Toaster />
      </body>
    </html>
  )
}
