# Scripts Directory

This directory contains Python scripts for training models and analysis.

## Available Scripts

### Main Training Script

**`train_unified_clean.py`** ✅ Included
- Trains all models on clean unified matrix
- Uses 47,444 dogs with 67 features
- Trains: Logistic Regression, Random Forest, Gradient Boosting
- For each disease: orthopedic, dermatological, cardiac, ear, urinary
- Outputs: `unified_clean_model_performance.csv`

**Run it:**
```bash
cd scripts
python train_unified_clean.py
```

### Other Available Scripts

These scripts are referenced in the main directory but can be copied if needed:

- `train_optimized_models.py` - Hyperparameter optimization for each model
- `train_balanced_models.py` - Handles class imbalance
- `train_disease_models.py` - Disease-specific training
- `train_models_clean_data.py` - Clean data pipeline
- `create_unified_feature_matrix.py` - Feature engineering

## Script Dependencies

All scripts require:
```
pandas
numpy
scikit-learn
```

Install with:
```bash
pip install -r ../backend/requirements.txt
```

## How Scripts Work

### General Pipeline

1. **Load Data**
   ```python
   df = pd.read_csv("data/DAP_Feature_Matrix_Unified_CLEAN.csv")
   ```

2. **Prepare Features**
   - Drop dog_id and target columns
   - Encode categorical variables
   - Create feature matrix X

3. **Prepare Targets**
   - Extract disease-specific target columns
   - Create binary (0/1) targets for each disease

4. **Train/Test Split**
   - 80% training, 20% testing
   - Stratified by disease status (maintains class distribution)
   - Random state 42 for reproducibility

5. **Model Training**
   - Logistic Regression: with feature scaling
   - Random Forest: on raw features
   - Gradient Boosting: on raw features

6. **Evaluation**
   - Calculate: Accuracy, Precision, Recall, F1, AUC
   - Save results to CSV
   - Print summary

### Logistic Regression Preprocessing

```python
# Feature scaling for Logistic Regression
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# Train
model = LogisticRegression(max_iter=1000, class_weight='balanced', random_state=42)
model.fit(X_train_scaled, y_train)
```

### Model Saving

Models are saved to pickle files:
```python
import pickle
with open('model.pkl', 'wb') as f:
    pickle.dump(model, f)
```

## Expected Output

When running `train_unified_clean.py`:

```
====================================================================================================
TRAINING MODELS ON CLEAN UNIFIED MATRIX (NO DATA LEAKAGE)
====================================================================================================

📁 Loading clean unified feature matrix...
✅ Loaded: 47,444 dogs × 73 columns
   Features: 67 (dog_id + 5 targets removed)
   Final feature count after encoding: 124

====================================================================================================
DISEASE: ORTHOPEDIC
====================================================================================================
  Class distribution: 5,663 positive / 41,781 negative (11.9% / 88.1%)
  Train: 37,955 | Test: 9,489

  🔄 Training LogisticRegression...
     Accuracy:  0.5080
     Precision: 0.0968
     Recall:    0.7574
     F1-Score:  0.1713
     AUC:       0.6676

  ... (more models and diseases)

====================================================================================================
SUMMARY - HONEST MODEL PERFORMANCE (NO DATA LEAKAGE)
====================================================================================================

Disease             Best Model           AUC        Precision    Recall
--100--

Urinary             LogisticRegression   0.7064     0.0595       0.7032
Cardiac             LogisticRegression   0.6706     0.1008       0.7476
...

💾 Results saved to: unified_clean_model_performance.csv
```

## Troubleshooting

**Script can't find data file:**
```bash
# Make sure you're in the scripts directory
cd /path/to/github/scripts

# Or update the path in the script:
df = pd.read_csv("../data/DAP_Feature_Matrix_Unified_CLEAN.csv")
```

**ImportError for sklearn:**
```bash
pip install scikit-learn
```

**Memory issues with large dataset:**
- The training set is 47,444 dogs × 124 features
- Requires ~500 MB RAM
- RandomForest training is most memory-intensive
- Use `n_jobs=-1` for parallel processing

## Advanced Usage

### Modify Feature Set

```python
# In train_unified_clean.py, modify feature selection:
X_raw = df.drop(['dog_id'] + target_cols, axis=1)
# Select only specific columns
X_raw = df[['age', 'sex_class', 'weight_class', ...]]
```

### Change Train/Test Split

```python
# Default is 80/20, change to 70/30:
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.3, random_state=42, stratify=y
)
```

### Adjust Model Hyperparameters

```python
# In models dictionary:
'LogisticRegression': LogisticRegression(
    max_iter=1000,           # Increase iterations
    C=0.1,                   # Regularization strength
    class_weight='balanced', # Handle imbalance
    random_state=42
)
```

## Next Steps

1. ✅ Run training script
2. ✅ Review results in CSV
3. ✅ Select best models (already done for production)
4. ✅ Save models to pickle files
5. ✅ Deploy in API backend

See `DATA_AND_SCRIPTS_README.md` for full documentation.
