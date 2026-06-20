'use client';

/**
 * @module DashboardLayout
 * @description Root layout component for the authenticated dashboard area.
 * Implements semantic HTML5 landmarks (main, navigation, banner, contentinfo)
 * for WCAG 2.2 AA accessibility compliance. Handles authentication guard
 * and provides accessible loading/error states.
 */

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { TopBar } from '@/components/dashboard/TopBar';
import type { JSX } from 'react';

/**
 * Dashboard layout wrapper.
 * Guards routes against unauthenticated access and renders
 * the sidebar + top bar + main content area.
 *
 * @param props - Component props containing children.
 * @returns The rendered dashboard layout or loading/redirect state.
 */
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element | null {
  const router = useRouter();
  const { isAuthenticated, isLoading, loadProfile } = useAuthStore();

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        role="status"
        aria-label="Loading dashboard"
        aria-live="polite"
      >
        <div className="flex flex-col items-center gap-4">
          <div
            className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"
            aria-hidden="true"
          />
          <p className="text-muted-foreground text-sm">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen flex bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col lg:ml-64">
        <TopBar />
        <main
          className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto"
          role="main"
          aria-label="Dashboard content"
          id="main-content"
        >
          {children}
        </main>
      </div>
    </div>
  );
}
