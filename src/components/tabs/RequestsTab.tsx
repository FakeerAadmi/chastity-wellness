'use client';

import React, { useState } from 'react';
import {
  Inbox,
  Send,
  Plus,
  Key,
  Sparkles,
  Clock,
  CheckCircle2,
  Filter,
  Users
} from 'lucide-react';
import { HavenRequest, RequestMode, User } from '@/types/domain';
import {
  INITIAL_HAVEN_REQUESTS,
  INITIAL_RELATIONSHIPS,
  INITIAL_DYNAMICS,
  ALL_USERS,
  CURRENT_USER
} from '@/data/domainDemoData';
import { RequestCard } from '../requests/RequestCard';
import { RequestCreationModal } from '../requests/RequestCreationModal';

interface RequestsTabProps {
  onNavigateTab?: (tab: string) => void;
  onOpenEmergency?: () => void;
}

export const RequestsTab: React.FC<RequestsTabProps> = ({
  onNavigateTab,
  onOpenEmergency,
}) => {
  const [requests, setRequests] = useState<HavenRequest[]>(INITIAL_HAVEN_REQUESTS);
  const [activeFilter, setActiveFilter] = useState<'incoming' | 'sent' | 'resolved' | 'all'>('incoming');
  const [modeFilter, setModeFilter] = useState<'all' | 'proposal' | 'permission'>('all');
  const [isCreationModalOpen, setIsCreationModalOpen] = useState(false);

  const currentUser = CURRENT_USER;
  const allUsers = ALL_USERS;
  const relationships = INITIAL_RELATIONSHIPS;
  const dynamics = INITIAL_DYNAMICS;

  // Handle Response actions
  const handleRespond = (
    requestId: string,
    action: 'accept' | 'decline' | 'discuss' | 'not_now',
    note?: string
  ) => {
    setRequests(prev =>
      prev.map(req => {
        if (req.id !== requestId) return req;

        let newStatus: HavenRequest['status'] = 'accepted';
        let actionLabel: 'accepted' | 'declined' | 'discuss_requested' | 'not_now' = 'accepted';

        if (action === 'decline') {
          newStatus = 'declined';
          actionLabel = 'declined';
        } else if (action === 'discuss') {
          newStatus = 'discussing';
          actionLabel = 'discuss_requested';
        } else if (action === 'not_now') {
          newStatus = 'not_now';
          actionLabel = 'not_now';
        }

        return {
          ...req,
          status: newStatus,
          responseNote: note || req.responseNote,
          history: [
            ...req.history,
            {
              timestamp: new Date().toISOString(),
              action: actionLabel,
              actorId: currentUser.id,
              note,
            },
          ],
          updatedAt: new Date().toISOString(),
        };
      })
    );
  };

  // Handle Counter-Proposal
  const handleCounterPropose = (
    requestId: string,
    modifiedTitle: string,
    modifiedConditions: string,
    modifiedDurationMinutes: number | undefined,
    note: string
  ) => {
    setRequests(prev =>
      prev.map(req => {
        if (req.id !== requestId) return req;
        return {
          ...req,
          status: 'counter_proposed',
          counterProposal: {
            modifiedTitle,
            modifiedConditions,
            modifiedDurationMinutes,
            note,
            proposedById: currentUser.id,
            proposedAt: new Date().toISOString(),
          },
          history: [
            ...req.history,
            {
              timestamp: new Date().toISOString(),
              action: 'counter_proposed',
              actorId: currentUser.id,
              note: `Counter-proposed: ${note}`,
            },
          ],
          updatedAt: new Date().toISOString(),
        };
      })
    );
  };

  // Withdraw Request
  const handleWithdraw = (requestId: string) => {
    setRequests(prev =>
      prev.map(req => {
        if (req.id !== requestId) return req;
        return {
          ...req,
          status: 'withdrawn',
          history: [
            ...req.history,
            {
              timestamp: new Date().toISOString(),
              action: 'withdrawn',
              actorId: currentUser.id,
              note: 'Withdrawn by requester',
            },
          ],
          updatedAt: new Date().toISOString(),
        };
      })
    );
  };

  const handleCreateRequest = (newRequest: HavenRequest) => {
    setRequests(prev => [newRequest, ...prev]);
  };

  // Filter requests
  const incomingRequests = requests.filter(
    r => r.recipientIds.includes(currentUser.id) && r.status === 'pending'
  );

  const sentRequests = requests.filter(
    r => r.requesterId === currentUser.id && r.status === 'pending'
  );

  const resolvedRequests = requests.filter(
    r => r.status !== 'pending'
  );

  const displayedRequests = requests.filter(r => {
    // Mode match
    if (modeFilter !== 'all' && r.requestMode !== modeFilter) return false;

    if (activeFilter === 'incoming') {
      return r.recipientIds.includes(currentUser.id) && r.status === 'pending';
    }
    if (activeFilter === 'sent') {
      return r.requesterId === currentUser.id && r.status === 'pending';
    }
    if (activeFilter === 'resolved') {
      return r.status !== 'pending';
    }
    return true;
  });

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#251433] text-[#d94f6f] text-xs font-semibold border border-[#4a2c59] mb-2">
            <Inbox className="w-3.5 h-3.5" />
            <span>Operational Request Hub</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-[#fae8d7]">
            Requests & Permission Inbox
          </h1>
          <p className="text-xs sm:text-sm text-[#b59ebf] max-w-xl">
            Asymmetric proposals and dynamic permission requests. Review pending inquiries, submit proposals, or negotiate terms with dignity.
          </p>
        </div>

        {/* Action Button */}
        <button
          onClick={() => setIsCreationModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#d94f6f] to-[#7c3aed] text-white text-xs font-bold shadow-md shadow-[#d94f6f]/25 hover:opacity-95 transition-opacity flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Request</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* State filters */}
        <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-[#1c1026] border border-[#2f193d]">
          <button
            onClick={() => setActiveFilter('incoming')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeFilter === 'incoming'
                ? 'bg-[#d94f6f] text-white shadow-sm'
                : 'text-[#b59ebf] hover:text-[#fae8d7]'
            }`}
          >
            <span>Waiting for You</span>
            {incomingRequests.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-white/20 text-[10px]">
                {incomingRequests.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveFilter('sent')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeFilter === 'sent'
                ? 'bg-[#d94f6f] text-white shadow-sm'
                : 'text-[#b59ebf] hover:text-[#fae8d7]'
            }`}
          >
            <span>Sent by You</span>
            {sentRequests.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-white/20 text-[10px]">
                {sentRequests.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveFilter('resolved')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeFilter === 'resolved'
                ? 'bg-[#d94f6f] text-white shadow-sm'
                : 'text-[#b59ebf] hover:text-[#fae8d7]'
            }`}
          >
            <span>Resolved ({resolvedRequests.length})</span>
          </button>

          <button
            onClick={() => setActiveFilter('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeFilter === 'all'
                ? 'bg-[#d94f6f] text-white shadow-sm'
                : 'text-[#b59ebf] hover:text-[#fae8d7]'
            }`}
          >
            <span>All ({requests.length})</span>
          </button>
        </div>

        {/* Mode filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-[#b59ebf]" />
          <select
            value={modeFilter}
            onChange={e => setModeFilter(e.target.value as 'all' | 'proposal' | 'permission')}
            className="px-3 py-2 rounded-xl bg-[#1c1026] border border-[#2f193d] text-xs text-[#fae8d7] focus:outline-none"
          >
            <option value="all">All Request Types</option>
            <option value="proposal">Proposals Only</option>
            <option value="permission">Permissions Only</option>
          </select>
        </div>
      </div>

      {/* Requests Feed */}
      <div className="space-y-4">
        {displayedRequests.length === 0 ? (
          <div className="p-8 text-center rounded-3xl bg-[#160d20] border border-[#2f193d] space-y-2">
            <Inbox className="w-8 h-8 text-[#b59ebf] mx-auto opacity-50" />
            <h3 className="text-base font-bold text-[#fae8d7]">No Requests Found</h3>
            <p className="text-xs text-[#b59ebf] max-w-sm mx-auto">
              {activeFilter === 'incoming'
                ? 'You have zero pending requests waiting for your response.'
                : 'No matching requests in this view.'}
            </p>
          </div>
        ) : (
          displayedRequests.map(req => (
            <RequestCard
              key={req.id}
              request={req}
              currentUser={currentUser}
              allUsers={allUsers}
              onRespond={handleRespond}
              onCounterPropose={handleCounterPropose}
              onWithdraw={handleWithdraw}
            />
          ))
        )}
      </div>

      {/* Creation Modal */}
      <RequestCreationModal
        isOpen={isCreationModalOpen}
        onClose={() => setIsCreationModalOpen(false)}
        currentUser={currentUser}
        allUsers={allUsers}
        relationships={relationships}
        dynamics={dynamics}
        onCreateRequest={handleCreateRequest}
      />
    </div>
  );
};
