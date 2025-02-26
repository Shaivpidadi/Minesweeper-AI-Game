import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Stake Mining',
  description: 'Stake Mining Game'
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
