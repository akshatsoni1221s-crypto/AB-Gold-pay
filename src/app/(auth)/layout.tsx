'use client';

import { useTheme } from 'next-themes';
import { ShaderCanvas } from '@/components/stitch/shader-canvas';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ShaderCanvas />
      {children}
    </>
  );
}
