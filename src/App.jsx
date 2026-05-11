import React, { useState, useEffect } from 'react';
import RadarMap from './components/RadarMap';
import FlightDetails from './components/FlightDetails';
import { fetchActiveFlights } from './services/api';

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
      
      // Update selected flight with fresh data if it exists
      if (selectedFlight) {
        const updatedSelected = data.find(f => f.icao24 === selectedFlight.icao24);
        if (updatedSelected) {
          setSelectedFlight(updatedSelected);
        }
      }
    } catch (err) {
      setError('Failed to fetch flight data. Please check your API key.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadFlights();
    // Refresh every 60 seconds
    const interval = setInterval(loadFlights, 60000);
    return () => clearInterval(interval);
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
        flight={selectedFlight} 
        onClose={() => setSelectedFlight(null)} 
      />

      {/* Header / Logo overlay */}
      <div 
        className="glass-panel"
        style={{
          position: 'absolute',
          top: '20px',
          left: '60px', /* Avoid zooming controls */
          padding: '12px 24px',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}
      >
        <div style={{
          width: '12px', height: '12px', borderRadius: '50%', 
          background: error ? 'var(--danger-color)' : 'var(--success-color)',
          boxShadow: `0 0 10px ${error ? 'var(--danger-color)' : 'var(--success-color)'}`
        }}></div>
        <h1 style={{ fontSize: '1.2rem', fontWeight: '700', letterSpacing: '1px', margin: 0 }}>
          RADAR<span style={{ color: 'var(--accent-hover)' }}>24</span>
        </h1>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: '8px' }}>
          {flights.length} Active Flights
        </span>
      </div>
    </div>
  );
}

export default App;
