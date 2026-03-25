import React from 'react';
import BreathingCircle from '@/components/relaxation/BreathingCircle';
import FocusTimer from '@/components/relaxation/FocusTimer';
import { 
  Wind, 
  Moon, 
  Sun, 
  Music, 
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';

const meditations = [
  { 
    title: "Ocean Breath", 
    duration: "5 min", 
    desc: "A calming visualization of waves to center your mind.", 
    icon: Wind, 
    color: "bg-blue-500/10 text-blue-500" 
  },
  { 
    title: "Deep Sleep Prep", 
    duration: "10 min", 
    desc: "Gentle guidance to quiet the noise before bed.", 
    icon: Moon, 
    color: "bg-indigo-500/10 text-indigo-500" 
  },
  { 
    title: "Morning Clarity", 
    duration: "3 min", 
    desc: "Energizing focus for your professional day.", 
    icon: Sun, 
    color: "bg-amber-500/10 text-amber-500" 
  },
];

export default function RelaxationPage() {
  return (
    <div className="space-y-12">
      {/* Header */}
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Relaxation Hub</h1>
        <p className="text-muted-foreground mt-1">Take a moment for yourself. You deserve it.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Breathing Section (Main) */}
        <div className="lg:col-span-2 glass p-10 rounded-[3rem] border border-primary/10 relative overflow-hidden">
          <div className="absolute top-8 left-10 flex items-center gap-2">
            <Wind className="w-5 h-4 text-primary" />
            <span className="text-xs font-bold uppercase tracking-widest text-primary">Guided Breathing</span>
          </div>
          <BreathingCircle />
        </div>

        {/* Focus & Audio Section */}
        <div className="space-y-6">
          <FocusTimer />
          
          <div className="glass p-6 rounded-3xl border border-primary/10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold flex items-center gap-2">
                <Music className="w-4 h-4 text-primary" />
                Ambient Sounds
              </h3>
              <span className="text-[10px] font-bold text-primary uppercase bg-primary/10 px-2 py-0.5 rounded-full">New</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {['Rain', 'Forest', 'Waves', 'White Noise'].map((sound) => (
                <button key={sound} className="p-3 rounded-2xl bg-muted/30 hover:bg-muted font-medium text-xs transition-colors border border-transparent hover:border-primary/20">
                  {sound}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Meditations */}
      <section className="space-y-6">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-500" />
          <h2 className="text-xl font-bold">Recommended for You</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {meditations.map((med, idx) => (
            <div key={idx} className="glass p-6 rounded-3xl border border-primary/5 hover:border-primary/20 transition-all group cursor-pointer">
              <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110", med.color)}>
                <med.icon className="w-6 h-6" />
              </div>
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold">{med.title}</h3>
                <span className="text-[10px] font-bold text-muted-foreground">{med.duration}</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed mb-4">{med.desc}</p>
              <div className="flex items-center text-xs font-bold text-primary group-hover:gap-2 transition-all">
                Start Session <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
