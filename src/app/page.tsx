import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, BrainCircuit, Rocket, Zap, SlidersHorizontal, Sparkles, BellRing } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const heroImage = PlaceHolderImages.find((img) => img.id === 'hero-image');

const features = [
  {
    icon: <BrainCircuit className="h-8 w-8 text-primary" />,
    title: 'Effortless Brain Dump',
    description: 'Capture tasks the moment they pop into your head. No structure, no friction, just type and go.',
  },
  {
    icon: <Zap className="h-8 w-8 text-primary" />,
    title: 'Energy-Based Planning',
    description: 'Tell us how your brain feels. We’ll build a plan that matches your capacity for the day.',
  },
  {
    icon: <Rocket className="h-8 w-8 text-primary" />,
    title: 'AI-Powered Scheduling',
    description: 'Our smart AI turns your chaotic list into a focused, step-by-step plan that you can actually follow.',
  },
  {
    icon: <CheckCircle className="h-8 w-8 text-primary" />,
    title: 'Guilt-Free Tracking',
    description: 'Celebrate your wins without the pressure. Reschedule anytime, no judgment.',
  },
];

const coreFeatures = [
    {
      icon: <BrainCircuit className="h-8 w-8 text-primary" />,
      title: 'Brain Dump Interface',
      description: 'Quick capture without overthinking.',
    },
    {
      icon: <SlidersHorizontal className="h-8 w-8 text-primary" />,
      title: 'Energy-Aware Scheduling',
      description: 'Morning person? Night owl? ADHD crashes?',
    },
    {
      icon: <Rocket className="h-8 w-8 text-primary" />,
      title: 'Task Breaking',
      description: 'Auto-splits overwhelming tasks into 5-15 min chunks.',
    },
    {
      icon: <Sparkles className="h-8 w-8 text-primary" />,
      title: 'Dopamine Micro-Wins',
      description: 'Celebrates small completions.',
    },
     {
      icon: <BellRing className="h-8 w-8 text-primary" />,
      title: 'Gentle Reminders',
      description: 'Not nagging, understanding tone.',
    },
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <BrainCircuit className="h-8 w-8 text-primary" />
            <span className="font-bold text-xl font-headline">ADHD Co-Pilot</span>
          </div>
          <Button asChild>
            <Link href="/dashboard">Get Started</Link>
          </Button>
        </div>
      </header>

      <main className="flex-grow">
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 text-center">
          <h1 className="text-4xl md:text-6xl font-bold font-headline tracking-tight mb-4">
            Finally, a planner that gets your ADHD brain.
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Stop fighting with tools built for neurotypical brains. ADHD Co-Pilot helps you work with your natural energy and focus, not against it.
          </p>
          <Button size="lg" asChild>
            <Link href="/dashboard">Start Your First Focused Day &rarr;</Link>
          </Button>
        </section>

        {heroImage && (
          <section className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative aspect-[3/2] w-full max-w-5xl mx-auto rounded-lg overflow-hidden shadow-2xl">
              <Image
                src={heroImage.imageUrl}
                alt={heroImage.description}
                fill
                priority
                className="object-cover"
                data-ai-hint={heroImage.imageHint}
              />
            </div>
          </section>
        )}
        
        <section id="core-features" className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 text-center">
          <h2 className="text-3xl md:text-4xl font-bold font-headline mb-12">Core Features</h2>
          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-8">
            {coreFeatures.map((feature) => (
               <div key={feature.title} className="flex flex-col items-center">
                  <div className="mx-auto bg-accent rounded-full p-3 w-fit mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="font-headline text-lg font-semibold">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </div>
            ))}
          </div>
        </section>

        <section id="features" className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => (
              <Card key={feature.title} className="text-center">
                <CardHeader>
                  <div className="mx-auto bg-accent rounded-full p-3 w-fit mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle className="font-headline">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>

      <footer className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} ADHD Co-Pilot. Designed for brains like ours.</p>
      </footer>
    </div>
  );
}
