import React from 'react';
import { Agreement, Dynamic, User } from '@/types/domain';
import {
  formatAgreementScope,
  formatConsentStatus,
} from '@/types/legacyAdapters';
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Layers,
} from 'lucide-react';

interface AgreementCardProps {
  agreement: Agreement;
  dynamic?: Dynamic;
  users?: User[];
  currentUserId?: string;
  onClick: () => void;
}

export const AgreementCard: React.FC<AgreementCardProps> = ({
  agreement,
  dynamic,
  onClick,
}) => {
  const statusInfo = formatConsentStatus(agreement.status);

  const approvedCount = agreement.participantResponses.filter(
    r => r.response === 'approved' || r.response === 'definitely_interested'
  ).length;
  const changesRequestedCount = agreement.participantResponses.filter(
    r => r.response === 'changes_requested'
  ).length;
  const totalParticipants = agreement.participantResponses.length;

  return (
    <div
      onClick={onClick}
      className="group relative p-4 rounded-xl bg-[#191614] hover:bg-[#1f1a18] border border-[#2e2624] hover:border-[#4a3d38] transition-all cursor-pointer space-y-3 shadow-sm hover:shadow-md"
    >
      {/* Top Meta Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 text-[11px] font-semibold rounded-full bg-[#d4af37]/10 text-[#d4af37] border border-[#d4af37]/25">
            {formatAgreementScope(agreement.scope)}
          </span>
          <span className={`px-2 py-0.5 text-[11px] font-semibold rounded-full border ${statusInfo.badgeClass}`}>
            {statusInfo.label}
          </span>
        </div>

        {dynamic && (
          <span className="text-[11px] font-medium text-[#a89f91] bg-[#25201d] px-2 py-0.5 rounded border border-[#382f2c]">
            {dynamic.name}
          </span>
        )}
      </div>

      {/* Title & Preview */}
      <div>
        <h4 className="text-sm font-bold text-[#fae8d7] group-hover:text-[#d4af37] transition-colors leading-snug">
          {agreement.title}
        </h4>
        {agreement.content && (
          <p className="text-xs text-[#a89f91] line-clamp-2 mt-1 leading-relaxed">
            {agreement.content}
          </p>
        )}
      </div>

      {/* Sections & Participant Indicators */}
      <div className="pt-2 border-t border-[#26201e] flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-3">
          {agreement.sections && agreement.sections.length > 0 && (
            <span className="flex items-center gap-1 text-[#8c827a] text-[11px]">
              <Layers className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>{agreement.sections.length} clauses</span>
            </span>
          )}

          {/* Participant consensus indicator */}
          <div className="flex items-center gap-1.5">
            {changesRequestedCount > 0 ? (
              <span className="flex items-center gap-1 text-amber-400 text-[11px] font-medium">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{changesRequestedCount} change request</span>
              </span>
            ) : approvedCount === totalParticipants ? (
              <span className="flex items-center gap-1 text-emerald-400 text-[11px] font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{approvedCount}/{totalParticipants} Consented</span>
              </span>
            ) : (
              <span className="flex items-center gap-1 text-sky-400 text-[11px]">
                <Clock className="w-3.5 h-3.5" />
                <span>{approvedCount}/{totalParticipants} Agreed</span>
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1 text-[#8c827a] group-hover:text-[#fae8d7] text-xs transition-colors">
          <span>Inspect</span>
          <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>
    </div>
  );
};
