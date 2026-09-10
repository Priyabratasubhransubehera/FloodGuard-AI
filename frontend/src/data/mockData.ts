export type RiskLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'VERY HIGH' | 'EXTREME';

export const RISK_COLORS: Record<RiskLevel, string> = {
  'LOW': '#22c55e',
  'MODERATE': '#eab308',
  'HIGH': '#f97316',
  'VERY HIGH': '#ef4444',
  'EXTREME': '#a855f7',
};

export const RISK_BG: Record<RiskLevel, string> = {
  'LOW': 'rgba(34,197,94,0.15)',
  'MODERATE': 'rgba(234,179,8,0.15)',
  'HIGH': 'rgba(249,115,22,0.15)',
  'VERY HIGH': 'rgba(239,68,68,0.15)',
  'EXTREME': 'rgba(168,85,247,0.15)',
};

// ── Districts & Villages ──────────────────────────────────────────────────
export const districts = [
  { id: 'D001', name: 'Chamoli', state: 'Uttarakhand', lat: 30.4, lng: 79.3 },
  { id: 'D002', name: 'Rudraprayag', state: 'Uttarakhand', lat: 30.28, lng: 78.98 },
  { id: 'D003', name: 'Tehri Garhwal', state: 'Uttarakhand', lat: 30.37, lng: 78.48 },
  { id: 'D004', name: 'Pithoragarh', state: 'Uttarakhand', lat: 29.58, lng: 80.21 },
  { id: 'D005', name: 'Bageshwar', state: 'Uttarakhand', lat: 29.83, lng: 79.77 },
];

export const villages = [
  { id: 'V001', name: 'Joshimath', districtId: 'D001', lat: 30.56, lng: 79.57, population: 4200, elevation: 1890, slope: 32, vulnerabilityScore: 88, riskLevel: 'VERY HIGH' as RiskLevel, floodProbability: 0.81, landslideProbability: 0.74 },
  { id: 'V002', name: 'Gauchar', districtId: 'D001', lat: 30.28, lng: 79.19, population: 6100, elevation: 782, slope: 18, vulnerabilityScore: 71, riskLevel: 'HIGH' as RiskLevel, floodProbability: 0.62, landslideProbability: 0.48 },
  { id: 'V003', name: 'Kedarnath', districtId: 'D002', lat: 30.73, lng: 79.07, population: 980, elevation: 3583, slope: 41, vulnerabilityScore: 94, riskLevel: 'EXTREME' as RiskLevel, floodProbability: 0.93, landslideProbability: 0.87 },
  { id: 'V004', name: 'Ukhimath', districtId: 'D002', lat: 30.49, lng: 79.10, population: 3200, elevation: 1311, slope: 28, vulnerabilityScore: 76, riskLevel: 'HIGH' as RiskLevel, floodProbability: 0.68, landslideProbability: 0.61 },
  { id: 'V005', name: 'Srinagar', districtId: 'D003', lat: 30.22, lng: 78.78, population: 18400, elevation: 560, slope: 12, vulnerabilityScore: 55, riskLevel: 'MODERATE' as RiskLevel, floodProbability: 0.44, landslideProbability: 0.29 },
  { id: 'V006', name: 'Devprayag', districtId: 'D003', lat: 30.14, lng: 78.61, population: 2900, elevation: 475, slope: 15, vulnerabilityScore: 62, riskLevel: 'HIGH' as RiskLevel, floodProbability: 0.58, landslideProbability: 0.41 },
  { id: 'V007', name: 'Munsiyari', districtId: 'D004', lat: 30.06, lng: 80.24, population: 5100, elevation: 2298, slope: 36, vulnerabilityScore: 83, riskLevel: 'VERY HIGH' as RiskLevel, floodProbability: 0.76, landslideProbability: 0.79 },
  { id: 'V008', name: 'Dharchula', districtId: 'D004', lat: 29.85, lng: 80.53, population: 7800, elevation: 915, slope: 22, vulnerabilityScore: 67, riskLevel: 'HIGH' as RiskLevel, floodProbability: 0.59, landslideProbability: 0.52 },
  { id: 'V009', name: 'Bageshwar Town', districtId: 'D005', lat: 29.84, lng: 79.77, population: 9200, elevation: 954, slope: 14, vulnerabilityScore: 48, riskLevel: 'MODERATE' as RiskLevel, floodProbability: 0.38, landslideProbability: 0.25 },
  { id: 'V010', name: 'Kapkot', districtId: 'D005', lat: 29.99, lng: 79.96, population: 3400, elevation: 1078, slope: 26, vulnerabilityScore: 71, riskLevel: 'HIGH' as RiskLevel, floodProbability: 0.65, landslideProbability: 0.55 },
];

