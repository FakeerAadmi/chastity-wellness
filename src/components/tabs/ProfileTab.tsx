'use client';

import React, { useState, useEffect } from 'react';
import { DEFAULT_USER_PROFILE } from '@/data/defaultProfile';
import {
  SEXUALITY_OPTIONS,
  GENDER_IDENTITY_OPTIONS,
  GENDER_EXPRESSION_OPTIONS,
  RELATIONSHIP_STRUCTURE_OPTIONS,
  KINKS_CATALOG,
  LIMITS_CATALOG
} from '@/data/inclusiveOptions';
import { UserProfile } from '@/types';
import {
  User,
  ShieldCheck,
  Heart,
  Ruler,
  Lock,
  Key,
  Copy,
  Check,
  Edit3,
  Save,
  X,
  AlertCircle,
  Sparkles,
  Flame,
  ShieldAlert,
  Download,
  Calendar,
  MapPin,
  Clock,
  Layers,
  HeartPulse,
  CheckCircle2,
  Users,
  Compass,
  Plus,
  Trash2
} from 'lucide-react';

export const ProfileTab: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_USER_PROFILE);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<'overview' | 'identity' | 'anatomy' | 'kinks' | 'limits'>('overview');
  const [customKinkInput, setCustomKinkInput] = useState('');
  const [customLimitInput, setCustomLimitInput] = useState('');

  // Load from localStorage if present
  useEffect(() => {
    const saved = localStorage.getItem('haven_user_profile');
    if (saved) {
      try {
        setProfile(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse profile', e);
      }
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('haven_user_profile', JSON.stringify(profile));
    setIsEditing(false);
  };

  const handleCopyPartnerCode = () => {
    navigator.clipboard.writeText(profile.partnerCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(profile, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${profile.username.toLowerCase().replace(/\s+/g, '_')}_haven_profile.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const toggleKink = (kink: string) => {
    if (!isEditing) return;
    setProfile(prev => {
      const exists = prev.kinkTags.includes(kink);
      return {
        ...prev,
        kinkTags: exists ? prev.kinkTags.filter(k => k !== kink) : [...prev.kinkTags, kink]
      };
    });
  };

  const addCustomKink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customKinkInput.trim()) return;
    if (!profile.kinkTags.includes(customKinkInput.trim())) {
      setProfile(prev => ({ ...prev, kinkTags: [...prev.kinkTags, customKinkInput.trim()] }));
    }
    setCustomKinkInput('');
  };

  const toggleHardLimit = (limit: string) => {
    if (!isEditing) return;
    setProfile(prev => {
      const exists = prev.hardLimits.includes(limit);
      return {
        ...prev,
        hardLimits: exists ? prev.hardLimits.filter(l => l !== limit) : [...prev.hardLimits, limit]
      };
    });
  };

  const toggleSoftLimit = (limit: string) => {
    if (!isEditing) return;
    setProfile(prev => {
      const exists = prev.softLimits.includes(limit);
      return {
        ...prev,
        softLimits: exists ? prev.softLimits.filter(l => l !== limit) : [...prev.softLimits, limit]
      };
    });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-200">
      {/* Profile Header Hero Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#1c1026] border border-[#381e47] shadow-xl relative overflow-hidden space-y-6">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-[#d94f6f]/15 to-[#7c3aed]/10 blur-3xl pointer-events-none rounded-full" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-br from-[#d94f6f] via-[#be185d] to-[#7c3aed] flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-[#d94f6f]/25 shrink-0">
              {profile.username.slice(0, 2).toUpperCase()}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-black text-[#fae8d7] tracking-tight">
                  {profile.username}
                </h1>
                <span className="text-xs font-mono text-[#b59ebf]">{profile.handle}</span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#251433] text-[#d94f6f] border border-[#d94f6f]/40">
                  {profile.role}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-[#0f0714] text-[#b59ebf] border border-[#381e47]">
                  {profile.pronouns}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-[#251433] text-purple-300 border border-purple-800/60">
                  {profile.genderIdentity}
                </span>
              </div>

              <p className="text-xs text-[#b59ebf] flex items-center gap-3 flex-wrap">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#d94f6f]" />
                  {profile.location}
                </span>
                <span>&bull;</span>
                <span className="flex items-center gap-1">
                  <Heart className="w-3.5 h-3.5 text-[#d94f6f]" />
                  {profile.sexuality}
                </span>
                <span>&bull;</span>
                <span className="text-emerald-400 font-semibold">{profile.relationshipStructure}</span>
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
            {isEditing ? (
              <>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-3.5 py-2 rounded-xl border border-[#381e47] text-xs font-semibold text-[#b59ebf] hover:text-[#fae8d7] flex items-center gap-1.5"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Cancel</span>
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#d94f6f] to-[#be185d] text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-[#d94f6f]/20"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Changes</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 rounded-xl bg-[#251433] hover:bg-[#381e47] border border-[#4a2c59] text-xs font-bold text-[#fae8d7] flex items-center gap-1.5 transition-colors"
              >
                <Edit3 className="w-3.5 h-3.5 text-[#d94f6f]" />
                <span>Edit Profile</span>
              </button>
            )}
          </div>
        </div>

        {/* Bio */}
        {isEditing ? (
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-[#b59ebf] uppercase">Bio & Intimacy Philosophy</label>
            <textarea
              rows={2}
              value={profile.bio}
              onChange={e => setProfile({ ...profile, bio: e.target.value })}
              className="w-full p-3 rounded-xl border border-[#381e47] bg-[#0f0714] text-xs text-[#fae8d7] focus:outline-none focus:ring-1 focus:ring-[#d94f6f]"
            />
          </div>
        ) : (
          <p className="text-xs sm:text-sm text-[#fae8d7]/90 leading-relaxed max-w-3xl">
            "{profile.bio}"
          </p>
        )}

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-[#251433]">
          <div className="p-3 bg-[#0f0714] rounded-2xl border border-[#381e47] space-y-0.5">
            <span className="text-[10px] text-[#b59ebf] uppercase font-bold block flex items-center gap-1">
              <Clock className="w-3 h-3 text-[#d94f6f]" />
              Total Hours Worn
            </span>
            <span className="font-mono text-xl font-black text-[#fae8d7]">
              {profile.totalHoursWorn} hrs
            </span>
          </div>

          <div className="p-3 bg-[#0f0714] rounded-2xl border border-[#381e47] space-y-0.5">
            <span className="text-[10px] text-[#b59ebf] uppercase font-bold block flex items-center gap-1">
              <Lock className="w-3 h-3 text-[#d94f6f]" />
              Sessions Completed
            </span>
            <span className="font-mono text-xl font-black text-[#fae8d7]">
              {profile.completedSessions}
            </span>
          </div>

          <div className="p-3 bg-[#0f0714] rounded-2xl border border-[#381e47] space-y-0.5">
            <span className="text-[10px] text-[#b59ebf] uppercase font-bold block flex items-center gap-1">
              <HeartPulse className="w-3 h-3 text-emerald-400" />
              Hygiene Score
            </span>
            <span className="font-mono text-xl font-black text-emerald-400">
              {profile.hygieneComplianceRate}%
            </span>
          </div>

          <div className="p-3 bg-[#0f0714] rounded-2xl border border-[#381e47] space-y-0.5">
            <span className="text-[10px] text-[#b59ebf] uppercase font-bold block flex items-center gap-1">
              <Heart className="w-3 h-3 text-[#d94f6f]" />
              Check-In Pulses
            </span>
            <span className="font-mono text-xl font-black text-[#fae8d7]">
              {profile.dailyPulsesSubmitted}
            </span>
          </div>
        </div>

        {/* Partner Connection Code Bar */}
        <div className="p-3.5 rounded-2xl bg-[#0f0714] border border-[#381e47] flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <Key className="w-4 h-4 text-[#d94f6f]" />
            <span className="text-[#b59ebf]">Private Partner Sync Code:</span>
            <span className="font-mono font-bold text-[#fae8d7]">{profile.partnerCode}</span>
          </div>

          <button
            onClick={handleCopyPartnerCode}
            className="flex items-center gap-1 text-[11px] text-[#d94f6f] hover:underline font-bold"
          >
            {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedCode ? 'Copied!' : 'Copy Code'}</span>
          </button>
        </div>
      </div>

      {/* Profile Section Navigation Tabs */}
      <div className="flex items-center justify-center gap-1.5 p-1.5 bg-[#1c1026] border border-[#381e47] rounded-2xl max-w-2xl mx-auto text-xs font-semibold flex-wrap">
        <button
          onClick={() => setActiveSection('overview')}
          className={`py-2 px-3.5 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
            activeSection === 'overview'
              ? 'bg-[#251433] text-[#fae8d7] border border-[#d94f6f]/50 shadow-xs'
              : 'text-[#b59ebf] hover:text-[#fae8d7]'
          }`}
        >
          <User className="w-3.5 h-3.5 text-[#d94f6f]" />
          <span>Overview</span>
        </button>

        <button
          onClick={() => setActiveSection('identity')}
          className={`py-2 px-3.5 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
            activeSection === 'identity'
              ? 'bg-[#251433] text-[#fae8d7] border border-[#d94f6f]/50 shadow-xs'
              : 'text-[#b59ebf] hover:text-[#fae8d7]'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-[#d94f6f]" />
          <span>Sexuality & Gender</span>
        </button>

        <button
          onClick={() => setActiveSection('anatomy')}
          className={`py-2 px-3.5 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
            activeSection === 'anatomy'
              ? 'bg-[#251433] text-[#fae8d7] border border-[#d94f6f]/50 shadow-xs'
              : 'text-[#b59ebf] hover:text-[#fae8d7]'
          }`}
        >
          <Ruler className="w-3.5 h-3.5 text-[#d94f6f]" />
          <span>Anatomy & Fit</span>
        </button>

        <button
          onClick={() => setActiveSection('kinks')}
          className={`py-2 px-3.5 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
            activeSection === 'kinks'
              ? 'bg-[#251433] text-[#fae8d7] border border-[#d94f6f]/50 shadow-xs'
              : 'text-[#b59ebf] hover:text-[#fae8d7]'
          }`}
        >
          <Flame className="w-3.5 h-3.5 text-[#d94f6f]" />
          <span>Kinks & Desires</span>
        </button>

        <button
          onClick={() => setActiveSection('limits')}
          className={`py-2 px-3.5 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
            activeSection === 'limits'
              ? 'bg-[#251433] text-[#fae8d7] border border-[#d94f6f]/50 shadow-xs'
              : 'text-[#b59ebf] hover:text-[#fae8d7]'
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5 text-[#d94f6f]" />
          <span>Limits & Safeguards</span>
        </button>
      </div>

      {/* SECTION: OVERVIEW */}
      {activeSection === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-3xl bg-[#1c1026] border border-[#381e47] space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#fae8d7] flex items-center gap-2">
              <User className="w-4 h-4 text-[#d94f6f]" />
              <span>Identity Summary</span>
            </h2>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center py-1.5 border-b border-[#251433]">
                <span className="text-[#b59ebf]">Display Name</span>
                <span className="font-bold text-[#fae8d7]">{profile.username}</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-[#251433]">
                <span className="text-[#b59ebf]">Pronouns</span>
                <span className="font-medium text-[#fae8d7]">{profile.pronouns}</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-[#251433]">
                <span className="text-[#b59ebf]">Sexuality</span>
                <span className="font-bold text-[#d94f6f]">{profile.sexuality}</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-[#251433]">
                <span className="text-[#b59ebf]">Gender Identity</span>
                <span className="font-medium text-[#fae8d7]">{profile.genderIdentity}</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-[#251433]">
                <span className="text-[#b59ebf]">Gender Expression</span>
                <span className="font-medium text-[#fae8d7]">{profile.genderExpression}</span>
              </div>
              <div className="flex justify-between items-center py-1.5">
                <span className="text-[#b59ebf]">Relationship Dynamic</span>
                <span className="font-bold text-emerald-400">{profile.relationshipStructure}</span>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-[#1c1026] border border-[#381e47] space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#fae8d7] flex items-center gap-2">
              <Download className="w-4 h-4 text-[#d94f6f]" />
              <span>Data Sovereignty & Local Storage</span>
            </h2>

            <p className="text-xs text-[#b59ebf] leading-relaxed">
              Your profile, kinks, limits, and anatomical data live entirely on your device. Haven does not track or sell intimate personal records.
            </p>

            <div className="pt-2 space-y-2.5">
              <button
                onClick={handleExportJson}
                className="w-full py-2.5 px-4 rounded-xl bg-[#251433] hover:bg-[#381e47] border border-[#4a2c59] text-xs font-bold text-[#fae8d7] flex items-center justify-center gap-2 transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-[#d94f6f]" />
                <span>Export Profile JSON Dossier</span>
              </button>

              <button
                onClick={() => {
                  if (confirm('Reset profile to default demo data?')) {
                    localStorage.removeItem('haven_user_profile');
                    setProfile(DEFAULT_USER_PROFILE);
                  }
                }}
                className="w-full py-2 px-4 rounded-xl text-xs font-medium text-[#b59ebf] hover:text-rose-400 transition-colors text-center block"
              >
                Reset to Default Demo Data
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SECTION: SEXUALITY, GENDER & INCLUSIVITY */}
      {activeSection === 'identity' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-[#1c1026] border border-[#381e47] space-y-6">
          <div className="border-b border-[#251433] pb-3">
            <h2 className="text-base font-bold text-[#fae8d7] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#d94f6f]" />
              <span>Inclusive Identity, Expression & Dynamics</span>
            </h2>
            <p className="text-xs text-[#b59ebf]">
              Chastity, power exchange, and intimacy embrace all gender identities, sexualities, and relationship forms.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
            {/* Sexuality Picker */}
            <div className="space-y-2">
              <label className="font-bold text-[#fae8d7] uppercase tracking-wider block">
                Sexual & Romantic Orientation
              </label>
              {isEditing ? (
                <select
                  value={profile.sexuality}
                  onChange={e => setProfile({ ...profile, sexuality: e.target.value })}
                  className="w-full p-3 rounded-xl border border-[#381e47] bg-[#0f0714] text-[#fae8d7] focus:outline-none focus:ring-1 focus:ring-[#d94f6f]"
                >
                  {SEXUALITY_OPTIONS.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              ) : (
                <div className="p-3 rounded-2xl bg-[#0f0714] border border-[#381e47] font-semibold text-[#d94f6f]">
                  {profile.sexuality}
                </div>
              )}
            </div>

            {/* Gender Identity Picker */}
            <div className="space-y-2">
              <label className="font-bold text-[#fae8d7] uppercase tracking-wider block">
                Gender Identity
              </label>
              {isEditing ? (
                <select
                  value={profile.genderIdentity}
                  onChange={e => setProfile({ ...profile, genderIdentity: e.target.value })}
                  className="w-full p-3 rounded-xl border border-[#381e47] bg-[#0f0714] text-[#fae8d7] focus:outline-none focus:ring-1 focus:ring-[#d94f6f]"
                >
                  {GENDER_IDENTITY_OPTIONS.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              ) : (
                <div className="p-3 rounded-2xl bg-[#0f0714] border border-[#381e47] font-semibold text-[#fae8d7]">
                  {profile.genderIdentity}
                </div>
              )}
            </div>

            {/* Gender Expression Picker */}
            <div className="space-y-2">
              <label className="font-bold text-[#fae8d7] uppercase tracking-wider block">
                Gender Expression
              </label>
              {isEditing ? (
                <select
                  value={profile.genderExpression}
                  onChange={e => setProfile({ ...profile, genderExpression: e.target.value })}
                  className="w-full p-3 rounded-xl border border-[#381e47] bg-[#0f0714] text-[#fae8d7] focus:outline-none focus:ring-1 focus:ring-[#d94f6f]"
                >
                  {GENDER_EXPRESSION_OPTIONS.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              ) : (
                <div className="p-3 rounded-2xl bg-[#0f0714] border border-[#381e47] font-semibold text-[#fae8d7]">
                  {profile.genderExpression}
                </div>
              )}
            </div>

            {/* Relationship Structure Picker */}
            <div className="space-y-2">
              <label className="font-bold text-[#fae8d7] uppercase tracking-wider block">
                Relationship Dynamic Structure
              </label>
              {isEditing ? (
                <select
                  value={profile.relationshipStructure}
                  onChange={e => setProfile({ ...profile, relationshipStructure: e.target.value })}
                  className="w-full p-3 rounded-xl border border-[#381e47] bg-[#0f0714] text-[#fae8d7] focus:outline-none focus:ring-1 focus:ring-[#d94f6f]"
                >
                  {RELATIONSHIP_STRUCTURE_OPTIONS.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              ) : (
                <div className="p-3 rounded-2xl bg-[#0f0714] border border-[#381e47] font-semibold text-emerald-400">
                  {profile.relationshipStructure}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SECTION: ANATOMY & SIZING DOSSIER */}
      {activeSection === 'anatomy' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-3xl bg-[#1c1026] border border-[#381e47] space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#fae8d7] flex items-center gap-2">
              <Ruler className="w-4 h-4 text-[#d94f6f]" />
              <span>Physical Attributes & Build</span>
            </h2>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-[#b59ebf] block">Height</span>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profile.height}
                      onChange={e => setProfile({ ...profile, height: e.target.value })}
                      className="w-full p-2 mt-1 rounded-xl border border-[#381e47] bg-[#0f0714] text-[#fae8d7]"
                    />
                  ) : (
                    <span className="font-bold text-[#fae8d7]">{profile.height}</span>
                  )}
                </div>

                <div>
                  <span className="text-[#b59ebf] block">Weight</span>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profile.weight}
                      onChange={e => setProfile({ ...profile, weight: e.target.value })}
                      className="w-full p-2 mt-1 rounded-xl border border-[#381e47] bg-[#0f0714] text-[#fae8d7]"
                    />
                  ) : (
                    <span className="font-bold text-[#fae8d7]">{profile.weight}</span>
                  )}
                </div>
              </div>

              <div>
                <span className="text-[#b59ebf] block">Body Build</span>
                {isEditing ? (
                  <select
                    value={profile.bodyBuild}
                    onChange={e => setProfile({ ...profile, bodyBuild: e.target.value as any })}
                    className="w-full p-2 mt-1 rounded-xl border border-[#381e47] bg-[#0f0714] text-[#fae8d7]"
                  >
                    <option value="Athletic">Athletic</option>
                    <option value="Average">Average</option>
                    <option value="Slim">Slim</option>
                    <option value="Muscular">Muscular</option>
                    <option value="Heavy">Heavy</option>
                  </select>
                ) : (
                  <span className="font-bold text-[#fae8d7]">{profile.bodyBuild}</span>
                )}
              </div>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-[#1c1026] border border-[#381e47] space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#fae8d7] flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#d94f6f]" />
              <span>Anatomical Sizing Specifications</span>
            </h2>

            <div className="grid grid-cols-3 gap-2.5 text-center text-xs">
              <div className="p-3 bg-[#0f0714] rounded-2xl border border-[#381e47]">
                <span className="text-[10px] text-[#b59ebf] block">Ring Diameter</span>
                {isEditing ? (
                  <input
                    type="number"
                    value={profile.baseRingDiameterMm}
                    onChange={e => setProfile({ ...profile, baseRingDiameterMm: parseInt(e.target.value) || 45 })}
                    className="w-full p-1 mt-1 font-mono text-center rounded bg-[#1c1026] text-[#d94f6f]"
                  />
                ) : (
                  <span className="font-mono text-lg font-black text-[#d94f6f]">
                    {profile.baseRingDiameterMm} mm
                  </span>
                )}
              </div>

              <div className="p-3 bg-[#0f0714] rounded-2xl border border-[#381e47]">
                <span className="text-[10px] text-[#b59ebf] block">Cage Depth</span>
                {isEditing ? (
                  <input
                    type="number"
                    value={profile.cageLengthDepthMm}
                    onChange={e => setProfile({ ...profile, cageLengthDepthMm: parseInt(e.target.value) || 65 })}
                    className="w-full p-1 mt-1 font-mono text-center rounded bg-[#1c1026] text-[#fae8d7]"
                  />
                ) : (
                  <span className="font-mono text-lg font-black text-[#fae8d7]">
                    {profile.cageLengthDepthMm} mm
                  </span>
                )}
              </div>

              <div className="p-3 bg-[#0f0714] rounded-2xl border border-[#381e47]">
                <span className="text-[10px] text-[#b59ebf] block">Spacer Pin</span>
                {isEditing ? (
                  <input
                    type="number"
                    value={profile.spacerPreferenceMm}
                    onChange={e => setProfile({ ...profile, spacerPreferenceMm: parseInt(e.target.value) || 5 })}
                    className="w-full p-1 mt-1 font-mono text-center rounded bg-[#1c1026] text-[#fae8d7]"
                  />
                ) : (
                  <span className="font-mono text-lg font-black text-[#fae8d7]">
                    {profile.spacerPreferenceMm} mm
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <span className="text-xs font-semibold text-[#b59ebf] block">
                Compatible / Certified Materials:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {profile.preferredMaterials.map((mat, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-xl bg-[#251433] text-[#fae8d7] border border-[#4a2c59] text-[11px]"
                  >
                    {mat}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-1 pt-1">
              <span className="text-xs font-semibold text-[#b59ebf] block">
                Skin Sensitivities & Allergies:
              </span>
              {profile.skinAllergies.map((allergy, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-xl bg-amber-950/40 text-amber-200 border border-amber-800/80 text-[11px] block"
                >
                  &bull; {allergy}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SECTION: KINKS & DESIRES CATALOG */}
      {activeSection === 'kinks' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-[#1c1026] border border-[#381e47] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#251433] pb-3">
              <div>
                <h2 className="text-base font-bold text-[#fae8d7] flex items-center gap-2">
                  <Flame className="w-4 h-4 text-[#d94f6f]" />
                  <span>My Active Kinks & Desires ({profile.kinkTags.length})</span>
                </h2>
                <p className="text-xs text-[#b59ebf]">
                  {isEditing ? 'Click any tag below to add or remove it from your profile.' : 'Items currently on your profile.'}
                </p>
              </div>

              {isEditing && (
                <form onSubmit={addCustomKink} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add custom kink..."
                    value={customKinkInput}
                    onChange={e => setCustomKinkInput(e.target.value)}
                    className="px-3 py-1.5 rounded-xl border border-[#381e47] bg-[#0f0714] text-xs text-[#fae8d7] focus:outline-none focus:ring-1 focus:ring-[#d94f6f]"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 rounded-xl bg-[#251433] hover:bg-[#381e47] text-[#d94f6f] border border-[#4a2c59] text-xs font-bold"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>

            {/* Active Tags */}
            <div className="flex flex-wrap gap-2 pt-1">
              {profile.kinkTags.map((tag, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => toggleKink(tag)}
                  className={`px-3.5 py-1.5 rounded-2xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    isEditing
                      ? 'bg-[#d94f6f] text-white hover:bg-rose-700 shadow-sm'
                      : 'bg-[#251433] text-[#fae8d7] border border-[#d94f6f]/40 shadow-sm'
                  }`}
                >
                  <Sparkles className="w-3 h-3 text-[#d94f6f] text-white" />
                  <span>{tag}</span>
                  {isEditing && <X className="w-3 h-3 ml-1" />}
                </button>
              ))}
            </div>
          </div>

          {/* Full Kink Catalog */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#b59ebf] pl-1">
              Explore & Select From Complete Kink Catalog {isEditing ? '(Click to toggle)' : ''}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {KINKS_CATALOG.map((cat, idx) => (
                <div key={idx} className="p-5 rounded-3xl bg-[#1c1026] border border-[#381e47] space-y-3 text-xs">
                  <h4 className="font-bold text-[#fae8d7] border-b border-[#251433] pb-2">
                    {cat.category}
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {cat.items.map((item, itemIdx) => {
                      const isSelected = profile.kinkTags.includes(item);
                      return (
                        <button
                          key={itemIdx}
                          type="button"
                          disabled={!isEditing}
                          onClick={() => toggleKink(item)}
                          className={`px-2.5 py-1 rounded-xl text-[11px] font-medium transition-all ${
                            isSelected
                              ? 'bg-[#d94f6f] text-white shadow-xs'
                              : 'bg-[#0f0714] text-[#b59ebf] border border-[#381e47] hover:border-[#4a2c59]'
                          } ${isEditing ? 'cursor-pointer' : 'cursor-default'}`}
                        >
                          {isSelected && '✓ '}
                          {item}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SECTION: LIMITS & SAFEGUARDS */}
      {activeSection === 'limits' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Hard Limits */}
            <div className="p-6 rounded-3xl bg-[#1c1026] border border-rose-900/60 space-y-4">
              <div className="flex items-center gap-2 text-rose-300 font-bold text-sm uppercase tracking-wider">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                <span>Hard Limits (Absolute Red Lines)</span>
              </div>
              <p className="text-xs text-[#b59ebf]">
                Non-negotiable parameters that are never crossed under any circumstances:
              </p>
              <div className="space-y-2">
                {profile.hardLimits.map((limit, i) => (
                  <div
                    key={i}
                    onClick={() => toggleHardLimit(limit)}
                    className={`p-3 rounded-xl bg-rose-950/30 border border-rose-900/50 text-xs text-rose-200 font-medium flex items-center justify-between ${
                      isEditing ? 'cursor-pointer hover:bg-rose-900/40' : ''
                    }`}
                  >
                    <span>&bull; {limit}</span>
                    {isEditing && <X className="w-3.5 h-3.5 text-rose-400" />}
                  </div>
                ))}
              </div>
            </div>

            {/* Soft Limits */}
            <div className="p-6 rounded-3xl bg-[#1c1026] border border-amber-900/60 space-y-4">
              <div className="flex items-center gap-2 text-amber-300 font-bold text-sm uppercase tracking-wider">
                <AlertCircle className="w-4 h-4 text-amber-400" />
                <span>Soft Limits (Conditional / Negotiable)</span>
              </div>
              <p className="text-xs text-[#b59ebf]">
                Allowed with prior discussion, check-ins, or explicit partner consent:
              </p>
              <div className="space-y-2">
                {profile.softLimits.map((limit, i) => (
                  <div
                    key={i}
                    onClick={() => toggleSoftLimit(limit)}
                    className={`p-3 rounded-xl bg-amber-950/30 border border-amber-900/50 text-xs text-amber-200 font-medium flex items-center justify-between ${
                      isEditing ? 'cursor-pointer hover:bg-amber-900/40' : ''
                    }`}
                  >
                    <span>&bull; {limit}</span>
                    {isEditing && <X className="w-3.5 h-3.5 text-amber-400" />}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Full Limits Catalog for selection */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#b59ebf] pl-1">
              Select Limits From Standard Catalog {isEditing ? '(Click Red for Hard Limit, Yellow for Soft Limit)' : ''}
            </h3>

            <div className="space-y-4">
              {LIMITS_CATALOG.map((cat, idx) => (
                <div key={idx} className="p-5 rounded-3xl bg-[#1c1026] border border-[#381e47] space-y-3 text-xs">
                  <h4 className="font-bold text-[#fae8d7] border-b border-[#251433] pb-2">
                    {cat.category}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {cat.items.map((item, itemIdx) => {
                      const isHard = profile.hardLimits.includes(item);
                      const isSoft = profile.softLimits.includes(item);
                      return (
                        <div
                          key={itemIdx}
                          className="p-2.5 rounded-xl bg-[#0f0714] border border-[#381e47] flex items-center justify-between gap-2"
                        >
                          <span className="text-[11px] text-[#fae8d7]">{item}</span>
                          {isEditing ? (
                            <div className="flex gap-1 shrink-0">
                              <button
                                type="button"
                                onClick={() => toggleHardLimit(item)}
                                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  isHard ? 'bg-rose-600 text-white' : 'bg-[#251433] text-rose-300'
                                }`}
                              >
                                Hard
                              </button>
                              <button
                                type="button"
                                onClick={() => toggleSoftLimit(item)}
                                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  isSoft ? 'bg-amber-600 text-white' : 'bg-[#251433] text-amber-300'
                                }`}
                              >
                                Soft
                              </button>
                            </div>
                          ) : (
                            <span className="text-[10px] font-bold shrink-0">
                              {isHard && <span className="text-rose-400">Hard Limit</span>}
                              {isSoft && <span className="text-amber-400">Soft Limit</span>}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
