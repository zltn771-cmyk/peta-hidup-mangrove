import React, { useState } from 'react';
import { ChevronUp, ChevronDown, Info } from 'lucide-react';

interface MapLegendProps {
  showReports?: boolean;
}

export const MapLegend: React.FC<MapLegendProps> = ({ showReports = true }) => {
  const [collapsed, setCollapsed] = useState(false);

  const densityItems = [
    { label: 'Kerapatan Tinggi', color: '#059669', desc: 'NDVI > 0.6 | CMRI > 0.65' },
    { label: 'Kerapatan Sedang', color: '#A8BFA5', desc: 'NDVI 0.4-0.6 | CMRI 0.45-0.65' },
    { label: 'Kerapatan Rendah', color: '#D97706', desc: 'NDVI 0.2-0.4 | CMRI 0.3-0.45' },
    { label: 'Terdegradasi', color: '#DC2626', desc: 'NDVI < 0.2 | Indikasi Kritis' },
  ];

  const reportItems = [
    { label: 'Pencemaran Limbah', color: '#D97706' },
    { label: 'Abrasi Pantai', color: '#0891B2' },
    { label: 'Restorasi / Bibit', color: '#059669' },
    { label: 'Penebangan Liar', color: '#DC2626' },
  ];

  return (
    <div className="bg-white/95 backdrop-blur-sm border-t border-[#E2EAE2] px-4 py-2.5 transition-all text-xs">
      <div className="flex items-center justify-between gap-3">
        {/* Toggle / Title */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center gap-1.5 font-bold text-[#1D2A22] text-[11px] hover:text-[#174B32] transition-colors"
        >
          <span>LEGENDA PETA</span>
          <span className="text-[10px] text-[#A8BFA5] font-normal hidden sm:inline">(Simulasi)</span>
          {collapsed ? <ChevronUp size={14} className="text-[#718075]" /> : <ChevronDown size={14} className="text-[#718075]" />}
        </button>

        {/* Compact summary when collapsed */}
        {collapsed ? (
          <div className="flex items-center gap-4 text-[11px] text-[#718075] overflow-x-auto">
            {densityItems.map(item => (
              <div key={item.label} className="flex items-center gap-1.5 flex-shrink-0">
                <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: item.color }} />
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-[10px] text-[#D97706] font-medium bg-[#FFFBEB] px-2.5 py-1 rounded-full border border-[#FDE68A]">
            <Info size={11} />
            <span>Poligon demonstrasi WGS84 — Belum divalidasi citra aktual</span>
          </div>
        )}
      </div>

      {!collapsed && (
        <div className="mt-2.5 pt-2 border-t border-[#F0F4F0] flex flex-wrap items-center justify-between gap-y-2 gap-x-6">
          {/* Density items */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-[10px] font-bold text-[#718075] uppercase tracking-wider">Kerapatan:</span>
            {densityItems.map(item => (
              <div key={item.label} className="flex items-center gap-1.5 text-[11px]" title={item.desc}>
                <span className="w-3 h-3 rounded shadow-xs border border-black/10 flex-shrink-0" style={{ backgroundColor: item.color }} />
                <span className="text-[#1D2A22] font-medium">{item.label}</span>
                <span className="text-[10px] text-[#718075] hidden lg:inline">({item.desc})</span>
              </div>
            ))}
          </div>

          {/* Report markers legend */}
          {showReports && (
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-[10px] font-bold text-[#718075] uppercase tracking-wider">Laporan Warga:</span>
              {reportItems.map(item => (
                <div key={item.label} className="flex items-center gap-1.5 text-[11px]">
                  <span className="w-2.5 h-2.5 rounded-full border-2 border-white shadow-xs flex-shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="text-[#1D2A22] font-medium">{item.label}</span>
                </div>
              ))}
            </div>
          )}

          {/* Polygon styling indication */}
          <div className="flex items-center gap-2 text-[10px] text-[#718075]">
            <span className="w-4 border-t-2 border-dashed border-[#174B32]" />
            <span>Batas Bounding Demonstrasi</span>
          </div>
        </div>
      )}
    </div>
  );
};