// ── Monitoring Stations ──────────────────────────────────────────────────
export interface Station {
  id: string;
  name: string;
  type: 'RAINFALL' | 'RIVER' | 'WEATHER' | 'SOIL';
  lat: number;
  lng: number;
  status: 'ONLINE' | 'WARNING' | 'OFFLINE';
  lastReading: number;
  unit: string;
  threshold: number;
}

export const stations: Station[] = [
  { id: 'S001', name: 'Joshimath AWS', type: 'RAINFALL', lat: 30.56, lng: 79.57, status: 'ONLINE', lastReading: 48.2, unit: 'mm/hr', threshold: 50 },
  { id: 'S002', name: 'Alaknanda @ Chamoli', type: 'RIVER', lat: 30.41, lng: 79.32, status: 'WARNING', lastReading: 4.8, unit: 'm', threshold: 5.0 },
  { id: 'S003', name: 'Kedarnath AWS', type: 'RAINFALL', lat: 30.73, lng: 79.07, status: 'ONLINE', lastReading: 62.7, unit: 'mm/hr', threshold: 50 },
  { id: 'S004', name: 'Mandakini @ Rudraprayag', type: 'RIVER', lat: 30.28, lng: 78.98, status: 'WARNING', lastReading: 5.3, unit: 'm', threshold: 5.0 },
  { id: 'S005', name: 'Srinagar CWS', type: 'WEATHER', lat: 30.22, lng: 78.78, status: 'ONLINE', lastReading: 18.4, unit: '°C', threshold: 0 },
  { id: 'S006', name: 'Kali @ Dharchula', type: 'RIVER', lat: 29.85, lng: 80.53, status: 'ONLINE', lastReading: 3.1, unit: 'm', threshold: 4.5 },
  { id: 'S007', name: 'Munsiyari Soil Sensor', type: 'SOIL', lat: 30.06, lng: 80.24, status: 'ONLINE', lastReading: 78, unit: '% saturation', threshold: 80 },
  { id: 'S008', name: 'Kapkot AWS', type: 'RAINFALL', lat: 29.99, lng: 79.96, status: 'OFFLINE', lastReading: 0, unit: 'mm/hr', threshold: 50 },
];

// ── Shelters ─────────────────────────────────────────────────────────────
export const shelters = [
  { id: 'SH001', name: 'Joshimath Relief Camp', lat: 30.55, lng: 79.56, capacity: 500, occupancy: 187, type: 'PRIMARY', contactPhone: '+91-1389-222301' },
  { id: 'SH002', name: 'Gauchar School Shelter', lat: 30.27, lng: 79.18, capacity: 350, occupancy: 42, type: 'SECONDARY', contactPhone: '+91-1363-252210' },
  { id: 'SH003', name: 'Srinagar Polytechnic Camp', lat: 30.21, lng: 78.77, capacity: 800, occupancy: 210, type: 'PRIMARY', contactPhone: '+91-1346-252180' },
  { id: 'SH004', name: 'Rudraprayag Relief Center', lat: 30.27, lng: 78.97, capacity: 600, occupancy: 395, type: 'PRIMARY', contactPhone: '+91-1364-233101' },
  { id: 'SH005', name: 'Dharchula Community Hall', lat: 29.84, lng: 80.52, capacity: 280, occupancy: 88, type: 'SECONDARY', contactPhone: '+91-5964-222402' },
];

