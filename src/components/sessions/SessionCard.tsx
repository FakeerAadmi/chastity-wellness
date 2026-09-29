import React from 'react';
import { Session, Dynamic, Agreement, User } from '@/types/domain';
import {
  formatSessionStatus,
  formatSessionType,
} from '@/types/legacyAdapters';
import {
  Clock,
  ChevronRight,
  Shield,
  Users,
} from 'lucide-react';

interface SessionCardProps {
  session: Session;
  dynamic?: Dynamic;
  agreement?: Agreement;
  users: User[];
  currentUserId?: string;
  onClick: () => void;
}

export const SessionCard: React.FC<SessionCardProps> = ({
  session,
  dynamic,
  agreement,
  users,
  onClick,
}) => {
  const statusInfo = formatSessionStatus(session.status);
  const getUser = (userId: string) => users.find(u => u.id === userId);

  return (
    <div
      onClick={onClick}
      className="group relative p-4 rounded-xl bg-[#191614] hover:bg-[#1f1a18] border border-[#2e2624] hover:border-[#4a3d38] transition-all cursor-pointer space-y-3 shadow-sm hover:shadow-md"
    >
      {/* Top Meta Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 text-[11px] font-semibold rounded-full bg-[#d4af37]/10 text-[#d4af37] border border-[#d4af37]/25">
            {formatSessionType(session.sessionType)}
          </span>
          <span className={`px-2 py-0.5 text-[11px] font-semibold rounded-full border flex items-center gap-1.5 ${statusInfo.badgeClass}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${statusInfo.dotClass}`} />
            <span>{statusInfo.label}</span>
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
          {session.title || 'Dynamic Practice Session'}
        </h4>
        {session.goal && (
          <p className="text-xs text-[#a89f91] line-clamp-2 mt-1 leading-relaxed">
            {session.goal}
          </p>
        )}
      </div>

      {/* Governed by Agreement Callout */}
      {agreement && (
        <div className="flex items-center gap-1.5 text-[11px] text-[#c4b5a5] bg-[#201c1a] px-2.5 py-1 rounded-lg border border-[#332b28]">
          <Shield className="w-3 h-3 text-[#d4af37] shrink-0" />
          <span className="truncate">Governed by: <strong className="text-[#fae8d7]">{agreement.title}</strong></span>
        </div>
      )}

      {/* Tags if present */}
      {session.tags && session.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {session.tags.slice(0, 3).map(tag => (
            <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-[#25201d] text-[#8c827a] border border-[#382f2c]">
              {tag}
            </span>
          ))}
          {session.tags.length > 3 && (
            <span className="text-[10px] text-[#6b625b] self-center">
              +{session.tags.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Bottom Bar: Participants & Timing */}
      <div className="pt-2 border-t border-[#26201e] flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2 text-[#8c827a] text-[11px]">
          <div className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-[#a89f91]" />
            <span>
              {session.participantIds.map(pid => getUser(pid)?.displayName || pid).join(', ')}
            </span>
          </div>

          {session.scheduledFor && session.status === 'planned' && (
            <span className="flex items-center gap-1 text-sky-400">
              <Clock className="w-3 h-3" />
              <span>{new Date(session.scheduledFor).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </span>
          )}

          {session.startedAt && session.status === 'active' && (
            <span className="text-emerald-400 font-medium">
              Live now
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 text-[#8c827a] group-hover:text-[#fae8d7] text-xs transition-colors">
          <span>Manage</span>
          <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>
    </div>
  );
};
