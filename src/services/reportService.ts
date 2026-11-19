// Community Report Storage Service — Demonstration Mode (In-Memory / localStorage)
// All data is session-local. No permanent backend storage in this prototype version.

import {
  CommunityReportFull,
  ReportCategory,
  ReportFormData,
  ReportStatus,
  StatusTimelineEntry,
} from '../types/report';

// ── Demonstration Seed Data ───────────────────────────────────────────────────

const DEMO_REPORTS: CommunityReportFull[] = [
  {
    report_id: 'RPT-BKL-2026-001',
    reporter_name: 'Budi Santoso',
    reporter_category: 'Masyarakat Pesisir',
    contact: undefined,
    report_category: 'Sampah dan Pencemaran',
    description: 'Ditemukan tumpukan sampah plastik dan limbah oli di muara yang mengotori akar mangrove. Air berwarna kehitaman dengan bau menyengat. Kondisi mangrove di sekitar area ini terlihat mulai menguning.',
    latitude: -3.8992,
    longitude: 102.2981,
    location_name: 'Muara Pulau Baai',
    kabupaten: 'Kota Bengkulu',
    photo_urls: [],
    created_at: '2026-11-14T08:30:00+07:00',
    status: 'Verified',
    verification_notes: 'Tim lapangan mengonfirmasi pencemaran dari aktivitas kapal nelayan. Koordinasi dengan Dinas LH Kota Bengkulu sedang berlangsung.',
    updated_at: '2026-11-16T14:00:00+07:00',
    isDemo: true,
    timeline: [
      { status: 'Submitted', timestamp: '2026-11-14T08:30:00+07:00', note: 'Laporan diterima sistem.', actorLabel: 'Sistem' },
      { status: 'Under Review', timestamp: '2026-11-14T10:15:00+07:00', note: 'Laporan sedang diperiksa oleh tim pengelola.', actorLabel: 'Tim Pengelola' },
      { status: 'Verified', timestamp: '2026-11-16T14:00:00+07:00', note: 'Lokasi dan kondisi terkonfirmasi melalui kunjungan lapangan.', actorLabel: 'Tim Verifikasi' },
    ],
  },
  {
    report_id: 'RPT-BKL-2026-002',
    reporter_name: 'Siti Rahma',
    reporter_category: 'Komunitas Lingkungan',
    contact: undefined,
    report_category: 'Abrasi Pesisir',
    description: 'Garis pantai mundur sekitar 3-5 meter dibandingkan tahun lalu. Beberapa pohon mangrove di garis terdepan sudah tumbang ke laut. Area ini dulunya lebat namun kini terbuka lebar.',
    latitude: -3.7250,
    longitude: 102.2210,
    location_name: 'Pantai Sungai Hitam',
    kabupaten: 'Bengkulu Tengah',
    photo_urls: [],
    created_at: '2026-11-12T14:20:00+07:00',
    status: 'Under Review',
    verification_notes: '',
    updated_at: '2026-11-13T09:00:00+07:00',
    isDemo: true,
    timeline: [
      { status: 'Submitted', timestamp: '2026-11-12T14:20:00+07:00', note: 'Laporan diterima sistem.', actorLabel: 'Sistem' },
      { status: 'Under Review', timestamp: '2026-11-13T09:00:00+07:00', note: 'Laporan sedang diperiksa koordinat dan dokumentasinya.', actorLabel: 'Tim Pengelola' },
    ],
  },
  {
    report_id: 'RPT-BKL-2026-003',
    reporter_name: 'Kelompok KKN UNIB',
    reporter_category: 'Mahasiswa',
    contact: undefined,
    report_category: 'Kegiatan Rehabilitasi',
    description: 'Penanaman 500 bibit Rhizophora apiculata oleh mahasiswa KKN UNIB bekerja sama dengan kelompok nelayan lokal. Bibit berasal dari persemaian mangrove Dinas Kehutanan Provinsi Bengkulu.',
    latitude: -3.1280,
    longitude: 101.5620,
    location_name: 'Pesisir Air Rami',
    kabupaten: 'Mukomuko',
    photo_urls: [],
    created_at: '2026-11-08T07:00:00+07:00',
    status: 'Resolved',
    verification_notes: 'Kegiatan rehabilitasi terdokumentasi dan dilaporkan ke Dinas Kehutanan Provinsi. Data penanaman dicatat sebagai baseline monitoring pemulihan.',
    updated_at: '2026-11-10T16:00:00+07:00',
    isDemo: true,
    timeline: [
      { status: 'Submitted', timestamp: '2026-11-08T07:00:00+07:00', note: 'Laporan kegiatan rehabilitasi diterima.', actorLabel: 'Sistem' },
      { status: 'Under Review', timestamp: '2026-11-08T10:30:00+07:00', note: 'Laporan diperiksa tim pengelola.', actorLabel: 'Tim Pengelola' },
      { status: 'Verified', timestamp: '2026-11-09T11:00:00+07:00', note: 'Kegiatan dikonfirmasi valid dan terdokumentasi.', actorLabel: 'Tim Verifikasi' },
      { status: 'Resolved', timestamp: '2026-11-10T16:00:00+07:00', note: 'Data penanaman dimasukkan ke sistem monitoring. Laporan selesai.', actorLabel: 'Tim Pengelola' },
    ],
  },
  {
    report_id: 'RPT-BKL-2026-004',
    reporter_name: 'Ahmad Firdaus',
    reporter_category: 'Relawan',
    contact: undefined,
    report_category: 'Indikasi Penebangan Mangrove',
    description: 'Ditemukan bekas tebangan segar pada beberapa batang mangrove dewasa ukuran diameter 20-30 cm. Ada sisa kayu dan gergaji yang ditinggalkan. Lokasi sulit dijangkau dari jalan utama.',
    latitude: -3.9210,
    longitude: 102.2850,
    location_name: 'Teluk Sepang Bagian Barat',
    kabupaten: 'Kota Bengkulu',
    photo_urls: [],
    created_at: '2026-11-02T16:45:00+07:00',
    status: 'Submitted',
    verification_notes: '',
    updated_at: '2026-11-02T16:45:00+07:00',
    isDemo: true,
    timeline: [
      { status: 'Submitted', timestamp: '2026-11-02T16:45:00+07:00', note: 'Laporan diterima sistem dan menunggu pemeriksaan.', actorLabel: 'Sistem' },
    ],
  },
  {
    report_id: 'RPT-BKL-2026-005',
    reporter_name: 'Yuliana Putri',
    reporter_category: 'Masyarakat Pesisir',
    contact: undefined,
    report_category: 'Alih Fungsi Lahan',
    description: 'Ada alat berat yang mulai meratakan area mangrove di dekat muara untuk pembangunan tambak baru. Proses pengurugan sudah sekitar 1 hektar. Belum jelas apakah ada izin resmi.',
    latitude: -4.4532,
    longitude: 102.8941,
    location_name: 'Muara Kinal',
    kabupaten: 'Bengkulu Selatan',
    photo_urls: [],
    created_at: '2026-10-28T11:00:00+07:00',
    status: 'Under Review',
    verification_notes: 'Sedang dikonfirmasi ke Dinas Penanaman Modal terkait izin lokasi.',
    updated_at: '2026-10-30T09:30:00+07:00',
    isDemo: true,
    timeline: [
      { status: 'Submitted', timestamp: '2026-10-28T11:00:00+07:00', note: 'Laporan diterima sistem.', actorLabel: 'Sistem' },
      { status: 'Under Review', timestamp: '2026-10-30T09:30:00+07:00', note: 'Proses konfirmasi ke instansi terkait sedang berlangsung.', actorLabel: 'Tim Pengelola' },
    ],
  },
];

