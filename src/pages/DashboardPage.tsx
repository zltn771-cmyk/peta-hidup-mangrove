import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Leaf, TrendingUp, TrendingDown, MapPin, MessageSquare, Eye,
  RefreshCw, ChevronRight, Calendar, Clock, Info,
  ArrowUpRight, Maximize2, Layers, Activity, AlertTriangle,
  CheckCircle2, Users, Shield,
} from 'lucide-react';
import { LeafletMangroveMap } from '../components/map/LeafletMangroveMap';
import { DashboardTrendChart, EcosystemCompositionChart } from '../components/charts/DashboardCharts';
import { BENGKULU_MANGROVE_ZONES, COMMUNITY_REPORTS, TEMPORAL_COVERAGE_DATA } from '../data/mockData';

// ── Types ────────────────────────────────────────────────────────────────────

type ZoneStatus = 'Kerapatan Tinggi' | 'Kerapatan Sedang' | 'Kerapatan Rendah' | 'Terdegradasi';

// ── Static data ───────────────────────────────────────────────────────────────

const LATEST = TEMPORAL_COVERAGE_DATA[TEMPORAL_COVERAGE_DATA.length - 1];
const PREV = TEMPORAL_COVERAGE_DATA[TEMPORAL_COVERAGE_DATA.length - 2];
const TOTAL_CHANGE_PCT = (((LATEST.totalAreaHa - PREV.totalAreaHa) / PREV.totalAreaHa) * 100).toFixed(2);
const TOTAL_CHANGE_ABS = (LATEST.totalAreaHa - PREV.totalAreaHa).toFixed(1);

const RECENT_ACTIVITIES = [
  {
    id: 1,
    type: 'update',
    icon: <RefreshCw size={14} />,
    iconBg: '#174B3215',
    iconColor: '#174B32',
    title: 'Pembaruan Data Pemantauan',
    desc: 'Data komposit Sentinel-2 periode Oktober 2026 tersedia untuk Kota Bengkulu.',
    time: '2 jam lalu',
    tag: 'Demonstrasi',
    tagColor: 'amber',
  },
  {
    id: 2,
    type: 'report',
    icon: <MessageSquare size={14} />,
    iconBg: '#0891B215',
    iconColor: '#0891B2',
    title: 'Laporan Masyarakat Baru',
    desc: 'Hendri Saputra (Nelayan) melaporkan pencemaran limbah di Pulau Baai.',
    time: '5 jam lalu',
    tag: 'Demonstrasi',
    tagColor: 'amber',
  },
  {
    id: 3,
    type: 'check',
    icon: <Shield size={14} />,
    iconBg: '#05966915',
    iconColor: '#059669',
    title: 'Pemeriksaan Wilayah',
    desc: 'Tim lapangan menjadwalkan verifikasi ground truth Muara Kinal, Bengkulu Selatan.',
    time: '1 hari lalu',
    tag: 'Demonstrasi',
    tagColor: 'amber',
  },
  {
    id: 4,
    type: 'analysis',
    icon: <Activity size={14} />,
    iconBg: '#7C3AED15',
    iconColor: '#7C3AED',
    title: 'Analisis Perubahan Selesai',
    desc: 'Deteksi perubahan tutupan multitemporal 2024–2026 di Mukomuko menunjukkan tren positif.',
    time: '2 hari lalu',
    tag: 'Demonstrasi',
    tagColor: 'amber',
  },
  {
    id: 5,
    type: 'restore',
    icon: <Leaf size={14} />,
    iconBg: '#05966915',
    iconColor: '#059669',
    title: 'Penanaman Berhasil Dicatat',
    desc: 'Kelompok Pokdarwis Air Rami melaporkan 1.200 bibit Rhizophora mucronata tertanam.',
    time: '3 hari lalu',
    tag: 'Demonstrasi',
    tagColor: 'amber',
  },
];

