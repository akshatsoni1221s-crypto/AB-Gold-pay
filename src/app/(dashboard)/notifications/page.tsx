'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Bell, CheckCheck, AlertTriangle, CreditCard, Truck, Shield, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Navbar } from '@/components/layout/navbar';
import { formatDateTime } from '@/lib/utils/format';
import toast from 'react-hot-toast';

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  link?: string;
}

const typeIcons: Record<string, React.ElementType> = {
  LOW_STOCK: AlertTriangle,
  PENDING_CUSTOMER_PAYMENT: CreditCard,
  PENDING_SUPPLIER_PAYMENT: Truck,
  BACKUP_REMINDER: Shield,
  SYSTEM_ALERT: Shield,
  BILLING: CreditCard,
  GENERAL: Bell,
};

const typeColors: Record<string, string> = {
  LOW_STOCK: 'text-yellow-500',
  PENDING_CUSTOMER_PAYMENT: 'text-red-500',
  PENDING_SUPPLIER_PAYMENT: 'text-orange-500',
  BACKUP_REMINDER: 'text-blue-500',
  SYSTEM_ALERT: 'text-purple-500',
  BILLING: 'text-green-500',
  GENERAL: 'text-gray-500',
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch('/api/notifications');
      const data = await res.json();
      if (data.success) {
        setNotifications(data.data.notifications);
        setUnreadCount(data.data.unreadCount);
      }
    } catch { toast.error('Failed to load notifications'); }
  }, []);

  useEffect(() => { fetchNotifications(); }, [fetchNotifications]);

  const markAllRead = async () => {
    await fetch('/api/notifications', { method: 'PUT' });
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnreadCount(0);
    toast.success('All marked as read');
  };

  const markRead = async (id: string) => {
    await fetch(`/api/notifications/${id}/read`, { method: 'PUT' });
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, isRead: true } : n));
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  return (
    <div>
      <Navbar title="Notifications" subtitle={`${unreadCount} unread`} />
      <div className="p-4 md:p-6 space-y-6">
        <div className="flex justify-between items-center">
          <p className="text-sm text-muted-foreground">{notifications.length} total notifications</p>
          {unreadCount > 0 && (
            <Button variant="outline" size="sm" onClick={markAllRead}>
              <CheckCheck className="h-4 w-4 mr-2" /> Mark All Read
            </Button>
          )}
        </div>

        <div className="space-y-2">
          {notifications.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Bell className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No notifications</p>
            </div>
          ) : (
            notifications.map((notif, i) => {
              const Icon = typeIcons[notif.type] || Bell;
              return (
                <motion.div
                  key={notif.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className={`flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition-colors hover:bg-muted/50 ${!notif.isRead ? 'bg-primary/5 border-primary/20' : ''}`}
                  onClick={() => !notif.isRead && markRead(notif.id)}
                >
                  <div className={`p-2 rounded-lg bg-muted ${typeColors[notif.type] || ''}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-medium">{notif.title}</p>
                        <p className="text-sm text-muted-foreground mt-0.5">{notif.message}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {!notif.isRead && <span className="h-2 w-2 rounded-full bg-primary" />}
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {formatDateTime(notif.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