// ── Alerts ───────────────────────────────────────────────────────────────
export type AlertSeverity = 'RED' | 'ORANGE' | 'YELLOW' | 'GREEN';
export interface Alert {
  id: string;
  title: string;
  description: string;
  severity: AlertSeverity;
  location: string;
  timestamp: string;
  status: 'ACTIVE' | 'ACKNOWLEDGED' | 'RESOLVED';
  affectedPopulation: number;
  type: 'FLOOD' | 'LANDSLIDE' | 'HEAVY_RAIN' | 'RIVER_LEVEL';
}

export const alerts: Alert[] = [
  { id: 'A001', title: 'Extreme Flood Risk — Kedarnath Valley', description: 'Rainfall exceeding 60 mm/hr recorded at Kedarnath AWS. Mandakini River approaching critical levels. Immediate evacuation of low-lying settlements advised by local authorities.', severity: 'RED', location: 'Kedarnath, Rudraprayag', timestamp: '2026-09-02T06:15:00Z', status: 'ACTIVE', affectedPopulation: 4180, type: 'FLOOD' },
  { id: 'A002', title: 'Landslide Warning — Joshimath slopes', description: 'Soil moisture saturation >85% detected. Steep slope >30°. High probability of debris flow on NH-7 stretch near Joshimath in next 6 hours.', severity: 'RED', location: 'Joshimath, Chamoli', timestamp: '2026-09-02T05:48:00Z', status: 'ACTIVE', affectedPopulation: 4200, type: 'LANDSLIDE' },
  { id: 'A003', title: 'River Level Warning — Alaknanda', description: 'Alaknanda at Chamoli gauge has risen 1.2m in the last 3 hours. Approaching warning level (4.8m of 5.0m threshold).', severity: 'ORANGE', location: 'Chamoli, Uttarakhand', timestamp: '2026-09-02T04:30:00Z', status: 'ACTIVE', affectedPopulation: 12000, type: 'RIVER_LEVEL' },
  { id: 'A004', title: 'Heavy Rainfall Advisory — Munsiyari', description: 'IMD forecast indicates 50–70 mm rainfall expected over next 24 hours in Pithoragarh district. Pre-position rescue teams.', severity: 'ORANGE', location: 'Munsiyari, Pithoragarh', timestamp: '2026-09-02T03:00:00Z', status: 'ACKNOWLEDGED', affectedPopulation: 5100, type: 'HEAVY_RAIN' },
  { id: 'A005', title: 'Flash Flood Watch — Kapkot', description: 'Saryu River tributaries showing rapid rise. Monitor upstream conditions. Flash flood possible within 2–4 hours.', severity: 'YELLOW', location: 'Kapkot, Bageshwar', timestamp: '2026-09-02T02:15:00Z', status: 'ACTIVE', affectedPopulation: 3400, type: 'FLOOD' },
  { id: 'A006', title: 'Soil Saturation Alert — Munsiyari Ridge', description: 'Soil moisture sensors recording 78% saturation. Susceptible zone for shallow landslides. Avoid trekking routes.', severity: 'YELLOW', location: 'Munsiyari, Pithoragarh', timestamp: '2026-09-01T22:00:00Z', status: 'ACTIVE', affectedPopulation: 1200, type: 'LANDSLIDE' },
  { id: 'A007', title: 'All Clear — Devprayag', description: 'River levels receding. Gangetic section now below warning threshold. Situation under control.', severity: 'GREEN', location: 'Devprayag, Tehri Garhwal', timestamp: '2026-09-01T18:00:00Z', status: 'RESOLVED', affectedPopulation: 2900, type: 'FLOOD' },
];

