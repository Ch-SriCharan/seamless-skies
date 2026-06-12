import { useMemo, useState } from 'react';

const formatInr = (amount) => new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
}).format(amount);

const FlightFinder = ({ flights, onFlightSelect }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  const bookableFlights = useMemo(
    () => flights.filter((flight) => flight.on_ground && flight.route),
    [flights]
  );
  const origins = useMemo(
    () => [...new Set(bookableFlights.map((flight) => flight.route.from))].sort(),
    [bookableFlights]
  );
  const destinations = useMemo(
    () => [...new Set(bookableFlights.map((flight) => flight.route.to))].sort(),
    [bookableFlights]
  );
  const matches = bookableFlights.filter((flight) => (
    (!from || flight.route.from === from) && (!to || flight.route.to === to)
  ));

  if (!isOpen) {
    return (
      <button className="glass-panel finder-open-button" type="button" onClick={() => setIsOpen(true)}>
        <span>✈</span> Find Flights
      </button>
    );
  }

  return (
    <section className="glass-panel flight-finder">
      <header className="finder-header">
        <div>
          <span className="eyebrow">BOOKABLE AIRCRAFT</span>
          <h2>Find your flight</h2>
        </div>
        <button type="button" onClick={() => setIsOpen(false)} aria-label="Close flight finder">&times;</button>
      </header>

      <div className="route-filters">
        <label>
          From
          <select value={from} onChange={(event) => setFrom(event.target.value)}>
            <option value="">Any origin</option>
            {origins.map((city) => <option value={city} key={city}>{city}</option>)}
          </select>
        </label>
        <button
          className="swap-route"
          type="button"
          aria-label="Swap origin and destination"
          onClick={() => { setFrom(to); setTo(from); }}
        >
          ⇄
        </button>
        <label>
          To
          <select value={to} onChange={(event) => setTo(event.target.value)}>
            <option value="">Any destination</option>
            {destinations.map((city) => <option value={city} key={city}>{city}</option>)}
          </select>
        </label>
      </div>

      <div className="finder-results-heading">
        <strong>{matches.length} {matches.length === 1 ? 'plane' : 'planes'} available</strong>
        {(from || to) && <button type="button" onClick={() => { setFrom(''); setTo(''); }}>Clear</button>}
      </div>

      <div className="flight-results">
        {matches.map((flight) => (
          <article className="flight-result" key={flight.icao24}>
            <div className="result-topline">
              <strong>{flight.callsign}</strong>
              <span>{formatInr(flight.priceInr)}</span>
            </div>
            <div className="result-route">
              <div><strong>{flight.route.fromCode}</strong><small>{flight.route.departure}</small></div>
              <div className="result-path"><span>{flight.route.duration}</span><i /></div>
              <div><strong>{flight.route.toCode}</strong><small>{flight.route.arrival}</small></div>
            </div>
            <div className="result-footer">
              <span>{flight.route.from} → {flight.route.to}</span>
              <button type="button" onClick={() => onFlightSelect(flight)}>View plane</button>
            </div>
          </article>
        ))}

        {matches.length === 0 && (
          <div className="no-flight-results">
            <strong>No direct planes found</strong>
            <p>Try another origin or destination.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default FlightFinder;
