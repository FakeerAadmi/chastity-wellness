'use client';

import React, { useState } from 'react';
import {
  CheckSquare,
  Plus,
  Clock,
  CheckCircle2,
  Calendar,
  Filter,
  Users,
  Shield,
  Sparkles
} from 'lucide-react';
import { HavenTask, TaskProof, User } from '@/types/domain';
import {
  INITIAL_TASKS,
  INITIAL_RELATIONSHIPS,
  INITIAL_DYNAMICS,
  ALL_USERS,
  CURRENT_USER
} from '@/data/domainDemoData';
import { TaskCard } from '../tasks/TaskCard';
import { TaskCreationModal } from '../tasks/TaskCreationModal';

interface TasksTabProps {
  onNavigateTab?: (tab: string) => void;
  onOpenEmergency?: () => void;
}

export const TasksTab: React.FC<TasksTabProps> = ({
  onNavigateTab,
  onOpenEmergency,
}) => {
  const [tasks, setTasks] = useState<HavenTask[]>(INITIAL_TASKS);
  const [activeFilter, setActiveFilter] = useState<'due_today' | 'assigned_to_me' | 'assigned_by_me' | 'completed' | 'all'>('due_today');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [isCreationModalOpen, setIsCreationModalOpen] = useState(false);

  const currentUser = CURRENT_USER;
  const allUsers = ALL_USERS;
  const relationships = INITIAL_RELATIONSHIPS;
  const dynamics = INITIAL_DYNAMICS;

  // Toggle completion
  const handleToggleComplete = (taskId: string) => {
    setTasks(prev =>
      prev.map(t => {
        if (t.id !== taskId) return t;
        const isDone = t.status === 'completed' || t.status === 'verified';
        return {
          ...t,
          status: isDone ? 'pending' : 'completed',
          updatedAt: new Date().toISOString(),
        };
      })
    );
  };

  // Submit proof
  const handleSubmitProof = (taskId: string, proof: TaskProof) => {
    setTasks(prev =>
      prev.map(t => {
        if (t.id !== taskId) return t;
        return {
          ...t,
          status: 'submitted',
          proof,
          updatedAt: new Date().toISOString(),
        };
      })
    );
  };

  // Verify proof (assigner action)
  const handleVerifyProof = (taskId: string, verificationNote?: string) => {
    setTasks(prev =>
      prev.map(t => {
        if (t.id !== taskId) return t;
        return {
          ...t,
          status: 'verified',
          proof: t.proof
            ? {
                ...t.proof,
                verifiedAt: new Date().toISOString(),
                verifiedById: currentUser.id,
                verificationNote,
              }
            : undefined,
          updatedAt: new Date().toISOString(),
        };
      })
    );
  };

  const handleCreateTask = (newTask: HavenTask) => {
    setTasks(prev => [newTask, ...prev]);
  };

  // Filter tasks
  const dueTodayTasks = tasks.filter(
    t => (t.priority === 'high_focus' || t.recurrence === 'daily') && t.status !== 'completed' && t.status !== 'verified'
  );

  const assignedToMeTasks = tasks.filter(
    t => t.assignedToIds.includes(currentUser.id) && t.status !== 'completed' && t.status !== 'verified'
  );

  const assignedByMeTasks = tasks.filter(
    t => t.assignedById === currentUser.id
  );

  const completedTasks = tasks.filter(
    t => t.status === 'completed' || t.status === 'verified'
  );

  const displayedTasks = tasks.filter(t => {
    // Category match
    if (categoryFilter !== 'all' && t.category !== categoryFilter) return false;

    if (activeFilter === 'due_today') {
      return (t.priority === 'high_focus' || t.recurrence === 'daily') && t.status !== 'completed' && t.status !== 'verified';
    }
    if (activeFilter === 'assigned_to_me') {
      return t.assignedToIds.includes(currentUser.id) && t.status !== 'completed' && t.status !== 'verified';
    }
    if (activeFilter === 'assigned_by_me') {
      return t.assignedById === currentUser.id;
    }
    if (activeFilter === 'completed') {
      return t.status === 'completed' || t.status === 'verified';
    }
    return true;
  });

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#251433] text-[#d94f6f] text-xs font-semibold border border-[#4a2c59] mb-2">
            <CheckSquare className="w-3.5 h-3.5" />
            <span>Practice & Devotion Assignments</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-[#fae8d7]">
            Tasks & Accountability
          </h1>
          <p className="text-xs sm:text-sm text-[#b59ebf] max-w-xl">
            Structured daily service, hygiene protocols, bedtime reflections, and agreed rewards. Free from manipulative gamification.
          </p>
        </div>

        {/* Action Button */}
        <button
          onClick={() => setIsCreationModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#d94f6f] to-[#7c3aed] text-white text-xs font-bold shadow-md shadow-[#d94f6f]/25 hover:opacity-95 transition-opacity flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Task</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* State filters */}
        <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-[#1c1026] border border-[#2f193d]">
          <button
            onClick={() => setActiveFilter('due_today')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeFilter === 'due_today'
                ? 'bg-[#d94f6f] text-white shadow-sm'
                : 'text-[#b59ebf] hover:text-[#fae8d7]'
            }`}
          >
            <span>Today / High Focus</span>
            {dueTodayTasks.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-white/20 text-[10px]">
                {dueTodayTasks.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveFilter('assigned_to_me')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeFilter === 'assigned_to_me'
                ? 'bg-[#d94f6f] text-white shadow-sm'
                : 'text-[#b59ebf] hover:text-[#fae8d7]'
            }`}
          >
            <span>Assigned to Me</span>
            {assignedToMeTasks.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-white/20 text-[10px]">
                {assignedToMeTasks.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveFilter('assigned_by_me')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeFilter === 'assigned_by_me'
                ? 'bg-[#d94f6f] text-white shadow-sm'
                : 'text-[#b59ebf] hover:text-[#fae8d7]'
            }`}
          >
            <span>Assigned by Me</span>
          </button>

          <button
            onClick={() => setActiveFilter('completed')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeFilter === 'completed'
                ? 'bg-[#d94f6f] text-white shadow-sm'
                : 'text-[#b59ebf] hover:text-[#fae8d7]'
            }`}
          >
            <span>Completed ({completedTasks.length})</span>
          </button>

          <button
            onClick={() => setActiveFilter('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeFilter === 'all'
                ? 'bg-[#d94f6f] text-white shadow-sm'
                : 'text-[#b59ebf] hover:text-[#fae8d7]'
            }`}
          >
            <span>All ({tasks.length})</span>
          </button>
        </div>

        {/* Category filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-[#b59ebf]" />
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-[#1c1026] border border-[#2f193d] text-xs text-[#fae8d7] focus:outline-none"
          >
            <option value="all">All Categories</option>
            <option value="ds_protocol">D/s Protocol & Posture</option>
            <option value="chastity">Chastity & Skin Hygiene</option>
            <option value="ldr">Long-Distance Intimacy</option>
            <option value="relationship_care">Relationship Care</option>
            <option value="ordinary">Everyday Date Planning</option>
          </select>
        </div>
      </div>

      {/* Task List Feed */}
      <div className="space-y-3">
        {displayedTasks.length === 0 ? (
          <div className="p-8 text-center rounded-3xl bg-[#160d20] border border-[#2f193d] space-y-2">
            <CheckCircle2 className="w-8 h-8 text-[#b59ebf] mx-auto opacity-50" />
            <h3 className="text-base font-bold text-[#fae8d7]">No Tasks in This View</h3>
            <p className="text-xs text-[#b59ebf] max-w-sm mx-auto">
              All commitments completed or no tasks assigned under this filter.
            </p>
          </div>
        ) : (
          displayedTasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              currentUser={currentUser}
              allUsers={allUsers}
              onToggleComplete={handleToggleComplete}
              onSubmitProof={handleSubmitProof}
              onVerifyProof={handleVerifyProof}
            />
          ))
        )}
      </div>

      {/* Creation Modal */}
      <TaskCreationModal
        isOpen={isCreationModalOpen}
        onClose={() => setIsCreationModalOpen(false)}
        currentUser={currentUser}
        allUsers={allUsers}
        relationships={relationships}
        dynamics={dynamics}
        onCreateTask={handleCreateTask}
      />
    </div>
  );
};
