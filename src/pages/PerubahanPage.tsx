import React, { useState } from 'react';
import {
  TrendingUp, TrendingDown, Minus, Calendar, AlertTriangle, ArrowRight,
  ShieldCheck, RefreshCw, BarChart2, Filter, Layers, HelpCircle, Activity,
} from 'lucide-react';
import { SectionHeader } from '../components/common/SectionHeader';
import { TEMPORAL_COVERAGE_DATA, BENGKULU_MANGROVE_ZONES } from '../data/mockData';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  BarChart, Bar, Cell, ReferenceLine, LineChart, Line,
} from 'recharts';

// ── Kabupaten Breakdown Data (Simulated) ──────────────────────────────────────

interface KabupatenTemporal {
  kabupaten: string;
  area2020: number;
  area2026: number;
  changeHa: number;
  changePct: number;
  status: 'Pemulihan' | 'Stabil' | 'Tertekan';
  mainCause: string;
}

const KABUPATEN_DATA: KabupatenTemporal[] = [
  {
    kabupaten: 'Mukomuko',
    area2020: 210.5,
    area2026: 228.2,
    changeHa: +17.7,
    changePct: +8.4,
    status: 'Pemulihan',
    mainCause: 'Restorasi aktif pokdarwis & regenerasi alami Air Rami',
  },
  {
    kabupaten: 'Kota Bengkulu',
    area2020: 320.4,
    area2026: 311.3,
    changeHa: -9.1,
    changePct: -2.8,
    status: 'Tertekan',
    mainCause: 'Ekspansi pelabuhan Pulau Baai & sedimentasi alur Teluk Sepang',
  },
  {
    kabupaten: 'Bengkulu Tengah',
    area2020: 95.8,
    area2026: 98.4,
    changeHa: +2.6,
    changePct: +2.7,
    status: 'Stabil',
    mainCause: 'Dinamika pasang surut Sungai Hitam relatif terkendali',
  },
  {
    kabupaten: 'Kaur',
    area2020: 135.2,
    area2026: 145.8,
    changeHa: +10.6,
    changePct: +7.8,
    status: 'Pemulihan',
    mainCause: 'Konservasi laguna Linau & penanaman bibit mangrove',
  },
  {
    kabupaten: 'Bengkulu Selatan',
    area2020: 50.5,
    area2026: 51.5,
    changeHa: +1.0,
    changePct: +2.0,
    status: 'Stabil',
    mainCause: 'Tutupan terfragmentasi di muara Kinal dan Pino Guntung',
  },
];

// ── Projection Scenarios (2027–2030) ──────────────────────────────────────────

interface ProjectionPoint {
  year: number;
  historis?: number;
  konservasi?: number;
  bau?: number;
  tertekan?: number;
}

const PROJECTION_DATA: ProjectionPoint[] = [
  { year: 2020, historis: 812.4 },
  { year: 2021, historis: 798.1 },
  { year: 2022, historis: 785.6 },
  { year: 2023, historis: 794.3 },
  { year: 2024, historis: 809.8 },
  { year: 2025, historis: 823.5 },
  { year: 2026, historis: 835.2, konservasi: 835.2, bau: 835.2, tertekan: 835.2 },
  { year: 2027, konservasi: 855.0, bau: 844.5, tertekan: 820.0 },
  { year: 2028, konservasi: 876.5, bau: 853.8, tertekan: 804.2 },
  { year: 2029, konservasi: 899.2, bau: 863.0, tertekan: 788.1 },
  { year: 2030, konservasi: 923.0, bau: 872.4, tertekan: 771.5 },
];

