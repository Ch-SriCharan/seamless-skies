/**
 * COsPanel — Course Outcomes tracker overlay.
 *
 * Displays all 6 COs with their descriptions and implementation
 * evidence, styled with the existing glass-panel design system.
 */
import { useState } from 'react';

const cos = [
  {
    id: 'CO1',
    title: 'Foundations of Front-End Engineering & Framework Design',
    color: '#3b82f6',
    items: [
      { label: 'Virtual DOM abstraction', evidence: 'React 19 reconciler drives RadarMap & FlightDetails re-renders' },
      { label: 'Declarative UI', evidence: 'All components return JSX — no imperative DOM manipulation' },
      { label: 'Unidirectional data flow', evidence: 'App.jsx owns state; props flow down to RadarMap, FlightDetails, FlightFinder' },
      { label: 'Component-driven thinking', evidence: 'Discrete components: RadarMap, FlightFinder, FlightDetails, LostAndFound, COsPanel' },
      { label: 'Rendering pipeline & reconciliation', evidence: 'key={selectedFlight?.icao24} forces reconciliation on flight change (App.jsx line 74)' },
      { label: 'Composition over inheritance', evidence: 'ProtectedRoute wraps AdminPage via children prop pattern' },
    ],
  },
  {
    id: 'CO2',
    title: 'JavaScript & TypeScript Engineering for Frameworks',
    color: '#10b981',
    items: [
      { label: 'ES6+ essentials', evidence: 'Destructuring, optional chaining, nullish coalescing throughout codebase' },
      { label: 'Closures as state constructs', evidence: 'useState setter closures in LostAndFound.updateField, FlightDetails.handlePassengersChange' },
      { label: 'Functional programming in UI', evidence: 'useMemo, Array.filter/map/reduce across FlightFinder & FlightDetails' },
      { label: 'Immutability & pure functions', evidence: 'mapStateVector (api.js) is a pure transformation; state updates via spread {...current}' },
      { label: 'Async/await for UI updates', evidence: 'fetchActiveFlights is async/await with try/catch; token caching with expiry' },
      { label: 'Module patterns', evidence: 'ES module imports across all files; services/api.js as isolated service layer' },
    ],
  },
  {
    id: 'CO3',
    title: 'React Component Model',
    color: '#f59e0b',
    items: [
      { label: 'Component as deterministic UI function', evidence: 'FlightDetails({ flight, onClose }) → deterministic JSX output for given props' },
      { label: 'Props as configuration contract', evidence: 'RadarMap({ flights, onFlightSelect, selectedFlight }) — typed prop contract' },
      { label: 'State as dynamic runtime data', evidence: 'flights, selectedFlight, isLoading, error — all useState in App.jsx' },
      { label: 'React hooks as lifecycle abstractions', evidence: 'useEffect for interval polling; useMemo for derived flight lists & costs' },
      { label: 'Controlled forms', evidence: 'All inputs use value + onChange (LostAndFound, FlightDetails booking form)' },
      { label: 'Glassmorphism CSS design system', evidence: '867-line index.css: CSS custom properties, .glass-panel utility, component-scoped classes' },
    ],
  },
  {
    id: 'CO4',
    title: 'State Architecture, Async Data Engineering & API Integration',
    color: '#a855f7',
    items: [
      { label: 'State lifting & co-location', evidence: 'selectedFlight lifted to App.jsx; local form state stays in LostAndFound & FlightDetails' },
      { label: 'Derived state', evidence: 'bookableFlights, origins, destinations, matches — all useMemo derived from flights prop' },
      { label: 'API service layer', evidence: 'services/api.js: OAuth2 token caching, OpenSky REST call, fallback to baselineFlights' },
      { label: 'Race condition handling', evidence: 'clearTimeout + clearInterval cleanup in useEffect return; token expiry buffer (60 s)' },
      { label: 'Stale state problem', evidence: 'selectedFlight refreshed on each loadFlights call via data.find(f => f.icao24 === ...)' },
      { label: 'Container-presenter pattern', evidence: 'App.jsx = container (data + state); RadarMap/FlightFinder/FlightDetails = presenters' },
    ],
  },
  {
    id: 'CO5',
    title: 'Routing, Forms, Accessibility & Performance Engineering',
    color: '#ef4444',
    items: [
      { label: 'SPA routing with react-router-dom', evidence: 'BrowserRouter → Routes with /, /flight/:id, /lost-and-found, /admin' },
      { label: 'Dynamic routes', evidence: '/flight/:id reads useParams to auto-select matching flight on load' },
      { label: 'Protected routes', evidence: 'ProtectedRoute wraps AdminPage; MOCK_IS_ADMIN flag gates /admin' },
      { label: 'Form validation pipelines', evidence: 'LostAndFound: item ≥ 3 chars, valid email, flight pattern; FlightDetails: name ≥ 2 chars' },
      { label: 'Accessibility engineering', evidence: 'role=dialog, aria-modal, aria-live, htmlFor+id pairs, aria-invalid, aria-label on map' },
      { label: 'React.lazy + Suspense + React.memo', evidence: 'FlightFinder & LostAndFound lazy-loaded; FlightFinder wrapped in React.memo' },
    ],
  },
  {
    id: 'CO6',
    title: 'Build Systems, Testing, CI/CD & Deployment Engineering',
    color: '#06b6d4',
    items: [
      { label: 'Vite build system', evidence: 'vite.config.js: proxy, sourcemap:true, manualChunks for react + leaflet vendor splitting' },
      { label: 'ESLint code quality', evidence: 'eslint.config.js: @eslint/js recommended + react-hooks + react-refresh rules' },
      { label: 'Unit & component tests (Jest + RTL)', evidence: 'LostAndFound.test, FlightFinder.test, ProtectedRoute.test — render, fire events, assert' },
      { label: 'Integration-style tests', evidence: 'LostAndFound submit flow: fill form → submit → check tracking ID in DOM' },
      { label: 'CI/CD pipeline (GitHub Actions)', evidence: '.github/workflows/ci.yml: npm ci → lint → test → build on every push' },
      { label: 'Performance evaluation (Lighthouse)', evidence: 'LIGHTHOUSE.md: audit instructions, target scores, core web vitals documentation' },
    ],
  },
];

