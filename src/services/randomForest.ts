// Genuine Random Forest Classifier implementation in TypeScript
// Based on Gini Impurity, Bagging (Bootstrap Aggregation), and Random Feature Subspaces
// Designed for Sentinel-2 spectral indices: CMRI, MVI, and NDMI

import { SamplePoint, SampleClass, RFHyperparameters, FeatureImportance } from '../types/classification';

// ── PRNG (Linear Congruential Generator) for deterministic reproducibility ────

class PseudoRandom {
  private seed: number;

  constructor(seed: number) {
    this.seed = seed % 2147483647;
    if (this.seed <= 0) this.seed += 2147483646;
  }

  next(): number {
    this.seed = (this.seed * 16807) % 2147483647;
    return (this.seed - 1) / 2147483646;
  }

  // Shuffle array in-place using Fisher-Yates
  shuffle<T>(array: T[]): T[] {
    const copy = [...array];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(this.next() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }
}

// ── Gini Impurity Helper ──────────────────────────────────────────────────────

function calculateGini(classes: SampleClass[]): number {
  if (classes.length === 0) return 0;
  let mangroveCount = 0;
  for (const c of classes) {
    if (c === 'mangrove') mangroveCount++;
  }
  const p1 = mangroveCount / classes.length;
  const p2 = 1 - p1;
  return 1 - (p1 * p1 + p2 * p2);
}

// ── Decision Tree Node & Classifier ───────────────────────────────────────────

interface TreeNode {
  isLeaf: boolean;
  predictedClass?: SampleClass;
  featureIndex?: number; // 0: CMRI, 1: MVI, 2: NDMI
  threshold?: number;
  left?: TreeNode;
  right?: TreeNode;
  giniGain?: number;
}

export class DecisionTree {
  private maxDepth: number;
  private minSamplesSplit: number;
  private minSamplesLeaf: number;
  private root: TreeNode | null = null;
  public featureImportanceGains: [number, number, number] = [0, 0, 0];

  constructor(maxDepth = 5, minSamplesSplit = 2, minSamplesLeaf = 1) {
    this.maxDepth = maxDepth;
    this.minSamplesSplit = minSamplesSplit;
    this.minSamplesLeaf = minSamplesLeaf;
  }

  private extractFeatures(s: SamplePoint): [number, number, number] {
    return [s.CMRI, s.MVI, s.NDMI];
  }

  private majorityClass(samples: SamplePoint[]): SampleClass {
    let mangrove = 0;
    for (const s of samples) {
      if (s.class === 'mangrove') mangrove++;
    }
    return mangrove >= samples.length / 2 ? 'mangrove' : 'non_mangrove';
  }

  private buildTree(
    samples: SamplePoint[],
    depth: number,
    rng: PseudoRandom
  ): TreeNode {
    const classes = samples.map(s => s.class);
    const majority = this.majorityClass(samples);
    const currentGini = calculateGini(classes);

    // Stop conditions: pure node, max depth reached, or too few samples to split
    if (
      currentGini === 0 ||
      depth >= this.maxDepth ||
      samples.length < this.minSamplesSplit
    ) {
      return { isLeaf: true, predictedClass: majority };
    }

    // Select random feature subset (for 3 features, choose 2 random features)
    const allFeatures = [0, 1, 2];
    const candidateFeatures = rng.shuffle(allFeatures).slice(0, 2);

    let bestGain = -1;
    let bestFeature = -1;
    let bestThreshold = 0;
    let bestLeft: SamplePoint[] = [];
    let bestRight: SamplePoint[] = [];

    for (const featIdx of candidateFeatures) {
      const values = samples.map(s => this.extractFeatures(s)[featIdx]).sort((a, b) => a - b);

      // Evaluate candidate split thresholds
      for (let i = 0; i < values.length - 1; i++) {
        if (values[i] === values[i + 1]) continue;
        const threshold = (values[i] + values[i + 1]) / 2;

        const left: SamplePoint[] = [];
        const right: SamplePoint[] = [];
        for (const s of samples) {
          if (this.extractFeatures(s)[featIdx] <= threshold) {
            left.push(s);
          } else {
            right.push(s);
          }
        }

        if (left.length < this.minSamplesLeaf || right.length < this.minSamplesLeaf) {
          continue;
        }

        const giniLeft = calculateGini(left.map(s => s.class));
        const giniRight = calculateGini(right.map(s => s.class));
        const pLeft = left.length / samples.length;
        const pRight = right.length / samples.length;
        const gain = currentGini - (pLeft * giniLeft + pRight * giniRight);

        if (gain > bestGain) {
          bestGain = gain;
          bestFeature = featIdx;
          bestThreshold = threshold;
          bestLeft = left;
          bestRight = right;
        }
      }
    }

    // If no valid split found that improves Gini, return leaf node
    if (bestGain <= 0 || bestLeft.length === 0 || bestRight.length === 0) {
      return { isLeaf: true, predictedClass: majority };
    }

    // Accumulate feature importance gain weighted by sample size
    this.featureImportanceGains[bestFeature] += bestGain * samples.length;

    return {
      isLeaf: false,
      featureIndex: bestFeature,
      threshold: bestThreshold,
      giniGain: bestGain,
      left: this.buildTree(bestLeft, depth + 1, rng),
      right: this.buildTree(bestRight, depth + 1, rng),
    };
  }

