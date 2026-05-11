import React from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// SVG Airplane icon string
const getAirplaneSvg = (color = '#3b82f6') => `
<svg width="24" height="24" viewBox="0 0 24 24" fill="${color}" xmlns="http://www.w3.org/2000/svg">
  <path d="M21 16V14L13 9V3.5C13 2.67 12.33 2 11.5 2C10.67 2 10 2.67 10 3.5V9L2 14V16L10 13.5V19L8 20.5V22L11.5 21L15 22V20.5L13 19V13.5L21 16Z"/>
</svg>
`;

const createCustomIcon = (direction, isSelected) => {
  const color = isSelected ? '#f59e0b' : '#3b82f6';
  const svgString = getAirplaneSvg(color);
  
  return L.divIcon({
    className: 'custom-airplane-marker',
    html: `<div style="transform: rotate(${direction}deg);">${svgString}</div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
};

const RadarMap = ({ flights, onFlightSelect, selectedFlight }) => {
  // Default center (e.g., somewhere in Europe or North America)
  const defaultCenter = [40.7128, -74.0060]; // NYC

  return (
    <div style={{ flex: 1, position: 'relative' }}>
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

        {flights.map((flight, idx) => {
          if (flight.latitude == null || flight.longitude == null) return null;
          
          const isSelected = selectedFlight?.icao24 === flight.icao24;
          
          return (
            <Marker 
              key={`flight-${flight.icao24 || idx}-${flight.last_contact}`}
              position={[flight.latitude, flight.longitude]}
              icon={createCustomIcon(flight.true_track || 0, isSelected)}
              eventHandlers={{
                click: () => onFlightSelect(flight),
              }}
            />
          );
        })}
      </MapContainer>
    </div>
  );
};

export default RadarMap;