export const PerubahanPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<'stacked' | 'loss-gain'>('stacked');
  const [startYear, setStartYear] = useState<number>(2020);
  const [endYear, setEndYear] = useState<number>(2026);
  const [selectedScenario, setSelectedScenario] = useState<'all' | 'konservasi' | 'bau' | 'tertekan'>('all');

  const lossGainData = TEMPORAL_COVERAGE_DATA.map(d => ({ year: d.year, perubahan: d.lossGainHa }));
  const totalChange = TEMPORAL_COVERAGE_DATA[TEMPORAL_COVERAGE_DATA.length - 1].totalAreaHa
    - TEMPORAL_COVERAGE_DATA[0].totalAreaHa;
  const pctChange = (totalChange / TEMPORAL_COVERAGE_DATA[0].totalAreaHa) * 100;

  // Comparison between startYear and endYear
  const startData = TEMPORAL_COVERAGE_DATA.find(d => d.year === startYear) || TEMPORAL_COVERAGE_DATA[0];
  const endData = TEMPORAL_COVERAGE_DATA.find(d => d.year === endYear) || TEMPORAL_COVERAGE_DATA[TEMPORAL_COVERAGE_DATA.length - 1];
  const deltaTotal = endData.totalAreaHa - startData.totalAreaHa;
  const deltaDense = endData.denseAreaHa - startData.denseAreaHa;
  const deltaMod = endData.moderateAreaHa - startData.moderateAreaHa;
  const deltaSparse = endData.sparseAreaHa - startData.sparseAreaHa;
  const deltaDegraded = endData.degradedAreaHa - startData.degradedAreaHa;

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Perubahan Tutupan Mangrove"
        subtitle="Analisis multitemporal 2020–2026 berbasis time-series citra Sentinel-2 dan proyeksi dinamika pesisir"
        isSimulated
        actions={
          <div className="flex gap-1 p-1 bg-[#F5F8F5] rounded-xl border border-[#E2EAE2]">
            {(['stacked', 'loss-gain'] as const).map(mode => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all ${
                  viewMode === mode
                    ? 'bg-white text-[#174B32] shadow-sm border border-[#E2EAE2]'
                    : 'text-[#718075] hover:text-[#1D2A22]'
                }`}
              >
                {mode === 'stacked' ? 'Distribusi Kelas' : 'Kehilangan & Penambahan'}
              </button>
            ))}
          </div>
        }
      />

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Tutupan Awal (2020)', value: `${TEMPORAL_COVERAGE_DATA[0].totalAreaHa.toFixed(1)} ha`, sub: 'Baseline Sentinel-2', icon: <Calendar size={16} />, color: '#718075' },
          { label: 'Tutupan Terkini (2026)', value: `${TEMPORAL_COVERAGE_DATA[TEMPORAL_COVERAGE_DATA.length - 1].totalAreaHa.toFixed(1)} ha`, sub: 'Komposit tahun 2026', icon: <Calendar size={16} />, color: '#174B32' },
          {
            label: 'Perubahan Bersih (Net)',
            value: `${totalChange > 0 ? '+' : ''}${totalChange.toFixed(1)} ha`,
            sub: `${pctChange > 0 ? '+' : ''}${pctChange.toFixed(1)}% selama 7 tahun`,
            icon: totalChange > 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />,
            color: totalChange > 0 ? '#059669' : '#DC2626',
          },
          { label: 'Rata-rata Laju Tahunan', value: `+${(totalChange / 6).toFixed(1)} ha/th`, sub: 'Tren pemulihan positif', icon: <Activity size={16} />, color: '#0891B2' },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-2xl border border-[#E2EAE2] p-5 hover:border-[#A8BFA5] transition-all">
            <div className="flex items-center gap-2 mb-2" style={{ color: s.color }}>
              {s.icon}
              <span className="text-[11px] font-semibold text-[#718075]">{s.label}</span>
            </div>
            <div className="text-2xl font-black" style={{ color: s.color }}>{s.value}</div>
            <div className="text-[11px] text-[#A8BFA5] mt-1">{s.sub}</div>
            <div className="text-[9px] text-amber-600 font-semibold mt-2">◈ Data Simulasi</div>
          </div>
        ))}
      </div>

      {/* Interactive Two-Year Comparator */}
      <div className="bg-white rounded-2xl border border-[#E2EAE2] p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5 pb-4 border-b border-[#E2EAE2]">
          <div>
            <h3 className="font-bold text-[15px] text-[#1D2A22] flex items-center gap-2">
              <RefreshCw size={16} className="text-[#174B32]" />
              Komparator Dinamika Dua Periode
            </h3>
            <p className="text-[12px] text-[#718075] mt-0.5">Pilih dua tahun untuk membandingkan pergeseran luas antar kelas kerapatan</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-[#718075]">Dari:</span>
              <select
                aria-label="Pilih tahun awal komparasi"
                value={startYear}
                onChange={e => setStartYear(Number(e.target.value))}
                className="text-xs font-bold text-[#1D2A22] bg-[#F5F8F5] border border-[#E2EAE2] rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#174B32]"
              >
                {TEMPORAL_COVERAGE_DATA.map(d => (
                  <option key={d.year} value={d.year} disabled={d.year >= endYear}>Tahun {d.year}</option>
                ))}
              </select>
            </div>
            <ArrowRight size={14} className="text-[#A8BFA5]" />
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-[#718075]">Hingga:</span>
              <select
                aria-label="Pilih tahun akhir komparasi"
                value={endYear}
                onChange={e => setEndYear(Number(e.target.value))}
                className="text-xs font-bold text-[#1D2A22] bg-[#F5F8F5] border border-[#E2EAE2] rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#174B32]"
              >
                {TEMPORAL_COVERAGE_DATA.map(d => (
                  <option key={d.year} value={d.year} disabled={d.year <= startYear}>Tahun {d.year}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Delta Badges */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {[
            { label: 'Total Tutupan', delta: deltaTotal, from: startData.totalAreaHa, to: endData.totalAreaHa, color: '#174B32' },
            { label: 'Kerapatan Tinggi', delta: deltaDense, from: startData.denseAreaHa, to: endData.denseAreaHa, color: '#059669' },
            { label: 'Kerapatan Sedang', delta: deltaMod, from: startData.moderateAreaHa, to: endData.moderateAreaHa, color: '#10B981' },
            { label: 'Kerapatan Rendah', delta: deltaSparse, from: startData.sparseAreaHa, to: endData.sparseAreaHa, color: '#D97706' },
            { label: 'Terdegradasi', delta: deltaDegraded, from: startData.degradedAreaHa, to: endData.degradedAreaHa, color: '#DC2626' },
          ].map((item, i) => {
            const isGood = item.label === 'Terdegradasi' ? item.delta < 0 : item.delta > 0;
            return (
              <div key={i} className="bg-[#F5F8F5] rounded-xl p-3.5 border border-[#E2EAE2]">
                <div className="text-[11px] font-semibold text-[#718075] mb-1">{item.label}</div>
                <div className="flex items-baseline justify-between mb-1.5">
                  <span className="text-sm font-black text-[#1D2A22]">{item.to.toFixed(1)} ha</span>
                  <span className={`text-[11px] font-bold flex items-center ${isGood ? 'text-emerald-700' : 'text-rose-700'}`}>
                    {item.delta > 0 ? '+' : ''}{item.delta.toFixed(1)}
                  </span>
                </div>
                <div className="text-[10px] text-[#A8BFA5]">
                  Dari {item.from.toFixed(1)} ha ({startYear} → {endYear})
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Chart Section */}
      <div className="bg-white rounded-2xl border border-[#E2EAE2] p-5">
        <div className="flex items-start justify-between mb-5">
          <div>
            <h3 className="font-bold text-[15px] text-[#1D2A22]">
              {viewMode === 'stacked' ? 'Dinamika Luas Tutupan per Kelas Kerapatan' : 'Laju Perubahan Bersih per Periode Tahunan'}
            </h3>
            <p className="text-[12px] text-[#718075] mt-0.5">
              {viewMode === 'stacked'
                ? 'Area tutupan (hektare) berdasarkan kerapatan tajuk Sentinel-2, 2020–2026'
                : 'Nilai positif mengindikasikan ekspansi kanopi/restorasi; negatif mengindikasikan deforestasi/abrasi'}
            </p>
          </div>
        </div>

        {viewMode === 'stacked' ? (
          <ResponsiveContainer width="100%" height={340}>
            <AreaChart data={TEMPORAL_COVERAGE_DATA} margin={{ top: 8, right: 12, left: -10, bottom: 0 }}>
              <defs>
                {[
                  { id: 'g1', c: '#059669' }, { id: 'g2', c: '#10B981' },
                  { id: 'g3', c: '#D97706' }, { id: 'g4', c: '#DC2626' },
                ].map(({ id, c }) => (
                  <linearGradient key={id} id={id} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={c} stopOpacity={0.45} />
                    <stop offset="95%" stopColor={c} stopOpacity={0.05} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2EAE2" vertical={false} />
              <XAxis dataKey="year" tick={{ fontSize: 11, fill: '#718075' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#718075' }} axisLine={false} tickLine={false} />
              <Tooltip
                formatter={(v: any, name: any) => [`${Number(v).toFixed(1)} ha`, String(name || '')]}
                contentStyle={{ fontSize: '11px', borderRadius: '12px', border: '1px solid #E2EAE2' }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '12px' }} />
              <Area type="monotone" dataKey="denseAreaHa" name="Kerapatan Tinggi" stackId="1" stroke="#059669" fill="url(#g1)" strokeWidth={2} />
              <Area type="monotone" dataKey="moderateAreaHa" name="Kerapatan Sedang" stackId="1" stroke="#10B981" fill="url(#g2)" strokeWidth={2} />
              <Area type="monotone" dataKey="sparseAreaHa" name="Kerapatan Rendah" stackId="1" stroke="#D97706" fill="url(#g3)" strokeWidth={2} />
              <Area type="monotone" dataKey="degradedAreaHa" name="Terdegradasi" stackId="1" stroke="#DC2626" fill="url(#g4)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height={340}>
            <BarChart data={lossGainData} margin={{ top: 8, right: 12, left: -10, bottom: 0 }} barSize={36}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2EAE2" vertical={false} />
              <XAxis dataKey="year" tick={{ fontSize: 11, fill: '#718075' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#718075' }} axisLine={false} tickLine={false} />
              <ReferenceLine y={0} stroke="#CBD5E1" strokeWidth={1.5} />
              <Tooltip
                formatter={(v: any) => { const n = Number(v); return [`${n > 0 ? '+' : ''}${n.toFixed(1)} ha`, 'Perubahan Neto']; }}
                contentStyle={{ fontSize: '11px', borderRadius: '12px', border: '1px solid #E2EAE2' }}
              />
              <Bar dataKey="perubahan" name="Perubahan Neto (ha)" radius={[6, 6, 0, 0]}>
                {lossGainData.map((entry, i) => (
                  <Cell key={i} fill={entry.perubahan >= 0 ? '#059669' : '#DC2626'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
        <div className="mt-3 text-[9px] text-amber-600 font-semibold">◈ Data Simulasi — bukan time-series GEE aktual</div>
      </div>

      {/* Spatial Hotspots Breakdown per Kabupaten */}
      <div className="bg-white rounded-2xl border border-[#E2EAE2] p-5">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-bold text-[15px] text-[#1D2A22] flex items-center gap-2">
              <Layers size={16} className="text-[#174B32]" />
              Sebaran Dinamika Tutupan per Kabupaten/Kota Pesisir
            </h3>
            <p className="text-[12px] text-[#718075] mt-0.5">Identifikasi wilayah pemulihan (restorasi) vs wilayah rawan tekanan antropogenik</p>
          </div>
          <span className="text-[9px] text-amber-600 font-bold">◈ Data Simulasi</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {KABUPATEN_DATA.map((kab) => (
            <div key={kab.kabupaten} className="bg-[#F5F8F5] border border-[#E2EAE2] rounded-xl p-4 hover:border-[#174B32]/40 transition-all">
              <div className="flex items-center justify-between mb-2">
                <span className="font-extrabold text-sm text-[#1D2A22]">{kab.kabupaten}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  kab.status === 'Pemulihan' ? 'bg-emerald-100 text-emerald-800' :
                  kab.status === 'Stabil' ? 'bg-blue-100 text-blue-800' : 'bg-rose-100 text-rose-800'
                }`}>
                  {kab.status}
                </span>
              </div>
              <div className="flex items-baseline justify-between mb-2">
                <div>
                  <div className="text-[10px] text-[#718075]">Luas 2026</div>
                  <div className="text-base font-bold text-[#174B32]">{kab.area2026.toFixed(1)} ha</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-[#718075]">Perubahan Net</div>
                  <div className={`text-sm font-extrabold ${kab.changeHa > 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                    {kab.changeHa > 0 ? '+' : ''}{kab.changeHa.toFixed(1)} ha ({kab.changePct > 0 ? '+' : ''}{kab.changePct.toFixed(1)}%)
                  </div>
                </div>
              </div>
              <p className="text-[11px] text-[#718075] border-t border-[#E2EAE2] pt-2 mt-1 leading-snug">
                {kab.mainCause}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Proyeksi Skenario 2027–2030 */}
      <div className="bg-white rounded-2xl border border-[#E2EAE2] p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-5">
          <div>
            <h3 className="font-bold text-[15px] text-[#1D2A22] flex items-center gap-2">
              <BarChart2 size={16} className="text-[#174B32]" />
              Simulasi Proyeksi Masa Depan (2027–2030)
            </h3>
            <p className="text-[12px] text-[#718075] mt-0.5">Pemodelan skenario kebijakan lingkungan pesisir Provinsi Bengkulu</p>
          </div>
          <div className="flex gap-1 p-1 bg-[#F5F8F5] rounded-xl border border-[#E2EAE2]">
            {(['all', 'konservasi', 'bau', 'tertekan'] as const).map(sc => (
              <button
                key={sc}
                onClick={() => setSelectedScenario(sc)}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all ${
                  selectedScenario === sc
                    ? 'bg-white text-[#174B32] shadow-sm border border-[#E2EAE2]'
                    : 'text-[#718075] hover:text-[#1D2A22]'
                }`}
              >
                {sc === 'all' ? 'Semua Skenario' : sc === 'konservasi' ? 'Konservasi Ketat' : sc === 'bau' ? 'Tren Berjalan (BAU)' : 'Tekanan Tinggi'}
              </button>
            ))}
          </div>
        </div>

        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={PROJECTION_DATA} margin={{ top: 8, right: 12, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2EAE2" vertical={false} />
            <XAxis dataKey="year" tick={{ fontSize: 11, fill: '#718075' }} axisLine={false} tickLine={false} />
            <YAxis domain={[750, 950]} tick={{ fontSize: 11, fill: '#718075' }} axisLine={false} tickLine={false} />
            <Tooltip
              formatter={(v: any, name: any) => [`${Number(v).toFixed(1)} ha`, String(name || '')]}
              contentStyle={{ fontSize: '11px', borderRadius: '12px', border: '1px solid #E2EAE2' }}
            />
            <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
            <ReferenceLine x={2026} stroke="#CBD5E1" strokeDasharray="3 3" label={{ value: 'Tahun Sekarang', position: 'top', fill: '#718075', fontSize: 10 }} />
            <Line type="monotone" dataKey="historis" name="Historis (2020-2026)" stroke="#174B32" strokeWidth={3} dot={{ r: 4 }} />
            {(selectedScenario === 'all' || selectedScenario === 'konservasi') && (
              <Line type="monotone" dataKey="konservasi" name="Skenario Konservasi Ketat (+2.5%/th)" stroke="#059669" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 3 }} />
            )}
            {(selectedScenario === 'all' || selectedScenario === 'bau') && (
              <Line type="monotone" dataKey="bau" name="Skenario Tren Berjalan (+1.1%/th)" stroke="#0891B2" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 3 }} />
            )}
            {(selectedScenario === 'all' || selectedScenario === 'tertekan') && (
              <Line type="monotone" dataKey="tertekan" name="Skenario Tekanan Tinggi (-1.8%/th)" stroke="#DC2626" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 3 }} />
            )}
          </LineChart>
        </ResponsiveContainer>
        <div className="mt-3 text-[9px] text-amber-600 font-semibold">◈ Proyeksi Simulasi Matematis — bukan ramalan resmi instansi pemerintah</div>
      </div>

      {/* Year-by-year table */}
      <div className="bg-white rounded-2xl border border-[#E2EAE2] p-5">
        <h3 className="font-bold text-[15px] text-[#1D2A22] mb-4">Matriks Data Rinci per Tahun (2020–2026)</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-[12px]">
            <thead>
              <tr className="border-b border-[#E2EAE2] bg-[#F5F8F5]">
                {['Tahun', 'Total Area (ha)', 'Kerapatan Tinggi', 'Kerapatan Sedang', 'Kerapatan Rendah', 'Terdegradasi', 'Perubahan Net'].map(h => (
                  <th key={h} className="text-left text-[10px] font-semibold text-[#A8BFA5] uppercase tracking-wider px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TEMPORAL_COVERAGE_DATA.map((d) => (
                <tr key={d.year} className="border-b border-[#F5F8F5] hover:bg-[#F8FAF8] transition-colors">
                  <td className="px-4 py-3 font-bold text-[#1D2A22]">{d.year}</td>
                  <td className="px-4 py-3 font-semibold text-[#174B32]">{d.totalAreaHa.toFixed(1)}</td>
                  <td className="px-4 py-3 text-emerald-700 font-medium">{d.denseAreaHa.toFixed(1)}</td>
                  <td className="px-4 py-3 text-[#718075]">{d.moderateAreaHa.toFixed(1)}</td>
                  <td className="px-4 py-3 text-amber-700">{d.sparseAreaHa.toFixed(1)}</td>
                  <td className="px-4 py-3 text-rose-700">{d.degradedAreaHa.toFixed(1)}</td>
                  <td className="px-4 py-3">
                    <span className={`font-bold flex items-center gap-1 ${d.lossGainHa > 0 ? 'text-emerald-600' : d.lossGainHa < 0 ? 'text-rose-600' : 'text-[#A8BFA5]'}`}>
                      {d.lossGainHa > 0 ? <TrendingUp size={12} /> : d.lossGainHa < 0 ? <TrendingDown size={12} /> : <Minus size={12} />}
                      {d.lossGainHa > 0 ? '+' : ''}{d.lossGainHa.toFixed(1)} ha
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-3 text-[9px] text-amber-600 font-semibold">◈ Data Simulasi — batas tutupan dan angka hektar belum diverifikasi ground truth</div>
      </div>
    </div>
  );
};
