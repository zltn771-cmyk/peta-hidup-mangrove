import React from 'react';
import { Construction, Clock } from 'lucide-react';

interface ComingSoonCardProps {
  feature: string;
  description: string;
  eta?: string;
  icon?: React.ReactNode;
}

export const ComingSoonCard: React.FC<ComingSoonCardProps> = ({
  feature,
  description,
  eta = 'Segera',
  icon,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-[#E2EAE2] border-dashed p-10 flex flex-col items-center text-center">
      <div className="w-14 h-14 rounded-2xl bg-[#F5F8F5] border border-[#E2EAE2] flex items-center justify-center mb-4">
        {icon ?? <Construction size={24} className="text-[#A8BFA5]" />}
      </div>
      <h3 className="text-[16px] font-bold text-[#1D2A22] mb-2">{feature}</h3>
      <p className="text-[13px] text-[#718075] leading-relaxed max-w-sm mb-4">{description}</p>
      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F5F8F5] border border-[#E2EAE2]">
        <Clock size={12} className="text-[#A8BFA5]" />
        <span className="text-[11px] font-semibold text-[#718075]">{eta}</span>
      </div>
    </div>
  );
};
