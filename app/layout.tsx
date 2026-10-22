import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import StickyMobileActions from '@/components/StickyMobileActions';
import FloatingActions from '@/components/FloatingActions';

export const metadata: Metadata = {
  title: 'Vaira Home Care Service | Bedside Nursing & Elder Care Kanchipuram & Vembedu',
  description:
    'Professional, mobile-first home healthcare booking for 24-hour nursing, senior citizen care, patient recovery, and surgical dressing in Kanchipuram, Vembedu, and surrounding districts.',
  keywords: [
    'home nursing Kanchipuram',
    'elderly care Vembedu',
    'patient attender service',
    '24 hour nursing care',
    'surgical dressing home visit',
    'bedridden care Kanchipuram',
  ],
  openGraph: {
    title: 'Vaira Home Care Service | Trusted Home Healthcare',
    description:
      'Verified, compassionate bedside nursing and senior citizen care in Kanchipuram and Vembedu.',
    siteName: 'Vaira Home Care Service',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900 antialiased selection:bg-emerald-100 selection:text-emerald-900">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <StickyMobileActions />
        <FloatingActions />
      </body>
    </html>
  );
}

