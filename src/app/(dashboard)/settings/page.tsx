'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Building, Bell, Shield, Database, Palette, Globe } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Navbar } from '@/components/layout/navbar';
import toast from 'react-hot-toast';

const settingGroups = [
  {
    id: 'company',
    icon: Building,
    title: 'Company Information',
    fields: [
      { key: 'company_name', label: 'Company Name', type: 'text', value: 'AB GoldPay' },
      { key: 'company_address', label: 'Address', type: 'text', value: 'Your Business Address' },
      { key: 'company_phone', label: 'Phone', type: 'text', value: '+91-9876543210' },
      { key: 'company_email', label: 'Email', type: 'email', value: 'contact@goldpay.com' },
      { key: 'company_gst', label: 'GST Number', type: 'text', value: 'GSTIN1234567890' },
    ],
  },
  {
    id: 'invoice',
    icon: Globe,
    title: 'Invoice Settings',
    fields: [
      { key: 'invoice_prefix', label: 'Invoice Prefix', type: 'text', value: 'INV' },
      { key: 'invoice_terms', label: 'Default Terms & Conditions', type: 'textarea', value: 'Thank you for your business!' },
      { key: 'default_tax_rate', label: 'Default Tax Rate (%)', type: 'number', value: '3' },
    ],
  },
  {
    id: 'notifications',
    icon: Bell,
    title: 'Notifications',
    fields: [
      { key: 'low_stock_alert', label: 'Low Stock Alert Threshold', type: 'number', value: '5' },
      { key: 'backup_reminder', label: 'Backup Reminder (days)', type: 'number', value: '7' },
    ],
  },
  {
    id: 'backup',
    icon: Database,
    title: 'Backup Settings',
    fields: [
      { key: 'auto_backup', label: 'Automatic Daily Backup', type: 'select', value: 'true', options: [{ value: 'true', label: 'Enabled' }, { value: 'false', label: 'Disabled' }] },
      { key: 'backup_retention', label: 'Backup Retention (days)', type: 'number', value: '30' },
    ],
  },
];

export default function SettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const initial: Record<string, string> = {};
    settingGroups.forEach((group) =>
      group.fields.forEach((field) => { initial[field.key] = field.value; })
    );
    setSettings(initial);
  }, []);

  const updateSetting = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      for (const [key, value] of Object.entries(settings)) {
        await fetch('/api/settings', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ key, value, type: 'string' }),
        });
      }
      toast.success('Settings saved successfully');
    } catch {
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <Navbar title="Settings" subtitle="Configure your business settings" />
      <div className="p-4 md:p-6 space-y-6">
        <div className="flex justify-end">
          <Button onClick={saveSettings} loading={saving}>
            <Save className="h-4 w-4 mr-2" /> Save All Settings
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {settingGroups.map((group) => (
            <motion.div key={group.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <group.icon className="h-5 w-5 text-primary" />
                    {group.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {group.fields.map((field) => (
                    <div key={field.key}>
                      <label className="text-sm font-medium block mb-1.5">{field.label}</label>
                      {field.type === 'select' ? (
                        <Select
                          options={field.options || []}
                          value={settings[field.key] || ''}
                          onChange={(e) => updateSetting(field.key, e.target.value)}
                        />
                      ) : field.type === 'textarea' ? (
                        <textarea
                          className="flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring min-h-[80px]"
                          value={settings[field.key] || ''}
                          onChange={(e) => updateSetting(field.key, e.target.value)}
                        />
                      ) : (
                        <Input
                          type={field.type}
                          value={settings[field.key] || ''}
                          onChange={(e) => updateSetting(field.key, e.target.value)}
                        />
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Shield className="h-5 w-5 text-primary" />
              Security
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
              <div>
                <p className="text-sm font-medium">Change Password</p>
                <p className="text-xs text-muted-foreground">Update your account password</p>
              </div>
              <Button variant="outline" size="sm">Change</Button>
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50 mt-2">
              <div>
                <p className="text-sm font-medium">Two-Factor Authentication</p>
                <p className="text-xs text-muted-foreground">Add an extra layer of security</p>
              </div>
              <Button variant="outline" size="sm">Setup</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
