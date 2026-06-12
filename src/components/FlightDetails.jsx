import { useMemo, useState } from 'react';

const formatInr = (amount) => new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
}).format(amount);

const FlightDetails = ({ flight, onClose }) => {
  const [showBooking, setShowBooking] = useState(false);
  const [passengers, setPassengers] = useState(1);
  const [travelClass, setTravelClass] = useState('Economy');
  const [passengerName, setPassengerName] = useState('');
  const [bookingId, setBookingId] = useState('');

  const multiplier = travelClass === 'Business' ? 1.8 : 1;
  const total = useMemo(
    () => Math.round((flight?.priceInr || 0) * passengers * multiplier),
    [flight?.priceInr, passengers, multiplier]
  );

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
    on_ground,
    route,
    priceInr,
    seatsLeft,
  } = flight;

  const submitBooking = (event) => {
    event.preventDefault();
    setBookingId(`SS${Math.floor(100000 + Math.random() * 900000)}`);
  };

  return (
    <div className="glass-panel flight-details-panel">
      <div className="flight-header">
        <div>
          <span className={`availability-tag ${on_ground ? 'available' : 'unavailable'}`}>
            {on_ground ? 'Available to book' : 'Unavailable in air'}
          </span>
          <h2>{callsign !== 'UNKNOWN' ? callsign : 'Unknown Callsign'}</h2>
          <div className="aircraft-id">ICAO24: {icao24.toUpperCase()}</div>
        </div>
        <button className="close-btn" onClick={onClose} aria-label="Close flight details">&times;</button>
      </div>

      {route && (
        <section className="route-summary">
          <div>
            <strong>{route.fromCode}</strong>
            <span>{route.from}</span>
            <small>{route.departure}</small>
          </div>
          <div className="route-line">
            <span>{route.duration}</span>
            <i />
            <small>Planned path</small>
          </div>
          <div>
            <strong>{route.toCode}</strong>
            <span>{route.to}</span>
            <small>{route.arrival}</small>
          </div>
        </section>
      )}

      <section>
        <h3>Aircraft Info</h3>
        <div className="detail-row">
          <span className="detail-label">Origin Country</span>
          <span className="detail-value">{origin_country || 'Unknown'}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Status</span>
          <span className={`detail-value ${on_ground ? 'ground-text' : 'air-text'}`}>
            {on_ground ? 'On Ground' : 'In Air'}
          </span>
        </div>
        {squawk && (
          <div className="detail-row">
            <span className="detail-label">Squawk Code</span>
            <span className="detail-value">{squawk}</span>
          </div>
        )}
      </section>

      {!on_ground && (
        <section>
          <h3>Live Telemetry</h3>
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
          {time_position && <div className="updated-time">Updated: {new Date(time_position * 1000).toLocaleTimeString()}</div>}
        </section>
      )}

      {on_ground ? (
        <section className="fare-section">
          <div>
            <span>Fare from</span>
            <strong>{formatInr(priceInr)}</strong>
            <small>per passenger · {seatsLeft} seats left</small>
          </div>
          <button className="book-button" type="button" onClick={() => setShowBooking((value) => !value)}>
            {showBooking ? 'Hide booking' : 'Book tickets'}
          </button>
        </section>
      ) : (
        <button className="book-button unavailable-button" type="button" disabled>
          Booking unavailable while in air
        </button>
      )}

      {showBooking && on_ground && (
        <form className="booking-form" onSubmit={submitBooking}>
          {bookingId ? (
            <div className="booking-confirmation">
              <span>Booking confirmed</span>
              <strong>{bookingId}</strong>
              <p>{passengerName}, your {travelClass.toLowerCase()} ticket is reserved.</p>
            </div>
          ) : (
            <>
              <h3>Book {route.fromCode} to {route.toCode}</h3>
              <label>
                Lead passenger
                <input value={passengerName} onChange={(event) => setPassengerName(event.target.value)} required placeholder="Full name" />
              </label>
              <div className="booking-fields">
                <label>
                  Passengers
                  <select value={passengers} onChange={(event) => setPassengers(Number(event.target.value))}>
                    {[1, 2, 3, 4, 5].map((count) => <option value={count} key={count}>{count}</option>)}
                  </select>
                </label>
                <label>
                  Class
                  <select value={travelClass} onChange={(event) => setTravelClass(event.target.value)}>
                    <option>Economy</option>
                    <option>Business</option>
                  </select>
                </label>
              </div>
              <div className="booking-total">
                <span>Total</span>
                <strong>{formatInr(total)}</strong>
              </div>
              <button className="confirm-booking" type="submit">Confirm ticket</button>
            </>
          )}
        </form>
      )}
    </div>
  );
};

export default FlightDetails;
