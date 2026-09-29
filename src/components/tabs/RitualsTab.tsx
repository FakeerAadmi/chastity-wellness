'use client';

import React, { useState } from 'react';
import {
  Heart,
  CheckCircle2,
  ListTodo,
  BookHeart,
  Sparkles,
  Plus,
  Smile,
  ShieldCheck,
  Send,
  Coffee,
  Check
} from 'lucide-react';

export const RitualsTab: React.FC = () => {
  // Pulse check state
  const [selectedMood, setSelectedMood] = useState<string>('Connected');
  const [comfortRating, setComfortRating] = useState<number>(4);
  const [pulseNote, setPulseNote] = useState<string>('');
  const [pulseSubmitted, setPulseSubmitted] = useState<boolean>(false);

  // Tasks state
  const [tasks, setTasks] = useState<{ id: string; title: string; completed: boolean; category: string }[]>([
    { id: '1', title: 'Morning hygiene shower & gentle skin pat-dry', completed: true, category: 'Wellness' },
    { id: '2', title: 'Hydration ritual: drink 2L water through workday', completed: false, category: 'Health' },
    { id: '3', title: '10-minute mindfulness breathing & urge surrender', completed: false, category: 'Mindfulness' },
    { id: '4', title: 'Send a respectful mid-day appreciation text to Keyholder', completed: false, category: 'Intimacy' },
    { id: '5', title: 'Evening skin inspection under warm ambient lighting', completed: false, category: 'Safety' },
  ]);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  // Journal entries state
  const [journalText, setJournalText] = useState('');
  const [journalEntries, setJournalEntries] = useState<{ id: string; date: string; text: string }[]>([
    {
      id: 'entry-1',
      date: 'Yesterday, 9:30 PM',
      text: 'Surrendering physical release today shifted my focus completely to emotional presence with my partner. I noticed heightened sensitivity to simple touch and conversation.'
    }
  ]);

  const moods = [
    { label: 'Connected', icon: '💖' },
    { label: 'Anticipating', icon: '✨' },
    { label: 'Vulnerable', icon: '🕊️' },
    { label: 'Peaceful', icon: '🌿' },
    { label: 'Challenged', icon: '⚡' }
  ];

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => (t.id === id ? { ...t, completed: !t.completed } : t)));
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    setTasks([
      ...tasks,
      {
        id: `task-${Date.now()}`,
        title: newTaskTitle.trim(),
        completed: false,
        category: 'Custom'
      }
    ]);
    setNewTaskTitle('');
  };

  const handleSavePulse = (e: React.FormEvent) => {
    e.preventDefault();
    setPulseSubmitted(true);
    setTimeout(() => setPulseSubmitted(false), 2500);
  };

  const handleAddJournal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!journalText.trim()) return;
    setJournalEntries([
      {
        id: `journal-${Date.now()}`,
        date: 'Just now',
        text: journalText.trim()
      },
      ...journalEntries
    ]);
    setJournalText('');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#251433] text-[#d94f6f] border border-[#4a2c59] text-xs font-semibold">
          <Heart className="w-3.5 h-3.5" />
          <span>Relationship & Dynamic Rituals</span>
        </div>
        <h1 className="text-3xl font-black tracking-tight text-[#fae8d7]">
          Intimacy Rituals & Connection Board
        </h1>
        <p className="text-xs sm:text-sm text-[#b59ebf] max-w-xl mx-auto">
          Deepen your relationship dynamic through daily connection pulses, keyholder-assigned mindfulness tasks, shared reflections, and emotional aftercare.
        </p>
      </div>

      {/* Daily Intimacy Pulse (Kneel-inspired) */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#1c1026] border border-[#381e47] space-y-6">
        <div className="flex items-center justify-between border-b border-[#251433] pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#251433] text-[#d94f6f]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#fae8d7]">Daily Dynamic Pulse</h2>
              <p className="text-xs text-[#b59ebf]">Share your current emotional & physical state</p>
            </div>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-[#251433] text-[#d94f6f] border border-[#4a2c59] font-medium">
            Evening Ritual
          </span>
        </div>

        <form onSubmit={handleSavePulse} className="space-y-5 text-xs">
          {/* Mood Selector */}
          <div className="space-y-2">
            <label className="font-semibold text-[#fae8d7] uppercase tracking-wider block">
              1. Emotional Resonance
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {moods.map(m => (
                <button
                  type="button"
                  key={m.label}
                  onClick={() => setSelectedMood(m.label)}
                  className={`p-3 rounded-2xl border text-center transition-all ${
                    selectedMood === m.label
                      ? 'bg-[#251433] border-[#d94f6f] shadow-md shadow-[#d94f6f]/15'
                      : 'bg-[#1c1026] border-[#381e47] hover:border-[#4a2c59]'
                  }`}
                >
                  <span className="text-lg block mb-1">{m.icon}</span>
                  <span className="font-semibold text-[#fae8d7] block">{m.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Comfort Rating */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="font-semibold text-[#fae8d7] uppercase tracking-wider">
                2. Physical Comfort Score
              </label>
              <span className="font-mono font-bold text-[#d94f6f]">{comfortRating} / 5</span>
            </div>
            <input
              type="range"
              min="1"
              max="5"
              value={comfortRating}
              onChange={e => setComfortRating(parseInt(e.target.value))}
              aria-label="Physical Comfort Score"
              className="w-full accent-[#d94f6f]"
            />
            <div className="flex justify-between text-[10px] text-[#b59ebf]">
              <span>1 - Uncomfortable / Needs adjustment</span>
              <span>3 - Moderate</span>
              <span>5 - Perfectly ergonomic & relaxed</span>
            </div>
          </div>

          {/* Reflection note */}
          <div className="space-y-2">
            <label className="font-semibold text-[#fae8d7] uppercase tracking-wider block">
              3. Note to Keyholder / Personal Reflection
            </label>
            <textarea
              rows={2}
              placeholder="What feels wonderful today? Any physical or emotional points to share?"
              value={pulseNote}
              onChange={e => setPulseNote(e.target.value)}
              className="w-full p-3 rounded-xl border border-[#381e47] bg-[#0f0714] text-xs text-[#fae8d7] focus:outline-none focus:ring-2 focus:ring-[#d94f6f]"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#d94f6f] to-[#be185d] text-white font-bold transition-transform hover:scale-[1.01] flex items-center justify-center gap-2"
          >
            {pulseSubmitted ? (
              <>
                <Check className="w-4 h-4" />
                <span>Daily Pulse Recorded!</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Submit Daily Pulse</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Keyholder Tasks & Intimacy Journal Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Task Board */}
        <div className="p-6 rounded-3xl bg-[#1c1026] border border-[#381e47] space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-bold text-[#fae8d7]">
              <ListTodo className="w-4 h-4 text-[#d94f6f]" />
              <span>Daily Wellness & Intimacy Tasks</span>
            </div>
            <span className="text-[10px] font-mono text-[#d94f6f] bg-[#251433] px-2 py-0.5 rounded-md border border-[#4a2c59]">
              {tasks.filter(t => t.completed).length}/{tasks.length} Done
            </span>
          </div>

          <div className="space-y-2">
            {tasks.map(task => (
              <div
                key={task.id}
                onClick={() => toggleTask(task.id)}
                className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center justify-between text-xs ${
                  task.completed
                    ? 'bg-[#251433]/50 border-[#381e47] text-[#b59ebf] line-through'
                    : 'bg-[#0f0714] border-[#381e47] text-[#fae8d7] hover:border-[#d94f6f]/50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-4 h-4 rounded-md border flex items-center justify-center ${
                      task.completed
                        ? 'bg-[#d94f6f] border-[#d94f6f] text-white'
                        : 'border-[#4a2c59]'
                    }`}
                  >
                    {task.completed && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <span>{task.title}</span>
                </div>
                <span className="text-[10px] text-[#b59ebf] font-mono">{task.category}</span>
              </div>
            ))}
          </div>

          {/* Add task */}
          <form onSubmit={handleAddTask} className="flex gap-2 pt-2">
            <input
              type="text"
              placeholder="Add new partner/wellness task..."
              value={newTaskTitle}
              onChange={e => setNewTaskTitle(e.target.value)}
              className="flex-1 p-2 rounded-xl border border-[#381e47] bg-[#0f0714] text-xs text-[#fae8d7] focus:outline-none focus:ring-1 focus:ring-[#d94f6f]"
            />
            <button
              type="submit"
              className="px-3 py-2 rounded-xl bg-[#251433] hover:bg-[#381e47] text-[#d94f6f] border border-[#4a2c59] text-xs font-bold"
            >
              <Plus className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Intimacy & Gratitude Journal */}
        <div className="p-6 rounded-3xl bg-[#1c1026] border border-[#381e47] space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-[#fae8d7]">
            <BookHeart className="w-4 h-4 text-[#d94f6f]" />
            <span>Intimacy & Vulnerability Journal</span>
          </div>

          <form onSubmit={handleAddJournal} className="space-y-2">
            <textarea
              rows={3}
              placeholder="Record feelings of surrender, gratitude, or lessons learned today..."
              value={journalText}
              onChange={e => setJournalText(e.target.value)}
              className="w-full p-3 rounded-xl border border-[#381e47] bg-[#0f0714] text-xs text-[#fae8d7] focus:outline-none focus:ring-1 focus:ring-[#d94f6f]"
            />
            <button
              type="submit"
              disabled={!journalText.trim()}
              className="w-full py-2 rounded-xl bg-[#251433] hover:bg-[#381e47] disabled:opacity-50 text-[#fae8d7] text-xs font-semibold border border-[#4a2c59] transition-colors"
            >
              Add Journal Entry
            </button>
          </form>

          {/* Journal Entries List */}
          <div className="space-y-3 pt-2 max-h-56 overflow-y-auto pr-1">
            {journalEntries.map(entry => (
              <div
                key={entry.id}
                className="p-3.5 rounded-2xl bg-[#0f0714] border border-[#381e47] text-xs space-y-1"
              >
                <span className="text-[10px] text-[#d94f6f] font-mono block font-semibold">
                  {entry.date}
                </span>
                <p className="text-[#b59ebf] leading-relaxed">{entry.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Aftercare & Debrief Routine (Kneel / BDSM Best Practice) */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-[#251433] to-[#1c1026] border border-[#4a2c59] space-y-3 text-xs">
        <div className="flex items-center gap-2 text-sm font-bold text-[#fae8d7]">
          <Coffee className="w-4 h-4 text-[#d94f6f]" />
          <span>The Aftercare & Debrief Protocol (Post-Unlock)</span>
        </div>
        <p className="text-[#b59ebf] leading-relaxed">
          Following release or unlocking, both wearers and keyholders often experience dopamine depletion (&quot;drop&quot;). Use this 3-question debrief:
        </p>
        <ul className="space-y-1.5 list-disc list-inside text-[#fae8d7]/90 pl-1">
          <li><strong>Physical Inspection:</strong> Did any pinch point or friction area develop that requires healing time?</li>
          <li><strong>Emotional Validation:</strong> Did you feel safe, valued, and respected throughout the session?</li>
          <li><strong>Reconnection:</strong> Plan 20 minutes of non-erotic quiet bonding (tea, warm blanket, quiet cuddle).</li>
        </ul>
      </div>
    </div>
  );
};
