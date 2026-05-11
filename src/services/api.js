import axios from 'axios';

const CLIENT_ID = import.meta.env.VITE_OPENSKY_CLIENT_ID;
const CLIENT_SECRET = import.meta.env.VITE_OPENSKY_CLIENT_SECRET;

const TOKEN_URL = '/auth/realms/opensky-network/protocol/openid-connect/token';
const API_URL = '/api/states/all';

let cachedToken = null;
let tokenExpiresAt = null;

// Fetch an OAuth2 token using client credentials
const getAccessToken = async () => {
  // Return cached token if valid (with 60-second buffer)
  if (cachedToken && tokenExpiresAt && Date.now() < tokenExpiresAt - 60000) {
    return cachedToken;
  }

  try {
    const params = new URLSearchParams();
    params.append('grant_type', 'client_credentials');
    params.append('client_id', CLIENT_ID);
    params.append('client_secret', CLIENT_SECRET);

    const response = await axios.post(TOKEN_URL, params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    cachedToken = response.data.access_token;
    // expiresIn is in seconds
    tokenExpiresAt = Date.now() + (response.data.expires_in * 1000);
    return cachedToken;
  } catch (error) {
    console.error('Failed to fetch OpenSky access token', error);
    throw new Error('Authentication failed');
  }
};

// OpenSky returns an array of arrays. This maps the index to named properties.
const mapStateVector = (vector) => ({
  icao24: vector[0],
  callsign: vector[1]?.trim() || 'UNKNOWN',
  origin_country: vector[2],
  time_position: vector[3],
  last_contact: vector[4],
  longitude: vector[5],
  latitude: vector[6],
  baro_altitude: vector[7],
  on_ground: vector[8],
  velocity: vector[9],
  true_track: vector[10],
  vertical_rate: vector[11],
  sensors: vector[12],
  geo_altitude: vector[13],
  squawk: vector[14],
  spi: vector[15],
  position_source: vector[16]
});

export const fetchActiveFlights = async () => {
  try {
    const token = await getAccessToken();

    // Restrict the query to North America to prevent fetching 15,000+ global flights
    // which causes massive DOM lag when rendering markers.
    const response = await axios.get(API_URL, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params: {
        lamin: 24.0,
        lomin: -125.0,
        lamax: 49.5,
        lomax: -66.5
      }
    });

    if (response.data && response.data.states) {
      // Filter out invalid/grounded flights and cap it at 1000 to keep the laptop happy
      const mappedFlights = response.data.states
        .filter(v => v[5] !== null && v[6] !== null && !v[8]) 
        .map(mapStateVector)
        .slice(0, 1000); 
      
      return mappedFlights;
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching OpenSky flights:', error);
    throw new Error('Failed to fetch flight data from OpenSky');
  }
};
