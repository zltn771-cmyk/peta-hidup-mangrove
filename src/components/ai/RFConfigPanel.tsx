import React from 'react';
import { Settings, Info, ChevronDown, ChevronUp } from 'lucide-react';
import { RFHyperparameters } from '../../types/classification';

interface RFConfigPanelProps {
  config: RFHyperparameters;
  onChange: (config: RFHyperparameters) => void;
  disabled?: boolean;
}

interface ParamSliderProps {
  label: string;
  key: keyof RFHyperparameters;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (val: number) => void;
  description: string;
  disabled?: boolean;
  format?: (val: number) => string;
}

const ParamSlider: React.FC<ParamSliderProps> = ({
  label, min, max, step, value, onChange, description, disabled, format,
}) => {
  const displayVal = format ? format(value) : value.toString();
  const pct = ((value - min) / (max - min)) * 100;

  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center text-xs">
        <label className="font-semibold text-[#1D2A22]">{label}</label>
        <span className="font-mono font-bold text-[#174B32] bg-[#F5F8F5] border border-[#E2EAE2] px-2 py-0.5 rounded-lg">
          {displayVal}
        </span>
      </div>
      <div className="relative">
        <div className="h-1.5 bg-[#E2EAE2] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#174B32] rounded-full transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full opacity-0 h-5 cursor-pointer disabled:cursor-not-allowed"
        />
      </div>
      <p className="text-[10px] text-[#718075]">{description}</p>
    </div>
  );
};

export const RFConfigPanel: React.FC<RFConfigPanelProps> = ({ config, onChange, disabled }) => {
  const [expanded, setExpanded] = React.useState(true);

  const update = (key: keyof RFHyperparameters, val: number) => {
    onChange({ ...config, [key]: val });
  };

  return (
    <div className="bg-white rounded-2xl border border-[#E2EAE2] shadow-xs p-5">
      <button
        onClick={() => setExpanded(prev => !prev)}
        className="w-full flex items-center justify-between mb-3 pb-3 border-b border-[#E2EAE2]"
      >
        <div className="flex items-center gap-2">
          <Settings size={15} className="text-[#174B32]" />
          <h2 className="font-extrabold text-sm text-[#1D2A22]">Konfigurasi Hyperparameter Random Forest</h2>
        </div>
        {expanded ? <ChevronUp size={15} className="text-[#718075]" /> : <ChevronDown size={15} className="text-[#718075]" />}
      </button>

      {expanded && (
        <div className="space-y-5 text-xs">
          {/* Primary params */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <ParamSlider
              label="Jumlah Pohon (n_estimators)"
              key="nEstimators"
              min={5}
              max={100}
              step={5}
              value={config.nEstimators}
              onChange={v => update('nEstimators', v)}
              disabled={disabled}
              description="Jumlah decision tree dalam ensemble. Lebih banyak pohon meningkatkan akurasi & waktu komputasi."
            />
            <ParamSlider
              label="Kedalaman Maksimum (max_depth)"
              key="maxDepth"
              min={2}
              max={12}
              step={1}
              value={config.maxDepth}
              onChange={v => update('maxDepth', v)}
              disabled={disabled}
              description="Batas kedalaman pembelahan node. Nilai besar berisiko overfitting pada data kecil."
            />
            <ParamSlider
              label="Min. Sampel untuk Split"
              key="minSamplesSplit"
              min={2}
              max={12}
              step={1}
              value={config.minSamplesSplit}
              onChange={v => update('minSamplesSplit', v)}
              disabled={disabled}
              description="Minimum sampel yang diperlukan sebelum suatu node boleh dibelah (regularisasi)."
            />
            <ParamSlider
              label="Min. Sampel per Daun"
              key="minSamplesLeaf"
              min={1}
              max={8}
              step={1}
              value={config.minSamplesLeaf}
              onChange={v => update('minSamplesLeaf', v)}
              disabled={disabled}
              description="Minimum sampel yang harus ada di setiap node daun. Mencegah pohon terlalu spesifik."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 border-t border-[#F0F4F0] pt-4">
            <ParamSlider
              label="Proporsi Data Testing"
              key="testSize"
              min={0.1}
              max={0.5}
              step={0.05}
              value={config.testSize}
              onChange={v => update('testSize', v)}
              disabled={disabled}
              format={v => `${(v * 100).toFixed(0)}%`}
              description="Persentase data yang disisihkan untuk evaluasi independen (tidak digunakan saat training)."
            />
            <ParamSlider
              label="Random Seed"
              key="randomSeed"
              min={0}
              max={9999}
              step={1}
              value={config.randomSeed}
              onChange={v => update('randomSeed', v)}
              disabled={disabled}
              description="Seed untuk pseudo-random number generator (Reproducibility). Gunakan nilai tetap untuk hasil yang konsisten."
            />
          </div>

          {/* Summary row */}
          <div className="bg-[#F5F8F5] border border-[#E2EAE2] p-3 rounded-xl grid grid-cols-3 sm:grid-cols-6 gap-2 text-center text-[11px]">
            {[
              ['n_estimators', config.nEstimators],
              ['max_depth', config.maxDepth],
              ['min_split', config.minSamplesSplit],
              ['min_leaf', config.minSamplesLeaf],
              ['test_size', `${(config.testSize * 100).toFixed(0)}%`],
              ['seed', config.randomSeed],
            ].map(([key, val]) => (
              <div key={String(key)}>
                <div className="font-mono text-[10px] text-[#718075]">{key}</div>
                <div className="font-bold text-[#174B32] mt-0.5">{val}</div>
              </div>
            ))}
          </div>

          <div className="flex items-start gap-2 p-3 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] text-[11px] text-[#1E3A5F]">
            <Info size={13} className="text-[#3B82F6] flex-shrink-0 mt-0.5" />
            <span>
              Hyperparameter ini diterapkan pada <strong>implementasi Random Forest murni TypeScript</strong> yang berjalan langsung di browser.
              Untuk dataset lebih besar (&gt;10.000 sampel) dan pipeline produksi, gunakan backend Python (Scikit-learn) atau GEE Classifier API.
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
