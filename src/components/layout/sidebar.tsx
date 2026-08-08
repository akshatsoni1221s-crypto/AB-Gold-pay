'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils/cn';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Package, Receipt, Users, Truck,
  Wallet, BarChart3, Bell, Settings, Shield,
  ChevronLeft, ChevronRight, Diamond, UserCog,
  LogOut, Menu, X,
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
  { icon: Package, label: 'Inventory', href: '/inventory' },
  { icon: Receipt, label: 'Billing', href: '/billing' },
  { icon: Users, label: 'Customers', href: '/customers' },
  { icon: Truck, label: 'Suppliers', href: '/suppliers' },
  { icon: Wallet, label: 'Accounting', href: '/accounting' },
  { icon: BarChart3, label: 'Reports', href: '/reports' },
  { icon: UserCog, label: 'Employees', href: '/employees' },
  { icon: Bell, label: 'Notifications', href: '/notifications' },
  { icon: Settings, label: 'Settings', href: '/settings' },
];

interface SidebarProps {
  user: { name: string; role: string; email: string };
  onLogout: () => void;
}

export function Sidebar({ user, onLogout }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <button
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <AnimatePresence>
        {(mobileOpen || !collapsed) && (
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className={cn(
              'fixed inset-y-0 left-0 z-40 flex flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border transition-all duration-300',
              collapsed ? 'w-20' : 'w-64',
              'hidden lg:flex'
            )}
          >
            <div className={cn('flex items-center h-16 px-4 border-b border-sidebar-border', collapsed && 'justify-center')}>
              <Diamond className="h-8 w-8 text-yellow-400 flex-shrink-0" />
              {!collapsed && (
                <span className="ml-3 text-lg font-bold tracking-tight">GoldPay</span>
              )}
            </div>

            <nav className="flex-1 overflow-y-auto p-3 space-y-1">
              {menuItems.map((item) => {
                const isActive = pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'sidebar-item group',
                      isActive ? 'sidebar-item-active' : 'sidebar-item-inactive'
                    )}
                    title={collapsed ? item.label : undefined}
                  >
                    <item.icon className="h-5 w-5 flex-shrink-0" />
                    {!collapsed && <span>{item.label}</span>}
                    {collapsed && (
                      <div className="absolute left-20 bg-popover text-popover-foreground px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 shadow-lg">
                        {item.label}
                      </div>
                    )}
                  </Link>
                );
              })}
            </nav>

            <div className="p-3 border-t border-sidebar-border space-y-2">
              {!collapsed && (
                <div className="px-3 py-2">
                  <p className="text-sm font-medium truncate">{user.name}</p>
                  <p className="text-xs text-sidebar-foreground/60 truncate">{user.role}</p>
                </div>
              )}
              <button
                onClick={onLogout}
                className="sidebar-item sidebar-item-inactive w-full"
                title="Logout"
              >
                <LogOut className="h-5 w-5 flex-shrink-0" />
                {!collapsed && <span>Logout</span>}
              </button>
            </div>

            <button
              onClick={() => setCollapsed(!collapsed)}
              className="hidden lg:flex absolute -right-3 top-20 h-6 w-6 items-center justify-center rounded-full border bg-background shadow-sm hover:bg-accent"
            >
              {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
            </button>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-40 lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed inset-y-0 left-0 z-50 w-64 flex flex-col bg-sidebar text-sidebar-foreground lg:hidden"
            >
              <div className="flex items-center justify-between h-16 px-4 border-b border-sidebar-border">
                <div className="flex items-center gap-3">
                  <Diamond className="h-8 w-8 text-yellow-400" />
                  <span className="text-lg font-bold">GoldPay</span>
                </div>
                <button onClick={() => setMobileOpen(false)}>
                  <X size={20} />
                </button>
              </div>
              <nav className="flex-1 overflow-y-auto p-3 space-y-1">
                {menuItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      'sidebar-item',
                      pathname.startsWith(item.href) ? 'sidebar-item-active' : 'sidebar-item-inactive'
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
                ))}
              </nav>
              <div className="p-3 border-t border-sidebar-border">
                <button onClick={onLogout} className="sidebar-item sidebar-item-inactive w-full">
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
