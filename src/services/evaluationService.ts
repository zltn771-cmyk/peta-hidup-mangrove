// Evaluation Service for Machine Learning Models
// Computes Confusion Matrix, Overall Accuracy, Cohen's Kappa, Precision, Recall, and F1-Score
// Also performs comparative baseline analysis against single-index thresholding

import {
  SamplePoint,
  SampleClass,
  ConfusionMatrix,
  ModelEvaluationMetrics,
  MethodComparisonResult,
} from '../types/classification';

export function computeConfusionMatrix(
  testSamples: SamplePoint[],
  predictions: SampleClass[]
): ConfusionMatrix {
  let tp = 0; // Actual: mangrove, Pred: mangrove
  let fn = 0; // Actual: mangrove, Pred: non_mangrove
  let fp = 0; // Actual: non_mangrove, Pred: mangrove
  let tn = 0; // Actual: non_mangrove, Pred: non_mangrove

  for (let i = 0; i < testSamples.length; i++) {
    const actual = testSamples[i].class;
    const pred = predictions[i];

    if (actual === 'mangrove' && pred === 'mangrove') tp++;
    else if (actual === 'mangrove' && pred === 'non_mangrove') fn++;
    else if (actual === 'non_mangrove' && pred === 'mangrove') fp++;
    else if (actual === 'non_mangrove' && pred === 'non_mangrove') tn++;
  }

  return {
    truePositive: tp,
    falseNegative: fn,
    falsePositive: fp,
    trueNegative: tn,
    totalSamples: testSamples.length,
  };
}

export function evaluateModel(
  testSamples: SamplePoint[],
  predictions: SampleClass[],
  trainingDurationMs: number
): ModelEvaluationMetrics {
  const cm = computeConfusionMatrix(testSamples, predictions);
  const n = cm.totalSamples;

  // Overall Accuracy
  const overallAccuracy = n > 0 ? (cm.truePositive + cm.trueNegative) / n : 0;

  // Cohen's Kappa calculation
  // Po = Observed agreement
  const po = overallAccuracy;
  // Pe = Chance agreement probability
  const actualMangrove = cm.truePositive + cm.falseNegative;
  const actualNon = cm.falsePositive + cm.trueNegative;
  const predMangrove = cm.truePositive + cm.falsePositive;
  const predNon = cm.falseNegative + cm.trueNegative;

  const pe = n > 0 ? (actualMangrove * predMangrove + actualNon * predNon) / (n * n) : 0;
  const kappa = 1 - pe !== 0 ? (po - pe) / (1 - pe) : 0;

  // Class: Mangrove
  const pMangroveDenom = cm.truePositive + cm.falsePositive;
  const rMangroveDenom = cm.truePositive + cm.falseNegative;
  const precMangrove = pMangroveDenom > 0 ? cm.truePositive / pMangroveDenom : 0;
  const recMangrove = rMangroveDenom > 0 ? cm.truePositive / rMangroveDenom : 0;
  const f1Mangrove =
    precMangrove + recMangrove > 0
      ? (2 * precMangrove * recMangrove) / (precMangrove + recMangrove)
      : 0;

  // Class: Non-Mangrove
  const pNonDenom = cm.trueNegative + cm.falseNegative;
  const rNonDenom = cm.trueNegative + cm.falsePositive;
  const precNon = pNonDenom > 0 ? cm.trueNegative / pNonDenom : 0;
  const recNon = rNonDenom > 0 ? cm.trueNegative / rNonDenom : 0;
  const f1Non =
    precNon + recNon > 0 ? (2 * precNon * recNon) / (precNon + recNon) : 0;

  // Macro averages
  const macroPrecision = (precMangrove + precNon) / 2;
  const macroRecall = (recMangrove + recNon) / 2;
  const macroF1 = (f1Mangrove + f1Non) / 2;

  return {
    overallAccuracy: parseFloat(overallAccuracy.toFixed(4)),
    cohensKappa: parseFloat(kappa.toFixed(4)),
    macroPrecision: parseFloat(macroPrecision.toFixed(4)),
    macroRecall: parseFloat(macroRecall.toFixed(4)),
    macroF1: parseFloat(macroF1.toFixed(4)),
    classMetrics: {
      mangrove: {
        className: 'mangrove',
        displayName: 'Mangrove',
        precision: parseFloat(precMangrove.toFixed(4)),
        recall: parseFloat(recMangrove.toFixed(4)),
        f1Score: parseFloat(f1Mangrove.toFixed(4)),
        support: actualMangrove,
      },
      non_mangrove: {
        className: 'non_mangrove',
        displayName: 'Non-Mangrove',
        precision: parseFloat(precNon.toFixed(4)),
        recall: parseFloat(recNon.toFixed(4)),
        f1Score: parseFloat(f1Non.toFixed(4)),
        support: actualNon,
      },
    },
    confusionMatrix: cm,
    trainingTimeMs: trainingDurationMs,
  };
}

