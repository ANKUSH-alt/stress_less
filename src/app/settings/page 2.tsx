'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sparkles, UserRound, Bell, Target, Save } from 'lucide-react';
import { DEFAULT_PREFS, type AgeGroup, type UserPrefs, readUserPrefs, saveUserPrefs } from '@/lib/prefs';
import { cn } from '@/lib/utils';

export default function SettingsPage() {
  const [prefs, setPrefs] = useState<UserPrefs>(() => readUserPrefs());
  const [saved, setSaved] = useState(false);

  const updatePrefs = <K extends keyof UserPrefs>(key: K, value: UserPrefs[K]) => {
    setPrefs((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const handleSave = () => {
    saveUserPrefs({
      ...prefs,
      name: prefs.name.trim() || DEFAULT_PREFS.name,
      dailyGoal: prefs.dailyGoal.trim() || DEFAULT_PREFS.dailyGoal,
    });
    setSaved(true);
  };

  return (
    <div className="max-w-3xl space-y-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Personalize StressLess so the dashboard and chat assistant adapt to you.
        </p>
      </header>

      <section className="glass rounded-3xl border border-primary/10 p-8 space-y-6">
        <div className="flex items-center gap-2">
          <UserRound className="w-4 h-4 text-primary" />
          <h2 className="font-bold">Profile</h2>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="name">
            Display Name
          </label>
          <Input
            id="name"
            value={prefs.name}
            onChange={(e) => updatePrefs('name', e.target.value)}
            className="h-11 rounded-xl"
            placeholder="Your name"
          />
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium">Age Group</p>
          <div className="flex gap-2 p-1 bg-muted/30 rounded-xl border border-border/40 w-fit">
            {(['Teen', 'Adult', 'Senior'] as AgeGroup[]).map((group) => (
              <button
                key={group}
                onClick={() => updatePrefs('ageGroup', group)}
                className={cn(
                  'px-4 py-1.5 rounded-lg text-xs font-bold transition-all',
                  prefs.ageGroup === group
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {group}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="glass rounded-3xl border border-primary/10 p-8 space-y-6">
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-primary" />
          <h2 className="font-bold">Wellness Goal</h2>
        </div>

        <Input
          value={prefs.dailyGoal}
          onChange={(e) => updatePrefs('dailyGoal', e.target.value)}
          className="h-11 rounded-xl"
          placeholder="Example: 10 mindful minutes + 1 breathing break"
        />

        <div className="flex items-center justify-between p-4 rounded-2xl border border-border/30 bg-muted/20">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Daily Reminder Nudges</span>
          </div>
          <button
            onClick={() => updatePrefs('remindersEnabled', !prefs.remindersEnabled)}
            className={cn(
              'w-11 h-6 rounded-full transition-colors relative',
              prefs.remindersEnabled ? 'bg-primary' : 'bg-muted'
            )}
            aria-label="Toggle reminders"
          >
            <span
              className={cn(
                'absolute top-1 w-4 h-4 rounded-full bg-white transition-transform',
                prefs.remindersEnabled ? 'translate-x-6' : 'translate-x-1'
              )}
            />
          </button>
        </div>
      </section>

      <div className="flex items-center gap-3">
        <Button onClick={handleSave} className="rounded-2xl h-12 px-6 font-bold">
          <Save className="w-4 h-4 mr-2" />
          Save Preferences
        </Button>
        {saved && (
          <p className="text-sm text-emerald-500 flex items-center gap-1">
            <Sparkles className="w-4 h-4" />
            Preferences saved.
          </p>
        )}
      </div>
    </div>
  );
}
