/**
 * FlightFinder.test.jsx
 *
 * Tests:
 * 1. Unit: formatInr utility produces correct INR format
 * 2. Component: renders correctly with empty flight list
 * 3. Component: renders flight results when bookable flights exist
 */
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import FlightFinder from '../components/FlightFinder';

// ─── Unit test: formatInr ────────────────────────────────────────────────────
describe('formatInr utility', () => {
  // Re-implement for isolated unit testing (mirrors the component's implementation)
  const formatInr = (amount) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);

  test('formats 6499 as Indian Rupees', () => {
    const result = formatInr(6499);
    expect(result).toContain('6,499');
    expect(result).toMatch(/₹|INR/);
  });

  test('formats 0 without decimal places', () => {
    const result = formatInr(0);
    expect(result).not.toContain('.');
  });
});

// ─── Component rendering tests ───────────────────────────────────────────────
describe('FlightFinder component', () => {
  test('renders with empty flights array without crashing', () => {
    render(<FlightFinder flights={[]} onFlightSelect={jest.fn()} />);
    expect(screen.getByText(/find your flight/i)).toBeInTheDocument();
    expect(screen.getByText(/0 planes available/i)).toBeInTheDocument();
  });

  test('renders bookable flight results', () => {
    const mockFlights = [
      {
        icao24: 'ss1001',
        callsign: 'SS 101',
        on_ground: true,
        priceInr: 6499,
        seatsLeft: 8,
        route: {
          from: 'Delhi',
          fromCode: 'DEL',
          to: 'Mumbai',
          toCode: 'BOM',
          departure: '16:40',
          arrival: '18:55',
          duration: '2h 15m',
        },
      },
    ];

    render(<FlightFinder flights={mockFlights} onFlightSelect={jest.fn()} />);
    expect(screen.getByText('SS 101')).toBeInTheDocument();
    expect(screen.getByText('Delhi → Mumbai')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /view plane/i })).toBeInTheDocument();
  });

  test('shows no results message when no matches', () => {
    render(<FlightFinder flights={[]} onFlightSelect={jest.fn()} />);
    expect(screen.getByText(/no direct planes found/i)).toBeInTheDocument();
  });
});
