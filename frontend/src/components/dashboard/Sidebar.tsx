'use client';

/**
 * @module Sidebar
 * @description Main navigation sidebar component for the CarbonIQ dashboard.
 * Implements WAI-ARIA navigation patterns including aria-current for active links,
 * semantic landmark roles, and keyboard-accessible navigation.
 */

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
import type { JSX } from 'react';

/** Navigation item configuration. */
interface NavItem {
  /** Route path for the navigation link. */
  href: string;
  /** Display label for the navigation item. */
  label: string;
  /** Lucide icon component to render. */
  icon: React.ComponentType<{ className?: string; 'aria-hidden'?: boolean | 'true' | 'false' }>;
}

/** Dashboard navigation items configuration. */
const navItems: NavItem[] = [
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

/**
 * Sidebar navigation component.
 * Renders the main navigation for the dashboard with accessibility support.
 *
 * @returns The rendered sidebar JSX element.
 */
export function Sidebar(): JSX.Element {
  const pathname = usePathname();

  return (
    <aside
      className="hidden lg:flex fixed inset-y-0 left-0 z-40 w-64 flex-col bg-card border-r border-border"
      role="complementary"
      aria-label="Sidebar navigation"
    >
      {/* Logo / Brand */}
      <div className="flex items-center gap-2 px-6 h-16 border-b border-border" role="banner">
        <Leaf className="h-7 w-7 text-emerald-500" aria-hidden="true" />
        <span className="text-xl font-bold gradient-text">CarbonIQ</span>
      </div>

      {/* Primary Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-auto" aria-label="Primary navigation">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? 'page' : undefined}
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
                  aria-hidden="true"
                />
              )}
              <item.icon className="h-5 w-5 relative z-10" aria-hidden="true" />
              <span className="relative z-10">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer — Eco Score Summary */}
      <div className="p-4 border-t border-border" role="contentinfo">
        <div className="glass-card p-4 text-center">
          <p className="text-xs text-muted-foreground mb-2">Your Eco Score</p>
          <p className="text-2xl font-bold gradient-text" aria-label="Eco score: 78 out of 100">78</p>
          <p className="text-xs text-emerald-500 mt-1">Good</p>
        </div>
      </div>
    </aside>
  );
}
