import React from 'react';

const FlightDetails = ({ flight, onClose }) => {
  if (!flight) return null;

  const { 
    icao24, 
    callsign, 
    origin_country, 
    time_position, 
    baro_altitude, 
    velocity, 
    true_track, 
    vertical_rate,
    squawk,
    on_ground
  } = flight;

  return (
    <div 
      className="glass-panel"
      style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        width: '350px',
        maxHeight: 'calc(100vh - 40px)',
        overflowY: 'auto',
        zIndex: 1000,
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        animation: 'slideIn 0.3s ease-out'
      }}
    >
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(120%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .detail-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
        }
        .detail-label {
          color: var(--text-muted);
          font-size: 0.9rem;
        }
        .detail-value {
          font-weight: 500;
        }
        .flight-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid var(--panel-border);
          padding-bottom: 12px;
        }
        .close-btn {
          background: none;
          border: none;
          color: var(--text-muted);
          font-size: 1.5rem;
          cursor: pointer;
          transition: color 0.2s;
        }
        .close-btn:hover {
          color: var(--danger-color);
        }
        .telemetry-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          background: rgba(0,0,0,0.2);
          padding: 12px;
          border-radius: 8px;
        }
        .telemetry-item {
          display: flex;
          flex-direction: column;
        }
      `}</style>

      <div className="flight-header">
        <div>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '4px' }}>
            {callsign !== 'UNKNOWN' ? callsign : 'Unknown Callsign'}
          </h2>
          <div style={{ color: 'var(--accent-hover)', fontWeight: '600', fontSize: '0.9rem' }}>
            ICAO24: {icao24.toUpperCase()}
          </div>
        </div>
        <button className="close-btn" onClick={onClose}>&times;</button>
      </div>

      <div>
        <h3 style={{ fontSize: '1rem', marginBottom: '8px', color: 'var(--text-muted)' }}>Aircraft Info</h3>
        <div className="detail-row">
          <span className="detail-label">Origin Country</span>
          <span className="detail-value">{origin_country || 'Unknown'}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Status</span>
          <span className="detail-value" style={{ color: on_ground ? 'var(--danger-color)' : 'var(--success-color)' }}>
            {on_ground ? 'On Ground' : 'In Air'}
          </span>
        </div>
        {squawk && (
          <div className="detail-row">
            <span className="detail-label">Squawk Code</span>
            <span className="detail-value">{squawk}</span>
          </div>
        )}
      </div>

      <div>
        <h3 style={{ fontSize: '1rem', marginBottom: '8px', color: 'var(--text-muted)' }}>Live Telemetry</h3>
        <div className="telemetry-grid">
          <div className="telemetry-item">
            <span className="detail-label">Altitude</span>
            <span className="detail-value">{baro_altitude != null ? `${Math.round(baro_altitude)} m` : 'N/A'}</span>
          </div>
          <div className="telemetry-item">
            <span className="detail-label">Speed</span>
            <span className="detail-value">{velocity != null ? `${Math.round(velocity * 3.6)} km/h` : 'N/A'}</span>
          </div>
          <div className="telemetry-item">
            <span className="detail-label">Heading</span>
            <span className="detail-value">{true_track != null ? `${Math.round(true_track)}°` : 'N/A'}</span>
          </div>
          <div className="telemetry-item">
            <span className="detail-label">V-Speed</span>
            <span className="detail-value">{vertical_rate != null ? `${vertical_rate} m/s` : 'N/A'}</span>
          </div>
        </div>
        {time_position && (
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '8px', textAlign: 'right' }}>
            Updated: {new Date(time_position * 1000).toLocaleTimeString()}
          </div>
        )}
      </div>
    </div>
  );
};

export default FlightDetails;
