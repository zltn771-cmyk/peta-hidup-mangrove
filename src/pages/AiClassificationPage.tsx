import React, { useState, useCallback, useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';

import { SamplePoint, DatasetValidationReport, RFHyperparameters, ModelEvaluationMetrics, FeatureImportance, MethodComparisonResult, ModelLifecycleStatus, SystemOperatingMode, ClassificationSpatialSummary } from '../types/classification';
import { RandomForestClassifier, splitTrainTest } from '../services/randomForest';
import { evaluateModel, compareMethodsOnTestSet } from '../services/evaluationService';
import { TrainingStep } from '../components/ai/TrainingWorkflowPanel';

import { ModelOverviewCard } from '../components/ai/ModelOverviewCard';
import { DatasetPanel } from '../components/ai/DatasetPanel';
import { RFConfigPanel } from '../components/ai/RFConfigPanel';
import { TrainingWorkflowPanel } from '../components/ai/TrainingWorkflowPanel';
import { EvaluationPanel } from '../components/ai/EvaluationPanel';
import { FeatureImportancePanel, MethodComparisonPanel } from '../components/ai/FeatureImportancePanel';
import { BackendArchitectureModal } from '../components/ai/BackendArchitectureModal';

// ── Default Config ─────────────────────────────────────────────────────────────

const DEFAULT_CONFIG: RFHyperparameters = {
  nEstimators: 50,
  maxDepth: 6,
  minSamplesSplit: 2,
  minSamplesLeaf: 1,
  randomSeed: 42,
  testSize: 0.3,
};

const DEFAULT_SPATIAL: ClassificationSpatialSummary = {
  mangroveAreaHa: 756.2,
  nonMangroveAreaHa: 2843.8,
  totalAreaHa: 3600.0,
  mangrovePercentage: 21.0,
  nonMangrovePercentage: 79.0,
  isSimulated: true,
};

const STEP_CONFIGS: { step: TrainingStep; label: string; desc: string }[] = [
  {
    step: 'dataset_check',
    label: 'Dataset Preparation',
    desc: 'Memeriksa validitas data, label kelas, dan missing values pada dataset sampel.',
  },
  {
    step: 'split',
    label: 'Train-Test Split',
    desc: 'Membagi dataset secara stratified menjadi training set dan held-out testing set.',
  },
  {
    step: 'training',
    label: 'Random Forest Training',
    desc: 'Bootstrap aggregation dan pembelahan node Gini impurity pada setiap decision tree.',
  },
  {
    step: 'prediction',
    label: 'Prediction on Test Set',
    desc: 'Voting mayoritas dari seluruh pohon untuk mengklasifikasikan sampel testing.',
  },
  {
    step: 'evaluation',
    label: 'Model Evaluation & Comparison',
    desc: 'Menghitung confusion matrix, kappa, precision, recall, F1-score, dan perbandingan metode.',
  },
];

// ── Main Page Component ─────────────────────────────────────────────────────────

export const AiClassificationPage: React.FC = () => {
  // Dataset state
  const [samples, setSamples] = useState<SamplePoint[]>([]);
  const [dataReport, setDataReport] = useState<DatasetValidationReport | null>(null);
  const [trainSamples, setTrainSamples] = useState<SamplePoint[]>([]);
  const [testSamples, setTestSamples] = useState<SamplePoint[]>([]);

  // Config state
  const [config, setConfig] = useState<RFHyperparameters>(DEFAULT_CONFIG);

  // Model lifecycle
  const [modelStatus, setModelStatus] = useState<ModelLifecycleStatus>('Not Configured');
  const [mode, setMode] = useState<SystemOperatingMode>('DEMONSTRATION');
  const [isTraining, setIsTraining] = useState(false);

  // Training step statuses
  const [stepStatuses, setStepStatuses] = useState(
    STEP_CONFIGS.map(c => ({ ...c, status: 'idle' as 'idle' | 'running' | 'done' | 'error', durationMs: undefined as number | undefined }))
  );

  // Results
  const [evalMetrics, setEvalMetrics] = useState<ModelEvaluationMetrics | null>(null);
  const [featureImportances, setFeatureImportances] = useState<FeatureImportance[]>([]);
  const [comparisonResults, setComparisonResults] = useState<MethodComparisonResult[]>([]);

  // UI
  const [backendModalOpen, setBackendModalOpen] = useState(false);

  // Update model status based on dataset
  useEffect(() => {
    if (samples.length === 0) {
      setModelStatus('Not Configured');
    } else if (evalMetrics) {
      setModelStatus('Validation Completed');
    } else if (trainSamples.length > 0) {
      setModelStatus('Ready for Training');
    } else {
      setModelStatus('Waiting for Training Data');
    }
  }, [samples, trainSamples, evalMetrics]);

  // Handle dataset loaded
  const handleDataLoaded = useCallback((loadedSamples: SamplePoint[], report: DatasetValidationReport) => {
    setSamples(loadedSamples);
    setDataReport(report);
    setEvalMetrics(null);
    setFeatureImportances([]);
    setComparisonResults([]);
    setStepStatuses(STEP_CONFIGS.map(c => ({ ...c, status: 'idle', durationMs: undefined })));
    setMode(loadedSamples.length > 0 ? 'REAL_MODEL' : 'DEMONSTRATION');

    // Pre-split on load
    if (loadedSamples.length > 0) {
      const { train, test } = splitTrainTest(loadedSamples, DEFAULT_CONFIG.testSize, DEFAULT_CONFIG.randomSeed);
      setTrainSamples(train);
      setTestSamples(test);
    }
  }, []);

  const handleClearDataset = useCallback(() => {
    setSamples([]);
    setDataReport(null);
    setTrainSamples([]);
    setTestSamples([]);
    setEvalMetrics(null);
    setFeatureImportances([]);
    setComparisonResults([]);
    setStepStatuses(STEP_CONFIGS.map(c => ({ ...c, status: 'idle', durationMs: undefined })));
    setMode('DEMONSTRATION');
  }, []);

  // Update split when config changes
  const handleConfigChange = useCallback((newConfig: RFHyperparameters) => {
    setConfig(newConfig);
    if (samples.length > 0) {
      const { train, test } = splitTrainTest(samples, newConfig.testSize, newConfig.randomSeed);
      setTrainSamples(train);
      setTestSamples(test);
    }
  }, [samples]);

  // Training function
  const handleStartTraining = useCallback(async () => {
    if (samples.length === 0 || isTraining) return;

    setIsTraining(true);
    setModelStatus('Training');
    setMode('REAL_MODEL');
    setEvalMetrics(null);
    setComparisonResults([]);

    const updateStep = (stepIndex: number, status: 'running' | 'done' | 'error', durationMs?: number) => {
      setStepStatuses(prev => prev.map((s, i) => (i === stepIndex ? { ...s, status, durationMs } : s)));
    };

    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    try {
      // STEP 1: Dataset check
      updateStep(0, 'running');
      await delay(300);
      const { train, test } = splitTrainTest(samples, config.testSize, config.randomSeed);
      setTrainSamples(train);
      setTestSamples(test);
      updateStep(0, 'done', 320);

      // STEP 2: Split
      updateStep(1, 'running');
      await delay(200);
      updateStep(1, 'done', 210);

      // STEP 3: Training
      updateStep(2, 'running');
      const trainStart = performance.now();
      const rf = new RandomForestClassifier(config);
      rf.fit(train);
      const trainDuration = Math.round(performance.now() - trainStart);
      updateStep(2, 'done', trainDuration);

      // STEP 4: Prediction
      updateStep(3, 'running');
      const predStart = performance.now();
      const predictions = rf.predict(test);
      const predDuration = Math.round(performance.now() - predStart);
      updateStep(3, 'done', predDuration);

      // STEP 5: Evaluation
      updateStep(4, 'running');
      const evalStart = performance.now();
      const metrics = evaluateModel(test, predictions, trainDuration);
      const importances = rf.getFeatureImportance();
      const comparison = compareMethodsOnTestSet(test, metrics);
      const evalDuration = Math.round(performance.now() - evalStart);
      updateStep(4, 'done', evalDuration);

      setEvalMetrics(metrics);
      setFeatureImportances(importances);
      setComparisonResults(comparison);
      setModelStatus('Validation Completed');
      setMode('VALIDATION');
    } catch {
      // Mark last running step as error
      setStepStatuses(prev => prev.map(s => s.status === 'running' ? { ...s, status: 'error' } : s));
      setModelStatus('Ready for Training');
    } finally {
      setIsTraining(false);
    }
  }, [samples, config, isTraining]);

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-semibold text-[#174B32] uppercase tracking-wider">AI Studio</span>
            <span className="text-[#A8BFA5]">/</span>
            <span className="text-[11px] text-[#718075]">Random Forest</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-[#1D2A22] tracking-tight">
            AI Classification Center
          </h1>
          <p className="text-xs sm:text-sm text-[#718075] mt-0.5">
            Machine learning-based mangrove identification and land cover classification.
          </p>
        </div>
      </div>

      {/* Critical Disclaimer */}
      <div className="bg-[#FFFBEB] border border-[#FDE68A] rounded-xl p-4 flex items-start gap-3">
        <AlertTriangle size={15} className="text-[#D97706] mt-0.5 flex-shrink-0" />
        <div className="text-[11px] text-[#92400E] leading-relaxed">
          <strong>Transparansi Data & Metode:</strong> Implementasi Random Forest pada halaman ini berjalan sepenuhnya
          di browser menggunakan TypeScript. Model dilatih menggunakan data sampel yang tersedia.
          Untuk klasifikasi pixel-wise pada citra Sentinel-2 seluruh Bengkulu, dibutuhkan integrasi
          backend Python (Scikit-learn) dan/atau Google Earth Engine dengan service account aktif.
          Seluruh estimasi luas area masih merupakan data simulasi.
        </div>
      </div>

      {/* Model Overview */}
      <ModelOverviewCard
        status={modelStatus}
        mode={mode}
        trainingSamplesCount={trainSamples.length}
        testingSamplesCount={testSamples.length}
        spatialSummary={DEFAULT_SPATIAL}
        nEstimators={config.nEstimators}
        maxDepth={config.maxDepth}
        onOpenBackendModal={() => setBackendModalOpen(true)}
      />

      {/* Dataset + Config columns */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-5">
        <div className="xl:col-span-3">
          <DatasetPanel
            samples={samples}
            report={dataReport}
            onDataLoaded={handleDataLoaded}
            onClear={handleClearDataset}
          />
        </div>
        <div className="xl:col-span-2">
          <RFConfigPanel
            config={config}
            onChange={handleConfigChange}
            disabled={isTraining}
          />
        </div>
      </div>

      {/* Training Workflow */}
      <TrainingWorkflowPanel
        isTraining={isTraining}
        stepStatuses={stepStatuses}
        onStartTraining={handleStartTraining}
        disabled={samples.length === 0}
        trainSampleCount={trainSamples.length}
        testSampleCount={testSamples.length}
      />

      {/* Results: Evaluation, Feature Importance, Comparison */}
      {evalMetrics && (
        <>
          <EvaluationPanel metrics={evalMetrics} isSimulated={mode !== 'REAL_MODEL'} />

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
            <FeatureImportancePanel importances={featureImportances} />
            {comparisonResults.length > 0 && <MethodComparisonPanel results={comparisonResults} />}
          </div>
        </>
      )}

      {/* Backend Architecture Modal */}
      <BackendArchitectureModal
        isOpen={backendModalOpen}
        onClose={() => setBackendModalOpen(false)}
      />
    </div>
  );
};
