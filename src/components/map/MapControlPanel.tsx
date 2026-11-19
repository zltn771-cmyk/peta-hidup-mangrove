import React from 'react';
import { Layers, Eye, EyeOff, Map, Satellite, Mountain, ChevronDown, Calendar, Palette, MapPin, RotateCcw } from 'lucide-react';
import type { BasemapKey, LayerVisibility, VizType } from './MangroveMapCore';
import { BENGKULU_KABUPATENS } from '../../data/geoData';

interface MapControlPanelProps {
  basemap: BasemapKey;
  onBasemapChange: (b: BasemapKey) => void;
  layers: LayerVisibility;
  onLayerToggle: (key: keyof LayerVisibility) => void;
  year: number;
  onYearChange: (y: number) => void;
  vizType: VizType;
  onVizChange: (v: VizType) => void;
  kabupatenId: string;
  onKabupatenChange: (id: string, center: [number, number], zoom: number) => void;
  onReset: () => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

const BASEMAP_OPTIONS: { key: BasemapKey; label: string; icon: React.ReactNode; desc: string }[] = [
  { key: 'osm', label: 'Street Map', icon: <Map size={14} />, desc: 'OpenStreetMap' },
  { key: 'satellite', label: 'Satellite', icon: <Satellite size={14} />, desc: 'ESRI World Imagery' },
  { key: 'terrain', label: 'Terrain', icon: <Mountain size={14} />, desc: 'OpenTopoMap' },
];

const VIZ_OPTIONS: { key: VizType; label: string; desc: string; available: boolean }[] = [
  { key: 'trueColor', label: 'True Color', desc: 'Komposit B4-B3-B2', available: false },
  { key: 'falseColor', label: 'False Color NIR', desc: 'Komposit B8-B4-B3', available: false },
  { key: 'mangrove', label: 'Mangrove Distribution', desc: 'Overlay kerapatan kanopi', available: true },
  { key: 'priority', label: 'Monitoring Priority', desc: 'Zona prioritas pemantauan', available: true },
];

const LAYER_CONFIG: { key: keyof LayerVisibility; label: string; desc: string; color: string }[] = [
  { key: 'mangroveZones', label: 'Area Mangrove', desc: 'Poligon demonstrasi kawasan mangrove', color: '#059669' },
  { key: 'monitoringPoints', label: 'Titik Pemantauan', desc: 'Marker lokasi zona observasi', color: '#174B32' },
  { key: 'communityReports', label: 'Laporan Masyarakat', desc: 'Sebaran laporan citizen science', color: '#D97706' },
  { key: 'priorityAreas', label: 'Area Prioritas', desc: 'Zona yang memerlukan perhatian khusus', color: '#DC2626' },
];

export const MapControlPanel: React.FC<MapControlPanelProps> = ({
  basemap, onBasemapChange,
  layers, onLayerToggle,
  year, onYearChange,
  vizType, onVizChange,
  kabupatenId, onKabupatenChange,
  onReset,
  collapsed, onToggleCollapse,
}) => {
  if (collapsed) {
    return (
      <div className="flex flex-col gap-2 p-2">
        <button
          onClick={onToggleCollapse}
          className="w-9 h-9 rounded-xl bg-white border border-[#E2EAE2] flex items-center justify-center hover:border-[#A8BFA5] transition-colors shadow-sm"
          title="Buka panel kontrol"
        >
          <Layers size={16} className="text-[#174B32]" />
        </button>
        <button
          onClick={onReset}
          className="w-9 h-9 rounded-xl bg-white border border-[#E2EAE2] flex items-center justify-center hover:border-[#A8BFA5] transition-colors shadow-sm"
          title="Reset posisi peta"
        >
          <RotateCcw size={14} className="text-[#718075]" />
        </button>
      </div>
    );
  }

  return (
    <div className="w-72 flex-shrink-0 bg-white border-r border-[#E2EAE2] flex flex-col overflow-y-auto">
      {/* Panel header */}
      <div className="flex items-center justify-between px-4 py-3.5 border-b border-[#E2EAE2] bg-[#174B32]">
        <div className="flex items-center gap-2">
          <Layers size={15} className="text-[#A8BFA5]" />
          <span className="font-bold text-[13px] text-white">Kontrol Peta</span>
        </div>
        <button
          onClick={onToggleCollapse}
          className="text-[#A8BFA5] hover:text-white transition-colors p-1"
          title="Sembunyikan panel"
        >
          <ChevronDown size={14} className="rotate-90" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">

        {/* Region selector */}
        <div className="p-4 border-b border-[#E2EAE2]">
          <div className="flex items-center gap-2 mb-2.5">
            <MapPin size={12} className="text-[#174B32]" />
            <span className="text-[11px] font-bold text-[#1D2A22] uppercase tracking-wider">Wilayah</span>
          </div>
          <select
            value={kabupatenId}
            onChange={e => {
              const found = BENGKULU_KABUPATENS.find(k => k.id === e.target.value);
              if (found) onKabupatenChange(found.id, found.center, found.zoom);
            }}
            className="w-full border border-[#E2EAE2] rounded-xl px-3 py-2 text-[12px] text-[#1D2A22] outline-none focus:border-[#174B32] bg-white transition-colors"
          >
            {BENGKULU_KABUPATENS.map(k => (
              <option key={k.id} value={k.id}>{k.name}</option>
            ))}
          </select>
        </div>

        {/* Basemap selector */}
        <div className="p-4 border-b border-[#E2EAE2]">
          <div className="flex items-center gap-2 mb-2.5">
            <Map size={12} className="text-[#174B32]" />
            <span className="text-[11px] font-bold text-[#1D2A22] uppercase tracking-wider">Basemap</span>
          </div>
          <div className="space-y-1.5">
            {BASEMAP_OPTIONS.map(opt => (
              <button
                key={opt.key}
                onClick={() => onBasemapChange(opt.key)}
                className={`w-full flex items-center gap-3 p-2.5 rounded-xl border transition-all text-left ${
                  basemap === opt.key
                    ? 'bg-[#174B32] border-[#174B32] text-white'
                    : 'border-[#E2EAE2] hover:border-[#A8BFA5] text-[#718075] hover:bg-[#F5F8F5]'
                }`}
              >
                <span className={basemap === opt.key ? 'text-[#A8BFA5]' : 'text-[#A8BFA5]'}>{opt.icon}</span>
                <div>
                  <div className="text-[12px] font-semibold leading-tight">{opt.label}</div>
                  <div className={`text-[9px] ${basemap === opt.key ? 'text-white/60' : 'text-[#A8BFA5]'}`}>{opt.desc}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Year selector */}
        <div className="p-4 border-b border-[#E2EAE2]">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-2">
              <Calendar size={12} className="text-[#174B32]" />
              <span className="text-[11px] font-bold text-[#1D2A22] uppercase tracking-wider">Periode Pengamatan</span>
            </div>
            <span className="text-[11px] font-bold text-[#174B32]">{year}</span>
          </div>
          <input
            type="range"
            min={2021} max={2026} step={1}
            value={year}
            onChange={e => onYearChange(Number(e.target.value))}
            className="w-full accent-[#174B32]"
          />
          <div className="flex justify-between mt-1">
            {[2021, 2022, 2023, 2024, 2025, 2026].map(y => (
              <button
                key={y}
                onClick={() => onYearChange(y)}
                className={`text-[9px] font-semibold transition-colors ${year === y ? 'text-[#174B32]' : 'text-[#A8BFA5] hover:text-[#718075]'}`}
              >
                {y}
              </button>
            ))}
          </div>
          <div className="mt-2 text-[9px] text-amber-600 font-semibold">◈ Filter tahun tidak mengubah data aktual — demonstrasi</div>
        </div>

        {/* Visualization type */}
        <div className="p-4 border-b border-[#E2EAE2]">
          <div className="flex items-center gap-2 mb-2.5">
            <Palette size={12} className="text-[#174B32]" />
            <span className="text-[11px] font-bold text-[#1D2A22] uppercase tracking-wider">Visualisasi Citra</span>
          </div>
          <div className="space-y-1.5">
            {VIZ_OPTIONS.map(opt => (
              <button
                key={opt.key}
                onClick={() => opt.available && onVizChange(opt.key)}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl border transition-all text-left ${
                  !opt.available
                    ? 'border-dashed border-[#E2EAE2] opacity-50 cursor-not-allowed'
                    : vizType === opt.key
                    ? 'bg-[#174B32] border-[#174B32]'
                    : 'border-[#E2EAE2] hover:border-[#A8BFA5] hover:bg-[#F5F8F5]'
                }`}
              >
                <div>
                  <div className={`text-[12px] font-semibold ${vizType === opt.key && opt.available ? 'text-white' : 'text-[#1D2A22]'}`}>
                    {opt.label}
                  </div>
                  <div className={`text-[9px] ${vizType === opt.key && opt.available ? 'text-white/60' : 'text-[#A8BFA5]'}`}>
                    {opt.desc}
                  </div>
                </div>
                {!opt.available && (
                  <span className="text-[8px] font-bold bg-amber-100 text-amber-700 border border-amber-200 px-1.5 py-0.5 rounded-full whitespace-nowrap">GEE</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Layer toggles */}
        <div className="p-4">
          <div className="flex items-center gap-2 mb-2.5">
            <Layers size={12} className="text-[#174B32]" />
            <span className="text-[11px] font-bold text-[#1D2A22] uppercase tracking-wider">Layer Tematik</span>
          </div>
          <div className="space-y-2">
            {LAYER_CONFIG.map(lc => {
              const isOn = layers[lc.key];
              return (
                <button
                  key={lc.key}
                  onClick={() => onLayerToggle(lc.key)}
                  className={`w-full flex items-center gap-3 p-2.5 rounded-xl border transition-all ${
                    isOn ? 'border-[#A8BFA5] bg-[#F5F8F5]' : 'border-[#E2EAE2] hover:border-[#C4D3C4]'
                  }`}
                >
                  <div
                    className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0 transition-all border-2"
                    style={isOn
                      ? { backgroundColor: lc.color, borderColor: lc.color }
                      : { borderColor: '#C4D3C4', backgroundColor: 'transparent' }
                    }
                  >
                    {isOn && <span className="text-white text-[8px] font-bold leading-none">✓</span>}
                  </div>
                  <div className="flex-1 text-left">
                    <div className="text-[12px] font-semibold text-[#1D2A22] leading-tight">{lc.label}</div>
                    <div className="text-[9px] text-[#A8BFA5]">{lc.desc}</div>
                  </div>
                  {isOn
                    ? <Eye size={12} className="text-[#174B32] flex-shrink-0" />
                    : <EyeOff size={12} className="text-[#C4D3C4] flex-shrink-0" />
                  }
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Panel footer */}
      <div className="p-3 border-t border-[#E2EAE2]">
        <button
          onClick={onReset}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-xl border border-[#E2EAE2] text-[12px] font-semibold text-[#718075] hover:bg-[#F5F8F5] hover:text-[#1D2A22] transition-all"
        >
          <RotateCcw size={13} /> Reset Posisi Peta
        </button>
      </div>
    </div>
  );
};
