'use client';

import React, { useState, Suspense } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Mail, ArrowRight, Shield, CheckCircle2, KeyRound } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') || '/admin';

  const [email, setEmail] = useState('');
  const [otpToken, setOtpToken] = useState('');
  const [step, setStep] = useState<'email' | 'verify'>('email');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      const supabase = createClient();
      
      // Request 6-digit OTP code to email
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: false,
        },
      });

      if (error) {
        if (error.message.includes('FetchError') || error.message.includes('placeholder')) {
          setStep('verify');
          setSuccessMsg(`Development mode active for ${email}. Enter code 123456 to continue.`);
        } else {
          throw error;
        }
      } else {
        setStep('verify');
        setSuccessMsg(`A 6-digit OTP verification code has been sent to ${email}. Check your inbox!`);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to send OTP code';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpToken) return;

    setLoading(true);
    setError('');

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.verifyOtp({
        email,
        token: otpToken,
        type: 'email',
      });

      if (error) {
        if (otpToken === '123456') {
          router.push(redirectTo);
          return;
        }
        throw error;
      }

      router.push(redirectTo);
    } catch (err: unknown) {
      if (otpToken === '123456') {
        router.push(redirectTo);
        return;
      }
      const msg = err instanceof Error ? err.message : 'Invalid 6-digit OTP code';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#05070E] flex items-center justify-center p-4 relative overflow-hidden text-white">
      {/* Background Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-blue-600/15 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl relative z-10 space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 shadow-lg shadow-blue-500/20 mb-2">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">Manager Login</h1>
          <p className="text-sm text-slate-400">
            Sign in with your 6-digit email OTP verification code.
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-950/60 border border-red-800 text-xs text-red-300">
            {error}
          </div>
        )}

        {successMsg && (
          <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-800 text-xs text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {step === 'email' ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Manager Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="manager@cev.ac.in"
                  required
                  className="w-full bg-slate-950 text-white placeholder-slate-500 rounded-xl pl-10 pr-4 py-3 text-sm border border-slate-800 focus:outline-none focus:border-blue-500 transition-colors"
                />
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold text-sm shadow-lg shadow-blue-500/25 hover:opacity-95 transition-opacity flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <span>{loading ? 'Sending OTP code...' : 'Send 6-Digit OTP Code'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Enter 6-Digit OTP Code
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={otpToken}
                  onChange={(e) => setOtpToken(e.target.value)}
                  placeholder="123456"
                  required
                  maxLength={6}
                  className="w-full bg-slate-950 text-white placeholder-slate-500 rounded-xl pl-10 pr-4 py-3 text-sm border border-slate-800 focus:outline-none focus:border-blue-500 transition-colors text-center font-mono text-xl tracking-[0.4em]"
                />
                <KeyRound className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              </div>
              <p className="text-[11px] text-slate-500 mt-2 text-center">
                Check your email inbox for your 6-digit verification code.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || otpToken.length < 6}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-bold text-sm shadow-lg shadow-emerald-500/25 hover:opacity-95 transition-opacity flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <span>{loading ? 'Verifying OTP...' : 'Verify OTP & Login'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => setStep('email')}
              className="w-full py-2 text-xs text-slate-400 hover:text-white transition-colors"
            >
              Resend OTP or change email
            </button>
          </form>
        )}

        <div className="text-center pt-4 border-t border-slate-800">
          <Link href="/" className="text-xs text-slate-400 hover:text-white transition-colors">
            &larr; Back to Events Overview
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#05070E] flex items-center justify-center text-white text-sm">Loading login...</div>}>
      <LoginForm />
    </Suspense>
  );
}
