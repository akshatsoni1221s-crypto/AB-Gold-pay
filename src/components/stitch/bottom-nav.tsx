'use client';

import { usePathname, useRouter } from 'next/navigation';

const navItems = [
  { icon: 'dashboard', label: 'Dashboard', href: '/dashboard' },
  { icon: 'inventory_2', label: 'Inventory', href: '/inventory' },
  { icon: 'receipt_long', label: 'Billing', href: '/billing' },
  { icon: 'settings', label: 'Settings', href: '/settings' },
];

export function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-surface/90 backdrop-blur-xl px-6 py-3 border-t border-outline-variant/20 dark:border-outline-variant/10 transition-colors duration-300">
      <div className="max-w-md mx-auto flex items-center justify-between">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <button
              key={item.href}
              onClick={() => router.push(item.href)}
              className={`flex flex-col items-center gap-1 transition-colors ${
                isActive ? 'text-primary' : 'text-outline hover:text-on-surface'
              }`}
            >
              <span
                className="material-symbols-outlined"
                style={isActive ? { fontVariationSettings: "'FILL' 1, 'wght' 400" } : undefined}
              >
                {item.icon}
              </span>
              <span className="font-label-sm text-[10px] uppercase tracking-widest">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
