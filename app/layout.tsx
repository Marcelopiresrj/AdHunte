import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, DM_Sans, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { ToastProvider } from '@/components/ToastProvider';

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['600', '700'],
  variable: '--font-display',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-sans',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'AdHunter — Inteligência e Mineração de Anúncios',
  description:
    'Plataforma SaaS de inteligência competitiva, espionagem e mineração de anúncios comerciais validados no Meta Ads Brasil com Comparador de Nichos, Raio-X de Funil e Modelador de Copy com IA.',
  openGraph: {
    title: 'AdHunter — Inteligência e Mineração de Anúncios',
    description:
      'Plataforma SaaS de inteligência competitiva, espionagem e mineração de anúncios comerciais validados no Meta Ads Brasil com Comparador de Nichos, Raio-X de Funil e Modelador de Copy com IA.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AdHunter — Inteligência e Mineração de Anúncios',
    description:
      'Plataforma SaaS de inteligência competitiva, espionagem e mineração de anúncios comerciais validados no Meta Ads Brasil com Comparador de Nichos, Raio-X de Funil e Modelador de Copy com IA.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="pt-BR"
      className={`${plusJakarta.variable} ${dmSans.variable} ${jetbrainsMono.variable} dark`}
    >
      <body
        suppressHydrationWarning
        className="bg-[#090D16] text-slate-50 antialiased selection:bg-purple-500/30 selection:text-purple-200"
      >
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
