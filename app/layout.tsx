import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Zebra Kitchens & Interiors - Dream Kitchens Without the Nightmares',
  description: 'Transparent design, supply and installation — personally overseen by our founder. No pushy sales, no hidden extras, just a kitchen you will love for decades.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}