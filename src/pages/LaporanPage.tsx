import React, { useState, useCallback, useMemo } from 'react';
import {
  MessageSquarePlus, Users, MapPin, Info, List, LayoutGrid,
  AlertTriangle, ChevronRight,
} from 'lucide-react';
import {
  getAllReports, getStats,
} from '../services/reportService';
import { CommunityReportFull, ReportFilterState } from '../types/report';
import { ReportStats } from '../components/report/ReportStats';
import { ReportFilters } from '../components/report/ReportFilters';
import { ReportCard, ReportTableRow } from '../components/report/ReportCard';
import { ReportForm, SuccessToast } from '../components/report/ReportForm';
import { ReportDetail } from '../components/report/ReportDetail';

type ViewMode = 'grid' | 'table';

export const LaporanPage: React.FC = () => {
  // Data state — re-read from service on every mutation
  const [reports, setReports] = useState<CommunityReportFull[]>(() => getAllReports());
  const [stats, setStats] = useState(() => getStats());

  // UI state
  const [showForm, setShowForm] = useState(false);
  const [detailReport, setDetailReport] = useState<CommunityReportFull | null>(null);
  const [successId, setSuccessId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [filters, setFilters] = useState<ReportFilterState>({
    category: 'all',
    kabupaten: 'all',
    status: 'all',
  });

  // Refresh from service
  const refresh = useCallback(() => {
    setReports(getAllReports());
    setStats(getStats());
  }, []);

  // Handle new report submitted
  const handleSuccess = useCallback((report: CommunityReportFull) => {
    setShowForm(false);
    refresh();
    setSuccessId(report.report_id);
  }, [refresh]);

  // Handle status updated from detail panel
  const handleUpdated = useCallback((updated: CommunityReportFull) => {
    refresh();
    setDetailReport(updated);
  }, [refresh]);

  // Filter logic
  const filteredReports = useMemo(() => {
    return reports.filter(r => {
      if (filters.category !== 'all' && r.report_category !== filters.category) return false;
      if (filters.kabupaten !== 'all' && r.kabupaten !== filters.kabupaten) return false;
      if (filters.status !== 'all' && r.status !== filters.status) return false;
      return true;
    });
  }, [reports, filters]);

  return (
    <div className="space-y-5">
      {/* ── Page Header ───────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-semibold text-[#174B32] uppercase tracking-wider">
              Civic Science
            </span>
            <span className="text-[#A8BFA5]">/</span>
            <span className="text-[11px] text-[#718075]">Community Reports</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-[#1D2A22] tracking-tight">
            Community Mangrove Monitoring
          </h1>
          <p className="text-xs sm:text-sm text-[#718075] mt-0.5 max-w-xl">
            Empowering coastal communities to observe, report, and protect mangrove ecosystems.
          </p>
        </div>

        <button
          onClick={() => setShowForm(true)}
          className="self-start flex items-center gap-2 bg-[#174B32] hover:bg-[#103D2B] text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-colors shadow-sm flex-shrink-0"
        >
          <MessageSquarePlus size={16} />
          Laporkan Temuan
        </button>
      </div>

      {/* ── Demo Notice ───────────────────────────────────────────────────────── */}
      <div className="bg-[#FFFBEB] border border-[#FDE68A] rounded-xl p-3.5 flex items-start gap-3">
        <AlertTriangle size={15} className="text-[#D97706] mt-0.5 flex-shrink-0" />
        <div className="text-[11px] text-[#92400E] leading-relaxed">
          <strong>Mode Demonstrasi:</strong> Laporan hanya tersimpan di memori browser sesi ini.
          Belum ada koneksi ke server backend permanen. Nomor kontak pelapor tidak ditampilkan ke publik.
          Pada produksi, laporan akan tersimpan di database dan dapat diakses oleh tim pengelola.
        </div>
      </div>

      {/* ── Stats Dashboard ───────────────────────────────────────────────────── */}
      <ReportStats
        total={stats.total}
        submitted={stats.submitted}
        underReview={stats.underReview}
        verified={stats.verified}
        resolved={stats.resolved}
      />

      {/* ── Hero Cards: How It Works ──────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          {
            icon: <MessageSquarePlus size={22} className="text-[#174B32]" />,
            title: 'Laporkan Temuan',
            desc: 'Isi formulir singkat dengan kategori temuan, lokasi, dan deskripsi kondisi yang Anda temukan di lapangan.',
          },
          {
            icon: <Users size={22} className="text-[#059669]" />,
            title: 'Tim Verifikasi',
            desc: 'Tim pengelola memeriksa setiap laporan yang masuk dan menindaklanjuti bersama instansi terkait.',
          },
          {
            icon: <MapPin size={22} className="text-[#0891B2]" />,
            title: 'Data Spasial',
            desc: 'Laporan dengan koordinat valid ditampilkan sebagai marker di Peta Geospasial untuk pemantauan terpadu.',
          },
        ].map((item, i) => (
          <div key={i} className="bg-white rounded-2xl border border-[#E2EAE2] p-5 flex items-start gap-4">
            <div className="w-10 h-10 bg-[#F5F8F5] rounded-xl flex items-center justify-center flex-shrink-0 border border-[#E2EAE2]">
              {item.icon}
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#1D2A22] mb-1">{item.title}</h3>
              <p className="text-xs text-[#718075] leading-relaxed">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Reports Section ───────────────────────────────────────────────────── */}
      <div className="space-y-3">
        {/* Section header */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-extrabold text-[#1D2A22]">Daftar Laporan Masyarakat</h2>
            <span className="text-xs font-semibold text-[#718075] bg-[#F5F8F5] border border-[#E2EAE2] px-2.5 py-0.5 rounded-full">
              {filteredReports.length} laporan
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-xl border transition-colors ${viewMode === 'grid' ? 'bg-[#174B32] text-white border-[#174B32]' : 'bg-white text-[#718075] border-[#E2EAE2] hover:border-[#A8BFA5]'}`}
              title="Tampilan kartu"
            >
              <LayoutGrid size={14} />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-xl border transition-colors ${viewMode === 'table' ? 'bg-[#174B32] text-white border-[#174B32]' : 'bg-white text-[#718075] border-[#E2EAE2] hover:border-[#A8BFA5]'}`}
              title="Tampilan tabel"
            >
              <List size={14} />
            </button>
          </div>
        </div>

        {/* Filters */}
        <ReportFilters
          filters={filters}
          onFilterChange={setFilters}
          totalShown={filteredReports.length}
          totalAll={reports.length}
        />

        {/* Grid or Table */}
        {filteredReports.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#E2EAE2] p-10 text-center">
            <Info size={28} className="text-[#A8BFA5] mx-auto mb-3" />
            <p className="text-sm font-semibold text-[#718075]">Tidak ada laporan yang cocok dengan filter ini.</p>
            <p className="text-xs text-[#A8BFA5] mt-1">Coba ubah atau reset filter untuk melihat semua laporan.</p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredReports.map(report => (
              <ReportCard
                key={report.report_id}
                report={report}
                onViewDetail={setDetailReport}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-[#E2EAE2] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-[#F5F8F5] text-[10px] font-bold text-[#718075] uppercase tracking-wider border-b border-[#E2EAE2]">
                  <tr>
                    <th className="py-2.5 px-3">ID Laporan</th>
                    <th className="py-2.5 px-3">Kategori</th>
                    <th className="py-2.5 px-3">Lokasi</th>
                    <th className="py-2.5 px-3">Tanggal</th>
                    <th className="py-2.5 px-3">Pelapor</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReports.map(report => (
                    <ReportTableRow
                      key={report.report_id}
                      report={report}
                      onViewDetail={setDetailReport}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* ── Map Integration Notice ────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-[#E2EAE2] p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-[#F0FDF4] border border-[#A7F3D0] rounded-xl flex items-center justify-center flex-shrink-0">
            <MapPin size={18} className="text-[#059669]" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-[#1D2A22]">Sebaran Laporan di Peta Geospasial</h3>
            <p className="text-xs text-[#718075] mt-0.5">
              Laporan dengan koordinat valid ditampilkan sebagai marker oranye di halaman Peta Mangrove.
              Klik marker untuk melihat ringkasan laporan.
            </p>
          </div>
        </div>
        <a
          href="/peta"
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#F5F8F5] border border-[#E2EAE2] hover:border-[#A8BFA5] text-xs font-semibold text-[#174B32] transition-colors flex-shrink-0"
        >
          Buka Peta <ChevronRight size={13} />
        </a>
      </div>

      {/* ── Modals & Overlays ─────────────────────────────────────────────────── */}
      {showForm && (
        <ReportForm
          onClose={() => setShowForm(false)}
          onSuccess={handleSuccess}
        />
      )}

      {detailReport && (
        <ReportDetail
          report={detailReport}
          onClose={() => setDetailReport(null)}
          onUpdated={handleUpdated}
          adminMode
        />
      )}

      {successId && (
        <SuccessToast
          reportId={successId}
          onClose={() => setSuccessId(null)}
        />
      )}
    </div>
  );
};
