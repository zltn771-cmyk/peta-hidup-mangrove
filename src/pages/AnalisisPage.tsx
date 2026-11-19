import React, { useState } from 'react';
import {
  FlaskConical, Leaf, Droplets, TrendingUp, ChevronDown, ChevronUp, Info,
  Activity, BarChart2, Map, CheckCircle, AlertCircle, XCircle, Target,
} from 'lucide-react';
import { SectionHeader } from '../components/common/SectionHeader';
import { SPECTRAL_INDICES_INFO, BENGKULU_MANGROVE_ZONES } from '../data/mockData';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  BarChart, Bar, Cell, Legend,
} from 'recharts';

// ── Constants ─────────────────────────────────────────────────────────────────

const INDEX_ICONS: Record<string, React.ReactNode> = {
  CMRI: <Leaf size={18} />,
  MVI: <TrendingUp size={18} />,
  NDMI: <Droplets size={18} />,
};

const INDEX_COLORS: Record<string, string> = {
  CMRI: '#174B32',
  MVI: '#059669',
  NDMI: '#0891B2',
};

// Status badge for health score
function HealthBadge({ score }: { score: number }) {
  if (score >= 75) return (
    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
      <CheckCircle size={10} /> Sehat
    </span>
  );
  if (score >= 50) return (
    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
      <AlertCircle size={10} /> Sedang
    </span>
  );
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full">
      <XCircle size={10} /> Kritis
    </span>
  );
}

// Gauge-style progress bar for index values
function IndexBar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div className="w-full h-2 bg-[#F0F4F0] rounded-full overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{ width: `${pct}%`, backgroundColor: color }}
      />
    </div>
  );
}

// Interpret index value textually
function interpretCMRI(v: number): string {
  if (v >= 0.65) return 'Ekselen — vegetasi mangrove lebat dan sehat';
  if (v >= 0.45) return 'Baik — kerapatan cukup, perlu pemantauan';
  if (v >= 0.3) return 'Moderat — indikasi tekanan lingkungan';
  return 'Rendah — risiko degradasi vegetasi tinggi';
}
function interpretMVI(v: number): string {
  if (v >= 4.5) return 'Ekselen — kanopi rapat dan tajuk matang';
  if (v >= 3.0) return 'Baik — kerapatan tajuk rata-rata';
  if (v >= 1.8) return 'Moderat — potensi gangguan tajuk';
  return 'Rendah — vegetasi jarang atau terdegradasi';
}
function interpretNDMI(v: number): string {
  if (v >= 0.4) return 'Optimal — kelembapan kanopi tinggi';
  if (v >= 0.25) return 'Normal — kadar air dalam rentang sehat';
  if (v >= 0.15) return 'Rendah — potensi stres hidrologis';
  return 'Sangat rendah — kekeringan atau sedimentasi';
}

// ── Zone Comparison Table ──────────────────────────────────────────────────────

