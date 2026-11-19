// Community Report types — Full lifecycle from submission to resolution

export type ReporterCategory =
  | 'Masyarakat Pesisir'
  | 'Komunitas Lingkungan'
  | 'Mahasiswa'
  | 'Relawan'
  | 'Lainnya';

export type ReportCategory =
  | 'Indikasi Penebangan Mangrove'
  | 'Alih Fungsi Lahan'
  | 'Sampah dan Pencemaran'
  | 'Kerusakan Vegetasi'
  | 'Abrasi Pesisir'
  | 'Kegiatan Rehabilitasi'
  | 'Kondisi Perlu Diperiksa'
  | 'Lainnya';

export type ReportStatus =
  | 'Submitted'
  | 'Under Review'
  | 'Verified'
  | 'Resolved';

export type Kabupaten =
  | 'Kota Bengkulu'
  | 'Bengkulu Tengah'
  | 'Bengkulu Utara'
  | 'Bengkulu Selatan'
  | 'Mukomuko'
  | 'Kaur'
  | 'Seluma'
  | 'Kepahiang'
  | 'Rejang Lebong'
  | 'Lebong'
  | 'Lainnya';

export interface StatusTimelineEntry {
  status: ReportStatus;
  timestamp: string;        // ISO 8601
  note: string;
  actorLabel: string;       // e.g. "Sistem", "Tim Verifikasi"
}

export interface CommunityReportFull {
  report_id: string;
  reporter_name: string;
  reporter_category: ReporterCategory;
  contact?: string;         // private — not shown publicly
  report_category: ReportCategory;
  description: string;
  latitude: number | null;
  longitude: number | null;
  location_name: string;
  kabupaten: Kabupaten;
  photo_urls: string[];     // object URLs (local) or remote URLs
  created_at: string;       // ISO 8601
  status: ReportStatus;
  verification_notes: string;
  updated_at: string;       // ISO 8601
  timeline: StatusTimelineEntry[];
  isDemo: boolean;
}

export interface ReportFormData {
  reporter_name: string;
  reporter_category: ReporterCategory | '';
  contact: string;
  report_category: ReportCategory | '';
  description: string;
  latitude: string;
  longitude: string;
  location_name: string;
  kabupaten: Kabupaten | '';
  photos: File[];
}

export interface ReportFilterState {
  category: ReportCategory | 'all';
  kabupaten: Kabupaten | 'all';
  status: ReportStatus | 'all';
}
