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
import { useForm } from 'react-hook-form';
import { enhanceBrainDumpAction } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const energyEmojis = [
  '😩<br/>Exhausted', 
  '😫<br/>Confounded', 
  '😟<br/>Worried', 
  '😕<br/>Confused', 
  '😐<br/>Neutral', 
  '🙂<br/>Slightly Happy', 
  '😊<br/>Happy', 
  '😁<br/>Beaming', 
  '🤩<br/>Excited', 
  '🚀<br/>Energetic'
];

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
  const { toast } = useToast();
  const [isEnhancing, setIsEnhancing] = useState(false);

  const onSubmit = () => {
    generateSchedule();
  };

  const handleEnhance = async () => {
    if (!tasks.trim() || isEnhancing) return;

    setIsEnhancing(true);
    try {
      const result = await enhanceBrainDumpAction({ rawTasks: tasks });
      if (result.success && result.data) {
        setTasks(result.data.enhancedTasks);
        toast({
          title: 'Brain Dump Enhanced!',
          description: 'Your tasks have been clarified and organized.',
        });
      } else {
        throw new Error(result.error || 'Failed to enhance tasks.');
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'AI Hiccup',
        description: 'The AI failed to enhance your brain dump.',
      });
    } finally {
      setIsEnhancing(false);
    }
  };


  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">1. Brain Dump</CardTitle>
          <CardDescription>What's rattling around in your brain? Get it all out here.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="relative">
             <Textarea
              value={tasks}
              onChange={(e) => setTasks(e.target.value)}
              placeholder="e.g., write proposal, email Sarah, grocery shopping, fix website bug..."
              rows={5}
              className="text-base pr-12"
              disabled={isLoading || isEnhancing}
            />
             <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={handleEnhance}
                    disabled={isLoading || isEnhancing || !tasks.trim()}
                    className={cn(
                      "absolute bottom-2 right-2 h-8 w-8 text-muted-foreground hover:text-primary",
                      isEnhancing && "animate-spin"
                    )}
                  >
                    <Sparkles className="h-5 w-5" />
                    <span className="sr-only">Enhance with AI</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Enhance Brain Dump with AI</p>
                </TooltipContent>
              </Tooltip>
          </div>
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
              <span className="text-xl text-center">{energyEmojis[energyLevel - 1]}</span>
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
          <Button type="submit" className="w-full" size="lg" disabled={isLoading || isEnhancing}>
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
