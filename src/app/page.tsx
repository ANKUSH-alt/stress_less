'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  ArrowRight, 
  Brain, 
  ShieldCheck, 
  Heart,
  MousePointer2
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center space-y-12">
      {/* Hero Section */}
      <div className="space-y-6 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-primary/20 text-primary text-sm font-semibold mb-4"
        >
          <Sparkles className="w-4 h-4" />
          <span>Award-winning AI Design</span>
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight"
        >
          Your Intelligent <br />
          <span className="text-gradient">Stress Companion</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-medium px-4"
        >
          Meet StressLess. Not just another app, but an emotionally intelligent 
          living AI companion designed to understand, predict, and relieve 
          your stress in real-time.
        </motion.p>
      </div>

      {/* Buttons */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.6 }}
        className="flex flex-col sm:flex-row gap-4 items-center w-full px-8 sm:px-0 sm:w-auto"
      >
        <Link href="/dashboard" className="w-full sm:w-auto">
          <Button size="lg" className="w-full sm:w-auto rounded-2xl h-14 px-10 text-lg font-bold bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20 group">
            Get Started
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
        <Link href="/chat" className="w-full sm:w-auto">
          <Button size="lg" variant="outline" className="w-full sm:w-auto rounded-2xl h-14 px-10 text-lg font-bold group">
            Talk to AI
            <Heart className="ml-2 w-5 h-5 text-rose-500 group-hover:scale-110 transition-transform" />
          </Button>
        </Link>
      </motion.div>

      {/* Feature Grid */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.8 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl mt-12"
      >
        {[
          { label: "AI Stress Detection", icon: Brain, desc: "Real-time behavior learning." },
          { label: "Human-Centered", icon: Heart, desc: "Built with DTL principles." },
          { label: "Privacy First", icon: ShieldCheck, desc: "Your data stays yours." }
        ].map((feat, i) => (
          <div key={i} className="glass p-6 rounded-3xl border border-primary/5 hover:border-primary/20 transition-colors group">
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <feat.icon className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-bold mb-2">{feat.label}</h3>
            <p className="text-sm text-muted-foreground">{feat.desc}</p>
          </div>
        ))}
      </motion.div>

      {/* Scroll indicator */}
      <motion.div 
         animate={{ y: [0, 10, 0] }}
         transition={{ duration: 2, repeat: Infinity }}
         className="absolute bottom-12 flex flex-col items-center gap-2 opacity-50"
      >
        <MousePointer2 className="w-4 h-4" />
        <span className="text-[10px] uppercase tracking-widest font-bold">Discover More</span>
      </motion.div>
    </div>
  );
}
