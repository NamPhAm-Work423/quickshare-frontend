import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Checksum Generator - MD5, SHA1, SHA256 Hash Calculator | Free Tool',
  description: 'Generate checksums and hash values for files and text. Support for MD5, SHA1, SHA256, and SHA512. Verify file integrity and detect changes.',
  keywords: [
    'checksum generator',
    'hash calculator',
    'md5 generator',
    'sha256 calculator',
    'file integrity checker',
    'hash function tool',
    'cryptographic hash',
    'file verification tool'
  ],
  openGraph: {
    title: 'Checksum Generator - MD5, SHA1, SHA256 Hash Calculator',
    description: 'Free online tool to generate checksums and hash values. Verify file integrity with MD5, SHA1, SHA256, and SHA512 algorithms.',
    type: 'website',
    url: '/tools/checksum-generator',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Checksum Generator - MD5, SHA1, SHA256 Hash Calculator',
    description: 'Free online tool to generate checksums and hash values. Verify file integrity with MD5, SHA1, SHA256, and SHA512 algorithms.',
  },
  alternates: {
    canonical: '/tools/checksum-generator',
  },
};

export default function ChecksumGeneratorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}