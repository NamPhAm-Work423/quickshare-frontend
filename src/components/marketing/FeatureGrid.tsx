import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  FileText, 
  Shield, 
  Zap, 
  Calculator, 
  QrCode, 
  Hash,
  ArrowRight 
} from 'lucide-react';

const FeatureGrid = () => {
  const useCases = [
    {
      icon: FileText,
      title: 'Send Files Without Login',
      description: 'Share any file instantly without creating accounts or signing up.',
      href: '/use-cases/send-files-without-login',
      color: 'text-blue-600'
    },
    {
      icon: Zap,
      title: 'P2P File Transfer',
      description: 'Direct peer-to-peer transfer for maximum speed and privacy.',
      href: '/use-cases/p2p-file-transfer',
      color: 'text-yellow-600'
    },
    {
      icon: Shield,
      title: 'Secure File Sharing',
      description: 'End-to-end encrypted transfers with no server storage.',
      href: '/use-cases/secure-file-sharing',
      color: 'text-green-600'
    }
  ];

  const tools = [
    {
      icon: Calculator,
      title: 'File Size Calculator',
      description: 'Calculate and convert file sizes between different units.',
      href: '/tools/file-size-calculator',
      color: 'text-purple-600'
    },
    {
      icon: Hash,
      title: 'Checksum Generator',
      description: 'Generate MD5, SHA1, and SHA256 checksums for file verification.',
      href: '/tools/checksum-generator',
      color: 'text-red-600'
    },
    {
      icon: QrCode,
      title: 'QR Code Generator',
      description: 'Create QR codes for easy sharing of links and text.',
      href: '/tools/qr-code-generator',
      color: 'text-indigo-600'
    }
  ];

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Use Cases Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Perfect for Every Use Case
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Whether you need to share documents, photos, or any other files, 
              QuickShare makes it simple and secure.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {useCases.map((useCase) => {
              const Icon = useCase.icon;
              return (
                <Card key={useCase.href} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-lg bg-background flex items-center justify-center mb-4`}>
                      <Icon className={`w-6 h-6 ${useCase.color}`} />
                    </div>
                    <CardTitle className="text-xl">{useCase.title}</CardTitle>
                    <CardDescription>{useCase.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link href={useCase.href}>
                      <Button variant="outline" className="w-full group">
                        Learn More
                        <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="text-center">
            <Link href="/app">
              <Button size="lg">
                Try QuickShare Now
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Tools Section */}
        <div>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Helpful File Tools
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Free utilities to help you work with files more effectively.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {tools.map((tool) => {
              const Icon = tool.icon;
              return (
                <Card key={tool.href} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-lg bg-background flex items-center justify-center mb-4`}>
                      <Icon className={`w-6 h-6 ${tool.color}`} />
                    </div>
                    <CardTitle className="text-xl">{tool.title}</CardTitle>
                    <CardDescription>{tool.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link href={tool.href}>
                      <Button variant="outline" className="w-full group">
                        Use Tool
                        <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureGrid;