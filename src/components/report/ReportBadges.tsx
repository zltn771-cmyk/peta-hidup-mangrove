import React from 'react';
import { ReportStatus, ReportCategory } from '../../types/report';
import {
  CheckCircle2,
  Clock,
  Eye,
  ShieldCheck,
  Scissors,
  Layers,
  Trash2,
  Leaf,
  Waves,
  Sprout,
  HelpCircle,
  AlertTriangle,
} from 'lucide-react';

// ── Status Configuration ──────────────────────────────────────────────────────

interface StatusCfg {
  label: string;
  color: string;
  bg: string;
  border: string;
  icon: React.ReactNode;
  desc: string;
}

export const STATUS_CONFIG: Record<ReportStatus, StatusCfg> = {
  Submitted: {
    label: 'Terkirim',
    color: '#D97706',
    bg: '#FFFBEB',
    border: '#FDE68A',
    icon: <Clock size={12} />,
    desc: 'Laporan diterima dan menunggu pemeriksaan.',
  },
  'Under Review': {
    label: 'Sedang Diperiksa',
    color: '#0891B2',
    bg: '#ECFEFF',
    border: '#A5F3FC',
    icon: <Eye size={12} />,
    desc: 'Tim pengelola sedang memverifikasi informasi laporan.',
  },
  Verified: {
    label: 'Terverifikasi',
    color: '#059669',
    bg: '#ECFDF5',
    border: '#A7F3D0',
    icon: <ShieldCheck size={12} />,
    desc: 'Laporan telah dikonfirmasi oleh tim verifikasi lapangan.',
  },
  Resolved: {
    label: 'Selesai Ditindaklanjuti',
    color: '#174B32',
    bg: '#F5F8F5',
    border: '#A8BFA5',
    icon: <CheckCircle2 size={12} />,
    desc: 'Laporan telah mendapatkan tindak lanjut resmi.',
  },
};

export function StatusBadge({ status }: { status: ReportStatus }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span
      className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full border"
      style={{ color: cfg.color, background: cfg.bg, borderColor: cfg.border }}
    >
      {cfg.icon}
      {cfg.label}
    </span>
  );
}

// ── Category Configuration ────────────────────────────────────────────────────

interface CategoryCfg {
  color: string;
  bg: string;
  icon: React.ReactNode;
}

export const CATEGORY_CONFIG: Record<ReportCategory, CategoryCfg> = {
  'Indikasi Penebangan Mangrove': { color: '#DC2626', bg: '#FEF2F2', icon: <Scissors size={13} /> },
  'Alih Fungsi Lahan':           { color: '#7C3AED', bg: '#F5F3FF', icon: <Layers size={13} /> },
  'Sampah dan Pencemaran':       { color: '#D97706', bg: '#FFFBEB', icon: <Trash2 size={13} /> },
  'Kerusakan Vegetasi':          { color: '#B45309', bg: '#FEF9C3', icon: <Leaf size={13} /> },
  'Abrasi Pesisir':              { color: '#0891B2', bg: '#ECFEFF', icon: <Waves size={13} /> },
  'Kegiatan Rehabilitasi':       { color: '#059669', bg: '#ECFDF5', icon: <Sprout size={13} /> },
  'Kondisi Perlu Diperiksa':     { color: '#6366F1', bg: '#EEF2FF', icon: <AlertTriangle size={13} /> },
  'Lainnya':                     { color: '#718075', bg: '#F5F8F5', icon: <HelpCircle size={13} /> },
};

export function CategoryBadge({ category }: { category: ReportCategory }) {
  const cfg = CATEGORY_CONFIG[category];
  return (
    <span
      className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full"
      style={{ color: cfg.color, background: cfg.bg }}
    >
      {cfg.icon}
      {category}
    </span>
  );
}
