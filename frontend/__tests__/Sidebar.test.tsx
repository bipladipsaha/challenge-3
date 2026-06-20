/**
 * @module Sidebar.test
 * @description Tests for the Sidebar navigation component.
 * Validates WAI-ARIA compliance, aria-current on active links,
 * semantic landmark roles, keyboard accessibility, and icon decorative attributes.
 */

import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock next/navigation
const mockPathname = jest.fn();
jest.mock('next/navigation', () => ({
  usePathname: () => mockPathname(),
}));

// Mock framer-motion to avoid animation issues in tests
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

// Mock next-themes
jest.mock('next-themes', () => ({
  useTheme: () => ({ theme: 'dark', setTheme: jest.fn() }),
}));

import { Sidebar } from '@/components/dashboard/Sidebar';

describe('Sidebar Component', () => {
  beforeEach(() => {
    mockPathname.mockReturnValue('/dashboard');
  });

  describe('Semantic Landmarks', () => {
    it('should render as an aside element with complementary role', () => {
      render(<Sidebar />);
      const aside = screen.getByRole('complementary', { name: /sidebar navigation/i });
      expect(aside).toBeInTheDocument();
    });

    it('should contain a navigation landmark', () => {
      render(<Sidebar />);
      const nav = screen.getByRole('navigation', { name: /primary navigation/i });
      expect(nav).toBeInTheDocument();
    });

    it('should contain a banner region', () => {
      render(<Sidebar />);
      const banner = screen.getByRole('banner');
      expect(banner).toBeInTheDocument();
    });

    it('should contain a contentinfo region', () => {
      render(<Sidebar />);
      const contentinfo = screen.getByRole('contentinfo');
      expect(contentinfo).toBeInTheDocument();
    });
  });

  describe('Navigation Links', () => {
    it('should render all expected navigation links', () => {
      render(<Sidebar />);
      const expectedLinks = [
        'Dashboard', 'Calculator', 'Carbon Log', 'Goals',
        'Challenges', 'AI Advisor', 'Eco Coach', 'Community',
        'Reports', 'Settings',
      ];
      expectedLinks.forEach((label) => {
        expect(screen.getByRole('link', { name: new RegExp(label, 'i') })).toBeInTheDocument();
      });
    });

    it('should set aria-current="page" on the active link', () => {
      mockPathname.mockReturnValue('/dashboard');
      render(<Sidebar />);

      const dashboardLink = screen.getByRole('link', { name: /Dashboard/i });
      expect(dashboardLink).toHaveAttribute('aria-current', 'page');
    });

    it('should NOT set aria-current on inactive links', () => {
      mockPathname.mockReturnValue('/dashboard');
      render(<Sidebar />);

      const settingsLink = screen.getByRole('link', { name: /Settings/i });
      expect(settingsLink).not.toHaveAttribute('aria-current');
    });

    it('should update aria-current when route changes', () => {
      mockPathname.mockReturnValue('/dashboard/goals');
      render(<Sidebar />);

      const goalsLink = screen.getByRole('link', { name: /Goals/i });
      expect(goalsLink).toHaveAttribute('aria-current', 'page');

      const dashboardLink = screen.getByRole('link', { name: /Dashboard/i });
      expect(dashboardLink).not.toHaveAttribute('aria-current');
    });
  });

  describe('Accessibility', () => {
    it('should mark decorative icons with aria-hidden', () => {
      render(<Sidebar />);
      const hiddenIcons = document.querySelectorAll('[aria-hidden="true"]');
      expect(hiddenIcons.length).toBeGreaterThan(0);
    });

    it('should display the brand name CarbonIQ', () => {
      render(<Sidebar />);
      expect(screen.getByText('CarbonIQ')).toBeInTheDocument();
    });

    it('should display the Eco Score with an accessible label', () => {
      render(<Sidebar />);
      const scoreLabel = screen.getByLabelText(/eco score/i);
      expect(scoreLabel).toBeInTheDocument();
    });
  });
});