const STATUS_CONFIG: Record<ZoneStatus, { dot: string; badge: string; text: string }> = {
  'Kerapatan Tinggi': { dot: 'bg-emerald-500', badge: 'bg-emerald-50 border-emerald-200 text-emerald-700', text: 'Kerapatan Tinggi' },
  'Kerapatan Sedang': { dot: 'bg-[#A8BFA5]', badge: 'bg-[#A8BFA5]/20 border-[#A8BFA5]/40 text-[#103D2B]', text: 'Kerapatan Sedang' },
  'Kerapatan Rendah': { dot: 'bg-amber-500', badge: 'bg-amber-50 border-amber-200 text-amber-700', text: 'Kerapatan Rendah' },
  'Terdegradasi': { dot: 'bg-rose-500', badge: 'bg-rose-50 border-rose-200 text-rose-700', text: 'Terdegradasi' },
};

// ── Helpers ───────────────────────────────────────────────────────────────────

const SimBadge = () => (
  <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded-full">
    <AlertTriangle size={8} /> Simulasi
  </span>
);

// ── Main Component ────────────────────────────────────────────────────────────

export const DashboardPage: React.FC = () => {
  const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null);
  const [mapExpanded, setMapExpanded] = useState(false);
  const [activeZoneTab, setActiveZoneTab] = useState<'all' | 'tinggi' | 'kritis'>('all');

  const filteredZones = BENGKULU_MANGROVE_ZONES.filter(z => {
    if (activeZoneTab === 'tinggi') return z.status === 'Kerapatan Tinggi';
    if (activeZoneTab === 'kritis') return z.healthScore < 60;
    return true;
  });

  const pendingReports = COMMUNITY_REPORTS.filter(r => r.status === 'Menunggu Verifikasi').length;
  const verifiedReports = COMMUNITY_REPORTS.filter(r => r.status === 'Terverifikasi' || r.status === 'Selesai').length;

  // ── Stat cards data ────────────────────────────────────────────────────────

  const STATS = [
    {
      id: 'area',
      label: 'Total Luas Tutupan',
      value: LATEST.totalAreaHa.toFixed(0),
      unit: 'ha',
      sub: 'Estimasi agregat Prov. Bengkulu',
      icon: <Leaf size={18} />,
      iconBg: '#174B3214',
      iconColor: '#174B32',
      trend: { positive: parseFloat(TOTAL_CHANGE_ABS) > 0, text: `${parseFloat(TOTAL_CHANGE_ABS) > 0 ? '+' : ''}${TOTAL_CHANGE_ABS} ha dari 2025` },
    },
    {
      id: 'change',
      label: 'Perubahan Tutupan',
      value: `${parseFloat(TOTAL_CHANGE_PCT) > 0 ? '+' : ''}${TOTAL_CHANGE_PCT}%`,
      unit: '',
      sub: `Tren 2025–2026 (${parseFloat(TOTAL_CHANGE_ABS) > 0 ? 'peningkatan' : 'penurunan'})`,
      icon: parseFloat(TOTAL_CHANGE_PCT) > 0 ? <TrendingUp size={18} /> : <TrendingDown size={18} />,
      iconBg: parseFloat(TOTAL_CHANGE_PCT) > 0 ? '#05966914' : '#DC262614',
      iconColor: parseFloat(TOTAL_CHANGE_PCT) > 0 ? '#059669' : '#DC2626',
      trend: { positive: parseFloat(TOTAL_CHANGE_PCT) > 0, text: 'Data demonstrasi — bukan pengukuran aktual' },
    },
    {
      id: 'zones',
      label: 'Wilayah Pemantauan',
      value: BENGKULU_MANGROVE_ZONES.length,
      unit: 'lokasi',
      sub: 'Area demonstrasi sepanjang pesisir',
      icon: <MapPin size={18} />,
      iconBg: '#0891B214',
      iconColor: '#0891B2',
      trend: { positive: true, text: `${BENGKULU_MANGROVE_ZONES.filter(z => z.status === 'Kerapatan Tinggi').length} kerapatan tinggi` },
    },
    {
      id: 'reports',
      label: 'Laporan Masyarakat',
      value: COMMUNITY_REPORTS.length,
      unit: 'laporan',
      sub: `${pendingReports} menunggu verifikasi`,
      icon: <MessageSquare size={18} />,
      iconBg: '#7C3AED14',
      iconColor: '#7C3AED',
      trend: { positive: true, text: `${verifiedReports} terverifikasi / selesai` },
    },
  ];

  return (
    <div className="space-y-5">

      {/* ── Page Header ─────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-1.5 text-[11px] text-[#A8BFA5] font-medium mb-1">
            <span>Dashboard</span>
            <ChevronRight size={11} />
            <span className="text-[#718075]">Monitoring</span>
          </div>
          <h1 className="text-[22px] font-bold text-[#1D2A22] leading-tight">Monitoring Overview</h1>
          <p className="text-[13px] text-[#718075] mt-1 leading-relaxed">
            Ringkasan kondisi dan perkembangan ekosistem mangrove Bengkulu
          </p>
        </div>
        <div className="flex flex-col items-end gap-2 flex-shrink-0">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-700 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1.5 rounded-lg">
              <AlertTriangle size={10} />
              Demonstration Data
            </span>
            <span className="inline-flex items-center gap-1.5 bg-[#F5F8F5] border border-[#E2EAE2] text-[#718075] text-[10px] font-semibold px-2.5 py-1.5 rounded-lg">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live Preview
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-[#A8BFA5]">
            <Calendar size={11} />
            <span>Periode Pemantauan: 2020–2026</span>
          </div>
        </div>
      </div>

      {/* ── Stat Cards ──────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {STATS.map((s) => (
          <div
            key={s.id}
            className="bg-white rounded-2xl border border-[#E2EAE2] p-5 hover:border-[#A8BFA5] hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-start justify-between mb-4">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: s.iconBg }}
              >
                <span style={{ color: s.iconColor }}>{s.icon}</span>
              </div>
              <SimBadge />
            </div>
            <div className="flex items-baseline gap-1.5 mb-0.5">
              <span className="text-[26px] font-bold text-[#1D2A22] leading-none">{s.value}</span>
              {s.unit && <span className="text-[13px] font-medium text-[#718075]">{s.unit}</span>}
            </div>
            <div className="text-[12px] font-semibold text-[#1D2A22] mb-0.5">{s.label}</div>
            <div className="text-[11px] text-[#A8BFA5] leading-snug mb-2">{s.sub}</div>
            <div className={`flex items-center gap-1 text-[11px] font-medium ${s.trend.positive ? 'text-emerald-600' : 'text-rose-600'}`}>
              {s.trend.positive ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
              <span className="leading-snug">{s.trend.text}</span>
            </div>
          </div>
        ))}
      </div>

      {/* ── Map + Sidebar ────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

        {/* Map Card (2/3) */}
        <div className={`xl:col-span-2 bg-white rounded-2xl border border-[#E2EAE2] overflow-hidden transition-all duration-300 ${mapExpanded ? 'xl:col-span-3' : ''}`}>
          {/* Map header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#E2EAE2]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#174B32]/10 flex items-center justify-center flex-shrink-0">
                <Layers size={15} className="text-[#174B32]" />
              </div>
              <div>
                <h2 className="font-bold text-[14px] text-[#1D2A22]">Sebaran Mangrove Bengkulu</h2>
                <p className="text-[11px] text-[#A8BFA5]">
                  {BENGKULU_MANGROVE_ZONES.length} area demonstrasi · OpenStreetMap basemap
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <SimBadge />
              <button
                onClick={() => setMapExpanded(!mapExpanded)}
                className="p-2 rounded-lg hover:bg-[#F5F8F5] text-[#718075] transition-colors"
                title={mapExpanded ? 'Perkecil' : 'Perbesar'}
              >
                <Maximize2 size={14} />
              </button>
              <a
                href="/peta"
                className="hidden sm:flex items-center gap-1 text-[12px] font-semibold text-[#174B32] hover:text-[#103D2B] transition-colors"
              >
                Buka Peta <ArrowUpRight size={13} />
              </a>
            </div>
          </div>

          {/* Leaflet map */}
          <LeafletMangroveMap
            height={mapExpanded ? '580px' : '460px'}
            selectedZoneId={selectedZoneId}
            onZoneSelect={setSelectedZoneId}
          />
        </div>

        {/* Right column (1/3) — only visible when map not expanded */}
        {!mapExpanded && (
          <div className="xl:col-span-1 flex flex-col gap-5">

            {/* Ecosystem Composition */}
            <div className="bg-white rounded-2xl border border-[#E2EAE2] p-5 flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-bold text-[14px] text-[#1D2A22]">Komposisi Ekosistem</h3>
                  <p className="text-[11px] text-[#A8BFA5] mt-0.5">Estimasi luas kawasan pesisir</p>
                </div>
                <SimBadge />
              </div>
              <EcosystemCompositionChart />
              <div className="mt-3 pt-3 border-t border-[#E2EAE2] text-[10px] text-[#A8BFA5] leading-relaxed">
                Komposisi berdasarkan estimasi demonstrasi — bukan hasil pengolahan citra aktual.
              </div>
            </div>

            {/* Quick info */}
            <div className="bg-gradient-to-br from-[#174B32] to-[#103D2B] rounded-2xl p-5 text-white relative overflow-hidden">
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/5 rounded-full" />
              <div className="relative">
                <div className="text-[11px] font-semibold text-[#A8BFA5] uppercase tracking-wider mb-2">Platform Status</div>
                <div className="space-y-2 text-[12px]">
                  {[
                    { label: 'Sentinel-2 API', status: 'Direncanakan', ok: false },
                    { label: 'Ground Truth Data', status: 'Demonstrasi', ok: false },
                    { label: 'RF Model', status: 'Prototipe', ok: false },
                    { label: 'Community Reports', status: 'Aktif (UI)', ok: true },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between">
                      <span className="text-white/70">{item.label}</span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${item.ok ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'}`}>
                        {item.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Trend Chart ──────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-[#E2EAE2] p-5">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-5">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2 className="font-bold text-[16px] text-[#1D2A22]">Tren Perubahan Tutupan Mangrove</h2>
              <SimBadge />
            </div>
            <p className="text-[12px] text-[#718075] mt-0.5">
              Luas tutupan (ha) · Periode demonstrasi 2020–2026 · Sumbu Y = Hektare
            </p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="flex items-center gap-1.5 text-[11px] text-[#A8BFA5]">
              <Info size={12} />
              <span>Data simulasi — bukan time-series GEE aktual</span>
            </div>
          </div>
        </div>
        <DashboardTrendChart />
      </div>

      {/* ── Priority Zones + Activity ─────────────────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-5">

        {/* Priority zones (3/5) */}
        <div className="xl:col-span-3 bg-white rounded-2xl border border-[#E2EAE2] p-5">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="font-bold text-[16px] text-[#1D2A22]">Wilayah Prioritas Pemantauan</h2>
              <p className="text-[12px] text-[#718075] mt-0.5">Area demonstrasi berdasarkan skor kesehatan ekosistem</p>
            </div>
            <SimBadge />
          </div>

          {/* Tabs */}
          <div className="flex gap-1 p-1 bg-[#F5F8F5] rounded-xl border border-[#E2EAE2] mb-4 w-fit">
            {([['all', 'Semua'], ['tinggi', 'Kerapatan Tinggi'], ['kritis', 'Perlu Perhatian']] as const).map(([k, l]) => (
              <button
                key={k}
                onClick={() => setActiveZoneTab(k)}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all whitespace-nowrap ${
                  activeZoneTab === k
                    ? 'bg-white text-[#174B32] shadow-sm border border-[#E2EAE2]'
                    : 'text-[#718075] hover:text-[#1D2A22]'
                }`}
              >
                {l}
              </button>
            ))}
          </div>

          {/* Zone table */}
          <div className="overflow-x-auto">
            <table className="w-full text-[12px]">
              <thead>
                <tr className="border-b border-[#E2EAE2]">
                  {['Nama Wilayah', 'Status', 'Skor', 'Terakhir', 'Aksi'].map((h) => (
                    <th key={h} className="text-left text-[10px] font-semibold text-[#A8BFA5] uppercase tracking-wider pb-2.5 pr-4 last:pr-0">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredZones.map((zone) => {
                  const cfg = STATUS_CONFIG[zone.status as ZoneStatus];
                  const isSelected = zone.id === selectedZoneId;
                  return (
                    <tr
                      key={zone.id}
                      onClick={() => setSelectedZoneId(zone.id === selectedZoneId ? null : zone.id)}
                      className={`border-b border-[#F5F8F5] cursor-pointer transition-colors ${
                        isSelected ? 'bg-[#F5F8F5]' : 'hover:bg-[#F8FAF8]'
                      }`}
                    >
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full flex-shrink-0 ${cfg.dot}`} />
                          <div>
                            <div className="font-semibold text-[#1D2A22] leading-tight">
                              {zone.name}
                            </div>
                            <div className="text-[10px] text-[#A8BFA5]">{zone.kabupaten}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 pr-4">
                        <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-full border ${cfg.badge}`}>
                          {zone.status}
                        </span>
                      </td>
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-1.5">
                          <div className="w-12 h-1.5 bg-[#E2EAE2] rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: `${zone.healthScore}%`,
                                backgroundColor: zone.healthScore >= 70 ? '#059669' : zone.healthScore >= 50 ? '#D97706' : '#DC2626',
                              }}
                            />
                          </div>
                          <span className="font-bold text-[#1D2A22] text-[11px]">{zone.healthScore}%</span>
                        </div>
                      </td>
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-1 text-[10px] text-[#A8BFA5]">
                          <Clock size={9} />
                          <span>Nov 2026</span>
                        </div>
                      </td>
                      <td className="py-3">
                        <Link
                          to="/peta"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#174B32] hover:text-[#103D2B] transition-colors"
                        >
                          Detail <ChevronRight size={11} />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {filteredZones.length === 0 && (
            <div className="py-8 text-center text-[13px] text-[#A8BFA5]">
              Tidak ada wilayah untuk filter ini.
            </div>
          )}

          {/* Summary row */}
          <div className="mt-4 pt-4 border-t border-[#E2EAE2] flex flex-wrap gap-4 text-[11px] text-[#718075]">
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500" />{BENGKULU_MANGROVE_ZONES.filter(z => z.status === 'Kerapatan Tinggi').length} Kerapatan Tinggi</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#A8BFA5]" />{BENGKULU_MANGROVE_ZONES.filter(z => z.status === 'Kerapatan Sedang').length} Kerapatan Sedang</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500" />{BENGKULU_MANGROVE_ZONES.filter(z => z.status === 'Kerapatan Rendah').length} Kerapatan Rendah</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-rose-500" />{BENGKULU_MANGROVE_ZONES.filter(z => z.status === 'Terdegradasi').length} Terdegradasi</span>
          </div>
        </div>

        {/* Recent activities (2/5) */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-[#E2EAE2] p-5">
          <div className="flex items-start justify-between mb-5">
            <div>
              <h2 className="font-bold text-[16px] text-[#1D2A22]">Aktivitas Terbaru</h2>
              <p className="text-[12px] text-[#718075] mt-0.5">Log pemantauan demonstrasi</p>
            </div>
            <SimBadge />
          </div>

          <div className="space-y-1">
            {RECENT_ACTIVITIES.map((act, idx) => (
              <div key={act.id} className="relative">
                {idx < RECENT_ACTIVITIES.length - 1 && (
                  <div className="absolute left-4 top-9 bottom-0 w-px bg-[#E2EAE2]" />
                )}
                <div className="flex gap-3 pb-4">
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 relative z-10"
                    style={{ backgroundColor: act.iconBg, color: act.iconColor }}
                  >
                    {act.icon}
                  </div>
                  <div className="flex-1 min-w-0 pt-0.5">
                    <div className="flex items-start justify-between gap-2 mb-0.5">
                      <span className="font-semibold text-[12px] text-[#1D2A22] leading-tight">{act.title}</span>
                      <span className="text-[9px] text-amber-600 font-semibold flex-shrink-0 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded-full">
                        Demo
                      </span>
                    </div>
                    <p className="text-[11px] text-[#718075] leading-relaxed mb-1.5">{act.desc}</p>
                    <div className="flex items-center gap-1 text-[10px] text-[#A8BFA5]">
                      <Clock size={9} />
                      <span>{act.time}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* View all */}
          <Link
            to="/laporan"
            className="mt-2 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-[#E2EAE2] text-[12px] font-semibold text-[#718075] hover:bg-[#F5F8F5] hover:text-[#1D2A22] transition-all"
          >
            Lihat Semua Laporan <ArrowUpRight size={13} />
          </Link>
        </div>
      </div>

      {/* ── Community Reports summary ─────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-[#E2EAE2] p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#7C3AED]/10 flex items-center justify-center">
              <Users size={15} className="text-[#7C3AED]" />
            </div>
            <div>
              <h2 className="font-bold text-[14px] text-[#1D2A22]">Laporan Masyarakat Terbaru</h2>
              <p className="text-[11px] text-[#A8BFA5]">Citizen science pesisir Bengkulu · {COMMUNITY_REPORTS.length} laporan demonstrasi</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <SimBadge />
            <Link to="/laporan" className="hidden sm:flex items-center gap-1 text-[12px] font-semibold text-[#174B32] hover:text-[#103D2B] transition-colors">
              Semua <ArrowUpRight size={13} />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {COMMUNITY_REPORTS.slice(0, 4).map((report) => {
            const categoryColors: Record<string, string> = {
              'Penebangan Liar': '#DC2626',
              'Pencemaran Limbah': '#D97706',
              'Abrasi Garis Pantai': '#0891B2',
              'Restorasi / Bibit Baru': '#059669',
              'Kematian Pohon': '#7C3AED',
            };
            const statusIcons: Record<string, React.ReactNode> = {
              'Terverifikasi': <CheckCircle2 size={12} className="text-emerald-600" />,
              'Tindak Lanjut': <Activity size={12} className="text-blue-600" />,
              'Menunggu Verifikasi': <Clock size={12} className="text-amber-600" />,
              'Selesai': <CheckCircle2 size={12} className="text-[#A8BFA5]" />,
            };
            const catColor = categoryColors[report.category] || '#718075';
            return (
              <div key={report.id} className="border border-[#E2EAE2] rounded-xl p-3.5 hover:border-[#A8BFA5] transition-all group">
                <div className="flex items-start justify-between mb-2">
                  <span
                    className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: `${catColor}15`, color: catColor, border: `1px solid ${catColor}25` }}
                  >
                    {report.category}
                  </span>
                  <div className="flex items-center gap-1 text-[10px] text-[#718075]">
                    {statusIcons[report.status]}
                    <span>{report.status}</span>
                  </div>
                </div>
                <div className="font-semibold text-[12px] text-[#1D2A22] mb-1 group-hover:text-[#174B32] transition-colors">
                  {report.locationName}
                </div>
                <p className="text-[11px] text-[#718075] leading-relaxed line-clamp-2 mb-2">{report.description}</p>
                <div className="flex items-center justify-between text-[10px] text-[#A8BFA5]">
                  <span className="flex items-center gap-1"><MapPin size={9} /> {report.kabupaten}</span>
                  <span className="flex items-center gap-1"><Calendar size={9} /> {report.date}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
