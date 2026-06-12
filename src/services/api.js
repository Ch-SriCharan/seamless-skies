import axios from 'axios';

const CLIENT_ID = import.meta.env.VITE_OPENSKY_CLIENT_ID;
const CLIENT_SECRET = import.meta.env.VITE_OPENSKY_CLIENT_SECRET;

const TOKEN_URL = '/auth/realms/opensky-network/protocol/openid-connect/token';
const API_URL = '/api/states/all';

let cachedToken = null;
let tokenExpiresAt = null;

const scheduledGroundFlights = [
  {
    icao24: 'ss1001',
    callsign: 'SS 101',
    origin_country: 'India',
    latitude: 28.5562,
    longitude: 77.1000,
    baro_altitude: 0,
    velocity: 0,
    true_track: 225,
    vertical_rate: 0,
    on_ground: true,
    route: {
      from: 'Delhi',
      fromCode: 'DEL',
      to: 'Mumbai',
      toCode: 'BOM',
      departure: '16:40',
      arrival: '18:55',
      duration: '2h 15m',
      path: [[28.5562, 77.1], [25.2, 75.1], [22.3, 73.2], [19.0896, 72.8656]],
    },
    priceInr: 6499,
    seatsLeft: 8,
    scheduled: true,
  },
  {
    icao24: 'ss2034',
    callsign: 'SS 234',
    origin_country: 'India',
    latitude: 19.0896,
    longitude: 72.8656,
    baro_altitude: 0,
    velocity: 0,
    true_track: 145,
    vertical_rate: 0,
    on_ground: true,
    route: {
      from: 'Mumbai',
      fromCode: 'BOM',
      to: 'Bengaluru',
      toCode: 'BLR',
      departure: '17:20',
      arrival: '19:05',
      duration: '1h 45m',
      path: [[19.0896, 72.8656], [16.8, 74.2], [14.5, 75.8], [13.1986, 77.7066]],
    },
    priceInr: 5299,
    seatsLeft: 14,
    scheduled: true,
  },
  {
    icao24: 'ss3188',
    callsign: 'SS 318',
    origin_country: 'India',
    latitude: 13.1986,
    longitude: 77.7066,
    baro_altitude: 0,
    velocity: 0,
    true_track: 40,
    vertical_rate: 0,
    on_ground: true,
    route: {
      from: 'Bengaluru',
      fromCode: 'BLR',
      to: 'Kolkata',
      toCode: 'CCU',
      departure: '18:10',
      arrival: '20:40',
      duration: '2h 30m',
      path: [[13.1986, 77.7066], [15.7, 80.1], [18.4, 83.2], [22.6547, 88.4467]],
    },
    priceInr: 7199,
    seatsLeft: 5,
    scheduled: true,
  },
  {
    icao24: 'ss4420',
    callsign: 'SS 420',
    origin_country: 'India',
    latitude: 22.6547,
    longitude: 88.4467,
    baro_altitude: 0,
    velocity: 0,
    true_track: 285,
    vertical_rate: 0,
    on_ground: true,
    route: {
      from: 'Kolkata',
      fromCode: 'CCU',
      to: 'Delhi',
      toCode: 'DEL',
      departure: '19:15',
      arrival: '21:35',
      duration: '2h 20m',
      path: [[22.6547, 88.4467], [24.0, 84.0], [26.0, 80.5], [28.5562, 77.1]],
    },
    priceInr: 6899,
    seatsLeft: 11,
    scheduled: true,
  },
  {
    icao24: 'ss5512',
    callsign: 'SS 512',
    origin_country: 'India',
    latitude: 17.2403,
    longitude: 78.4294,
    baro_altitude: 0,
    velocity: 0,
    true_track: 205,
    vertical_rate: 0,
    on_ground: true,
    route: {
      from: 'Hyderabad',
      fromCode: 'HYD',
      to: 'Chennai',
      toCode: 'MAA',
      departure: '20:05',
      arrival: '21:25',
      duration: '1h 20m',
      path: [[17.2403, 78.4294], [15.7, 79.0], [14.2, 79.7], [12.9941, 80.1709]],
    },
    priceInr: 4599,
    seatsLeft: 17,
    scheduled: true,
  },
  {
    icao24: 'ss6246',
    callsign: 'SS 624',
    origin_country: 'India',
    latitude: 12.9941,
    longitude: 80.1709,
    baro_altitude: 0,
    velocity: 0,
    true_track: 275,
    vertical_rate: 0,
    on_ground: true,
    route: {
      from: 'Chennai',
      fromCode: 'MAA',
      to: 'Kochi',
      toCode: 'COK',
      departure: '20:35',
      arrival: '21:55',
      duration: '1h 20m',
      path: [[12.9941, 80.1709], [12.2, 78.4], [11.3, 77.0], [10.152, 76.4019]],
    },
    priceInr: 4199,
    seatsLeft: 9,
    scheduled: true,
  },
  {
    icao24: 'ss7350',
    callsign: 'SS 735',
    origin_country: 'India',
    latitude: 26.8289,
    longitude: 75.8056,
    baro_altitude: 0,
    velocity: 0,
    true_track: 225,
    vertical_rate: 0,
    on_ground: true,
    route: {
      from: 'Jaipur',
      fromCode: 'JAI',
      to: 'Ahmedabad',
      toCode: 'AMD',
      departure: '21:10',
      arrival: '22:30',
      duration: '1h 20m',
      path: [[26.8289, 75.8056], [25.0, 74.5], [23.8, 73.2], [23.0772, 72.6347]],
    },
    priceInr: 3899,
    seatsLeft: 20,
    scheduled: true,
  },
  {
    icao24: 'ss8468',
    callsign: 'SS 846',
    origin_country: 'India',
    latitude: 15.3808,
    longitude: 73.8314,
    baro_altitude: 0,
    velocity: 0,
    true_track: 345,
    vertical_rate: 0,
    on_ground: true,
    route: {
      from: 'Goa',
      fromCode: 'GOI',
      to: 'Pune',
      toCode: 'PNQ',
      departure: '21:45',
      arrival: '22:50',
      duration: '1h 05m',
      path: [[15.3808, 73.8314], [16.4, 73.9], [17.5, 74.0], [18.5822, 73.9197]],
    },
    priceInr: 3499,
    seatsLeft: 6,
    scheduled: true,
  },
];

