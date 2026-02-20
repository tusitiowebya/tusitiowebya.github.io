import type { Metadata } from 'next'
import { DM_Serif_Display, Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const dmSerif = DM_Serif_Display({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-serif',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
})

export const metadata: Metadata = {
  title: 'Hosteria Nirvana | Villa Gesell',
  description:
    'Hosteria en Villa Gesell, zona sur. A 150m de la playa del muelle de los pescadores. Descanso, naturaleza y confort junto al mar.',
  keywords: ['hosteria', 'villa gesell', 'alojamiento', 'playa', 'muelle pescadores', 'descanso'],
  openGraph: {
    title: 'Hosteria Nirvana | Villa Gesell',
    description:
      'Hosteria en Villa Gesell, zona sur. A 150m de la playa del muelle de los pescadores.',
    type: 'website',
    locale: 'es_AR',
    icon: {
    icon: "/favicon.png",
  },
  },
}

export const viewport = {
  themeColor: '#5C4033',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={`${dmSerif.variable} ${inter.variable}`}>
      <body className="font-sans antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
