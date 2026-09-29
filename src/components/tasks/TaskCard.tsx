'use client';

import React, { useState } from 'react';
import {
  CheckCircle2,
  Circle,
  Clock,
  Sparkles,
  Gift,
  Camera,
  FileText,
  Mic,
  Users,
  AlertCircle,
  Repeat,
  Shield,
  Eye,
  Check
} from 'lucide-react';
import { HavenTask, TaskProof, TaskStatus, User } from '@/types/domain';
import { TaskProofModal } from './TaskProofModal';

interface TaskCardProps {
  task: HavenTask;
  currentUser: User;
  allUsers: User[];
  onToggleComplete: (taskId: string) => void;
  onSubmitProof: (taskId: string, proof: TaskProof) => void;
  onVerifyProof?: (taskId: string, verificationNote?: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  currentUser,
  allUsers,
  onToggleComplete,
  onSubmitProof,
  onVerifyProof,
}) => {
  const [isProofModalOpen, setIsProofModalOpen] = useState(false);

  const assigner = allUsers.find(u => u.id === task.assignedById) || {
    id: task.assignedById,
    displayName: 'Partner',
  };

  const assignees = task.assignedToIds.map(
    id => allUsers.find(u => u.id === id) || { id, displayName: 'Partner' }
  );

  const isAssignee = task.assignedToIds.includes(currentUser.id);
  const isAssigner = currentUser.id === task.assignedById;
  const isCompleted = task.status === 'completed' || task.status === 'verified';
  const isSubmitted = task.status === 'submitted';

  const getPriorityBadge = (p: string) => {
    switch (p) {
      case 'high_focus':
        return (
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#eab308]/20 text-[#eab308] border border-[#eab308]/40">
            High Focus
          </span>
        );
      case 'gentle':
        return (
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/40">
            Gentle
          </span>
        );
      default:
        return (
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#251433] text-[#b59ebf] border border-[#381e47]">
            Standard
          </span>
        );
    }
  };

  const getCategoryLabel = (c: string) => {
    switch (c) {
      case 'ds_protocol':
        return 'D/s Protocol';
      case 'chastity':
        return 'Chastity & Hygiene';
      case 'ldr':
        return 'LDR Intimacy';
      case 'relationship_care':
        return 'Relationship Care';
      default:
        return 'Everyday / Shared';
    }
  };

  const getProofBadge = () => {
    switch (task.proofType) {
      case 'ephemeral_photo':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-md bg-[#2d123b] text-[#f472b6] border border-[#db2777]/30">
            <Camera className="w-2.5 h-2.5" />
            Photo Proof
          </span>
        );
      case 'text_note':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-md bg-[#1c1833] text-[#a78bfa] border border-[#7c3aed]/30">
            <FileText className="w-2.5 h-2.5" />
            Journal Note
          </span>
        );
      case 'voice_note':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-md bg-[#1f1738] text-[#c084fc] border border-[#7e22ce]/30">
            <Mic className="w-2.5 h-2.5" />
            Voice Note
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className={`rounded-2xl p-5 border transition-all ${
        isCompleted
          ? 'bg-[#130a1a]/60 border-[#2a1738] opacity-75'
          : isSubmitted
          ? 'bg-gradient-to-br from-[#1a1228] to-[#201433] border-[#a855f7]/50 shadow-md'
          : 'bg-[#160d20] border-[#2f193d] hover:border-[#4d2863]'
      }`}
    >
      <div className="flex items-start gap-3.5">
        {/* Checkbox / Complete Toggle */}
        <button
          onClick={() => {
            if (task.proofType !== 'none' && task.proofType !== 'completion_confirmation' && !isCompleted && !isSubmitted) {
              setIsProofModalOpen(true);
            } else {
              onToggleComplete(task.id);
            }
          }}
          disabled={isSubmitted && !isAssigner}
          className="mt-0.5 shrink-0 text-[#d94f6f] hover:text-[#e05a7a] transition-colors"
          title={isCompleted ? 'Mark incomplete' : 'Complete task'}
        >
          {isCompleted ? (
            <CheckCircle2 className="w-5 h-5 text-[#10b981]" />
          ) : isSubmitted ? (
            <Clock className="w-5 h-5 text-[#a855f7] animate-pulse" />
          ) : (
            <Circle className="w-5 h-5 text-[#6b5873] hover:text-[#d94f6f]" />
          )}
        </button>

        {/* Content */}
        <div className="space-y-2 flex-1">
          {/* Header Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#251433] text-[#b59ebf] border border-[#381e47]">
              {getCategoryLabel(task.category)}
            </span>
            {getPriorityBadge(task.priority)}
            {task.recurrence !== 'once' && (
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-md bg-[#1c1026] text-[#b59ebf] border border-[#2f193d]">
                <Repeat className="w-2.5 h-2.5" />
                <span className="capitalize">{task.recurrence}</span>
              </span>
            )}
            {getProofBadge()}

            {/* Status indicator */}
            {isSubmitted && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#a855f7]/20 text-[#a855f7] border border-[#a855f7]/40">
                Proof Submitted
              </span>
            )}
            {task.status === 'verified' && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/40">
                Verified
              </span>
            )}
          </div>

          {/* Title */}
          <h4
            className={`text-base font-bold text-[#fae8d7] leading-snug ${
              isCompleted ? 'line-through text-[#8e7a96]' : ''
            }`}
          >
            {task.title}
          </h4>

          {/* Description */}
          {task.description && (
            <p className="text-xs text-[#d4c3d9] leading-relaxed">
              {task.description}
            </p>
          )}

          {/* User-Defined Reward Banner */}
          {task.rewardDescription && (
            <div className="p-2.5 rounded-xl bg-gradient-to-r from-[#d94f6f]/15 to-[#eab308]/15 border border-[#d94f6f]/30 flex items-center gap-2 text-xs text-[#fae8d7]">
              <Gift className="w-4 h-4 text-[#eab308] shrink-0" />
              <span>
                <strong className="text-[#eab308]">Agreed Reward:</strong> {task.rewardDescription}
              </span>
            </div>
          )}

          {/* Subtext info: Due date & Assignments */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-[#b59ebf] pt-1">
            <div className="flex items-center gap-3">
              <span>
                Assigned by:{' '}
                <strong className="text-[#fae8d7]">
                  {isAssigner ? 'You' : assigner.displayName}
                </strong>
              </span>
              <span>•</span>
              <span>
                To:{' '}
                <strong className="text-[#fae8d7]">
                  {assignees.map(a => (a.id === currentUser.id ? 'You' : a.displayName)).join(', ')}
                </strong>
              </span>
            </div>

            {task.dueDate && (
              <span className="flex items-center gap-1 text-[11px] text-[#b59ebf]">
                <Clock className="w-3 h-3 text-[#d94f6f]" />
                Due: {new Date(task.dueDate).toLocaleDateString([], { month: 'short', day: 'numeric' })}
              </span>
            )}
          </div>

          {/* Proof Action Triggers */}
          <div className="flex items-center justify-between pt-2 border-t border-[#2a1738]">
            {task.proofType !== 'none' && task.proofType !== 'completion_confirmation' ? (
              <button
                onClick={() => setIsProofModalOpen(true)}
                className="text-xs font-semibold text-[#d94f6f] hover:text-[#fae8d7] flex items-center gap-1.5 transition-colors"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>{task.proof ? 'Review Submitted Proof' : 'Upload / Submit Proof'}</span>
              </button>
            ) : (
              <span className="text-[11px] text-[#6b5873] italic">
                Affirmative completion check
              </span>
            )}

            {/* Assigner Quick Verify Button */}
            {isAssigner && isSubmitted && onVerifyProof && (
              <button
                onClick={() => onVerifyProof(task.id)}
                className="px-3 py-1 rounded-xl bg-[#10b981] hover:bg-[#059669] text-white text-xs font-bold transition-colors flex items-center gap-1 shadow-sm"
              >
                <Check className="w-3 h-3" />
                Quick Approve & Verify
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Proof Modal */}
      <TaskProofModal
        isOpen={isProofModalOpen}
        onClose={() => setIsProofModalOpen(false)}
        task={task}
        currentUser={currentUser}
        allUsers={allUsers}
        onSubmitProof={onSubmitProof}
        onVerifyProof={onVerifyProof}
      />
    </div>
  );
};
