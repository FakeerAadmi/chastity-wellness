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
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#251433] text-[#d94f6f] border border-[#4a2c59] text-xs font-semibold">
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Peer Sanctuary & Support</span>
        </div>
        <h1 className="text-3xl font-black tracking-tight text-[#fae8d7]">
          Safe Space Discussions & Community
        </h1>
        <p className="text-xs sm:text-sm text-[#b59ebf] max-w-xl mx-auto">
          Ask questions, share experiences, and receive constructive guidance in a strictly moderated, judgment-free peer sanctuary.
        </p>
      </div>

      {/* Community Standards Banner */}
      <div className="p-5 rounded-3xl bg-[#1c1026] border border-[#381e47] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5 text-[#b59ebf]">
          <HeartHandshake className="w-5 h-5 text-[#d94f6f] shrink-0" />
          <span>
            <strong className="text-[#fae8d7]">Community Guidelines:</strong> Zero tolerance for coercion, non-consensual exploitation, shame, or commercial advertising.
          </span>
        </div>
        <button
          onClick={() => setIsNewPostOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#d94f6f] to-[#be185d] text-white font-bold text-xs shadow-md shadow-[#d94f6f]/20 transition-transform hover:scale-[1.02] shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Start a Discussion</span>
        </button>
      </div>

      {/* Search & Tags */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-[#b59ebf] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search discussions, sizing tips, hygiene advice..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#381e47] bg-[#1c1026] text-xs text-[#fae8d7] placeholder:text-[#b59ebf]/50 focus:outline-none focus:ring-2 focus:ring-[#d94f6f]"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-[#b59ebf] flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5" /> Tags:
          </span>
          {allTags.map(tag => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold transition-colors ${
                selectedTag === tag
                  ? 'bg-[#d94f6f] text-white shadow-xs'
                  : 'bg-[#1c1026] text-[#b59ebf] border border-[#381e47] hover:border-[#4a2c59] hover:text-[#fae8d7]'
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
            className="group cursor-pointer rounded-3xl bg-[#1c1026] border border-[#381e47] p-6 shadow-xs hover:border-[#d94f6f]/60 hover:shadow-lg hover:shadow-[#d94f6f]/10 transition-all space-y-3"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap text-xs">
                  <span className="font-bold text-[#fae8d7]">
                    {thread.author}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#251433] text-[#b59ebf] border border-[#4a2c59]">
                    {thread.authorRole}
                  </span>
                  <span className="text-[#b59ebf]">&bull; {thread.date}</span>

                  {thread.isSafetyVerified && (
                    <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-[#251433] text-[#d94f6f] border border-[#d94f6f]/50 font-bold">
                      <ShieldCheck className="w-3 h-3 text-[#d94f6f]" />
                      Safety Verified
                    </span>
                  )}
                </div>

                <h2 className="text-base font-bold text-[#fae8d7] group-hover:text-[#d94f6f] transition-colors">
                  {thread.title}
                </h2>
              </div>

              {/* Upvote button */}
              <button
                onClick={e => handleUpvote(thread.id, e)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#381e47] hover:bg-[#251433] text-xs text-[#fae8d7] transition-colors"
                title="Helpful topic"
              >
                <ThumbsUp className="w-3.5 h-3.5 text-[#d94f6f]" />
                <span className="font-bold">{thread.upvotes}</span>
              </button>
            </div>

            <p className="text-xs text-[#b59ebf] line-clamp-2 leading-relaxed">
              {thread.content}
            </p>

            <div className="flex items-center justify-between pt-3 border-t border-[#251433] text-xs">
              <div className="flex items-center gap-1.5">
                {thread.tags.map((t, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] px-2 py-0.5 rounded-md bg-[#0f0714] text-[#b59ebf] border border-[#381e47]"
                  >
                    #{t}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-1 text-[#b59ebf]">
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
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0a030c]/85 backdrop-blur-md animate-in fade-in duration-200"
        >
          <div className="bg-[#1c1026] border border-[#381e47] rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl text-[#fae8d7] overflow-hidden">
            {/* Thread Header */}
            <div className="p-6 border-b border-[#251433] flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-bold">{activeThread.author}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#251433] text-[#b59ebf] border border-[#4a2c59]">
                    {activeThread.authorRole}
                  </span>
                  <span className="text-[#b59ebf]">&bull; {activeThread.date}</span>
                </div>
                <h2 className="text-lg font-bold tracking-tight text-[#fae8d7]">
                  {activeThread.title}
                </h2>
              </div>
              <button
                onClick={() => setActiveThread(null)}
                className="p-1.5 rounded-lg text-[#b59ebf] hover:text-[#fae8d7] hover:bg-[#251433] transition-colors"
                aria-label="Close thread modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Thread Body & Replies */}
            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              {/* Question Text */}
              <div className="p-4 rounded-2xl bg-[#0f0714] border border-[#381e47] text-xs sm:text-sm text-[#b59ebf] leading-relaxed whitespace-pre-line">
                {activeThread.content}
              </div>

              {/* Replies Header */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#fae8d7]">
                  Community Replies ({activeThread.replies.length})
                </h3>

                {activeThread.replies.map(reply => (
                  <div
                    key={reply.id}
                    className={`p-4 rounded-2xl border text-xs sm:text-sm space-y-2 ${
                      reply.isSafetyTip
                        ? 'bg-[#251433] border-[#d94f6f]/50'
                        : 'bg-[#0f0714] border-[#381e47]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#fae8d7] text-xs">
                          {reply.author}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#1c1026] text-[#b59ebf] border border-[#381e47]">
                          {reply.authorRole}
                        </span>
                        <span className="text-[10px] text-[#b59ebf]">
                          &bull; {reply.date}
                        </span>
                      </div>

                      {reply.isSafetyTip && (
                        <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-[#0f0714] text-[#d94f6f] font-bold border border-[#d94f6f]/40">
                          <ShieldCheck className="w-3 h-3 text-[#d94f6f]" />
                          Verified Advice
                        </span>
                      )}
                    </div>

                    <p className="text-xs sm:text-sm text-[#b59ebf] leading-relaxed whitespace-pre-line">
                      {reply.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Post Reply Bar */}
            <form onSubmit={handleAddReply} className="p-4 border-t border-[#251433] bg-[#0f0714] flex gap-2">
              <input
                type="text"
                placeholder="Write a supportive, constructive response..."
                value={replyText}
                onChange={e => setReplyText(e.target.value)}
                className="flex-1 px-3.5 py-2.5 rounded-xl border border-[#381e47] bg-[#1c1026] text-xs text-[#fae8d7] focus:outline-none focus:ring-2 focus:ring-[#d94f6f]"
              />
              <button
                type="submit"
                disabled={!replyText.trim()}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#d94f6f] to-[#be185d] disabled:opacity-50 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
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
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0a030c]/85 backdrop-blur-md animate-in fade-in duration-200"
        >
          <div className="bg-[#1c1026] border border-[#381e47] rounded-3xl max-w-lg w-full p-6 shadow-2xl text-[#fae8d7] space-y-5">
            <div className="flex items-center justify-between border-b border-[#251433] pb-3">
              <h2 className="text-base font-bold">Start a Community Discussion</h2>
              <button
                onClick={() => setIsNewPostOpen(false)}
                className="p-1 rounded-lg text-[#b59ebf] hover:text-[#fae8d7] hover:bg-[#251433]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold mb-1 text-[#fae8d7]">Your Name / Pseudonym</label>
                <input
                  type="text"
                  placeholder="e.g. Alex_W or Anonymous Explorer"
                  value={newAuthor}
                  onChange={e => setNewAuthor(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#381e47] bg-[#0f0714] text-[#fae8d7] focus:outline-none focus:ring-2 focus:ring-[#d94f6f]"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-[#fae8d7]">Your Perspective / Role</label>
                <select
                  value={newRole}
                  onChange={e => setNewRole(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl border border-[#381e47] bg-[#0f0714] text-[#fae8d7] focus:outline-none focus:ring-2 focus:ring-[#d94f6f]"
                >
                  <option value="Wearer">Wearer</option>
                  <option value="Keyholder">Keyholder</option>
                  <option value="Educator">Educator / Health Professional</option>
                  <option value="Practitioner">Practitioner</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1 text-[#fae8d7]">Topic Title</label>
                <input
                  type="text"
                  placeholder="What is your question or discussion point?"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  required
                  className="w-full p-2.5 rounded-xl border border-[#381e47] bg-[#0f0714] text-[#fae8d7] focus:outline-none focus:ring-2 focus:ring-[#d94f6f]"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-[#fae8d7]">Category Tag</label>
                <select
                  value={newCategory}
                  onChange={e => setNewCategory(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#381e47] bg-[#0f0714] text-[#fae8d7] focus:outline-none focus:ring-2 focus:ring-[#d94f6f]"
                >
                  <option value="Beginners">Beginners</option>
                  <option value="Sleep Safety">Sleep Safety</option>
                  <option value="Hygiene">Hygiene & Skin Health</option>
                  <option value="Agreements">Agreements & Boundaries</option>
                  <option value="Materials">Materials & Hardware</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1 text-[#fae8d7]">Details & Context</label>
                <textarea
                  rows={4}
                  placeholder="Share details clearly while respecting privacy and community standards..."
                  value={newContent}
                  onChange={e => setNewContent(e.target.value)}
                  required
                  className="w-full p-2.5 rounded-xl border border-[#381e47] bg-[#0f0714] text-[#fae8d7] focus:outline-none focus:ring-2 focus:ring-[#d94f6f]"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewPostOpen(false)}
                  className="w-1/3 py-2 rounded-xl border border-[#381e47] text-[#b59ebf] hover:bg-[#251433]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-2/3 py-2 rounded-xl bg-gradient-to-r from-[#d94f6f] to-[#be185d] text-white font-bold"
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
