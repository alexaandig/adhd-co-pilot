'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { useDashboard } from './DashboardProvider';
import { Button } from '../ui/button';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { Coffee, Play, RotateCcw } from 'lucide-react';

const breakOptions = [5, 10, 15, 25, 30, 45, 60]; // in minutes

export function BreakDialog() {
  const { isBreakDialogOpen, setBreakDialogOpen } = useDashboard();
  const [selectedDuration, setSelectedDuration] = useState(5); // in minutes
  const [timeLeft, setTimeLeft] = useState(selectedDuration * 60); // in seconds
  const [isActive, setIsActive] = useState(false);

  const totalSeconds = useMemo(() => selectedDuration * 60, [selectedDuration]);

  useEffect(() => {
    if (!isBreakDialogOpen) {
      setIsActive(false);
      setTimeLeft(selectedDuration * 60);
    }
  }, [isBreakDialogOpen, selectedDuration]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      setIsActive(false);
      setBreakDialogOpen(false);
      // Optional: play a sound
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isActive, timeLeft, setBreakDialogOpen]);

  const handleStart = () => {
    setTimeLeft(selectedDuration * 60);
    setIsActive(true);
  };

  const handleReset = () => {
    setIsActive(false);
    setTimeLeft(selectedDuration * 60);
  }

  const percentage = (timeLeft / totalSeconds) * 100;
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <Dialog open={isBreakDialogOpen} onOpenChange={setBreakDialogOpen}>
      <DialogContent
        hideCloseButton={isActive}
        onEscapeKeyDown={(e) => {
          if (isActive) e.preventDefault();
        }}
        onPointerDownOutside={(e) => {
          if (isActive) e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl font-headline">
            <Coffee className="h-6 w-6 text-primary" />
            Time for a Break
          </DialogTitle>
          <DialogDescription>
            Rest is productive. Choose your break duration and relax.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-6 pt-4">
          {!isActive ? (
            <>
              <RadioGroup
                value={String(selectedDuration)}
                onValueChange={(value) => setSelectedDuration(Number(value))}
                className="flex items-center gap-4"
              >
                {breakOptions.map((option) => (
                  <div key={option} className="flex items-center space-x-2">
                    <RadioGroupItem value={String(option)} id={`br-${option}`} />
                    <Label htmlFor={`br-${option}`}>{option} min</Label>
                  </div>
                ))}
              </RadioGroup>
              <Button onClick={handleStart} size="lg">
                <Play className="mr-2 h-4 w-4" /> Start Break
              </Button>
            </>
          ) : (
            <>
              <div className="w-48 h-48">
                <CircularProgressbar
                  value={percentage}
                  text={`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`}
                  styles={buildStyles({
                    textColor: 'hsl(var(--foreground))',
                    pathColor: 'hsl(var(--accent-foreground))',
                    trailColor: 'hsl(var(--muted))',
                  })}
                />
              </div>
              <Button onClick={handleReset} variant="outline">
                <RotateCcw className="mr-2 h-4 w-4" /> Reset Break
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
