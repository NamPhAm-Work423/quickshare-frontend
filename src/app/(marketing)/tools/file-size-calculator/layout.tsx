import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'File Size Calculator - Convert Bytes, KB, MB, GB | Free Tool',
  description: 'Free online file size calculator. Convert between bytes, kilobytes, megabytes, gigabytes, and terabytes. Calculate storage requirements and transfer times.',
  keywords: [
    'file size calculator',
    'bytes to mb converter',
    'file size converter',
    'storage calculator',
    'mb to gb converter',
    'file size tool',
    'bytes converter',
    'storage size calculator'
  ],
  openGraph: {
    title: 'File Size Calculator - Convert Bytes, KB, MB, GB',
    description: 'Free online tool to calculate and convert file sizes between different units. Perfect for storage planning and transfer estimates.',
    type: 'website',
    url: '/tools/file-size-calculator',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'File Size Calculator - Convert Bytes, KB, MB, GB',
    description: 'Free online tool to calculate and convert file sizes between different units. Perfect for storage planning and transfer estimates.',
  },
  alternates: {
    canonical: '/tools/file-size-calculator',
  },
};

export default function FileSizeCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}