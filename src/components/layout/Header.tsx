import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Menu, Bell, User, ChevronRight, Wifi, Award, Sparkles, CheckCircle2, AlertTriangle, X } from 'lucide-react';
import { CompetitionModal } from '../common/CompetitionModal';

const PAGE_TITLES: Record<string, { title: string; subtitle: string }> = {
  '/dashboard': { title: 'Monitoring Overview', subtitle: 'Ringkasan kondisi dan perkembangan ekosistem mangrove Bengkulu' },
  '/peta': { title: 'Peta Geospasial Mangrove', subtitle: 'Visualisasi spasial dan eksplorasi tutupan ekosistem mangrove Provinsi Bengkulu' },
  '/analisis': { title: 'Analisis Vegetasi Spektral', subtitle: 'Indeks spektral CMRI, MVI, dan NDMI berbasis Sentinel-2' },
  '/perubahan': { title: 'Perubahan Tutupan Mangrove', subtitle: 'Analisis multitemporal 2020–2026 dan proyeksi dinamika pesisir' },
  '/ai-klasifikasi': { title: 'AI Classification Center', subtitle: 'Sistem klasifikasi Random Forest berbasis indeks spektral dan sampel lapangan' },
  '/laporan': { title: 'Laporan Masyarakat (Citizen Science)', subtitle: 'Pemantauan berbasis partisipasi masyarakat pesisir' },
  '/edukasi': { title: 'Mangrove Education Center', subtitle: 'Pusat pembelajaran digital ekosistem mangrove' },
  '/tentang': { title: 'Tentang Platform & Peta Jalan', subtitle: 'Metodologi, pilar platform, dan komitmen integritas data' },
};

const SYSTEM_NOTIFICATIONS = [
  {
    id: 'notif-1',
    title: 'Laporan Warga Masuk',
    desc: 'Laporan indikasi limbah di Pintu Masuk Pulau Baai membutuhkan verifikasi.',
    time: '10 menit lalu',
    unread: true,
  },
  {
    id: 'notif-2',
    title: 'Komposit Citra Sentinel-2',
    desc: 'Tile komposit median musim kemarau 2026 siap divisualisasikan.',
    time: '1 jam lalu',
    unread: true,
  },
  {
    id: 'notif-3',
    title: 'Dataset Sampel Lapangan',
    desc: '60 titik sampel lapangan Bengkulu siap untuk training Random Forest.',
    time: '3 jam lalu',
    unread: false,
  },
];

interface HeaderProps {
  onMenuToggle: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuToggle }) => {
  const location = useLocation();
  const [showDemoModal, setShowDemoModal] = useState<boolean>(false);
  const [showNotif, setShowNotif] = useState<boolean>(false);

  const pageInfo = PAGE_TITLES[location.pathname] ?? {
    title: 'Peta Hidup Mangrove',
    subtitle: 'Platform Pemantauan Ekosistem Mangrove',
  };

  const now = new Date();
  const dateStr = now.toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <>
      <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-[#E2EAE2] h-16 flex items-center px-4 md:px-6 gap-3 md:gap-4">
        {/* Mobile menu toggle */}
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 rounded-xl hover:bg-[#F5F8F5] text-[#718075] hover:text-[#1D2A22] transition-colors"
          aria-label="Buka menu navigasi"
        >
          <Menu size={20} />
        </button>

        {/* Breadcrumb / Page title */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 text-[11px] text-[#A8BFA5] font-medium mb-0.5">
            <span>PHM Bengkulu</span>
            <ChevronRight size={11} />
            <span className="text-[#718075] truncate">{pageInfo.title}</span>
          </div>
          <h1 className="text-[15px] font-bold text-[#1D2A22] leading-tight truncate">
            {pageInfo.title}
          </h1>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
          {/* Competition Demo Guide Button */}
          <button
            onClick={() => setShowDemoModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#174B32] to-[#103D2B] text-white text-xs font-bold hover:shadow-md hover:scale-[1.02] transition-all"
            title="Buka panduan presentasi & alur demonstrasi kompetisi"
          >
            <Award size={14} className="text-[#A8BFA5]" />
            <span className="hidden sm:inline">Panduan Juri & Demo</span>
            <span className="sm:hidden">Demo</span>
          </button>

          {/* Data status badge */}
          <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#F5F8F5] border border-[#E2EAE2]">
            <Wifi size={12} className="text-emerald-600" />
            <span className="text-[10px] font-semibold text-[#718075]">Prototipe Simulasi</span>
          </div>

          {/* Date */}
          <div className="hidden lg:block text-[11px] text-[#A8BFA5] font-medium text-right leading-tight">
            <div className="text-[#718075]">{dateStr}</div>
          </div>

          {/* Notification Bell with Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotif(!showNotif)}
              className="relative p-2 rounded-xl hover:bg-[#F5F8F5] text-[#718075] hover:text-[#1D2A22] transition-colors"
              aria-label="Lihat notifikasi sistem"
            >
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-600 rounded-full ring-2 ring-white" />
            </button>

            {/* Notification Dropdown */}
            {showNotif && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl border border-[#E2EAE2] shadow-xl p-4 z-30 animate-fadeIn">
                <div className="flex items-center justify-between pb-3 border-b border-[#E2EAE2] mb-3">
                  <span className="font-bold text-xs text-[#1D2A22]">Notifikasi Sistem</span>
                  <button
                    onClick={() => setShowNotif(false)}
                    className="text-[#718075] hover:text-[#1D2A22]"
                  >
                    <X size={14} />
                  </button>
                </div>
                <div className="space-y-2.5">
                  {SYSTEM_NOTIFICATIONS.map((n) => (
                    <div
                      key={n.id}
                      className={`p-2.5 rounded-xl border text-xs transition-colors ${
                        n.unread ? 'bg-[#F5F8F5] border-[#A8BFA5]/40' : 'bg-white border-[#E2EAE2]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-[#1D2A22] text-[11px]">{n.title}</span>
                        <span className="text-[9px] text-[#A8BFA5]">{n.time}</span>
                      </div>
                      <p className="text-[11px] text-[#718075] leading-snug">{n.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User badge */}
          <div className="flex items-center gap-2 pl-2 pr-2.5 py-1 rounded-xl bg-[#F5F8F5] border border-[#E2EAE2]">
            <div className="w-6 h-6 rounded-lg bg-[#174B32] flex items-center justify-center text-white">
              <User size={13} />
            </div>
            <div className="hidden sm:block text-left">
              <div className="text-[11px] font-bold text-[#1D2A22] leading-tight">Tim Peneliti</div>
              <div className="text-[9px] text-[#A8BFA5] leading-tight">IT RUSH 2026</div>
            </div>
          </div>
        </div>
      </header>

      {/* Competition Presentation Modal */}
      <CompetitionModal
        isOpen={showDemoModal}
        onClose={() => setShowDemoModal(false)}
      />
    </>
  );
};
