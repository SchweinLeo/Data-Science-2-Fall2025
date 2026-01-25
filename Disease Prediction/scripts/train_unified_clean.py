import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, roc_auc_score
import warnings
warnings.filterwarnings('ignore')

print("=" * 100)
print("TRAINING MODELS ON CLEAN UNIFIED MATRIX (NO DATA LEAKAGE)")
print("=" * 100)

# Load clean unified matrix
print("\n📁 Loading clean unified feature matrix...")
df = pd.read_csv("DAP_Feature_Matrix_Unified_CLEAN.csv")

print(f"✅ Loaded: {df.shape[0]:,} dogs × {df.shape[1]} columns")
print(f"   Features: {df.shape[1] - 6} (dog_id + 5 targets removed)")

# Prepare data
diseases = ['orthopedic', 'dermatological', 'cardiac', 'ear', 'urinary']
target_cols = [f'target_{disease}' for disease in diseases]

# Drop dog_id and get features
X_raw = df.drop(['dog_id'] + target_cols, axis=1)

# Encode categorical variables
X = pd.get_dummies(X_raw, drop_first=True)

print(f"   Final feature count after encoding: {X.shape[1]}")

# Store results
all_results = []

# Train models for each disease
for disease in diseases:
    print(f"\n{'='*100}")
    print(f"DISEASE: {disease.upper()}")
    print(f"{'='*100}")
    
    y = df[f'target_{disease}']
    
    # Check class distribution
    pos_count = y.sum()
    neg_count = len(y) - pos_count
    print(f"  Class distribution: {pos_count:,} positive / {neg_count:,} negative ({pos_count/len(y)*100:.1f}% / {neg_count/len(y)*100:.1f}%)")
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    
    print(f"  Train: {len(X_train):,} | Test: {len(X_test):,}")
    
    # Define models
    models = {
        'LogisticRegression': LogisticRegression(max_iter=1000, class_weight='balanced', random_state=42),
        'RandomForest': RandomForestClassifier(n_estimators=100, max_depth=15, class_weight='balanced', random_state=42, n_jobs=-1),
        'GradientBoosting': GradientBoostingClassifier(n_estimators=100, max_depth=5, random_state=42)
    }
    
    for model_name, model in models.items():
        print(f"\n  🔄 Training {model_name}...")
        
        # Scale for LogisticRegression
        if model_name == 'LogisticRegression':
            scaler = StandardScaler()
            X_train_scaled = scaler.fit_transform(X_train)
            X_test_scaled = scaler.transform(X_test)
            model.fit(X_train_scaled, y_train)
            y_pred = model.predict(X_test_scaled)
            y_pred_proba = model.predict_proba(X_test_scaled)[:, 1]
        else:
            model.fit(X_train, y_train)
            y_pred = model.predict(X_test)
            y_pred_proba = model.predict_proba(X_test)[:, 1]
        
        # Calculate metrics
        accuracy = accuracy_score(y_test, y_pred)
        precision = precision_score(y_test, y_pred, zero_division=0)
        recall = recall_score(y_test, y_pred, zero_division=0)
        f1 = f1_score(y_test, y_pred, zero_division=0)
        auc = roc_auc_score(y_test, y_pred_proba)
        
        print(f"     Accuracy:  {accuracy:.4f}")
        print(f"     Precision: {precision:.4f}")
        print(f"     Recall:    {recall:.4f}")
        print(f"     F1-Score:  {f1:.4f}")
        print(f"     AUC:       {auc:.4f}")
        
        # Store results
        all_results.append({
            'Disease': disease.capitalize(),
            'Model': model_name,
            'Accuracy': accuracy,
            'Precision': precision,
            'Recall': recall,
            'F1': f1,
            'AUC': auc
        })

# Save results
results_df = pd.DataFrame(all_results)
output_path = "unified_clean_model_performance.csv"
results_df.to_csv(output_path, index=False)

print(f"\n{'='*100}")
print("SUMMARY - HONEST MODEL PERFORMANCE (NO DATA LEAKAGE)")
print(f"{'='*100}\n")

# Display summary by disease (best model per disease)
print(f"{'Disease':<20} {'Best Model':<20} {'AUC':<10} {'Precision':<12} {'Recall':<10}")
print("-" * 100)

for disease in diseases:
    disease_results = results_df[results_df['Disease'] == disease.capitalize()]
    best_idx = disease_results['AUC'].idxmax()
    best = disease_results.loc[best_idx]
    print(f"{best['Disease']:<20} {best['Model']:<20} {best['AUC']:<10.4f} {best['Precision']:<12.4f} {best['Recall']:<10.4f}")

# Calculate average
avg_auc = results_df.groupby('Model')['AUC'].mean()
print("\n" + "-" * 100)
print("AVERAGE AUC BY MODEL:")
for model_name in ['LogisticRegression', 'RandomForest', 'GradientBoosting']:
    print(f"  {model_name:<20} {avg_auc[model_name]:.4f}")

print(f"\n💾 Results saved to: {output_path}")
print(f"\n{'='*100}")
print("✅ TRAINING COMPLETE - HONEST RESULTS WITHOUT DATA LEAKAGE")
print(f"{'='*100}")
