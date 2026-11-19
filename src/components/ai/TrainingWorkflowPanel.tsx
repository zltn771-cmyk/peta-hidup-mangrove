import React from 'react';
import { CheckCircle2, Loader2, Circle } from 'lucide-react';

export type TrainingStep =
  | 'dataset_check'
  | 'split'
  | 'training'
  | 'prediction'
  | 'evaluation';

interface TrainingStepStatus {
  step: TrainingStep;
  label: string;
  desc: string;
  status: 'idle' | 'running' | 'done' | 'error';
  durationMs?: number;
}

interface TrainingWorkflowPanelProps {
  isTraining: boolean;
  stepStatuses: TrainingStepStatus[];
  onStartTraining: () => void;
  disabled: boolean; // dataset not loaded
  trainSampleCount: number;
  testSampleCount: number;
}

const STEP_ICON = (status: TrainingStepStatus['status']) => {
  if (status === 'done') return <CheckCircle2 size={18} className="text-[#059669]" />;
  if (status === 'running') return <Loader2 size={18} className="text-[#174B32] animate-spin" />;
  if (status === 'error') return <Circle size={18} className="text-[#DC2626]" />;
  return <Circle size={18} className="text-[#A8BFA5]" />;
};

export const TrainingWorkflowPanel: React.FC<TrainingWorkflowPanelProps> = ({
  isTraining,
  stepStatuses,
  onStartTraining,
  disabled,
  trainSampleCount,
  testSampleCount,
}) => {
  const hasStarted = stepStatuses.some(s => s.status !== 'idle');
  const isCompleted = stepStatuses.every(s => s.status === 'done');

  return (
    <div className="bg-white rounded-2xl border border-[#E2EAE2] shadow-xs p-5">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#E2EAE2]">
        <h2 className="font-extrabold text-sm text-[#1D2A22] flex items-center gap-2">
          <span className="w-5 h-5 bg-[#174B32] text-white rounded flex items-center justify-center text-[11px] font-black">RF</span>
          Alur Kerja Training Random Forest
        </h2>
        {!isTraining && (
          <button
            onClick={onStartTraining}
            disabled={disabled}
            className={`text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-xs ${
              disabled
                ? 'bg-[#E2EAE2] text-[#A8BFA5] cursor-not-allowed'
                : isCompleted
                ? 'bg-[#059669] hover:bg-[#047857] text-white'
                : 'bg-[#174B32] hover:bg-[#103D2B] text-white'
            }`}
          >
            {isCompleted ? '🔁 Latih Ulang' : '▶ Mulai Training'}
          </button>
        )}
      </div>

      {/* Train/Test Split Info */}
      {!disabled && (
        <div className="flex gap-3 mb-4 text-xs">
          <div className="flex-1 bg-[#ECFDF5] border border-[#A7F3D0] rounded-xl p-2.5 text-center">
            <div className="text-[10px] text-[#065F46] font-semibold uppercase">Training Set</div>
            <div className="text-base font-extrabold text-[#059669]">{trainSampleCount}</div>
            <div className="text-[10px] text-[#065F46]">titik sampel</div>
          </div>
          <div className="flex-1 bg-[#EFF6FF] border border-[#BFDBFE] rounded-xl p-2.5 text-center">
            <div className="text-[10px] text-[#1E3A5F] font-semibold uppercase">Testing Set</div>
            <div className="text-base font-extrabold text-[#2563EB]">{testSampleCount}</div>
            <div className="text-[10px] text-[#1E3A5F]">titik independen</div>
          </div>
        </div>
      )}

      {/* Steps */}
      <div className="space-y-1">
        {stepStatuses.map((s, i) => (
          <div
            key={s.step}
            className={`flex items-start gap-3 p-3 rounded-xl transition-all ${
              s.status === 'running'
                ? 'bg-[#F0FDF4] border border-[#86EFAC]'
                : s.status === 'done'
                ? 'bg-[#F5F8F5] border border-[#E2EAE2]'
                : 'bg-transparent border border-transparent'
            }`}
          >
            <div className="flex-shrink-0 mt-0.5">{STEP_ICON(s.status)}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-[#1D2A22]">
                  <span className="text-[#A8BFA5] font-mono mr-1 text-[10px]">STEP {i + 1}</span>
                  {s.label}
                </span>
                {s.durationMs !== undefined && (
                  <span className="text-[10px] text-[#059669] font-mono flex-shrink-0">{s.durationMs}ms</span>
                )}
              </div>
              <p className="text-[11px] text-[#718075] mt-0.5">{s.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Disclaimer */}
      {!hasStarted && !disabled && (
        <div className="mt-3 p-3 rounded-xl bg-[#FFFBEB] border border-[#FDE68A] text-[11px] text-[#92400E]">
          Proses training dijalankan langsung di browser menggunakan implementasi Random Forest TypeScript.
          Waktu training bergantung pada jumlah sampel dan konfigurasi hyperparameter.
        </div>
      )}

      {disabled && (
        <div className="mt-3 p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-[11px] text-[#64748B]">
          Muat dataset terlebih dahulu sebelum memulai proses training.
        </div>
      )}
    </div>
  );
};
