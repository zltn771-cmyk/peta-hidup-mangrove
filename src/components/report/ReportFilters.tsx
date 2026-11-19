import React from 'react';
import { Filter, ChevronDown, X } from 'lucide-react';
import { ReportCategory, ReportStatus, Kabupaten, ReportFilterState } from '../../types/report';

const REPORT_CATEGORIES: ReportCategory[] = [
  'Indikasi Penebangan Mangrove', 'Alih Fungsi Lahan', 'Sampah dan Pencemaran',
  'Kerusakan Vegetasi', 'Abrasi Pesisir', 'Kegiatan Rehabilitasi',
  'Kondisi Perlu Diperiksa', 'Lainnya',
];

const KABUPATENS: Kabupaten[] = [
  'Kota Bengkulu', 'Bengkulu Tengah', 'Bengkulu Utara', 'Bengkulu Selatan',
  'Mukomuko', 'Kaur', 'Seluma', 'Kepahiang', 'Rejang Lebong', 'Lebong', 'Lainnya',
];

const STATUSES: ReportStatus[] = ['Submitted', 'Under Review', 'Verified', 'Resolved'];

const STATUS_LABELS: Record<ReportStatus, string> = {
  'Submitted': 'Terkirim',
  'Under Review': 'Sedang Diperiksa',
  'Verified': 'Terverifikasi',
  'Resolved': 'Selesai',
};

interface ReportFiltersProps {
  filters: ReportFilterState;
  onFilterChange: (f: ReportFilterState) => void;
  totalShown: number;
  totalAll: number;
}

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
}) {
  return (
    <div className="relative">
      <div className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#A8BFA5]">
        <ChevronDown size={13} />
      </div>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="pl-7 pr-3 py-2 text-xs font-medium text-[#1D2A22] bg-white border border-[#E2EAE2] rounded-xl appearance-none outline-none focus:border-[#174B32] transition-colors w-full"
        aria-label={label}
      >
        <option value="all">{label}</option>
        {options.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  );
}

export const ReportFilters: React.FC<ReportFiltersProps> = ({
  filters, onFilterChange, totalShown, totalAll,
}) => {
  const hasActiveFilter =
    filters.category !== 'all' ||
    filters.kabupaten !== 'all' ||
    filters.status !== 'all';

  const reset = () =>
    onFilterChange({ category: 'all', kabupaten: 'all', status: 'all' });

  return (
    <div className="bg-white rounded-2xl border border-[#E2EAE2] p-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1.5 text-xs font-bold text-[#1D2A22]">
          <Filter size={14} className="text-[#174B32]" />
          <span>Filter Laporan</span>
        </div>

        <div className="flex flex-wrap gap-2 flex-1">
          <SelectField
            label="Semua Kategori"
            value={filters.category}
            options={REPORT_CATEGORIES.map(c => ({ value: c, label: c }))}
            onChange={v => onFilterChange({ ...filters, category: v as ReportCategory | 'all' })}
          />
          <SelectField
            label="Semua Kabupaten"
            value={filters.kabupaten}
            options={KABUPATENS.map(k => ({ value: k, label: k }))}
            onChange={v => onFilterChange({ ...filters, kabupaten: v as Kabupaten | 'all' })}
          />
          <SelectField
            label="Semua Status"
            value={filters.status}
            options={STATUSES.map(s => ({ value: s, label: STATUS_LABELS[s] }))}
            onChange={v => onFilterChange({ ...filters, status: v as ReportStatus | 'all' })}
          />
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <span className="text-[11px] text-[#718075]">
            {totalShown} dari {totalAll} laporan
          </span>
          {hasActiveFilter && (
            <button
              onClick={reset}
              className="flex items-center gap-1 text-[11px] font-semibold text-[#DC2626] hover:bg-red-50 px-2 py-1 rounded-lg transition-colors border border-transparent hover:border-red-200"
            >
              <X size={12} /> Reset
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
