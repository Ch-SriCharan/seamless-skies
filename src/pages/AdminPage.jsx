/**
 * AdminPage — accessible only via ProtectedRoute (/admin).
 * Shows a simple flight stats dashboard with the glass-panel design system.
 */
import { useNavigate } from 'react-router-dom';

const AdminPage = ({ flights = [] }) => {
  const navigate = useNavigate();
  const groundCount = flights.filter((f) => f.on_ground).length;
  const airCount = flights.filter((f) => !f.on_ground).length;
  const bookableCount = flights.filter((f) => f.on_ground && f.route).length;

  return (
    <div className="admin-overlay" role="main" aria-label="Admin dashboard">
      <div className="glass-panel admin-panel">
        <header className="admin-header">
          <div>
            <span className="eyebrow">PROTECTED AREA</span>
            <h2>Admin Dashboard</h2>
            <p>Mock authentication active — real auth would use JWT/OAuth.</p>
          </div>
          <button
            className="panel-close"
            type="button"
            onClick={() => navigate('/')}
            aria-label="Return to home"
          >
            &times;
          </button>
        </header>

        <div className="admin-stats">
          <div className="admin-stat-card">
            <span className="admin-stat-value">{flights.length}</span>
            <span className="admin-stat-label">Total Tracked</span>
          </div>
          <div className="admin-stat-card">
            <span className="admin-stat-value" style={{ color: 'var(--success-color)' }}>
              {groundCount}
            </span>
            <span className="admin-stat-label">On Ground</span>
          </div>
          <div className="admin-stat-card">
            <span className="admin-stat-value" style={{ color: 'var(--accent-color)' }}>
              {airCount}
            </span>
            <span className="admin-stat-label">In Air</span>
          </div>
          <div className="admin-stat-card">
            <span className="admin-stat-value" style={{ color: 'var(--warning-color)' }}>
              {bookableCount}
            </span>
            <span className="admin-stat-label">Bookable</span>
          </div>
        </div>

        <div className="admin-info">
          <h3>Route Information</h3>
          {flights
            .filter((f) => f.on_ground && f.route)
            .map((f) => (
              <div key={f.icao24} className="admin-route-row">
                <strong>{f.callsign}</strong>
                <span>{f.route.from} → {f.route.to}</span>
                <span className="admin-seats">{f.seatsLeft} seats</span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
