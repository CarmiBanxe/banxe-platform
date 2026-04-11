import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'BANXE AI Bank',
  description: 'FCA-authorised EMI — Personal & Business Banking',
  robots: { index: false, follow: false },  // banking app — no indexing
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
      </head>
      <body className="min-h-screen bg-bg antialiased">
        {children}
      </body>
    </html>
  )
}
