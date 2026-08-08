'use client';

import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';

interface TopBarProps {
  title?: string;
  userName?: string;
  userAvatar?: string;
}

export function TopBar({ title = 'AB GoldPay', userName = 'Admin', userAvatar }: TopBarProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <header className="sticky top-0 z-50 bg-surface/80 backdrop-blur-md gold-accent-bottom transition-colors duration-300">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-full flex items-center justify-center overflow-hidden bg-primary shadow-lg shadow-primary/20">
            {userAvatar ? (
              <img alt={userName} className="w-full h-full object-cover" src={userAvatar} />
            ) : (
              <span className="font-headline-md text-base font-bold text-on-primary">{userName.charAt(0).toUpperCase()}</span>
            )}
          </div>
          <div>
            <h1 className="font-headline-md text-xl font-bold text-on-surface tracking-tight">{title}</h1>
            <p className="font-label-sm text-[10px] text-outline uppercase tracking-widest">{userName} · Gold Suite</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-container/10 border border-primary-container/20 dark:border-primary/20">
            <span className="material-symbols-outlined text-primary text-sm">currency_rupee</span>
            <span className="font-label-sm text-[11px] text-primary font-semibold">GOLD RATE: ₹7,150/10g</span>
          </div>
          {mounted && (
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container transition-colors"
            >
              <span className="material-symbols-outlined text-on-surface">
                {theme === 'dark' ? 'light_mode' : 'dark_mode'}
              </span>
            </button>
          )}
          <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container transition-colors relative">
            <span className="material-symbols-outlined text-on-surface">notifications</span>
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-error text-on-error text-[8px] font-bold rounded-full flex items-center justify-center">3</span>
          </button>
        </div>
      </div>
    </header>
  );
}
