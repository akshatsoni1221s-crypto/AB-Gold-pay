'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import toast from 'react-hot-toast';
import { AbMonogram } from '@/components/stitch/ab-monogram';

export default function AuthPage() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [email, setEmail] = useState('admin@goldpay.com');
  const [password, setPassword] = useState('Admin@123');
  const [loading, setLoading] = useState(false);
  useEffect(() => setMounted(true), []);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { toast.error('Please fill in all fields'); return; }
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const text = await res.text();
      let data;
      try { data = JSON.parse(text); } catch { data = { error: 'Unexpected server response (' + res.status + ')' }; }
      if (data.success) {
        toast.success('Welcome back!');
        router.push('/dashboard');
      } else {
        toast.error(data.error || 'Login failed');
      }
    } catch {
      toast.error('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative z-10 min-h-screen flex flex-col">
      {/* Top Branding Section */}
      <div className="h-[45vh] relative w-full overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            className="w-full h-full object-cover object-center scale-105"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDN2e42OetW34OXThzmTeZ__XRfZMTfEe6wDAEqXMPtUNhctqD7N5K1qp7tqCPxBtJoK3ow4nhYFts1i_hijLf4KpayeHd5-pPuxVld1kR6ICxnRH9kE7JLM9CGUwT0cymyx2GKS0e9iUKDHaITS6OpfHtYVsXCTsojhgcPdCr6EQeePB9z4IzsoLOxwDJfDgNM3r815bCVdeuFYoNP2dmkmjgAchId5ISpyJbaNhJ-9uUtDQlXMVOsypBFo8wav8Es4FwZNgkSTuI"
            alt=""
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-surface transition-colors duration-300" />
        </div>
        <div className="absolute top-6 left-6 z-10 flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary shadow-lg shadow-primary/20 flex items-center justify-center">
            <AbMonogram size={14} className="text-on-primary" />
          </div>
          <span className="font-label-sm text-[10px] text-primary uppercase tracking-widest font-semibold">AB GoldPay</span>
        </div>
        <div className="absolute top-6 right-6 z-10">
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-surface-container/60 backdrop-blur-sm border border-outline-variant/30 hover:bg-surface-container transition-colors"
          >
            {mounted && (
              <span className="material-symbols-outlined text-on-surface text-sm">
                {theme === 'dark' ? 'light_mode' : 'dark_mode'}
              </span>
            )}
          </button>
        </div>
        <header className="relative z-10 flex justify-center pt-16">
          <h1 className="font-display-lg-mobile text-display-lg-mobile gold-text tracking-widest uppercase">
            Aurelian
          </h1>
        </header>
        <div className="absolute bottom-0 left-0 right-0 flex justify-center pb-4">
          <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-primary-container to-transparent rounded-full dark:via-primary" />
        </div>
      </div>

      {/* Login Section */}
      <section className="flex-grow flex items-center justify-center px-margin-mobile -mt-20">
        <div className="glass-panel w-full max-w-md p-8 md:p-12 rounded-xl shadow-2xl fade-in-up">
          <div className="text-center mb-10">
            <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-primary-fixed-dim dark:text-primary mb-2">Welcome Back</h2>
            <p className="font-label-sm text-label-sm text-on-surface-variant/80 tracking-widest">SIGN IN TO YOUR ACCOUNT</p>
          </div>

          <form className="space-y-8" onSubmit={handleSignIn}>
            <div className="relative group">
              <label className="block font-label-sm text-label-sm text-primary mb-1 uppercase tracking-wider" htmlFor="email">Email Address</label>
              <input
                className="w-full py-3 input-underline transition-all focus:border-primary-container"
                id="email"
                name="email"
                placeholder="admin@goldpay.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="relative group">
              <div className="flex justify-between items-end">
                <label className="block font-label-sm text-label-sm text-primary mb-1 uppercase tracking-wider" htmlFor="password">Password</label>
              </div>
              <input
                className="w-full py-3 input-underline transition-all focus:border-primary-container"
                id="password"
                name="password"
                placeholder="••••••••"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              className="gold-gradient-btn w-full py-5 rounded-full text-on-primary font-headline-md text-[18px] uppercase tracking-[0.2em] mt-4 relative overflow-hidden"
              type="submit"
              disabled={loading}
            >
              <span className="relative z-10">{loading ? 'Signing in...' : 'Sign In'}</span>
              <div className="absolute inset-0 gold-shimmer" />
            </button>
            <button
              type="button"
              onClick={() => {
                setEmail('admin@goldpay.com');
                setPassword('Admin@123');
                handleSignIn({ preventDefault: () => {} } as React.FormEvent);
              }}
              className="w-full mt-3 py-3 rounded-full border border-primary-container/40 text-primary font-label-sm text-[11px] uppercase tracking-[0.2em] hover:bg-primary-container/10 transition-all"
            >
              One-Click Demo Login
            </button>
          </form>

          {/* Gold Divider */}
          <div className="relative my-10 flex items-center">
            <div className="flex-grow border-t border-outline-variant/30" />
            <div className="mx-4 w-6 h-6 rounded-full bg-primary-container/10 flex items-center justify-center">
            <AbMonogram size={14} className="text-primary" />
          </div>
            <div className="flex-grow border-t border-outline-variant/30" />
          </div>

          {/* Social Icons */}
          <div className="flex justify-center gap-8 mb-10">
            <button className="w-12 h-12 flex items-center justify-center rounded-full border border-outline-variant/40 text-on-surface-variant hover:bg-white/30 dark:hover:bg-surface-container/40 hover:border-primary-container/30 transition-all" type="button">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M12.152 6.896c-.548 0-1.711.616-2.395 1.408-.603.705-.818 1.637-.818 2.454 0 .079.01.162.016.209.736.03 1.833-.507 2.463-1.304.566-.72.766-1.635.734-2.767zm1.618 6.702c.03-3.692 3.19-4.898 3.235-4.919-1.745-2.55-4.444-2.894-5.334-2.915-2.124-.221-4.246 1.306-5.334 1.306-1.1 0-2.846-1.282-4.636-1.246-2.348.034-4.504 1.37-5.714 3.472-2.438 4.238-.624 10.53 1.745 13.95 1.156 1.674 2.534 3.55 4.348 3.484 1.747-.066 2.408-1.127 4.516-1.127 2.108 0 2.704 1.127 4.55 1.091 1.88-.033 3.076-1.673 4.232-3.348 1.332-1.936 1.884-3.805 1.91-3.903-.04-.017-3.666-1.408-3.608-5.767z" />
              </svg>
            </button>
            <button className="w-12 h-12 flex items-center justify-center rounded-full border border-outline-variant/40 text-on-surface-variant hover:bg-white/30 dark:hover:bg-surface-container/40 hover:border-primary-container/30 transition-all" type="button">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
            </button>
          </div>

          {/* Footer Link */}
          <div className="text-center">
            <p className="font-label-sm text-[12px] text-secondary tracking-widest">
              NEW TO THE MAISON?
              <a className="ml-1 text-primary font-bold hover:underline" href="#">CREATE ACCOUNT</a>
            </p>
          </div>
        </div>
      </section>

      {/* Subtle Footer */}
      <footer className="py-12 px-margin-mobile flex flex-col items-center gap-4 text-outline-variant/60">
        <p className="font-label-sm text-[10px] tracking-[0.3em] uppercase">&copy; 2026 AB GoldPay. All Rights Reserved.</p>
        <div className="flex gap-6">
          <a className="font-label-sm text-[10px] uppercase tracking-widest hover:text-primary transition-colors" href="#">Privacy</a>
          <a className="font-label-sm text-[10px] uppercase tracking-widest hover:text-primary transition-colors" href="#">Concierge</a>
          <a className="font-label-sm text-[10px] uppercase tracking-widest hover:text-primary transition-colors" href="#">Boutiques</a>
        </div>
      </footer>
    </main>
  );
}
