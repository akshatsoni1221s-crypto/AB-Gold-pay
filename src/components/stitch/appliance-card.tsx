'use client';

interface ApplianceCardProps {
  icon: string;
  name: string;
  metric: string;
  metricLabel: string;
  progress: number;
  isPrimary?: boolean;
  active?: boolean;
  onToggle?: () => void;
}

export function ApplianceCard({
  icon,
  name,
  metric,
  metricLabel,
  progress,
  isPrimary = true,
  active = true,
  onToggle,
}: ApplianceCardProps) {
  return (
    <div className="snap-start flex-shrink-0 w-64 p-6 rounded-xl bg-surface-container-low shadow-sm transition-all hover:bg-surface-container-high">
      <div className="flex justify-between items-start mb-8">
        <div className={`p-3 rounded-lg ${isPrimary ? 'bg-primary-container/20 text-primary' : 'bg-secondary-container/10 text-secondary'}`}>
          <span className="material-symbols-outlined">{icon}</span>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            checked={active}
            onChange={onToggle}
            type="checkbox"
            className="sr-only peer"
          />
          <div className={`w-11 h-6 bg-surface-container-highest rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:${isPrimary ? 'bg-primary' : 'bg-secondary'}`} />
        </label>
      </div>
      <h3 className="font-headline text-lg font-bold text-on-surface">{name}</h3>
      <div className="mt-2 space-y-1">
        <div className="flex justify-between text-sm">
          <span className="text-outline">{metricLabel}</span>
          <span className="font-headline font-bold text-on-surface">{metric}</span>
        </div>
        <div className="w-full bg-surface-container-highest h-1.5 rounded-full overflow-hidden">
          <div className={`h-full ${isPrimary ? 'bg-primary' : 'bg-secondary'}`} style={{ width: `${progress}%` }} />
        </div>
      </div>
    </div>
  );
}
