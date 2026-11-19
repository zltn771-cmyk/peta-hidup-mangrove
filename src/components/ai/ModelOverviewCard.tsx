import React from 'react';
import { Brain, Cpu, Database, CheckCircle2, AlertCircle, Clock, PieChart, ShieldCheck } from 'lucide-react';
import { ModelLifecycleStatus, SystemOperatingMode, ClassificationSpatialSummary } from '../../types/classification';

interface ModelOverviewCardProps {
  status: ModelLifecycleStatus;
  mode: SystemOperatingMode;
  trainingSamplesCount: number;
  testingSamplesCount: number;
  spatialSummary: ClassificationSpatialSummary;
  nEstimators: number;
  maxDepth: number;
  onOpenBackendModal: () => void;
}

const STATUS_CONFIG: Record<
  ModelLifecycleStatus,
  { label: string; color: string; bg: string; border: string; icon: React.ReactNode }
> = {
  'Not Configured': {
    label: 'Not Configured',
    color: '#64748B',
    bg: '#F8FAFC',
    border: '#E2E8F0',
    icon: <AlertCircle size={14} />,
  },
  'Waiting for Training Data': {
    label: 'Waiting for Training Data',
    color: '#D97706',
    bg: '#FFFBEB',
    border: '#FDE68A',
    icon: <Database size={14} />,
  },
  'Ready for Training': {
    label: 'Ready for Training',
    color: '#0891B2',
    bg: '#ECFEFF',
    border: '#A5F3FC',
    icon: <Cpu size={14} />,
  },
  'Training': {
    label: 'Training in Progress',
    color: '#7C3AED',
    bg: '#F5F3FF',
    border: '#DDD6FE',
    icon: <Clock size={14} className="animate-spin" />,
  },
  'Trained': {
    label: 'Model Trained',
    color: '#059669',
    bg: '#ECFDF5',
    border: '#A7F3D0',
    icon: <CheckCircle2 size={14} />,
  },
  'Validation Completed': {
    label: 'Validation Completed',
    color: '#174B32',
    bg: '#F5F8F5',
    border: '#A8BFA5',
    icon: <ShieldCheck size={14} />,
  },
};

