import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Map,
  FlaskConical,
  TrendingUp,
  Brain,
  MessageSquarePlus,
  BookOpen,
  Info,
  Leaf,
  ChevronRight,
  X,
  Satellite,
} from 'lucide-react';

export type NavItemDef = {
  path: string;
  label: string;
  shortLabel: string;
  icon: React.ReactNode;
  description: string;
  badge?: string;
};

const NAV_ITEMS: NavItemDef[] = [
  {
    path: '/dashboard',
    label: 'Dashboard',
    shortLabel: 'Dashboard',
    icon: <LayoutDashboard size={18} />,
    description: 'Ringkasan kondisi mangrove Bengkulu',
  },
  {
    path: '/peta',
    label: 'Peta Mangrove',
    shortLabel: 'Peta',
    icon: <Map size={18} />,
    description: 'Visualisasi geospasial kawasan mangrove',
  },
  {
    path: '/analisis',
    label: 'Analisis Vegetasi',
    shortLabel: 'Analisis',
    icon: <FlaskConical size={18} />,
    description: 'Indeks CMRI, MVI, dan NDMI',
  },
  {
    path: '/perubahan',
    label: 'Perubahan Tutupan',
    shortLabel: 'Perubahan',
    icon: <TrendingUp size={18} />,
    description: 'Analisis multitemporal 2020–2026',
  },
  {
    path: '/ai-klasifikasi',
    label: 'AI Classification',
    shortLabel: 'AI',
    icon: <Brain size={18} />,
    description: 'Klasifikasi Random Forest berbasis Sentinel-2',
    badge: 'Random Forest',
  },
  {
    path: '/laporan',
    label: 'Laporan Masyarakat',
    shortLabel: 'Laporan',
    icon: <MessageSquarePlus size={18} />,
    description: 'Citizen science pesisir Bengkulu',
    badge: 'Citizen Science',
  },
  {
    path: '/edukasi',
    label: 'Edukasi Mangrove',
    shortLabel: 'Edukasi',
    icon: <BookOpen size={18} />,
    description: 'Modul sains untuk warga & kuis',
    badge: '7 Kuis',
  },
  {
    path: '/tentang',
    label: 'Tentang Platform',
    shortLabel: 'Tentang',
    icon: <Info size={18} />,
    description: 'Metodologi & tim pengembang',
  },
];

interface SidebarProps {
  mobileOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, onClose }) => {
  const location = useLocation();

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo / Brand */}
      <div className="px-5 pt-6 pb-5 border-b border-[#E2EAE2]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#174B32] flex items-center justify-center shadow-sm flex-shrink-0">
            <Leaf size={18} className="text-[#A8BFA5]" />
          </div>
          <div>
            <div className="font-bold text-[13px] text-[#103D2B] leading-tight tracking-tight">
              PETA HIDUP MANGROVE
            </div>
            <div className="text-[10px] text-[#718075] font-medium tracking-wider uppercase mt-0.5">
              Monitor · Understand · Protect
            </div>
          </div>
          {/* Mobile close button */}
          <button
            onClick={onClose}
            className="ml-auto lg:hidden text-[#718075] hover:text-[#1D2A22] transition-colors p-1 rounded-lg hover:bg-[#E8EFE7]"
          >
            <X size={18} />
          </button>
        </div>
        <div className="mt-3 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#F5F8F5] border border-[#E2EAE2]">
          <Satellite size={12} className="text-[#A8BFA5]" />
          <span className="text-[10px] text-[#718075] font-medium">Sentinel-2 · Prov. Bengkulu</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
        <div className="text-[10px] font-semibold text-[#A8BFA5] uppercase tracking-widest px-2 mb-2">
          Pemantauan
        </div>
        {NAV_ITEMS.slice(0, 5).map((item) => (
          <NavItem key={item.path} item={item} currentPath={location.pathname} onNavigate={onClose} />
        ))}

        <div className="text-[10px] font-semibold text-[#A8BFA5] uppercase tracking-widest px-2 mt-4 mb-2">
          Komunitas & Informasi
        </div>
        {NAV_ITEMS.slice(5).map((item) => (
          <NavItem key={item.path} item={item} currentPath={location.pathname} onNavigate={onClose} />
        ))}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-[#E2EAE2]">
        <div className="rounded-xl bg-gradient-to-br from-[#174B32] to-[#103D2B] p-3.5 text-white">
          <div className="text-[11px] font-semibold opacity-90 mb-0.5">Tahap Prototipe</div>
          <div className="text-[10px] opacity-60 leading-relaxed">
            Data simulasi berlabel &#34;Data Simulasi&#34;. Integrasi data aktual sedang dikembangkan.
          </div>
        </div>
        <div className="mt-3 text-center text-[10px] text-[#A8BFA5]">
          © 2026 Peta Hidup Mangrove · IT RUSH 2026
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 xl:w-68 h-screen bg-white border-r border-[#E2EAE2] fixed left-0 top-0 z-20 flex-shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile drawer */}
      <aside
        className={`fixed left-0 top-0 h-screen w-72 bg-white border-r border-[#E2EAE2] z-40 lg:hidden
          transform transition-transform duration-300 ease-in-out flex flex-col
          ${mobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}`}
      >
        <SidebarContent />
      </aside>
    </>
  );
};

const NavItem: React.FC<{ item: NavItemDef; currentPath: string; onNavigate: () => void }> = ({
  item,
  currentPath,
  onNavigate,
}) => {
  const isActive = currentPath === item.path || currentPath.startsWith(item.path + '/');

  return (
    <NavLink
      to={item.path}
      onClick={onNavigate}
      className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 relative ${
        isActive
          ? 'bg-[#174B32] text-white shadow-sm'
          : 'text-[#718075] hover:bg-[#F5F8F5] hover:text-[#1D2A22]'
      }`}
    >
      <span
        className={`flex-shrink-0 transition-colors ${
          isActive ? 'text-[#A8BFA5]' : 'text-[#A8BFA5] group-hover:text-[#174B32]'
        }`}
      >
        {item.icon}
      </span>
      <span className="flex-1 font-medium leading-none">{item.label}</span>
      {item.badge && (
        <span
          className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full ${
            isActive
              ? 'bg-white/20 text-white/80'
              : 'bg-amber-100 text-amber-700'
          }`}
        >
          {item.badge}
        </span>
      )}
      {isActive && (
        <ChevronRight size={14} className="text-[#A8BFA5] flex-shrink-0" />
      )}
    </NavLink>
  );
};
