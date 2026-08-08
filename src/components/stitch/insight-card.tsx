'use client';

import { ReactNode } from 'react';

interface InsightCardProps {
  title: string;
  description: string;
  action?: { label: string; onClick: () => void };
  variant?: 'default' | 'secondary';
  icon?: string;
}

export function InsightCard({ title, description, action, variant = 'default', icon }: InsightCardProps) {
  if (variant === 'secondary') {
    return (
      <div className="p-8 rounded-2xl bg-secondary text-on-secondary flex flex-col justify-between">
        <div>
          {icon && <span className="material-symbols-outlined text-3xl">{icon}</span>}
          <h4 className="font-headline text-lg font-bold mt-4">{title}</h4>
        </div>
        <p className="text-sm opacity-90 mt-2">{description}</p>
        <div className="mt-6 font-headline text-2xl font-bold">Secure</div>
      </div>
    );
  }

  return (
    <div className="md:col-span-2 p-8 rounded-2xl bg-surface-container-lowest border-outline-variant/10 shadow-sm relative overflow-hidden group">
      <div className="relative z-10">
        <h4 className="font-headline text-xl font-bold text-on-surface">{title}</h4>
        <p className="text-body-sm text-outline mt-2 max-w-xs">{description}</p>
        {action && (
          <button
            onClick={action.onClick}
            className="mt-6 px-6 py-2.5 bg-primary text-on-primary font-semibold rounded-lg hover:opacity-90 transition-opacity"
          >
            {action.label}
          </button>
        )}
      </div>
      {icon && (
        <div className="absolute right-0 bottom-0 opacity-10 group-hover:scale-110 transition-transform">
          <span className="material-symbols-outlined text-[160px] translate-x-12 translate-y-12">{icon}</span>
        </div>
      )}
    </div>
  );
}
