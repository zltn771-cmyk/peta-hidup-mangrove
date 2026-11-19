import React from 'react';
import { Satellite, X, ExternalLink, AlertTriangle, Layers, CheckCircle2, Cpu } from 'lucide-react';
import { SENTINEL2_CONFIG } from '../../data/geoData';

interface SatelliteMetadataPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SatelliteMetadataPanel: React.FC<SatelliteMetadataPanelProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="absolute top-3 right-3 z-[1000] w-84 sm:w-96 max-h-[calc(100%-24px)] bg-white/95 backdrop-blur-md rounded-2xl border border-[#E2EAE2] shadow-xl flex flex-col overflow-hidden text-xs animate-in fade-in slide-in-from-right-4 duration-200">
      {/* Header */}
      <div className="px-4 py-3 bg-[#174B32] text-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Satellite size={16} className="text-[#A8BFA5]" />
          <div>
            <h3 className="font-bold text-[13px] leading-tight">Spesifikasi Sentinel-2</h3>
            <p className="text-[10px] text-[#A8BFA5]">Arsitektur Integrasi GEE</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white"
          title="Tutup panel"
        >
          <X size={14} />
        </button>
      </div>

      <div className="p-4 overflow-y-auto space-y-4">
        {/* Status Alert */}
        <div className="p-3 rounded-xl bg-[#FFFBEB] border border-[#FDE68A] text-[#92400E]">
          <div className="flex items-center gap-1.5 font-bold text-[11px] mb-1">
            <AlertTriangle size={13} className="text-[#D97706]" />
            <span>Status: Google Earth Engine Belum Aktif</span>
          </div>
          <p className="text-[10px] text-[#B45309] leading-relaxed">
            Data spasial pada peta saat ini menggunakan koordinat demonstrasi WGS84. Backend integrasi GEE Python SDK disiapkan pada fase berikutnya.
          </p>
        </div>

        {/* Dataset Info */}
        <div className="space-y-1.5">
          <div className="text-[10px] font-bold text-[#718075] uppercase tracking-wider">Target Dataset</div>
          <div className="p-2.5 rounded-xl bg-[#F5F8F5] border border-[#E2EAE2]">
            <div className="font-mono font-semibold text-[#174B32] text-[11px] break-all">{SENTINEL2_CONFIG.dataset}</div>
            <div className="text-[10px] text-[#718075] mt-1">Level-2A Bottom of Atmosphere (BOA) Reflectance with Orthorectification</div>
          </div>
        </div>

        {/* Bands Table */}
        <div className="space-y-1.5">
          <div className="text-[10px] font-bold text-[#718075] uppercase tracking-wider flex items-center justify-between">
            <span>Band Spektral yang Dipetakan</span>
            <span className="text-[#174B32]">6 Band Relevan</span>
          </div>
          <div className="border border-[#E2EAE2] rounded-xl overflow-hidden">
            <table className="w-full text-left text-[10px]">
              <thead className="bg-[#F5F8F5] text-[#718075] border-b border-[#E2EAE2]">
                <tr>
                  <th className="py-1.5 px-2 font-semibold">Band</th>
                  <th className="py-1.5 px-2 font-semibold">Panjang</th>
                  <th className="py-1.5 px-2 font-semibold">Resolusi</th>
                  <th className="py-1.5 px-2 font-semibold">Penggunaan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0F4F0] text-[#1D2A22]">
                {Object.entries(SENTINEL2_CONFIG.bands).map(([key, info]) => (
                  <tr key={key} className="hover:bg-[#F5F8F5]/60 transition-colors">
                    <td className="py-1.5 px-2 font-bold font-mono text-[#174B32]">{key}</td>
                    <td className="py-1.5 px-2 text-[#718075]">{info.wavelength}</td>
                    <td className="py-1.5 px-2 font-semibold text-[#059669]">{info.resolution}</td>
                    <td className="py-1.5 px-2 text-[#718075]">{info.use}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Visualizations planned */}
        <div className="space-y-1.5">
          <div className="text-[10px] font-bold text-[#718075] uppercase tracking-wider flex items-center gap-1">
            <Layers size={11} className="text-[#174B32]" />
            <span>Preset Komposit Spektral</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[10px]">
            {Object.entries(SENTINEL2_CONFIG.visualizations).map(([key, viz]) => (
              <div key={key} className="p-2 rounded-lg bg-[#F5F8F5] border border-[#E2EAE2]">
                <div className="font-semibold text-[#174B32] capitalize">{key}</div>
                <div className="font-mono text-[9px] text-[#059669] mt-0.5">{viz.bands.join(' - ')}</div>
                <div className="text-[9px] text-[#718075] mt-1 leading-tight">{viz.description}</div>
              </div>
            ))}
          </div>
        </div>

        {/* GEE Roadmap */}
        <div className="space-y-1.5">
          <div className="text-[10px] font-bold text-[#718075] uppercase tracking-wider flex items-center gap-1">
            <Cpu size={11} className="text-[#174B32]" />
            <span>Rencana Pipeline GEE</span>
          </div>
          <ul className="space-y-1 text-[10px] text-[#718075]">
            <li className="flex items-start gap-1.5">
              <CheckCircle2 size={12} className="text-[#A8BFA5] flex-shrink-0 mt-0.5" />
              <span>Cloud Masking menggunakan QA60 band & SCL probabilitas awan</span>
            </li>
            <li className="flex items-start gap-1.5">
              <CheckCircle2 size={12} className="text-[#A8BFA5] flex-shrink-0 mt-0.5" />
              <span>Median temporal compositing (kuartal/tahunan) untuk hilangkan noise</span>
            </li>
            <li className="flex items-start gap-1.5">
              <CheckCircle2 size={12} className="text-[#A8BFA5] flex-shrink-0 mt-0.5" />
              <span>Kalkulasi otomatis rasio CMRI, MVI, & NDMI per pixel 10m</span>
            </li>
            <li className="flex items-start gap-1.5">
              <CheckCircle2 size={12} className="text-[#A8BFA5] flex-shrink-0 mt-0.5" />
              <span>Tile layer streaming langsung ke antarmuka peta Leaflet</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Footer link */}
      <div className="px-4 py-2.5 bg-[#F5F8F5] border-t border-[#E2EAE2] flex items-center justify-between text-[10px] text-[#718075]">
        <span>Dokumentasi Copernicus ESA</span>
        <a
          href="https://dataspace.copernicus.eu/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-[#174B32] font-semibold hover:underline"
        >
          <span>dataspace.copernicus.eu</span>
          <ExternalLink size={10} />
        </a>
      </div>
    </div>
  );
};
