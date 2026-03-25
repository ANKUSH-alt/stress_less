'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

const BreathingCircle = () => {
  const [phase, setPhase] = useState<'Inhale' | 'Hold' | 'Exhale'>('Inhale');
  const [isActive, setIsActive] = useState(false);
  const [counter, setCounter] = useState(4);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive) {
      interval = setInterval(() => {
        setCounter((prev) => {
          if (prev <= 1) {
            if (phase === 'Inhale') {
              setPhase('Hold');
              return 7;
            } else if (phase === 'Hold') {
              setPhase('Exhale');
              return 8;
            } else {
              setPhase('Inhale');
              return 4;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, phase]);

  const circleVariants: Variants = {
    Inhale: { scale: 1.5, transition: { duration: 4, ease: "easeInOut" } },
    Hold: { scale: 1.5, transition: { duration: 0 } },
    Exhale: { scale: 1, transition: { duration: 8, ease: "easeInOut" } },
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-12 py-10">
      <div className="relative flex items-center justify-center w-80 h-80">
        {/* Animated Rings */}
        <AnimatePresence>
          {isActive && (
            <>
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: phase === 'Inhale' ? 1.6 : phase === 'Hold' ? 1.6 : 1, opacity: 0.1 }}
                className="absolute inset-0 bg-primary rounded-full blur-2xl"
              />
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: phase === 'Inhale' ? 1.4 : phase === 'Hold' ? 1.4 : 1, opacity: 0.2 }}
                className="absolute inset-4 bg-calm-cyan rounded-full blur-xl"
              />
            </>
          )}
        </AnimatePresence>

        {/* Main Breathing Circle */}
        <motion.div
          animate={isActive ? phase : { scale: 1 }}
          variants={circleVariants}
          className="relative w-40 h-40 bg-gradient-to-br from-primary to-calm-lavender rounded-full shadow-2xl flex items-center justify-center z-10 border-4 border-white/20"
        >
          <div className="flex flex-col items-center text-primary-foreground">
            <span className="text-2xl font-bold">{counter}s</span>
          </div>
        </motion.div>

        {/* Phase Text */}
        <div className="absolute top-[-40px] left-0 right-0 text-center">
            <motion.h3 
              key={phase}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl font-bold text-gradient"
            >
              {isActive ? phase : "Ready?"}
            </motion.h3>
        </div>
      </div>

      <div className="flex gap-4">
        <Button 
          size="lg" 
          onClick={() => setIsActive(!isActive)}
          className="rounded-2xl h-14 px-10 font-bold shadow-xl"
        >
          {isActive ? (
            <>
              <Pause className="mr-2 w-5 h-5" /> Pause
            </>
          ) : (
            <>
              <Play className="mr-2 w-5 h-5" /> Start Breathing
            </>
          )}
        </Button>
        <Button 
          variant="outline" 
          size="lg" 
          onClick={() => {
            setIsActive(false);
            setPhase('Inhale');
            setCounter(4);
          }}
          className="rounded-2xl h-14 px-6"
        >
          <RotateCcw className="w-5 h-5" />
        </Button>
      </div>
      
      <p className="text-muted-foreground text-sm font-medium">Use the 4-7-8 technique to calm your nervous system.</p>
    </div>
  );
};

export default BreathingCircle;
