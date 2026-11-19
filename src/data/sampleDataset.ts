// Demonstration Field Sample Dataset for Bengkulu Province Coastal Zone
// Ground-truth reference samples with spectral index signatures (CMRI, MVI, NDMI)
// All data points are realistic demonstration samples modeled after Bengkulu coastal surveys.

import { SamplePoint } from '../types/classification';

export const DEMO_FIELD_SAMPLES: SamplePoint[] = [
  // ── 1. Pulau Baai & Teluk Sepang (Kota Bengkulu) ───────────────────────────
  { sample_id: 'BKL-PB-001', CMRI: 0.72, MVI: 5.12, NDMI: 0.45, class: 'mangrove', location: 'Pulau Baai Zona Inti', lat: -3.8967, lng: 102.2965 },
  { sample_id: 'BKL-PB-002', CMRI: 0.68, MVI: 4.88, NDMI: 0.41, class: 'mangrove', location: 'Pulau Baai Estuari', lat: -3.8980, lng: 102.2972 },
  { sample_id: 'BKL-PB-003', CMRI: 0.75, MVI: 5.40, NDMI: 0.48, class: 'mangrove', location: 'Pulau Baai Konservasi', lat: -3.8950, lng: 102.2950 },
  { sample_id: 'BKL-PB-004', CMRI: 0.61, MVI: 4.35, NDMI: 0.38, class: 'mangrove', location: 'Pulau Baai Tepi Kanal', lat: -3.9010, lng: 102.2990 },
  { sample_id: 'BKL-PB-005', CMRI: 0.58, MVI: 4.10, NDMI: 0.35, class: 'mangrove', location: 'Pulau Baai Fringe', lat: -3.8930, lng: 102.2940 },
  { sample_id: 'BKL-PB-006', CMRI: 0.22, MVI: 1.80, NDMI: 0.12, class: 'non_mangrove', location: 'Pelabuhan Pulau Baai', lat: -3.8900, lng: 102.3020 },
  { sample_id: 'BKL-PB-007', CMRI: 0.15, MVI: 1.45, NDMI: 0.08, class: 'non_mangrove', location: 'Gudang Batubara Baai', lat: -3.8870, lng: 102.3050 },
  { sample_id: 'BKL-PB-008', CMRI: 0.31, MVI: 2.15, NDMI: 0.19, class: 'non_mangrove', location: 'Semak Belukar Baai', lat: -3.8850, lng: 102.2980 },
  { sample_id: 'BKL-PB-009', CMRI: 0.42, MVI: 2.95, NDMI: 0.24, class: 'mangrove', location: 'Teluk Sepang Muara', lat: -3.9241, lng: 102.2815 },
  { sample_id: 'BKL-PB-010', CMRI: 0.38, MVI: 2.70, NDMI: 0.21, class: 'mangrove', location: 'Teluk Sepang Mangrove Rendah', lat: -3.9260, lng: 102.2830 },
  { sample_id: 'BKL-PB-011', CMRI: 0.18, MVI: 1.60, NDMI: 0.09, class: 'non_mangrove', location: 'Pantai Pasir Teluk Sepang', lat: -3.9290, lng: 102.2790 },
  { sample_id: 'BKL-PB-012', CMRI: 0.25, MVI: 1.95, NDMI: 0.15, class: 'non_mangrove', location: 'Pemukiman Teluk Sepang', lat: -3.9210, lng: 102.2870 },

  // ── 2. Sungai Hitam (Bengkulu Tengah) ───────────────────────────────────────
  { sample_id: 'BKL-SH-013', CMRI: 0.65, MVI: 4.60, NDMI: 0.39, class: 'mangrove', location: 'Sungai Hitam Rawa Asli', lat: -3.7214, lng: 102.2189 },
  { sample_id: 'BKL-SH-014', CMRI: 0.54, MVI: 3.85, NDMI: 0.32, class: 'mangrove', location: 'Sungai Hitam Muara', lat: -3.7230, lng: 102.2205 },
  { sample_id: 'BKL-SH-015', CMRI: 0.59, MVI: 4.15, NDMI: 0.36, class: 'mangrove', location: 'Sungai Hitam Delta', lat: -3.7190, lng: 102.2170 },
  { sample_id: 'BKL-SH-016', CMRI: 0.49, MVI: 3.40, NDMI: 0.28, class: 'mangrove', location: 'Sungai Hitam Transisi', lat: -3.7250, lng: 102.2220 },
  { sample_id: 'BKL-SH-017', CMRI: 0.29, MVI: 2.30, NDMI: 0.18, class: 'non_mangrove', location: 'Kebun Kelapa Sawit Pesisir', lat: -3.7150, lng: 102.2260 },
  { sample_id: 'BKL-SH-018', CMRI: 0.33, MVI: 2.50, NDMI: 0.22, class: 'non_mangrove', location: 'Vegetasi Riparian Tawar', lat: -3.7120, lng: 102.2280 },
  { sample_id: 'BKL-SH-019', CMRI: 0.12, MVI: 1.25, NDMI: 0.05, class: 'non_mangrove', location: 'Badan Air Sungai Hitam', lat: -3.7220, lng: 102.2195 },
  { sample_id: 'BKL-SH-020', CMRI: 0.21, MVI: 1.75, NDMI: 0.11, class: 'non_mangrove', location: 'Lahan Terbuka Abrasi', lat: -3.7270, lng: 102.2160 },

  // ── 3. Air Rami & Teramang (Mukomuko) ───────────────────────────────────────
  { sample_id: 'BKL-MM-021', CMRI: 0.78, MVI: 5.65, NDMI: 0.52, class: 'mangrove', location: 'Pesisir Air Rami Kerapatan Tinggi', lat: -3.1256, lng: 101.5642 },
  { sample_id: 'BKL-MM-022', CMRI: 0.74, MVI: 5.30, NDMI: 0.49, class: 'mangrove', location: 'Muara Teramang Alami', lat: -3.1230, lng: 101.5620 },
  { sample_id: 'BKL-MM-023', CMRI: 0.71, MVI: 5.05, NDMI: 0.46, class: 'mangrove', location: 'Laguna Air Rami', lat: -3.1280, lng: 101.5670 },
  { sample_id: 'BKL-MM-024', CMRI: 0.66, MVI: 4.70, NDMI: 0.42, class: 'mangrove', location: 'Zonasi Bruguiera Air Rami', lat: -3.1200, lng: 101.5600 },
  { sample_id: 'BKL-MM-025', CMRI: 0.63, MVI: 4.45, NDMI: 0.39, class: 'mangrove', location: 'Tambak Mangrove Teramang', lat: -3.1310, lng: 101.5700 },
  { sample_id: 'BKL-MM-026', CMRI: 0.28, MVI: 2.20, NDMI: 0.17, class: 'non_mangrove', location: 'Perkebunan Sawit Teramang', lat: -3.1180, lng: 101.5750 },
  { sample_id: 'BKL-MM-027', CMRI: 0.24, MVI: 1.90, NDMI: 0.14, class: 'non_mangrove', location: 'Lahan Pasir Pantai Air Rami', lat: -3.1340, lng: 101.5580 },
  { sample_id: 'BKL-MM-028', CMRI: 0.35, MVI: 2.65, NDMI: 0.23, class: 'non_mangrove', location: 'Hutan Pantai Casuarina', lat: -3.1360, lng: 101.5590 },
  { sample_id: 'BKL-MM-029', CMRI: 0.16, MVI: 1.40, NDMI: 0.07, class: 'non_mangrove', location: 'Muara Sungai Berbatu', lat: -3.1240, lng: 101.5570 },
  { sample_id: 'BKL-MM-030', CMRI: 0.20, MVI: 1.65, NDMI: 0.10, class: 'non_mangrove', location: 'Jalan Lintas Barat Sumatera', lat: -3.1150, lng: 101.5780 },

  // ── 4. Linau & Way Hawang (Kaur) ───────────────────────────────────────────
  { sample_id: 'BKL-KR-031', CMRI: 0.67, MVI: 4.75, NDMI: 0.41, class: 'mangrove', location: 'Laguna Linau Konservasi', lat: -4.7821, lng: 103.3512 },
  { sample_id: 'BKL-KR-032', CMRI: 0.62, MVI: 4.30, NDMI: 0.37, class: 'mangrove', location: 'Way Hawang Rawa Mangrove', lat: -4.7840, lng: 103.3530 },
  { sample_id: 'BKL-KR-033', CMRI: 0.58, MVI: 4.05, NDMI: 0.34, class: 'mangrove', location: 'Pesisir Linau Ceriops', lat: -4.7800, lng: 103.3490 },
  { sample_id: 'BKL-KR-034', CMRI: 0.51, MVI: 3.55, NDMI: 0.30, class: 'mangrove', location: 'Linau Sempadan Muara', lat: -4.7860, lng: 103.3550 },
  { sample_id: 'BKL-KR-035', CMRI: 0.19, MVI: 1.55, NDMI: 0.09, class: 'non_mangrove', location: 'Pantai Linau Karang', lat: -4.7880, lng: 103.3480 },
  { sample_id: 'BKL-KR-036', CMRI: 0.27, MVI: 2.10, NDMI: 0.16, class: 'non_mangrove', location: 'Perkampungan Nelayan Linau', lat: -4.7780, lng: 103.3560 },
  { sample_id: 'BKL-KR-037', CMRI: 0.34, MVI: 2.55, NDMI: 0.21, class: 'non_mangrove', location: 'Kebun Campuran Bukit Linau', lat: -4.7750, lng: 103.3590 },
  { sample_id: 'BKL-KR-038', CMRI: 0.11, MVI: 1.20, NDMI: 0.04, class: 'non_mangrove', location: 'Perairan Dangkal Linau', lat: -4.7850, lng: 103.3460 },

  // ── 5. Muara Kinal & Pino Guntung (Bengkulu Selatan) ─────────────────────────
  { sample_id: 'BKL-BS-039', CMRI: 0.44, MVI: 3.10, NDMI: 0.25, class: 'mangrove', location: 'Muara Kinal Terdegradasi', lat: -4.4532, lng: 102.8941 },
  { sample_id: 'BKL-BS-040', CMRI: 0.41, MVI: 2.85, NDMI: 0.23, class: 'mangrove', location: 'Pino Guntung Nypa Fringe', lat: -4.4550, lng: 102.8960 },
  { sample_id: 'BKL-BS-041', CMRI: 0.36, MVI: 2.60, NDMI: 0.20, class: 'mangrove', location: 'Kinal Regenerasi Muda', lat: -4.4510, lng: 102.8920 },
  { sample_id: 'BKL-BS-042', CMRI: 0.30, MVI: 2.25, NDMI: 0.18, class: 'non_mangrove', location: 'Sawah Pasang Surut Kinal', lat: -4.4480, lng: 102.8980 },
  { sample_id: 'BKL-BS-043', CMRI: 0.23, MVI: 1.80, NDMI: 0.13, class: 'non_mangrove', location: 'Bekas Tambak Telantar', lat: -4.4570, lng: 102.8990 },
  { sample_id: 'BKL-BS-044', CMRI: 0.14, MVI: 1.35, NDMI: 0.06, class: 'non_mangrove', location: 'Gosong Pasir Muara Kinal', lat: -4.4560, lng: 102.8900 },

  // ── 6. Sampel Uji Ekstra (Tambahan Keragaman Fitur) ──────────────────────────
  { sample_id: 'BKL-EX-045', CMRI: 0.70, MVI: 4.95, NDMI: 0.43, class: 'mangrove', location: 'Rawa Bakau Alami', lat: -3.8945, lng: 102.2960 },
  { sample_id: 'BKL-EX-046', CMRI: 0.64, MVI: 4.40, NDMI: 0.38, class: 'mangrove', location: 'Avicennia Kanopi Rapat', lat: -3.7205, lng: 102.2190 },
  { sample_id: 'BKL-EX-047', CMRI: 0.55, MVI: 3.90, NDMI: 0.33, class: 'mangrove', location: 'Rhizophora Transisi', lat: -3.1270, lng: 101.5650 },
  { sample_id: 'BKL-EX-048', CMRI: 0.46, MVI: 3.20, NDMI: 0.27, class: 'mangrove', location: 'Sonneratia Muara Estuari', lat: -4.7810, lng: 103.3500 },
  { sample_id: 'BKL-EX-049', CMRI: 0.26, MVI: 2.05, NDMI: 0.15, class: 'non_mangrove', location: 'Lahan Semak Pantai', lat: -3.8860, lng: 102.3010 },
  { sample_id: 'BKL-EX-050', CMRI: 0.17, MVI: 1.50, NDMI: 0.08, class: 'non_mangrove', location: 'Sedimen Terbuka Muara', lat: -3.7260, lng: 102.2180 },
  { sample_id: 'BKL-EX-051', CMRI: 0.32, MVI: 2.40, NDMI: 0.20, class: 'non_mangrove', location: 'Agroforestri Pesisir', lat: -3.1210, lng: 101.5720 },
  { sample_id: 'BKL-EX-052', CMRI: 0.22, MVI: 1.70, NDMI: 0.11, class: 'non_mangrove', location: 'Pematang Tambak Kering', lat: -4.4520, lng: 102.8970 },
  { sample_id: 'BKL-EX-053', CMRI: 0.76, MVI: 5.45, NDMI: 0.47, class: 'mangrove', location: 'Rhizophora Koloni Tua', lat: -3.8975, lng: 102.2980 },
  { sample_id: 'BKL-EX-054', CMRI: 0.13, MVI: 1.30, NDMI: 0.06, class: 'non_mangrove', location: 'Perairan Muara Payau', lat: -3.8995, lng: 102.2930 },
  { sample_id: 'BKL-EX-055', CMRI: 0.69, MVI: 4.80, NDMI: 0.40, class: 'mangrove', location: 'Bruguiera Kanopi Tinggi', lat: -3.1290, lng: 101.5680 },
  { sample_id: 'BKL-EX-056', CMRI: 0.28, MVI: 2.15, NDMI: 0.16, class: 'non_mangrove', location: 'Jalan Pasir Dermaga', lat: -4.7830, lng: 103.3540 },
  { sample_id: 'BKL-EX-057', CMRI: 0.57, MVI: 4.00, NDMI: 0.35, class: 'mangrove', location: 'Avicennia Tengah Laguna', lat: -3.7225, lng: 102.2215 },
  { sample_id: 'BKL-EX-058', CMRI: 0.30, MVI: 2.35, NDMI: 0.19, class: 'non_mangrove', location: 'Tegakan Kelapa Pesisir', lat: -4.4540, lng: 102.8950 },
  { sample_id: 'BKL-EX-059', CMRI: 0.73, MVI: 5.20, NDMI: 0.44, class: 'mangrove', location: 'Konservasi Mangrove Bengkulu', lat: -3.8955, lng: 102.2970 },
  { sample_id: 'BKL-EX-060', CMRI: 0.15, MVI: 1.40, NDMI: 0.07, class: 'non_mangrove', location: 'Garis Pantai Terbuka', lat: -3.9270, lng: 102.2800 },
];

// Helper to convert dataset to standard CSV format
export const generateDemoCsv = (): string => {
  const headers = ['sample_id', 'CMRI', 'MVI', 'NDMI', 'class'];
  const rows = DEMO_FIELD_SAMPLES.map(s => `${s.sample_id},${s.CMRI.toFixed(2)},${s.MVI.toFixed(2)},${s.NDMI.toFixed(2)},${s.class}`);
  return [headers.join(','), ...rows].join('\n');
};
