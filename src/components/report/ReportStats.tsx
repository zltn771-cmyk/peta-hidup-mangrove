import React from 'react';
import { FileText, Clock, Eye, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface ReportStatsProps {
  total: number;
  submitted: number;
  underReview: number;
  verified: number;
  resolved: number;
}

export const ReportStats: React.FC<ReportStatsProps> = ({
  total, submitted, underReview, verified, resolved,
}) => {
  const stats = [
    {
      label: 'Total Laporan',
      value: total,
      icon: <FileText size={18} className="text-[#A8BFA5]" />,
      color: '#174B32',
      bg: '#F5F8F5',
      border: '#A8BFA5',
    },
    {
      label: 'Menunggu Pemeriksaan',
      value: submitted,
      icon: <Clock size={18} className="text-[#D97706]" />,
      color: '#D97706',
      bg: '#FFFBEB',
      border: '#FDE68A',
    },
    {
      label: 'Sedang Diperiksa',
      value: underReview,
      icon: <Eye size={18} className="text-[#0891B2]" />,
      color: '#0891B2',
      bg: '#ECFEFF',
      border: '#A5F3FC',
    },
    {
      label: 'Terverifikasi',
      value: verified,
      icon: <ShieldCheck size={18} className="text-[#059669]" />,
      color: '#059669',
      bg: '#ECFDF5',
      border: '#A7F3D0',
    },
    {
      label: 'Selesai Ditindaklanjuti',
      value: resolved,
      icon: <CheckCircle2 size={18} className="text-[#174B32]" />,
      color: '#174B32',
      bg: '#F0FDF4',
      border: '#86EFAC',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
      {stats.map((s) => (
        <div
          key={s.label}
          className="rounded-2xl border p-4 flex flex-col gap-2"
          style={{ background: s.bg, borderColor: s.border }}
        >
          <div className="flex items-center justify-between">
            {s.icon}
            <span
              className="text-2xl font-extrabold"
              style={{ color: s.color }}
            >
              {s.value}
            </span>
          </div>
          <span className="text-[11px] font-semibold text-[#718075] leading-tight">
            {s.label}
          </span>
        </div>
      ))}
    </div>
  );
};
