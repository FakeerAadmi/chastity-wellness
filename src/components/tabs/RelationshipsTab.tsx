'use client';

import React, { useState } from 'react';
import {
  Users,
  Plus,
  Heart,
  Shield,
  ArrowRight,
  Sparkles,
  Calendar,
  Lock,
  ChevronRight,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import {
  INITIAL_RELATIONSHIPS,
  INITIAL_DYNAMICS,
  INITIAL_AGREEMENTS,
  CURRENT_USER
} from '../../data/domainDemoData';
import { Relationship, RelationshipStatus } from '../../types/domain';

interface RelationshipsTabProps {
  onNavigateDynamic?: (dynamicId: string) => void;
}

export const RelationshipsTab: React.FC<RelationshipsTabProps> = ({
  onNavigateDynamic
}) => {
  const [relationships, setRelationships] = useState<Relationship[]>(INITIAL_RELATIONSHIPS);
  const [selectedRelId, setSelectedRelId] = useState<string>(INITIAL_RELATIONSHIPS[0].id);
  const [filterStatus, setFilterStatus] = useState<RelationshipStatus | 'all'>('all');
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [newRelName, setNewRelName] = useState('');
  const [newRelType, setNewRelType] = useState('Primary Partnership');
  const [newPartnerName, setNewPartnerName] = useState('');

  const selectedRelationship = relationships.find(r => r.id === selectedRelId) || relationships[0];

  // Associated dynamics for the selected relationship
  const relDynamics = INITIAL_DYNAMICS.filter(d => d.relationshipId === selectedRelationship.id);
  const relAgreements = INITIAL_AGREEMENTS.filter(a => a.relationshipId === selectedRelationship.id);

  const handleCreateRelationship = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRelName.trim()) return;

    const newRel: Relationship = {
      id: `rel_${Date.now()}`,
      name: newRelName.trim(),
      relationshipType: newRelType,
      status: 'active',
      privacy: 'participants_only',
      description: 'Newly defined relationship in Haven.',
      participants: [
        {
          userId: CURRENT_USER.id,
          displayName: CURRENT_USER.displayName,
          joinedAt: new Date().toISOString(),
          roleDescription: 'Initiating Partner',
        },
        ...(newPartnerName.trim()
          ? [
              {
                userId: `usr_${Date.now()}`,
                displayName: newPartnerName.trim(),
                joinedAt: new Date().toISOString(),
                roleDescription: 'Partner',
              },
            ]
          : []),
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setRelationships(prev => [newRel, ...prev]);
    setSelectedRelId(newRel.id);
    setIsCreatingNew(false);
    setNewRelName('');
    setNewPartnerName('');
  };

  const handleUpdateStatus = (status: RelationshipStatus) => {
    setRelationships(prev =>
      prev.map(r => (r.id === selectedRelationship.id ? { ...r, status, updatedAt: new Date().toISOString() } : r))
    );
  };

  const filteredRelationships = relationships.filter(r =>
    filterStatus === 'all' ? true : r.status === filterStatus
  );

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-[#1c1026] border border-[#251433]">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#d94f6f] uppercase tracking-wider mb-1">
            <Users className="w-3.5 h-3.5" />
            <span>Relationship Architecture</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#fae8d7]">Relationships</h1>
          <p className="text-sm text-[#b59ebf] mt-1 max-w-xl">
            In Haven, dynamics live within consensual relationships. Define multi-person, long-distance, or primary connections with distinct roles and boundaries.
          </p>
        </div>

        <button
          onClick={() => setIsCreatingNew(!isCreatingNew)}
          className="px-4 py-2.5 rounded-xl text-xs font-bold bg-[#d94f6f] hover:bg-[#b83856] text-white transition-all flex items-center gap-2 shadow-sm self-start sm:self-center"
        >
          <Plus className="w-4 h-4" />
          <span>New Relationship</span>
        </button>
      </div>

      {/* Creation Modal / Inline Drawer */}
      {isCreatingNew && (
        <form
          onSubmit={handleCreateRelationship}
          className="p-5 rounded-2xl bg-[#170c20] border border-[#d94f6f]/40 space-y-4 animate-fade-in shadow-xl"
        >
          <div className="flex items-center justify-between border-b border-[#2d163d] pb-3">
            <h3 className="text-sm font-bold text-[#fae8d7] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#d94f6f]" />
              Establish a New Relationship Dynamic
            </h3>
            <button
              type="button"
              onClick={() => setIsCreatingNew(false)}
              className="text-xs text-[#b59ebf] hover:text-[#fae8d7]"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-[#b59ebf] block mb-1">
                Relationship Label / Name
              </label>
              <input
                type="text"
                value={newRelName}
                onChange={e => setNewRelName(e.target.value)}
                placeholder="e.g. Alex & Jordan"
                required
                className="w-full px-3 py-2 rounded-xl bg-[#100717] border border-[#2d163d] text-xs text-[#fae8d7] focus:outline-none focus:border-[#d94f6f]"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-[#b59ebf] block mb-1">
                Relationship Dynamic Type
              </label>
              <select
                value={newRelType}
                onChange={e => setNewRelType(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#100717] border border-[#2d163d] text-xs text-[#fae8d7] focus:outline-none focus:border-[#d94f6f]"
              >
                <option value="Primary Partnership">Primary Partnership</option>
                <option value="Long-Distance Dynamic">Long-Distance Dynamic</option>
                <option value="Polyamorous Connection">Polyamorous Connection</option>
                <option value="Power-Exchange Focus">Power-Exchange Focus</option>
                <option value="Casual / Exploration">Casual / Exploration</option>
              </select>
            </div>
            <div>
              <label className="text-[11px] font-semibold text-[#b59ebf] block mb-1">
                Partner's Display Name (Optional)
              </label>
              <input
                type="text"
                value={newPartnerName}
                onChange={e => setNewPartnerName(e.target.value)}
                placeholder="e.g. Jordan"
                className="w-full px-3 py-2 rounded-xl bg-[#100717] border border-[#2d163d] text-xs text-[#fae8d7] focus:outline-none focus:border-[#d94f6f]"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-4 py-2 rounded-xl text-xs font-bold bg-[#d94f6f] hover:bg-[#b83856] text-white transition-colors"
            >
              Create Relationship
            </button>
          </div>
        </form>
      )}

      {/* Main Split: Relationship List (Left) and Detail (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Relationships List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 bg-[#150a1e] p-1 rounded-xl border border-[#251433] text-[11px] font-semibold">
              {(['all', 'active', 'paused', 'archived'] as const).map(status => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-2 py-1 rounded-lg capitalize transition-colors ${
                    filterStatus === status
                      ? 'bg-[#251433] text-[#d94f6f]'
                      : 'text-[#8d7596] hover:text-[#fae8d7]'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
            <span className="text-xs text-[#8d7596]">{filteredRelationships.length} relationships</span>
          </div>

          <div className="space-y-2.5">
            {filteredRelationships.map(rel => {
              const isSelected = rel.id === selectedRelationship.id;
              const dynamicsCount = INITIAL_DYNAMICS.filter(d => d.relationshipId === rel.id).length;
              return (
                <div
                  key={rel.id}
                  onClick={() => setSelectedRelId(rel.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer select-none ${
                    isSelected
                      ? 'bg-[#210f2e] border-[#d94f6f]/60 shadow-md ring-1 ring-[#d94f6f]/40'
                      : 'bg-[#1c1026] border-[#251433] hover:border-[#3d204f]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#d94f6f]">
                      {rel.relationshipType}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded capitalize ${
                        rel.status === 'active'
                          ? 'bg-emerald-950/70 text-emerald-400 border border-emerald-800/40'
                          : 'bg-amber-950/70 text-amber-400 border border-amber-800/40'
                      }`}
                    >
                      {rel.status}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-[#fae8d7]">{rel.name}</h3>

                  <div className="mt-2 flex items-center justify-between text-xs text-[#b59ebf]">
                    <span>{rel.participants.length} Participants</span>
                    <span>{dynamicsCount} Dynamics</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Selected Relationship Detail View */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 rounded-2xl bg-[#1c1026] border border-[#251433] space-y-6">
            {/* Header of Detail */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#251433] pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-[#fae8d7]">{selectedRelationship.name}</h2>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-[#251433] text-[#d94f6f] font-semibold">
                    {selectedRelationship.relationshipType}
                  </span>
                </div>
                <p className="text-xs text-[#b59ebf] mt-1">{selectedRelationship.description}</p>
              </div>

              {/* Status Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    handleUpdateStatus(selectedRelationship.status === 'active' ? 'paused' : 'active')
                  }
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#251433] hover:bg-[#321b44] text-[#fae8d7] border border-[#381e47] transition-colors"
                >
                  {selectedRelationship.status === 'active' ? 'Pause Dynamic' : 'Resume Active'}
                </button>
              </div>
            </div>

            {/* Participants Matrix */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-[#fae8d7] uppercase tracking-wider flex items-center gap-2">
                <Users className="w-3.5 h-3.5 text-[#d94f6f]" />
                Participants & Contextual Roles
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {selectedRelationship.participants.map(part => (
                  <div
                    key={part.userId}
                    className="p-3.5 rounded-xl bg-[#130b1a] border border-[#251433] flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-semibold text-[#fae8d7]">{part.displayName}</span>
                        {part.userId === CURRENT_USER.id && (
                          <span className="text-[10px] text-[#d94f6f] font-bold">(You)</span>
                        )}
                      </div>
                      <span className="text-xs text-[#b59ebf] block mt-0.5">
                        {part.roleDescription || 'Participant'}
                      </span>
                    </div>
                    <span className="text-[10px] text-[#8d7596]">
                      Since {new Date(part.joinedAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Associated Dynamics Strip */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-[#fae8d7] uppercase tracking-wider flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#d94f6f]" />
                  Associated Dynamics ({relDynamics.length})
                </h3>
              </div>

              {relDynamics.length === 0 ? (
                <div className="p-4 rounded-xl bg-[#130b1a] border border-[#251433] text-xs text-[#8d7596]">
                  No dynamics established yet for this relationship.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {relDynamics.map(dyn => (
                    <div
                      key={dyn.id}
                      onClick={() => onNavigateDynamic && onNavigateDynamic(dyn.id)}
                      className="p-4 rounded-xl bg-[#130b1a] border border-[#251433] hover:border-[#d94f6f]/50 transition-all cursor-pointer group flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] font-semibold uppercase text-[#d94f6f]">
                            {(dyn.dynamicType || dyn.category || 'Dynamic').replace('_', ' ')}
                          </span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#251433] text-[#fae8d7] capitalize">
                            {dyn.status}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-[#fae8d7] group-hover:text-[#d94f6f] transition-colors">
                          {dyn.name}
                        </h4>
                        <p className="text-xs text-[#b59ebf] line-clamp-2 mt-1">
                          {dyn.description}
                        </p>
                      </div>

                      <div className="mt-3 pt-2 border-t border-[#200f2e] flex items-center justify-between text-xs text-[#8d7596]">
                        <span>{dyn.activeAgreementsCount} Agreed Boundaries</span>
                        <span className="text-[#fae8d7] font-semibold group-hover:underline flex items-center gap-1">
                          <span>Inspect</span>
                          <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Active Shared Agreements */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-[#fae8d7] uppercase tracking-wider flex items-center gap-2">
                <Shield className="w-3.5 h-3.5 text-[#d94f6f]" />
                Relationship Shared Agreements ({relAgreements.length})
              </h3>

              <div className="space-y-2">
                {relAgreements.map(agr => (
                  <div
                    key={agr.id}
                    className="p-3.5 rounded-xl bg-[#130b1a] border border-[#251433] flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <h4 className="text-xs font-semibold text-[#fae8d7]">{agr.title}</h4>
                      </div>
                      <p className="text-[11px] text-[#b59ebf] mt-1 max-w-xl">{agr.description}</p>
                    </div>
                    <span className="text-[10px] font-semibold text-[#d94f6f] px-2 py-0.5 rounded bg-[#251433] shrink-0 self-start sm:self-center">
                      Version {agr.version}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Privacy and Storage Note */}
            <div className="p-3.5 rounded-xl bg-[#100717] border border-[#251433] text-[11px] text-[#8d7596] flex items-center justify-between">
              <span>
                Privacy mode: <strong className="text-[#b59ebf]">Participants only</strong> • Stored in privacy-aware local storage.
              </span>
              <span>Updated {new Date(selectedRelationship.updatedAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
