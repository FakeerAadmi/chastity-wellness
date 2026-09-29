'use client';

import React, { useState } from 'react';
import {
  X,
  Camera,
  FileText,
  Mic,
  CheckCircle2,
  Shield,
  Eye,
  EyeOff,
  Lock,
  Clock,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { HavenTask, TaskProof, TaskProofType, User } from '@/types/domain';

interface TaskProofModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: HavenTask;
  currentUser: User;
  allUsers: User[];
  onSubmitProof: (taskId: string, proof: TaskProof) => void;
  onVerifyProof?: (taskId: string, verificationNote?: string) => void;
}

export const TaskProofModal: React.FC<TaskProofModalProps> = ({
  isOpen,
  onClose,
  task,
  currentUser,
  allUsers,
  onSubmitProof,
  onVerifyProof,
}) => {
  const [textNote, setTextNote] = useState(task.proof?.textNote || '');
  const [simulatedPhotoTaken, setSimulatedPhotoTaken] = useState(Boolean(task.proof?.mediaUri));
  const [simulatedAudioRecorded, setSimulatedAudioRecorded] = useState(Boolean(task.proof?.mediaUri));
  const [isPhotoBlurred, setIsPhotoBlurred] = useState(true);
  const [verificationNote, setVerificationNote] = useState('');

  if (!isOpen) return null;

  const isAssigner = currentUser.id === task.assignedById;
  const isAssignee = task.assignedToIds.includes(currentUser.id);
  const hasExistingProof = Boolean(task.proof);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const proof: TaskProof = {
      proofType: task.proofType,
      submittedAt: new Date().toISOString(),
      submittedById: currentUser.id,
      textNote: textNote.trim() || undefined,
      mediaUri:
        task.proofType === 'ephemeral_photo'
          ? 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="100%" height="100%" fill="%231c1026"/><circle cx="200" cy="150" r="60" fill="%23d94f6f" opacity="0.3"/><text x="50%" y="50%" text-anchor="middle" fill="%23fae8d7" font-size="14" font-family="sans-serif">Verified Ephemeral In-App Proof</text></svg>'
          : task.proofType === 'voice_note'
          ? 'simulated_audio_blob'
          : undefined,
      mediaExpiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    };

    onSubmitProof(task.id, proof);
    onClose();
  };

  const handleVerify = () => {
    if (onVerifyProof) {
      onVerifyProof(task.id, verificationNote.trim() || undefined);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-lg my-8 rounded-3xl bg-[#160d20] border border-[#3b1f4c] shadow-2xl p-6 sm:p-8 space-y-6 text-[#fae8d7]">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#251433] text-[#d94f6f] text-xs font-semibold border border-[#4a2c59]">
              <Shield className="w-3.5 h-3.5" />
              <span>Sensitive Proof Vault</span>
            </div>
            <h2 className="text-xl font-bold tracking-tight text-[#fae8d7]">
              {hasExistingProof ? 'Review Task Proof' : 'Submit Task Verification'}
            </h2>
            <p className="text-xs text-[#b59ebf]">
              {task.title}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-[#251433] text-[#b59ebf] hover:text-[#fae8d7] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Privacy & Ephemeral Warning */}
        <div className="p-3.5 rounded-2xl bg-[#1f112b] border border-[#3b1f4c] text-xs space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-[#f472b6]">
            <Lock className="w-3.5 h-3.5" />
            <span>Zero-Knowledge & Ephemeral Safeguard</span>
          </div>
          <p className="text-[11px] text-[#d4c3d9] leading-relaxed">
            Proof items are captured in sandboxed memory and never written to device camera rolls, public media folders, or unencrypted servers.
          </p>
        </div>

        {/* Form or Review Section */}
        {hasExistingProof && task.proof ? (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-[#1c1026] border border-[#2f193d] space-y-3">
              <div className="flex items-center justify-between text-xs text-[#b59ebf]">
                <span>
                  Submitted by:{' '}
                  <strong className="text-[#fae8d7]">
                    {allUsers.find(u => u.id === task.proof?.submittedById)?.displayName || 'User'}
                  </strong>
                </span>
                <span>
                  {new Date(task.proof.submittedAt).toLocaleDateString([], {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>

              {/* Photo Proof Display with Blur Toggle */}
              {task.proof.proofType === 'ephemeral_photo' && (
                <div className="relative rounded-xl overflow-hidden border border-[#381e47] bg-[#0f0714] min-h-[160px] flex items-center justify-center">
                  <div
                    className={`w-full p-6 text-center transition-all ${
                      isPhotoBlurred ? 'blur-md select-none' : 'blur-0'
                    }`}
                  >
                    <div className="w-12 h-12 rounded-full bg-[#d94f6f]/20 text-[#d94f6f] flex items-center justify-center mx-auto mb-2">
                      <Camera className="w-6 h-6" />
                    </div>
                    <p className="text-xs font-bold text-[#fae8d7]">Ephemeral Photo Proof Verified</p>
                    <p className="text-[10px] text-[#b59ebf]">Inspection complete • Tamper-evident timestamp</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsPhotoBlurred(!isPhotoBlurred)}
                    className="absolute bottom-2 right-2 px-3 py-1 rounded-lg bg-[#251433]/90 hover:bg-[#341b47] text-[11px] font-semibold flex items-center gap-1 border border-[#4a2c59]"
                  >
                    {isPhotoBlurred ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    <span>{isPhotoBlurred ? 'Reveal' : 'Blur'}</span>
                  </button>
                </div>
              )}

              {/* Text Note Display */}
              {task.proof.textNote && (
                <div className="p-3 rounded-xl bg-[#251433] border border-[#381e47] text-xs">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#b59ebf] block mb-1">
                    Submitted Note
                  </span>
                  <p className="text-[#fae8d7] whitespace-pre-wrap leading-relaxed">
                    {task.proof.textNote}
                  </p>
                </div>
              )}

              {/* Voice Note Display */}
              {task.proof.proofType === 'voice_note' && (
                <div className="p-3.5 rounded-xl bg-[#251433] border border-[#381e47] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Mic className="w-4 h-4 text-[#d94f6f]" />
                    <span className="font-semibold text-[#fae8d7]">Voice Whisper Recorded</span>
                  </div>
                  <span className="text-[11px] text-[#b59ebf]">0:48 duration</span>
                </div>
              )}
            </div>

            {/* Assigner Verification Workflow */}
            {isAssigner && task.status === 'submitted' && (
              <div className="space-y-3 pt-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#b59ebf] block">
                  Assigner Feedback / Verification Note (Optional)
                </label>
                <input
                  type="text"
                  value={verificationNote}
                  onChange={e => setVerificationNote(e.target.value)}
                  placeholder="e.g., Flawless execution. Devotion acknowledged."
                  className="w-full px-3 py-2 rounded-xl bg-[#1f112b] border border-[#3b1f4c] text-xs text-[#fae8d7] placeholder-[#6b5873] focus:outline-none"
                />
                <button
                  onClick={handleVerify}
                  className="w-full py-2.5 rounded-xl bg-[#10b981] hover:bg-[#059669] text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-md"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Approve & Mark Verified
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Submission Form */
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Ephemeral Photo Capture */}
            {task.proofType === 'ephemeral_photo' && (
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#b59ebf] block">
                  Ephemeral Photo Proof
                </label>
                <div className="p-6 rounded-2xl border border-dashed border-[#4a2c59] bg-[#1c1026] text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-[#d94f6f]/20 text-[#d94f6f] flex items-center justify-center mx-auto">
                    <Camera className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#fae8d7]">
                      {simulatedPhotoTaken ? 'Photo Captured in Memory' : 'Capture In-App Proof'}
                    </p>
                    <p className="text-[11px] text-[#b59ebf]">
                      Protected by privacy shield. Does not save to gallery.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSimulatedPhotoTaken(!simulatedPhotoTaken)}
                    className="px-4 py-2 rounded-xl bg-[#251433] hover:bg-[#341b47] text-[#fae8d7] text-xs font-semibold border border-[#4a2c59] transition-colors"
                  >
                    {simulatedPhotoTaken ? 'Retake Photo' : 'Simulate Camera Capture'}
                  </button>
                </div>
              </div>
            )}

            {/* Voice Note Simulation */}
            {task.proofType === 'voice_note' && (
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#b59ebf] block">
                  Voice Note Whisper
                </label>
                <div className="p-6 rounded-2xl border border-dashed border-[#4a2c59] bg-[#1c1026] text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-[#c084fc]/20 text-[#c084fc] flex items-center justify-center mx-auto">
                    <Mic className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#fae8d7]">
                      {simulatedAudioRecorded ? 'Audio Whisper Recorded (0:52)' : 'Record Audio Note'}
                    </p>
                    <p className="text-[11px] text-[#b59ebf]">
                      Transmitted securely to assigned recipient.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSimulatedAudioRecorded(!simulatedAudioRecorded)}
                    className="px-4 py-2 rounded-xl bg-[#251433] hover:bg-[#341b47] text-[#fae8d7] text-xs font-semibold border border-[#4a2c59] transition-colors"
                  >
                    {simulatedAudioRecorded ? 'Re-record Audio' : 'Record Whisper'}
                  </button>
                </div>
              </div>
            )}

            {/* Text Note Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#b59ebf] block">
                {task.proofType === 'text_note' ? 'Reflective Proof Journal (Required)' : 'Accompanying Note (Optional)'}
              </label>
              <textarea
                rows={3}
                value={textNote}
                onChange={e => setTextNote(e.target.value)}
                placeholder="Share your completion reflections or verification context..."
                required={task.proofType === 'text_note'}
                className="w-full px-4 py-3 rounded-xl bg-[#1f112b] border border-[#3b1f4c] text-xs text-[#fae8d7] placeholder-[#6b5873] focus:outline-none focus:border-[#d94f6f]"
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
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#d94f6f] to-[#7c3aed] text-white text-xs font-bold shadow-md shadow-[#d94f6f]/25 hover:opacity-95 transition-opacity"
              >
                Submit Proof for Verification
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
