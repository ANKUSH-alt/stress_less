'use client';

import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const FocusTimer = () => {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'Work' | 'Break'>('Work');

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive) {
      interval = setInterval(() => {
        if (seconds > 0) {
          setSeconds(seconds - 1);
        } else if (minutes > 0) {
          setMinutes(minutes - 1);
          setSeconds(59);
        } else {
          setIsActive(false);
          // Auto switch mode
          if (mode === 'Work') {
            setMode('Break');
            setMinutes(5);
          } else {
            setMode('Work');
            setMinutes(25);
          }
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, minutes, seconds, mode]);

  const reset = () => {
    setIsActive(false);
    setMinutes(mode === 'Work' ? 25 : 5);
    setSeconds(0);
  };

  return (
    <div className="glass p-8 rounded-[2rem] border border-primary/10 flex flex-col items-center">
      <div className="flex gap-2 mb-6 p-1 bg-muted/30 rounded-xl">
        <button 
          onClick={() => { setMode('Work'); setMinutes(25); setSeconds(0); }}
          className={cn("px-4 py-1.5 rounded-lg text-xs font-bold transition-all", mode === 'Work' ? "bg-primary text-primary-foreground" : "text-muted-foreground")}
        >
          Deep Focus
        </button>
        <button 
          onClick={() => { setMode('Break'); setMinutes(5); setSeconds(0); }}
          className={cn("px-4 py-1.5 rounded-lg text-xs font-bold transition-all", mode === 'Break' ? "bg-calm-cyan text-primary-foreground" : "text-muted-foreground")}
        >
          Short Break
        </button>
      </div>

      <div className="relative mb-8">
        <h2 className="text-6xl font-bold font-mono tracking-tighter">
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </h2>
      </div>

      <div className="flex gap-3">
        <Button size="icon" className="w-12 h-12 rounded-xl" onClick={() => setIsActive(!isActive)}>
          {isActive ? <Pause /> : <Play />}
        </Button>
        <Button size="icon" variant="outline" className="w-12 h-12 rounded-xl" onClick={reset}>
          <RotateCcw className="w-4 h-4" />
        </Button>
      </div>
      
      <p className="mt-4 text-xs font-medium text-muted-foreground uppercase tracking-widest">
        {mode === 'Work' ? "Stay Focused" : "Time to Recharge"}
      </p>
    </div>
  );
};

export default FocusTimer;
