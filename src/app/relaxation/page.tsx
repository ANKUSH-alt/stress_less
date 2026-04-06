'use client';

import React, { useEffect, useRef, useState } from 'react';
import BreathingCircle from '@/components/relaxation/BreathingCircle';
import FocusTimer from '@/components/relaxation/FocusTimer';
import {
  Wind,
  Moon,
  Sun,
  Music,
  ChevronRight,
  Sparkles,
  Pause,
  Play,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const meditations = [
  {
    title: 'Ocean Breath',
    duration: '5 min',
    desc: 'A calming visualization of waves to center your mind.',
    icon: Wind,
    color: 'bg-blue-500/10 text-blue-500',
  },
  {
    title: 'Deep Sleep Prep',
    duration: '10 min',
    desc: 'Gentle guidance to quiet the noise before bed.',
    icon: Moon,
    color: 'bg-indigo-500/10 text-indigo-500',
  },
  {
    title: 'Morning Clarity',
    duration: '3 min',
    desc: 'Energizing focus for your professional day.',
    icon: Sun,
    color: 'bg-amber-500/10 text-amber-500',
  },
];

const ambientSounds = ['Rain', 'Forest', 'Waves', 'White Noise'] as const;
type AmbientSound = (typeof ambientSounds)[number];

type AmbientController = {
  stop: () => void;
};

type NoiseLayer = {
  source: AudioBufferSourceNode;
  filter: BiquadFilterNode;
  gain: GainNode;
};

const createNoiseBuffer = (ctx: AudioContext, durationSec: number) => {
  const frameCount = Math.floor(ctx.sampleRate * durationSec);
  const buffer = ctx.createBuffer(1, frameCount, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < frameCount; i += 1) {
    data[i] = Math.random() * 2 - 1;
  }
  return buffer;
};

const createNoiseLayer = (
  ctx: AudioContext,
  {
    filterType,
    frequency,
    q,
    gain,
  }: { filterType: BiquadFilterType; frequency: number; q?: number; gain: number }
): NoiseLayer => {
  const source = ctx.createBufferSource();
  source.buffer = createNoiseBuffer(ctx, 2.4);
  source.loop = true;

  const filter = ctx.createBiquadFilter();
  filter.type = filterType;
  filter.frequency.value = frequency;
  filter.Q.value = q ?? 0.7;

  const gainNode = ctx.createGain();
  gainNode.gain.value = gain;

  source.connect(filter);
  filter.connect(gainNode);
  gainNode.connect(ctx.destination);
  source.start();

  return { source, filter, gain: gainNode };
};

const stopNoiseLayer = (layer: NoiseLayer) => {
  try {
    layer.source.stop();
  } catch {
    // Source may already be stopped by the time cleanup runs.
  }
  layer.source.disconnect();
  layer.filter.disconnect();
  layer.gain.disconnect();
};

const createWhiteNoise = (ctx: AudioContext): AmbientController => {
  const noise = createNoiseLayer(ctx, {
    filterType: 'lowpass',
    frequency: 9000,
    gain: 0.05,
  });

  return {
    stop: () => stopNoiseLayer(noise),
  };
};

const createWaves = (ctx: AudioContext): AmbientController => {
  const surf = createNoiseLayer(ctx, {
    filterType: 'lowpass',
    frequency: 1000,
    q: 0.6,
    gain: 0.018,
  });
  const foam = createNoiseLayer(ctx, {
    filterType: 'bandpass',
    frequency: 1800,
    q: 0.8,
    gain: 0.009,
  });

  const swellTimer = window.setInterval(() => {
    surf.gain.gain.linearRampToValueAtTime(0.015 + Math.random() * 0.04, ctx.currentTime + 3.5);
    foam.gain.gain.linearRampToValueAtTime(0.006 + Math.random() * 0.02, ctx.currentTime + 3.5);
  }, 3200);

  return {
    stop: () => {
      window.clearInterval(swellTimer);
      stopNoiseLayer(surf);
      stopNoiseLayer(foam);
    },
  };
};

const createRain = (ctx: AudioContext): AmbientController => {
  const rainBed = createNoiseLayer(ctx, {
    filterType: 'highpass',
    frequency: 2500,
    q: 0.5,
    gain: 0.02,
  });
  const drizzle = createNoiseLayer(ctx, {
    filterType: 'bandpass',
    frequency: 4500,
    q: 1.2,
    gain: 0.012,
  });

  const dropCleanupTimers: number[] = [];
  const dropTimer = window.setInterval(() => {
    if (Math.random() > 0.45) return;

    const drop = ctx.createBufferSource();
    drop.buffer = createNoiseBuffer(ctx, 0.16);

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 1800 + Math.random() * 4200;
    filter.Q.value = 4;

    const gain = ctx.createGain();
    const now = ctx.currentTime;
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.015 + Math.random() * 0.03, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.14);

    drop.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    drop.start(now);
    drop.stop(now + 0.16);

    const cleanupTimer = window.setTimeout(() => {
      drop.disconnect();
      filter.disconnect();
      gain.disconnect();
    }, 260);

    dropCleanupTimers.push(cleanupTimer);
  }, 180);

  return {
    stop: () => {
      window.clearInterval(dropTimer);
      for (const timer of dropCleanupTimers) {
        window.clearTimeout(timer);
      }
      stopNoiseLayer(rainBed);
      stopNoiseLayer(drizzle);
    },
  };
};

