import { useState, useEffect } from 'react';
import RadarMap from './components/RadarMap';
import FlightDetails from './components/FlightDetails';
import FlightFinder from './components/FlightFinder';
import LostAndFound from './components/LostAndFound';
import { fetchActiveFlights } from './services/api';

function App() {
  const [flights, setFlights] = useState([]);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLostAndFoundOpen, setIsLostAndFoundOpen] = useState(false);

  const loadFlights = async () => {
    try {
      setError(null);
      const data = await fetchActiveFlights();
      setFlights(data);
      
      // Update selected flight with fresh data if it exists
      if (selectedFlight) {
        const updatedSelected = data.find(f => f.icao24 === selectedFlight.icao24);
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
    // Refresh every 60 seconds
    const interval = setInterval(loadFlights, 60000);
    return () => {
      clearTimeout(initialLoad);
      clearInterval(interval);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {isLoading && flights.length === 0 && (
        <div style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          zIndex: 2000, background: 'var(--panel-bg)', padding: '20px', borderRadius: '8px',
          backdropFilter: 'var(--glass-blur)', border: '1px solid var(--panel-border)'
        }}>
          Loading Radar Data...
        </div>
      )}

      {error && (
        <div style={{
          position: 'absolute', top: '20px', left: '50%', transform: 'translateX(-50%)',
          zIndex: 2000, background: 'var(--danger-color)', color: 'white', padding: '12px 24px', 
          borderRadius: '8px', boxShadow: 'var(--shadow-main)'
        }}>
          {error}
        </div>
      )}

      <RadarMap 
        flights={flights} 
        onFlightSelect={setSelectedFlight} 
        selectedFlight={selectedFlight} 
      />
      
      <FlightDetails 
        key={selectedFlight?.icao24 || 'no-flight'}
        flight={selectedFlight} 
        onClose={() => setSelectedFlight(null)} 
      />

      <FlightFinder flights={flights} onFlightSelect={setSelectedFlight} />

      <div 
        className="glass-panel brand-panel"
      >
        <div className={`status-dot ${error ? 'is-error' : ''}`} />
        <div>
          <h1>SEAMLESS <span>SKIES</span></h1>
          <p>Powered by Precision</p>
        </div>
        <span className="flight-count">{flights.length} Tracked Flights</span>
      </div>

      <div className="glass-panel map-legend">
        <span><i className="legend-dot ground" /> Ground · Bookable</span>
        <span><i className="legend-dot air" /> In air · Unavailable</span>
      </div>

      <button
        className="glass-panel lost-found-trigger"
        type="button"
        onClick={() => setIsLostAndFoundOpen(true)}
      >
        <span className="trigger-icon" aria-hidden="true">?</span>
        <span>
          <strong>Lost &amp; Found</strong>
          <small>Report or track an item</small>
        </span>
      </button>

      <LostAndFound
        isOpen={isLostAndFoundOpen}
        onClose={() => setIsLostAndFoundOpen(false)}
      />
    </div>
  );
}

export default App;
