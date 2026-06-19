import React from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// SVG Airplane icon string
const getAirplaneSvg = (color = '#3b82f6') => `
<svg width="24" height="24" viewBox="0 0 24 24" fill="${color}" xmlns="http://www.w3.org/2000/svg">
  <path d="M21 16V14L13 9V3.5C13 2.67 12.33 2 11.5 2C10.67 2 10 2.67 10 3.5V9L2 14V16L10 13.5V19L8 20.5V22L11.5 21L15 22V20.5L13 19V13.5L21 16Z"/>
</svg>
`;

const createCustomIcon = (direction, isSelected, isOnGround) => {
  const color = isSelected ? '#f59e0b' : isOnGround ? '#10b981' : '#3b82f6';
  const svgString = getAirplaneSvg(color);
  
  return L.divIcon({
    className: 'custom-airplane-marker',
    html: `<div style="transform: rotate(${direction}deg);">${svgString}</div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
};

const projectPoint = (latitude, longitude, bearing, distanceKm) => {
  const angularDistance = distanceKm / 6371;
  const bearingRadians = bearing * Math.PI / 180;
  const lat1 = latitude * Math.PI / 180;
  const lon1 = longitude * Math.PI / 180;
  const lat2 = Math.asin(
    Math.sin(lat1) * Math.cos(angularDistance)
      + Math.cos(lat1) * Math.sin(angularDistance) * Math.cos(bearingRadians)
  );
  const lon2 = lon1 + Math.atan2(
    Math.sin(bearingRadians) * Math.sin(angularDistance) * Math.cos(lat1),
    Math.cos(angularDistance) - Math.sin(lat1) * Math.sin(lat2)
  );

  return [lat2 * 180 / Math.PI, lon2 * 180 / Math.PI];
};

const MapFocus = ({ flight }) => {
  const map = useMap();

  React.useEffect(() => {
    if (flight?.latitude == null || flight?.longitude == null) return;
    map.flyTo([flight.latitude, flight.longitude], 7, { duration: 1.2 });
  }, [flight, map]);

  return null;
};

const RadarMap = ({ flights, onFlightSelect, selectedFlight }) => {
  const defaultCenter = [22.8, 79.0];

  return (
    <div style={{ flex: 1, position: 'relative' }} aria-label="Interactive flight radar map" role="region">
      <MapContainer 
        center={defaultCenter} 
        zoom={5}
        minZoom={3}
        maxBounds={[[-90, -180], [90, 180]]}
        maxBoundsViscosity={1.0}
        zoomControl={true}
        style={{ width: '100%', height: '100%' }}
      >
        {/* CartoDB Dark Matter tiles for radar look */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        <MapFocus flight={selectedFlight} />

        {flights.map((flight, idx) => {
          if (flight.latitude == null || flight.longitude == null) return null;
          
          const isSelected = selectedFlight?.icao24 === flight.icao24;
          const heading = flight.true_track || 0;
          const speedKmH = Math.max((flight.velocity || 180) * 3.6, 300);
          const pathDistance = Math.min(Math.max(speedKmH / 8, 45), 140);
          const current = [flight.latitude, flight.longitude];
          const past = projectPoint(flight.latitude, flight.longitude, heading + 180, pathDistance * 0.45);
          const future = projectPoint(flight.latitude, flight.longitude, heading, pathDistance);
          
          return (
            <React.Fragment key={`flight-${flight.icao24 || idx}-${flight.last_contact}`}>
              {flight.on_ground && flight.route?.path ? (
                <Polyline
                  positions={flight.route.path}
                  pathOptions={{
                    color: isSelected ? '#f59e0b' : '#10b981',
                    weight: isSelected ? 4 : 2,
                    opacity: isSelected ? 0.95 : 0.46,
                    dashArray: isSelected ? undefined : '8 8',
                  }}
                />
              ) : (
                <>
                  <Polyline
                    positions={[past, current]}
                    pathOptions={{
                      color: isSelected ? '#f59e0b' : '#38bdf8',
                      weight: isSelected ? 3 : 1.5,
                      opacity: isSelected ? 0.9 : 0.34,
                    }}
                  />
                  <Polyline
                    positions={[current, future]}
                    pathOptions={{
                      color: isSelected ? '#f59e0b' : '#60a5fa',
                      weight: isSelected ? 2.5 : 1,
                      opacity: isSelected ? 0.8 : 0.26,
                      dashArray: '6 8',
                    }}
                  />
                </>
              )}
              <Marker 
                position={current}
                icon={createCustomIcon(heading, isSelected, flight.on_ground)}
                eventHandlers={{ click: () => onFlightSelect(flight) }}
              />
            </React.Fragment>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default RadarMap;