const createForest = (ctx: AudioContext): AmbientController => {
  const breeze = createNoiseLayer(ctx, {
    filterType: 'lowpass',
    frequency: 1300,
    q: 0.5,
    gain: 0.018,
  });
  const leaves = createNoiseLayer(ctx, {
    filterType: 'bandpass',
    frequency: 3200,
    q: 0.7,
    gain: 0.008,
  });

  const chirpCleanupTimers: number[] = [];
  const breezeTimer = window.setInterval(() => {
    breeze.gain.gain.linearRampToValueAtTime(0.01 + Math.random() * 0.025, ctx.currentTime + 2.4);
    leaves.gain.gain.linearRampToValueAtTime(0.004 + Math.random() * 0.014, ctx.currentTime + 2.4);
  }, 2200);

  const chirpTimer = window.setInterval(() => {
    if (Math.random() > 0.7) return;

    const chirp = ctx.createOscillator();
    chirp.type = 'triangle';
    const gain = ctx.createGain();
    const now = ctx.currentTime;
    const base = 1200 + Math.random() * 700;

    chirp.frequency.setValueAtTime(base, now);
    chirp.frequency.exponentialRampToValueAtTime(base * 1.8, now + 0.09);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.012 + Math.random() * 0.008, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);

    chirp.connect(gain);
    gain.connect(ctx.destination);
    chirp.start(now);
    chirp.stop(now + 0.2);

    const cleanupTimer = window.setTimeout(() => {
      chirp.disconnect();
      gain.disconnect();
    }, 300);

    chirpCleanupTimers.push(cleanupTimer);
  }, 2600);

  return {
    stop: () => {
      window.clearInterval(breezeTimer);
      window.clearInterval(chirpTimer);
      for (const timer of chirpCleanupTimers) {
        window.clearTimeout(timer);
      }
      stopNoiseLayer(breeze);
      stopNoiseLayer(leaves);
    },
  };
};

const createAmbientController = (ctx: AudioContext, sound: AmbientSound): AmbientController => {
  if (sound === 'Rain') return createRain(ctx);
  if (sound === 'Forest') return createForest(ctx);
  if (sound === 'Waves') return createWaves(ctx);
  return createWhiteNoise(ctx);
};

