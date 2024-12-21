import "@/css/globals.css";
import { Toaster } from "@/components/ui/sonner";
import type { Metadata } from "next";
import { Navbar } from "./components/Navbar";
import ThemeProvider from "./components/theme-provider";
import { Redux } from "@/redux/Redux";

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body>
        <Redux>
          <ThemeProvider>
            <Navbar />
            {children}
            <Toaster />
          </ThemeProvider>
        </Redux>
      </body>
    </html>
  );
}


export const metadata: Metadata = {
  title: "Code Styler - Online HTML & CSS Code Editor",
  description: "Code Styler is an online HTML & CSS editor for web developers. Write, edit, and preview code in real-time with a user-friendly interface. Perfect for creating stunning, responsive web designs easily!",
  keywords: ["Code Styler", "HTML editor", "CSS editor", "online code editor", "web development tools", "live code preview", "web design editor", "HTML and CSS styling", "responsive web design", "code playground"],
  authors: { name: "Moinak Majumdar", url: 'https://moinak05.vercel.app' },
  creator: "Mooinak Majumdar",
  publisher: "vercel",
  metadataBase: new URL('https://codestyler.vercel.app'),
  openGraph: {
    type: 'website',
    title: 'Code Styler - Online HTML & CSS Code Editor',
    description: "Code Styler is an online HTML & CSS editor for web developers. Write, edit, and preview code in real-time with a user-friendly interface. Perfect for creating stunning, responsive web designs easily!",
    images: '/web-app-manifest-512x512.png',
    url: 'https://codestyler.vercel.app',
  },
};
