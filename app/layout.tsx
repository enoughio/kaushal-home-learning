import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Kaushaly Home Learning',
  description: 'Kaushaly Home Learning - Empowering students with quality online education and resources.',
  keywords: [
    'Kaushaly',
    'Home Learning',
    'Online Education',
    'E-learning',
    'Courses',
    'Study',
    'Students',
    'Learning Platform'
  ],
  openGraph: {
    title: 'Kaushaly Home Learning',
    description: 'Empowering students with quality online education and resources.',
    url: 'https://kaushaly.in',
    siteName: 'Kaushaly Home Learning',
    images: [
      {
        url: '/placeholder-logo.png',
        width: 800,
        height: 600,
        alt: 'Kaushaly Home Learning Logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kaushaly Home Learning',
    description: 'Empowering students with quality online education and resources.',
    images: ['/placeholder-logo.png'],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
