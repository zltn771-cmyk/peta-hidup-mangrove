import React, { useState } from 'react';
import {
  X, MapPin, User, Calendar, Camera, ChevronRight,
  Clock, AlertTriangle, Shield, CheckCircle2, Eye,
  Save, ChevronDown,
} from 'lucide-react';
import { CommunityReportFull, ReportStatus } from '../../types/report';
import { StatusBadge, CategoryBadge, STATUS_CONFIG } from './ReportBadges';
import { updateReportStatus } from '../../services/reportService';

interface ReportDetailProps {
  report: CommunityReportFull;
  onClose: () => void;
  onUpdated: (updated: CommunityReportFull) => void;
  adminMode?: boolean;
}

function formatDateFull(iso: string) {
  return new Date(iso).toLocaleString('id-ID', {
    day: 'numeric', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

const STATUS_ORDER: ReportStatus[] = ['Submitted', 'Under Review', 'Verified', 'Resolved'];

function TimelineItem({ entry, isLast }: { entry: CommunityReportFull['timeline'][0]; isLast: boolean }) {
  const cfg = STATUS_CONFIG[entry.status];
  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center">
        <div
          className="w-7 h-7 rounded-full border-2 flex items-center justify-center flex-shrink-0"
          style={{ borderColor: cfg.border, background: cfg.bg, color: cfg.color }}
        >
          {cfg.icon}
        </div>
        {!isLast && <div className="w-0.5 flex-1 bg-[#E2EAE2] mt-1" />}
      </div>
      <div className={`pb-4 ${isLast ? '' : ''}`}>
        <div className="flex flex-wrap items-center gap-2 mb-0.5">
          <StatusBadge status={entry.status} />
          <span className="text-[10px] text-[#718075]">{entry.actorLabel}</span>
        </div>
        <p className="text-xs text-[#1D2A22]">{entry.note}</p>
        <p className="text-[10px] text-[#A8BFA5] mt-0.5">{formatDateFull(entry.timestamp)}</p>
      </div>
    </div>
  );
}

export const ReportDetail: React.FC<ReportDetailProps> = ({ report: initialReport, onClose, onUpdated, adminMode = false }) => {
  const [report, setReport] = useState(initialReport);
  const [showAdmin, setShowAdmin] = useState(false);
  const [newStatus, setNewStatus] = useState<ReportStatus>(report.status);
  const [adminNote, setAdminNote] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  const handleSaveStatus = async () => {
    if (!adminNote.trim()) return;
    setSaving(true);
    await new Promise(r => setTimeout(r, 400));
    const updated = updateReportStatus(report.report_id, newStatus, adminNote);
    if (updated) {
      setReport(updated);
      onUpdated(updated);
      setAdminNote('');
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    }
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-[3000] flex items-center justify-center p-3 sm:p-6 bg-[#1D2A22]/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl border border-[#E2EAE2] shadow-2xl w-full max-w-2xl max-h-[95vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-[#174B32] px-5 py-4 flex items-start justify-between gap-3 flex-shrink-0">
          <div>
            <div className="text-[11px] text-[#A8BFA5] font-mono mb-0.5">{report.report_id}</div>
            <h2 className="font-extrabold text-white text-base leading-tight">Detail Laporan Masyarakat</h2>
          </div>
          <button onClick={onClose} className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center transition-colors text-white mt-0.5 flex-shrink-0">
            <X size={15} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-5 space-y-5">
            {/* Status banner */}
            <div
              className="p-3.5 rounded-xl border flex items-center justify-between gap-3"
              style={{ background: STATUS_CONFIG[report.status].bg, borderColor: STATUS_CONFIG[report.status].border }}
            >
              <div>
                <StatusBadge status={report.status} />
                <p className="text-[11px] mt-1" style={{ color: STATUS_CONFIG[report.status].color }}>
                  {STATUS_CONFIG[report.status].desc}
                </p>
              </div>
              <div className="text-[10px] text-right" style={{ color: STATUS_CONFIG[report.status].color }}>
                <div className="font-semibold">Diperbarui</div>
                <div>{formatDateFull(report.updated_at)}</div>
              </div>
            </div>

            {/* Core info grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-2.5">
                <div>
                  <div className="text-[10px] font-bold text-[#718075] uppercase tracking-wider mb-1">Pelapor</div>
                  <div className="flex items-center gap-1.5">
                    <User size={13} className="text-[#A8BFA5]" />
                    <span className="font-semibold text-[#1D2A22]">{report.reporter_name}</span>
                    <span className="text-[#718075]">({report.reporter_category})</span>
                  </div>
                </div>
                <div>
                  <div className="text-[10px] font-bold text-[#718075] uppercase tracking-wider mb-1">Kategori Temuan</div>
                  <CategoryBadge category={report.report_category} />
                </div>
                <div>
                  <div className="text-[10px] font-bold text-[#718075] uppercase tracking-wider mb-1">Tanggal Laporan</div>
                  <div className="flex items-center gap-1.5 text-[#1D2A22]">
                    <Calendar size={12} className="text-[#A8BFA5]" />
                    {formatDateFull(report.created_at)}
                  </div>
                </div>
              </div>

              <div className="space-y-2.5">
                <div>
                  <div className="text-[10px] font-bold text-[#718075] uppercase tracking-wider mb-1">Lokasi</div>
                  <div className="flex items-start gap-1.5 text-[#1D2A22]">
                    <MapPin size={12} className="text-[#A8BFA5] mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-semibold">{report.location_name}</div>
                      <div className="text-[#718075]">{report.kabupaten}, Prov. Bengkulu</div>
                    </div>
                  </div>
                </div>
                {report.latitude && report.longitude && (
                  <div>
                    <div className="text-[10px] font-bold text-[#718075] uppercase tracking-wider mb-1">Koordinat WGS84</div>
                    <div className="font-mono text-[11px] text-[#1D2A22] bg-[#F5F8F5] px-2.5 py-1.5 rounded-lg border border-[#E2EAE2]">
                      {report.latitude.toFixed(6)}°, {report.longitude.toFixed(6)}°
                    </div>
                    {report.status !== 'Verified' && report.status !== 'Resolved' && (
                      <p className="text-[10px] text-[#D97706] mt-1 flex items-center gap-1">
                        <AlertTriangle size={10} /> Koordinat belum diverifikasi survei lapangan
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <div className="text-[10px] font-bold text-[#718075] uppercase tracking-wider mb-2">Deskripsi Temuan</div>
              <p className="text-xs text-[#1D2A22] leading-relaxed bg-[#F5F8F5] border border-[#E2EAE2] rounded-xl p-3.5">
                {report.description}
              </p>
            </div>

            {/* Photos */}
            {report.photo_urls.length > 0 && (
              <div>
                <div className="text-[10px] font-bold text-[#718075] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Camera size={12} /> Dokumentasi Foto ({report.photo_urls.length})
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {report.photo_urls.map((url, i) => (
                    <button
                      key={i}
                      onClick={() => setLightboxIdx(i)}
                      className="rounded-xl overflow-hidden border border-[#E2EAE2] aspect-square hover:border-[#174B32] transition-colors bg-[#F5F8F5]"
                    >
                      <img src={url} alt={`dok-${i + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Verification notes */}
            {report.verification_notes && (
              <div>
                <div className="text-[10px] font-bold text-[#718075] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Shield size={12} /> Catatan Verifikasi
                </div>
                <div className="bg-[#ECFDF5] border border-[#A7F3D0] rounded-xl p-3.5 text-xs text-[#065F46]">
                  {report.verification_notes}
                </div>
              </div>
            )}

            {/* Timeline */}
            <div>
              <div className="text-[10px] font-bold text-[#718075] uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Clock size={12} /> Riwayat Status
              </div>
              <div className="space-y-0">
                {report.timeline.map((entry, i) => (
                  <TimelineItem key={i} entry={entry} isLast={i === report.timeline.length - 1} />
                ))}
              </div>
            </div>

            {/* Admin Panel */}
            <div className="border-t border-[#E2EAE2] pt-4">
              <button
                onClick={() => setShowAdmin(prev => !prev)}
                className="flex items-center gap-2 text-xs font-bold text-[#174B32] hover:text-[#103D2B] transition-colors"
              >
                <Eye size={13} />
                Panel Pengelola (Demonstrasi)
                <ChevronDown size={13} className={`transition-transform ${showAdmin ? 'rotate-180' : ''}`} />
              </button>

              {showAdmin && (
                <div className="mt-3 p-4 bg-[#F5F8F5] border border-[#E2EAE2] rounded-xl space-y-3">
                  <div className="text-[10px] text-[#D97706] font-bold bg-[#FFFBEB] border border-[#FDE68A] px-2.5 py-1.5 rounded-lg">
                    Mode Demonstrasi — perubahan status hanya berlaku selama sesi ini
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#1D2A22] block mb-1.5">Ubah Status Laporan</label>
                    <div className="grid grid-cols-2 gap-2">
                      {STATUS_ORDER.map(s => (
                        <label
                          key={s}
                          className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer text-xs transition-colors ${
                            newStatus === s ? 'border-[#174B32] bg-[#F0FDF4] font-bold text-[#174B32]' : 'border-[#E2EAE2] text-[#718075] hover:border-[#A8BFA5]'
                          }`}
                        >
                          <input type="radio" name="admin-status" value={s} checked={newStatus === s} onChange={() => setNewStatus(s)} className="hidden" />
                          <span className={`w-3 h-3 rounded-full border-2 flex-shrink-0 ${newStatus === s ? 'border-[#174B32] bg-[#174B32]' : 'border-[#A8BFA5]'}`} />
                          {STATUS_CONFIG[s].label}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#1D2A22] block mb-1.5">Catatan Verifikasi <span className="text-[#DC2626]">*</span></label>
                    <textarea
                      rows={3}
                      placeholder="Tambahkan catatan tindak lanjut atau alasan perubahan status…"
                      value={adminNote}
                      onChange={e => setAdminNote(e.target.value)}
                      className="w-full text-xs text-[#1D2A22] bg-white border border-[#E2EAE2] rounded-xl px-3 py-2.5 outline-none focus:border-[#174B32] resize-y"
                    />
                  </div>

                  {saveSuccess && (
                    <div className="flex items-center gap-2 text-[11px] text-[#059669] font-semibold">
                      <CheckCircle2 size={14} /> Status berhasil diperbarui!
                    </div>
                  )}

                  <button
                    onClick={handleSaveStatus}
                    disabled={!adminNote.trim() || saving}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#174B32] hover:bg-[#103D2B] text-white text-xs font-bold transition-colors disabled:opacity-50"
                  >
                    {saving ? <><span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Menyimpan…</> : <><Save size={12} /> Simpan Perubahan</>}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 px-5 py-3 bg-[#F5F8F5] border-t border-[#E2EAE2] flex items-center justify-between">
          <button onClick={onClose} className="flex items-center gap-1.5 text-xs font-semibold text-[#718075] hover:text-[#1D2A22] transition-colors">
            <ChevronRight size={13} className="rotate-180" /> Kembali ke Daftar
          </button>
          <span className="text-[10px] text-[#A8BFA5]">ID: {report.report_id}</span>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxIdx !== null && (
        <div
          className="fixed inset-0 z-[4000] bg-black/80 flex items-center justify-center p-4"
          onClick={() => setLightboxIdx(null)}
        >
          <img
            src={report.photo_urls[lightboxIdx]}
            alt="Foto detail"
            className="max-w-full max-h-full rounded-xl object-contain"
            onClick={e => e.stopPropagation()}
          />
          <button onClick={() => setLightboxIdx(null)} className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white">
            <X size={18} />
          </button>
        </div>
      )}
    </div>
  );
};
