// GeoJSON demonstration data for Bengkulu mangrove zones
// All polygons are APPROXIMATE bounding areas — NOT results of satellite classification.
// Real GeoJSON from GIS processing can replace these placeholder geometries.

export type MangroveFeatureProperties = {
  id: string;
  name: string;
  kabupaten: string;
  status: 'Kerapatan Tinggi' | 'Kerapatan Sedang' | 'Kerapatan Rendah' | 'Terdegradasi';
  areaHa: number;
  healthScore: number;
  dominantSpecies: string;
  cmri: number;
  mvi: number;
  ndmi: number;
  isSimulated: true;
  dataSource: 'demonstration';
  note: string;
};

export type MangroveGeoJSON = {
  type: 'FeatureCollection';
  metadata: {
    description: string;
    crs: string;
    generatedAt: string;
    isSimulated: true;
  };
  features: {
    type: 'Feature';
    geometry: { type: 'Polygon'; coordinates: number[][][] };
    properties: MangroveFeatureProperties;
  }[];
};

// Helper: build a rough rectangular polygon around a center point
const rect = (lat: number, lng: number, dlat = 0.04, dlng = 0.05): number[][][] => [[
  [lng - dlng, lat - dlat],
  [lng + dlng, lat - dlat],
  [lng + dlng, lat + dlat],
  [lng - dlng, lat + dlat],
  [lng - dlng, lat - dlat],
]];

export const MANGROVE_GEOJSON: MangroveGeoJSON = {
  type: 'FeatureCollection',
  metadata: {
    description: 'Demonstrasi area mangrove Provinsi Bengkulu — bukan hasil klasifikasi citra aktual',
    crs: 'EPSG:4326 (WGS84)',
    generatedAt: '2026-11-19',
    isSimulated: true,
  },
  features: [
    {
      type: 'Feature',
      geometry: { type: 'Polygon', coordinates: rect(-3.8967, 102.2965, 0.025, 0.030) },
      properties: {
        id: 'zone-baai',
        name: 'Kawasan Konservasi Pulau Baai',
        kabupaten: 'Kota Bengkulu',
        status: 'Kerapatan Tinggi',
        areaHa: 247.5,
        healthScore: 78,
        dominantSpecies: 'Rhizophora apiculata & Avicennia marina',
        cmri: 0.68, mvi: 4.85, ndmi: 0.42,
        isSimulated: true,
        dataSource: 'demonstration',
        note: 'Poligon demonstrasi — batas aktual perlu diverifikasi via survei lapangan dan klasifikasi GEE',
      },
    },
    {
      type: 'Feature',
      geometry: { type: 'Polygon', coordinates: rect(-3.7214, 102.2189, 0.018, 0.022) },
      properties: {
        id: 'zone-hitam',
        name: 'Estuari Sungai Hitam',
        kabupaten: 'Bengkulu Tengah',
        status: 'Kerapatan Sedang',
        areaHa: 89.2,
        healthScore: 61,
        dominantSpecies: 'Sonneratia alba & Rhizophora mucronata',
        cmri: 0.52, mvi: 3.42, ndmi: 0.31,
        isSimulated: true,
        dataSource: 'demonstration',
        note: 'Poligon demonstrasi — batas aktual perlu diverifikasi',
      },
    },
    {
      type: 'Feature',
      geometry: { type: 'Polygon', coordinates: rect(-3.1256, 101.5642, 0.030, 0.035) },
      properties: {
        id: 'zone-rami',
        name: 'Pesisir Air Rami & Teramang',
        kabupaten: 'Mukomuko',
        status: 'Kerapatan Tinggi',
        areaHa: 178.4,
        healthScore: 84,
        dominantSpecies: 'Rhizophora stylosa & Bruguiera gymnorrhiza',
        cmri: 0.74, mvi: 5.21, ndmi: 0.49,
        isSimulated: true,
        dataSource: 'demonstration',
        note: 'Poligon demonstrasi — batas aktual perlu diverifikasi',
      },
    },
    {
      type: 'Feature',
      geometry: { type: 'Polygon', coordinates: rect(-3.9241, 102.2815, 0.012, 0.015) },
      properties: {
        id: 'zone-sepang',
        name: 'Pesisir Teluk Sepang',
        kabupaten: 'Kota Bengkulu',
        status: 'Kerapatan Rendah',
        areaHa: 63.8,
        healthScore: 48,
        dominantSpecies: 'Avicennia alba',
        cmri: 0.38, mvi: 2.15, ndmi: 0.19,
        isSimulated: true,
        dataSource: 'demonstration',
        note: 'Poligon demonstrasi — batas aktual perlu diverifikasi',
      },
    },
    {
      type: 'Feature',
      geometry: { type: 'Polygon', coordinates: rect(-4.7821, 103.3512, 0.022, 0.028) },
      properties: {
        id: 'zone-linau',
        name: 'Laguna Linau & Way Hawang',
        kabupaten: 'Kaur',
        status: 'Kerapatan Sedang',
        areaHa: 132.0,
        healthScore: 72,
        dominantSpecies: 'Rhizophora apiculata & Ceriops tagal',
        cmri: 0.63, mvi: 4.12, ndmi: 0.38,
        isSimulated: true,
        dataSource: 'demonstration',
        note: 'Poligon demonstrasi — batas aktual perlu diverifikasi',
      },
    },
    {
      type: 'Feature',
      geometry: { type: 'Polygon', coordinates: rect(-4.4532, 102.8941, 0.014, 0.018) },
      properties: {
        id: 'zone-kinal',
        name: 'Muara Kinal & Pino Guntung',
        kabupaten: 'Bengkulu Selatan',
        status: 'Terdegradasi',
        areaHa: 45.3,
        healthScore: 39,
        dominantSpecies: 'Nypa fruticans & Avicennia',
        cmri: 0.28, mvi: 1.82, ndmi: 0.14,
        isSimulated: true,
        dataSource: 'demonstration',
        note: 'Poligon demonstrasi — batas aktual perlu diverifikasi',
      },
    },
  ],
};