export default function RelaxationPage() {
  const [activeSound, setActiveSound] = useState<AmbientSound | null>(null);
  const [activeMeditation, setActiveMeditation] = useState<(typeof meditations)[number] | null>(null);
  const [audioError, setAudioError] = useState<string | null>(null);
  const breathingRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const activeAmbientRef = useRef<AmbientController | null>(null);

  const stopAmbient = () => {
    activeAmbientRef.current?.stop();
    activeAmbientRef.current = null;
  };

  const getAudioContext = () => {
    if (audioContextRef.current) return audioContextRef.current;

    const contextCtor =
      window.AudioContext ??
      (
        window as Window & {
          webkitAudioContext?: typeof AudioContext;
        }
      ).webkitAudioContext;

    if (!contextCtor) {
      throw new Error('Web Audio API is not supported in this browser.');
    }

    const context = new contextCtor();
    audioContextRef.current = context;
    return context;
  };

  const toggleSound = async (sound: AmbientSound) => {
    setAudioError(null);

    if (activeSound === sound) {
      stopAmbient();
      setActiveSound(null);
      return;
    }

    try {
      const ctx = getAudioContext();
      if (ctx.state === 'suspended') {
        await ctx.resume();
      }

      stopAmbient();
      activeAmbientRef.current = createAmbientController(ctx, sound);
      setActiveSound(sound);
    } catch (error) {
      console.error('Ambient sound error:', error);
      stopAmbient();
      setActiveSound(null);
      setAudioError('Could not start ambient audio on this browser.');
    }
  };

  const startMeditation = (title: string) => {
    const selected = meditations.find((m) => m.title === title) ?? null;
    setActiveMeditation(selected);
    breathingRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  useEffect(() => {
    return () => {
      stopAmbient();
      const context = audioContextRef.current;
      if (context && context.state !== 'closed') {
        void context.close();
      }
    };
  }, []);

  return (
    <div className="space-y-12">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Relaxation Hub</h1>
        <p className="text-muted-foreground mt-1">Take a moment for yourself. You deserve it.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div
          ref={breathingRef}
          className="lg:col-span-2 glass p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] border border-primary/10 relative overflow-hidden"
        >
          <div className="absolute top-4 left-4 md:top-8 md:left-10 flex items-center gap-2">
            <Wind className="w-4 h-4 md:w-5 md:h-4 text-primary" />
            <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-primary">Guided Breathing</span>
          </div>
          {activeMeditation && (
            <div className="absolute top-4 right-4 md:top-6 md:right-6 max-w-[55%] md:max-w-[45%] rounded-2xl border border-primary/20 bg-primary/10 px-3 py-2 md:px-4 md:py-2 text-right">
              <p className="text-[9px] md:text-[10px] uppercase tracking-widest text-primary/70 font-semibold line-clamp-1">Session Loaded</p>
              <p className="text-xs md:text-sm font-bold line-clamp-1">{activeMeditation.title}</p>
              <p className="text-[10px] md:text-[11px] text-muted-foreground">{activeMeditation.duration}</p>
            </div>
          )}
          <div className="mt-8 md:mt-0">
            <BreathingCircle />
          </div>
        </div>

        <div className="space-y-6">
          <FocusTimer />

          <div className="glass p-6 rounded-3xl border border-primary/10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold flex items-center gap-2">
                <Music className="w-4 h-4 text-primary" />
                Ambient Sounds
              </h3>
              <span className="text-[10px] font-bold text-primary uppercase bg-primary/10 px-2 py-0.5 rounded-full">
                New
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {ambientSounds.map((sound) => {
                const isActive = activeSound === sound;
                return (
                  <button
                    key={sound}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => void toggleSound(sound)}
                    className={cn(
                      'p-3 rounded-2xl font-medium text-xs transition-colors border flex items-center justify-center gap-2',
                      isActive
                        ? 'bg-primary/20 border-primary/40 text-primary'
                        : 'bg-muted/30 hover:bg-muted border-transparent hover:border-primary/20'
                    )}
                  >
                    {isActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    {sound}
                  </button>
                );
              })}
            </div>
            <p className={cn('mt-3 text-[11px]', audioError ? 'text-rose-500' : 'text-muted-foreground')}>
              {audioError ||
                (activeSound
                  ? `${activeSound} ambiance is playing. Tap the same button to stop.`
                  : 'Select a sound to start a calming backdrop.')}
            </p>
          </div>
        </div>
      </div>

      <section className="space-y-6">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-500" />
          <h2 className="text-xl font-bold">Recommended for You</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {meditations.map((med) => (
            <div
              key={med.title}
              className="glass p-6 rounded-3xl border border-primary/5 hover:border-primary/20 transition-all group"
            >
              <div
                className={cn(
                  'w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110',
                  med.color
                )}
              >
                <med.icon className="w-6 h-6" />
              </div>
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold">{med.title}</h3>
                <span className="text-[10px] font-bold text-muted-foreground">{med.duration}</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed mb-4">{med.desc}</p>
              <Button
                type="button"
                variant="ghost"
                className="px-0 h-auto text-xs font-bold text-primary hover:bg-transparent"
                onClick={() => startMeditation(med.title)}
              >
                Start Session <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
