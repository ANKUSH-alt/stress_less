'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export type MoodLabel = 'Sad' | 'Neutral' | 'Happy' | 'Great' | 'Stressed';

const moods: { emoji: string; label: MoodLabel; color: string }[] = [
  { emoji: '😔', label: 'Sad', color: 'bg-blue-500/10 text-blue-500' },
  { emoji: '😐', label: 'Neutral', color: 'bg-gray-500/10 text-gray-500' },
  { emoji: '😊', label: 'Happy', color: 'bg-emerald-500/10 text-emerald-500' },
  { emoji: '🤩', label: 'Great', color: 'bg-amber-500/10 text-amber-500' },
  { emoji: '🤯', label: 'Stressed', color: 'bg-rose-500/10 text-rose-500' },
];

interface MoodTrackerProps {
  value?: MoodLabel | null;
  onChange?: (mood: MoodLabel) => void;
}

const MoodTracker = ({ value, onChange }: MoodTrackerProps) => {
  const [internalMood, setInternalMood] = useState<MoodLabel | null>(null);
  const selectedMood = value ?? internalMood;

  const setMood = (mood: MoodLabel) => {
    setInternalMood(mood);
    onChange?.(mood);
  };

  return (
    <div className="p-6 rounded-3xl glass border border-primary/10">
      <h3 className="text-lg font-bold mb-4">How are you feeling?</h3>
      <div className="flex justify-between gap-2">
        {moods.map((mood) => {
          const isSelected = selectedMood === mood.label;
          return (
            <motion.button
              key={mood.label}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setMood(mood.label)}
              className={cn(
                "flex flex-col items-center gap-2 p-3 rounded-2xl transition-all duration-300 flex-1",
                isSelected 
                  ? mood.color 
                  : "bg-muted/30 hover:bg-muted/50 text-muted-foreground hover:text-foreground"
              )}
            >
              <span className="text-3xl">{mood.emoji}</span>
              <span className="text-[10px] font-semibold uppercase tracking-wider">
                {mood.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default MoodTracker;
