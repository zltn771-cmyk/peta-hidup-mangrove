import React from 'react';
import { ConfusionMatrix, ModelEvaluationMetrics } from '../../types/classification';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend } from 'recharts';
import { ShieldCheck } from 'lucide-react';

interface EvaluationPanelProps {
  metrics: ModelEvaluationMetrics;
  isSimulated: boolean;
}

// Heatmap cell color based on intensity
const heatColor = (value: number, maxVal: number): string => {
  const pct = maxVal > 0 ? value / maxVal : 0;
  if (pct > 0.75) return '#174B32';
  if (pct > 0.4) return '#059669';
  if (pct > 0.1) return '#D97706';
  return '#E2EAE2';
};

function ConfusionHeatmap({ cm }: { cm: ConfusionMatrix }) {
  const maxVal = Math.max(cm.truePositive, cm.falseNegative, cm.falsePositive, cm.trueNegative);
  const cells = [
    { label: 'TP', value: cm.truePositive, row: 'Aktual: Mangrove', col: 'Pred: Mangrove', isCorrect: true },
    { label: 'FN', value: cm.falseNegative, row: 'Aktual: Mangrove', col: 'Pred: Non-Mangrove', isCorrect: false },
    { label: 'FP', value: cm.falsePositive, row: 'Aktual: Non-Mangrove', col: 'Pred: Mangrove', isCorrect: false },
    { label: 'TN', value: cm.trueNegative, row: 'Aktual: Non-Mangrove', col: 'Pred: Non-Mangrove', isCorrect: true },
  ];

  return (
    <div className="space-y-3">
      <div className="text-[11px] text-center text-[#718075] font-semibold">Predicted Label</div>
      <div className="text-[11px] font-semibold text-[#718075] mb-1">
        <div className="flex gap-2">
          <div className="w-24 flex-shrink-0" /> {/* spacer for row labels */}
          <div className="flex-1 text-center text-[11px] font-bold text-[#1D2A22]">Mangrove</div>
          <div className="flex-1 text-center text-[11px] font-bold text-[#1D2A22]">Non-Mangrove</div>
        </div>
      </div>
      <div className="space-y-1.5">
        {(['Aktual: Mangrove', 'Aktual: Non-Mangrove'] as const).map((rowLabel, ri) => (
          <div key={ri} className="flex items-center gap-2">
            <div
              className="w-24 flex-shrink-0 text-[10px] font-bold text-[#718075] text-right leading-tight"
              style={{ writingMode: 'horizontal-tb' }}
            >
              {rowLabel}
            </div>
            {cells.filter(c => c.row === rowLabel).map(cell => (
              <div
                key={cell.label}
                className="flex-1 rounded-xl p-3 text-center shadow-xs border border-black/5"
                style={{ background: heatColor(cell.value, maxVal) }}
              >
                <div className="text-[10px] font-bold text-white/70 uppercase tracking-wider">{cell.label}</div>
                <div className="text-2xl font-black text-white mt-0.5">{cell.value}</div>
                <div className="text-[10px] text-white/60 mt-0.5">
                  {cell.isCorrect ? '✓ Benar' : '✗ Salah'}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 text-[10px] text-[#718075] mt-2">
        {[
          { label: 'TP: Aktual Mangrove, Prediksi Mangrove', isCorrect: true },
          { label: 'TN: Aktual Non-Mangrove, Prediksi Non-Mangrove', isCorrect: true },
          { label: 'FP: Aktual Non-Mangrove, Prediksi Mangrove (Comission Error)', isCorrect: false },
          { label: 'FN: Aktual Mangrove, Prediksi Non-Mangrove (Omission Error)', isCorrect: false },
        ].map(item => (
          <div key={item.label} className="flex items-center gap-1">
            <span className={`w-2 h-2 rounded-sm ${item.isCorrect ? 'bg-[#059669]' : 'bg-[#D97706]'}`} />
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export const EvaluationPanel: React.FC<EvaluationPanelProps> = ({ metrics, isSimulated }) => {
  const { cohensKappa, overallAccuracy, macroPrecision, macroRecall, macroF1, classMetrics } = metrics;

  const pct = (v: number) => `${(v * 100).toFixed(1)}%`;

  const barData = [
    { name: 'Accuracy', Mangrove: parseFloat((classMetrics.mangrove.precision * 100).toFixed(1)), 'Non-Mangrove': parseFloat((classMetrics.non_mangrove.precision * 100).toFixed(1)) },
    { name: 'Recall', Mangrove: parseFloat((classMetrics.mangrove.recall * 100).toFixed(1)), 'Non-Mangrove': parseFloat((classMetrics.non_mangrove.recall * 100).toFixed(1)) },
    { name: 'F1-Score', Mangrove: parseFloat((classMetrics.mangrove.f1Score * 100).toFixed(1)), 'Non-Mangrove': parseFloat((classMetrics.non_mangrove.f1Score * 100).toFixed(1)) },
  ];

  return (
    <div className="bg-white rounded-2xl border border-[#E2EAE2] shadow-xs p-5 space-y-5">
      <div className="flex items-center justify-between pb-3 border-b border-[#E2EAE2]">
        <h2 className="font-extrabold text-sm text-[#1D2A22] flex items-center gap-2">
          <ShieldCheck size={16} className="text-[#174B32]" />
          Validasi Model & Confusion Matrix
        </h2>
        {isSimulated && (
          <span className="text-[10px] font-bold text-[#92400E] bg-[#FFFBEB] px-2.5 py-1 rounded-full border border-[#FDE68A]">
            ◈ Evaluasi Nyata (Dataset Demonstrasi)
          </span>
        )}
      </div>

      {/* Key Metrics Summary */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-xs">
        {[
          { label: 'Overall Accuracy', value: pct(overallAccuracy), desc: '(TP+TN) / Total', color: '#174B32' },
          { label: "Cohen's Kappa", value: cohensKappa.toFixed(3), desc: 'Agreement beyond chance', color: '#059669' },
          { label: 'Macro Precision', value: pct(macroPrecision), desc: 'Rata-rata per kelas', color: '#0891B2' },
          { label: 'Macro Recall', value: pct(macroRecall), desc: 'Rata-rata per kelas', color: '#7C3AED' },
          { label: 'Macro F1-Score', value: pct(macroF1), desc: 'Harmonic mean P/R', color: '#D97706' },
        ].map(m => (
          <div key={m.label} className="p-3 rounded-xl bg-[#F5F8F5] border border-[#E2EAE2]">
            <div className="text-[10px] text-[#718075]">{m.label}</div>
            <div className="text-base font-extrabold mt-0.5" style={{ color: m.color }}>{m.value}</div>
            <div className="text-[10px] text-[#718075] mt-0.5">{m.desc}</div>
          </div>
        ))}
      </div>

      {/* Confusion Matrix Heatmap */}
      <div>
        <div className="text-[11px] font-bold text-[#718075] uppercase tracking-wider mb-3">
          Confusion Matrix — Heatmap
        </div>
        <ConfusionHeatmap cm={metrics.confusionMatrix} />
      </div>

      {/* Per-Class Metrics Bar Chart */}
      <div>
        <div className="text-[11px] font-bold text-[#718075] uppercase tracking-wider mb-2">
          Metrik Per Kelas: Precision, Recall & F1-Score
        </div>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0F4F0" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#718075' }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#718075' }} tickFormatter={v => `${v}%`} />
              <Tooltip formatter={(v: unknown) => [`${Number(v).toFixed(1)}%`]} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="Mangrove" fill="#174B32" radius={[4, 4, 0, 0]} maxBarSize={36} />
              <Bar dataKey="Non-Mangrove" fill="#94A3B8" radius={[4, 4, 0, 0]} maxBarSize={36} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Per-class summary table */}
      <div>
        <div className="text-[11px] font-bold text-[#718075] uppercase tracking-wider mb-2">Tabel Klasifikasi Per Kelas</div>
        <div className="overflow-x-auto">
          <table className="w-full text-[11px] text-left border border-[#E2EAE2] rounded-xl overflow-hidden">
            <thead className="bg-[#F5F8F5] text-[#718075] text-[10px] font-semibold">
              <tr>
                <th className="py-2 px-3">Kelas</th>
                <th className="py-2 px-3">Precision</th>
                <th className="py-2 px-3">Recall</th>
                <th className="py-2 px-3">F1-Score</th>
                <th className="py-2 px-3">Support</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0F4F0]">
              {[classMetrics.mangrove, classMetrics.non_mangrove].map(cls => (
                <tr key={cls.className} className="hover:bg-[#F5F8F5] text-[#1D2A22]">
                  <td className="py-2 px-3">
                    <span className={`font-bold text-[10px] px-2 py-0.5 rounded-full border ${
                      cls.className === 'mangrove'
                        ? 'bg-[#ECFDF5] text-[#065F46] border-[#A7F3D0]'
                        : 'bg-[#F1F5F9] text-[#475569] border-[#CBD5E1]'
                    }`}>{cls.displayName}</span>
                  </td>
                  <td className="py-2 px-3 font-mono font-semibold">{pct(cls.precision)}</td>
                  <td className="py-2 px-3 font-mono font-semibold">{pct(cls.recall)}</td>
                  <td className="py-2 px-3 font-mono font-semibold">{pct(cls.f1Score)}</td>
                  <td className="py-2 px-3 text-[#718075]">{cls.support} titik</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="text-[10px] text-[#718075] italic">
        Kappa ≥ 0.80: sangat baik · Kappa 0.60–0.80: baik · Kappa 0.40–0.60: sedang · Kappa &lt;0.40: buruk
      </div>
    </div>
  );
};
