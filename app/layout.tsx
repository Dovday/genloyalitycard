import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Digital Loyalty Card Wallet',
  description: 'Your digital wallet for managing all your loyalty cards in one place. Save space, earn rewards, and never miss out on points with our smart digital card management system.',
  keywords: 'digital wallet, loyalty cards, rewards program, card management, digital cards, points tracking',
  authors: [{ name: 'Digital Card Wallet Team' }],
  openGraph: {
    title: 'Digital Loyalty Card Wallet',
    description: 'Manage all your loyalty cards in one digital wallet. Save space and never miss rewards.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Digital Loyalty Card Wallet',
    description: 'Manage all your loyalty cards in one digital wallet. Save space and never miss rewards.',
  },
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
