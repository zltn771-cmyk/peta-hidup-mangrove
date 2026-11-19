import React, { useState, useCallback } from 'react';
import {
  Satellite,
  Info,
  Layers,
  MapPin,
  Activity,
  X,
  AlertTriangle,
  Compass,
  Sparkles,
  TreePine,
  Droplets,
  ExternalLink,
} from 'lucide-react';
import { SectionHeader } from '../components/common/SectionHeader';
import { Badge } from '../components/common/Badge';
import { MangroveMapCore, MapState, BasemapKey, VizType, LayerVisibility } from '../components/map/MangroveMapCore';
import { MapControlPanel } from '../components/map/MapControlPanel';
import { MapLegend } from '../components/map/MapLegend';
import { SatelliteMetadataPanel } from '../components/map/SatelliteMetadataPanel';
import { MapSearchBar } from '../components/map/MapSearchBar';
import { BENGKULU_KABUPATENS, MangroveFeatureProperties } from '../data/geoData';

export const PetaPage: React.FC = () => {
  // Map configuration state
  const [mapState, setMapState] = useState<MapState>({
    basemap: 'osm',
    vizType: 'mangrove',
    year: 2026,
    layers: {
      mangroveZones: true,
      monitoringPoints: true,
      communityReports: true,
      priorityAreas: false,
    },
    selectedFeature: null,
    clickCoords: null,
    zoom: 9,
  });

  const [kabupatenId, setKabupatenId] = useState('all');
  const [flyToTarget, setFlyToTarget] = useState<{ center: [number, number]; zoom: number } | null>(null);
  const [isControlPanelOpen, setIsControlPanelOpen] = useState(true);
  const [isSatelliteInfoOpen, setIsSatelliteInfoOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [yearNotice, setYearNotice] = useState<string | null>(null);

  // Basemap switcher
  const handleBasemapChange = useCallback((basemap: BasemapKey) => {
    setMapState(prev => ({ ...prev, basemap }));
  }, []);

  // Layer toggle
  const handleLayerToggle = useCallback((key: keyof LayerVisibility) => {
    setMapState(prev => ({
      ...prev,
      layers: { ...prev.layers, [key]: !prev.layers[key] },
    }));
  }, []);

  // Year slider
  const handleYearChange = useCallback((year: number) => {
    setMapState(prev => ({ ...prev, year }));
    setYearNotice(`Tahun ${year} dipilih. Catatan: Layer multi-temporal Sentinel-2 membutuhkan integrasi pipeline GEE.`);
    setTimeout(() => setYearNotice(null), 4500);
  }, []);

  // Visualization change
  const handleVizChange = useCallback((vizType: VizType) => {
    setMapState(prev => ({ ...prev, vizType }));
  }, []);

  // Kabupaten selector
  const handleKabupatenChange = useCallback((id: string, center: [number, number], zoom: number) => {
    setKabupatenId(id);
    setFlyToTarget({ center, zoom });
  }, []);

  // Direct flyTo helper
  const handleFlyTo = useCallback((center: [number, number], zoom: number) => {
    setFlyToTarget({ center, zoom });
  }, []);

  // Reset to default Bengkulu overview
  const handleReset = useCallback(() => {
    setKabupatenId('all');
    setFlyToTarget({ center: [-3.5, 102.0], zoom: 9 });
  }, []);

  // Feature selection
  const handleFeatureSelect = useCallback((props: MangroveFeatureProperties | null) => {
    setMapState(prev => ({ ...prev, selectedFeature: props }));
  }, []);

  // Coordinate tracking
  const handleCoordsChange = useCallback((coords: { lat: number; lng: number }) => {
    setMapState(prev => ({ ...prev, clickCoords: coords }));
  }, []);

  // Zoom tracking
  const handleZoomChange = useCallback((zoom: number) => {
    setMapState(prev => ({ ...prev, zoom }));
  }, []);

  return (
    <div className={`space-y-4 ${isFullscreen ? 'fixed inset-0 z-50 bg-[#F5F8F5] p-3 sm:p-4 overflow-hidden flex flex-col' : ''}`}>
      {/* Page Header (hidden in fullscreen to maximize map space) */}
      {!isFullscreen && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-semibold text-[#174B32] uppercase tracking-wider">GIS Studio</span>
              <span className="text-[#A8BFA5]">/</span>
              <span className="text-[11px] text-[#718075]">Pesisir Bengkulu</span>
              <Badge variant="simulated">Data Demonstrasi</Badge>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-[#1D2A22] tracking-tight">
              Peta Geospasial Mangrove
            </h1>
            <p className="text-xs sm:text-sm text-[#718075] mt-0.5">
              Visualisasi spasial dan eksplorasi tutupan ekosistem mangrove Provinsi Bengkulu
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="inline-flex items-center gap-1.5 text-xs text-[#718075] bg-white border border-[#E2EAE2] px-3 py-1.5 rounded-xl shadow-xs">
              <Satellite size={13} className="text-[#174B32]" />
              <span className="font-medium">Sentinel-2 MSI (10m)</span>
            </span>
            <button
              onClick={() => setIsSatelliteInfoOpen(prev => !prev)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#174B32] bg-[#E2EAE2]/50 hover:bg-[#E2EAE2] border border-[#A8BFA5]/40 px-3 py-1.5 rounded-xl transition-colors shadow-xs"
            >
              <Info size={13} />
              <span>Arsitektur GEE</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Map Container Card */}
      <div
        className={`bg-white rounded-2xl border border-[#E2EAE2] shadow-sm flex flex-col overflow-hidden relative ${
          isFullscreen ? 'flex-1 h-full' : 'h-[calc(100vh-12.5rem)] min-h-[580px]'
        }`}
      >
        {/* Top Search & Actions Toolbar */}
        <MapSearchBar
          onFlyTo={handleFlyTo}
          onToggleControlPanel={() => setIsControlPanelOpen(prev => !prev)}
          isControlPanelOpen={isControlPanelOpen}
          onToggleSatelliteInfo={() => setIsSatelliteInfoOpen(prev => !prev)}
          isSatelliteInfoOpen={isSatelliteInfoOpen}
          isFullscreen={isFullscreen}
          onToggleFullscreen={() => setIsFullscreen(prev => !prev)}
          onReset={handleReset}
        />

        {/* Workspace: Control Panel + Leaflet Map */}
        <div className="flex-1 relative flex overflow-hidden">
          {/* Left Control Panel */}
          <MapControlPanel
            basemap={mapState.basemap}
            onBasemapChange={handleBasemapChange}
            layers={mapState.layers}
            onLayerToggle={handleLayerToggle}
            year={mapState.year}
            onYearChange={handleYearChange}
            vizType={mapState.vizType}
            onVizChange={handleVizChange}
            kabupatenId={kabupatenId}
            onKabupatenChange={handleKabupatenChange}
            onReset={handleReset}
            collapsed={!isControlPanelOpen}
            onToggleCollapse={() => setIsControlPanelOpen(prev => !prev)}
          />

          {/* Map Core Canvas */}
          <div className="flex-1 relative bg-[#E2EAE2] overflow-hidden">
            <MangroveMapCore
              mapState={mapState}
              onFeatureSelect={handleFeatureSelect}
              onCoordsChange={handleCoordsChange}
              onZoomChange={handleZoomChange}
              flyToTarget={flyToTarget}
              fullscreen={isFullscreen}
            />

            {/* Satellite Metadata Drawer/Panel Overlay */}
            <SatelliteMetadataPanel
              isOpen={isSatelliteInfoOpen}
              onClose={() => setIsSatelliteInfoOpen(false)}
            />

            {/* Year change floating notification */}
            {yearNotice && (
              <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] bg-[#1D2A22]/95 backdrop-blur-md text-white px-4 py-2 rounded-xl text-xs shadow-lg border border-[#A8BFA5]/30 flex items-center gap-2 animate-in fade-in slide-in-from-top-3 duration-200">
                <AlertTriangle size={14} className="text-[#FBBF24] flex-shrink-0" />
                <span>{yearNotice}</span>
              </div>
            )}

            {/* Coordinates & Zoom Level Pill */}
            <div className="absolute bottom-3 left-3 z-[990] bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-[#E2EAE2] shadow-sm text-[11px] text-[#1D2A22] flex items-center gap-3">
              <div className="flex items-center gap-1 font-mono">
                <Compass size={12} className="text-[#174B32]" />
                <span>
                  {mapState.clickCoords
                    ? `${Math.abs(mapState.clickCoords.lat).toFixed(4)}° S, ${mapState.clickCoords.lng.toFixed(4)}° E`
                    : 'Arahkan kursor / klik peta'}
                </span>
              </div>
              <span className="text-[#A8BFA5]">|</span>
              <span className="text-[#718075] font-semibold">Zoom {mapState.zoom}x</span>
            </div>

            {/* Feature Detail Drawer (Right side overlay when a zone is clicked) */}
            {mapState.selectedFeature && (
              <div className="absolute top-3 left-3 sm:left-auto sm:right-3 z-[1000] w-80 sm:w-88 bg-white/95 backdrop-blur-md rounded-2xl border border-[#E2EAE2] shadow-xl p-4 text-xs animate-in fade-in slide-in-from-right-4 duration-200">
                <div className="flex items-start justify-between gap-2 border-b border-[#E2EAE2] pb-3 mb-3">
                  <div>
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="w-2 h-2 rounded-full bg-[#059669]" />
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#718075]">Detail Kawasan</span>
                    </div>
                    <h3 className="font-bold text-sm text-[#1D2A22]">{mapState.selectedFeature.name}</h3>
                    <p className="text-[11px] text-[#718075] flex items-center gap-1 mt-0.5">
                      <MapPin size={11} className="text-[#174B32]" />
                      <span>{mapState.selectedFeature.kabupaten}, Bengkulu</span>
                    </p>
                  </div>
                  <button
                    onClick={() => handleFeatureSelect(null)}
                    className="p-1 rounded-lg hover:bg-[#F5F8F5] text-[#718075] hover:text-[#1D2A22]"
                    title="Tutup detail"
                  >
                    <X size={15} />
                  </button>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="bg-[#F5F8F5] p-2.5 rounded-xl border border-[#E2EAE2]">
                    <div className="text-[10px] text-[#718075] font-semibold">Estimasi Luas</div>
                    <div className="text-base font-extrabold text-[#174B32] mt-0.5">{mapState.selectedFeature.areaHa} ha</div>
                  </div>
                  <div className="bg-[#F5F8F5] p-2.5 rounded-xl border border-[#E2EAE2]">
                    <div className="text-[10px] text-[#718075] font-semibold">Skor Kesehatan</div>
                    <div className="text-base font-extrabold text-[#059669] mt-0.5">{mapState.selectedFeature.healthScore}%</div>
                  </div>
                </div>

                {/* Details list */}
                <div className="space-y-1.5 mb-3 text-[11px]">
                  <div className="flex justify-between py-1 border-b border-[#F0F4F0]">
                    <span className="text-[#718075]">Kerapatan:</span>
                    <span className="font-semibold text-[#1D2A22]">{mapState.selectedFeature.status}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#F0F4F0]">
                    <span className="text-[#718075]">Spesies Dominan:</span>
                    <span className="font-medium italic text-[#1D2A22] text-right max-w-[170px] truncate">
                      {mapState.selectedFeature.dominantSpecies}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#F0F4F0]">
                    <span className="text-[#718075]">Rasio CMRI:</span>
                    <span className="font-mono font-semibold text-[#174B32]">{mapState.selectedFeature.cmri.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#F0F4F0]">
                    <span className="text-[#718075]">Rasio MVI:</span>
                    <span className="font-mono font-semibold text-[#174B32]">{mapState.selectedFeature.mvi.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-[#718075]">Rasio NDMI:</span>
                    <span className="font-mono font-semibold text-[#174B32]">{mapState.selectedFeature.ndmi.toFixed(2)}</span>
                  </div>
                </div>

                {/* Simulation note alert */}
                <div className="p-2.5 rounded-xl bg-[#FFFBEB] border border-[#FDE68A] text-[10px] text-[#92400E]">
                  <p className="font-bold flex items-center gap-1 mb-0.5">
                    <AlertTriangle size={11} className="text-[#D97706]" />
                    <span>Data Demonstrasi</span>
                  </p>
                  <p className="leading-relaxed">{mapState.selectedFeature.note}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Legend Bar */}
        <MapLegend showReports={mapState.layers.communityReports} />
      </div>
    </div>
  );
};