// ── Data Sources ─────────────────────────────────────────────────────────
export const dataSources = [
  { id: 'DS001', name: 'IMD Rainfall API', type: 'METEOROLOGICAL', status: 'ACTIVE' as const, updateFreq: '15 min', lastUpdated: '2026-09-02T06:10:00Z', description: 'India Meteorological Department gridded rainfall data', latency: '8s', coverage: 'National' },
  { id: 'DS002', name: 'CWC River Level Network', type: 'HYDROLOGICAL', status: 'ACTIVE' as const, updateFreq: '1 hr', lastUpdated: '2026-09-02T06:00:00Z', description: 'Central Water Commission gauge station network', latency: '45s', coverage: 'Major Rivers' },
  { id: 'DS003', name: 'ISRO Bhuvan Satellite', type: 'SATELLITE', status: 'ACTIVE' as const, updateFreq: '6 hr', lastUpdated: '2026-09-02T03:00:00Z', description: 'ISRO Bhuvan multi-spectral satellite imagery', latency: '—', coverage: 'Pan-India' },
  { id: 'DS004', name: 'SASE Landslide Catalog', type: 'GEOTECHNICAL', status: 'WARNING' as const, updateFreq: '24 hr', lastUpdated: '2026-09-01T12:00:00Z', description: 'Snow and Avalanche Study Establishment slope-risk catalog', latency: '—', coverage: 'Himalayan Belt' },
  { id: 'DS005', name: 'NDMA Ground Truth Reports', type: 'FIELD_REPORTS', status: 'ACTIVE' as const, updateFreq: 'Real-time', lastUpdated: '2026-09-02T06:08:00Z', description: 'National Disaster Management Authority crowd-sourced field reports', latency: 'Variable', coverage: 'Disaster Zones' },
  { id: 'DS006', name: 'AWS Network (Local)', type: 'METEOROLOGICAL', status: 'WARNING' as const, updateFreq: '5 min', lastUpdated: '2026-09-02T05:55:00Z', description: 'Automated Weather Station local sensor network — Kapkot unit OFFLINE', latency: '2s', coverage: 'Uttarakhand' },
  { id: 'DS007', name: 'Bhukosh Geological Survey', type: 'GEOSPATIAL', status: 'ACTIVE' as const, updateFreq: 'Static', lastUpdated: '2026-08-15T00:00:00Z', description: 'GSI geological hazard susceptibility base layer', latency: '—', coverage: 'National' },
  { id: 'DS008', name: 'Soil Moisture Sensors (IoT)', type: 'SOIL_SENSORS', status: 'OFFLINE' as const, updateFreq: '10 min', lastUpdated: '2026-09-01T20:00:00Z', description: 'IoT soil moisture sensor network — partial outage due to power failure', latency: '1s', coverage: 'Pilot Districts' },
];

// ── Historical Events ─────────────────────────────────────────────────────
export const historicalEvents = [
  { year: 2013, district: 'Rudraprayag', rainfall: 312, deaths: 5748, displaced: 100000, affected: 250000, peakRiverLevel: 8.4, type: 'FLASH_FLOOD' },
  { year: 2016, district: 'Chamoli', rainfall: 189, deaths: 12, displaced: 4200, affected: 18000, peakRiverLevel: 6.2, type: 'LANDSLIDE' },
  { year: 2019, district: 'Pithoragarh', rainfall: 245, deaths: 34, displaced: 12000, affected: 45000, peakRiverLevel: 7.1, type: 'FLASH_FLOOD' },
  { year: 2021, district: 'Chamoli', rainfall: 178, deaths: 204, displaced: 6500, affected: 22000, peakRiverLevel: 6.8, type: 'GLACIAL_LAKE_OUTBURST' },
  { year: 2022, district: 'Tehri Garhwal', rainfall: 156, deaths: 8, displaced: 3100, affected: 14000, peakRiverLevel: 5.9, type: 'LANDSLIDE' },
  { year: 2023, district: 'Rudraprayag', rainfall: 198, deaths: 28, displaced: 8900, affected: 32000, peakRiverLevel: 7.3, type: 'FLASH_FLOOD' },
  { year: 2024, district: 'Bageshwar', rainfall: 221, deaths: 17, displaced: 5600, affected: 21000, peakRiverLevel: 6.5, type: 'FLASH_FLOOD' },
];

// ── Field Reports ─────────────────────────────────────────────────────────
export interface FieldReport {
  id: string;
  reporterName: string;
  reporterRole: string;
  location: string;
  lat: number;
  lng: number;
  description: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'UNVERIFIED' | 'CONFIRMED' | 'RESOLVED';
  timestamp: string;
  photoUrl?: string;
  linkedAlertId?: string;
}

