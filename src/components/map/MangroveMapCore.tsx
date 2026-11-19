import React, { useEffect, useRef, useState, useCallback } from 'react';
import { MANGROVE_GEOJSON, REPORT_MARKERS, MangroveFeatureProperties } from '../../data/geoData';

// ── Types ─────────────────────────────────────────────────────────────────────

export type BasemapKey = 'osm' | 'satellite' | 'terrain';
export type VizType = 'trueColor' | 'falseColor' | 'mangrove' | 'priority';

export interface LayerVisibility {
  mangroveZones: boolean;
  monitoringPoints: boolean;
  communityReports: boolean;
  priorityAreas: boolean;
}

export interface MapState {
  basemap: BasemapKey;
  vizType: VizType;
  year: number;
  layers: LayerVisibility;
  selectedFeature: MangroveFeatureProperties | null;
  clickCoords: { lat: number; lng: number } | null;
  zoom: number;
}

interface MangroveMapCoreProps {
  mapState: MapState;
  onFeatureSelect: (props: MangroveFeatureProperties | null) => void;
  onCoordsChange: (coords: { lat: number; lng: number }) => void;
  onZoomChange: (zoom: number) => void;
  flyToTarget?: { center: [number, number]; zoom: number } | null;
  fullscreen: boolean;
}

// ── Color helpers ──────────────────────────────────────────────────────────────

const STATUS_FILL: Record<string, string> = {
  'Kerapatan Tinggi': '#059669',
  'Kerapatan Sedang': '#A8BFA5',
  'Kerapatan Rendah': '#D97706',
  'Terdegradasi': '#DC2626',
};

const REPORT_COLORS: Record<string, string> = {
  'Pencemaran Limbah': '#D97706',
  'Abrasi Garis Pantai': '#0891B2',
  'Restorasi / Bibit Baru': '#059669',
  'Penebangan Liar': '#DC2626',
  'Kematian Pohon': '#7C3AED',
};

const BASEMAP_URLS: Record<BasemapKey, { url: string; attribution: string; maxZoom: number }> = {
  osm: {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '© <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors',
    maxZoom: 19,
  },
  satellite: {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles © <a href="https://www.esri.com" target="_blank">Esri</a> — Source: Esri, Maxar, GeoEye, Earthstar Geographics, CNES/Airbus DS, USDA, USGS, AeroGRID, IGN',
    maxZoom: 18,
  },
  terrain: {
    url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    attribution: '© <a href="https://opentopomap.org" target="_blank">OpenTopoMap</a> (CC-BY-SA) | © <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>',
    maxZoom: 17,
  },
};

// ── Map popup HTML builders ────────────────────────────────────────────────────

const buildMangrovePopup = (props: MangroveFeatureProperties, year: number): string => {
  const color = STATUS_FILL[props.status] || '#059669';
  return `
    <div class="mangrove-popup" style="min-width:260px;">
      <div style="background:linear-gradient(135deg,#174B32,#103D2B);padding:12px 14px;margin:-0px;border-radius:0;">
        <div style="font-size:9px;font-weight:700;color:#A8BFA5;text-transform:uppercase;letter-spacing:.08em;margin-bottom:4px;">Area Demonstrasi · Peta Hidup Mangrove</div>
        <div style="font-size:13px;font-weight:800;color:#fff;line-height:1.3;">${props.name}</div>
        <div style="font-size:11px;color:rgba(255,255,255,.65);margin-top:2px;">${props.kabupaten}, Prov. Bengkulu</div>
      </div>
      <div style="padding:12px 14px;">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:10px;">
          <div style="background:#F5F8F5;border-radius:10px;padding:8px;">
            <div style="font-size:9px;color:#A8BFA5;font-weight:600;text-transform:uppercase;letter-spacing:.06em;">Luas Area</div>
            <div style="font-size:15px;font-weight:800;color:#174B32;margin-top:1px;">${props.areaHa} ha</div>
          </div>
          <div style="background:#F5F8F5;border-radius:10px;padding:8px;">
            <div style="font-size:9px;color:#A8BFA5;font-weight:600;text-transform:uppercase;letter-spacing:.06em;">Skor Kesehatan</div>
            <div style="font-size:15px;font-weight:800;color:#174B32;margin-top:1px;">${props.healthScore}%</div>
          </div>
        </div>
        <div class="pop-row"><span class="pop-label">Status Kerapatan</span>
          <span style="font-size:9px;font-weight:700;padding:2px 8px;border-radius:999px;background:${color}18;color:${color};border:1px solid ${color}30;">${props.status}</span>
        </div>
        <div class="pop-row"><span class="pop-label">Spesies Dominan</span><span class="pop-val" style="font-style:italic;font-size:10px;">${props.dominantSpecies}</span></div>
        <div class="pop-row"><span class="pop-label">Periode Pengamatan</span><span class="pop-val">Simulasi ${year}</span></div>
        <div class="pop-row" style="margin-top:4px;"><span class="pop-label">CMRI / MVI / NDMI</span><span class="pop-val">${props.cmri.toFixed(2)} / ${props.mvi.toFixed(2)} / ${props.ndmi.toFixed(2)}</span></div>
        <div style="margin-top:10px;padding-top:8px;border-top:1px solid #E2EAE2;font-size:9px;color:#D97706;font-weight:600;">
          ⚠ Poligon demonstrasi — batas belum diverifikasi survei lapangan & klasifikasi GEE
        </div>
      </div>
    </div>`;
};

const buildReportPopup = (r: typeof REPORT_MARKERS[0]): string => {
  const color = REPORT_COLORS[r.category] || '#718075';
  return `
    <div class="mangrove-popup" style="min-width:220px;">
      <div style="padding:12px 14px;border-bottom:1px solid #E2EAE2;">
        <div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:${color};margin-bottom:4px;">${r.category}</div>
        <div style="font-size:12px;font-weight:700;color:#1D2A22;">${r.kabupaten}</div>
        <div style="font-size:10px;color:#718075;margin-top:1px;">Laporan ${r.id}</div>
      </div>
      <div style="padding:10px 14px;">
        <div class="pop-row"><span class="pop-label">Status</span><span class="pop-val">${r.status}</span></div>
        <div class="pop-row"><span class="pop-label">Tanggal</span><span class="pop-val">${r.date}</span></div>
        <div class="pop-row"><span class="pop-label">Koordinat</span><span class="pop-val" style="font-family:monospace;font-size:10px;">${r.lat.toFixed(4)}°, ${r.lng.toFixed(4)}°</span></div>
        <div style="margin-top:8px;font-size:9px;color:#D97706;font-weight:600;">◈ Data demonstrasi</div>
      </div>
    </div>`;
};

// ── Component ─────────────────────────────────────────────────────────────────

export const MangroveMapCore: React.FC<MangroveMapCoreProps> = ({
  mapState,
  onFeatureSelect,
  onCoordsChange,
  onZoomChange,
  flyToTarget,
  fullscreen,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const tileLayerRef = useRef<TileLayer | null>(null);
  const mangroveLayerRef = useRef<LayerGroup | null>(null);
  const markerLayerRef = useRef<LayerGroup | null>(null);
  const reportLayerRef = useRef<LayerGroup | null>(null);
  const [ready, setReady] = useState(false);

  // Wait for Leaflet CDN
  useEffect(() => {
    const wait = () => { if (window.L) setReady(true); else setTimeout(wait, 150); };
    wait();
  }, []);

  // Init map once
  useEffect(() => {
    if (!ready || !containerRef.current || mapRef.current) return;
    const L = window.L;

    const map = L.map(containerRef.current, {
      center: [-3.5, 102.0],
      zoom: 9,
      zoomControl: false,
      scrollWheelZoom: true,
      attributionControl: true,
    });

    // Initial tile layer
    const cfg = BASEMAP_URLS[mapState.basemap];
    tileLayerRef.current = L.tileLayer(cfg.url, { attribution: cfg.attribution, maxZoom: cfg.maxZoom }).addTo(map);

    // Layer groups
    mangroveLayerRef.current = L.layerGroup().addTo(map);
    markerLayerRef.current = L.layerGroup().addTo(map);
    reportLayerRef.current = L.layerGroup().addTo(map);

    // Click: show coordinates
    map.on('click', (e: LeafletEvent) => {
      if (e.latlng) onCoordsChange({ lat: e.latlng.lat, lng: e.latlng.lng });
    });

    // Zoom change
    map.on('zoomend', (e: LeafletEvent) => {
      onZoomChange(e.target ? (e.target as LeafletMap).getZoom() : 9);
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
      tileLayerRef.current = null;
      mangroveLayerRef.current = null;
      markerLayerRef.current = null;
      reportLayerRef.current = null;
    };
  }, [ready]);

  // Swap basemap
  useEffect(() => {
    if (!mapRef.current || !tileLayerRef.current || !ready) return;
    const L = window.L;
    const map = mapRef.current;
    map.removeLayer(tileLayerRef.current);
    const cfg = BASEMAP_URLS[mapState.basemap];
    tileLayerRef.current = L.tileLayer(cfg.url, { attribution: cfg.attribution, maxZoom: cfg.maxZoom }).addTo(map);
  }, [mapState.basemap, ready]);

  // Redraw mangrove polygons
  useEffect(() => {
    if (!mapRef.current || !mangroveLayerRef.current || !ready) return;
    const L = window.L;
    const group = mangroveLayerRef.current;
    group.clearLayers();
    if (!mapState.layers.mangroveZones) return;

    MANGROVE_GEOJSON.features.forEach(f => {
      const color = STATUS_FILL[f.properties.status];
      const coords = f.geometry.coordinates[0].map(c => [c[1], c[0]] as LatLng);
      const polygon = (window.L as unknown as {
        polygon: (latlngs: LatLng[], opts: object) => Layer & {
          bindPopup: (html: string, opts?: object) => void;
          on: (event: string, cb: () => void) => void;
        }
      }).polygon(coords, {
        color,
        weight: 2,
        fillColor: color,
        fillOpacity: mapState.vizType === 'mangrove' ? 0.5 : 0.3,
        dashArray: '4 3',
      });

      polygon.bindPopup(buildMangrovePopup(f.properties, mapState.year), { maxWidth: 300 });
      polygon.on('click', () => onFeatureSelect(f.properties));
      group.addLayer(polygon as unknown as Layer);
    });
  }, [mapState.layers.mangroveZones, mapState.vizType, mapState.year, ready]);

  // Redraw monitoring point markers
  useEffect(() => {
    if (!mapRef.current || !markerLayerRef.current || !ready) return;
    const L = window.L;
    const group = markerLayerRef.current;
    group.clearLayers();
    if (!mapState.layers.monitoringPoints) return;

    MANGROVE_GEOJSON.features.forEach(f => {
      const coords = f.geometry.coordinates[0];
      const lats = coords.map(c => c[1]);
      const lngs = coords.map(c => c[0]);
      const centerLat = (Math.min(...lats) + Math.max(...lats)) / 2;
      const centerLng = (Math.min(...lngs) + Math.max(...lngs)) / 2;
      const color = STATUS_FILL[f.properties.status];
      const isSelected = mapState.selectedFeature?.id === f.properties.id;

      const icon = L.divIcon({
        html: `<div style="width:${isSelected ? 36 : 28}px;height:${isSelected ? 36 : 28}px;border-radius:50%;background:${color};border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,.3);transition:all .2s;display:flex;align-items:center;justify-content:center;">
          ${isSelected ? '<div style="width:10px;height:10px;background:white;border-radius:50%;"></div>' : ''}
        </div>`,
        className: '',
        iconSize: [isSelected ? 36 : 28, isSelected ? 36 : 28],
        iconAnchor: [isSelected ? 18 : 14, isSelected ? 18 : 14],
        popupAnchor: [0, -20],
      });

      const marker = L.marker([centerLat, centerLng] as LatLng, { icon });
      marker.bindPopup(buildMangrovePopup(f.properties, mapState.year), { maxWidth: 300 });
      marker.bindTooltip(f.properties.name, { direction: 'top', offset: [0, -16], className: 'mangrove-tooltip' });
      group.addLayer(marker as unknown as Layer);
    });
  }, [mapState.layers.monitoringPoints, mapState.selectedFeature, mapState.year, ready]);

  // Redraw community report markers
  useEffect(() => {
    if (!mapRef.current || !reportLayerRef.current || !ready) return;
    const L = window.L;
    const group = reportLayerRef.current;
    group.clearLayers();
    if (!mapState.layers.communityReports) return;

    REPORT_MARKERS.forEach(r => {
      const color = REPORT_COLORS[r.category] || '#718075';
      const icon = L.divIcon({
        html: `<div style="width:22px;height:22px;border-radius:4px;background:${color};border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,.3);display:flex;align-items:center;justify-content:center;">
          <div style="width:8px;height:8px;background:white;border-radius:1px;"></div>
        </div>`,
        className: '',
        iconSize: [22, 22],
        iconAnchor: [11, 11],
        popupAnchor: [0, -14],
      });
      const marker = L.marker([r.lat, r.lng] as LatLng, { icon });
      marker.bindPopup(buildReportPopup(r), { maxWidth: 280 });
      marker.bindTooltip(`${r.id}: ${r.category}`, { direction: 'top', offset: [0, -14] });
      group.addLayer(marker as unknown as Layer);
    });
  }, [mapState.layers.communityReports, ready]);

  // Fly to target when kabupaten changes
  useEffect(() => {
    if (!mapRef.current || !flyToTarget || !ready) return;
    mapRef.current.setView(flyToTarget.center, flyToTarget.zoom);
  }, [flyToTarget, ready]);

  // Invalidate map size when fullscreen toggles
  useEffect(() => {
    if (!mapRef.current) return;
    setTimeout(() => mapRef.current?.invalidateSize(), 100);
  }, [fullscreen]);

  return (
    <div className="relative w-full h-full">
      <div ref={containerRef} className="w-full h-full" />
      {!ready && (
        <div className="absolute inset-0 bg-[#F5F8F5] flex flex-col items-center justify-center gap-3 z-50">
          <div className="w-8 h-8 border-3 border-[#174B32]/20 border-t-[#174B32] rounded-full animate-spin" />
          <span className="text-[12px] text-[#718075] font-medium">Memuat Leaflet Map Engine...</span>
        </div>
      )}
    </div>
  );
};
