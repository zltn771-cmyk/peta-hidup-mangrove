import React from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  unit?: string;
  icon: React.ReactNode;
  trend?: { value: string; positive: boolean };
  accentColor?: string;
  isSimulated?: boolean;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  unit,
  icon,
  trend,
  accentColor = '#174B32',
  isSimulated = true,
  className = '',
}) => {
  return (
    <div
      className={`bg-white rounded-2xl border border-[#E2EAE2] p-5 hover:border-[#A8BFA5] hover:shadow-md transition-all duration-200 ${className}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: `${accentColor}14` }}
        >
          <span style={{ color: accentColor }}>{icon}</span>
        </div>
        {isSimulated && (
          <span className="text-[9px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
            Simulasi
          </span>
        )}
      </div>
      <div>
        <div className="flex items-baseline gap-1.5 mb-1">
          <span className="text-2xl font-bold text-[#1D2A22] leading-none">{value}</span>
          {unit && <span className="text-sm font-medium text-[#718075]">{unit}</span>}
        </div>
        <div className="text-[13px] text-[#718075] leading-snug">{label}</div>
        {trend && (
          <div className={`mt-2 flex items-center gap-1 text-[11px] font-semibold ${trend.positive ? 'text-emerald-600' : 'text-rose-600'}`}>
            <span>{trend.positive ? '▲' : '▼'}</span>
            <span>{trend.value}</span>
            <span className="text-[#A8BFA5] font-normal ml-0.5">vs tahun lalu</span>
          </div>
        )}
      </div>
    </div>
  );
};