  fit(samples: SamplePoint[], rng: PseudoRandom): void {
    this.featureImportanceGains = [0, 0, 0];
    this.root = this.buildTree(samples, 0, rng);
  }

  predictSingle(sample: SamplePoint): SampleClass {
    if (!this.root) return 'non_mangrove';
    let curr = this.root;
    const feat = this.extractFeatures(sample);

    while (!curr.isLeaf) {
      const val = feat[curr.featureIndex!];
      if (val <= curr.threshold!) {
        curr = curr.left!;
      } else {
        curr = curr.right!;
      }
    }
    return curr.predictedClass || 'non_mangrove';
  }
}

// ── Random Forest Ensemble Classifier ─────────────────────────────────────────

export class RandomForestClassifier {
  private config: RFHyperparameters;
  private trees: DecisionTree[] = [];
  public rawImportance: [number, number, number] = [0, 0, 0];

  constructor(config: RFHyperparameters) {
    this.config = config;
  }

  // Bootstrap sample with replacement
  private bootstrap(samples: SamplePoint[], rng: PseudoRandom): SamplePoint[] {
    const bootstrapped: SamplePoint[] = [];
    const n = samples.length;
    for (let i = 0; i < n; i++) {
      const idx = Math.floor(rng.next() * n);
      bootstrapped.push(samples[idx]);
    }
    return bootstrapped;
  }

  fit(trainSamples: SamplePoint[]): void {
    this.trees = [];
    this.rawImportance = [0, 0, 0];
    const rng = new PseudoRandom(this.config.randomSeed);

    for (let i = 0; i < this.config.nEstimators; i++) {
      const tree = new DecisionTree(
        this.config.maxDepth,
        this.config.minSamplesSplit,
        this.config.minSamplesLeaf
      );
      const bag = this.bootstrap(trainSamples, rng);
      tree.fit(bag, rng);
      this.trees.push(tree);

      this.rawImportance[0] += tree.featureImportanceGains[0];
      this.rawImportance[1] += tree.featureImportanceGains[1];
      this.rawImportance[2] += tree.featureImportanceGains[2];
    }
  }

  predictSingle(sample: SamplePoint): SampleClass {
    if (this.trees.length === 0) return 'non_mangrove';
    let mangroveVotes = 0;

    for (const tree of this.trees) {
      if (tree.predictSingle(sample) === 'mangrove') {
        mangroveVotes++;
      }
    }

    return mangroveVotes >= this.trees.length / 2 ? 'mangrove' : 'non_mangrove';
  }

  predict(samples: SamplePoint[]): SampleClass[] {
    return samples.map(s => this.predictSingle(s));
  }

  getFeatureImportance(): FeatureImportance[] {
    const total = this.rawImportance[0] + this.rawImportance[1] + this.rawImportance[2];
    const impCMRI = total > 0 ? this.rawImportance[0] / total : 0.333;
    const impMVI = total > 0 ? this.rawImportance[1] / total : 0.333;
    const impNDMI = total > 0 ? this.rawImportance[2] / total : 0.334;

    const list: FeatureImportance[] = [
      {
        feature: 'CMRI',
        fullName: 'Combined Mangrove Recognition Index',
        importance: parseFloat(impCMRI.toFixed(3)),
        rank: 1,
        description: 'Sensitivitas kontras spektral vegetasi mangrove terhadap badan air & daratan pesisir.',
      },
      {
        feature: 'MVI',
        fullName: 'Mangrove Vegetation Index',
        importance: parseFloat(impMVI.toFixed(3)),
        rank: 2,
        description: 'Kerapatan kanopi mangrove berdasarkan diskriminasi NIR & SWIR-1.',
      },
      {
        feature: 'NDMI',
        fullName: 'Normalized Difference Moisture Index',
        importance: parseFloat(impNDMI.toFixed(3)),
        rank: 3,
        description: 'Kandungan kadar air kanopi daun dan kejenuhan substrat pasang surut.',
      },
    ];

    // Sort by importance descending and set rank
    list.sort((a, b) => b.importance - a.importance);
    list.forEach((item, index) => {
      item.rank = index + 1;
    });

    return list;
  }
}

// ── Train/Test Split Utility ──────────────────────────────────────────────────

export function splitTrainTest(
  samples: SamplePoint[],
  testSize: number,
  randomSeed: number
): { train: SamplePoint[]; test: SamplePoint[] } {
  const rng = new PseudoRandom(randomSeed);
  const shuffled = rng.shuffle(samples);
  const testCount = Math.max(1, Math.round(samples.length * testSize));
  const test = shuffled.slice(0, testCount);
  const train = shuffled.slice(testCount);
  return { train, test };
}
