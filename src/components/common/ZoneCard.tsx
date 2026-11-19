import React from 'react';
import { MangroveZone } from '../../types';
import { Badge } from '../common/Badge';
import { MapPin, Leaf, Droplets, TrendingUp } from 'lucide-react';

const statusConfig: Record<MangroveZone['status'], { variant: 'success' | 'sage' | 'warning' | 'danger'; dot: string }> = {
  'Kerapatan Tinggi': { variant: 'success', dot: 'bg-emerald-500' },
  'Kerapatan Sedang': { variant: 'sage', dot: 'bg-[#A8BFA5]' },
  'Kerapatan Rendah': { variant: 'warning', dot: 'bg-amber-500' },
  'Terdegradasi': { variant: 'danger', dot: 'bg-rose-500' },
};

interface ZoneCardProps {
  zone: MangroveZone;
  compact?: boolean;
}

export const ZoneCard: React.FC<ZoneCardProps> = ({ zone, compact = false }) => {
  const cfg = statusConfig[zone.status];

  return (
    <div className="bg-white rounded-2xl border border-[#E2EAE2] p-5 hover:border-[#A8BFA5] hover:shadow-md transition-all duration-200 group cursor-pointer">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full flex-shrink-0 ${cfg.dot}`} />
          <span className="text-[11px] font-semibold text-[#718075]">{zone.kabupaten}</span>
        </div>
        <Badge variant={cfg.variant}>{zone.status}</Badge>
      </div>

      <h3 className="font-bold text-[14px] text-[#1D2A22] mb-1 group-hover:text-[#174B32] transition-colors leading-snug">
        {zone.name}
      </h3>
      <div className="flex items-center gap-1.5 text-[11px] text-[#A8BFA5] mb-4">
        <MapPin size={10} />
        <span>{zone.coordinates[0].toFixed(4)}°, {zone.coordinates[1].toFixed(4)}°</span>
      </div>

      {!compact && (
        <>
          <div className="mb-3">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] text-[#718075]">Skor Kesehatan</span>
              <span className="text-[12px] font-bold text-[#174B32]">{zone.healthScore}%</span>
            </div>
            <div className="h-1.5 bg-[#F5F8F5] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${zone.healthScore}%`,
                  backgroundColor: zone.healthScore >= 70 ? '#059669' : zone.healthScore >= 50 ? '#D97706' : '#DC2626',
                }}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-[#F5F8F5]">
            <IndexMini icon={<Leaf size={10} />} label="CMRI" value={zone.cmriScore.toFixed(2)} />
            <IndexMini icon={<TrendingUp size={10} />} label="MVI" value={zone.mviScore.toFixed(2)} />
            <IndexMini icon={<Droplets size={10} />} label="NDMI" value={zone.ndmiScore.toFixed(2)} />
          </div>

          {zone.isSimulated && (
            <div className="mt-3 pt-3 border-t border-[#F5F8F5]">
              <span className="text-[9px] font-semibold uppercase tracking-wider text-amber-600 opacity-70">
                ◈ Data Simulasi
              </span>
            </div>
          )}
        </>
      )}
    </div>
  );
};

const IndexMini: React.FC<{ icon: React.ReactNode; label: string; value: string }> = ({ icon, label, value }) => (
  <div className="text-center">
    <div className="flex items-center justify-center gap-1 mb-0.5 text-[#A8BFA5]">{icon}</div>
    <div className="text-[13px] font-bold text-[#1D2A22]">{value}</div>
    <div className="text-[9px] text-[#A8BFA5] font-medium">{label}</div>
  </div>
);
