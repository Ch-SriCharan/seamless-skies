import { useState, useEffect, lazy, Suspense } from 'react';
import { Routes, Route, useNavigate, useParams } from 'react-router-dom';
import RadarMap from './components/RadarMap';
import FlightDetails from './components/FlightDetails';
import { fetchActiveFlights } from './services/api';
import ProtectedRoute from './router/ProtectedRoute';
import AdminPage from './pages/AdminPage';

// Lazy-loaded components (off critical path)
const FlightFinder = lazy(() => import('./components/FlightFinder'));
const LostAndFound = lazy(() => import('./components/LostAndFound'));
const COsPanel     = lazy(() => import('./components/COsPanel'));

/* ─── Inner layout — receives flights state from the router shell ─────────── */
const MainLayout = ({ flights, selectedFlight, setSelectedFlight, isLoading, error }) => {
  const navigate = useNavigate();
  const { id: flightIdParam } = useParams();
  const [isLostAndFoundOpen, setIsLostAndFoundOpen] = useState(false);
  const [isCOsOpen, setIsCOsOpen] = useState(false);

  // Auto-select flight from URL param (/flight/:id)
  useEffect(() => {
    if (flightIdParam && flights.length > 0) {
      const match = flights.find((f) => f.icao24 === flightIdParam);
      if (match) setSelectedFlight(match);
    }
  }, [flightIdParam, flights, setSelectedFlight]);

  const handleFlightSelect = (flight) => {
    setSelectedFlight(flight);
    navigate(`/flight/${flight.icao24}`);
  };

  const handleFlightClose = () => {
    setSelectedFlight(null);
    navigate('/');
  };

  return (
    <div
      style={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
      role="main"
      aria-label="Seamless Skies flight radar"
    >
      {/* Loading overlay */}
      {isLoading && flights.length === 0 && (
        <div
          role="status"
          aria-live="polite"
          aria-label="Loading radar data"
          style={{
            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
            zIndex: 2000, background: 'var(--panel-bg)', padding: '20px', borderRadius: '8px',
            backdropFilter: 'var(--glass-blur)', border: '1px solid var(--panel-border)'
          }}
        >
          Loading Radar Data...
        </div>
      )}

      {/* Error banner */}
      {error && (
        <div
          role="alert"
          aria-live="assertive"
          style={{
            position: 'absolute', top: '20px', left: '50%', transform: 'translateX(-50%)',
            zIndex: 2000, background: 'var(--danger-color)', color: 'white', padding: '12px 24px',
            borderRadius: '8px', boxShadow: 'var(--shadow-main)'
          }}
        >
          {error}
        </div>
      )}

      {/* Map (critical path — not lazy) */}
      <RadarMap
        flights={flights}
        onFlightSelect={handleFlightSelect}
        selectedFlight={selectedFlight}
      />

      {/* Flight details panel (critical path — not lazy) */}
      <FlightDetails
        key={selectedFlight?.icao24 || 'no-flight'}
        flight={selectedFlight}
        onClose={handleFlightClose}
      />

      {/* Lazy panels */}
      <Suspense fallback={null}>
        <FlightFinder flights={flights} onFlightSelect={handleFlightSelect} />
      </Suspense>

      {/* Brand panel */}
      <div
        className="glass-panel brand-panel"
        aria-label="Seamless Skies brand"
      >
        <div className={`status-dot ${error ? 'is-error' : ''}`} aria-hidden="true" />
        <div>
          <h1>SEAMLESS <span>SKIES</span></h1>
          <p>Powered by Precision</p>
        </div>
        <span className="flight-count" aria-live="polite">{flights.length} Tracked Flights</span>
      </div>

      {/* Map legend */}
      <div className="glass-panel map-legend" aria-label="Map legend">
        <span><i className="legend-dot ground" aria-hidden="true" /> Ground · Bookable</span>
        <span><i className="legend-dot air" aria-hidden="true" /> In air · Unavailable</span>
      </div>

      {/* Lost & Found trigger */}
      <button
        className="glass-panel lost-found-trigger"
        type="button"
        onClick={() => setIsLostAndFoundOpen(true)}
        aria-haspopup="dialog"
        aria-label="Open Lost and Found panel"
      >
        <span className="trigger-icon" aria-hidden="true">?</span>
        <span>
          <strong>Lost &amp; Found</strong>
          <small>Report or track an item</small>
        </span>
      </button>

      {/* CO Outcomes trigger */}
      <button
        className="glass-panel cos-trigger"
        type="button"
        onClick={() => setIsCOsOpen(true)}
        aria-haspopup="dialog"
        aria-label="View Course Outcomes"
      >
        <span className="trigger-icon" aria-hidden="true" style={{ fontSize: '0.9rem' }}>CO</span>
        <span>
          <strong>Course Outcomes</strong>
          <small>6 / 6 Implemented</small>
        </span>
      </button>

      {/* Lazy-loaded modals */}
      <Suspense fallback={null}>
        <LostAndFound
          isOpen={isLostAndFoundOpen}
          onClose={() => setIsLostAndFoundOpen(false)}
        />
        <COsPanel
          isOpen={isCOsOpen}
          onClose={() => setIsCOsOpen(false)}
        />
      </Suspense>
    </div>
  );
};

/* ─── Root App — owns data fetching state, renders router ────────────────── */
function App() {
  const [flights, setFlights] = useState([]);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadFlights = async () => {
    try {
      setError(null);
      const data = await fetchActiveFlights();
      setFlights(data);

      // Refresh selected flight with live data if it still exists
      if (selectedFlight) {
        const updatedSelected = data.find((f) => f.icao24 === selectedFlight.icao24);
        if (updatedSelected) {
          setSelectedFlight(updatedSelected);
        }
      }
    } catch {
      setError('Failed to fetch flight data. Please check your API key.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const initialLoad = setTimeout(loadFlights, 0);
    const interval = setInterval(loadFlights, 60000);
    return () => {
      clearTimeout(initialLoad);
      clearInterval(interval);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const sharedProps = { flights, selectedFlight, setSelectedFlight, isLoading, error };

  return (
    <Routes>
      {/* Home — full radar view */}
      <Route path="/" element={<MainLayout {...sharedProps} />} />

      {/* Flight detail — same layout, URL carries selected flight id */}
      <Route path="/flight/:id" element={<MainLayout {...sharedProps} />} />

      {/* Lost & Found deep-link — opens panel automatically */}
      <Route
        path="/lost-and-found"
        element={<MainLayout {...sharedProps} />}
      />

      {/* Admin — protected route */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminPage flights={flights} />
          </ProtectedRoute>
        }
      />

      {/* Fallback — redirect unknown paths to home */}
      <Route path="*" element={<MainLayout {...sharedProps} />} />
    </Routes>
  );
}

export default App;
