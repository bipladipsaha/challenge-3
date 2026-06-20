'use client';

import { motion } from 'framer-motion';
import { Settings as SettingsIcon, User, Bell, Shield, Palette, Globe } from 'lucide-react';
import { useTheme } from 'next-themes';

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <SettingsIcon className="h-6 w-6 text-emerald-500" aria-hidden="true" />
          Settings
        </h1>
        <p className="text-muted-foreground text-sm mt-1">Manage your account and preferences</p>
      </div>

      {/* Profile */}
      <div className="glass-card p-6">
        <h2 className="font-semibold flex items-center gap-2 mb-4">
          <User className="h-5 w-5 text-muted-foreground" aria-hidden="true" /> Profile
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="settings-firstName" className="block text-sm font-medium mb-1">First Name</label>
            <input id="settings-firstName" type="text" defaultValue="John" className="w-full px-3 py-2 rounded-lg bg-input border border-border text-sm" />
          </div>
          <div>
            <label htmlFor="settings-lastName" className="block text-sm font-medium mb-1">Last Name</label>
            <input id="settings-lastName" type="text" defaultValue="Doe" className="w-full px-3 py-2 rounded-lg bg-input border border-border text-sm" />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="settings-email" className="block text-sm font-medium mb-1">Email</label>
            <input id="settings-email" type="email" defaultValue="john@example.com" className="w-full px-3 py-2 rounded-lg bg-input border border-border text-sm" disabled />
          </div>
        </div>
      </div>

      {/* Appearance */}
      <div className="glass-card p-6">
        <h2 className="font-semibold flex items-center gap-2 mb-4">
          <Palette className="h-5 w-5 text-muted-foreground" aria-hidden="true" /> Appearance
        </h2>
        <div className="flex gap-3">
          {['light', 'dark', 'system'].map((t) => (
            <button
              key={t}
              onClick={() => setTheme(t)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
                theme === t ? 'gradient-bg text-white' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Notifications */}
      <div className="glass-card p-6">
        <h2 className="font-semibold flex items-center gap-2 mb-4">
          <Bell className="h-5 w-5 text-muted-foreground" aria-hidden="true" /> Notifications
        </h2>
        <div className="space-y-3">
          {['Email notifications', 'Push notifications', 'AI smart alerts', 'Weekly reports'].map((item) => (
            <label key={item} className="flex items-center justify-between cursor-pointer">
              <span className="text-sm">{item}</span>
              <input type="checkbox" defaultChecked className="w-4 h-4 accent-emerald-500" />
            </label>
          ))}
        </div>
      </div>

      {/* Privacy */}
      <div className="glass-card p-6">
        <h2 className="font-semibold flex items-center gap-2 mb-4">
          <Shield className="h-5 w-5 text-muted-foreground" aria-hidden="true" /> Privacy
        </h2>
        <div className="space-y-3">
          {['Show profile on leaderboard', 'Share progress publicly', 'Allow data for AI improvements'].map((item) => (
            <label key={item} className="flex items-center justify-between cursor-pointer">
              <span className="text-sm">{item}</span>
              <input type="checkbox" defaultChecked className="w-4 h-4 accent-emerald-500" />
            </label>
          ))}
        </div>
      </div>

      <button className="w-full py-2.5 rounded-lg gradient-bg text-white font-semibold hover:opacity-90 transition-opacity">
        Save Changes
      </button>
    </motion.div>
  );
}
