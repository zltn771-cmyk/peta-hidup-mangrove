// TypeScript definitions for Random Forest Mangrove Classification System

export type SampleClass = 'mangrove' | 'non_mangrove';

export interface SamplePoint {
  sample_id: string;
  CMRI: number;
  MVI: number;
  NDMI: number;
  class: SampleClass;
  location?: string;
  lat?: number;
  lng?: number;
  isValid?: boolean;
}

export type ModelLifecycleStatus =
  | 'Not Configured'
  | 'Waiting for Training Data'
  | 'Ready for Training'
  | 'Training'
  | 'Trained'
  | 'Validation Completed';

export type SystemOperatingMode = 'DEMONSTRATION' | 'REAL_MODEL' | 'VALIDATION';

export interface RFHyperparameters {
  nEstimators: number;       // Number of trees (e.g. 10 - 100)
  maxDepth: number;          // Maximum depth of decision tree (e.g. 3 - 10)
  minSamplesSplit: number;   // Min samples to split a node (e.g. 2 - 10)
  minSamplesLeaf: number;    // Min samples in a leaf node (e.g. 1 - 5)
  randomSeed: number;        // Seed for pseudo-random reproducibility
  testSize: number;          // Proportion of dataset used for testing (0.1 - 0.5)
}

export interface DatasetValidationReport {
  totalRows: number;
  validRows: number;
  invalidRows: number;
  missingValues: number;
  classDistribution: {
    mangrove: number;
    non_mangrove: number;
  };
  errors: string[];
  warnings: string[];
}

export interface ConfusionMatrix {
  truePositive: number;   // Actual Mangrove, Predicted Mangrove
  falseNegative: number;  // Actual Mangrove, Predicted Non-Mangrove
  falsePositive: number;  // Actual Non-Mangrove, Predicted Mangrove
  trueNegative: number;   // Actual Non-Mangrove, Predicted Non-Mangrove
  totalSamples: number;
}

export interface ClassPerformance {
  className: SampleClass;
  displayName: string;
  precision: number;
  recall: number;
  f1Score: number;
  support: number; // sample count
}

export interface ModelEvaluationMetrics {
  overallAccuracy: number; // (TP + TN) / Total
  cohensKappa: number;     // (Po - Pe) / (1 - Pe)
  macroPrecision: number;
  macroRecall: number;
  macroF1: number;
  classMetrics: {
    mangrove: ClassPerformance;
    non_mangrove: ClassPerformance;
  };
  confusionMatrix: ConfusionMatrix;
  trainingTimeMs: number;
}

export interface FeatureImportance {
  feature: 'CMRI' | 'MVI' | 'NDMI';
  fullName: string;
  importance: number; // 0 to 1 (sum = 1)
  rank: number;
  description: string;
}

export interface MethodComparisonResult {
  methodName: string;
  approach: string;
  inputFeatures: string;
  overallAccuracy: number;
  kappa: number;
  f1Score: number;
  validationStatus: 'Teruji pada Test Set' | 'Estimasi Baseline' | 'Model Terpilih';
  notes: string;
}

export interface ClassificationSpatialSummary {
  mangroveAreaHa: number;
  nonMangroveAreaHa: number;
  totalAreaHa: number;
  mangrovePercentage: number;
  nonMangrovePercentage: number;
  isSimulated: boolean;
}
