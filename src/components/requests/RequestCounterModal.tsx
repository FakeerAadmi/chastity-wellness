'use client';

import React, { useState } from 'react';
import { X, GitFork, Clock, FileText, Check } from 'lucide-react';
import { HavenRequest } from '@/types/domain';

interface RequestCounterModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: HavenRequest;
  onSendCounterProposal: (
    requestId: string,
    modifiedTitle: string,
    modifiedConditions: string,
    modifiedDurationMinutes: number | undefined,
    note: string
  ) => void;
}

export const RequestCounterModal: React.FC<RequestCounterModalProps> = ({
  isOpen,
  onClose,
  request,
  onSendCounterProposal,
}) => {
  const [note, setNote] = useState('');
  const [modifiedTitle, setModifiedTitle] = useState(request.title);
  const [modifiedConditions, setModifiedConditions] = useState(request.conditions || '');
  const [modifiedDuration, setModifiedDuration] = useState<number | undefined>(
    request.durationMinutes ? Math.floor(request.durationMinutes / 2) : 30
  );

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!note.trim()) return;

    onSendCounterProposal(
      request.id,
      modifiedTitle.trim(),
      modifiedConditions.trim(),
      modifiedDuration,
      note.trim()
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg rounded-3xl bg-[#160d20] border border-[#3b1f4c] shadow-2xl p-6 sm:p-8 space-y-6 text-[#fae8d7]">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#251433] text-[#c084fc] text-xs font-semibold border border-[#4a2c59]">
              <GitFork className="w-3.5 h-3.5" />
              <span>Counter-Proposal</span>
            </div>
            <h2 className="text-xl font-bold tracking-tight text-[#fae8d7]">
              Propose Adjusted Terms
            </h2>
            <p className="text-xs text-[#b59ebf]">
              Instead of declining outright, suggest alternative timing or conditions.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-[#251433] text-[#b59ebf] hover:text-[#fae8d7] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Original Request Snapshot */}
        <div className="p-3.5 rounded-2xl bg-[#1c1026] border border-[#2f193d] space-y-1 text-xs">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#b59ebf]">
            Original Request
          </p>
          <p className="font-bold text-[#fae8d7]">{request.title}</p>
          {request.durationMinutes && (
            <p className="text-[#b59ebf]">
              Requested duration: <strong>{request.durationMinutes} minutes</strong>
            </p>
          )}
        </div>

        {/* Counter-proposal form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Note explaining counter proposal */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-[#b59ebf] block">
              Explanation & Rational (Required)
            </label>
            <textarea
              rows={3}
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="e.g., Today has been intense; I'd love to say yes to 30 minutes if we include a relaxing massage..."
              required
              className="w-full px-4 py-3 rounded-xl bg-[#1f112b] border border-[#3b1f4c] text-xs text-[#fae8d7] placeholder-[#6b5873] focus:outline-none focus:border-[#d94f6f]"
            />
          </div>

          {/* Adjusted duration */}
          {request.durationMinutes && (
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#b59ebf] block">
                Adjusted Duration (Minutes)
              </label>
              <input
                type="number"
                min="5"
                max="1440"
                value={modifiedDuration || ''}
                onChange={e => setModifiedDuration(e.target.value ? Number(e.target.value) : undefined)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#1f112b] border border-[#3b1f4c] text-xs text-[#fae8d7] focus:outline-none focus:border-[#d94f6f]"
              />
            </div>
          )}

          {/* Adjusted Conditions */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-[#b59ebf] block">
              Adjusted Conditions / Requirements
            </label>
            <input
              type="text"
              value={modifiedConditions}
              onChange={e => setModifiedConditions(e.target.value)}
              placeholder="e.g., Mandatory relock confirmation photo by 21:00"
              className="w-full px-4 py-2.5 rounded-xl bg-[#1f112b] border border-[#3b1f4c] text-xs text-[#fae8d7] placeholder-[#6b5873] focus:outline-none focus:border-[#d94f6f]"
            />
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#2a1738]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-[#b59ebf] hover:text-[#fae8d7] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#c084fc] to-[#d94f6f] text-white text-xs font-bold shadow-md hover:opacity-95 transition-opacity"
            >
              Send Counter-Proposal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
