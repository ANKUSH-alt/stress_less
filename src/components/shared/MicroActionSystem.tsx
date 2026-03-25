'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, 
  Eye, 
  Droplets, 
  Accessibility, 
  ChevronRight,
  CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const actions = [
  { 
    id: 1,
    title: "Eye Palming", 
    duration: "30s", 
    desc: "Cover eyes with warm palms. Relieve digital strain.", 
    icon: Eye, 
    color: "text-blue-500 bg-blue-500/10" 
  },
  { 
    id: 2,
    title: "Wrist Reset", 
    duration: "1 min", 
    desc: "Gentle rotations to release typing tension.", 
    icon: Accessibility, 
    color: "text-emerald-500 bg-emerald-500/10" 
  },
  { 
    id: 3,
    title: "Cold Splash", 
    duration: "30s", 
    desc: "Splash cold water on face to reset nervous system.", 
    icon: Droplets, 
    color: "text-cyan-500 bg-cyan-500/10" 
  },
];

const MicroActionSystem = () => {
  const [activeAction, setActiveAction] = useState<number | null>(null);
  const [isDone, setIsDone] = useState(false);

  const startAction = (id: number) => {
    setActiveAction(id);
    setIsDone(false);
    setTimeout(() => {
      setIsDone(true);
    }, 5000); // Shorter for demo
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Zap className="w-5 h-5 text-amber-500 fill-amber-500/20" />
        <h2 className="text-xl font-bold">1-Min Interventions</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {actions.map((action) => (
          <motion.div
            key={action.id}
            whileHover={{ y: -5 }}
            className="glass p-6 rounded-3xl border border-primary/5 hover:border-primary/20 transition-all group flex flex-col justify-between"
          >
            <div>
              <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-4", action.color)}>
                <action.icon className="w-6 h-6" />
              </div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold">{action.title}</h3>
                <span className="text-[10px] font-bold text-muted-foreground uppercase">{action.duration}</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{action.desc}</p>
            </div>
            
            <Button 
               variant="ghost" 
               className="mt-6 w-full rounded-xl group-hover:bg-primary/10 group-hover:text-primary transition-all text-xs font-bold"
               onClick={() => startAction(action.id)}
            >
              Prepare Now <ChevronRight className="ml-2 w-4 h-4" />
            </Button>
          </motion.div>
        ))}
      </div>

      {/* Intervention Modal / Overlay */}
      <AnimatePresence>
        {activeAction && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-md p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="glass max-w-lg w-full p-10 rounded-[3rem] border border-primary/20 text-center"
            >
              {!isDone ? (
                <>
                  <h2 className="text-3xl font-bold mb-4">Focusing...</h2>
                  <p className="text-muted-foreground mb-8 text-lg">Follow the action mentally.</p>
                  <div className="w-24 h-24 bg-primary/20 rounded-full mx-auto flex items-center justify-center">
                    <motion.div 
                       animate={{ scale: [1, 1.2, 1] }} 
                       transition={{ duration: 2, repeat: Infinity }}
                       className="w-12 h-12 bg-primary rounded-full" 
                    />
                  </div>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-20 h-20 text-emerald-500 mx-auto mb-6" />
                  <h2 className="text-3xl font-bold mb-4">Well Done!</h2>
                  <p className="text-muted-foreground mb-8">You have successfully completed a micro-reset.</p>
                  <Button onClick={() => setActiveAction(null)} className="w-full rounded-2xl h-14 font-bold">
                    Back to Life
                  </Button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MicroActionSystem;
