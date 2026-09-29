'use client';

import React, { useState } from 'react';
import { INITIAL_THREADS } from '@/data/community';
import { CommunityThread, CommunityReply } from '@/types';
import {
  MessageSquare,
  ThumbsUp,
  ShieldCheck,
  PlusCircle,
  Search,
  Filter,
  User,
  Send,
  X,
  Sparkles,
  HeartHandshake
} from 'lucide-react';

export const CommunitySection: React.FC = () => {
  const [threads, setThreads] = useState<CommunityThread[]>(INITIAL_THREADS);
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeThread, setActiveThread] = useState<CommunityThread | null>(null);
  const [replyText, setReplyText] = useState<string>('');
  const [isNewPostOpen, setIsNewPostOpen] = useState<boolean>(false);

  // New post form state
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Beginners');
  const [newContent, setNewContent] = useState('');
  const [newAuthor, setNewAuthor] = useState('');
  const [newRole, setNewRole] = useState<'Wearer' | 'Keyholder' | 'Educator' | 'Practitioner'>('Wearer');

  const allTags = ['all', 'Beginners', 'Sleep Safety', 'Hygiene', 'Consent', 'Agreements', 'Materials'];

  const filteredThreads = threads.filter(thread => {
    const matchesTag =
      selectedTag === 'all' ||
      thread.tags.some(t => t.toLowerCase() === selectedTag.toLowerCase()) ||
      thread.category.toLowerCase().includes(selectedTag.toLowerCase());

    const matchesSearch =
      thread.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      thread.content.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTag && matchesSearch;
  });

  const handleUpvote = (threadId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setThreads(prev =>
      prev.map(t => (t.id === threadId ? { ...t, upvotes: t.upvotes + 1 } : t))
    );
    if (activeThread && activeThread.id === threadId) {
      setActiveThread(prev => (prev ? { ...prev, upvotes: prev.upvotes + 1 } : null));
    }
  };

  const handleAddReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !activeThread) return;

    const newReply: CommunityReply = {
      id: `reply-${Date.now()}`,
      author: 'You (Community Member)',
      authorRole: 'Wearer',
      date: 'Just now',
      text: replyText.trim()
    };

    const updated = {
      ...activeThread,
      replies: [...activeThread.replies, newReply],
      repliesCount: activeThread.repliesCount + 1
    };

    setActiveThread(updated);
    setThreads(prev => prev.map(t => (t.id === activeThread.id ? updated : t)));
    setReplyText('');
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const newPost: CommunityThread = {
      id: `thread-${Date.now()}`,
      title: newTitle.trim(),
      category: newCategory,
      author: newAuthor.trim() || 'Anonymous Explorer',
      authorRole: newRole,
      date: 'Just now',
      tags: [newCategory],
      upvotes: 1,
      repliesCount: 0,
      isSafetyVerified: false,
      content: newContent.trim(),
      replies: []
    };

    setThreads([newPost, ...threads]);
    setIsNewPostOpen(false);
    setNewTitle('');
    setNewContent('');
    setNewAuthor('');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-300 text-xs font-semibold border border-indigo-200 dark:border-indigo-800">
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Peer Sanctuary & Support</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-stone-900 dark:text-stone-100">
          Safe Space Discussions & Community
        </h1>
        <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
          Ask questions, share experiences, and receive constructive guidance in a strictly moderated, judgment-free peer sanctuary.
        </p>
      </div>

      {/* Community Standards Banner */}
      <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-stone-700 dark:text-stone-300">
          <HeartHandshake className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
          <span>
            <strong>Community Guidelines:</strong> Zero tolerance for coercion, non-consensual exploitation, shame, or commercial advertising.
          </span>
        </div>
        <button
          onClick={() => setIsNewPostOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-xs transition-colors whitespace-nowrap"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Start a Discussion</span>
        </button>
      </div>

      {/* Search & Tags */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-stone-600 dark:text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search discussions, sizing tips, hygiene advice..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-xs text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-xs"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-stone-600 dark:text-stone-400 flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5" /> Tags:
          </span>
          {allTags.map(tag => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-3 py-1 rounded-xl text-xs font-medium transition-colors ${
                selectedTag === tag
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-400 border border-stone-200 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700'
              }`}
            >
              {tag === 'all' ? 'All Topics' : tag}
            </button>
          ))}
        </div>
      </div>

      {/* Threads List */}
      <div className="space-y-4">
        {filteredThreads.map(thread => (
          <div
            key={thread.id}
            onClick={() => setActiveThread(thread)}
            className="group cursor-pointer rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-5 shadow-xs hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-900 transition-all space-y-3"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap text-xs">
                  <span className="font-semibold text-stone-900 dark:text-stone-100">
                    {thread.author}
                  </span>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                    {thread.authorRole}
                  </span>
                  <span className="text-stone-600 dark:text-stone-400">&bull; {thread.date}</span>

                  {thread.isSafetyVerified && (
                    <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 font-semibold">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      Safety Verified
                    </span>
                  )}
                </div>

                <h2 className="text-base font-bold text-stone-900 dark:text-stone-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {thread.title}
                </h2>
              </div>

              {/* Upvote button */}
              <button
                onClick={e => handleUpvote(thread.id, e)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800 text-xs text-stone-700 dark:text-stone-300 transition-colors"
                title="Helpful topic"
              >
                <ThumbsUp className="w-3.5 h-3.5" />
                <span className="font-semibold">{thread.upvotes}</span>
              </button>
            </div>

            <p className="text-xs text-stone-600 dark:text-stone-300 line-clamp-2 leading-relaxed">
              {thread.content}
            </p>

            <div className="flex items-center justify-between pt-2 border-t border-stone-100 dark:border-stone-800/80 text-xs">
              <div className="flex items-center gap-1.5">
                {thread.tags.map((t, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] px-2 py-0.5 rounded-md bg-stone-50 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200/60 dark:border-stone-700"
                  >
                    #{t}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-1 text-stone-600 dark:text-stone-400">
                <MessageSquare className="w-3.5 h-3.5" />
                <span>{thread.repliesCount} replies</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Active Thread Detail Modal */}
      {activeThread && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-md animate-in fade-in duration-200"
        >
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl text-stone-900 dark:text-stone-100 overflow-hidden">
            {/* Thread Header */}
            <div className="p-6 border-b border-stone-200 dark:border-stone-800 flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-semibold">{activeThread.author}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                    {activeThread.authorRole}
                  </span>
                  <span className="text-stone-600 dark:text-stone-400">&bull; {activeThread.date}</span>
                </div>
                <h2 className="text-lg font-bold tracking-tight text-stone-900 dark:text-stone-100">
                  {activeThread.title}
                </h2>
              </div>
              <button
                onClick={() => setActiveThread(null)}
                className="p-1.5 rounded-lg text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                aria-label="Close thread modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Thread Body & Replies */}
            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              {/* Question Text */}
              <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed whitespace-pre-line">
                {activeThread.content}
              </div>

              {/* Replies Header */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-stone-400">
                  Community Replies ({activeThread.replies.length})
                </h3>

                {activeThread.replies.map(reply => (
                  <div
                    key={reply.id}
                    className={`p-4 rounded-2xl border text-xs sm:text-sm space-y-2 ${
                      reply.isSafetyTip
                        ? 'bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800'
                        : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-stone-900 dark:text-stone-100 text-xs">
                          {reply.author}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                          {reply.authorRole}
                        </span>
                        <span className="text-[10px] text-stone-600 dark:text-stone-400">
                          &bull; {reply.date}
                        </span>
                      </div>

                      {reply.isSafetyTip && (
                        <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold border border-emerald-300 dark:border-emerald-800">
                          <ShieldCheck className="w-3 h-3 text-emerald-600" />
                          Verified Advice
                        </span>
                      )}
                    </div>

                    <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed whitespace-pre-line">
                      {reply.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Post Reply Bar */}
            <form onSubmit={handleAddReply} className="p-4 border-t border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/50 flex gap-2">
              <input
                type="text"
                placeholder="Write a supportive, constructive response..."
                value={replyText}
                onChange={e => setReplyText(e.target.value)}
                className="flex-1 px-3.5 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-xs text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                type="submit"
                disabled={!replyText.trim()}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <span>Reply</span>
                <Send className="w-3 h-3" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* New Topic Modal */}
      {isNewPostOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-md animate-in fade-in duration-200"
        >
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl text-stone-900 dark:text-stone-100 space-y-5">
            <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-3">
              <h2 className="text-base font-bold">Start a Community Discussion</h2>
              <button
                onClick={() => setIsNewPostOpen(false)}
                className="p-1 rounded-lg text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold mb-1">Your Name / Pseudonym</label>
                <input
                  type="text"
                  placeholder="e.g. Alex_W or Anonymous Explorer"
                  value={newAuthor}
                  onChange={e => setNewAuthor(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Your Perspective / Role</label>
                <select
                  value={newRole}
                  onChange={e => setNewRole(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Wearer">Wearer</option>
                  <option value="Keyholder">Keyholder</option>
                  <option value="Educator">Educator / Health Professional</option>
                  <option value="Practitioner">Practitioner</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Topic Title</label>
                <input
                  type="text"
                  placeholder="What is your question or discussion point?"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  required
                  className="w-full p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Category Tag</label>
                <select
                  value={newCategory}
                  onChange={e => setNewCategory(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Beginners">Beginners</option>
                  <option value="Sleep Safety">Sleep Safety</option>
                  <option value="Hygiene">Hygiene & Skin Health</option>
                  <option value="Agreements">Agreements & Boundaries</option>
                  <option value="Materials">Materials & Hardware</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Details & Context</label>
                <textarea
                  rows={4}
                  placeholder="Share details clearly while respecting privacy and community standards..."
                  value={newContent}
                  onChange={e => setNewContent(e.target.value)}
                  required
                  className="w-full p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewPostOpen(false)}
                  className="w-1/3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-2/3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-xs"
                >
                  Publish Topic
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
