'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  Sparkles,
  RefreshCw,
  Calendar,
  Layers,
  Brain,
  Save,
  Trash2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import ReactMarkdown from 'react-markdown';

type JournalEntry = {
  id: string;
  dateLabel: string;
  preview: string;
  content: string;
  reflection: string;
};

const JOURNAL_KEY = 'stressless:journal-entries';

const prompts = [
  "What's one thing you're proud of today?",
  'What did you learn from a challenge?',
  'Who cheered you up today?',
];

const buildDateLabel = () =>
  new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
  }).format(new Date());

export default function JournalPage() {
  const [content, setContent] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [reflection, setReflection] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [entries, setEntries] = useState<JournalEntry[]>([]);

  useEffect(() => {
    const raw = window.localStorage.getItem(JOURNAL_KEY);
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw) as JournalEntry[];
      if (Array.isArray(parsed)) {
        setEntries(parsed);
      }
    } catch {
      setEntries([]);
    }
  }, []);

  const persistEntries = (nextEntries: JournalEntry[]) => {
    setEntries(nextEntries);
    window.localStorage.setItem(JOURNAL_KEY, JSON.stringify(nextEntries));
  };

  const handleAnalyze = async () => {
    if (!content.trim()) return;
    setIsAnalyzing(true);
    setError(null);

    try {
      const response = await fetch('/api/journal/reflect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });
      const data = (await response.json()) as { reflection?: string; error?: string };
      if (!response.ok) {
        setError(data.error || 'Unable to analyze this entry right now.');
        return;
      }
      if (data.reflection) {
        setReflection(data.reflection);
      }
    } catch (fetchError) {
      console.error('Journal analysis error:', fetchError);
      setError('Network error. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSaveEntry = () => {
    if (!content.trim()) return;
    const entry: JournalEntry = {
      id: `${Date.now()}`,
      dateLabel: buildDateLabel(),
      preview: content.trim().slice(0, 72),
      content: content.trim(),
      reflection: reflection || 'No AI reflection generated yet.',
    };

    persistEntries([entry, ...entries].slice(0, 12));
    setContent('');
    setReflection(null);
  };

  const clearHistory = () => {
    persistEntries([]);
  };

  const recentEntries = useMemo(() => entries.slice(0, 6), [entries]);

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-20 px-2 sm:px-0">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI Reflection Journal</h1>
          <p className="text-muted-foreground mt-1">Transform your thoughts into clarity.</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Button variant="outline" className="rounded-xl w-full md:w-auto" onClick={clearHistory} disabled={!entries.length}>
            <Layers className="w-4 h-4 mr-2" />
            {entries.length ? 'Clear History' : 'History Empty'}
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="glass p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border border-primary/10 relative overflow-hidden">
            <div className="flex items-center gap-2 mb-6">
              <Calendar className="w-5 h-5 text-primary" />
              <span className="text-sm font-bold uppercase tracking-widest text-primary">{"Today's Entry"}</span>
            </div>

            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={"What's on your mind? No filters, just flow..."}
              className="min-h-[250px] md:min-h-[350px] bg-transparent border-none focus-visible:ring-0 text-base md:text-lg leading-relaxed resize-none p-0 placeholder:text-muted-foreground/40"
            />

            <div className="mt-8 flex flex-col sm:flex-row justify-end gap-3">
              <Button
                onClick={handleAnalyze}
                disabled={!content.trim() || isAnalyzing}
                className="rounded-2xl h-14 px-8 font-bold shadow-lg shadow-primary/20 gap-2 w-full sm:w-auto"
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" /> Analyzing...
                  </>
                ) : (
                  <>
                    <Brain className="w-5 h-5" /> Generate Insights
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={handleSaveEntry}
                disabled={!content.trim()}
                className="rounded-2xl h-14 px-8 font-bold gap-2 w-full sm:w-auto"
              >
                <Save className="w-5 h-5" /> Save Entry
              </Button>
            </div>
            {error && <p className="mt-3 text-sm text-rose-500">{error}</p>}
          </div>

          <AnimatePresence>
            {reflection && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass p-6 md:p-8 rounded-3xl border border-amber-500/20 bg-amber-500/5 relative overflow-hidden group"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-amber-500/10 rounded-lg">
                    <Sparkles className="w-5 h-5 text-amber-500" />
                  </div>
                  <h3 className="font-bold text-amber-800 dark:text-amber-200">AI Personal Insight</h3>
                </div>
                <div className="text-sm text-muted-foreground leading-relaxed italic">
                  <ReactMarkdown
                    components={{
                      // eslint-disable-next-line @typescript-eslint/no-unused-vars
                      p: ({node: _node, ...props}: {node?: unknown} & React.HTMLProps<HTMLParagraphElement>) => <p {...props} className="mb-3 last:mb-0" />,
                      // eslint-disable-next-line @typescript-eslint/no-unused-vars
                      ul: ({node: _node, ...props}: {node?: unknown} & React.HTMLProps<HTMLUListElement>) => <ul {...props} className="list-disc ml-4 mb-3 mt-1 space-y-1 not-italic" />,
                      // eslint-disable-next-line @typescript-eslint/no-unused-vars
                      ol: ({node: _node, type, ...props}: {node?: unknown; type?: string} & React.HTMLProps<HTMLOListElement>) => <ol type={type as "1" | "a" | "i" | "A" | "I" | undefined} {...props} className="list-decimal ml-4 mb-3 mt-1 space-y-1 not-italic" />,
                      // eslint-disable-next-line @typescript-eslint/no-unused-vars
                      li: ({node: _node, ...props}: {node?: unknown} & React.HTMLProps<HTMLLIElement>) => <li {...props} className="leading-relaxed" />,
                      // eslint-disable-next-line @typescript-eslint/no-unused-vars
                      strong: ({node: _node, ...props}: {node?: unknown} & React.HTMLProps<HTMLElement>) => <strong {...props} className="font-semibold" />
                    }}
                  >
                    {reflection}
                  </ReactMarkdown>
                </div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full -mr-16 -mt-16 blur-3xl" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="space-y-6">
          <div className="glass p-6 rounded-3xl border border-primary/10">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-primary" />
              Recent Reflections
            </h3>
            <div className="space-y-4">
              {recentEntries.length ? (
                recentEntries.map((entry) => (
                  <button
                    key={entry.id}
                    className="w-full text-left p-4 rounded-2xl bg-muted/20 border border-border/10 hover:bg-muted/40 transition-colors cursor-pointer"
                    onClick={() => {
                      setContent(entry.content);
                      setReflection(entry.reflection);
                    }}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[10px] font-bold text-primary uppercase">{entry.dateLabel}</span>
                      <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                        Saved
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-1">{entry.preview}</p>
                  </button>
                ))
              ) : (
                <p className="text-xs text-muted-foreground">No saved entries yet. Write your first reflection.</p>
              )}
            </div>
          </div>

          <div className="glass p-6 rounded-3xl border border-primary/10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                Daily Prompts
              </h3>
              <Button variant="ghost" size="icon-sm" onClick={() => setContent('')} title="Clear Editor">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
            <ul className="space-y-3">
              {prompts.map((prompt) => (
                <li key={prompt}>
                  <button
                    className="w-full text-left text-xs text-muted-foreground p-3 rounded-xl bg-muted/10 border border-border/5 hover:border-primary/20 transition-all cursor-pointer"
                    onClick={() => setContent((prev) => (prev ? `${prev}\n\n${prompt}` : prompt))}
                  >
                    {prompt}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
