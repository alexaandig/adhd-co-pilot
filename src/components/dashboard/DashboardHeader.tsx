'use client';

import { BrainCircuit } from 'lucide-react';

export function DashboardHeader() {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <header className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold font-headline">{getGreeting()}!</h1>
        <p className="text-muted-foreground">Ready to focus? Let's plan your day.</p>
      </div>
      <div className="flex items-center gap-2">
        <BrainCircuit className="h-6 w-6 text-primary" />
        <span className="font-bold text-lg font-headline hidden sm:inline">ADHD Co-Pilot</span>
      </div>
    </header>
  );
}
