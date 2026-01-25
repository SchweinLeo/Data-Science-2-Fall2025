# Results Directory

This directory contains model performance results and analysis outputs.

## Files to Add

Copy these from source directory `/Users/smm/My Drive/WiSe2026/DS2/2/Feature matrix/`:

```
results/
├── unified_clean_model_performance.csv         # Main results (ESSENTIAL)
├── top_features_per_disease.csv                # Feature importance
├── precision_optimization_recommendations.csv  # Optimization suggestions
├── MODEL_SUMMARY_REPORT.md                     # Results summary
└── FEATURE_ANALYSIS.md                         # Feature analysis
```

## Key Result Files

### unified_clean_model_performance.csv
The primary results file showing:
- Disease (Orthopedic, Dermatological, Cardiac, Ear, Urinary)
- Model type (LogisticRegression, RandomForest, GradientBoosting)
- Metrics: Accuracy, Precision, Recall, F1, AUC

**Sample Results:**
```
Disease,Model,Accuracy,Precision,Recall,F1,AUC
Urinary,LogisticRegression,0.6269,0.0595,0.7032,0.1105,0.7064
Cardiac,LogisticRegression,0.5436,0.1008,0.7476,0.1772,0.6706
Orthopedic,LogisticRegression,0.5080,0.0968,0.7574,0.1713,0.6676
...
```

### top_features_per_disease.csv
- Top 10-20 predictive features for each disease
- Feature importance scores
- Shows what drives predictions

### Other Results
- Performance comparison between models
- Class imbalance analysis
- Optimization recommendations

## Quick Copy Command

```bash
cp /Users/smm/My\ Drive/WiSe2026/DS2/2/Feature\ matrix/*.csv \
   /Users/smm/My\ Drive/WiSe2026/Dog_Disease_Prediction_GitHub/results/
```

## Generating Results

After training with `scripts/train_unified_clean.py`:

```bash
cd ../scripts
python train_unified_clean.py
# Outputs: unified_clean_model_performance.csv
cp unified_clean_model_performance.csv ../results/
```

## Performance Summary

| Disease | Best Model | AUC | Details |
|---------|-----------|-----|---------|
| Urinary | Logistic Regression | 0.7064 | High reliability |
| Cardiac | Logistic Regression | 0.6706 | Good reliability |
| Orthopedic | Logistic Regression | 0.6676 | Good reliability |
| Dermatological | Logistic Regression | 0.5814 | Low reliability |
| Ear | Logistic Regression | 0.5836 | Low reliability |

Average AUC: **0.6419** (19-feature model), **0.6851** (67-feature model)

See `DATA_AND_SCRIPTS_README.md` for full details.
