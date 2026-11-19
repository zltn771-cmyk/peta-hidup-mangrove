import React, { useState } from 'react';
import { Search, MapPin, Satellite, RotateCcw, Maximize2, Minimize2, Sliders, X } from 'lucide-react';
import { BENGKULU_KABUPATENS, MANGROVE_GEOJSON } from '../../data/geoData';

interface MapSearchBarProps {
  onFlyTo: (center: [number, number], zoom: number) => void;
  onToggleControlPanel: () => void;
  isControlPanelOpen: boolean;
  onToggleSatelliteInfo: () => void;
  isSatelliteInfoOpen: boolean;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  onReset: () => void;
}

const QUICK_CHIPS = [
  { name: 'Pulau Baai', center: [-3.8967, 102.2965] as [number, number], zoom: 13 },
  { name: 'Sungai Hitam', center: [-3.7214, 102.2189] as [number, number], zoom: 13 },
  { name: 'Mukomuko', center: [-3.1256, 101.5642] as [number, number], zoom: 12 },
  { name: 'Linau Kaur', center: [-4.7821, 103.3512] as [number, number], zoom: 12 },
  { name: 'Teluk Sepang', center: [-3.9241, 102.2815] as [number, number], zoom: 13 },
];

export const MapSearchBar: React.FC<MapSearchBarProps> = ({
  onFlyTo,
  onToggleControlPanel,
  isControlPanelOpen,
  onToggleSatelliteInfo,
  isSatelliteInfoOpen,
  isFullscreen,
  onToggleFullscreen,
  onReset,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<{ name: string; center: [number, number]; zoom: number; type: string }[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (!term.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const q = term.toLowerCase();

    // Check kabupatens
    const matchedKab = BENGKULU_KABUPATENS.filter(k => k.name.toLowerCase().includes(q) && k.id !== 'all').map(k => ({
      name: k.name,
      center: k.center,
      zoom: k.zoom,
      type: 'Wilayah Administratif',
    }));

    // Check zones
    const matchedZones = MANGROVE_GEOJSON.features.filter(f => f.properties.name.toLowerCase().includes(q) || f.properties.kabupaten.toLowerCase().includes(q)).map(f => {
      // Find center from coordinates
      const coords = f.geometry.coordinates[0];
      const avgLng = (coords[0][0] + coords[1][0]) / 2;
      const avgLat = (coords[0][1] + coords[2][1]) / 2;
      return {
        name: f.properties.name,
        center: [avgLat, avgLng] as [number, number],
        zoom: 13,
        type: `Zona Mangrove (${f.properties.kabupaten})`,
      };
    });

    setSearchResults([...matchedKab, ...matchedZones]);
  };

  const handleSelectResult = (item: { center: [number, number]; zoom: number }) => {
    onFlyTo(item.center, item.zoom);
    setIsSearching(false);
    setSearchTerm('');
  };

  return (
    <div className="bg-white/95 backdrop-blur-sm border-b border-[#E2EAE2] px-3 sm:px-4 py-2.5 flex flex-wrap items-center justify-between gap-2.5 relative z-[500]">
      {/* Left controls: Panel toggle & Search */}
      <div className="flex items-center gap-2 flex-1 min-w-[240px] max-w-xl">
        <button
          onClick={onToggleControlPanel}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-colors shadow-xs ${
            isControlPanelOpen
              ? 'bg-[#174B32] text-white border-[#174B32]'
              : 'bg-white text-[#1D2A22] border-[#E2EAE2] hover:border-[#A8BFA5]'
          }`}
          title={isControlPanelOpen ? 'Tutup Panel Kontrol' : 'Buka Panel Kontrol'}
        >
          <Sliders size={13} className={isControlPanelOpen ? 'text-[#A8BFA5]' : 'text-[#718075]'} />
          <span className="hidden sm:inline">Panel Kontrol</span>
        </button>

        {/* Search input with drop-down */}
        <div className="relative flex-1">
          <div className="flex items-center bg-[#F5F8F5] border border-[#E2EAE2] rounded-xl px-2.5 py-1.5 focus-within:border-[#174B32] focus-within:bg-white transition-all">
            <Search size={14} className="text-[#718075] mr-2 flex-shrink-0" />
            <input
              type="text"
              placeholder="Cari kawasan mangrove atau kabupaten di Bengkulu..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="bg-transparent border-none outline-hidden text-xs text-[#1D2A22] placeholder:text-[#718075] w-full"
            />
            {searchTerm && (
              <button
                onClick={() => { setSearchTerm(''); setSearchResults([]); setIsSearching(false); }}
                className="text-[#718075] hover:text-[#1D2A22]"
              >
                <X size={13} />
              </button>
            )}
          </div>

          {/* Search Dropdown */}
          {isSearching && (
            <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-[#E2EAE2] rounded-xl shadow-lg z-50 overflow-hidden text-xs divide-y divide-[#F0F4F0]">
              {searchResults.length > 0 ? (
                searchResults.map((res, i) => (
                  <button
                    key={i}
                    onClick={() => handleSelectResult(res)}
                    className="w-full px-3 py-2 text-left hover:bg-[#F5F8F5] flex items-center justify-between transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <MapPin size={13} className="text-[#059669] flex-shrink-0" />
                      <span className="font-semibold text-[#1D2A22]">{res.name}</span>
                    </div>
                    <span className="text-[10px] text-[#718075]">{res.type}</span>
                  </button>
                ))
              ) : (
                <div className="p-3 text-center text-[#718075] text-[11px]">
                  Lokasi tidak ditemukan dalam data demonstrasi Bengkulu
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Center: Quick Chips */}
      <div className="hidden lg:flex items-center gap-1.5">
        <span className="text-[10px] font-bold text-[#718075] uppercase tracking-wider mr-1">Fokus:</span>
        {QUICK_CHIPS.map(chip => (
          <button
            key={chip.name}
            onClick={() => onFlyTo(chip.center, chip.zoom)}
            className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-[#F5F8F5] hover:bg-[#174B32] hover:text-white text-[#1D2A22] border border-[#E2EAE2] transition-colors"
          >
            {chip.name}
          </button>
        ))}
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-1.5">
        <button
          onClick={onToggleSatelliteInfo}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-colors shadow-xs ${
            isSatelliteInfoOpen
              ? 'bg-[#174B32] text-white border-[#174B32]'
              : 'bg-white text-[#1D2A22] border-[#E2EAE2] hover:border-[#A8BFA5]'
          }`}
          title="Info Satelit Sentinel-2 & GEE"
        >
          <Satellite size={13} className={isSatelliteInfoOpen ? 'text-[#A8BFA5]' : 'text-[#718075]'} />
          <span className="hidden sm:inline">Sentinel-2</span>
        </button>

        <button
          onClick={onReset}
          className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-white border border-[#E2EAE2] hover:border-[#A8BFA5] text-[#1D2A22] text-xs font-semibold flex items-center gap-1 transition-colors shadow-xs"
          title="Reset Sudut Pandang"
        >
          <RotateCcw size={13} className="text-[#718075]" />
          <span className="hidden md:inline">Reset</span>
        </button>

        <button
          onClick={onToggleFullscreen}
          className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-white border border-[#E2EAE2] hover:border-[#A8BFA5] text-[#1D2A22] text-xs font-semibold flex items-center gap-1 transition-colors shadow-xs"
          title={isFullscreen ? 'Keluar Layar Penuh' : 'Layar Penuh'}
        >
          {isFullscreen ? <Minimize2 size={13} className="text-[#718075]" /> : <Maximize2 size={13} className="text-[#718075]" />}
          <span className="hidden md:inline">{isFullscreen ? 'Keluar' : 'Full'}</span>
        </button>
      </div>
    </div>
  );
};
