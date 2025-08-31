import type React from "react"
import type { Metadata } from "next"
import { Playfair_Display, Source_Sans_3 } from "next/font/google"
import { AuthProvider } from "@/contexts/auth-context"
import { PaymentProvider } from "@/contexts/payment-context"
import { Providers } from "./providers"
import "./globals.css"
import { ConnectMenu } from "@/components/connect-menu"

const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair",
  weight: ["400", "600", "700"],
})

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-source-sans",
  weight: ["400", "500", "600"],
})

// Client-only providers moved to app/providers

export const metadata: Metadata = {
  title: "Shoutout - Social Tipping App",
  description: "Send personalized shoutouts with crypto tips to celebrate achievements and spread positivity",
  openGraph: {
    title: "Shoutout - Social Tipping App",
    description: "Send personalized shoutouts with crypto tips to celebrate achievements and spread positivity",
    images: ["https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/app-icon-1024-7qjTfFPxSXtMV4kkMcv8ODV7eoCteP.png"],
  },
  other: {
    "fc:frame": "vNext",
    "fc:frame:image": "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/app-icon-1024-7qjTfFPxSXtMV4kkMcv8ODV7eoCteP.png",
    "fc:frame:button:1": "Open Shoutout",
    "fc:frame:post_url": "https://shoutout-mini-app.vercel.app/",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${sourceSans.variable} antialiased`}>
      <body className="font-sans">
          <Providers>
            <AuthProvider>
              <ConnectMenu />
              <PaymentProvider>{children}</PaymentProvider>
            </AuthProvider>
          </Providers>
      </body>
    </html>
  )
}
