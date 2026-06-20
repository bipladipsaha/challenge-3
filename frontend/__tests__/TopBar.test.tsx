/**
 * @module TopBar.test
 * @description Tests for the TopBar header component.
 * Validates theme toggling, user personalization, accessible button labels,
 * and logout functionality.
 */

import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock next-themes
const mockSetTheme = jest.fn();
jest.mock('next-themes', () => ({
  useTheme: () => ({ theme: 'dark', setTheme: mockSetTheme }),
}));

// Mock Zustand auth store
const mockLogout = jest.fn();
jest.mock('@/store/authStore', () => ({
  useAuthStore: () => ({
    user: { firstName: 'Bipladip', lastName: 'Saha', email: 'bipladip@test.com' },
    logout: mockLogout,
  }),
}));

import { TopBar } from '@/components/dashboard/TopBar';

describe('TopBar Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render the welcome message with the user name', () => {
      render(<TopBar />);
      expect(screen.getByText('Bipladip')).toBeInTheDocument();
      expect(screen.getByText(/Welcome back/i)).toBeInTheDocument();
    });

    it('should render the sustainability tagline', () => {
      render(<TopBar />);
      expect(screen.getByText(/reduce your carbon footprint/i)).toBeInTheDocument();
    });
  });

  describe('Theme Toggle', () => {
    it('should have an accessible label for the theme toggle button', () => {
      render(<TopBar />);
      const themeButton = screen.getByLabelText(/switch to.*mode/i);
      expect(themeButton).toBeInTheDocument();
    });

    it('should call setTheme when theme toggle is clicked', () => {
      render(<TopBar />);
      const themeButton = screen.getByLabelText(/switch to.*mode/i);
      fireEvent.click(themeButton);
      expect(mockSetTheme).toHaveBeenCalledWith('light');
    });
  });

  describe('Notifications', () => {
    it('should render a notifications button with accessible label', () => {
      render(<TopBar />);
      const notifButton = screen.getByLabelText(/notifications/i);
      expect(notifButton).toBeInTheDocument();
    });
  });

  describe('Logout', () => {
    it('should render a logout button with accessible label', () => {
      render(<TopBar />);
      const logoutButton = screen.getByLabelText(/logout/i);
      expect(logoutButton).toBeInTheDocument();
    });

    it('should call logout when logout button is clicked', () => {
      render(<TopBar />);
      const logoutButton = screen.getByLabelText(/logout/i);
      fireEvent.click(logoutButton);
      expect(mockLogout).toHaveBeenCalledTimes(1);
    });
  });

  describe('Accessibility', () => {
    it('should render the user icon with aria-hidden', () => {
      render(<TopBar />);
      // The User icon in the avatar circle should be decorative
      const hiddenIcons = document.querySelectorAll('[aria-hidden="true"]');
      expect(hiddenIcons.length).toBeGreaterThan(0);
    });
  });
});