function ZoneComparisonTable({ selectedZoneId, onSelect }: {
  selectedZoneId: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="bg-white rounded-2xl border border-[#E2EAE2] overflow-hidden">
      <div className="p-5 border-b border-[#E2EAE2] flex items-center justify-between">
        <div>
          <h3 className="font-bold text-[15px] text-[#1D2A22] flex items-center gap-2">
            <Map size={16} className="text-[#174B32]" />
            Perbandingan Indeks per Zona
          </h3>
          <p className="text-[12px] text-[#718075] mt-0.5">Klik baris untuk melihat detail zona</p>
        </div>
        <span className="text-[9px] text-amber-600 font-bold">◈ Data Simulasi</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-[12px]">
          <thead>
            <tr className="bg-[#F5F8F5] border-b border-[#E2EAE2]">
              {['Kawasan', 'Kabupaten', 'Luas (ha)', 'CMRI', 'MVI', 'NDMI', 'Health', 'Status'].map(h => (
                <th key={h} className="text-left text-[10px] font-semibold text-[#A8BFA5] uppercase tracking-wider px-4 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {BENGKULU_MANGROVE_ZONES.map((z) => {
              const isSelected = selectedZoneId === z.id;
              return (
                <tr
                  key={z.id}
                  onClick={() => onSelect(z.id)}
                  className={`border-b border-[#F5F8F5] cursor-pointer transition-colors ${
                    isSelected ? 'bg-[#174B32]/5 border-l-4 border-l-[#174B32]' : 'hover:bg-[#F8FAF8]'
                  }`}
                >
                  <td className="px-4 py-3 font-semibold text-[#1D2A22] max-w-[160px]">
                    <div className="truncate">{z.name}</div>
                  </td>
                  <td className="px-4 py-3 text-[#718075]">{z.kabupaten}</td>
                  <td className="px-4 py-3 font-mono text-[#1D2A22]">{z.areaHectares.toFixed(1)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="font-bold w-10 text-[#174B32]">{z.cmriScore.toFixed(2)}</span>
                      <IndexBar value={z.cmriScore} max={1} color="#174B32" />
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="font-bold w-10 text-[#059669]">{z.mviScore.toFixed(2)}</span>
                      <IndexBar value={z.mviScore} max={6.5} color="#059669" />
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="font-bold w-10 text-[#0891B2]">{z.ndmiScore.toFixed(2)}</span>
                      <IndexBar value={z.ndmiScore} max={0.55} color="#0891B2" />
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className={`font-bold text-sm ${z.healthScore >= 75 ? 'text-emerald-600' : z.healthScore >= 50 ? 'text-amber-600' : 'text-rose-600'}`}>
                        {z.healthScore}
                      </span>
                      <span className="text-[10px] text-[#A8BFA5]">/100</span>
                    </div>
                  </td>
                  <td className="px-4 py-3"><HealthBadge score={z.healthScore} /></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Zone Detail Panel ──────────────────────────────────────────────────────────

function ZoneDetailPanel({ zoneId }: { zoneId: string }) {
  const zone = BENGKULU_MANGROVE_ZONES.find(z => z.id === zoneId);
  if (!zone) return null;

  const barData = [
    { name: 'CMRI', value: parseFloat((zone.cmriScore * 100).toFixed(1)), fill: '#174B32', interpret: interpretCMRI(zone.cmriScore) },
    { name: 'MVI', value: parseFloat((zone.mviScore / 6.5 * 100).toFixed(1)), fill: '#059669', interpret: interpretMVI(zone.mviScore) },
    { name: 'NDMI', value: parseFloat((zone.ndmiScore / 0.55 * 100).toFixed(1)), fill: '#0891B2', interpret: interpretNDMI(zone.ndmiScore) },
  ];

  const healthColor = zone.healthScore >= 75 ? '#059669' : zone.healthScore >= 50 ? '#D97706' : '#DC2626';

  return (
    <div className="bg-white rounded-2xl border border-[#174B32]/30 p-5 space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Target size={14} className="text-[#174B32]" />
            <span className="text-[11px] font-semibold text-[#A8BFA5] uppercase tracking-wider">Detail Zona Terpilih</span>
          </div>
          <h3 className="font-extrabold text-[16px] text-[#1D2A22] leading-snug">{zone.name}</h3>
          <p className="text-[12px] text-[#718075] mt-0.5">{zone.kabupaten} · {zone.areaHectares.toFixed(1)} ha · {zone.dominantSpecies}</p>
        </div>
        <div className="text-center flex-shrink-0">
          <div className="text-3xl font-black" style={{ color: healthColor }}>{zone.healthScore}</div>
          <div className="text-[9px] text-[#A8BFA5] font-semibold">HEALTH SCORE</div>
          <HealthBadge score={zone.healthScore} />
        </div>
      </div>

      {/* Normalized bar chart */}
      <div>
        <div className="text-[11px] font-semibold text-[#A8BFA5] uppercase tracking-wider mb-3">Skor Indeks (Normalisasi 0–100%)</div>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={barData} layout="vertical" margin={{ top: 0, right: 8, left: 0, bottom: 0 }} barSize={22}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2EAE2" horizontal={false} />
            <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10, fill: '#718075' }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
            <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: '#1D2A22', fontWeight: 600 }} axisLine={false} tickLine={false} width={40} />
            <Tooltip
              formatter={(v: unknown) => [`${Number(v).toFixed(1)}%`, 'Skor normalisasi']}
              contentStyle={{ fontSize: '11px', borderRadius: '12px', border: '1px solid #E2EAE2' }}
            />
            <Bar dataKey="value" radius={[0, 6, 6, 0]}>
              {barData.map((entry, i) => <Cell key={i} fill={entry.fill} fillOpacity={0.85} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Interpretations */}
      <div className="space-y-2">
        <div className="text-[11px] font-semibold text-[#A8BFA5] uppercase tracking-wider mb-2">Interpretasi Otomatis</div>
        {barData.map((d) => (
          <div key={d.name} className="flex items-start gap-3 p-3 rounded-xl bg-[#F5F8F5] border border-[#E2EAE2]">
            <span className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: d.fill }} />
            <div>
              <span className="font-bold text-[12px]" style={{ color: d.fill }}>{d.name}</span>
              <span className="text-[12px] text-[#718075] ml-2">{d.interpret}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="text-[9px] text-amber-600 font-semibold">◈ Interpretasi berbasis ambang batas simulasi — bukan pengukuran GEE aktual</div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export const AnalisisPage: React.FC = () => {
  const [expandedIndex, setExpandedIndex] = useState<string | null>('CMRI');
  const [selectedZoneId, setSelectedZoneId] = useState<string | null>('zone-baai');
  const [activeTab, setActiveTab] = useState<'trend' | 'radar' | 'zone'>('trend');

  // Multi-index combined trend data
  const combinedTrendData = SPECTRAL_INDICES_INFO[0].historicalTrend.map((pt, i) => ({
    year: pt.year,
    CMRI: pt.value,
    MVI: SPECTRAL_INDICES_INFO[1].historicalTrend[i]?.value,
    NDMI: SPECTRAL_INDICES_INFO[2].historicalTrend[i]?.value,
  }));

  // Radar data
  const radarData = BENGKULU_MANGROVE_ZONES.slice(0, 5).map(z => ({
    zone: z.name.split(' ').slice(0, 2).join(' '),
    CMRI: parseFloat((z.cmriScore * 100).toFixed(0)),
    MVI: parseFloat((z.mviScore / 6.5 * 100).toFixed(0)),
    NDMI: parseFloat((z.ndmiScore / 0.55 * 100).toFixed(0)),
  }));

  // Zone bar data
  const zoneBarData = BENGKULU_MANGROVE_ZONES.map(z => ({
    name: z.name.split(' ').slice(0, 3).join(' '),
    CMRI: parseFloat((z.cmriScore * 100).toFixed(1)),
    MVI: parseFloat((z.mviScore / 6.5 * 100).toFixed(1)),
    NDMI: parseFloat((z.ndmiScore / 0.55 * 100).toFixed(1)),
    score: z.healthScore,
  }));

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Analisis Vegetasi"
        subtitle="Indeks spektral berbasis Sentinel-2 untuk karakterisasi kondisi ekosistem mangrove Provinsi Bengkulu"
        isSimulated
      />

      {/* Info banner */}
      <div className="bg-[#F5F8F5] border border-[#C9D9C7] rounded-xl p-4 flex items-start gap-3">
        <Info size={16} className="text-[#174B32] mt-0.5 flex-shrink-0" />
        <div className="text-[12px] text-[#718075] leading-relaxed">
          <strong className="text-[#1D2A22]">Tentang Indeks Spektral:</strong> CMRI, MVI, dan NDMI dihitung dari kombinasi band Sentinel-2 (resolusi spasial 10–20 m).
          Nilai yang ditampilkan adalah <strong className="text-amber-700">data simulasi demonstrasi</strong> yang merepresentasikan konsep analisis, bukan pengukuran citra satelit aktual.
          Integrasi Google Earth Engine (GEE) direncanakan setelah pengujian prototipe.
        </div>
      </div>

      {/* Quick stat cards */}
      <div className="grid grid-cols-3 gap-4">
        {SPECTRAL_INDICES_INFO.map((idx) => {
          const color = INDEX_COLORS[idx.index];
          return (
            <div key={idx.index} className="bg-white rounded-2xl border border-[#E2EAE2] p-4 hover:border-[#A8BFA5] transition-all">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${color}14` }}>
                  <span style={{ color }}>{INDEX_ICONS[idx.index]}</span>
                </div>
                <span className="font-black text-[14px]" style={{ color }}>{idx.index}</span>
              </div>
              <div className="text-2xl font-black text-[#1D2A22]">{idx.meanValue}</div>
              <div className="text-[10px] text-[#A8BFA5] mt-0.5">Rata-rata 2026 · Rentang sehat: {idx.healthyRange}</div>
              <div className="mt-3">
                <IndexBar value={idx.index === 'CMRI' ? idx.meanValue : idx.index === 'MVI' ? idx.meanValue / 6.5 : idx.meanValue / 0.55} max={1} color={color} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Visualization tabs */}
      <div className="bg-white rounded-2xl border border-[#E2EAE2] p-5">
        {/* Tab selector */}
        <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
          <div>
            <h3 className="font-bold text-[15px] text-[#1D2A22] flex items-center gap-2">
              <Activity size={16} className="text-[#174B32]" /> Visualisasi Komparatif
            </h3>
            <p className="text-[12px] text-[#718075] mt-0.5">Tren multitahun, perbandingan radar, dan distribusi per zona</p>
          </div>
          <div className="flex gap-1 p-1 bg-[#F5F8F5] rounded-xl border border-[#E2EAE2]">
            {(['trend', 'radar', 'zone'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all ${
                  activeTab === tab
                    ? 'bg-white text-[#174B32] shadow-sm border border-[#E2EAE2]'
                    : 'text-[#718075] hover:text-[#1D2A22]'
                }`}
              >
                {tab === 'trend' ? 'Tren 2021–2026' : tab === 'radar' ? 'Radar Zona' : 'Bar Zona'}
              </button>
            ))}
          </div>
        </div>

        {/* Trend Chart */}
        {activeTab === 'trend' && (
          <div>
            <div className="text-[11px] text-[#718075] mb-4">
              Tiga indeks spectral dalam satu tampilan — ⓘ CMRI & NDMI skala kiri, MVI skala kanan (nilai berbeda)
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={combinedTrendData} margin={{ top: 4, right: 40, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2EAE2" vertical={false} />
                <XAxis dataKey="year" tick={{ fontSize: 11, fill: '#718075' }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="left" tick={{ fontSize: 10, fill: '#718075' }} axisLine={false} tickLine={false} domain={[0, 1]} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10, fill: '#059669' }} axisLine={false} tickLine={false} domain={[0, 7]} />
                <Tooltip
                  formatter={(v: any, name: any) => [Number(v).toFixed(3), String(name || '')]}
                  contentStyle={{ fontSize: '11px', borderRadius: '12px', border: '1px solid #E2EAE2' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '12px' }} />
                <Line yAxisId="left" type="monotone" dataKey="CMRI" stroke="#174B32" strokeWidth={2.5} dot={{ fill: '#174B32', r: 4, strokeWidth: 0 }} />
                <Line yAxisId="right" type="monotone" dataKey="MVI" stroke="#059669" strokeWidth={2.5} dot={{ fill: '#059669', r: 4, strokeWidth: 0 }} />
                <Line yAxisId="left" type="monotone" dataKey="NDMI" stroke="#0891B2" strokeWidth={2.5} dot={{ fill: '#0891B2', r: 4, strokeWidth: 0 }} strokeDasharray="5 3" />
              </LineChart>
            </ResponsiveContainer>
            <div className="mt-3 text-[9px] text-amber-600 font-semibold">◈ Data Simulasi — bukan pengukuran GEE aktual</div>
          </div>
        )}

        {/* Radar Chart */}
        {activeTab === 'radar' && (
          <div>
            <div className="text-[11px] text-[#718075] mb-4">Normalisasi 0–100% untuk masing-masing indeks, 5 zona prioritas</div>
            <div className="flex justify-center">
              <ResponsiveContainer width="100%" height={320}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#E2EAE2" />
                  <PolarAngleAxis dataKey="zone" tick={{ fontSize: 10, fill: '#718075' }} />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 9, fill: '#A8BFA5' }} />
                  <Radar name="CMRI" dataKey="CMRI" stroke="#174B32" fill="#174B32" fillOpacity={0.15} strokeWidth={2} />
                  <Radar name="MVI" dataKey="MVI" stroke="#059669" fill="#059669" fillOpacity={0.15} strokeWidth={2} />
                  <Radar name="NDMI" dataKey="NDMI" stroke="#0891B2" fill="#0891B2" fillOpacity={0.15} strokeWidth={2} />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 text-[9px] text-amber-600 font-semibold">◈ Data Simulasi</div>
          </div>
        )}

        {/* Zone Bar Chart */}
        {activeTab === 'zone' && (
          <div>
            <div className="text-[11px] text-[#718075] mb-4">Skor normalisasi (0–100%) per zona untuk ketiga indeks spectral</div>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={zoneBarData} margin={{ top: 4, right: 8, left: -20, bottom: 60 }} barGap={2}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2EAE2" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 9, fill: '#718075' }} axisLine={false} tickLine={false} angle={-25} textAnchor="end" interval={0} />
                <YAxis tick={{ fontSize: 10, fill: '#718075' }} axisLine={false} tickLine={false} domain={[0, 100]} tickFormatter={v => `${v}%`} />
                <Tooltip
                  formatter={(v: any, name: any) => [`${Number(v).toFixed(1)}%`, String(name || '')]}
                  contentStyle={{ fontSize: '11px', borderRadius: '12px', border: '1px solid #E2EAE2' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Bar dataKey="CMRI" name="CMRI" fill="#174B32" fillOpacity={0.8} radius={[4, 4, 0, 0]} barSize={18} />
                <Bar dataKey="MVI" name="MVI" fill="#059669" fillOpacity={0.8} radius={[4, 4, 0, 0]} barSize={18} />
                <Bar dataKey="NDMI" name="NDMI" fill="#0891B2" fillOpacity={0.8} radius={[4, 4, 0, 0]} barSize={18} />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-2 text-[9px] text-amber-600 font-semibold">◈ Data Simulasi</div>
          </div>
        )}
      </div>

      {/* Zone comparison table + detail panel */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        <div className="xl:col-span-3">
          <ZoneComparisonTable selectedZoneId={selectedZoneId} onSelect={setSelectedZoneId} />
        </div>
        <div className="xl:col-span-2">
          {selectedZoneId
            ? <ZoneDetailPanel zoneId={selectedZoneId} />
            : (
              <div className="bg-white rounded-2xl border border-[#E2EAE2] p-8 flex flex-col items-center justify-center h-full text-center gap-3">
                <Target size={32} className="text-[#A8BFA5]" />
                <p className="text-[13px] text-[#718075]">Pilih baris pada tabel untuk melihat detail zona dan interpretasi indeks</p>
              </div>
            )
          }
        </div>
      </div>

      {/* Index accordion (scientific detail) */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <FlaskConical size={16} className="text-[#174B32]" />
          <h3 className="font-bold text-[15px] text-[#1D2A22]">Detail Teknis Indeks Spectral</h3>
        </div>
        <div className="space-y-3">
          {SPECTRAL_INDICES_INFO.map((idx) => {
            const isOpen = expandedIndex === idx.index;
            const color = INDEX_COLORS[idx.index];
            return (
              <div key={idx.index} className={`bg-white rounded-2xl border overflow-hidden transition-all ${isOpen ? 'border-[#174B32]/40' : 'border-[#E2EAE2]'}`}>
                <button
                  onClick={() => setExpandedIndex(isOpen ? null : idx.index)}
                  className="w-full flex items-center gap-4 p-5 text-left hover:bg-[#F8FAF8] transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${color}14` }}>
                    <span style={{ color }}>{INDEX_ICONS[idx.index]}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-[15px] text-[#1D2A22]">{idx.index}</span>
                      <span className="text-[12px] text-[#718075]">— {idx.fullName}</span>
                    </div>
                    <div className="text-[12px] font-mono text-[#A8BFA5] mt-0.5">{idx.formula}</div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <div className="hidden sm:block text-right">
                      <div className="text-xl font-bold" style={{ color }}>{idx.meanValue}</div>
                      <div className="text-[10px] text-[#A8BFA5]">Rata-rata 2026</div>
                    </div>
                    {isOpen ? <ChevronUp size={18} className="text-[#718075]" /> : <ChevronDown size={18} className="text-[#718075]" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="border-t border-[#E2EAE2] p-5">
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                      {/* Left: metadata */}
                      <div className="space-y-4">
                        <div>
                          <div className="text-[11px] font-semibold text-[#A8BFA5] uppercase tracking-wider mb-1">Tujuan Analisis</div>
                          <p className="text-[13px] text-[#718075] leading-relaxed">{idx.purpose}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-[#F5F8F5] rounded-xl p-3 border border-[#E2EAE2]">
                            <div className="text-[10px] text-[#A8BFA5] uppercase tracking-wider mb-1">Rentang Sehat</div>
                            <div className="font-bold text-[14px]" style={{ color }}>{idx.healthyRange}</div>
                          </div>
                          <div className="bg-[#F5F8F5] rounded-xl p-3 border border-[#E2EAE2]">
                            <div className="text-[10px] text-[#A8BFA5] uppercase tracking-wider mb-1">Nilai Rata-rata</div>
                            <div className="font-bold text-[14px]" style={{ color }}>{idx.meanValue}</div>
                          </div>
                        </div>
                        <div>
                          <div className="text-[11px] font-semibold text-[#A8BFA5] uppercase tracking-wider mb-2">Band Sentinel-2 yang Digunakan</div>
                          <div className="flex flex-wrap gap-2">
                            {idx.sentinelBands.map(band => (
                              <span key={band} className="text-[11px] font-mono bg-[#174B32]/8 text-[#174B32] border border-[#174B32]/15 px-2.5 py-1 rounded-lg font-semibold">
                                {band}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Right: trend chart */}
                      <div>
                        <div className="text-[11px] font-semibold text-[#A8BFA5] uppercase tracking-wider mb-3">Tren 2021–2026</div>
                        <ResponsiveContainer width="100%" height={180}>
                          <LineChart data={idx.historicalTrend} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#E2EAE2" vertical={false} />
                            <XAxis dataKey="year" tick={{ fontSize: 10, fill: '#718075' }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fontSize: 10, fill: '#718075' }} axisLine={false} tickLine={false} />
                            <Tooltip
                              formatter={(v: unknown) => [Number(v), idx.index]}
                              contentStyle={{ fontSize: '11px', borderRadius: '12px', border: '1px solid #E2EAE2' }}
                            />
                            <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2.5} dot={{ fill: color, r: 4, strokeWidth: 0 }} />
                          </LineChart>
                        </ResponsiveContainer>
                        {idx.isSimulated && (
                          <div className="mt-2 text-[9px] text-amber-600 font-semibold">◈ Data Simulasi — bukan pengukuran GEE aktual</div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Methodology note */}
      <div className="bg-[#174B32]/5 border border-[#174B32]/20 rounded-2xl p-5">
        <div className="flex items-start gap-3">
          <BarChart2 size={18} className="text-[#174B32] mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-bold text-[14px] text-[#1D2A22] mb-2">Catatan Metodologi</h4>
            <p className="text-[12px] text-[#718075] leading-relaxed mb-3">
              Indeks CMRI, MVI, dan NDMI yang digunakan dalam sistem ini mengacu pada formula spektral yang telah dipublikasikan dalam literatur penginderaan jauh mangrove.
              Ketiga indeks ini berfungsi sebagai fitur utama dalam klasifikasi Random Forest yang dibangun pada halaman AI Classification.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-[11px]">
              {[
                { label: 'CMRI', desc: 'Neto perbedaan NDVI dan NDWI — memisahkan mangrove dari air dan vegetasi darat' },
                { label: 'MVI', desc: 'Rasio NIR dan SWIR berbasis Green — spesifik untuk kanopi berlumpur pasang-surut' },
                { label: 'NDMI', desc: 'Normalisasi NIR dan SWIR1 — proksi kadar air dan stres hidrologi tajuk' },
              ].map(item => (
                <div key={item.label} className="bg-white rounded-xl p-3 border border-[#E2EAE2]">
                  <div className="font-bold text-[12px] text-[#174B32] mb-1">{item.label}</div>
                  <div className="text-[#718075]">{item.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
