/**
 * Leaflet mock for Jest/jsdom.
 * Leaflet uses browser APIs unavailable in jsdom (canvas, SVG, window.L, etc.).
 * This mock stubs out the parts our components import.
 */
const noop = () => {};
const mapInstance = {
  flyTo: noop,
  setView: noop,
  addLayer: noop,
  removeLayer: noop,
  on: noop,
  off: noop,
  remove: noop,
};

const L = {
  divIcon: () => ({}),
  icon: () => ({}),
  marker: () => ({ addTo: noop, remove: noop }),
  polyline: () => ({ addTo: noop, remove: noop }),
  map: () => mapInstance,
};

// react-leaflet named exports
const MapContainer = ({ children }) => children ?? null;
const TileLayer = () => null;
const Marker = () => null;
const Polyline = () => null;
const useMap = () => mapInstance;

module.exports = {
  default: L,
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  useMap,
  ...L,
};
