'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Leaf,
  LayoutDashboard,
  Calculator,
  Target,
  Trophy,
  Users,
  Brain,
  MessageSquare,
  BarChart3,
  Settings,
  FileText,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/calculator', label: 'Calculator', icon: Calculator },
  { href: '/dashboard/entries', label: 'Carbon Log', icon: BarChart3 },
  { href: '/dashboard/goals', label: 'Goals', icon: Target },
  { href: '/dashboard/challenges', label: 'Challenges', icon: Trophy },
  { href: '/dashboard/ai-advisor', label: 'AI Advisor', icon: Brain },
  { href: '/dashboard/eco-coach', label: 'Eco Coach', icon: MessageSquare },
  { href: '/dashboard/community', label: 'Community', icon: Users },
  { href: '/dashboard/reports', label: 'Reports', icon: FileText },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="hidden lg:flex fixed inset-y-0 left-0 z-40 w-64 flex-col bg-card border-r border-border"
      aria-label="Main navigation"
    >
      {/* Logo */}
      <div className="flex items-center gap-2 px-6 h-16 border-b border-border">
        <Leaf className="h-7 w-7 text-emerald-500" aria-hidden="true" />
        <span className="text-xl font-bold gradient-text">CarbonIQ</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-auto" aria-label="Sidebar">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all relative',
                isActive
                  ? 'text-primary bg-primary/10'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted',
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 bg-primary/10 rounded-lg"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                />
              )}
              <item.icon className="h-5 w-5 relative z-10" aria-hidden="true" />
              <span className="relative z-10">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <div className="glass-card p-4 text-center">
          <p className="text-xs text-muted-foreground mb-2">Your Eco Score</p>
          <p className="text-2xl font-bold gradient-text">78</p>
          <p className="text-xs text-emerald-500 mt-1">Good</p>
        </div>
      </div>
    </aside>
  );
}
