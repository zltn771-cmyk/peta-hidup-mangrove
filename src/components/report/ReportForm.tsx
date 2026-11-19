import React, { useState, useRef, useCallback } from 'react';
import {
  X, Upload, MapPin, Locate, User, ChevronDown, AlertTriangle,
  Camera, Trash2, Send, CheckCircle2, Info
} from 'lucide-react';
import {
  ReportFormData, ReporterCategory, ReportCategory, Kabupaten
} from '../../types/report';
import {
  validateReportForm, FormErrors, submitReport
} from '../../services/reportService';
import { CommunityReportFull } from '../../types/report';

const REPORTER_CATEGORIES: ReporterCategory[] = [
  'Masyarakat Pesisir', 'Komunitas Lingkungan', 'Mahasiswa', 'Relawan', 'Lainnya',
];

const REPORT_CATEGORIES: ReportCategory[] = [
  'Indikasi Penebangan Mangrove', 'Alih Fungsi Lahan', 'Sampah dan Pencemaran',
  'Kerusakan Vegetasi', 'Abrasi Pesisir', 'Kegiatan Rehabilitasi',
  'Kondisi Perlu Diperiksa', 'Lainnya',
];

const KABUPATENS: Kabupaten[] = [
  'Kota Bengkulu', 'Bengkulu Tengah', 'Bengkulu Utara', 'Bengkulu Selatan',
  'Mukomuko', 'Kaur', 'Seluma', 'Kepahiang', 'Rejang Lebong', 'Lebong', 'Lainnya',
];

const MAX_PHOTO_MB = 5;
const MAX_PHOTOS = 4;
const ACCEPTED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

interface ReportFormProps {
  onClose: () => void;
  onSuccess: (report: CommunityReportFull) => void;
}

const EMPTY_FORM: ReportFormData = {
  reporter_name: '', reporter_category: '', contact: '',
  report_category: '', description: '',
  latitude: '', longitude: '', location_name: '', kabupaten: '',
  photos: [],
};

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return <p className="text-[11px] text-[#DC2626] mt-1 flex items-center gap-1"><AlertTriangle size={11} />{msg}</p>;
}

function FormLabel({ label, required }: { label: string; required?: boolean }) {
  return (
    <label className="text-xs font-bold text-[#1D2A22] block mb-1.5">
      {label}{required && <span className="text-[#DC2626] ml-0.5">*</span>}
    </label>
  );
}

function inputCls(hasErr?: boolean) {
  return `w-full text-sm text-[#1D2A22] bg-white border rounded-xl px-3 py-2.5 outline-none transition-all placeholder:text-[#A8BFA5] focus:border-[#174B32] focus:ring-2 focus:ring-[#174B32]/10 ${hasErr ? 'border-[#DC2626]' : 'border-[#E2EAE2]'}`;
}

