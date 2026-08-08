'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Plus, Shield, UserCog, MoreHorizontal, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Navbar } from '@/components/layout/navbar';
import { formatDateTime } from '@/lib/utils/format';
import toast from 'react-hot-toast';

interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  isActive: boolean;
  lastLogin: string | null;
  employeeId: string | null;
  createdAt: string;
}

const roleBadge: Record<string, 'default' | 'destructive' | 'secondary' | 'warning' | 'info'> = {
  SUPER_ADMIN: 'destructive',
  ADMIN: 'default',
  MANAGER: 'warning',
  SALES: 'info',
  ACCOUNTANT: 'secondary',
  STAFF: 'secondary',
};

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEmployees = useCallback(async () => {
    try {
      const res = await fetch('/api/employees');
      const data = await res.json();
      if (data.success) setEmployees(data.data);
    } catch { toast.error('Failed to load employees'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchEmployees(); }, [fetchEmployees]);

  return (
    <div>
      <Navbar title="Employees" subtitle="Manage your team" />
      <div className="p-4 md:p-6 space-y-6">
        <div className="flex justify-between items-center">
          <p className="text-sm text-muted-foreground">{employees.length} team members</p>
          <Button><Plus className="h-4 w-4 mr-2" /> Add Employee</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading ? [...Array(4)].map((_, i) => <div key={i} className="h-32 rounded-xl bg-muted animate-pulse" />)
          : employees.map((emp, i) => (
            <motion.div key={emp.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className="card-hover">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-lg font-bold text-primary">{emp.name.charAt(0)}</span>
                      </div>
                      <div>
                        <h3 className="font-semibold">{emp.name}</h3>
                        <p className="text-xs text-muted-foreground">{emp.email}</p>
                        <p className="text-xs text-muted-foreground">{emp.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={roleBadge[emp.role] || 'secondary'}>{emp.role}</Badge>
                      {!emp.isActive && <Badge variant="destructive">Inactive</Badge>}
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t text-xs text-muted-foreground flex items-center gap-2">
                    <Clock className="h-3 w-3" />
                    {emp.lastLogin ? `Last login: ${formatDateTime(emp.lastLogin)}` : 'Never logged in'}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
