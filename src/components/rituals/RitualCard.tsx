import React from 'react';
import { Ritual, Dynamic } from '@/types/domain';
import {
  formatRitualRecurrence,
  formatRitualStatus,
} from '@/types/legacyAdapters';
import {
  Clock,
  Play,
  CheckCircle2,
  Layers,
} from 'lucide-react';

interface RitualCardProps {
  ritual: Ritual;
  dynamic?: Dynamic;
  onRunRitual: (ritual: Ritual) => void;
  onClick?: () => void;
}

export const RitualCard: React.FC<RitualCardProps> = ({
  ritual,
  dynamic,
  onRunRitual,
  onClick,
}) => {
  const statusInfo = formatRitualStatus(ritual.status);
  const lastCompletion = ritual.completions[0];

  return (
    <div
      onClick={onClick}
      className="group relative p-4 rounded-xl bg-[#191614] hover:bg-[#1f1a18] border border-[#2e2624] hover:border-[#4a3d38] transition-all cursor-pointer space-y-3 shadow-sm hover:shadow-md flex flex-col justify-between"
    >
      <div className="space-y-2.5">
        {/* Top Meta Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 text-[11px] font-semibold rounded-full bg-[#d4af37]/10 text-[#d4af37] border border-[#d4af37]/25">
              {formatRitualRecurrence(ritual.recurrence)}
            </span>
            <span className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-[#25201d] text-[#8c827a] border border-[#382f2c]">
              {statusInfo.label}
            </span>
            {ritual.scheduledTime && (
              <span className="flex items-center gap-1 text-[11px] text-[#8c827a]">
                <Clock className="w-3 h-3" />
                <span>{ritual.scheduledTime}</span>
              </span>
            )}
          </div>

          {dynamic && (
            <span className="text-[11px] font-medium text-[#a89f91] bg-[#25201d] px-2 py-0.5 rounded border border-[#382f2c]">
              {dynamic.name}
            </span>
          )}
        </div>

        {/* Title & Description */}
        <div>
          <h4 className="text-sm font-bold text-[#fae8d7] group-hover:text-[#d4af37] transition-colors leading-snug">
            {ritual.name}
          </h4>
          <p className="text-xs text-[#a89f91] line-clamp-2 mt-1 leading-relaxed">
            {ritual.description}
          </p>
        </div>

        {/* Steps indicator & tags */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-[#8c827a]">
          {ritual.steps && ritual.steps.length > 0 && (
            <span className="flex items-center gap-1 text-[11px] text-[#c4b5a5]">
              <Layers className="w-3 h-3 text-[#d4af37]" />
              <span>{ritual.steps.length} steps</span>
            </span>
          )}

          {ritual.tags?.slice(0, 2).map(tag => (
            <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-[#25201d] text-[#8c827a] border border-[#382f2c]">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="pt-3 border-t border-[#26201e] flex items-center justify-between gap-2">
        <div className="text-[11px] text-[#8c827a]">
          {lastCompletion ? (
            <span className="flex items-center gap-1 text-emerald-400">
              <CheckCircle2 className="w-3 h-3" />
              <span>Done {new Date(lastCompletion.completedAt).toLocaleDateString()}</span>
            </span>
          ) : (
            <span>Not yet practiced today</span>
          )}
        </div>

        <button
          type="button"
          onClick={e => {
            e.stopPropagation();
            onRunRitual(ritual);
          }}
          className="px-3 py-1 rounded-lg bg-[#d4af37] hover:bg-[#e6c250] text-black font-bold text-xs flex items-center gap-1 shadow-sm transition-colors"
        >
          <Play className="w-3 h-3 fill-black" />
          <span>Run</span>
        </button>
      </div>
    </div>
  );
};