const COsPanel = ({ isOpen, onClose }) => {
  const [expandedId, setExpandedId] = useState(null);

  if (!isOpen) return null;

  const toggle = (id) => setExpandedId((prev) => (prev === id ? null : id));

  return (
    <div
      className="cos-backdrop"
      role="presentation"
      onMouseDown={onClose}
    >
      <aside
        className="glass-panel cos-panel"
        role="dialog"
        aria-modal="true"
        aria-label="Course Outcomes"
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <header className="cos-header">
          <div>
            <span className="eyebrow">ACADEMIC MAPPING</span>
            <h2>Course Outcomes</h2>
            <p>All 6 COs demonstrated in this project</p>
          </div>
          <button
            className="panel-close"
            type="button"
            onClick={onClose}
            aria-label="Close course outcomes panel"
          >
            &times;
          </button>
        </header>

        {/* CO Cards */}
        <div className="cos-list" role="list">
          {cos.map((co) => {
            const isExpanded = expandedId === co.id;
            return (
              <article
                key={co.id}
                className={`cos-card ${isExpanded ? 'is-expanded' : ''}`}
                role="listitem"
                style={{ '--co-color': co.color }}
              >
                <button
                  className="cos-card-header"
                  type="button"
                  onClick={() => toggle(co.id)}
                  aria-expanded={isExpanded}
                  aria-controls={`cos-body-${co.id}`}
                >
                  <span className="cos-badge" style={{ background: co.color }}>
                    {co.id}
                  </span>
                  <span className="cos-title">{co.title}</span>
                  <span className="cos-status-tag">✓ Implemented</span>
                  <span className="cos-chevron" aria-hidden="true">
                    {isExpanded ? '▲' : '▼'}
                  </span>
                </button>

                {isExpanded && (
                  <div
                    id={`cos-body-${co.id}`}
                    className="cos-card-body"
                  >
                    {co.items.map((item, idx) => (
                      <div key={idx} className="cos-evidence-row">
                        <span className="cos-evidence-dot" style={{ background: co.color }} aria-hidden="true" />
                        <div>
                          <strong>{item.label}</strong>
                          <p>{item.evidence}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </article>
            );
          })}
        </div>

        {/* Footer summary */}
        <div className="cos-footer">
          <span className="cos-all-done">6 / 6 Course Outcomes Implemented</span>
          <div className="cos-color-bar">
            {cos.map((co) => (
              <span
                key={co.id}
                className="cos-color-segment"
                style={{ background: co.color }}
                title={co.id}
              />
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
};

export default COsPanel;
