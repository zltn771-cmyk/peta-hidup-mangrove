import React, { useCallback, useRef } from 'react';
import { Upload, FileText, AlertTriangle, CheckCircle2, XCircle, Download, Eye, Info, Trash2 } from 'lucide-react';
import { DatasetValidationReport, SamplePoint } from '../../types/classification';
import { generateDemoCsv, DEMO_FIELD_SAMPLES } from '../../data/sampleDataset';
import { parseAndValidateCsv } from '../../services/datasetService';

interface DatasetPanelProps {
  samples: SamplePoint[];
  report: DatasetValidationReport | null;
  onDataLoaded: (samples: SamplePoint[], report: DatasetValidationReport) => void;
  onClear: () => void;
}

function StatusRow({ label, value, icon }: { label: string; value: React.ReactNode; icon: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-1.5 border-b border-[#F0F4F0] last:border-0 text-xs">
      <div className="flex items-center gap-1.5 text-[#718075]">
        {icon}
        <span>{label}</span>
      </div>
      <span className="font-semibold text-[#1D2A22]">{value}</span>
    </div>
  );
}

export const DatasetPanel: React.FC<DatasetPanelProps> = ({
  samples,
  report,
  onDataLoaded,
  onClear,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback((text: string) => {
    const { samples: parsed, report: validationReport } = parseAndValidateCsv(text);
    onDataLoaded(parsed, validationReport);
  }, [onDataLoaded]);

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => processFile((evt.target?.result as string) || '');
    reader.readAsText(file);
    // reset input so same file can be re-uploaded
    e.target.value = '';
  }, [processFile]);

  const handleUseDemoDataset = useCallback(() => {
    const csv = generateDemoCsv();
    processFile(csv);
  }, [processFile]);

  const handleDownloadTemplate = useCallback(() => {
    const csv = `sample_id,CMRI,MVI,NDMI,class\nsample_001,0.72,5.12,0.45,mangrove\nsample_002,0.22,1.80,0.12,non_mangrove`;
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mangrove_sample_template.csv';
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  const hasData = samples.length > 0;

  return (
    <div className="bg-white rounded-2xl border border-[#E2EAE2] shadow-xs p-5">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#E2EAE2]">
        <div className="flex items-center gap-2">
          <FileText size={16} className="text-[#174B32]" />
          <h2 className="font-extrabold text-sm text-[#1D2A22]">Dataset & Sampel Lapangan</h2>
        </div>
        {hasData && (
          <button
            onClick={onClear}
            className="flex items-center gap-1 text-[11px] font-semibold text-[#DC2626] hover:bg-red-50 px-2 py-1 rounded-lg border border-transparent hover:border-red-200 transition-colors"
          >
            <Trash2 size={12} /> Hapus Dataset
          </button>
        )}
      </div>

      {/* Upload section: shown when no data */}
      {!hasData && (
        <div className="space-y-4">
          {/* Drag & drop upload */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-[#A8BFA5] hover:border-[#174B32] rounded-xl p-8 flex flex-col items-center gap-3 cursor-pointer transition-colors bg-[#F5F8F5] hover:bg-[#EEF4EE]"
          >
            <div className="w-12 h-12 bg-white rounded-xl border border-[#E2EAE2] flex items-center justify-center shadow-xs">
              <Upload size={22} className="text-[#174B32]" />
            </div>
            <div className="text-center">
              <p className="text-sm font-bold text-[#1D2A22]">Upload CSV Dataset Sampel</p>
              <p className="text-xs text-[#718075] mt-0.5">
                Kolom wajib: <span className="font-mono font-semibold">sample_id, CMRI, MVI, NDMI, class</span>
              </p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,text/csv"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={handleUseDemoDataset}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#174B32] hover:bg-[#103D2B] text-white text-xs font-bold transition-colors"
            >
              <Eye size={14} /> Gunakan {DEMO_FIELD_SAMPLES.length} Titik Sampel Demonstrasi Bengkulu
            </button>
            <button
              onClick={handleDownloadTemplate}
              className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-white hover:bg-[#F5F8F5] border border-[#E2EAE2] text-[#1D2A22] text-xs font-semibold transition-colors"
            >
              <Download size={13} className="text-[#718075]" /> Template CSV
            </button>
          </div>

          {/* Format info */}
          <div className="bg-[#EFF6FF] border border-[#BFDBFE] p-3 rounded-xl text-xs text-[#1E3A5F]">
            <div className="font-bold flex items-center gap-1.5 mb-1.5">
              <Info size={13} className="text-[#3B82F6]" /> Format Dataset yang Diterima
            </div>
            <table className="w-full text-[11px]">
              <thead className="text-[#718075]">
                <tr>
                  <th className="text-left pb-1">Kolom</th>
                  <th className="text-left pb-1">Tipe</th>
                  <th className="text-left pb-1">Rentang Valid</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DBEAFE]">
                {[
                  ['sample_id', 'String', 'Teks unik identifikasi'],
                  ['CMRI', 'Float', '-1.0 s/d 1.0'],
                  ['MVI', 'Float', '> 0 (biasanya 1.0–8.0)'],
                  ['NDMI', 'Float', '-1.0 s/d 1.0'],
                  ['class', 'String', 'mangrove atau non_mangrove'],
                ].map(([col, type, range]) => (
                  <tr key={col} className="text-[#1D2A22]">
                    <td className="py-1 font-mono font-semibold">{col}</td>
                    <td className="py-1 text-[#718075]">{type}</td>
                    <td className="py-1 text-[#718075]">{range}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-3 rounded-xl bg-[#FFFBEB] border border-[#FDE68A] text-[11px] text-[#92400E] flex items-start gap-2">
            <AlertTriangle size={13} className="text-[#D97706] mt-0.5 flex-shrink-0" />
            <span>
              Kualitas klasifikasi bergantung pada <strong>representativitas</strong> dan <strong>ketepatan label</strong> sampel lapangan.
              Gunakan sampel dari berbagai lokasi dan musim untuk meminimalkan spatial autocorrelation.
            </span>
          </div>
        </div>
      )}

      {/* Dataset loaded view */}
      {hasData && report && (
        <div className="space-y-4">
          {/* Validation summary */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-[#ECFDF5] border border-[#A7F3D0] p-3 rounded-xl">
              <div className="text-[10px] text-[#065F46] font-bold uppercase">Sampel Valid</div>
              <div className="text-xl font-extrabold text-[#059669] mt-0.5">{report.validRows}</div>
              <div className="text-[10px] text-[#718075]">dari {report.totalRows} total baris</div>
            </div>
            <div className={`p-3 rounded-xl border ${report.invalidRows > 0 ? 'bg-[#FFF7F7] border-[#FECACA]' : 'bg-[#F5F8F5] border-[#E2EAE2]'}`}>
              <div className={`text-[10px] font-bold uppercase ${report.invalidRows > 0 ? 'text-[#991B1B]' : 'text-[#718075]'}`}>
                Baris Tidak Valid
              </div>
              <div className={`text-xl font-extrabold mt-0.5 ${report.invalidRows > 0 ? 'text-[#DC2626]' : 'text-[#A8BFA5]'}`}>
                {report.invalidRows}
              </div>
              <div className="text-[10px] text-[#718075]">dibuang sebelum training</div>
            </div>
          </div>

          {/* Class Distribution */}
          <div className="p-3 rounded-xl bg-[#F5F8F5] border border-[#E2EAE2]">
            <div className="text-[10px] font-bold text-[#718075] uppercase tracking-wider mb-2">Distribusi Kelas</div>
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-[#059669] font-semibold">Mangrove</span>
                  <span className="font-mono text-[#1D2A22]">{report.classDistribution.mangrove}</span>
                </div>
                <div className="h-2 bg-[#E2EAE2] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#174B32] rounded-full"
                    style={{ width: `${(report.classDistribution.mangrove / (report.validRows || 1)) * 100}%` }}
                  />
                </div>
              </div>
              <div className="flex-1">
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-[#64748B] font-semibold">Non-Mangrove</span>
                  <span className="font-mono text-[#1D2A22]">{report.classDistribution.non_mangrove}</span>
                </div>
                <div className="h-2 bg-[#E2EAE2] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#94A3B8] rounded-full"
                    style={{ width: `${(report.classDistribution.non_mangrove / (report.validRows || 1)) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Validation Checks */}
          <div className="space-y-1">
            <div className="text-[10px] font-bold text-[#718075] uppercase tracking-wider">Pemeriksaan Kualitas</div>
            <StatusRow
              label="Total baris CSV"
              value={report.totalRows}
              icon={<FileText size={12} />}
            />
            <StatusRow
              label="Missing values"
              value={report.missingValues > 0
                ? <span className="text-[#DC2626]">{report.missingValues} nilai hilang</span>
                : <span className="text-[#059669]">Bersih</span>}
              icon={<AlertTriangle size={12} />}
            />
            <StatusRow
              label="Label kelas valid"
              value={
                report.errors.length === 0
                  ? <span className="text-[#059669] flex items-center gap-1"><CheckCircle2 size={11} /> Semua valid</span>
                  : <span className="text-[#D97706]">{report.errors.length} isu</span>
              }
              icon={<CheckCircle2 size={12} />}
            />
          </div>

          {/* Errors & Warnings */}
          {(report.errors.length > 0 || report.warnings.length > 0) && (
            <div className="space-y-1.5">
              {report.errors.map((err, i) => (
                <div key={i} className="text-[11px] text-[#991B1B] bg-[#FFF7F7] p-2 rounded-lg border border-[#FECACA] flex items-start gap-1.5">
                  <XCircle size={12} className="text-[#DC2626] flex-shrink-0 mt-0.5" /> {err}
                </div>
              ))}
              {report.warnings.map((warn, i) => (
                <div key={i} className="text-[11px] text-[#92400E] bg-[#FFFBEB] p-2 rounded-lg border border-[#FDE68A] flex items-start gap-1.5">
                  <AlertTriangle size={12} className="text-[#D97706] flex-shrink-0 mt-0.5" /> {warn}
                </div>
              ))}
            </div>
          )}

          {/* Sample Preview Table */}
          <div>
            <div className="text-[10px] font-bold text-[#718075] uppercase tracking-wider mb-1.5">
              Preview (5 Baris Pertama)
            </div>
            <div className="overflow-x-auto rounded-xl border border-[#E2EAE2]">
              <table className="w-full text-[11px] text-left">
                <thead className="bg-[#F5F8F5] text-[#718075] font-semibold text-[10px]">
                  <tr>
                    <th className="py-2 px-3">sample_id</th>
                    <th className="py-2 px-3 font-mono">CMRI</th>
                    <th className="py-2 px-3 font-mono">MVI</th>
                    <th className="py-2 px-3 font-mono">NDMI</th>
                    <th className="py-2 px-3">class</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0F4F0] text-[#1D2A22]">
                  {samples.slice(0, 5).map((s) => (
                    <tr key={s.sample_id} className="hover:bg-[#F5F8F5]">
                      <td className="py-1.5 px-3 font-mono text-[10px] text-[#718075]">{s.sample_id}</td>
                      <td className="py-1.5 px-3 font-mono font-semibold">{s.CMRI.toFixed(2)}</td>
                      <td className="py-1.5 px-3 font-mono font-semibold">{s.MVI.toFixed(2)}</td>
                      <td className="py-1.5 px-3 font-mono font-semibold">{s.NDMI.toFixed(2)}</td>
                      <td className="py-1.5 px-3">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          s.class === 'mangrove'
                            ? 'bg-[#ECFDF5] text-[#065F46] border-[#A7F3D0]'
                            : 'bg-[#F1F5F9] text-[#475569] border-[#CBD5E1]'
                        }`}>
                          {s.class === 'mangrove' ? 'mangrove' : 'non_mangrove'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
