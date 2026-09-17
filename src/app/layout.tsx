import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SHANTI NEURO CLINIC - Hospital Management & Recommendation System',
  description: 'Official clinical recommendation documentation and management system for Shanti Neuro Clinic.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900 antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
