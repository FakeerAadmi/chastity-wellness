'use client';

import React, { useState } from 'react';
import {
  X,
  Send,
  Key,
  Sparkles,
  Users,
  Clock,
  Shield,
  FileText,
  AlertCircle
} from 'lucide-react';
import {
  HavenRequest,
  RequestMode,
  User,
  Relationship,
  Dynamic
} from '@/types/domain';

interface RequestCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  allUsers: User[];
  relationships: Relationship[];
  dynamics: Dynamic[];
  onCreateRequest: (request: HavenRequest) => void;
  initialDynamicId?: string;
  initialTitle?: string;
  initialMode?: RequestMode;
}

export const RequestCreationModal: React.FC<RequestCreationModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  allUsers,
  relationships,
  dynamics,
  onCreateRequest,
  initialDynamicId,
  initialTitle,
  initialMode,
}) => {
  const [requestMode, setRequestMode] = useState<RequestMode>(initialMode || 'proposal');
  const [title, setTitle] = useState(initialTitle || '');
  const [description, setDescription] = useState('');
  const [requestType, setRequestType] = useState('scene_proposal');
  const [selectedRelationshipId, setSelectedRelationshipId] = useState(
    relationships[0]?.id || ''
  );
  const [selectedDynamicId, setSelectedDynamicId] = useState(
    initialDynamicId || ''
  );
  const [selectedRecipientIds, setSelectedRecipientIds] = useState<string[]>(() => {
    const rel = relationships[0];
    const others = rel ? rel.participants.filter(p => p.userId !== currentUser.id) : [];
    return others.length > 0 ? [others[0].userId] : [];
  });
  const [durationMinutes, setDurationMinutes] = useState<number | undefined>(45);
  const [conditions, setConditions] = useState('');
  const [expirationHours, setExpirationHours] = useState<number | undefined>(24);

  // When relationship changes, initialize recipients to other members
  const currentRelationship = relationships.find(r => r.id === selectedRelationshipId);
  const otherParticipants = currentRelationship
    ? currentRelationship.participants.filter(p => p.userId !== currentUser.id)
    : [];

  const handleRelationshipChange = (relId: string) => {
    setSelectedRelationshipId(relId);
    const rel = relationships.find(r => r.id === relId);
    const others = rel ? rel.participants.filter(p => p.userId !== currentUser.id) : [];
    if (others.length > 0) {
      setSelectedRecipientIds([others[0].userId]);
    } else {
      setSelectedRecipientIds([]);
    }
  };

  if (!isOpen) return null;

  const relevantDynamics = dynamics.filter(
    d => d.relationshipId === selectedRelationshipId
  );

  const handleToggleRecipient = (userId: string) => {
    setSelectedRecipientIds(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || selectedRecipientIds.length === 0) return;

    const expiresAt = expirationHours
      ? new Date(Date.now() + expirationHours * 60 * 60 * 1000).toISOString()
      : undefined;

    const newRequest: HavenRequest = {
      id: `req_${Date.now()}`,
      requesterId: currentUser.id,
      recipientIds: selectedRecipientIds,
      relationshipId: selectedRelationshipId,
      dynamicId: selectedDynamicId || undefined,
      requestMode,
      requestType,
      title: title.trim(),
      description: description.trim() || undefined,
      conditions: conditions.trim() || undefined,
      durationMinutes: durationMinutes || undefined,
      status: 'pending',
      expiresAt,
      history: [
        {
          timestamp: new Date().toISOString(),
          action: 'requested',
          actorId: currentUser.id,
          note: 'Submitted through Request Hub',
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onCreateRequest(newRequest);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-xl my-8 rounded-3xl bg-[#160d20] border border-[#3b1f4c] shadow-2xl p-6 sm:p-8 space-y-6 text-[#fae8d7]">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-[#251433] text-[#d94f6f] text-xs font-semibold border border-[#4a2c59]">
              <Send className="w-3.5 h-3.5" />
              <span>New Proposal or Request</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-[#fae8d7]">
              Submit a Request
            </h2>
            <p className="text-xs text-[#b59ebf]">
              Structured proposals for intimacy, play scenes, or dynamic permissions.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-[#251433] text-[#b59ebf] hover:text-[#fae8d7] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Selector */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <button
            type="button"
            onClick={() => setRequestMode('proposal')}
            className={`p-3.5 rounded-2xl border text-left transition-all ${
              requestMode === 'proposal'
                ? 'bg-[#1f1738] border-[#7e22ce] text-[#fae8d7] shadow-md'
                : 'bg-[#1c1026] border-[#2f193d] text-[#b59ebf] hover:text-[#fae8d7]'
            }`}
          >
            <div className="flex items-center gap-1.5 font-bold mb-1">
              <Sparkles className="w-4 h-4 text-[#c084fc]" />
              <span>Interpersonal Proposal</span>
            </div>
            <p className="text-[11px] text-[#b59ebf]">
              Casual invites, scene proposals, bedtime notes, date plans.
            </p>
          </button>

          <button
            type="button"
            onClick={() => setRequestMode('permission')}
            className={`p-3.5 rounded-2xl border text-left transition-all ${
              requestMode === 'permission'
                ? 'bg-[#2d123b] border-[#db2777] text-[#fae8d7] shadow-md'
                : 'bg-[#1c1026] border-[#2f193d] text-[#b59ebf] hover:text-[#fae8d7]'
            }`}
          >
            <div className="flex items-center gap-1.5 font-bold mb-1">
              <Key className="w-4 h-4 text-[#f472b6]" />
              <span>Permission Request</span>
            </div>
            <p className="text-[11px] text-[#b59ebf]">
              Chastity release, D/s protocol waivers, formal authority requests.
            </p>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-[#b59ebf] block">
              Request Title
            </label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder={
                requestMode === 'permission'
                  ? 'e.g., Chastity Release: 45-Min Workout & Shower'
                  : 'e.g., Would you like to do our sensory impact scene this Friday?'
              }
              required
              className="w-full px-4 py-3 rounded-xl bg-[#1f112b] border border-[#3b1f4c] text-sm text-[#fae8d7] placeholder-[#6b5873] focus:outline-none focus:border-[#d94f6f]"
            />
          </div>

          {/* Relationship & Dynamic */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#b59ebf] block">
                Relationship
              </label>
              <select
                value={selectedRelationshipId}
                onChange={e => handleRelationshipChange(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-[#1f112b] border border-[#3b1f4c] text-xs text-[#fae8d7] focus:outline-none"
              >
                {relationships.map(rel => (
                  <option key={rel.id} value={rel.id}>
                    {rel.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#b59ebf] block">
                Dynamic (Optional)
              </label>
              <select
                value={selectedDynamicId}
                onChange={e => setSelectedDynamicId(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-[#1f112b] border border-[#3b1f4c] text-xs text-[#fae8d7] focus:outline-none"
              >
                <option value="">General Relationship</option>
                {relevantDynamics.map(dyn => (
                  <option key={dyn.id} value={dyn.id}>
                    {dyn.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Multi-Person Recipient Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-[#b59ebf] block">
              Send To (Select Recipients)
            </label>
            <div className="flex flex-wrap gap-2">
              {otherParticipants.map(part => {
                const isSelected = selectedRecipientIds.includes(part.userId);
                return (
                  <button
                    type="button"
                    key={part.userId}
                    onClick={() => handleToggleRecipient(part.userId)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                      isSelected
                        ? 'bg-[#d94f6f] text-white shadow-sm'
                        : 'bg-[#1c1026] text-[#b59ebf] border border-[#2f193d] hover:text-[#fae8d7]'
                    }`}
                  >
                    <Users className="w-3.5 h-3.5" />
                    <span>{part.displayName}</span>
                  </button>
                );
              })}
            </div>
            {selectedRecipientIds.length === 0 && (
              <p className="text-[11px] text-[#ef4444]">Please select at least one recipient.</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-[#b59ebf] block">
              Description & Context
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Provide background, intent, or desired focus..."
              className="w-full px-4 py-2.5 rounded-xl bg-[#1f112b] border border-[#3b1f4c] text-xs text-[#fae8d7] placeholder-[#6b5873] focus:outline-none"
            />
          </div>

          {/* Conditions & Duration */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#b59ebf] block">
                Requested Duration (Minutes)
              </label>
              <input
                type="number"
                min="5"
                max="1440"
                value={durationMinutes || ''}
                onChange={e => setDurationMinutes(e.target.value ? Number(e.target.value) : undefined)}
                placeholder="e.g., 45"
                className="w-full px-4 py-2.5 rounded-xl bg-[#1f112b] border border-[#3b1f4c] text-xs text-[#fae8d7] focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#b59ebf] block">
                Expiration Window
              </label>
              <select
                value={expirationHours || ''}
                onChange={e => setExpirationHours(e.target.value ? Number(e.target.value) : undefined)}
                className="w-full px-3 py-2.5 rounded-xl bg-[#1f112b] border border-[#3b1f4c] text-xs text-[#fae8d7] focus:outline-none"
              >
                <option value="2">2 Hours</option>
                <option value="6">6 Hours</option>
                <option value="12">12 Hours</option>
                <option value="24">24 Hours</option>
                <option value="48">48 Hours</option>
                <option value="">No Expiry</option>
              </select>
            </div>
          </div>

          {/* Conditions / Safeguards */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-[#b59ebf] block">
              Conditions / Safeguards (Optional)
            </label>
            <input
              type="text"
              value={conditions}
              onChange={e => setConditions(e.target.value)}
              placeholder="e.g., Mandatory relock confirmation photo; traffic lights active"
              className="w-full px-4 py-2.5 rounded-xl bg-[#1f112b] border border-[#3b1f4c] text-xs text-[#fae8d7] placeholder-[#6b5873] focus:outline-none"
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
              disabled={selectedRecipientIds.length === 0 || !title.trim()}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#d94f6f] to-[#7c3aed] text-white text-xs font-bold shadow-md shadow-[#d94f6f]/25 hover:opacity-95 transition-opacity disabled:opacity-50"
            >
              Send Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
