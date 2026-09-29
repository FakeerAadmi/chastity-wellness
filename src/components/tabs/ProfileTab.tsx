'use client';

import React, { useState, useEffect } from 'react';
import { DEFAULT_USER_PROFILE } from '@/data/defaultProfile';
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
  CheckCircle2
} from 'lucide-react';

export const ProfileTab: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_USER_PROFILE);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<'overview' | 'anatomy' | 'kinks' | 'limits'>('overview');

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

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-200">
      {/* Profile Header Hero Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#1c1026] border border-[#381e47] shadow-xl relative overflow-hidden space-y-6">
        {/* Subtle ambient lighting */}
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
              </div>

              <p className="text-xs text-[#b59ebf] flex items-center gap-3 flex-wrap">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#d94f6f]" />
                  {profile.location}
                </span>
                <span>&bull;</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-[#b59ebf]" />
                  Joined {profile.joinedDate}
                </span>
                <span>&bull;</span>
                <span className="text-emerald-400 font-semibold">{profile.dynamicStatus}</span>
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

      {/* Profile Section Navigation */}
      <div className="flex items-center justify-center gap-2 p-1.5 bg-[#1c1026] border border-[#381e47] rounded-2xl max-w-lg mx-auto text-xs font-semibold">
        <button
          onClick={() => setActiveSection('overview')}
          className={`flex-1 py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
            activeSection === 'overview'
              ? 'bg-[#251433] text-[#fae8d7] border border-[#d94f6f]/50 shadow-xs'
              : 'text-[#b59ebf] hover:text-[#fae8d7]'
          }`}
        >
          <User className="w-3.5 h-3.5 text-[#d94f6f]" />
          <span>Identity</span>
        </button>

        <button
          onClick={() => setActiveSection('anatomy')}
          className={`flex-1 py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
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
          className={`flex-1 py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
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
          className={`flex-1 py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
            activeSection === 'limits'
              ? 'bg-[#251433] text-[#fae8d7] border border-[#d94f6f]/50 shadow-xs'
              : 'text-[#b59ebf] hover:text-[#fae8d7]'
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5 text-[#d94f6f]" />
          <span>Limits & Safeguards</span>
        </button>
      </div>

      {/* SECTION 1: IDENTITY & BASIC PROFILE */}
      {activeSection === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-3xl bg-[#1c1026] border border-[#381e47] space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#fae8d7] flex items-center gap-2">
              <User className="w-4 h-4 text-[#d94f6f]" />
              <span>Identity & Preferences</span>
            </h2>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-[#b59ebf] block">Display Name</span>
                {isEditing ? (
                  <input
                    type="text"
                    value={profile.username}
                    onChange={e => setProfile({ ...profile, username: e.target.value })}
                    className="w-full p-2 mt-1 rounded-xl border border-[#381e47] bg-[#0f0714] text-[#fae8d7]"
                  />
                ) : (
                  <span className="font-bold text-sm text-[#fae8d7]">{profile.username}</span>
                )}
              </div>

              <div>
                <span className="text-[#b59ebf] block">Pronouns</span>
                {isEditing ? (
                  <input
                    type="text"
                    value={profile.pronouns}
                    onChange={e => setProfile({ ...profile, pronouns: e.target.value })}
                    className="w-full p-2 mt-1 rounded-xl border border-[#381e47] bg-[#0f0714] text-[#fae8d7]"
                  />
                ) : (
                  <span className="font-medium text-[#fae8d7]">{profile.pronouns}</span>
                )}
              </div>

              <div>
                <span className="text-[#b59ebf] block">Dynamic Role</span>
                {isEditing ? (
                  <select
                    value={profile.role}
                    onChange={e => setProfile({ ...profile, role: e.target.value as any })}
                    className="w-full p-2 mt-1 rounded-xl border border-[#381e47] bg-[#0f0714] text-[#fae8d7]"
                  >
                    <option value="Wearer">Wearer</option>
                    <option value="Keyholder">Keyholder</option>
                    <option value="Switch">Switch</option>
                    <option value="Explorer">Explorer</option>
                  </select>
                ) : (
                  <span className="font-bold text-[#d94f6f]">{profile.role}</span>
                )}
              </div>

              <div>
                <span className="text-[#b59ebf] block">Location</span>
                {isEditing ? (
                  <input
                    type="text"
                    value={profile.location}
                    onChange={e => setProfile({ ...profile, location: e.target.value })}
                    className="w-full p-2 mt-1 rounded-xl border border-[#381e47] bg-[#0f0714] text-[#fae8d7]"
                  />
                ) : (
                  <span className="font-medium text-[#fae8d7]">{profile.location}</span>
                )}
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

      {/* SECTION 2: ANATOMY & SIZING DOSSIER */}
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
                <span className="font-mono text-lg font-black text-[#d94f6f]">
                  {profile.baseRingDiameterMm} mm
                </span>
              </div>
              <div className="p-3 bg-[#0f0714] rounded-2xl border border-[#381e47]">
                <span className="text-[10px] text-[#b59ebf] block">Cage Depth</span>
                <span className="font-mono text-lg font-black text-[#fae8d7]">
                  {profile.cageLengthDepthMm} mm
                </span>
              </div>
              <div className="p-3 bg-[#0f0714] rounded-2xl border border-[#381e47]">
                <span className="text-[10px] text-[#b59ebf] block">Spacer Pin</span>
                <span className="font-mono text-lg font-black text-[#fae8d7]">
                  {profile.spacerPreferenceMm} mm
                </span>
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

      {/* SECTION 3: KINKS, DESIRES & INTIMACY */}
      {activeSection === 'kinks' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-[#1c1026] border border-[#381e47] space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#fae8d7] flex items-center gap-2">
              <Flame className="w-4 h-4 text-[#d94f6f]" />
              <span>Core Kinks, Dynamic Desires & Tags</span>
            </h2>

            <div className="flex flex-wrap gap-2 pt-1">
              {profile.kinkTags.map((tag, i) => (
                <span
                  key={i}
                  className="px-3.5 py-1.5 rounded-2xl bg-[#251433] text-[#fae8d7] border border-[#d94f6f]/40 text-xs font-semibold flex items-center gap-1.5 shadow-sm"
                >
                  <Sparkles className="w-3 h-3 text-[#d94f6f]" />
                  <span>{tag}</span>
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-3xl bg-[#1c1026] border border-[#381e47] space-y-3 text-xs">
              <h3 className="font-bold text-[#fae8d7] uppercase tracking-wider flex items-center gap-2">
                <Heart className="w-4 h-4 text-[#d94f6f]" />
                <span>Intimacy & Communication Style</span>
              </h3>
              <p className="text-[#b59ebf] leading-relaxed">
                {profile.intimacyStyle}
              </p>
              <div className="pt-2">
                <span className="text-[#b59ebf] block">Experience Milestone:</span>
                <span className="font-bold text-[#fae8d7]">{profile.experienceDuration}</span>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-[#1c1026] border border-[#381e47] space-y-3 text-xs">
              <h3 className="font-bold text-[#fae8d7] uppercase tracking-wider flex items-center gap-2">
                <HeartPulse className="w-4 h-4 text-emerald-400" />
                <span>Personal Aftercare Rituals</span>
              </h3>
              <ul className="space-y-1.5 text-[#b59ebf]">
                {profile.aftercarePreferences.map((care, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#d94f6f] shrink-0 mt-0.5" />
                    <span>{care}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 4: LIMITS & SAFEGUARDS */}
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
                    className="p-3 rounded-xl bg-rose-950/30 border border-rose-900/50 text-xs text-rose-200 font-medium"
                  >
                    &bull; {limit}
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
                    className="p-3 rounded-xl bg-amber-950/30 border border-amber-900/50 text-xs text-amber-200 font-medium"
                  >
                    &bull; {limit}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Active Safewords & Emergency Key Card */}
          <div className="p-6 rounded-3xl bg-[#1c1026] border border-[#381e47] space-y-4 text-xs">
            <h3 className="font-bold text-[#fae8d7] uppercase tracking-wider flex items-center gap-2 text-sm">
              <Key className="w-4 h-4 text-[#d94f6f]" />
              <span>Active Safewords & Physical Key Location</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-2xl bg-[#0f0714] border border-rose-900/60 space-y-1">
                <span className="text-[10px] text-rose-400 uppercase font-bold block">
                  Safeword RED (Immediate Stop)
                </span>
                <span className="font-mono text-lg font-black text-rose-300">
                  {profile.safewordRed}
                </span>
                <span className="text-[10px] text-[#b59ebf] block">
                  Device must be removed immediately without discussion.
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-[#0f0714] border border-amber-900/60 space-y-1">
                <span className="text-[10px] text-amber-400 uppercase font-bold block">
                  Safeword YELLOW (Check-in / Adjust)
                </span>
                <span className="font-mono text-lg font-black text-amber-300">
                  {profile.safewordYellow}
                </span>
                <span className="text-[10px] text-[#b59ebf] block">
                  Slow down, inspect physical comfort or reduce intensity.
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-[#0f0714] border border-[#381e47] space-y-1">
                <span className="text-[10px] text-[#b59ebf] uppercase font-bold block">
                  Emergency Physical Key
                </span>
                <p className="text-xs text-[#fae8d7] font-medium leading-relaxed">
                  {profile.emergencyKeyLocation}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
