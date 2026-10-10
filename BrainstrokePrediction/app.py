from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
import joblib

app = Flask(__name__)
CORS(app)

# ============================================================
# LOAD ARTIFACTS
# ============================================================

try:
    artifacts = joblib.load("stroke_model_artifacts.joblib")

    model = artifacts["model"]
    scaler = artifacts["scaler"]
    iqr_bounds = artifacts["iqr_bounds"]

    RAW_NUMERIC_FEATURES = artifacts["raw_numeric_features"]
    ALL_NUMERIC_FEATURES = artifacts["all_numeric_features"]

    RAW_CATEGORICAL_FEATURES = artifacts["raw_categorical_features"]

    CAT_DUMMY_COLUMNS = artifacts["cat_dummy_columns"]
    FINAL_FEATURE_COLUMNS = artifacts["final_feature_columns"]

    HAS_BMI_AGE = artifacts["has_bmi_age"]
    BEST_THRESHOLD = artifacts["best_threshold"]

    print("✅ Artifacts loaded successfully")
    print("✅ Model:", type(model))
    print("✅ Threshold:", BEST_THRESHOLD)

except Exception as e:
    print("❌ Error loading artifacts:", e)

    model = None


# ============================================================
# PREPROCESS INPUT
# ============================================================

def preprocess_input(data):

    df = pd.DataFrame([data])

    # --------------------------------------------------------
    # Numeric Features
    # --------------------------------------------------------

    for col in RAW_NUMERIC_FEATURES:
        if col not in df.columns:
            df[col] = 0

    for col in RAW_NUMERIC_FEATURES:
        df[col] = pd.to_numeric(df[col], errors="coerce")
        df[col] = df[col].fillna(0)

    # --------------------------------------------------------
    # Categorical Features
    # --------------------------------------------------------

    for col in RAW_CATEGORICAL_FEATURES:
        if col not in df.columns:
            df[col] = ""

    # --------------------------------------------------------
    # Apply IQR Clipping
    # --------------------------------------------------------

    for col in RAW_NUMERIC_FEATURES:

        if col in iqr_bounds:

            lower, upper = iqr_bounds[col]

            df[col] = df[col].clip(lower, upper)

    # --------------------------------------------------------
    # Feature Engineering
    # --------------------------------------------------------

    if HAS_BMI_AGE:

        df["bmi_age_interaction"] = (
            df["age"] * df["bmi"]
        )

    # --------------------------------------------------------
    # One Hot Encoding
    # --------------------------------------------------------

    encoded = pd.get_dummies(
        df[RAW_CATEGORICAL_FEATURES],
        drop_first=True,
        dtype=int
    )

    encoded = encoded.reindex(
        columns=CAT_DUMMY_COLUMNS,
        fill_value=0
    )

    # --------------------------------------------------------
    # Scale Numeric Columns
    # --------------------------------------------------------

    scaled = scaler.transform(
        df[ALL_NUMERIC_FEATURES]
    )

    scaled_df = pd.DataFrame(
        scaled,
        columns=[f"{c}_z" for c in ALL_NUMERIC_FEATURES]
    )

    # --------------------------------------------------------
    # Combine Features
    # --------------------------------------------------------

    final_df = pd.concat(
        [scaled_df, encoded.reset_index(drop=True)],
        axis=1
    )

    # --------------------------------------------------------
    # Match Training Columns
    # --------------------------------------------------------

    final_df = final_df.reindex(
        columns=FINAL_FEATURE_COLUMNS,
        fill_value=0
    )

    return final_df


# ============================================================
# HOME
# ============================================================

@app.route("/", methods=["GET"])
def home():

    return jsonify({
        "message": "Stroke Prediction API Running"
    })


# ============================================================
# SAMPLE JSON
# # ============================================================

# @app.route("/example", methods=["GET"])
# def example():

#     return jsonify({
#         "gender": "Female",
#         "age": 25,
#         "hypertension": 0,
#         "heart_disease": 0,
#         "ever_married": "No",
#         "work_type": "Private",
#         "Residence_type": "Rural",
#         "avg_glucose_level": 80,
#         "bmi": 22,
#         "smoking_status": "never smoked"
#     })


# ============================================================
# PREDICT
# ============================================================

@app.route("/predict", methods=["POST"])
def predict():

    try:

        if model is None:

            return jsonify({
                "error": "Model not loaded"
            }), 500

        data = request.get_json(force=True)

        final_df = preprocess_input(data)

        probability = float(
            model.predict_proba(final_df)[0][1]
        )

        prediction = int(
            probability >= BEST_THRESHOLD
        )

        return jsonify({

            "prediction": prediction,

            "stroke_probability": round(
                probability,
                6
            ),

            "threshold": round(
                float(BEST_THRESHOLD),
                6
            )

        })

    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 500


# ============================================================
# RUN APP
# ============================================================

if __name__ == "__main__":

    app.run(
        host="0.0.0.0",
        port=3000,
        debug=True
    )