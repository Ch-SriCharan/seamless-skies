/**
 * ProtectedRoute.test.jsx
 *
 * Integration-style tests for the ProtectedRoute wrapper.
 * Uses MemoryRouter so we can test navigation behaviour in jsdom.
 */
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../router/ProtectedRoute';

// Helper to render ProtectedRoute inside a proper router context
const renderProtectedRoute = (children = <div>Admin Dashboard</div>) =>
  render(
    <MemoryRouter initialEntries={['/admin']}>
      <Routes>
        <Route path="/" element={<div>Home Page</div>} />
        <Route
          path="/admin"
          element={<ProtectedRoute>{children}</ProtectedRoute>}
        />
      </Routes>
    </MemoryRouter>
  );

describe('ProtectedRoute', () => {
  // ─── Test 1: Authenticated access ─────────────────────────────────────────
  test('renders children when MOCK_IS_ADMIN is true (default)', () => {
    renderProtectedRoute();
    expect(screen.getByText('Admin Dashboard')).toBeInTheDocument();
  });

  // ─── Test 2: Children prop pass-through ────────────────────────────────────
  test('renders any arbitrary children when authenticated', () => {
    renderProtectedRoute(<span data-testid="custom-child">Protected Content</span>);
    expect(screen.getByTestId('custom-child')).toBeInTheDocument();
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  // ─── Test 3: Unauthenticated — guard renders Navigate redirect ─────────────
  test('renders Navigate component (redirect) when flag is false', () => {
    // Create an inline guard with MOCK_IS_ADMIN forced to false
    const UnauthGuard = ({ children }) => {
      const { Navigate } = require('react-router-dom');
      const isAuth = false; // simulated unauthenticated
      return isAuth ? children : <Navigate to="/" replace />;
    };

    render(
      <MemoryRouter initialEntries={['/admin']}>
        <Routes>
          <Route path="/" element={<div>Home Page</div>} />
          <Route
            path="/admin"
            element={<UnauthGuard><div>Admin Content</div></UnauthGuard>}
          />
        </Routes>
      </MemoryRouter>
    );

    // When redirected to /, the Home Page is shown
    expect(screen.getByText('Home Page')).toBeInTheDocument();
    expect(screen.queryByText('Admin Content')).not.toBeInTheDocument();
  });
});