const demoAirborneFlight = {
  icao24: 'ss7702',
  callsign: 'SS 702',
  origin_country: 'India',
  latitude: 21.45,
  longitude: 78.1,
  baro_altitude: 10680,
  velocity: 238,
  true_track: 94,
  vertical_rate: 1.2,
  on_ground: false,
  squawk: '4271',
  time_position: Math.floor(Date.now() / 1000),
  last_contact: Math.floor(Date.now() / 1000),
  scheduled: true,
};

const baselineFlights = [...scheduledGroundFlights, demoAirborneFlight];

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
    throw new Error('Authentication failed', { cause: error });
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

    // Restrict live traffic to India so it aligns with the bookable schedule.
    const response = await axios.get(API_URL, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params: {
        lamin: 6.5,
        lomin: 68.0,
        lamax: 35.5,
        lomax: 97.5
      }
    });

    if (response.data && response.data.states) {
      // Live airborne aircraft are view-only; scheduled ground aircraft are bookable.
      const mappedFlights = response.data.states
        .filter(v => v[5] !== null && v[6] !== null && !v[8])
        .map(mapStateVector)
        .slice(0, 500);
      
      return [...baselineFlights, ...mappedFlights];
    }
    
    return baselineFlights;
  } catch (error) {
    console.error('Error fetching OpenSky flights:', error);
    return baselineFlights;
  }
};