// ── In-memory store ───────────────────────────────────────────────────────────

let _reports: CommunityReportFull[] = [...DEMO_REPORTS];
let _nextId = 6;

function padId(n: number): string {
  return `RPT-BKL-2026-${String(n).padStart(3, '0')}`;
}

// ── Public API ────────────────────────────────────────────────────────────────

export function getAllReports(): CommunityReportFull[] {
  return [..._reports].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

export function getReportById(id: string): CommunityReportFull | undefined {
  return _reports.find(r => r.report_id === id);
}

export async function submitReport(
  form: ReportFormData,
  photoObjectUrls: string[]
): Promise<CommunityReportFull> {
  const now = new Date().toISOString();
  const id = padId(_nextId++);

  const newReport: CommunityReportFull = {
    report_id: id,
    reporter_name: form.reporter_name.trim(),
    reporter_category: form.reporter_category as CommunityReportFull['reporter_category'],
    contact: form.contact.trim() || undefined,
    report_category: form.report_category as ReportCategory,
    description: form.description.trim(),
    latitude: form.latitude ? parseFloat(form.latitude) : null,
    longitude: form.longitude ? parseFloat(form.longitude) : null,
    location_name: form.location_name.trim(),
    kabupaten: form.kabupaten as CommunityReportFull['kabupaten'],
    photo_urls: photoObjectUrls,
    created_at: now,
    status: 'Submitted',
    verification_notes: '',
    updated_at: now,
    isDemo: true,
    timeline: [
      {
        status: 'Submitted',
        timestamp: now,
        note: 'Laporan berhasil diterima oleh sistem. Menunggu pemeriksaan tim pengelola.',
        actorLabel: 'Sistem',
      },
    ],
  };

  _reports = [newReport, ..._reports];
  return newReport;
}

export function updateReportStatus(
  reportId: string,
  newStatus: ReportStatus,
  note: string
): CommunityReportFull | null {
  const idx = _reports.findIndex(r => r.report_id === reportId);
  if (idx === -1) return null;

  const now = new Date().toISOString();
  const updated: CommunityReportFull = {
    ..._reports[idx],
    status: newStatus,
    verification_notes: note,
    updated_at: now,
    timeline: [
      ..._reports[idx].timeline,
      {
        status: newStatus,
        timestamp: now,
        note,
        actorLabel: 'Tim Pengelola',
      },
    ],
  };

  _reports = _reports.map((r, i) => (i === idx ? updated : r));
  return updated;
}

export function getStats() {
  const all = _reports;
  return {
    total: all.length,
    submitted: all.filter(r => r.status === 'Submitted').length,
    underReview: all.filter(r => r.status === 'Under Review').length,
    verified: all.filter(r => r.status === 'Verified').length,
    resolved: all.filter(r => r.status === 'Resolved').length,
  };
}

// ── Form validation ───────────────────────────────────────────────────────────

export type FormErrors = Partial<Record<keyof ReportFormData, string>>;

export function validateReportForm(form: ReportFormData): FormErrors {
  const errors: FormErrors = {};

  if (!form.reporter_name.trim()) {
    errors.reporter_name = 'Nama pelapor wajib diisi.';
  }
  if (!form.reporter_category) {
    errors.reporter_category = 'Pilih kategori pelapor.';
  }
  if (!form.report_category) {
    errors.report_category = 'Pilih kategori temuan.';
  }
  if (!form.location_name.trim()) {
    errors.location_name = 'Nama lokasi wajib diisi.';
  }
  if (!form.kabupaten) {
    errors.kabupaten = 'Pilih kabupaten/kota.';
  }
  if (form.latitude && isNaN(parseFloat(form.latitude))) {
    errors.latitude = 'Koordinat lintang tidak valid.';
  }
  if (form.longitude && isNaN(parseFloat(form.longitude))) {
    errors.longitude = 'Koordinat bujur tidak valid.';
  }
  if (form.latitude) {
    const lat = parseFloat(form.latitude);
    if (lat < -6 || lat > -2) {
      errors.latitude = 'Koordinat lintang di luar wilayah Bengkulu (sekitar -2° s/d -6°).';
    }
  }
  if (form.longitude) {
    const lng = parseFloat(form.longitude);
    if (lng < 100 || lng > 105) {
      errors.longitude = 'Koordinat bujur di luar wilayah Bengkulu (sekitar 100° s/d 105°).';
    }
  }
  if (!form.description.trim() || form.description.trim().length < 20) {
    errors.description = 'Deskripsi wajib diisi (minimal 20 karakter).';
  }

  return errors;
}

export { DEMO_REPORTS };
