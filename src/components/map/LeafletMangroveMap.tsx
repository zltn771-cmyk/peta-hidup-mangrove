import React, { useEffect, useRef, useState } from 'react';
import { BENGKULU_MANGROVE_ZONES } from '../../data/mockData';

type MangroveZoneStatus = 'Kerapatan Tinggi' | 'Kerapatan Sedang' | 'Kerapatan Rendah' | 'Terdegradasi';

const STATUS_COLORS: Record<MangroveZoneStatus, string> = {
  'Kerapatan Tinggi': '#059669',
  'Kerapatan Sedang': '#A8BFA5',
  'Kerapatan Rendah': '#D97706',
  'Terdegradasi': '#DC2626',
};

const STATUS_EN: Record<MangroveZoneStatus, string> = {
  'Kerapatan Tinggi': 'High Density',
  'Kerapatan Sedang': 'Moderate Density',
  'Kerapatan Rendah': 'Low Density',
  'Terdegradasi': 'Degraded',
};

interface LeafletMangroveMapProps {
  height?: string;
  selectedZoneId?: string | null;
  onZoneSelect?: (zoneId: string) => void;
}

export const LeafletMangroveMap: React.FC<LeafletMangroveMapProps> = ({
  height = '480px',
  selectedZoneId = null,
  onZoneSelect,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const markersRef = useRef<LeafletMarker[]>([]);
  const [leafletReady, setLeafletReady] = useState(false);
  const [activeLayer, setActiveLayer] = useState<'osm' | 'satellite'>('osm');

  // Check if Leaflet CDN is loaded
  useEffect(() => {
    const checkLeaflet = () => {
      if (typeof window !== 'undefined' && window.L) {
        setLeafletReady(true);
      } else {
        setTimeout(checkLeaflet, 200);
      }
    };
    checkLeaflet();
  }, []);

  // Initialize map
  useEffect(() => {
    if (!leafletReady || !mapContainerRef.current || mapRef.current) return;

    const L = window.L;

    // Center on Bengkulu coast
    const map = L.map(mapContainerRef.current, {
      center: [-3.8, 102.0],
      zoom: 9,
      zoomControl: false,
      attributionControl: true,
      scrollWheelZoom: true,
    });

    // OSM tile layer
    const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 18,
      opacity: 0.9,
    });

    osmLayer.addTo(map);

    // Custom zoom control (bottom right)
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Add markers for each zone
    BENGKULU_MANGROVE_ZONES.forEach((zone) => {
      const color = STATUS_COLORS[zone.status as MangroveZoneStatus] || '#059669';
      const isSelected = zone.id === selectedZoneId;

      const svgIcon = `
        <div class="mangrove-marker" style="position:relative;width:36px;height:36px;">
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="18" cy="18" r="16" fill="${color}" fill-opacity="0.18" stroke="${color}" stroke-width="1.5"/>
            <circle cx="18" cy="18" r="${isSelected ? 10 : 8}" fill="${color}" stroke="white" stroke-width="2.5"/>
            ${isSelected ? `<circle cx="18" cy="18" r="4" fill="white"/>` : ''}
          </svg>
        </div>
      `;

      const icon = L.divIcon({
        html: svgIcon,
        className: '',
        iconSize: [36, 36],
        iconAnchor: [18, 18],
        popupAnchor: [0, -20],
      });

      const popupContent = `
        <div class="mangrove-popup">
          <div class="pop-title">${zone.name}</div>
          <div class="pop-sub">${zone.kabupaten}, Provinsi Bengkulu</div>
          <div class="pop-row"><span class="pop-label">Luas Area</span><span class="pop-val">${zone.areaHectares} ha</span></div>
          <div class="pop-row"><span class="pop-label">Skor Kesehatan</span><span class="pop-val">${zone.healthScore}%</span></div>
          <div class="pop-row"><span class="pop-label">CMRI</span><span class="pop-val">${zone.cmriScore.toFixed(2)}</span></div>
          <div class="pop-row"><span class="pop-label">MVI</span><span class="pop-val">${zone.mviScore.toFixed(2)}</span></div>
          <span class="pop-badge" style="background:${color}18;color:${color};border:1px solid ${color}40;">${zone.status}</span>
          <div class="pop-sim">◈ Lokasi & data adalah demonstrasi — belum diverifikasi survei lapangan</div>
        </div>
      `;

      const marker = L.marker(zone.coordinates as LatLng, { icon })
        .bindPopup(popupContent, { maxWidth: 260, className: 'mangrove-popup-wrapper' })
        .addTo(map);

      markersRef.current.push(marker);
    });

    mapRef.current = map;

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        markersRef.current = [];
      }
    };
  }, [leafletReady]);

  return (
    <div className="relative w-full overflow-hidden rounded-b-2xl" style={{ height }}>
      {/* Map container */}
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Loading overlay */}
      {!leafletReady && (
        <div className="absolute inset-0 bg-[#F5F8F5] flex flex-col items-center justify-center gap-3">
          <div className="w-8 h-8 border-3 border-[#174B32]/20 border-t-[#174B32] rounded-full animate-spin" />
          <span className="text-[12px] text-[#718075] font-medium">Memuat peta Leaflet...</span>
        </div>
      )}

      {/* Demonstration watermark */}
      <div className="absolute bottom-10 left-3 z-20 pointer-events-none">
        <div className="bg-amber-500/90 text-white text-[9px] font-bold px-2 py-1 rounded-md uppercase tracking-wider">
          ⚠ Area Demonstrasi
        </div>
      </div>

      {/* Layer toggle */}
      <div className="absolute top-3 left-3 z-20 bg-white rounded-xl shadow-md border border-[#E2EAE2] p-1 flex gap-1">
        {(['osm', 'satellite'] as const).map((l) => (
          <button
            key={l}
            onClick={() => setActiveLayer(l)}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold transition-all ${
              activeLayer === l
                ? 'bg-[#174B32] text-white'
                : 'text-[#718075] hover:bg-[#F5F8F5]'
            }`}
          >
            {l === 'osm' ? '🗺 Map' : '🛰 Satelit'}
          </button>
        ))}
      </div>

      {/* Legend */}
      <div className="absolute bottom-10 right-3 z-20 bg-white/95 backdrop-blur-sm rounded-xl border border-[#E2EAE2] shadow-md p-3">
        <div className="text-[9px] font-bold text-[#1D2A22] uppercase tracking-wider mb-2">Legenda Kerapatan</div>
        {(Object.entries(STATUS_COLORS) as [MangroveZoneStatus, string][]).map(([label, color]) => (
          <div key={label} className="flex items-center gap-2 mb-1.5">
            <span className="w-3 h-3 rounded-full flex-shrink-0 border-2 border-white shadow-sm" style={{ backgroundColor: color }} />
            <span className="text-[9px] text-[#718075] font-medium">{label}</span>
          </div>
        ))}
        <div className="mt-2 pt-2 border-t border-[#E2EAE2] text-[8px] text-[#A8BFA5]">
          © OpenStreetMap contributors
        </div>
      </div>
    </div>
  );
};
