// Architecture specifications and code blueprints for Backend Python ML & Google Earth Engine

export const PYTHON_BACKEND_CODE = `"""
PETA HIDUP MANGROVE — Random Forest Backend Microservice
Framework: FastAPI + Scikit-Learn + GeoPandas + NumPy
"""

from fastapi import FastAPI, HTTPException, UploadFile, File
from pydantic import BaseModel
from typing import List, Optional
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import confusion_matrix, classification_report, cohen_kappa_score

app = FastAPI(title="Mangrove Random Forest API", version="1.0.0")

class RFParameters(BaseModel):
    n_estimators: int = 50
    max_depth: int = 6
    min_samples_split: int = 2
    min_samples_leaf: int = 1
    random_state: int = 42
    test_size: float = 0.3

# Active model instance storage (In-memory or Redis)
active_model = None

@app.post("/api/v1/train")
async def train_random_forest(file: UploadFile = File(...), params: RFParameters = RFParameters()):
    global active_model
    try:
        df = pd.read_csv(file.file)
        required_cols = {'sample_id', 'CMRI', 'MVI', 'NDMI', 'class'}
        if not required_cols.issubset(df.columns):
            raise HTTPException(status_code=400, detail="Missing required spectral columns.")

        X = df[['CMRI', 'MVI', 'NDMI']].values
        y = (df['class'] == 'mangrove').astype(int).values

        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=params.test_size, random_state=params.random_state, stratify=y
        )

        clf = RandomForestClassifier(
            n_estimators=params.n_estimators,
            max_depth=params.max_depth,
            min_samples_split=params.min_samples_split,
            min_samples_leaf=params.min_samples_leaf,
            random_state=params.random_state,
            n_jobs=-1
        )
        clf.fit(X_train, y_train)
        active_model = clf

        y_pred = clf.predict(X_test)
        cm = confusion_matrix(y_test, y_pred)
        kappa = cohen_kappa_score(y_test, y_pred)
        importances = clf.feature_importances_

        return {
            "status": "success",
            "samples_train": len(X_train),
            "samples_test": len(X_test),
            "confusion_matrix": {
                "TP": int(cm[1, 1]), "FN": int(cm[1, 0]),
                "FP": int(cm[0, 1]), "TN": int(cm[0, 0])
            },
            "overall_accuracy": float(np.mean(y_pred == y_test)),
            "cohens_kappa": float(kappa),
            "feature_importance": {
                "CMRI": float(importances[0]),
                "MVI": float(importances[1]),
                "NDMI": float(importances[2])
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
`;

export const GEE_JAVASCRIPT_CODE = `// Google Earth Engine — Sentinel-2 Random Forest Mangrove Classification
// Author: PETA HIDUP MANGROVE Architecture Team (IT RUSH 2026)

var bengkuluCoastal = ee.Geometry.Polygon([
  [[101.40, -3.00], [103.50, -4.95], [103.65, -4.85], [101.55, -2.90]]
]);

// 1. Load Harmonized Sentinel-2 MSI L2A
var s2 = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
  .filterBounds(bengkuluCoastal)
  .filterDate('2026-01-01', '2026-11-01')
  .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 20));

// 2. Cloud Masking using SCL (Scene Classification Layer)
function maskS2sr(image) {
  var scl = image.select('SCL');
  var mask = scl.neq(3).and(scl.neq(8)).and(scl.neq(9)).and(scl.neq(10));
  return image.updateMask(mask).divide(10000);
}

var composite = s2.map(maskS2sr).median().clip(bengkuluCoastal);

// 3. Compute Spectral Indices (CMRI, MVI, NDMI)
var nir = composite.select('B8');
var red = composite.select('B4');
var green = composite.select('B3');
var swir1 = composite.select('B11');

var ndvi = composite.normalizedDifference(['B8', 'B4']).rename('NDVI');
var ndwi = composite.normalizedDifference(['B3', 'B8']).rename('NDWI');
var cmri = ndvi.subtract(ndwi).rename('CMRI');
var mvi = nir.subtract(green).divide(swir1.subtract(green)).rename('MVI');
var ndmi = composite.normalizedDifference(['B8', 'B11']).rename('NDMI');

var featureStack = composite.addBands([cmri, mvi, ndmi]);
var bands = ['CMRI', 'MVI', 'NDMI'];

// 4. Sample Extraction & Random Forest Classification
// samples: ee.FeatureCollection with property 'class' (1: mangrove, 0: non_mangrove)
var trainingData = featureStack.select(bands).sampleRegions({
  collection: samples,
  properties: ['class'],
  scale: 10
});

var classifier = ee.Classifier.smileRandomForest({
  numberOfTrees: 50,
  variablesPerSplit: 2,
  minLeafPopulation: 1,
  seed: 42
}).train({
  features: trainingData,
  classProperty: 'class',
  inputProperties: bands
});

var classified = featureStack.select(bands).classify(classifier);

// 5. Visualization on Bengkulu Map
Map.centerObject(bengkuluCoastal, 9);
Map.addLayer(composite, {bands: ['B4', 'B3', 'B2'], min: 0, max: 0.3}, 'Sentinel-2 True Color');
Map.addLayer(classified, {min: 0, max: 1, palette: ['#CBD5E1', '#174B32']}, 'RF Classification (Mangrove vs Non-Mangrove)');
`;