// Community report markers
export const REPORT_MARKERS = [
  { id: 'RPT-001', lat: -3.8992, lng: 102.2981, category: 'Pencemaran Limbah', kabupaten: 'Kota Bengkulu', status: 'Terverifikasi', date: '14 Nov 2026' },
  { id: 'RPT-002', lat: -3.7250, lng: 102.2210, category: 'Abrasi Garis Pantai', kabupaten: 'Bengkulu Tengah', status: 'Tindak Lanjut', date: '12 Nov 2026' },
  { id: 'RPT-003', lat: -3.1280, lng: 101.5620, category: 'Restorasi / Bibit Baru', kabupaten: 'Mukomuko', status: 'Selesai', date: '8 Nov 2026' },
  { id: 'RPT-004', lat: -3.9210, lng: 102.2850, category: 'Penebangan Liar', kabupaten: 'Kota Bengkulu', status: 'Menunggu Verifikasi', date: '2 Nov 2026' },
];

// Sentinel-2 band configuration (architecture stub — not yet integrated with GEE)
export const SENTINEL2_CONFIG = {
  dataset: 'COPERNICUS/S2_SR_HARMONIZED',
  bands: {
    B2: { name: 'Blue', wavelength: '490 nm', resolution: '10 m', use: 'True Color, water depth' },
    B3: { name: 'Green', wavelength: '560 nm', resolution: '10 m', use: 'True Color, vegetation' },
    B4: { name: 'Red', wavelength: '665 nm', resolution: '10 m', use: 'True Color, chlorophyll' },
    B8: { name: 'NIR', wavelength: '842 nm', resolution: '10 m', use: 'CMRI, MVI, NDMI, vegetation health' },
    B11: { name: 'SWIR-1', wavelength: '1610 nm', resolution: '20 m', use: 'MVI, NDMI, canopy moisture' },
    B12: { name: 'SWIR-2', wavelength: '2190 nm', resolution: '20 m', use: 'Soil moisture, burned area' },
  },
  visualizations: {
    trueColor: { bands: ['B4', 'B3', 'B2'], description: 'Natural color composite (RGB)' },
    falseColor: { bands: ['B8', 'B4', 'B3'], description: 'False color NIR — vegetation appears red' },
    mangrove: { bands: ['B8', 'B11', 'B4'], description: 'Mangrove-enhanced composite' },
    moisture: { bands: ['B8', 'B11', 'B12'], description: 'Moisture sensitivity composite' },
  },
  geeStatus: 'not_connected' as const,
  requiredSetup: ['Google Cloud Project', 'GEE Service Account', 'API Key / OAuth2', 'GEE Python/JS API'],
};

// Kabupaten/kota in Bengkulu
export const BENGKULU_KABUPATENS = [
  { id: 'all', name: 'Seluruh Provinsi Bengkulu', center: [-3.5, 102.0] as [number, number], zoom: 9 },
  { id: 'kota-bengkulu', name: 'Kota Bengkulu', center: [-3.86, 102.27] as [number, number], zoom: 12 },
  { id: 'bengkulu-tengah', name: 'Bengkulu Tengah', center: [-3.72, 102.22] as [number, number], zoom: 11 },
  { id: 'mukomuko', name: 'Mukomuko', center: [-3.13, 101.56] as [number, number], zoom: 11 },
  { id: 'bengkulu-selatan', name: 'Bengkulu Selatan', center: [-4.45, 102.89] as [number, number], zoom: 11 },
  { id: 'kaur', name: 'Kaur', center: [-4.78, 103.35] as [number, number], zoom: 11 },
];
