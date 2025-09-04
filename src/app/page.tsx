import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold font-headline text-primary">AspireRural</h1>
        <nav className="space-x-2">
          <Button variant="ghost" asChild>
            <Link href="/login">Login</Link>
          </Button>
          <Button asChild>
            <Link href="/signup">Sign Up</Link>
          </Button>
        </nav>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center text-center p-6">
        <section className="max-w-4xl">
          <h2 className="text-5xl md:text-6xl font-headline font-bold">
            Empowering Rural Students for a Brighter Future
          </h2>
          <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            AspireRural provides personalized career guidance, learning resources, and opportunities to help students in rural areas achieve their dreams.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="/signup">
                Get Started for Free
                <ArrowRight className="ml-2" />
              </Link>
            </Button>
          </div>
        </section>
      </main>
      <footer className="p-4 text-center text-muted-foreground text-sm">
        © {new Date().getFullYear()} AspireRural. All rights reserved.
      </footer>
    </div>
  );
}
