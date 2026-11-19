// TypeScript definitions for Peta Hidup Mangrove

export type NavItem = {
  name: string;
  path: string;
  icon: string;
  badge?: string;
  description?: string;
};

export type MangroveZone = {
  id: string;
  name: string;
  kabupaten: string;
  coordinates: [number, number];
  areaHectares: number;
  healthScore: number; // 0-100
  dominantSpecies: string;
  status: 'Kerapatan Tinggi' | 'Kerapatan Sedang' | 'Kerapatan Rendah' | 'Terdegradasi';
  cmriScore: number;
  mviScore: number;
  ndmiScore: number;
  isSimulated: boolean;
};

export type SpectralIndexData = {
  index: 'CMRI' | 'MVI' | 'NDMI';
  fullName: string;
  formula: string;
  purpose: string;
  meanValue: number;
  healthyRange: string;
  sentinelBands: string[];
  historicalTrend: { year: number; value: number }[];
  isSimulated: boolean;
};

export type TemporalCoverage = {
  year: number;
  totalAreaHa: number;
  denseAreaHa: number;
  moderateAreaHa: number;
  sparseAreaHa: number;
  degradedAreaHa: number;
  lossGainHa: number;
  isSimulated: boolean;
};

export type ClassificationMetric = {
  className: string;
  precision: number;
  recall: number;
  f1Score: number;
  trainingSamples: number;
  isSimulated: boolean;
};

export type CommunityReport = {
  id: string;
  reporterName: string;
  role: 'Masyarakat' | 'Nelayan' | 'Peneliti' | 'Mahasiswa' | 'Pokdarwis';
  locationName: string;
  kabupaten: string;
  coordinates: string;
  date: string;
  category: 'Penebangan Liar' | 'Pencemaran Limbah' | 'Abrasi Garis Pantai' | 'Restorasi / Bibit Baru' | 'Kematian Pohon';
  description: string;
  status: 'Menunggu Verifikasi' | 'Terverifikasi' | 'Tindak Lanjut' | 'Selesai';
  isSimulated: boolean;
};

export type EducationModule = {
  id: string;
  title: string;
  category: 'Ekologi' | 'Penginderaan Jauh' | 'Kecerdasan Buatan' | 'Konservasi';
  readTime: string;
  summary: string;
  points: string[];
};