export const fieldReports: FieldReport[] = [
  { id: 'FR001', reporterName: 'Prem Singh Negi', reporterRole: 'Village Head, Joshimath', location: 'NH-7 near Joshimath Chowk', lat: 30.555, lng: 79.572, description: 'Water flowing over NH-7 roadway. Depth approximately 30 cm. Several vehicles stranded. Flow increasing rapidly.', severity: 'CRITICAL', status: 'CONFIRMED', timestamp: '2026-09-02T05:52:00Z', linkedAlertId: 'A002' },
  { id: 'FR002', reporterName: 'Anita Rawat', reporterRole: 'SDRF Scout', location: 'Mandakini floodplain, Ukhimath', lat: 30.491, lng: 79.104, description: 'Left bank of Mandakini breached near old suspension bridge. Approximately 15 families need immediate evacuation.', severity: 'HIGH', status: 'CONFIRMED', timestamp: '2026-09-02T04:40:00Z', linkedAlertId: 'A001' },
  { id: 'FR003', reporterName: 'Deepak Bisht', reporterRole: 'Block Development Officer', location: 'Kapkot-Kafligair road', lat: 30.002, lng: 79.958, description: 'Retaining wall on Saryu tributary collapsed. Road blocked. No injuries yet. Debris flow risk from hill above.', severity: 'HIGH', status: 'UNVERIFIED', timestamp: '2026-09-02T03:15:00Z' },
  { id: 'FR004', reporterName: 'Rekha Devi', reporterRole: 'ASHA Worker', location: 'Gauchar market area', lat: 30.276, lng: 79.188, description: 'Minor flooding in ground-floor shops near river ghat. Shopkeepers moving goods upstairs. Not yet dangerous but rising.', severity: 'MEDIUM', status: 'CONFIRMED', timestamp: '2026-09-02T02:00:00Z' },
  { id: 'FR005', reporterName: 'Mahesh Rana', reporterRole: 'Gram Pradhan, Tharali', location: 'Pindar river crossing, Tharali', lat: 30.02, lng: 79.63, description: 'Pindar river level normal. No threat observed. Previous report of landslide was false alarm — only minor rock-fall.', severity: 'LOW', status: 'RESOLVED', timestamp: '2026-09-01T20:00:00Z' },
];

// ── Routes ────────────────────────────────────────────────────────────────
export const safeRoutes = [
  {
    id: 'R001',
    name: 'Primary Evacuation Route',
    from: 'Joshimath',
    to: 'Joshimath Relief Camp',
    shelterId: 'SH001',
    distance: 2.4,
    estimatedTime: 35,
    safetyScore: 82,
    riskScore: 'MODERATE' as RiskLevel,
    hazards: ['Minor water logging near temple chowk (0.3 km)', 'Reduced visibility due to fog'],
    color: '#22c55e',
    waypoints: [[30.565, 79.569], [30.560, 79.562], [30.555, 79.558]],
  },
  {
    id: 'R002',
    name: 'Alternative High Road',
    from: 'Joshimath',
    to: 'Joshimath Relief Camp',
    shelterId: 'SH001',
    distance: 3.8,
    estimatedTime: 55,
    safetyScore: 74,
    riskScore: 'HIGH' as RiskLevel,
    hazards: ['Hairpin section has debris on road km 2.1', 'Active landslide zone 500m off route'],
    color: '#f97316',
    waypoints: [[30.565, 79.572], [30.558, 79.566], [30.555, 79.558]],
  },
  {
    id: 'R003',
    name: 'Emergency Foot Path',
    from: 'Joshimath',
    to: 'Gauchar School Shelter',
    shelterId: 'SH002',
    distance: 18.2,
    estimatedTime: 240,
    safetyScore: 61,
    riskScore: 'HIGH' as RiskLevel,
    hazards: ['River crossing required at Km 9.4', 'No vehicle access', 'Night travel not recommended'],
    color: '#ef4444',
    waypoints: [[30.565, 79.572], [30.50, 79.45], [30.276, 79.188]],
  },
];

