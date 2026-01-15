'use client';

import { useDashboard } from './DashboardProvider';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Rocket, Sparkles } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';

const energyEmojis = ['😩', '😫', '😟', '😕', '😐', '🙂', '😊', '😁', '🤩', '🚀'];

export function TaskInputForm() {
  const {
    tasks,
    setTasks,
    energyLevel,
    setEnergyLevel,
    availableTime,
    setAvailableTime,
    generateSchedule,
    isLoading,
  } = useDashboard();
  
  const { handleSubmit } = useForm();

  const onSubmit = () => {
    generateSchedule();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">1. Brain Dump</CardTitle>
          <CardDescription>What's rattling around in your brain? Get it all out here.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Textarea
            value={tasks}
            onChange={(e) => setTasks(e.target.value)}
            placeholder="e.g., write proposal, email Sarah, grocery shopping, fix website bug..."
            rows={5}
            className="text-base"
          />
          <div className="space-y-3">
            <Label htmlFor="energy" className="font-bold">How's your brain today?</Label>
            <div className="flex items-center gap-4">
              <Slider
                id="energy"
                min={1}
                max={10}
                step={1}
                value={[energyLevel]}
                onValueChange={(value) => setEnergyLevel(value[0])}
                disabled={isLoading}
              />
              <span className="text-3xl w-10 text-center">{energyEmojis[energyLevel - 1]}</span>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="time" className="font-bold">How much time do you have?</Label>
            <Input
              id="time"
              value={availableTime}
              onChange={(e) => setAvailableTime(e.target.value)}
              placeholder='e.g., "3 hours" or "full day"'
              disabled={isLoading}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
            {isLoading ? (
              <>
                <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                Brewing your focus plan...
              </>
            ) : (
              <>
                <Rocket className="mr-2 h-4 w-4" />
                Generate My Schedule
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
