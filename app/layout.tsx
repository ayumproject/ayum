import './globals.css';
import type { Metadata } from 'next';
import ConditionalLayout from '@/components/layout/ConditionalLayout';

export const metadata: Metadata = {
  title: {
    default: 'Ulusmeydani — Guncel Haberler',
    template: '%s | Ulusmeydani',
  },
  description: 'Guncel haberler, son dakika gelismeleri ve dogru haber kaynagi.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col bg-[#F5F8FF] font-sans antialiased">
        <ConditionalLayout>{children}</ConditionalLayout>
      </body>
    </html>
  );
}
