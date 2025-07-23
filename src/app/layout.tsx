import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import { ReactNode } from 'react'

const inter = Inter({ subsets: ['latin'] })



const APP_NAME = "TGTS Africa M&E";
const APP_DEFAULT_TITLE = "TGTS Africa M&E";
const APP_TITLE_TEMPLATE = "%s -  TGTS Africa M&E";
const APP_DESCRIPTION = "Monitoring & Evaluation platform for ECG transformers by TGTS Africa, powered by ArcGIS and PWA technologies";

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_DEFAULT_TITLE,
    // startUpImage: [],
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: APP_NAME,
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
  twitter: {
    card: "summary",
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
};

//export const metadata: Metadata = {
//  title: 'ECG Transformer Monitoring System',
//  description: 'Professional M&E application for ECG transformer monitoring that integrates with ArcGIS data',
//}
export const viewport: Viewport = {
  themeColor: "#FFFFFF",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}