export const ModelOverviewCard: React.FC<ModelOverviewCardProps> = ({
  status,
  mode,
  trainingSamplesCount,
  testingSamplesCount,
  spatialSummary,
  nEstimators,
  maxDepth,
  onOpenBackendModal,
}) => {
  const currentStatus = STATUS_CONFIG[status];

  return (
    <div className="bg-white rounded-2xl border border-[#E2EAE2] shadow-xs p-5 space-y-4">
      {/* Header with Title & Operational Mode Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E2EAE2] pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Brain size={18} className="text-[#174B32]" />
            <h2 className="font-extrabold text-base text-[#1D2A22]">Model Overview & Status</h2>
          </div>
          <p className="text-xs text-[#718075]">
            Random Forest Ensemble dengan 3 Indeks Spektral (CMRI, MVI, NDMI)
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Mode Badge */}
          <span
            className={`text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider border ${
              mode === 'DEMONSTRATION'
                ? 'bg-[#FFFBEB] text-[#92400E] border-[#FDE68A]'
                : mode === 'REAL_MODEL'
                ? 'bg-[#ECFDF5] text-[#065F46] border-[#A7F3D0]'
                : 'bg-[#EFF6FF] text-[#1E40AF] border-[#BFDBFE]'
            }`}
          >
            {mode === 'DEMONSTRATION'
              ? '◈ Mode Demonstrasi'
              : mode === 'REAL_MODEL'
              ? '● Real Sample Mode'
              : '✔ Validation Mode'}
          </span>

          <button
            onClick={onOpenBackendModal}
            className="text-[11px] font-semibold text-[#174B32] hover:text-[#103D2B] bg-[#F5F8F5] border border-[#E2EAE2] hover:border-[#A8BFA5] px-2.5 py-1 rounded-lg transition-colors"
          >
            Arsitektur API / GEE
          </button>
        </div>
      </div>

      {/* Grid: 4 Core Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* Status */}
        <div
          className="p-3.5 rounded-xl border flex flex-col justify-between"
          style={{
            backgroundColor: currentStatus.bg,
            borderColor: currentStatus.border,
            color: currentStatus.color,
          }}
        >
          <div className="text-[10px] font-bold uppercase tracking-wider opacity-80">Status Model</div>
          <div className="flex items-center gap-1.5 font-bold text-[13px] my-1">
            {currentStatus.icon}
            <span className="truncate">{currentStatus.label}</span>
          </div>
          <div className="text-[10px] opacity-75">
            {status === 'Trained' || status === 'Validation Completed'
              ? `${nEstimators} trees · depth ${maxDepth}`
              : 'Menunggu inisialisasi'}
          </div>
        </div>

        {/* Classes */}
        <div className="p-3.5 rounded-xl bg-[#F5F8F5] border border-[#E2EAE2] text-[#1D2A22]">
          <div className="text-[10px] font-bold text-[#718075] uppercase tracking-wider">Target Klasifikasi</div>
          <div className="font-extrabold text-base text-[#174B32] mt-1">2 Kelas</div>
          <div className="text-[10px] text-[#718075] mt-0.5">Mangrove & Non-Mangrove</div>
        </div>

        {/* Training Samples */}
        <div className="p-3.5 rounded-xl bg-[#F5F8F5] border border-[#E2EAE2] text-[#1D2A22]">
          <div className="text-[10px] font-bold text-[#718075] uppercase tracking-wider">Sampel Training</div>
          <div className="font-extrabold text-base text-[#059669] mt-1">
            {trainingSamplesCount > 0 ? `${trainingSamplesCount} titik` : '0 titik'}
          </div>
          <div className="text-[10px] text-[#718075] mt-0.5">Ground-truth referensi</div>
        </div>

        {/* Testing Samples */}
        <div className="p-3.5 rounded-xl bg-[#F5F8F5] border border-[#E2EAE2] text-[#1D2A22]">
          <div className="text-[10px] font-bold text-[#718075] uppercase tracking-wider">Sampel Testing</div>
          <div className="font-extrabold text-base text-[#0891B2] mt-1">
            {testingSamplesCount > 0 ? `${testingSamplesCount} titik` : '0 titik'}
          </div>
          <div className="text-[10px] text-[#718075] mt-0.5">Held-out independent split</div>
        </div>
      </div>

      {/* Classification Summary Sub-panel */}
      <div className="p-3.5 rounded-xl bg-[#F8FAF8] border border-[#E2EAE2] text-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-1.5 font-bold text-[#1D2A22]">
            <PieChart size={14} className="text-[#174B32]" />
            <span>Estimasi Cakupan Wilayah Analisis (Pesisir Bengkulu)</span>
          </div>
          <span className="text-[10px] text-[#D97706] font-semibold bg-[#FFFBEB] px-2 py-0.5 rounded-full border border-[#FDE68A]">
            ◈ Data Simulasi Luasan
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-white p-2.5 rounded-lg border border-[#E2EAE2]">
            <div className="text-[10px] text-[#718075]">Luas Mangrove Terklasifikasi</div>
            <div className="text-sm font-bold text-[#174B32] mt-0.5">
              {spatialSummary.mangroveAreaHa.toLocaleString()} ha
              <span className="text-[11px] font-normal text-[#718075] ml-1">({spatialSummary.mangrovePercentage}%)</span>
            </div>
          </div>

          <div className="bg-white p-2.5 rounded-lg border border-[#E2EAE2]">
            <div className="text-[10px] text-[#718075]">Luas Non-Mangrove</div>
            <div className="text-sm font-bold text-[#64748B] mt-0.5">
              {spatialSummary.nonMangroveAreaHa.toLocaleString()} ha
              <span className="text-[11px] font-normal text-[#718075] ml-1">({spatialSummary.nonMangrovePercentage}%)</span>
            </div>
          </div>

          <div className="bg-white p-2.5 rounded-lg border border-[#E2EAE2]">
            <div className="text-[10px] text-[#718075]">Total Koridor Analisis</div>
            <div className="text-sm font-bold text-[#1D2A22] mt-0.5">
              {spatialSummary.totalAreaHa.toLocaleString()} ha
              <span className="text-[11px] font-normal text-[#718075] ml-1">(100%)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
