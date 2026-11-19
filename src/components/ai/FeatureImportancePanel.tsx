import React from 'react';
import { FeatureImportance, MethodComparisonResult } from '../../types/classification';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Award, TrendingUp } from 'lucide-react';

// ── Feature Importance Panel ──────────────────────────────────────────────────

interface FeatureImportancePanelProps {
  importances: FeatureImportance[];
}

const FEAT_COLORS: Record<string, string> = {
  CMRI: '#174B32',
  MVI: '#059669',
  NDMI: '#0891B2',
};

export const FeatureImportancePanel: React.FC<FeatureImportancePanelProps> = ({ importances }) => {
  const chartData = importances.map(f => ({
    name: f.feature,
    'Kontribusi (%)': parseFloat((f.importance * 100).toFixed(1)),
  }));

  return (
    <div className="bg-white rounded-2xl border border-[#E2EAE2] shadow-xs p-5">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#E2EAE2]">
        <TrendingUp size={16} className="text-[#174B32]" />
        <h2 className="font-extrabold text-sm text-[#1D2A22]">Feature Importance</h2>
        <span className="text-[10px] font-semibold text-[#059669] bg-[#ECFDF5] px-2 py-0.5 rounded-full border border-[#A7F3D0]">
          Mean Decrease Impurity
        </span>
      </div>

      {/* Horizontal bar chart */}
      <div className="h-40 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="vertical" margin={{ top: 0, right: 20, left: 10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F0F4F0" horizontal={false} />
            <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10, fill: '#718075' }} tickFormatter={v => `${v}%`} />
            <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: '#1D2A22', fontWeight: 600 }} width={40} />
            <Tooltip formatter={(v: unknown) => [`${Number(v).toFixed(1)}%`, 'Kontribusi']} />
            <Bar dataKey="Kontribusi (%)" radius={[0, 4, 4, 0]} maxBarSize={28}>
              {importances.map(f => (
                <Cell key={f.feature} fill={FEAT_COLORS[f.feature] || '#A8BFA5'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Detail cards */}
      <div className="space-y-2">
        {importances.map(f => (
          <div
            key={f.feature}
            className="p-3 rounded-xl bg-[#F5F8F5] border border-[#E2EAE2] flex items-start justify-between gap-3 text-xs"
          >
            <div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: FEAT_COLORS[f.feature] }} />
                <span className="font-bold text-[#1D2A22]">{f.feature}</span>
                <span className="text-[#718075]">— {f.fullName}</span>
                {f.rank === 1 && (
                  <span className="ml-1 text-[9px] font-bold text-[#D97706] bg-[#FFFBEB] px-1.5 py-0.5 rounded-full border border-[#FDE68A]">
                    #1 Terpenting
                  </span>
                )}
              </div>
              <p className="text-[11px] text-[#718075] mt-0.5">{f.description}</p>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="text-base font-extrabold" style={{ color: FEAT_COLORS[f.feature] }}>
                {(f.importance * 100).toFixed(1)}%
              </div>
              <div className="text-[10px] text-[#718075]">kontribusi</div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-3 p-3 rounded-xl bg-[#FFFBEB] border border-[#FDE68A] text-[11px] text-[#92400E]">
        <strong>Catatan:</strong> Feature importance mencerminkan kontribusi fitur dalam proses pembelahan node decision tree,
        bukan hubungan sebab-akibat ekologis. Nilai bergantung pada dataset dan konfigurasi model.
      </div>
    </div>
  );
};

// ── Method Comparison Panel ───────────────────────────────────────────────────

interface MethodComparisonPanelProps {
  results: MethodComparisonResult[];
}

const STATUS_STYLE: Record<MethodComparisonResult['validationStatus'], { bg: string; text: string; border: string }> = {
  'Teruji pada Test Set': { bg: '#ECFDF5', text: '#065F46', border: '#A7F3D0' },
  'Estimasi Baseline': { bg: '#FFFBEB', text: '#92400E', border: '#FDE68A' },
  'Model Terpilih': { bg: '#F0FDF4', text: '#14532D', border: '#86EFAC' },
};

export const MethodComparisonPanel: React.FC<MethodComparisonPanelProps> = ({ results }) => {
  const bestByAccuracy = results.reduce((best, r) => (r.overallAccuracy > best.overallAccuracy ? r : best), results[0]);

  const pct = (v: number) => `${(v * 100).toFixed(1)}%`;

  return (
    <div className="bg-white rounded-2xl border border-[#E2EAE2] shadow-xs p-5">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#E2EAE2]">
        <h2 className="font-extrabold text-sm text-[#1D2A22] flex items-center gap-2">
          <Award size={16} className="text-[#D97706]" />
          Perbandingan Metode Klasifikasi
        </h2>
        <span className="text-[10px] text-[#718075] italic">Hasil diuji pada test set yang sama</span>
      </div>

      {/* Warning: not claiming RF is best a priori */}
      <div className="mb-4 p-3 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] text-[11px] text-[#1E3A5F]">
        Perbandingan dilakukan secara empiris pada data testing yang identik.
        Metode dengan akurasi tertinggi berdasarkan data testing adalah: <strong>{bestByAccuracy.methodName}</strong>.
        Kesimpulan ini bergantung pada kualitas dan representativitas dataset yang digunakan.
      </div>

      {/* Comparison Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border border-[#E2EAE2] rounded-xl overflow-hidden">
          <thead className="bg-[#F5F8F5] text-[#718075] text-[10px] font-semibold uppercase tracking-wider">
            <tr>
              <th className="py-2.5 px-3">Metode</th>
              <th className="py-2.5 px-3">Input Fitur</th>
              <th className="py-2.5 px-3">OA (%)</th>
              <th className="py-2.5 px-3">Kappa</th>
              <th className="py-2.5 px-3">F1-Score</th>
              <th className="py-2.5 px-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F0F4F0]">
            {results.map((r, i) => {
              const isBest = r.methodName === bestByAccuracy.methodName;
              const style = STATUS_STYLE[r.validationStatus];
              return (
                <tr
                  key={i}
                  className={`hover:bg-[#F5F8F5] transition-colors ${isBest ? 'bg-[#F0FDF4]' : ''}`}
                >
                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-1.5">
                      {isBest && <span className="text-[9px] font-black text-[#D97706]">★</span>}
                      <span className={`font-bold text-[11px] ${isBest ? 'text-[#174B32]' : 'text-[#1D2A22]'}`}>
                        {r.methodName}
                      </span>
                    </div>
                    <div className="text-[10px] text-[#718075] mt-0.5">{r.approach}</div>
                  </td>
                  <td className="py-2.5 px-3 font-mono text-[10px] text-[#718075]">{r.inputFeatures}</td>
                  <td className="py-2.5 px-3">
                    <span className={`font-mono font-bold text-xs ${isBest ? 'text-[#059669]' : 'text-[#1D2A22]'}`}>
                      {pct(r.overallAccuracy)}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-mono text-[11px] text-[#1D2A22]">{r.kappa.toFixed(3)}</td>
                  <td className="py-2.5 px-3 font-mono text-[11px] text-[#1D2A22]">{pct(r.f1Score)}</td>
                  <td className="py-2.5 px-3">
                    <span
                      className="text-[10px] font-semibold px-2 py-0.5 rounded-full border"
                      style={{ background: style.bg, color: style.text, borderColor: style.border }}
                    >
                      {r.validationStatus}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Notes */}
      <div className="mt-3 space-y-1.5 text-[11px] text-[#718075]">
        {results.map(r => (
          <div key={r.methodName} className="flex items-start gap-1.5">
            <span className="font-bold text-[#1D2A22] flex-shrink-0">{r.methodName.split(' ')[0]}:</span>
            <span>{r.notes}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
