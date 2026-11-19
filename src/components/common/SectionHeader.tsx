import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  isSimulated?: boolean;
  actions?: React.ReactNode;
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  isSimulated = false,
  actions,
  className = '',
}) => {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 ${className}`}>
      <div>
        <div className="flex items-center gap-2.5 flex-wrap">
          <h2 className="text-[18px] font-bold text-[#1D2A22] leading-tight">{title}</h2>
          {isSimulated && (
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
              <AlertTriangle size={9} />
              Data Simulasi
            </span>
          )}
        </div>
        {subtitle && (
          <p className="mt-1 text-[13px] text-[#718075] leading-relaxed">{subtitle}</p>
        )}
      </div>
      {actions && <div className="flex-shrink-0">{actions}</div>}
    </div>
  );
};