// ── Time series generators ────────────────────────────────────────────────
export function generateRainfallTimeSeries(hours = 24, baseline = 12, heavy = false) {
  return Array.from({ length: hours }, (_, i) => {
    const base = heavy ? 40 : baseline;
    const spike = heavy && i > 16 ? 30 : 0;
    const noise = (Math.random() - 0.5) * 8;
    return {
      time: `${String(i).padStart(2, '0')}:00`,
      value: Math.max(0, base + spike + noise),
      cumulative: (base + spike / 2) * i,
    };
  });
}

export function generateRiverTimeSeries(hours = 24, baseline = 2.8, heavy = false) {
  return Array.from({ length: hours }, (_, i) => {
    const rise = heavy && i > 14 ? (i - 14) * 0.18 : 0;
    const noise = (Math.random() - 0.5) * 0.15;
    return {
      time: `${String(i).padStart(2, '0')}:00`,
      level: Math.max(0.5, baseline + rise + noise),
      warning: 5.0,
      danger: 6.5,
    };
  });
}

export function generateSoilMoistureTimeSeries(hours = 24) {
  return Array.from({ length: hours }, (_, i) => ({
    time: `${String(i).padStart(2, '0')}:00`,
    value: Math.min(100, 55 + i * 1.1 + (Math.random() - 0.3) * 4),
    threshold: 80,
  }));
}

export function generateMonthlyRainfallData() {
  return [
    { month: 'Jan', rainfall: 28, avg: 32 },
    { month: 'Feb', rainfall: 42, avg: 38 },
    { month: 'Mar', rainfall: 38, avg: 44 },
    { month: 'Apr', rainfall: 56, avg: 52 },
    { month: 'May', rainfall: 98, avg: 88 },
    { month: 'Jun', rainfall: 245, avg: 210 },
    { month: 'Jul', rainfall: 412, avg: 380 },
    { month: 'Aug', rainfall: 389, avg: 355 },
    { month: 'Sep', rainfall: 198, avg: 185 },
    { month: 'Oct', rainfall: 72, avg: 68 },
    { month: 'Nov', rainfall: 18, avg: 22 },
    { month: 'Dec', rainfall: 12, avg: 15 },
  ];
}

export function generate5DayForecast() {
  const days = ['Today', 'Thu Sep 3', 'Fri Sep 4', 'Sat Sep 5', 'Sun Sep 6'];
  const conditions = ['Extreme Rain', 'Heavy Rain', 'Heavy Rain', 'Moderate Rain', 'Partly Cloudy'];
  const highs = [62, 54, 48, 32, 18];
  const lows = [38, 28, 24, 12, 4];
  return days.map((day, i) => ({
    day,
    condition: conditions[i],
    high: highs[i],
    low: lows[i],
    icon: i < 3 ? 'storm' : i === 3 ? 'rain' : 'cloud',
  }));
}

export function generateRiskTimelineData() {
  return Array.from({ length: 24 }, (_, i) => ({
    time: `${String(i).padStart(2, '0')}:00`,
    flood: Math.max(10, 45 + (i > 16 ? (i - 16) * 4 : 0) + (Math.random() - 0.5) * 8),
    landslide: Math.max(5, 38 + (i > 18 ? (i - 18) * 3.5 : 0) + (Math.random() - 0.5) * 5),
  }));
}

// ── Notifications log ──────────────────────────────────────────────────────
export interface NotificationLog {
  id: string;
  channel: 'SMS' | 'EMAIL' | 'WHATSAPP' | 'PUSH';
  recipient: string;
  message: string;
  status: 'SENT' | 'DELIVERED' | 'FAILED';
  alertId: string;
  timestamp: string;
}

