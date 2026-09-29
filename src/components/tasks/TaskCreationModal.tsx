'use client';

import React, { useState } from 'react';
import {
  X,
  CheckSquare,
  Users,
  Clock,
  Sparkles,
  Camera,
  FileText,
  Mic,
  Gift,
  AlertCircle
} from 'lucide-react';
import {
  HavenTask,
  TaskPriority,
  TaskProofType,
  TaskRecurrence,
  User,
  Relationship,
  Dynamic
} from '@/types/domain';

interface TaskCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  allUsers: User[];
  relationships: Relationship[];
  dynamics: Dynamic[];
  onCreateTask: (task: HavenTask) => void;
  initialDynamicId?: string;
}

export const TaskCreationModal: React.FC<TaskCreationModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  allUsers,
  relationships,
  dynamics,
  onCreateTask,
  initialDynamicId,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<HavenTask['category']>('ds_protocol');
  const [selectedRelationshipId, setSelectedRelationshipId] = useState(
    relationships[0]?.id || ''
  );
  const [selectedDynamicId, setSelectedDynamicId] = useState(initialDynamicId || '');
  const [selectedAssigneeIds, setSelectedAssigneeIds] = useState<string[]>([currentUser.id]);
  const [priority, setPriority] = useState<TaskPriority>('standard');
  const [recurrence, setRecurrence] = useState<TaskRecurrence>('daily');
  const [proofType, setProofType] = useState<TaskProofType>('none');
  const [rewardDescription, setRewardDescription] = useState('');
  const [dueDate, setDueDate] = useState('');

  const currentRelationship = relationships.find(r => r.id === selectedRelationshipId);
  const availableParticipants = currentRelationship ? currentRelationship.participants : [];

  const relevantDynamics = dynamics.filter(d => d.relationshipId === selectedRelationshipId);

  if (!isOpen) return null;

  const handleToggleAssignee = (userId: string) => {
    setSelectedAssigneeIds(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || selectedAssigneeIds.length === 0) return;

    const newTask: HavenTask = {
      id: `tsk_${Date.now()}`,
      title: title.trim(),
      description: description.trim() || undefined,
      assignedById: currentUser.id,
      assignedToIds: selectedAssigneeIds,
      relationshipId: selectedRelationshipId,
      dynamicId: selectedDynamicId || undefined,
      dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
      recurrence,
      priority,
      proofType,
      rewardDescription: rewardDescription.trim() || undefined,
      visibility: 'relationship',
      status: 'pending',
      category,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onCreateTask(newTask);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-xl my-8 rounded-3xl bg-[#160d20] border border-[#3b1f4c] shadow-2xl p-6 sm:p-8 space-y-6 text-[#fae8d7]">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-[#251433] text-[#d94f6f] text-xs font-semibold border border-[#4a2c59]">
              <CheckSquare className="w-3.5 h-3.5" />
              <span>Create Task or Devotion</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-[#fae8d7]">
              New Practice Assignment
            </h2>
            <p className="text-xs text-[#b59ebf]">
              Assign service protocols, hygiene checks, intimate reflections, or date planning.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-[#251433] text-[#b59ebf] hover:text-[#fae8d7] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-[#b59ebf] block">
              Task Title
            </label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g., Morning 15-Minute Posture Kneeling & Intention Journal"
              required
              className="w-full px-4 py-3 rounded-xl bg-[#1f112b] border border-[#3b1f4c] text-sm text-[#fae8d7] placeholder-[#6b5873] focus:outline-none focus:border-[#d94f6f]"
            />
          </div>

          {/* Category */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-[#b59ebf] block">
              Category
            </label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value as HavenTask['category'])}
              className="w-full px-4 py-2.5 rounded-xl bg-[#1f112b] border border-[#3b1f4c] text-xs text-[#fae8d7] focus:outline-none"
            >
              <option value="ds_protocol">D/s Protocol & Posture</option>
              <option value="chastity">Chastity & Skin Hygiene</option>
              <option value="ldr">Long-Distance & Audio Whisper</option>
              <option value="relationship_care">Relationship Care & Appreciation</option>
              <option value="ordinary">Everyday Date & Domestic Task</option>
            </select>
          </div>

          {/* Relationship & Dynamic */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#b59ebf] block">
                Relationship
              </label>
              <select
                value={selectedRelationshipId}
                onChange={e => setSelectedRelationshipId(e.target.value)}
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

          {/* Multi-Person Assignee Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-[#b59ebf] block">
              Assign To (Select Participants)
            </label>
            <div className="flex flex-wrap gap-2">
              {availableParticipants.map(part => {
                const isSelected = selectedAssigneeIds.includes(part.userId);
                return (
                  <button
                    type="button"
                    key={part.userId}
                    onClick={() => handleToggleAssignee(part.userId)}
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
            {selectedAssigneeIds.length === 0 && (
              <p className="text-[11px] text-[#ef4444]">Please select at least one assignee.</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-[#b59ebf] block">
              Instructions & Verification Details
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Specify requirements, focus points, or timer expectations..."
              className="w-full px-4 py-2.5 rounded-xl bg-[#1f112b] border border-[#3b1f4c] text-xs text-[#fae8d7] placeholder-[#6b5873] focus:outline-none"
            />
          </div>

          {/* Priority & Recurrence */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#b59ebf] block">
                Priority
              </label>
              <select
                value={priority}
                onChange={e => setPriority(e.target.value as TaskPriority)}
                className="w-full px-3 py-2.5 rounded-xl bg-[#1f112b] border border-[#3b1f4c] text-xs text-[#fae8d7] focus:outline-none"
              >
                <option value="gentle">Gentle / Relaxed</option>
                <option value="standard">Standard</option>
                <option value="high_focus">High Focus / Priority</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#b59ebf] block">
                Recurrence Cadence
              </label>
              <select
                value={recurrence}
                onChange={e => setRecurrence(e.target.value as TaskRecurrence)}
                className="w-full px-3 py-2.5 rounded-xl bg-[#1f112b] border border-[#3b1f4c] text-xs text-[#fae8d7] focus:outline-none"
              >
                <option value="daily">Daily</option>
                <option value="weekdays">Weekdays</option>
                <option value="weekends">Weekends</option>
                <option value="weekly">Weekly</option>
                <option value="once">One-Time Only</option>
              </select>
            </div>
          </div>

          {/* Proof Type */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-[#b59ebf] block">
              Proof Requirement (Optional & Sensitive)
            </label>
            <select
              value={proofType}
              onChange={e => setProofType(e.target.value as TaskProofType)}
              className="w-full px-3 py-2.5 rounded-xl bg-[#1f112b] border border-[#3b1f4c] text-xs text-[#fae8d7] focus:outline-none"
            >
              <option value="none">None (Self-affirmation only)</option>
              <option value="completion_confirmation">Affirmative Confirmation Check</option>
              <option value="ephemeral_photo">Ephemeral Photo Proof (Held in memory)</option>
              <option value="text_note">Journal Note or Written Reflections</option>
              <option value="voice_note">Voice Note Whisper</option>
            </select>
          </div>

          {/* User-defined Reward */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-[#b59ebf] block">
              Optional User-Defined Reward
            </label>
            <div className="relative">
              <Gift className="w-4 h-4 text-[#eab308] absolute left-3 top-3" />
              <input
                type="text"
                value={rewardDescription}
                onChange={e => setRewardDescription(e.target.value)}
                placeholder="e.g., Choose dinner spot, receive surprise, unlock 30-min massage"
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#1f112b] border border-[#3b1f4c] text-xs text-[#fae8d7] placeholder-[#6b5873] focus:outline-none"
              />
            </div>
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
              disabled={selectedAssigneeIds.length === 0 || !title.trim()}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#d94f6f] to-[#7c3aed] text-white text-xs font-bold shadow-md shadow-[#d94f6f]/25 hover:opacity-95 transition-opacity disabled:opacity-50"
            >
              Assign Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
