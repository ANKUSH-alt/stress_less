'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface StressScoreProps {
  score: number;
  label?: string;
}

const StressScore = ({ score, label = "Current Stress Level" }: StressScoreProps) => {
  // Determine color based on score
  const getColor = (s: number) => {
    if (s < 30) return "text-emerald-500";
    if (s < 70) return "text-amber-500";
    return "text-rose-500";
  };

  const getStatus = (s: number) => {
    if (s < 30) return "Calm";
    if (s < 70) return "Moderate";
    return "High";
  };

  const colorClass = getColor(score);
  const status = getStatus(score);

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-48 h-48 flex items-center justify-center">
        {/* Background Circle */}
        <svg className="w-full h-full -rotate-90">
          <circle
            cx="96"
            cy="96"
            r="80"
            fill="none"
            stroke="currentColor"
            strokeWidth="12"
            className="text-muted/20"
          />
          {/* Progress Circle */}
          <motion.circle
            cx="96"
            cy="96"
            r="80"
            fill="none"
            stroke="currentColor"
            strokeWidth="12"
            strokeDasharray="502.4"
            initial={{ strokeDashoffset: 502.4 }}
            animate={{ strokeDashoffset: 502.4 - (502.4 * score) / 100 }}
            transition={{ duration: 2, ease: "easeOut" }}
            className={colorClass}
            strokeLinecap="round"
          />
        </svg>

        {/* Score Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="text-4xl font-bold"
          >
            {score}
          </motion.span>
          <motion.span 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ delay: 1.2 }}
             className="text-xs font-medium text-muted-foreground uppercase tracking-widest"
          >
            {status}
          </motion.span>
        </div>
      </div>
      
      <p className="mt-4 font-medium text-muted-foreground">{label}</p>
    </div>
  );
};

export default StressScore;
