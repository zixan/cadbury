import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import { Suspense } from "react";
import { Providers } from "./Providers";

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
      <Providers>
          <Navbar />
          <div className="py-8 max-w-screen-2xl mx-auto">
              <Suspense>
                {children}
              </Suspense>
          </div>
        </Providers>
      </body>
    </html>
  )
}
