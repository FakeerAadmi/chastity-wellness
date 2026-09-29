'use client';

import React, { useEffect, useState } from 'react';
import { ShieldAlert, CheckCircle2, Lock, ArrowRight } from 'lucide-react';

export const AgeDisclaimerModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const hasConsented = localStorage.getItem('haven_age_confirmed');
    if (!hasConsented) {
      setIsOpen(true);
    }
  }, []);

  const handleConfirm = () => {
    localStorage.setItem('haven_age_confirmed', 'true');
    setIsOpen(false);
  };

  const handleExit = () => {
    window.location.href = 'https://www.google.com';
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="disclaimer-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-md animate-in fade-in duration-300"
    >
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-6 text-stone-900 dark:text-stone-100">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-50 dark:bg-amber-950/60 rounded-xl text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h2 id="disclaimer-title" className="text-xl font-bold tracking-tight">
              Adult Educational & Wellness Portal
            </h2>
            <p className="text-xs text-stone-600 dark:text-stone-400">
              Maturity, Medical Safety & Informed Consent Notice
            </p>
          </div>
        </div>

        <div className="space-y-3.5 text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
          <p>
            Welcome to <strong>Haven</strong>. This website is a dedicated, medically informed resource focused on sexual wellness, ergonomic device safety, physiological harm reduction, and consensual chastity education.
          </p>

          <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700/80 space-y-2 text-xs">
            <div className="flex items-center gap-2 text-stone-800 dark:text-stone-200 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
              <span>18+ Age Requirement:</span>
            </div>
            <p className="pl-6 text-stone-600 dark:text-stone-400">
              You must be at least 18 years of age (or the age of legal majority in your jurisdiction) to access educational materials regarding adult intimate relationships.
            </p>

            <div className="flex items-center gap-2 text-stone-800 dark:text-stone-200 font-semibold pt-1">
              <Lock className="w-4 h-4 text-teal-600 dark:text-teal-400 flex-shrink-0" />
              <span>Zero-Coercion Policy:</span>
            </div>
            <p className="pl-6 text-stone-600 dark:text-stone-400">
              We advocate strictly for Safe, Sane, and Consensual (SSC) exploration. We categorically denounce non-consensual exploitation, coercion, or harassment.
            </p>
          </div>

          <p className="text-xs text-stone-500 dark:text-stone-400">
            By entering, you confirm you are an adult seeking educational guidance on wellness, hygiene, and safe practice.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={handleExit}
            className="w-full sm:w-1/3 py-2.5 px-4 text-xs font-semibold rounded-xl border border-stone-300 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          >
            Leave Site
          </button>
          <button
            onClick={handleConfirm}
            className="w-full sm:w-2/3 py-2.5 px-4 text-xs font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-700/20 flex items-center justify-center gap-2 transition-colors"
          >
            <span>I am 18+ and Accept Guidelines</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
