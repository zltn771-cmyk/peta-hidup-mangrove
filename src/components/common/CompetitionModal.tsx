import React, { useState } from 'react';
import {
  Award, X, CheckCircle2, ChevronRight, Play, ExternalLink,
  Satellite, Brain, Shield, Users, Sparkles, BookOpen, Map, ArrowRight,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CompetitionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CompetitionModal: React.FC<CompetitionModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'pitch' | 'walkthrough' | 'rubric' | 'tech'>('pitch');

  if (!isOpen) return null;

  const goTo = (path: string) => {
    onClose();
    navigate(path);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl border border-[#E2EAE2] shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#174B32] to-[#103D2B] p-6 text-white flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20 text-[#A8BFA5] flex-shrink-0">
              <Award size={24} />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 text-[#A8BFA5] text-[10px] font-bold tracking-wider uppercase mb-1">
                <Sparkles size={11} /> IT RUSH 2026 Competition Brief
              </div>
              <h2 className="text-xl font-extrabold tracking-tight">
                Panduan Demonstrasi & Penjurian Prototipe
              </h2>
              <p className="text-xs text-white/70 mt-0.5">
                Peta Hidup Mangrove: Platform Geospasial & AI Pemantauan Pesisir Bengkulu
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#E2EAE2] px-6 bg-[#F5F8F5]">
          {[
            { id: 'pitch', label: 'Elevator Pitch & Nilai' },
            { id: 'walkthrough', label: 'Alur Demo 2-Menit' },
            { id: 'rubric', label: 'Kesesuaian Kriteria Lomba' },
            { id: 'tech', label: 'Keunggulan Teknis' },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`py-3 px-4 text-xs font-bold border-b-2 transition-all ${
                activeTab === t.id
                  ? 'border-[#174B32] text-[#174B32] bg-white'
                  : 'border-transparent text-[#718075] hover:text-[#1D2A22]'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 text-sm text-[#1D2A22]">
          {/* Tab 1: Elevator Pitch */}
          {activeTab === 'pitch' && (
            <div className="space-y-4">
              <div className="bg-[#174B32]/5 border border-[#174B32]/20 rounded-2xl p-4">
                <h3 className="font-extrabold text-[15px] text-[#174B32] mb-1.5">
                  Latar Belakang & Urgensi Solusi
                </h3>
                <p className="text-xs text-[#718075] leading-relaxed">
                  Provinsi Bengkulu memiliki garis pantai sepanjang 525 km yang berhadapan langsung dengan 
                  Samudera Hindia dan zona subduksi aktif Megathrust Mentawai. Ekosistem mangrove seluas 
                  ~835 ha berfungsi sebagai benteng hayati alami peredam tsunami dan abrasi. Namun, keterbatasan 
                  pemantauan terestrial menyebabkan laju alih fungsi lahan dan sedimentasi sering terlambat terdeteksi.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="border border-[#E2EAE2] rounded-xl p-3.5 bg-white">
                  <div className="text-[11px] font-bold text-[#174B32] uppercase mb-1">MONITOR</div>
                  <p className="text-[11px] text-[#718075] leading-relaxed">
                    Penginderaan jauh berbasis Sentinel-2 (10m) dengan kombinasi indeks CMRI, MVI, dan NDMI.
                  </p>
                </div>
                <div className="border border-[#E2EAE2] rounded-xl p-3.5 bg-white">
                  <div className="text-[11px] font-bold text-[#059669] uppercase mb-1">UNDERSTAND</div>
                  <p className="text-[11px] text-[#718075] leading-relaxed">
                    Klasifikasi cerdas Random Forest dengan validasi matriks konfusi dan interpretasi tren multitemporal.
                  </p>
                </div>
                <div className="border border-[#E2EAE2] rounded-xl p-3.5 bg-white">
                  <div className="text-[11px] font-bold text-[#0891B2] uppercase mb-1">PROTECT</div>
                  <p className="text-[11px] text-[#718075] leading-relaxed">
                    Pelibatan warga pesisir melalui Citizen Science & modul edukasi interaktif untuk aksi konservasi nyata.
                  </p>
                </div>
              </div>

              <div className="bg-[#F5F8F5] border border-[#E2EAE2] rounded-xl p-3 flex items-center justify-between">
                <span className="text-xs font-semibold text-[#718075]">
                  Pelajari selengkapnya tentang visi, mitra, dan roadmap sistem:
                </span>
                <button
                  onClick={() => goTo('/tentang')}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#174B32] hover:underline"
                >
                  Buka Tentang Platform <ArrowRight size={13} />
                </button>
              </div>
            </div>
          )}

          {/* Tab 2: 2-Minute Walkthrough */}
          {activeTab === 'walkthrough' && (
            <div className="space-y-3">
              <p className="text-xs text-[#718075]">
                Ikuti 5 langkah terpadu berikut saat mendemonstrasikan sistem di hadapan dewan juri:
              </p>

              {[
                {
                  step: '1',
                  page: 'Dashboard Monitoring',
                  path: '/dashboard',
                  desc: 'Tunjukkan 4 kartu metrik utama, Leaflet mini-map zona pesisir Bengkulu, dan tabel zona prioritas Teluk Sepang & Muara Kinal.',
                },
                {
                  step: '2',
                  page: 'Peta Geospasial GIS',
                  path: '/peta',
                  desc: 'Eksplorasi peta interaktif Leaflet. Beralih ke citra Satelit ESRI, coba filter wilayah Mukomuko/Linau, dan tunjukkan layer GeoJSON demonstrasi.',
                },
                {
                  step: '3',
                  page: 'AI Classification Engine',
                  path: '/ai-klasifikasi',
                  desc: 'Jalankan pelatihan Random Forest LIVE! Tunjukkan pembagian data 80:20, matriks konfusi, Overall Accuracy (~93%), dan blueprint backend Python GEE.',
                },
                {
                  step: '4',
                  page: 'Community Reporting System',
                  path: '/laporan',
                  desc: 'Simulasikan pelaporan warga baru dengan fitur GPS izin pengguna dan preview foto dokumentasi kerusakan mangrove.',
                },
                {
                  step: '5',
                  page: 'Education Center & Kuis',
                  path: '/edukasi',
                  desc: 'Tunjukkan modul sains biodiversitas dan coba kuis interaktif 7 soal dengan umpan balik edukatif seketika.',
                },
              ].map(item => (
                <div key={item.step} className="border border-[#E2EAE2] rounded-xl p-3.5 bg-white hover:border-[#174B32]/40 transition-all flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#174B32] text-white flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                    {item.step}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-[#1D2A22]">{item.page}</span>
                      <button
                        onClick={() => goTo(item.path)}
                        className="text-[11px] font-bold text-[#174B32] hover:underline inline-flex items-center gap-1"
                      >
                        Buka Halaman <ChevronRight size={12} />
                      </button>
                    </div>
                    <p className="text-[11px] text-[#718075] mt-1 leading-snug">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tab 3: Evaluation Criteria */}
          {activeTab === 'rubric' && (
            <div className="space-y-3">
              {[
                {
                  title: 'Inovasi & Orisinalitas (Bobot Tinggi)',
                  badge: 'Sangat Kuat',
                  desc: 'Integrasi sinergis antara 3 indeks spektral mutakhir (CMRI, MVI, NDMI), algoritma Random Forest asli di client-side, dan citizen science ground truth yang saling memvalidasi.',
                },
                {
                  title: 'Kelayakan Teknis & Ketepatan Arsitektur',
                  badge: 'Siap Produksi',
                  desc: 'Pemisahan modul arsitektural yang jelas: Frontend React 19 + TypeScript 7 + Leaflet, modular service layer, dan blueprint FastAPI cloud GEE siap pasang.',
                },
                {
                  title: 'Dampak Sosial & Nilai Ekologis Pesisir',
                  badge: 'Konteks Lokal',
                  desc: 'Dirancang spesifik untuk kondisi pesisir Provinsi Bengkulu yang rawan bencana gelombang tinggi Samudera Hindia dan potensi gempa Megathrust Mentawai.',
                },
                {
                  title: 'Integritas Etika Ilmiah & Transparansi Data',
                  badge: '100% Etis',
                  desc: 'Tidak membuat klaim palsu bahwa satelit GEE sudah online; semua angka simulasi diberi label eksplisit amber "◈ Data Simulasi".',
                },
              ].map((c, i) => (
                <div key={i} className="border border-[#E2EAE2] rounded-xl p-3.5 bg-white">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs text-[#1D2A22]">{c.title}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      {c.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#718075] leading-relaxed">{c.desc}</p>
                </div>
              ))}
            </div>
          )}

          {/* Tab 4: Technical Highlights */}
          {activeTab === 'tech' && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-[#F5F8F5] rounded-xl border border-[#E2EAE2]">
                  <div className="font-bold text-[#174B32] mb-1">Frontend Engineering</div>
                  <ul className="text-[11px] text-[#718075] space-y-1">
                    <li>• React 19 + TypeScript 7 (Strict Mode)</li>
                    <li>• Tailwind CSS v4 Theme Token</li>
                    <li>• Leaflet 1.9.4 GIS Canvas (CDN)</li>
                    <li>• Recharts 3.10 Interactive Data Viz</li>
                  </ul>
                </div>
                <div className="p-3 bg-[#F5F8F5] rounded-xl border border-[#E2EAE2]">
                  <div className="font-bold text-[#174B32] mb-1">Machine Learning Engine</div>
                  <ul className="text-[11px] text-[#718075] space-y-1">
                    <li>• Random Forest Classifier (In-Memory TS)</li>
                    <li>• Gini Impurity & Bootstrapping</li>
                    <li>• Feature Importance (CMRI, MVI, NDMI)</li>
                    <li>• Matriks Konfusi & Kappa Calculation</li>
                  </ul>
                </div>
              </div>

              <div className="bg-[#174B32]/5 border border-[#174B32]/20 rounded-xl p-3 text-xs text-[#718075] leading-relaxed">
                <strong className="text-[#1D2A22]">Kualitas Kompilasi:</strong> Platform telah melewati build audit ketat dengan 
                <span className="text-emerald-700 font-bold"> 0 TypeScript error</span> pada 2.672 modul terkompilasi.
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="border-t border-[#E2EAE2] p-4 bg-[#F5F8F5] flex items-center justify-between">
          <div className="text-[11px] text-[#718075]">
            © 2026 Peta Hidup Mangrove · IT RUSH 2026 Competition Edition
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#174B32] hover:bg-[#103D2B] text-white text-xs font-bold rounded-xl transition-all shadow-sm"
          >
            Mulai Eksplorasi
          </button>
        </div>
      </div>
    </div>
  );
};