// ── Comparative Method Baseline Analysis ──────────────────────────────────────

export function compareMethodsOnTestSet(
  testSamples: SamplePoint[],
  rfMetrics: ModelEvaluationMetrics
): MethodComparisonResult[] {
  // 1. CMRI Thresholding Baseline (Threshold >= 0.45)
  const cmriPreds: SampleClass[] = testSamples.map(s => (s.CMRI >= 0.45 ? 'mangrove' : 'non_mangrove'));
  const cmriEval = evaluateModel(testSamples, cmriPreds, 0);

  // 2. MVI Thresholding Baseline (Threshold >= 3.20)
  const mviPreds: SampleClass[] = testSamples.map(s => (s.MVI >= 3.20 ? 'mangrove' : 'non_mangrove'));
  const mviEval = evaluateModel(testSamples, mviPreds, 0);

  // 3. NDMI Thresholding Baseline (Threshold >= 0.26)
  const ndmiPreds: SampleClass[] = testSamples.map(s => (s.NDMI >= 0.26 ? 'mangrove' : 'non_mangrove'));
  const ndmiEval = evaluateModel(testSamples, ndmiPreds, 0);

  return [
    {
      methodName: 'Random Forest Multi-Index',
      approach: 'Ensemble Machine Learning (Non-Linear Tree Splitting)',
      inputFeatures: 'CMRI + MVI + NDMI (Multi-Spectral)',
      overallAccuracy: rfMetrics.overallAccuracy,
      kappa: rfMetrics.cohensKappa,
      f1Score: rfMetrics.macroF1,
      validationStatus: 'Model Terpilih',
      notes: 'Menggabungkan 3 domain spektral secara simultan dengan pembobotan adaptif.',
    },
    {
      methodName: 'CMRI Single Threshold',
      approach: 'Threshold Heuristik (CMRI ≥ 0.45)',
      inputFeatures: 'CMRI (NDVI - NDWI)',
      overallAccuracy: cmriEval.overallAccuracy,
      kappa: cmriEval.cohensKappa,
      f1Score: cmriEval.macroF1,
      validationStatus: 'Teruji pada Test Set',
      notes: 'Rentan misklasifikasi pada zona air keruh dan tambak payau basah.',
    },
    {
      methodName: 'MVI Single Threshold',
      approach: 'Threshold Heuristik (MVI ≥ 3.20)',
      inputFeatures: 'MVI (NIR, Green, SWIR-1)',
      overallAccuracy: mviEval.overallAccuracy,
      kappa: mviEval.cohensKappa,
      f1Score: mviEval.macroF1,
      validationStatus: 'Teruji pada Test Set',
      notes: 'Efektif mendeteksi kanopi hijau, namun sering keliru pada perkebunan sawit pesisir.',
    },
    {
      methodName: 'NDMI Single Threshold',
      approach: 'Threshold Heuristik (NDMI ≥ 0.26)',
      inputFeatures: 'NDMI (NIR - SWIR-1)',
      overallAccuracy: ndmiEval.overallAccuracy,
      kappa: ndmiEval.cohensKappa,
      f1Score: ndmiEval.macroF1,
      validationStatus: 'Teruji pada Test Set',
      notes: 'Sensitif kelembaban, tetapi vegetasi non-mangrove yang basah tetap terdeteksi.',
    },
  ];
}
