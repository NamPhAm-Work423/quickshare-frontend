import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'QR Code Generator - Create QR Codes for URLs, Text, WiFi | Free Tool',
  description: 'Generate QR codes instantly for URLs, text, WiFi passwords, and more. Free online QR code generator with customizable options and high-quality output.',
  keywords: [
    'qr code generator',
    'qr code maker',
    'create qr code',
    'qr code creator',
    'url to qr code',
    'wifi qr code',
    'text to qr code',
    'free qr generator'
  ],
  openGraph: {
    title: 'QR Code Generator - Create QR Codes for URLs, Text, WiFi',
    description: 'Free online QR code generator. Create QR codes for URLs, text, WiFi passwords, and more with instant preview and download.',
    type: 'website',
    url: '/tools/qr-code-generator',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'QR Code Generator - Create QR Codes for URLs, Text, WiFi',
    description: 'Free online QR code generator. Create QR codes for URLs, text, WiFi passwords, and more with instant preview and download.',
  },
  alternates: {
    canonical: '/tools/qr-code-generator',
  },
};

export default function QRCodeGeneratorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}