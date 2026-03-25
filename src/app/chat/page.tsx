'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  Bot, 
  User, 
  ShieldAlert,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { readUserPrefs, saveUserPrefs } from '@/lib/prefs';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

type AgeGroup = 'Teen' | 'Adult' | 'Senior';

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Hello! I'm your StressLess companion. How are you feeling today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [ageGroup, setAgeGroup] = useState<AgeGroup>('Adult');
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    const prefs = readUserPrefs();
    setAgeGroup(prefs.ageGroup);
  }, []);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    setError(null);

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messages: [...messages, userMessage],
          ageGroup 
        }),
      });

      const data = (await response.json()) as { content?: string; error?: string };

      if (!response.ok) {
        setError(data.error || 'Something went wrong while generating a response.');
        return;
      }

      const assistantContent = data.content;
      if (typeof assistantContent === 'string' && assistantContent.trim().length > 0) {
        setMessages(prev => [...prev, { role: 'assistant', content: assistantContent }]);
      }
    } catch (error) {
      console.error('Chat error:', error);
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[75vh] max-w-4xl mx-auto space-y-4">
      {/* Header & Personalization */}
      <div className="flex flex-col md:flex-row justify-between items-center glass p-4 rounded-2xl border border-primary/10 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-bold">AI Companion</h2>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Online & Listening</span>
            </div>
          </div>
        </div>

        <div className="flex gap-2 p-1 bg-muted/30 rounded-xl border border-border/40">
          {(['Teen', 'Adult', 'Senior'] as AgeGroup[]).map((group) => (
            <button
              key={group}
              onClick={() => {
                setAgeGroup(group);
                const current = readUserPrefs();
                saveUserPrefs({ ...current, ageGroup: group });
              }}
              className={cn(
                "px-4 py-1.5 rounded-lg text-xs font-bold transition-all",
                ageGroup === group 
                  ? "bg-primary text-primary-foreground shadow-sm" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {group}
            </button>
          ))}
        </div>
      </div>

      {/* Chat area */}
      <div 
        ref={scrollRef}
        className="flex-1 glass rounded-3xl p-6 overflow-y-auto space-y-6 border border-primary/5 scrollbar-hide"
      >
        <AnimatePresence>
          {messages.map((m, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={cn(
                "flex gap-4 max-w-[85%]",
                m.role === 'user' ? "ml-auto flex-row-reverse" : ""
              )}
            >
              <div className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                m.role === 'user' ? "bg-muted text-foreground" : "bg-primary/10 text-primary"
              )}>
                {m.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>
              <div className={cn(
                "p-4 rounded-2xl shadow-sm text-sm leading-relaxed",
                m.role === 'user' 
                  ? "bg-primary text-primary-foreground rounded-tr-none" 
                  : "glass border border-primary/10 rounded-tl-none"
              )}>
                {m.content}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {isLoading && (
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <Loader2 className="w-4 h-4 animate-spin" />
            </div>
            <div className="glass p-4 rounded-2xl rounded-tl-none border border-primary/10">
              <span className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce" />
                <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:0.4s]" />
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Input area */}
      <div className="relative group">
        <Input 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="How are you feeling today?"
          className="h-16 pl-6 pr-16 rounded-2xl glass border-primary/20 focus:border-primary focus:ring-primary/20 transition-all text-lg shadow-xl"
        />
        <Button 
          onClick={handleSend}
          disabled={!input.trim() || isLoading}
          className="absolute right-2 top-2 h-12 w-12 rounded-xl bg-primary hover:bg-primary/90 transition-transform active:scale-95"
        >
          <Send className="w-5 h-5" />
        </Button>
      </div>

      {error && (
        <div className="text-center text-xs text-rose-500 font-medium">{error}</div>
      )}

      {/* Safety Disclaimer */}
      <div className="flex items-center justify-center gap-2 text-[10px] text-muted-foreground uppercase tracking-widest font-medium opacity-60">
        <ShieldAlert className="w-3 h-3" />
        <span>Not medical advice. In crisis, call emergency services.</span>
      </div>
    </div>
  );
}