export const ReportForm: React.FC<ReportFormProps> = ({ onClose, onSuccess }) => {
  const [form, setForm] = useState<ReportFormData>(EMPTY_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const setField = useCallback(<K extends keyof ReportFormData>(k: K, v: ReportFormData[K]) => {
    setForm(prev => ({ ...prev, [k]: v }));
    setErrors(prev => { const e = { ...prev }; delete e[k]; return e; });
  }, []);

  // Photo handling
  const handlePhotoAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const remaining = MAX_PHOTOS - form.photos.length;
    if (remaining <= 0) return;

    const valid: File[] = [];
    const urls: string[] = [];
    for (const f of files.slice(0, remaining)) {
      if (!ACCEPTED_TYPES.includes(f.type)) continue;
      if (f.size > MAX_PHOTO_MB * 1024 * 1024) continue;
      valid.push(f);
      urls.push(URL.createObjectURL(f));
    }

    setForm(prev => ({ ...prev, photos: [...prev.photos, ...valid] }));
    setPreviewUrls(prev => [...prev, ...urls]);
    if (fileRef.current) fileRef.current.value = '';
  };

  const removePhoto = (idx: number) => {
    URL.revokeObjectURL(previewUrls[idx]);
    setForm(prev => ({ ...prev, photos: prev.photos.filter((_, i) => i !== idx) }));
    setPreviewUrls(prev => prev.filter((_, i) => i !== idx));
  };

  // GPS
  const handleGetGPS = () => {
    if (!navigator.geolocation) {
      setGpsError('Perangkat tidak mendukung geolokasi.');
      return;
    }
    setGpsLoading(true);
    setGpsError('');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setField('latitude', pos.coords.latitude.toFixed(6));
        setField('longitude', pos.coords.longitude.toFixed(6));
        setGpsLoading(false);
      },
      () => {
        setGpsError('Izin lokasi ditolak atau tidak tersedia.');
        setGpsLoading(false);
      },
      { timeout: 10000 }
    );
  };

  // Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validateReportForm(form);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setSubmitting(true);
    try {
      const report = await submitReport(form, previewUrls);
      onSuccess(report);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[3000] flex items-center justify-center p-3 sm:p-6 bg-[#1D2A22]/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl border border-[#E2EAE2] shadow-2xl w-full max-w-2xl max-h-[95vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-[#174B32] px-5 py-4 flex items-center justify-between flex-shrink-0">
          <div>
            <h2 className="font-extrabold text-white text-base">Laporkan Temuan Mangrove</h2>
            <p className="text-[11px] text-[#A8BFA5] mt-0.5">Mode Demonstrasi — laporan tersimpan sesi ini saja</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center transition-colors text-white">
            <X size={15} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Demo notice */}
          <div className="bg-[#FFFBEB] border border-[#FDE68A] p-3 rounded-xl text-[11px] text-[#92400E] flex items-start gap-2">
            <Info size={13} className="flex-shrink-0 mt-0.5 text-[#D97706]" />
            <span><strong>Mode Demonstrasi:</strong> Laporan hanya tersimpan di sesi browser ini. Belum ada backend permanen. Jangan sertakan data pribadi sensitif.</span>
          </div>

          {/* A. Pelapor */}
          <section className="space-y-3">
            <h3 className="text-xs font-extrabold text-[#174B32] uppercase tracking-wider border-b border-[#E2EAE2] pb-2 flex items-center gap-1.5">
              <User size={13} /> A. Informasi Pelapor
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <FormLabel label="Nama Pelapor" required />
                <input
                  type="text" placeholder="Nama lengkap Anda"
                  value={form.reporter_name}
                  onChange={e => setField('reporter_name', e.target.value)}
                  className={inputCls(!!errors.reporter_name)}
                />
                <FieldError msg={errors.reporter_name} />
              </div>
              <div>
                <FormLabel label="Nomor Kontak" />
                <input
                  type="tel" placeholder="Opsional — tidak ditampilkan publik"
                  value={form.contact}
                  onChange={e => setField('contact', e.target.value)}
                  className={inputCls()}
                />
              </div>
            </div>
            <div>
              <FormLabel label="Kategori Pelapor" required />
              <div className="relative">
                <select
                  value={form.reporter_category}
                  onChange={e => setField('reporter_category', e.target.value as ReporterCategory)}
                  className={`${inputCls(!!errors.reporter_category)} appearance-none pr-8`}
                >
                  <option value="">Pilih kategori pelapor…</option>
                  {REPORTER_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#718075] pointer-events-none" />
              </div>
              <FieldError msg={errors.reporter_category} />
            </div>
          </section>

          {/* B. Kategori Temuan */}
          <section className="space-y-3">
            <h3 className="text-xs font-extrabold text-[#174B32] uppercase tracking-wider border-b border-[#E2EAE2] pb-2">
              B. Kategori Temuan
            </h3>
            <div>
              <FormLabel label="Jenis Temuan" required />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {REPORT_CATEGORIES.map(cat => (
                  <label
                    key={cat}
                    className={`flex items-center gap-2.5 p-2.5 rounded-xl border cursor-pointer transition-all text-xs ${
                      form.report_category === cat
                        ? 'border-[#174B32] bg-[#F0FDF4] text-[#174B32] font-bold'
                        : 'border-[#E2EAE2] bg-white text-[#1D2A22] hover:border-[#A8BFA5]'
                    }`}
                  >
                    <input
                      type="radio" name="category" value={cat}
                      checked={form.report_category === cat}
                      onChange={() => setField('report_category', cat)}
                      className="hidden"
                    />
                    <span className={`w-3.5 h-3.5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
                      form.report_category === cat ? 'border-[#174B32] bg-[#174B32]' : 'border-[#A8BFA5]'
                    }`}>
                      {form.report_category === cat && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </span>
                    {cat}
                  </label>
                ))}
              </div>
              <FieldError msg={errors.report_category} />
            </div>
          </section>

          {/* C. Lokasi */}
          <section className="space-y-3">
            <h3 className="text-xs font-extrabold text-[#174B32] uppercase tracking-wider border-b border-[#E2EAE2] pb-2 flex items-center gap-1.5">
              <MapPin size={13} /> C. Lokasi Kejadian
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <FormLabel label="Nama Wilayah / Lokasi" required />
                <input
                  type="text" placeholder="cth: Muara Pulau Baai, Pantai Air Rami"
                  value={form.location_name}
                  onChange={e => setField('location_name', e.target.value)}
                  className={inputCls(!!errors.location_name)}
                />
                <FieldError msg={errors.location_name} />
              </div>
              <div>
                <FormLabel label="Kabupaten/Kota" required />
                <div className="relative">
                  <select
                    value={form.kabupaten}
                    onChange={e => setField('kabupaten', e.target.value as Kabupaten)}
                    className={`${inputCls(!!errors.kabupaten)} appearance-none pr-8`}
                  >
                    <option value="">Pilih kabupaten/kota…</option>
                    {KABUPATENS.map(k => <option key={k} value={k}>{k}</option>)}
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#718075] pointer-events-none" />
                </div>
                <FieldError msg={errors.kabupaten} />
              </div>
            </div>

            {/* Coordinates */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <FormLabel label="Lintang (Latitude)" />
                <input
                  type="number" step="0.000001" placeholder="-3.8992"
                  value={form.latitude}
                  onChange={e => setField('latitude', e.target.value)}
                  className={inputCls(!!errors.latitude)}
                />
                <FieldError msg={errors.latitude} />
              </div>
              <div>
                <FormLabel label="Bujur (Longitude)" />
                <input
                  type="number" step="0.000001" placeholder="102.2981"
                  value={form.longitude}
                  onChange={e => setField('longitude', e.target.value)}
                  className={inputCls(!!errors.longitude)}
                />
                <FieldError msg={errors.longitude} />
              </div>
            </div>

            <button
              type="button" onClick={handleGetGPS}
              disabled={gpsLoading}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[#A8BFA5] text-[#174B32] text-xs font-semibold hover:bg-[#F5F8F5] transition-colors disabled:opacity-60"
            >
              <Locate size={13} className={gpsLoading ? 'animate-spin' : ''} />
              {gpsLoading ? 'Mendapatkan lokasi…' : 'Gunakan GPS Perangkat Saya'}
            </button>
            {gpsError && <p className="text-[11px] text-[#DC2626] flex items-center gap-1"><AlertTriangle size={11} />{gpsError}</p>}
            <p className="text-[10px] text-[#718075]">Lokasi GPS hanya diambil setelah Anda menekan tombol dan memberikan izin perangkat.</p>
          </section>

          {/* D. Foto */}
          <section className="space-y-3">
            <h3 className="text-xs font-extrabold text-[#174B32] uppercase tracking-wider border-b border-[#E2EAE2] pb-2 flex items-center gap-1.5">
              <Camera size={13} /> D. Dokumentasi Foto
            </h3>

            {previewUrls.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {previewUrls.map((url, i) => (
                  <div key={i} className="relative group rounded-xl overflow-hidden border border-[#E2EAE2] aspect-square bg-[#F5F8F5]">
                    <img src={url} alt={`foto-${i + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button" onClick={() => removePhoto(i)}
                      className="absolute top-1.5 right-1.5 w-6 h-6 bg-[#DC2626] rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white"
                    >
                      <Trash2 size={11} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {form.photos.length < MAX_PHOTOS && (
              <div
                onClick={() => fileRef.current?.click()}
                className="border-2 border-dashed border-[#A8BFA5] hover:border-[#174B32] rounded-xl p-5 flex flex-col items-center gap-2 cursor-pointer transition-colors bg-[#F5F8F5] hover:bg-[#EEF4EE]"
              >
                <Upload size={20} className="text-[#A8BFA5]" />
                <span className="text-xs text-[#718075]">Unggah foto (maks. {MAX_PHOTOS} foto, {MAX_PHOTO_MB}MB/foto)</span>
                <span className="text-[10px] text-[#A8BFA5]">JPG, PNG, WebP diterima</span>
              </div>
            )}
            <input ref={fileRef} type="file" accept="image/jpeg,image/jpg,image/png,image/webp" multiple onChange={handlePhotoAdd} className="hidden" />
          </section>

          {/* E. Deskripsi */}
          <section className="space-y-3">
            <h3 className="text-xs font-extrabold text-[#174B32] uppercase tracking-wider border-b border-[#E2EAE2] pb-2">
              E. Deskripsi Temuan
            </h3>
            <div>
              <FormLabel label="Jelaskan Kondisi yang Ditemukan" required />
              <textarea
                rows={5}
                placeholder="Deskripsikan kondisi yang Anda temukan, perkiraan waktu kejadian, luas area yang terdampak, dan informasi relevan lainnya…"
                value={form.description}
                onChange={e => setField('description', e.target.value)}
                className={`${inputCls(!!errors.description)} resize-y min-h-[100px]`}
              />
              <div className="flex items-center justify-between mt-1">
                <FieldError msg={errors.description} />
                <span className={`text-[10px] ml-auto ${form.description.length < 20 ? 'text-[#D97706]' : 'text-[#A8BFA5]'}`}>
                  {form.description.length} / min. 20 karakter
                </span>
              </div>
            </div>
          </section>
        </form>

        {/* Footer */}
        <div className="flex-shrink-0 px-5 py-4 bg-[#F5F8F5] border-t border-[#E2EAE2] flex items-center justify-between gap-3">
          <button onClick={onClose} className="px-4 py-2 rounded-xl border border-[#E2EAE2] text-xs font-semibold text-[#718075] hover:bg-white transition-colors">
            Batal
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#174B32] hover:bg-[#103D2B] text-white text-xs font-bold transition-colors disabled:opacity-60 shadow-sm"
          >
            {submitting ? <><span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Mengirim…</> : <><Send size={13} /> Kirim Laporan</>}
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Success Toast ─────────────────────────────────────────────────────────────

export function SuccessToast({ reportId, onClose }: { reportId: string; onClose: () => void }) {
  return (
    <div className="fixed bottom-5 right-5 z-[4000] bg-[#174B32] text-white rounded-2xl p-4 shadow-2xl flex items-start gap-3 max-w-sm animate-in slide-in-from-bottom-5 fade-in duration-300">
      <CheckCircle2 size={20} className="text-[#A8BFA5] flex-shrink-0 mt-0.5" />
      <div>
        <p className="font-bold text-sm">Laporan Berhasil Dikirim!</p>
        <p className="text-[11px] text-[#A8BFA5] mt-0.5">ID: <span className="font-mono">{reportId}</span> — Mode Demonstrasi</p>
        <p className="text-[11px] text-[#A8BFA5] mt-0.5">Laporan tersimpan di sesi ini. Menunggu pemeriksaan tim pengelola.</p>
      </div>
      <button onClick={onClose} className="text-[#A8BFA5] hover:text-white flex-shrink-0"><X size={14} /></button>
    </div>
  );
}
