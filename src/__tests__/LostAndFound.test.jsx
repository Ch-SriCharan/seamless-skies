/**
 * LostAndFound.test.jsx
 *
 * Tests:
 * 1. Unit: renders all expected form fields when open
 * 2. Validation: shows errors on empty submit
 * 3. Integration: fills valid form and verifies tracking ID appears
 */
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import LostAndFound from '../components/LostAndFound';

// Minimal mock for react-router-dom (not used inside LostAndFound, but imported transitively)
jest.mock('react-router-dom', () => ({
  useNavigate: () => jest.fn(),
  Navigate: ({ to }) => `Redirected to ${to}`,
}));

describe('LostAndFound', () => {
  const renderOpen = () =>
    render(<LostAndFound isOpen={true} onClose={jest.fn()} />);

  // ─── Test 1: Component rendering ────────────────────────────────────────────
  test('renders all form fields when open', () => {
    renderOpen();
    expect(screen.getByLabelText(/item/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/contact email/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit report/i })).toBeInTheDocument();
  });

  // ─── Test 2: Validation — empty submit ──────────────────────────────────────
  test('shows validation errors on empty form submission', () => {
    renderOpen();
    const submitBtn = screen.getByRole('button', { name: /submit report/i });
    fireEvent.click(submitBtn);
    // Item and email are required — at least one error should appear
    expect(screen.getByLabelText(/item/i)).toBeInTheDocument();
  });

  // ─── Test 3: Integration — valid form flow ──────────────────────────────────
  test('shows tracking ID after valid form submission', () => {
    renderOpen();

    fireEvent.change(screen.getByLabelText(/item/i), {
      target: { name: 'item', value: 'Blue passport wallet' },
    });
    fireEvent.change(screen.getByLabelText(/contact email/i), {
      target: { name: 'contact', value: 'test@example.com' },
    });

    fireEvent.click(screen.getByRole('button', { name: /submit report/i }));

    // Tracking ID like SS-XXXX should appear
    expect(screen.getByText(/tracking id is/i)).toBeInTheDocument();
  });

  // ─── Test 4: Closed state ───────────────────────────────────────────────────
  test('renders nothing when isOpen is false', () => {
    const { container } = render(
      <LostAndFound isOpen={false} onClose={jest.fn()} />
    );
    expect(container.firstChild).toBeNull();
  });
});
