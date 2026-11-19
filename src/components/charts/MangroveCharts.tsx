import React from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, Legend
} from 'recharts';
import { TEMPORAL_COVERAGE_DATA } from '../../data/mockData';
import { BENGKULU_MANGROVE_ZONES } from '../../data/mockData';

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { value: number; name: string; color: string }[]; label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-[#E2EAE2] rounded-xl shadow-lg p-3 text-xs">
        <p className="font-bold text-[#1D2A22] mb-2">{label}</p>
        {payload.map((entry, i) => (
          <div key={i} className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ backgroundColor: entry.color }} />
            <span className="text-[#718075]">{entry.name}:</span>
            <span className="font-semibold text-[#1D2A22]">{entry.value.toFixed(1)} ha</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export const TemporalChart: React.FC = () => {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={TEMPORAL_COVERAGE_DATA} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
        <defs>
          <linearGradient id="denseGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#059669" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#059669" stopOpacity={0.03} />
          </linearGradient>
          <linearGradient id="moderateGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#A8BFA5" stopOpacity={0.4} />
            <stop offset="95%" stopColor="#A8BFA5" stopOpacity={0.03} />
          </linearGradient>
          <linearGradient id="sparseGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#D97706" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#D97706" stopOpacity={0.03} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#E2EAE2" vertical={false} />
        <XAxis dataKey="year" tick={{ fontSize: 11, fill: '#718075' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: '#718075' }} axisLine={false} tickLine={false} />
        <Tooltip content={<CustomTooltip />} />
        <Legend
          wrapperStyle={{ fontSize: '11px', color: '#718075', paddingTop: '12px' }}
          formatter={(value) => <span style={{ color: '#718075' }}>{value}</span>}
        />
        <Area type="monotone" dataKey="denseAreaHa" name="Kerapatan Tinggi" stackId="1" stroke="#059669" fill="url(#denseGrad)" strokeWidth={2} />
        <Area type="monotone" dataKey="moderateAreaHa" name="Kerapatan Sedang" stackId="1" stroke="#A8BFA5" fill="url(#moderateGrad)" strokeWidth={2} />
        <Area type="monotone" dataKey="sparseAreaHa" name="Kerapatan Rendah" stackId="1" stroke="#D97706" fill="url(#sparseGrad)" strokeWidth={2} />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export const ZoneHealthChart: React.FC = () => {
  const data = BENGKULU_MANGROVE_ZONES.map((z) => ({
    name: z.name.split(' ').slice(0, 2).join(' '),
    score: z.healthScore,
  }));

  const getBarColor = (score: number) => {
    if (score >= 70) return '#059669';
    if (score >= 50) return '#D97706';
    return '#DC2626';
  };

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} margin={{ top: 4, right: 8, left: -20, bottom: 0 }} barSize={22}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E2EAE2" vertical={false} />
        <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#718075' }} axisLine={false} tickLine={false} />
        <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#718075' }} axisLine={false} tickLine={false} />
        <Tooltip
          formatter={(value: unknown) => [`${Number(value)}%`, 'Skor Kesehatan']}
          contentStyle={{ fontSize: '11px', borderRadius: '12px', border: '1px solid #E2EAE2' }}
        />
        <Bar dataKey="score" radius={[6, 6, 0, 0]}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={getBarColor(entry.score)} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};
