import React from 'react';
import { MapPin, Calendar, ChevronRight, User } from 'lucide-react';
import { CommunityReportFull } from '../../types/report';
import { StatusBadge, CategoryBadge } from './ReportBadges';

interface ReportCardProps {
  report: CommunityReportFull;
  onViewDetail: (report: CommunityReportFull) => void;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
}

export const ReportCard: React.FC<ReportCardProps> = ({ report, onViewDetail }) => {
  return (
    <div className="bg-white rounded-2xl border border-[#E2EAE2] p-4 hover:border-[#A8BFA5] hover:shadow-sm transition-all group">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
            <span className="font-mono text-[10px] text-[#718075] bg-[#F5F8F5] px-2 py-0.5 rounded-full border border-[#E2EAE2]">
              {report.report_id}
            </span>
            {report.isDemo && (
              <span className="text-[9px] font-bold text-[#D97706] bg-[#FFFBEB] px-1.5 py-0.5 rounded-full border border-[#FDE68A]">
                DEMO
              </span>
            )}
          </div>
          <CategoryBadge category={report.report_category} />
        </div>
        <StatusBadge status={report.status} />
      </div>

      <div className="space-y-1.5 mb-3">
        <div className="flex items-center gap-1.5 text-xs text-[#718075]">
          <MapPin size={12} className="flex-shrink-0 text-[#A8BFA5]" />
          <span className="truncate font-medium text-[#1D2A22]">{report.location_name}</span>
          <span className="text-[#A8BFA5]">·</span>
          <span className="text-[#718075]">{report.kabupaten}</span>
        </div>
        <div className="flex items-center gap-3 text-[11px] text-[#718075]">
          <div className="flex items-center gap-1">
            <User size={11} className="text-[#A8BFA5]" />
            <span>{report.reporter_name}</span>
            <span className="text-[#A8BFA5]">({report.reporter_category})</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar size={11} className="text-[#A8BFA5]" />
            <span>{formatDate(report.created_at)}</span>
          </div>
        </div>
      </div>

      <p className="text-xs text-[#718075] leading-relaxed line-clamp-2 mb-3">
        {report.description}
      </p>

      <div className="flex items-center justify-between">
        {report.photo_urls.length > 0 ? (
          <span className="text-[11px] text-[#A8BFA5]">{report.photo_urls.length} foto dokumentasi</span>
        ) : (
          <span className="text-[11px] text-[#A8BFA5]">Tanpa foto</span>
        )}
        <button
          onClick={() => onViewDetail(report)}
          className="flex items-center gap-1 text-xs font-semibold text-[#174B32] hover:text-[#103D2B] group-hover:gap-2 transition-all"
        >
          Lihat Detail <ChevronRight size={13} />
        </button>
      </div>
    </div>
  );
};

// ── Report Table Row (compact) ────────────────────────────────────────────────

interface ReportTableRowProps {
  report: CommunityReportFull;
  onViewDetail: (report: CommunityReportFull) => void;
}

export const ReportTableRow: React.FC<ReportTableRowProps> = ({ report, onViewDetail }) => (
  <tr className="border-b border-[#F0F4F0] hover:bg-[#F5F8F5] transition-colors text-xs">
    <td className="py-2.5 px-3">
      <span className="font-mono text-[10px] text-[#718075]">{report.report_id}</span>
    </td>
    <td className="py-2.5 px-3">
      <CategoryBadge category={report.report_category} />
    </td>
    <td className="py-2.5 px-3">
      <div className="text-[#1D2A22] font-medium truncate max-w-[140px]">{report.location_name}</div>
      <div className="text-[10px] text-[#718075]">{report.kabupaten}</div>
    </td>
    <td className="py-2.5 px-3 text-[#718075]">{formatDate(report.created_at)}</td>
    <td className="py-2.5 px-3">
      <span className="text-[#1D2A22]">{report.reporter_name}</span>
    </td>
    <td className="py-2.5 px-3">
      <StatusBadge status={report.status} />
    </td>
    <td className="py-2.5 px-3">
      <button
        onClick={() => onViewDetail(report)}
        className="flex items-center gap-1 text-[11px] font-semibold text-[#174B32] hover:underline"
      >
        Detail <ChevronRight size={11} />
      </button>
    </td>
  </tr>
);
