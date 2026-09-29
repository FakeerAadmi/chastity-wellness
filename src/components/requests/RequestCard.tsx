'use client';

import React, { useState } from 'react';
import {
  Key,
  MessageSquare,
  Clock,
  CheckCircle2,
  XCircle,
  HelpCircle,
  GitFork,
  AlertCircle,
  Users,
  Calendar,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Sparkles,
  ShieldAlert
} from 'lucide-react';
import { HavenRequest, HavenRequestStatus, User } from '@/types/domain';
import { RequestCounterModal } from './RequestCounterModal';

interface RequestCardProps {
  request: HavenRequest;
  currentUser: User;
  allUsers: User[];
  onRespond: (
    requestId: string,
    action: 'accept' | 'decline' | 'discuss' | 'not_now',
    note?: string
  ) => void;
  onCounterPropose: (
    requestId: string,
    modifiedTitle: string,
    modifiedConditions: string,
    modifiedDurationMinutes: number | undefined,
    note: string
  ) => void;
  onWithdraw?: (requestId: string) => void;
}

export const RequestCard: React.FC<RequestCardProps> = ({
  request,
  currentUser,
  allUsers,
  onRespond,
  onCounterPropose,
  onWithdraw,
}) => {
  const [isCounterModalOpen, setIsCounterModalOpen] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [responseNoteInput, setResponseNoteInput] = useState('');
  const [showNoteField, setShowNoteField] = useState(false);
  const [activeAction, setActiveAction] = useState<'accept' | 'decline' | 'discuss' | 'not_now' | null>(null);

  const requester = allUsers.find(u => u.id === request.requesterId) || {
    id: request.requesterId,
    displayName: 'Partner',
  };

  const recipients = request.recipientIds.map(
    id => allUsers.find(u => u.id === id) || { id, displayName: 'Partner' }
  );

  const isRequester = currentUser.id === request.requesterId;
  const isRecipient = request.recipientIds.includes(currentUser.id);

  const getStatusBadge = (status: HavenRequestStatus) => {
    switch (status) {
      case 'accepted':
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/40 text-[11px] font-bold">
            <CheckCircle2 className="w-3 h-3" />
            Accepted
          </span>
        );
      case 'declined':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#ef4444]/20 text-[#ef4444] border border-[#ef4444]/40 text-[11px] font-bold">
            <XCircle className="w-3 h-3" />
            Declined
          </span>
        );
      case 'discussing':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#eab308]/20 text-[#eab308] border border-[#eab308]/40 text-[11px] font-bold">
            <MessageSquare className="w-3 h-3" />
            Discussion Requested
          </span>
        );
      case 'counter_proposed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#c084fc]/20 text-[#c084fc] border border-[#c084fc]/40 text-[11px] font-bold">
            <GitFork className="w-3 h-3" />
            Counter-Proposed
          </span>
        );
      case 'not_now':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#64748b]/20 text-[#94a3b8] border border-[#64748b]/40 text-[11px] font-bold">
            <Clock className="w-3 h-3" />
            Rain Check / Not Now
          </span>
        );
      case 'withdrawn':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#475569]/20 text-[#94a3b8] border border-[#475569]/40 text-[11px] font-bold">
            Withdrawn
          </span>
        );
      case 'expired':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#ef4444]/20 text-[#ef4444] border border-[#ef4444]/40 text-[11px] font-bold">
            Expired
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#d94f6f]/20 text-[#d94f6f] border border-[#d94f6f]/40 text-[11px] font-bold">
            <Clock className="w-3 h-3 animate-pulse" />
            Pending Response
          </span>
        );
    }
  };

  const handleActionClick = (action: 'accept' | 'decline' | 'discuss' | 'not_now') => {
    setActiveAction(action);
    setShowNoteField(true);
  };

  const handleConfirmAction = () => {
    if (!activeAction) return;
    onRespond(request.id, activeAction, responseNoteInput.trim() || undefined);
    setShowNoteField(false);
    setActiveAction(null);
    setResponseNoteInput('');
  };

  return (
    <div className="rounded-2xl p-5 bg-[#160d20] border border-[#2f193d] hover:border-[#4d2863] transition-all space-y-4 shadow-sm">
      {/* Top Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            {/* Mode badge */}
            {request.requestMode === 'permission' ? (
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#2d123b] text-[#f472b6] border border-[#db2777]/30 flex items-center gap-1">
                <Key className="w-2.5 h-2.5" />
                Permission Request
              </span>
            ) : (
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#1f1738] text-[#c084fc] border border-[#7e22ce]/30 flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5" />
                Interpersonal Proposal
              </span>
            )}

            {/* Type tag */}
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-[#251433] text-[#b59ebf] border border-[#381e47]">
              {request.requestType.replace('_', ' ')}
            </span>

            {/* Status */}
            {getStatusBadge(request.status)}
          </div>

          <h3 className="text-base sm:text-lg font-bold text-[#fae8d7]">
            {request.title}
          </h3>

          <p className="text-xs text-[#b59ebf] flex items-center gap-2">
            <span>
              From: <strong className="text-[#fae8d7]">{isRequester ? 'You' : requester.displayName}</strong>
            </span>
            <span>•</span>
            <span>
              To:{' '}
              <strong className="text-[#fae8d7]">
                {recipients.map(r => (r.id === currentUser.id ? 'You' : r.displayName)).join(', ')}
              </strong>
            </span>
          </p>
        </div>

        {/* Duration badge */}
        {request.durationMinutes && (
          <div className="px-3 py-1.5 rounded-xl bg-[#251433] border border-[#381e47] text-right shrink-0">
            <span className="text-[10px] text-[#b59ebf] uppercase block font-semibold">Duration</span>
            <span className="text-xs font-bold text-[#fae8d7]">{request.durationMinutes} min</span>
          </div>
        )}
      </div>

      {/* Description */}
      {request.description && (
        <p className="text-xs sm:text-sm text-[#d4c3d9] leading-relaxed">
          {request.description}
        </p>
      )}

      {/* Conditions (if applicable) */}
      {request.conditions && (
        <div className="p-3 rounded-xl bg-[#1c1026] border border-[#381e47] text-xs space-y-0.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#b59ebf] block">
            Conditions & Safeguards
          </span>
          <p className="text-[#fae8d7]">{request.conditions}</p>
        </div>
      )}

      {/* Counter-Proposal Banner (if active) */}
      {request.counterProposal && request.status === 'counter_proposed' && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-[#c084fc]/20 to-[#d94f6f]/20 border border-[#c084fc]/50 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-[#fae8d7] flex items-center gap-1.5">
              <GitFork className="w-3.5 h-3.5 text-[#c084fc]" />
              Counter-Proposal from Partner
            </span>
            {request.counterProposal.modifiedDurationMinutes && (
              <span className="text-[11px] font-bold text-[#c084fc]">
                Adjusted: {request.counterProposal.modifiedDurationMinutes} min
              </span>
            )}
          </div>
          <p className="text-xs text-[#fae8d7] font-semibold italic">
            &ldquo;{request.counterProposal.note}&rdquo;
          </p>
          {request.counterProposal.modifiedConditions && (
            <p className="text-[11px] text-[#e8cce8]">
              Proposed condition: <strong>{request.counterProposal.modifiedConditions}</strong>
            </p>
          )}

          {/* If I am the requester, I can accept or decline the counter-proposal */}
          {isRequester && (
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => onRespond(request.id, 'accept', 'Accepted counter-proposal')}
                className="px-3 py-1.5 rounded-xl bg-[#10b981] hover:bg-[#059669] text-white text-xs font-bold transition-colors flex items-center gap-1"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                Accept Counter-Proposal
              </button>
              <button
                onClick={() => onRespond(request.id, 'decline', 'Declined counter-proposal')}
                className="px-3 py-1.5 rounded-xl bg-[#251433] hover:bg-[#341b47] text-[#ef4444] border border-[#ef4444]/40 text-xs font-semibold transition-colors"
              >
                Decline
              </button>
            </div>
          )}
        </div>
      )}

      {/* Response Note (if resolved) */}
      {request.responseNote && request.status !== 'counter_proposed' && (
        <div className="p-3 rounded-xl bg-[#1c1026] border border-[#2f193d] text-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#b59ebf] block">
            Resolution Note
          </span>
          <p className="text-[#fae8d7] italic">&ldquo;{request.responseNote}&rdquo;</p>
        </div>
      )}

      {/* Interactive Recipient Actions (When Pending) */}
      {isRecipient && request.status === 'pending' && (
        <div className="pt-2 space-y-3 border-t border-[#2a1738]">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#b59ebf]">
            Respond to Proposal
          </p>

          {!showNoteField ? (
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleActionClick('accept')}
                className="px-3.5 py-2 rounded-xl bg-[#10b981] hover:bg-[#059669] text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                Accept
              </button>

              <button
                onClick={() => setIsCounterModalOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-[#c084fc]/20 hover:bg-[#c084fc]/30 text-[#c084fc] border border-[#c084fc]/40 text-xs font-bold transition-colors flex items-center gap-1.5"
              >
                <GitFork className="w-3.5 h-3.5" />
                Counter-Propose
              </button>

              <button
                onClick={() => handleActionClick('discuss')}
                className="px-3.5 py-2 rounded-xl bg-[#eab308]/20 hover:bg-[#eab308]/30 text-[#eab308] border border-[#eab308]/40 text-xs font-semibold transition-colors flex items-center gap-1.5"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                Let&apos;s Discuss
              </button>

              <button
                onClick={() => handleActionClick('not_now')}
                className="px-3.5 py-2 rounded-xl bg-[#251433] hover:bg-[#341b47] text-[#94a3b8] border border-[#381e47] text-xs font-semibold transition-colors flex items-center gap-1.5"
              >
                <Clock className="w-3.5 h-3.5" />
                Not Now
              </button>

              <button
                onClick={() => handleActionClick('decline')}
                className="px-3.5 py-2 rounded-xl bg-[#251433] hover:bg-[#ef4444]/20 text-[#ef4444] border border-[#ef4444]/30 text-xs font-semibold transition-colors flex items-center gap-1.5 ml-auto"
              >
                <XCircle className="w-3.5 h-3.5" />
                Decline
              </button>
            </div>
          ) : (
            <div className="p-3.5 rounded-2xl bg-[#1c1026] border border-[#381e47] space-y-3">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="capitalize text-[#fae8d7]">
                  Action: <strong className="text-[#d94f6f]">{activeAction}</strong>
                </span>
                <button
                  onClick={() => {
                    setShowNoteField(false);
                    setActiveAction(null);
                  }}
                  className="text-[#b59ebf] hover:text-[#fae8d7]"
                >
                  Cancel
                </button>
              </div>
              <input
                type="text"
                value={responseNoteInput}
                onChange={e => setResponseNoteInput(e.target.value)}
                placeholder="Optional note for your partner..."
                className="w-full px-3 py-2 rounded-xl bg-[#1f112b] border border-[#3b1f4c] text-xs text-[#fae8d7] placeholder-[#6b5873] focus:outline-none"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={handleConfirmAction}
                  className="px-4 py-2 rounded-xl bg-[#d94f6f] hover:bg-[#e05a7a] text-white text-xs font-bold transition-colors"
                >
                  Confirm Response
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Requester Action: Withdraw if Pending */}
      {isRequester && request.status === 'pending' && onWithdraw && (
        <div className="pt-2 flex justify-end">
          <button
            onClick={() => onWithdraw(request.id)}
            className="px-3 py-1.5 rounded-xl bg-[#251433] hover:bg-[#341b47] text-[#94a3b8] hover:text-[#ef4444] border border-[#381e47] text-xs font-semibold transition-colors"
          >
            Withdraw Request
          </button>
        </div>
      )}

      {/* History Toggle */}
      {request.history && request.history.length > 0 && (
        <div className="pt-2 border-t border-[#2a1738]">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="text-[11px] text-[#b59ebf] hover:text-[#fae8d7] flex items-center gap-1 transition-colors"
          >
            <span>Activity History ({request.history.length})</span>
            {showHistory ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>

          {showHistory && (
            <div className="mt-2 space-y-1.5 text-[11px] text-[#b59ebf]">
              {request.history.map((entry, idx) => (
                <div key={idx} className="flex items-center gap-2 pl-2 border-l border-[#381e47]">
                  <span className="text-[#fae8d7] font-semibold capitalize">
                    {entry.action.replace('_', ' ')}
                  </span>
                  <span>by {allUsers.find(u => u.id === entry.actorId)?.displayName || 'User'}</span>
                  <span className="text-[#64748b]">• {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  {entry.note && <span className="italic text-[#d4c3d9]">&ldquo;{entry.note}&rdquo;</span>}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Counter Modal */}
      <RequestCounterModal
        isOpen={isCounterModalOpen}
        onClose={() => setIsCounterModalOpen(false)}
        request={request}
        onSendCounterProposal={onCounterPropose}
      />
    </div>
  );
};
