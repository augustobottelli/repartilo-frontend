import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Repartilo - Optimizador de Rutas de Entrega",
  description: "Optimiza tus rutas de entrega en segundos. Ahorra tiempo, combustible y dinero con planificación inteligente.",
  keywords: ["optimización de rutas", "planificación de entregas", "logística", "gestión de flotas", "rutas de reparto", "delivery"],
  authors: [{ name: "Repartilo" }],
  creator: "Repartilo",
  publisher: "Repartilo",
  metadataBase: new URL("https://www.repartilo.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Repartilo - Optimizador de Rutas de Entrega",
    description: "Optimiza tus rutas de entrega en segundos. Ahorra tiempo, combustible y dinero con planificación inteligente.",
    url: "https://www.repartilo.com",
    siteName: "Repartilo",
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Repartilo - Optimizador de Rutas de Entrega",
    description: "Optimiza tus rutas de entrega en segundos. Ahorra tiempo, combustible y dinero con planificación inteligente.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="es">
        <head>
          <link
            rel="stylesheet"
            href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
            integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
            crossOrigin=""
          />
        </head>
        <body className={inter.className}>
          {children}
          <Toaster position="top-right" richColors />
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  );
}
