'use client';

import { useState, useEffect, useRef } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { Button } from '../ui/button';
import { Play, Pause, RotateCcw, Coffee, Brain, XSquare } from 'lucide-react';
import { useDashboard } from './DashboardProvider';
import { cn } from '@/lib/utils';

const FOCUS_TIME = 25 * 60;
const BREAK_TIME = 5 * 60;

export type TimerMode = 'focus' | 'break';

export type TimerState = {
  isActive: boolean;
  mode: TimerMode;
};

export function PomodoroTimer({
  onComplete,
  onStateChange,
  onEndSession,
  timerCommand,
  onCommandConsumed,
}: {
  onComplete: () => void;
  onStateChange: (state: TimerState) => void;
  onEndSession: () => void;
  timerCommand: 'startBreak' | null;
  onCommandConsumed: () => void;
}) {
  const [mode, setMode] = useState<TimerMode>('focus');
  const [isActive, setIsActive] = useState(false);

  const [focusTimeLeft, setFocusTimeLeft] = useState(FOCUS_TIME);
  const [breakTimeLeft, setBreakTimeLeft] = useState(BREAK_TIME);

  const { triggerConfetti, showTimerCompletion } = useDashboard();
  const alarmSoundRef = useRef<HTMLAudioElement | null>(null);

  const secondsLeft = mode === 'focus' ? focusTimeLeft : breakTimeLeft;
  const setSecondsLeft = mode === 'focus' ? setFocusTimeLeft : setBreakTimeLeft;

  useEffect(() => {
    if (timerCommand === 'startBreak') {
        if (mode !== 'break') {
            setMode('break');
            setIsActive(true);
            setBreakTimeLeft(BREAK_TIME);
        }
        onCommandConsumed();
    }
  }, [timerCommand, onCommandConsumed, mode]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // alarmSoundRef.current = new Audio('/alarm.mp3');
    }
  }, []);

  useEffect(() => {
    onStateChange({ isActive, mode });
  }, [isActive, mode, onStateChange]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((seconds) => seconds - 1);
      }, 1000);
    } else if (isActive && secondsLeft === 0) {
      setIsActive(false);
      // alarmSoundRef.current?.play();

      if (mode === 'focus') {
        onComplete();
        triggerConfetti('rain');
        showTimerCompletion('focus');
      } else {
        showTimerCompletion('break');
      }
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isActive, secondsLeft, mode, onComplete, triggerConfetti, setSecondsLeft, showTimerCompletion]);

  const handleModeClick = (newMode: TimerMode) => {
    if (newMode === 'focus') {
      if (mode === 'focus') {
        setIsActive(!isActive);
      } else {
        setMode('focus');
        setIsActive(false);
      }
    } else { // newMode === 'break'
      if (mode === 'break') {
        return;
      }
      setMode('break');
      setIsActive(true);
    }
  };

  const startTimer = (startMode: TimerMode) => {
    setMode(startMode);
    setIsActive(true);
    if (startMode === 'focus') {
      setBreakTimeLeft(BREAK_TIME);
    } else {
      setFocusTimeLeft(FOCUS_TIME);
    }
  };

  const endBreak = () => {
    if (mode === 'break') {
      setMode('focus');
      setIsActive(false);
      setBreakTimeLeft(BREAK_TIME);
    }
  };

  const reset = () => {
    setIsActive(false);
    if (mode === 'focus') {
      setFocusTimeLeft(FOCUS_TIME);
    } else {
      setBreakTimeLeft(BREAK_TIME);
    }
  };

  const handleEnd = () => {
    setIsActive(false);
    setFocusTimeLeft(FOCUS_TIME);
    setBreakTimeLeft(BREAK_TIME);
    onEndSession();
  };

  const totalSeconds = mode === 'focus' ? FOCUS_TIME : BREAK_TIME;
  const percentage = (secondsLeft / totalSeconds) * 100;

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="w-48 h-48">
        <CircularProgressbar
          value={percentage}
          text={`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`}
          styles={buildStyles({
            textColor: 'hsl(var(--foreground))',
            pathColor: mode === 'focus' ? 'hsl(var(--primary))' : 'hsl(var(--accent-foreground))',
            trailColor: 'hsl(var(--muted))',
          })}
        />
      </div>
      <div className="flex items-center gap-4">
        <Button
          onClick={() => handleModeClick('focus')}
          variant={mode === 'focus' ? 'secondary' : 'ghost'}
          className={cn(
            'w-32',
            isActive && mode === 'focus' && 'bg-green-600 text-white hover:bg-green-700'
          )}
        >
          {isActive && mode === 'focus' ? <Pause className="mr-2 h-4 w-4" /> : <Brain className="mr-2 h-4 w-4" />}
          Focus
        </Button>
        <Button
          onClick={() => handleModeClick('break')}
          variant={mode === 'break' ? 'secondary' : 'ghost'}
          className={cn(
            'w-32',
            isActive && mode === 'break' && 'bg-green-600 text-white hover:bg-green-700'
          )}
          disabled={isActive && mode === 'break'}
        >
          <Coffee className="mr-2 h-4 w-4" />
          Break
        </Button>
      </div>
      <div className="flex items-center gap-4 pt-4">
        {mode === 'break' && (
          <Button onClick={endBreak} variant="outline" size="sm">
            <XSquare className="h-4 w-4 mr-2" />
            End Break
          </Button>
        )}
        {mode === 'focus' && (
          <>
            <Button onClick={reset} variant="outline" size="sm">
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset Timer
            </Button>
            <Button onClick={handleEnd} variant="destructive" size="sm">
              <XSquare className="h-4 w-4 mr-2" />
              End Session
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
