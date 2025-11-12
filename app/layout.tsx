export const metadata = {
  title: 'Pixelized — Login',
  description: 'Pixelized: connexion via base utilisateurs MODX',
  openGraph: {
    title: 'Pixelized — Login',
    description: 'Connexion via base utilisateurs MODX',
    url: 'https://pixelized.example',
    siteName: 'Pixelized',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'Pixelized' }],
    locale: 'fr_CH', type: 'website'
  },
  twitter: { card: 'summary_large_image', title: 'Pixelized — Login', description: 'Connexion via base utilisateurs MODX', images: ['/og.png'] }
}
import './globals.css'
import type { ReactNode } from 'react'
export default function RootLayout({ children }: { children: ReactNode }) {
  return (<html lang='fr'><head>
    <link rel='stylesheet' href='https://cdn.jsdelivr.net/npm/foundation-sites@6.8.1/dist/css/foundation.min.css' />
    <link rel='stylesheet' href='https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css' />
  </head><body>{children}</body></html>)
}