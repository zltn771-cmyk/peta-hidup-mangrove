// Dataset Service for CSV parsing, validation, and sample management

import { SamplePoint, SampleClass, DatasetValidationReport } from '../types/classification';

export function parseAndValidateCsv(csvText: string): {
  samples: SamplePoint[];
  report: DatasetValidationReport;
} {
  const lines = csvText.trim().split(/\r?\n/).filter(line => line.trim().length > 0);
  const errors: string[] = [];
  const warnings: string[] = [];

  if (lines.length < 2) {
    return {
      samples: [],
      report: {
        totalRows: 0,
        validRows: 0,
        invalidRows: 0,
        missingValues: 0,
        classDistribution: { mangrove: 0, non_mangrove: 0 },
        errors: ['File CSV kosong atau tidak memiliki baris data.'],
        warnings: [],
      },
    };
  }

  // Parse header
  const headerCols = lines[0].split(',').map(c => c.trim().replace(/^["']|["']$/g, ''));
  const requiredCols = ['sample_id', 'CMRI', 'MVI', 'NDMI', 'class'];
  const missingCols = requiredCols.filter(col => !headerCols.includes(col));

  if (missingCols.length > 0) {
    return {
      samples: [],
      report: {
        totalRows: lines.length - 1,
        validRows: 0,
        invalidRows: lines.length - 1,
        missingValues: 0,
        classDistribution: { mangrove: 0, non_mangrove: 0 },
        errors: [`Kolom wajib tidak ditemukan: ${missingCols.join(', ')}`],
        warnings: [],
      },
    };
  }

  const idIdx = headerCols.indexOf('sample_id');
  const cmriIdx = headerCols.indexOf('CMRI');
  const mviIdx = headerCols.indexOf('MVI');
  const ndmiIdx = headerCols.indexOf('NDMI');
  const classIdx = headerCols.indexOf('class');

  const samples: SamplePoint[] = [];
  let invalidRows = 0;
  let missingValues = 0;
  let mangroveCount = 0;
  let nonMangroveCount = 0;

  for (let i = 1; i < lines.length; i++) {
    const row = lines[i].split(',').map(c => c.trim().replace(/^["']|["']$/g, ''));
    if (row.length < requiredCols.length) {
      invalidRows++;
      missingValues++;
      continue;
    }

    const id = row[idIdx] || `sample_${i}`;
    const rawCmri = parseFloat(row[cmriIdx]);
    const rawMvi = parseFloat(row[mviIdx]);
    const rawNdmi = parseFloat(row[ndmiIdx]);
    const rawClass = (row[classIdx] || '').toLowerCase().trim();

    // Check NaN or missing
    if (isNaN(rawCmri) || isNaN(rawMvi) || isNaN(rawNdmi)) {
      invalidRows++;
      missingValues++;
      continue;
    }

    // Normalize class label
    let normalizedClass: SampleClass | null = null;
    if (rawClass === 'mangrove' || rawClass === '1') {
      normalizedClass = 'mangrove';
    } else if (
      rawClass === 'non_mangrove' ||
      rawClass === 'non-mangrove' ||
      rawClass === 'nonmangrove' ||
      rawClass === '0'
    ) {
      normalizedClass = 'non_mangrove';
    } else {
      invalidRows++;
      errors.push(`Baris ${i + 1}: Label kelas "${row[classIdx]}" tidak valid. Harus "mangrove" atau "non_mangrove".`);
      continue;
    }

    // Range checks
    if (rawCmri < -1 || rawCmri > 1) {
      warnings.push(`Baris ${i + 1}: Nilai CMRI (${rawCmri}) di luar rentang wajar (-1 s/d 1).`);
    }
    if (rawNdmi < -1 || rawNdmi > 1) {
      warnings.push(`Baris ${i + 1}: Nilai NDMI (${rawNdmi}) di luar rentang wajar (-1 s/d 1).`);
    }

    if (normalizedClass === 'mangrove') mangroveCount++;
    else nonMangroveCount++;

    samples.push({
      sample_id: id,
      CMRI: rawCmri,
      MVI: rawMvi,
      NDMI: rawNdmi,
      class: normalizedClass,
      isValid: true,
    });
  }

  // Class balance check warning
  const total = samples.length;
  if (total > 0) {
    const ratio = Math.min(mangroveCount, nonMangroveCount) / total;
    if (ratio < 0.2) {
      warnings.push(
        `Ketidakseimbangan kelas terdeteksi (Mangrove: ${mangroveCount}, Non-Mangrove: ${nonMangroveCount}). Pertimbangkan menambah sampel kelas minoritas.`
      );
    }
  }

  return {
    samples,
    report: {
      totalRows: lines.length - 1,
      validRows: samples.length,
      invalidRows,
      missingValues,
      classDistribution: {
        mangrove: mangroveCount,
        non_mangrove: nonMangroveCount,
      },
      errors: errors.slice(0, 5), // Keep top 5 to avoid bloating
      warnings: warnings.slice(0, 5),
    },
  };
}
