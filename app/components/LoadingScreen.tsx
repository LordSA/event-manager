'use client';

import React, { useState, useEffect } from 'react';

export default function LoadingScreen() {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<'loading' | 'zooming' | 'hidden'>('loading');

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        const remaining = 100 - prev;
        const step = Math.max(1, Math.min(remaining, Math.floor(Math.random() * 5) + 2));
        const next = prev + step;
        if (next >= 100) {
          clearInterval(interval);
          return 100;
        }
        return next;
      });
    }, 28);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress === 100) {
      const holdTimer = setTimeout(() => {
        setPhase('zooming');
      }, 240);

      const finishTimer = setTimeout(() => {
        setPhase('hidden');
      }, 980);

      return () => {
        clearTimeout(holdTimer);
        clearTimeout(finishTimer);
      };
    }
  }, [progress]);

  useEffect(() => {
    if (phase !== 'hidden') {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [phase]);

  if (phase === 'hidden') return null;

  const isZooming = phase === 'zooming';

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-[999999] flex items-center justify-center p-4 sm:p-8 select-none overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        isZooming ? 'opacity-0 pointer-events-none' : 'opacity-100'
      } bg-[#08090d]`}
    >
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-violet-600/15 blur-[140px]" />
        <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full bg-indigo-600/15 blur-[140px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#08090d]/50 to-[#08090d]" />
      </div>

      <div
        className={`relative w-full max-w-5xl h-[62vh] sm:h-[72vh] max-h-[620px] bg-[#121316] border border-neutral-800/80 rounded-[28px] sm:rounded-[36px] flex flex-col items-center justify-center p-6 sm:p-14 shadow-[0_30px_90px_rgba(0,0,0,0.85)] overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isZooming ? 'scale-[2.1] opacity-0 blur-sm' : 'scale-100 opacity-100 blur-0'
        }`}
      >
        <div className="absolute -right-28 -top-28 w-80 h-80 rounded-full border border-white/[0.04] pointer-events-none" />
        <div className="absolute -left-28 -bottom-28 w-80 h-80 rounded-full border border-white/[0.04] pointer-events-none" />

        <div className="relative flex flex-col items-end">
          <div className="relative inline-block leading-none">
            <h1 className="text-4xl sm:text-7xl md:text-8xl lg:text-9xl font-extrabold font-display tracking-tight text-[#26282e] select-none uppercase whitespace-nowrap">
              CEV EVENTS
            </h1>

            <h1
              className="text-4xl sm:text-7xl md:text-8xl lg:text-9xl font-extrabold font-display tracking-tight text-white select-none uppercase whitespace-nowrap absolute inset-0 transition-[clip-path] duration-75 ease-out"
              style={{
                clipPath: `inset(${100 - progress}% 0 0 0)`,
              }}
            >
              CEV EVENTS
            </h1>
          </div>

          <div className="mt-4 sm:mt-6 font-mono text-[11px] sm:text-xs text-neutral-400 font-medium tracking-wider lowercase">
            loading... <span className="font-semibold text-neutral-300">{progress}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