export const notificationLogs: NotificationLog[] = [
  { id: 'NL001', channel: 'SMS', recipient: '+91-98765-XXXXX (Joshimath Village Head)', message: '[PROTOTYPE - NOT OFFICIAL] RED ALERT: Flood risk EXTREME at Joshimath. Move to designated shelter immediately.', status: 'DELIVERED', alertId: 'A001', timestamp: '2026-09-02T06:16:00Z' },
  { id: 'NL002', channel: 'WHATSAPP', recipient: 'Chamoli District Emergency Group (243 members)', message: '[PROTOTYPE - NOT OFFICIAL] ⚠️ Landslide WARNING: NH-7 near Joshimath. Avoid road travel. Shelter at Joshimath Relief Camp.', status: 'DELIVERED', alertId: 'A002', timestamp: '2026-09-02T05:50:00Z' },
  { id: 'NL003', channel: 'EMAIL', recipient: 'Chamoli DM Office', message: '[PROTOTYPE - NOT OFFICIAL] Alert briefing: Alaknanda river approaching warning level. Situation report attached.', status: 'DELIVERED', alertId: 'A003', timestamp: '2026-09-02T04:31:00Z' },
  { id: 'NL004', channel: 'PUSH', recipient: 'All FloodGuard App Users — Chamoli, Rudraprayag', message: '[PROTOTYPE - NOT OFFICIAL] Heavy rain advisory. Stay indoors. Monitor official government channels.', status: 'SENT', alertId: 'A004', timestamp: '2026-09-02T03:01:00Z' },
  { id: 'NL005', channel: 'SMS', recipient: '+91-94120-XXXXX (Munsiyari SDM)', message: '[PROTOTYPE - NOT OFFICIAL] ORANGE ALERT: Munsiyari — 50–70mm rain expected next 24h. Pre-position rescue teams.', status: 'DELIVERED', alertId: 'A004', timestamp: '2026-09-02T03:02:00Z' },
];

// ── Prediction versions ────────────────────────────────────────────────────
export const predictionVersions = [
  { version: 'v4', timestamp: '2026-09-02T06:00:00Z', floodProb: 0.93, riskLevel: 'EXTREME' as RiskLevel, confidence: 87, dataInputs: ['IMD +6hr forecast', 'CWC live levels', 'ISRO SAR', 'Soil sensors'], notes: 'Kedarnath valley — post-24h cumulative 312mm trigger' },
  { version: 'v3', timestamp: '2026-09-02T03:00:00Z', floodProb: 0.78, riskLevel: 'VERY HIGH' as RiskLevel, confidence: 81, dataInputs: ['IMD +6hr forecast', 'CWC live levels', 'Satellite'], notes: 'River levels rising sharply. Forecast input update.' },
  { version: 'v2', timestamp: '2026-09-01T21:00:00Z', floodProb: 0.61, riskLevel: 'HIGH' as RiskLevel, confidence: 74, dataInputs: ['IMD +12hr forecast', 'CWC levels'], notes: 'Evening model run — IMD forecast deteriorated.' },
  { version: 'v1', timestamp: '2026-09-01T12:00:00Z', floodProb: 0.34, riskLevel: 'MODERATE' as RiskLevel, confidence: 69, dataInputs: ['IMD +24hr forecast', 'Climatology'], notes: 'Morning baseline run.' },
];

// ── Global state for demo/simulation ─────────────────────────────────────
export type AppMode = 'NORMAL' | 'HEAVY_RAIN_EVENT';

export interface DemoState {
  mode: AppMode;
  offlineSource: string | null;
  language: 'EN' | 'HI';
  fieldReports: FieldReport[];
}

export const DEMO_LABELS: Record<string, string> = {
  dashboard: 'Dashboard',
  'live-monitoring': 'Live Monitoring',
  'risk-map': 'Risk Map',
  'ai-prediction': 'AI Prediction',
  'explainable-ai': 'Explainable AI',
  'vulnerable-areas': 'Vulnerable Areas',
  'alerts': 'Alerts & Warnings',
  'safe-routes': 'Safe Routes',
  'flood-simulator': 'Flood Simulator',
  'satellite': 'Satellite Monitoring',
  'historical': 'Historical Analysis',
  'reports': 'Reports',
  'data-sources': 'Data Sources',
  'settings': 'Settings',
  'help': 'Help & Support',
  'field-reports': 'Field Reports',
};
