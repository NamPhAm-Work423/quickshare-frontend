import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Shield, Zap, Users, Globe } from 'lucide-react';

export default function HowItWorksPage() {
  const steps = [
    {
      step: 1,
      title: 'Upload Your File',
      description: 'Select a file or enter text on our secure platform. No account required.',
      icon: Zap,
    },
    {
      step: 2,
      title: 'Get Your Code',
      description: 'Receive a unique 6-digit code that expires in 24 hours for security.',
      icon: Shield,
    },
    {
      step: 3,
      title: 'Share the Code',
      description: 'Send the code to your recipient via any communication method.',
      icon: Users,
    },
    {
      step: 4,
      title: 'Direct P2P Transfer',
      description: 'Files transfer directly between browsers using WebRTC technology.',
      icon: Globe,
    },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            How QuickShare Works
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Secure, fast, and private file sharing using peer-to-peer technology. 
            No servers store your files.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <Card key={step.step} className="relative">
                <CardHeader>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-lg">
                      {step.step}
                    </div>
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{step.title}</CardTitle>
                  <CardDescription className="text-base">
                    {step.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>

        {/* Security Features */}
        <div className="bg-muted/30 rounded-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">
            Why QuickShare is Secure
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <Shield className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">No Server Storage</h3>
              <p className="text-sm text-muted-foreground">
                Files transfer directly between devices. Our servers never store your data.
              </p>
            </div>
            <div className="text-center">
              <Zap className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">End-to-End Encrypted</h3>
              <p className="text-sm text-muted-foreground">
                All transfers use WebRTC encryption. Only you and the recipient can access the files.
              </p>
            </div>
            <div className="text-center">
              <Globe className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Temporary Codes</h3>
              <p className="text-sm text-muted-foreground">
                Codes expire in 24 hours and can only be used once for maximum security.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Share Files Securely?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Start sharing files instantly without creating an account.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/app">
              <Button size="lg" className="text-lg px-8">
                Start Sharing
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/use-cases/send-files-without-login">
              <Button variant="outline" size="lg" className="text-lg px-8">
                View Use Cases
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}