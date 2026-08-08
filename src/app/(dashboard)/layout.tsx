'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BottomNav } from '@/components/stitch/bottom-nav';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 30000, retry: 1, refetchOnWindowFocus: false },
  },
});

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [authed, setAuthed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setAuthed(true);
        else router.push('/login');
      })
      .catch(() => router.push('/login'))
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-surface transition-colors duration-300">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-on-surface animate-pulse font-headline-md">Aurelian</p>
        </div>
      </div>
    );
  }

  if (!authed) return null;

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-surface text-on-surface transition-colors duration-300">
        {children}
        <BottomNav />
      </div>
    </QueryClientProvider>
  );
}
