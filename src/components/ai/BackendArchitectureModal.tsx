import React, { useState } from 'react';
import { X, Code2, Cpu, Server, Terminal, ChevronDown, ChevronUp } from 'lucide-react';
import { PYTHON_BACKEND_CODE, GEE_JAVASCRIPT_CODE } from '../../services/geeArchitectureService';

interface BackendArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BackendArchitectureModal: React.FC<BackendArchitectureModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'python' | 'gee'>('overview');
  const [pyExpanded, setPyExpanded] = useState(false);
  const [geeExpanded, setGeeExpanded] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-[#1D2A22]/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl border border-[#E2EAE2] shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-[#174B32] p-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2 text-white">
            <Cpu size={18} className="text-[#A8BFA5]" />
            <div>
              <h2 className="font-extrabold text-sm">Arsitektur Backend & Pipeline GEE</h2>
              <p className="text-[11px] text-[#A8BFA5]">Random Forest Microservice — Perencanaan Teknis Tahap Lanjut</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center transition-colors text-white"
          >
            <X size={16} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[#E2EAE2] flex-shrink-0">
          {[
            { id: 'overview', label: 'Arsitektur Modular', icon: <Server size={13} /> },
            { id: 'python', label: 'Python FastAPI + Scikit-Learn', icon: <Terminal size={13} /> },
            { id: 'gee', label: 'Google Earth Engine JS', icon: <Code2 size={13} /> },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-[#174B32] text-[#174B32] bg-[#F5F8F5]'
                  : 'border-transparent text-[#718075] hover:text-[#1D2A22]'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
          {activeTab === 'overview' && (
            <div className="space-y-4">
              <p className="text-[#718075] leading-relaxed">
                Sistem klasifikasi mangrove PETA HIDUP MANGROVE dibangun di atas arsitektur modular tiga lapisan.
                Lapisan frontend (browser) menangani interaksi dan visualisasi. Lapisan backend (Python microservice)
                menjalankan training dan prediksi skala besar. Lapisan GEE mengelola citra satelit dan ekspor spasial.
              </p>

              <div className="space-y-3">
                {[
                  {
                    layer: 'Frontend Layer (React + TypeScript)',
                    color: '#174B32',
                    items: [
                      'Upload & validasi CSV dataset sampel lapangan',
                      'Konfigurasi hyperparameter Random Forest (n_estimators, max_depth, dsb.)',
                      'Implementasi RF in-browser (prototype, dataset ≤500 titik)',
                      'Visualisasi confusion matrix, feature importance, comparison',
                      'Dashboard hasil evaluasi dan spatial summary',
                    ],
                    status: '✅ Aktif pada versi ini',
                  },
                  {
                    layer: 'Backend Layer (Python FastAPI + Scikit-Learn)',
                    color: '#0891B2',
                    items: [
                      'Endpoint POST /api/v1/train (menerima CSV, mengembalikan JSON metrik)',
                      'Scikit-Learn RandomForestClassifier dengan paralel CPU (n_jobs=-1)',
                      'Stratified train-test split dengan cross-validation opsional',
                      'Endpoint POST /api/v1/predict (inferensi batch untuk titik pixel baru)',
                      'Model serialization ke joblib format untuk persistence',
                    ],
                    status: '📋 Direncanakan — Tahap 2 Pengembangan',
                  },
                  {
                    layer: 'GEE Integration Layer (Earth Engine JavaScript/Python API)',
                    color: '#7C3AED',
                    items: [
                      'Sentinel-2 SR Harmonized cloud compositing (2021–2026)',
                      'Kalkulasi CMRI, MVI, NDMI per pixel pada seluruh pesisir Bengkulu',
                      'Sample extraction untuk training data lapangan ke GEE ee.FeatureCollection',
                      'GEE smileRandomForest classifier training dan spatial prediction',
                      'Export klasifikasi sebagai GeoTIFF ke Google Drive atau Cloud Storage',
                    ],
                    status: '📋 Direncanakan — Memerlukan GEE Service Account',
                  },
                ].map(layer => (
                  <div key={layer.layer} className="p-3.5 rounded-xl border border-[#E2EAE2] bg-[#F5F8F5]">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="font-bold text-[11px]" style={{ color: layer.color }}>
                        {layer.layer}
                      </div>
                      <span className="text-[10px] text-[#718075]">{layer.status}</span>
                    </div>
                    <ul className="space-y-0.5 text-[11px] text-[#718075]">
                      {layer.items.map((item, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-[#A8BFA5] flex-shrink-0 mt-0.5">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'python' && (
            <div className="space-y-3">
              <p className="text-[#718075]">
                Contoh arsitektur microservice FastAPI untuk integrasi backend Scikit-Learn dengan REST API.
                Ini adalah blueprint teknis, bukan kode yang sudah berjalan (memerlukan Python 3.11+, FastAPI, scikit-learn, pandas).
              </p>
              <button
                onClick={() => setPyExpanded(prev => !prev)}
                className="w-full flex items-center justify-between px-3 py-2 bg-[#1D2A22] text-[#A8BFA5] rounded-xl text-xs font-mono"
              >
                <span># Python FastAPI + Scikit-Learn RF Blueprint</span>
                {pyExpanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
              </button>
              {pyExpanded && (
                <pre className="bg-[#1D2A22] text-[#A8BFA5] text-[10px] leading-relaxed rounded-xl p-4 overflow-x-auto font-mono whitespace-pre-wrap">
                  {PYTHON_BACKEND_CODE}
                </pre>
              )}
            </div>
          )}

          {activeTab === 'gee' && (
            <div className="space-y-3">
              <p className="text-[#718075]">
                Blueprint kode Google Earth Engine JavaScript API untuk preprocessing Sentinel-2 dan klasifikasi seluruh
                pesisir Bengkulu dengan GEE smileRandomForest classifier. Memerlukan GEE account dan service account JSON.
              </p>
              <button
                onClick={() => setGeeExpanded(prev => !prev)}
                className="w-full flex items-center justify-between px-3 py-2 bg-[#103D2B] text-[#A8BFA5] rounded-xl text-xs font-mono"
              >
                <span>// GEE JavaScript — Sentinel-2 RF Classification Blueprint</span>
                {geeExpanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
              </button>
              {geeExpanded && (
                <pre className="bg-[#103D2B] text-[#A8BFA5] text-[10px] leading-relaxed rounded-xl p-4 overflow-x-auto font-mono whitespace-pre-wrap">
                  {GEE_JAVASCRIPT_CODE}
                </pre>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
