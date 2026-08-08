'use client';

interface StatsRingProps {
  primaryValue: string;
  primaryLabel: string;
  primaryPercent?: number;
  secondaryValue: string;
  secondaryLabel: string;
  secondaryPercent?: number;
  statLeft: { label: string; value: string; trend?: 'up' | 'down' };
  statRight: { label: string; value: string };
}

export function StatsRing({
  primaryValue,
  primaryLabel,
  primaryPercent = 72,
  secondaryValue,
  secondaryLabel,
  secondaryPercent = 55,
  statLeft,
  statRight,
}: StatsRingProps) {
  const primaryOffset = 282.7 - (282.7 * primaryPercent) / 100;
  const secondaryOffset = 282.7 - (282.7 * secondaryPercent) / 100;

  return (
    <section className="flex flex-col items-center">
      <div className="relative w-72 h-72 md:w-80 md:h-80 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full bg-primary/5 blur-3xl" />
        <svg className="absolute w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
          <circle className="text-surface-container" cx="50" cy="50" fill="transparent" r="45" stroke="currentColor" strokeWidth="6" />
          <circle className="text-primary-container" cx="50" cy="50" fill="transparent" r="45" stroke="currentColor" strokeDasharray="282.7" strokeDashoffset={primaryOffset} strokeLinecap="round" strokeWidth="6" />
        </svg>
        <svg className="absolute w-3/4 h-3/4 -rotate-90 transform" viewBox="0 0 100 100">
          <circle className="text-surface-container-high" cx="50" cy="50" fill="transparent" r="45" stroke="currentColor" strokeWidth="8" />
          <circle className="text-secondary" cx="50" cy="50" fill="transparent" r="45" stroke="currentColor" strokeDasharray="282.7" strokeDashoffset={secondaryOffset} strokeLinecap="round" strokeWidth="8" />
        </svg>
        <div className="z-10 text-center">
          <div className="font-headline text-5xl md:text-6xl font-bold text-on-surface">{primaryValue}</div>
          <div className="text-label-md font-medium text-outline uppercase tracking-widest mt-1">{primaryLabel}</div>
          <div className="mt-4 flex items-center justify-center gap-2 text-secondary font-semibold">
            <span className="material-symbols-outlined text-sm">water_drop</span>
            <span className="font-headline text-xl">{secondaryValue}</span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-8 mt-10 w-full max-w-md">
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-tighter text-outline">{statLeft.label}</span>
          <div className="flex items-baseline gap-1">
            <span className="font-headline text-2xl font-bold text-primary">{statLeft.value}</span>
            {statLeft.trend === 'up' && <span className="material-symbols-outlined text-primary text-sm">trending_up</span>}
            {statLeft.trend === 'down' && <span className="material-symbols-outlined text-error text-sm">trending_down</span>}
          </div>
        </div>
        <div className="space-y-1 text-right">
          <span className="text-xs font-bold uppercase tracking-tighter text-outline">{statRight.label}</span>
          <div className="flex items-baseline justify-end gap-1">
            <span className="font-headline text-2xl font-bold text-on-surface">{statRight.value}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
