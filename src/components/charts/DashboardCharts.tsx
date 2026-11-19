import React from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, PieChart, Pie, Cell,
} from 'recharts';
import { TEMPORAL_COVERAGE_DATA } from '../../data/mockData';

// ── Trend chart ──────────────────────────────────────────────────────────────

const TrendTooltip = ({
  active, payload, label,
}: {
  active?: boolean;
  payload?: { value: number; name: string; color: string }[];
  label?: string | number;
}) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-[#E2EAE2] rounded-xl shadow-lg p-3 text-xs">
      <p className="font-bold text-[#1D2A22] mb-2">Tahun {label}</p>
      {payload.map((e, i) => (
        <div key={i} className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-sm flex-shrink-0" style={{ backgroundColor: e.color }} />
          <span className="text-[#718075]">{e.name}:</span>
          <span className="font-semibold text-[#1D2A22]">{Number(e.value).toFixed(1)} ha</span>
        </div>
      ))}
    </div>
  );
};

export const DashboardTrendChart: React.FC = () => (
  <ResponsiveContainer width="100%" height={220}>
    <AreaChart data={TEMPORAL_COVERAGE_DATA} margin={{ top: 4, right: 8, left: -18, bottom: 0 }}>
      <defs>
        <linearGradient id="gTotal" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#174B32" stopOpacity={0.3} />
          <stop offset="95%" stopColor="#174B32" stopOpacity={0.03} />
        </linearGradient>
        <linearGradient id="gDense" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#059669" stopOpacity={0.4} />
          <stop offset="95%" stopColor="#059669" stopOpacity={0.03} />
        </linearGradient>
      </defs>
      <CartesianGrid strokeDasharray="3 3" stroke="#E2EAE2" vertical={false} />
      <XAxis dataKey="year" tick={{ fontSize: 11, fill: '#718075' }} axisLine={false} tickLine={false} />
      <YAxis tick={{ fontSize: 11, fill: '#718075' }} axisLine={false} tickLine={false} />
      <Tooltip content={<TrendTooltip />} />
      <Legend
        wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
        formatter={(v) => <span style={{ color: '#718075' }}>{v}</span>}
      />
      <Area
        type="monotone" dataKey="totalAreaHa" name="Total Mangrove"
        stroke="#174B32" fill="url(#gTotal)" strokeWidth={2.5}
      />
      <Area
        type="monotone" dataKey="denseAreaHa" name="Kerapatan Tinggi"
        stroke="#059669" fill="url(#gDense)" strokeWidth={2}
      />
    </AreaChart>
  </ResponsiveContainer>
);

// ── Ecosystem composition pie ─────────────────────────────────────────────────

const ECO_DATA = [
  { name: 'Mangrove Aktif', value: 835, color: '#174B32' },
  { name: 'Non-Mangrove Pesisir', value: 1240, color: '#A8BFA5' },
  { name: 'Perlu Verifikasi', value: 185, color: '#D97706' },
];

const RADIAN = Math.PI / 180;
const renderLabel = (props: {
  cx?: number; cy?: number; midAngle?: number;
  innerRadius?: number; outerRadius?: number; percent?: number;
}) => {
  const { cx = 0, cy = 0, midAngle = 0, innerRadius = 0, outerRadius = 0, percent = 0 } = props;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return percent > 0.08 ? (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={700}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  ) : null;
};

export const EcosystemCompositionChart: React.FC = () => (
  <div className="flex flex-col items-center">
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie
          data={ECO_DATA}
          cx="50%" cy="50%"
          innerRadius={52} outerRadius={88}
          dataKey="value"
          labelLine={false}
          label={renderLabel}
          strokeWidth={2} stroke="white"
        >
          {ECO_DATA.map((entry, i) => (
            <Cell key={i} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          formatter={(v: unknown) => [`${Number(v).toLocaleString('id-ID')} ha`, '']}
          contentStyle={{ fontSize: '11px', borderRadius: '12px', border: '1px solid #E2EAE2' }}
        />
      </PieChart>
    </ResponsiveContainer>
    <div className="flex flex-col gap-2 w-full mt-1">
      {ECO_DATA.map((d) => (
        <div key={d.name} className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: d.color }} />
            <span className="text-[11px] text-[#718075]">{d.name}</span>
          </div>
          <span className="text-[11px] font-semibold text-[#1D2A22]">{d.value.toLocaleString('id-ID')} ha</span>
        </div>
      ))}
    </div>
  </div>
);
