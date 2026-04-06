'use client';

import React, { useMemo, useState } from 'react';
import StressScore from '@/components/dashboard/StressScore';
import MoodTracker, { type MoodLabel } from '@/components/dashboard/MoodTracker';
import MicroActionSystem from '@/components/shared/MicroActionSystem';
import {
  Sparkles,
  TrendingUp,
  Activity,
  Calendar,
  ChevronRight,
  BrainCircuit,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { calculateStressScore } from '@/services/stressDetection';
import { DEFAULT_PREFS, readUserPrefs } from '@/lib/prefs';
import Link from 'next/link';

const moodToScore: Record<MoodLabel, number> = {
  Sad: 1,
  Neutral: 3,
  Happy: 2,
  Great: 4,
  Stressed: 5,
};

const LOCAL_MOOD_KEY = 'stressless:last-mood';

const getTimeGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Morning';
  if (hour < 17) return 'Afternoon';
  return 'Evening';
};

export default function DashboardPage() {
  const [name] = useState(() => readUserPrefs().name || DEFAULT_PREFS.name);
  const [mood, setMood] = useState<MoodLabel | null>(() => {
    if (typeof window === 'undefined') return null;
    const storedMood = window.localStorage.getItem(LOCAL_MOOD_KEY);
    if (storedMood === 'Sad' || storedMood === 'Neutral' || storedMood === 'Happy' || storedMood === 'Great' || storedMood === 'Stressed') {
      return storedMood;
    }
    return null;
  });

  const stressResult = useMemo(
    () =>
      calculateStressScore({
        sleepHours: 7,
        screenTimeHours: 7,
        moodScore: mood ? moodToScore[mood] : 3,
        activityMinutes: 20,
      }),
    [mood]
  );

  const handleMoodChange = (nextMood: MoodLabel) => {
    setMood(nextMood);
    window.localStorage.setItem(LOCAL_MOOD_KEY, nextMood);
  };

  const greeting = getTimeGreeting();
  const today = new Intl.DateTimeFormat(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  }).format(new Date());

  const insights = [
    {
      title: 'Sleep Quality',
      description: 'Stable sleep patterns are helping your baseline stress stay moderate.',
      icon: BrainCircuit,
      color: 'text-primary bg-primary/10',
    },
    {
      title: 'Focus Peak',
      description: "You're usually most productive in your late morning window.",
      icon: Activity,
      color: 'text-calm-cyan bg-calm-cyan/10',
    },
    {
      title: 'Adaptive Insight',
      description: stressResult.insights[0] ?? 'A short mindful break could help you reset.',
      icon: TrendingUp,
      color: 'text-emerald-500 bg-emerald-500/10',
    },
  ];

  return (
    <div className="space-y-10">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{`${greeting}, ${name}!`}</h1>
          <p className="text-muted-foreground mt-1">{"Here's how your wellness is looking today."}</p>
        </div>
        <div className="flex items-center gap-2 bg-muted/30 px-4 py-2 rounded-2xl border border-border/40">
          <Calendar className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium">{today}</span>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass p-6 md:p-10 rounded-[2rem] md:rounded-[2.5rem] flex flex-col items-center justify-center border border-primary/10 relative overflow-hidden group">
          <div className="absolute top-4 right-4 md:right-6">
            <TrendingUp className="w-6 h-6 text-primary/40 group-hover:text-primary transition-colors" />
          </div>
          <StressScore score={stressResult.score} />
          <div className="mt-8 text-center space-y-2">
            <h4 className="text-xl font-bold">
              {stressResult.status === 'Calm'
                ? 'Great rhythm today'
                : stressResult.status === 'Moderate'
                  ? "You're doing well"
                  : stressResult.status === 'High'
                    ? 'Take a short reset break'
                    : 'Support is important right now'}
            </h4>
            <p className="text-sm text-muted-foreground max-w-xs mx-auto">
              {stressResult.suggestedAction}
            </p>
            <Link href="/relaxation">
              <Button variant="outline" className="mt-4 rounded-xl px-6 group">
                Open Relaxation Hub
                <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>

        <div className="flex flex-col gap-6 w-full">
          <MoodTracker value={mood} onChange={handleMoodChange} />

          <div className="flex-1 glass p-6 md:p-8 rounded-3xl border border-primary/10 relative overflow-hidden">
            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="w-5 h-5 text-amber-500 fill-amber-500/20" />
              <h3 className="text-lg font-bold">AI Companion Suggests</h3>
            </div>

            <div className="space-y-4">
              {insights.map((insight) => (
                <div
                  key={insight.title}
                  className="flex gap-4 p-4 rounded-2xl bg-muted/20 hover:bg-muted/30 transition-colors border border-border/20 group cursor-pointer"
                >
                  <div className={`p-3 rounded-xl ${insight.color} h-fit self-start`}>
                    <insight.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm mb-1">{insight.title}</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {insight.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <Link href="#micro-actions">
              <Button className="w-full mt-6 rounded-2xl py-6 h-auto font-bold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
                Start Quick Intervention
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <section id="micro-actions">
        <MicroActionSystem />
      </section>
    </div>
  );
}
