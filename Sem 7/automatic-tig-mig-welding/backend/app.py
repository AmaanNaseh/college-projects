# app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor, RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
import traceback

app = Flask(__name__)
CORS(app)  # enable CORS for all routes

# ---------------------
# Synthetic dataset generation (physics-inspired)
# ---------------------
def generate_synthetic_data(n_samples=2000, random_state=42):
    rng = np.random.RandomState(random_state)
    # Features ranges (typical-ish values — for demo only)
    mode = rng.choice([0, 1], size=n_samples, p=[0.5, 0.5])  # 0: TIG, 1: MIG
    current = rng.uniform(40, 300, size=n_samples)  # Amps
    voltage = rng.uniform(10, 40, size=n_samples)  # Volts
    wire_feed_speed = rng.uniform(0, 20, size=n_samples)  # mm/s, relevant for MIG
    travel_speed = rng.uniform(1, 15, size=n_samples)  # mm/s
    torch_angle = rng.uniform(0, 15, size=n_samples)  # degrees
    gas_flow_rate = rng.uniform(5, 30, size=n_samples)  # L/min
    material_thickness = rng.uniform(0.5, 12, size=n_samples)  # mm

    # Physics-inspired target generation:
    # penetration increases with current and thickness, decreases with travel speed.
    penetration = (
        0.01 * current
        + 0.2 * np.log1p(material_thickness)
        - 0.3 * travel_speed
        + 0.5 * mode  # MIG tends to give deeper penetration here in synthetic model
    )
    penetration += rng.normal(scale=0.5, size=n_samples)

    # bead width influenced by voltage, current, and wire feed (for MIG)
    bead_width = (
        0.02 * voltage
        + 0.01 * current
        + 0.5 * wire_feed_speed * mode  # only for MIG (mode=1)
        - 0.1 * travel_speed
    )
    bead_width += 0.2 * np.log1p(material_thickness) + rng.normal(scale=0.3, size=n_samples)
    bead_width = np.clip(bead_width, 0.5, None)

    # defect probability: higher when settings mismatch thickness (too much travel speed, too low gas, extreme torch angle)
    mismatch_score = (
        np.abs(0.5 * material_thickness - 0.01 * current)  # arbitrary mismatch formula
        + 0.2 * np.maximum(0, travel_speed - (1 + 0.8 * material_thickness))
        + 0.3 * np.maximum(0, 10 - gas_flow_rate)
        + 0.05 * torch_angle
    )
    defect_prob = 1 / (1 + np.exp(-0.5 * (mismatch_score - 2.5)))  # logistic
    defect = (rng.rand(n_samples) < defect_prob).astype(int)

    df = pd.DataFrame({
        "mode": mode,
        "current": current,
        "voltage": voltage,
        "wire_feed_speed": wire_feed_speed,
        "travel_speed": travel_speed,
        "torch_angle": torch_angle,
        "gas_flow_rate": gas_flow_rate,
        "material_thickness": material_thickness,
        "penetration": penetration,
        "bead_width": bead_width,
        "defect": defect
    })
    return df

# ---------------------
# Train models (regressors + classifier)
# ---------------------
def train_models(df):
    features = ["mode", "current", "voltage", "wire_feed_speed", "travel_speed",
                "torch_angle", "gas_flow_rate", "material_thickness"]
    X = df[features].values
    y_pen = df["penetration"].values
    y_bead = df["bead_width"].values
    y_def = df["defect"].values

    # We'll use simple pipelines with a scaler (not required for trees but fine)
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    # Regressors for penetration and bead width
    pen_model = RandomForestRegressor(n_estimators=200, random_state=0)
    bead_model = RandomForestRegressor(n_estimators=200, random_state=1)
    def_model = RandomForestClassifier(n_estimators=200, random_state=2)

    pen_model.fit(X_scaled, y_pen)
    bead_model.fit(X_scaled, y_bead)
    def_model.fit(X_scaled, y_def)

    # Save scaler and models in a dict
    models = {
        "scaler": scaler,
        "pen_model": pen_model,
        "bead_model": bead_model,
        "def_model": def_model,
        "features": features
    }
    return models

# Generate data & train on startup
print("Generating synthetic dataset and training models (this may take a few seconds)...")
_df = generate_synthetic_data(n_samples=2500, random_state=42)
_models = train_models(_df)
print("Models trained and ready.")

# ---------------------
# Helper: validate and parse input
# ---------------------
def parse_input_json(data):
    """
    Accepts JSON dict with keys matching features.
    Returns numpy array shape (1, n_features).
    """
    features = _models["features"]
    # Provide defaults if missing (safe fallback)
    defaults = {
        "mode": 0,
        "current": 120.0,
        "voltage": 22.0,
        "wire_feed_speed": 5.0,
        "travel_speed": 6.0,
        "torch_angle": 5.0,
        "gas_flow_rate": 12.0,
        "material_thickness": 2.0
    }
    vals = []
    for f in features:
        if f in data:
            vals.append(float(data[f]))
        else:
            vals.append(float(defaults[f]))
    return np.array(vals).reshape(1, -1)

# ---------------------
# Routes
# ---------------------
@app.route("/model_info", methods=["GET"])
def model_info():
    try:
        info = {
            "features": _models["features"],
            "models": {
                "penetration": "RandomForestRegressor (n_estimators=200)",
                "bead_width": "RandomForestRegressor (n_estimators=200)",
                "defect": "RandomForestClassifier (n_estimators=200)"
            },
            "note": "Models are trained on synthetic data for demonstration only."
        }
        return jsonify(info)
    except Exception as e:
        return jsonify({"error": str(e), "trace": traceback.format_exc()}), 500

@app.route("/predict", methods=["POST"])
def predict():
    """
    Expects JSON body with feature values (mode,current,voltage,wire_feed_speed,travel_speed,torch_angle,gas_flow_rate,material_thickness)
    Returns predicted penetration, bead_width, defect_probability, defect_label
    """
    try:
        data = request.get_json(force=True) or {}
        x = parse_input_json(data)
        scaler = _models["scaler"]
        x_scaled = scaler.transform(x)
        pen = _models["pen_model"].predict(x_scaled)[0]
        bead = _models["bead_model"].predict(x_scaled)[0]
        def_prob = _models["def_model"].predict_proba(x_scaled)[0][1]
        def_label = int(def_prob >= 0.5)

        resp = {
            "input": {k: float(data[k]) if k in data else None for k in _models["features"]},
            "penetration_mm": float(np.round(pen, 4)),
            "bead_width_mm": float(np.round(bead, 4)),
            "defect_probability": float(np.round(def_prob, 4)),
            "defect_label": def_label
        }
        return jsonify(resp)
    except Exception as e:
        return jsonify({"error": str(e), "trace": traceback.format_exc()}), 500

@app.route("/simulate", methods=["POST"])
def simulate():
    """
    Simulate a welding pass over a length (virtual) by varying travel_speed slightly and returning time-series of predictions.
    JSON body may contain 'length_mm' and other feature overrides.
    """
    try:
        data = request.get_json(force=True) or {}
        base = parse_input_json(data).reshape(-1)  # 1-D feature vector
        length_mm = float(data.get("length_mm", 100.0))
        segments = int(data.get("segments", 10))
        # Simulate small variations in travel speed and torch angle during the pass
        travel_speed_base = base[_models["features"].index("travel_speed")]
        torch_angle_base = base[_models["features"].index("torch_angle")]

        results = []
        for i in range(segments):
            frac = i / max(1, segments - 1)
            # small sinusoidal variation
            travel_speed = travel_speed_base * (1 + 0.05 * np.sin(2 * np.pi * frac))
            torch_angle = torch_angle_base + (0.5 * np.cos(2 * np.pi * frac))
            # update local feature vector
            local = base.copy()
            local[_models["features"].index("travel_speed")] = travel_speed
            local[_models["features"].index("torch_angle")] = torch_angle

            # predict
            x_scaled = _models["scaler"].transform(local.reshape(1, -1))
            pen = float(np.round(_models["pen_model"].predict(x_scaled)[0], 4))
            bead = float(np.round(_models["bead_model"].predict(x_scaled)[0], 4))
            def_prob = float(np.round(_models["def_model"].predict_proba(x_scaled)[0][1], 4))
            pos_mm = float(np.round(frac * length_mm, 3))
            results.append({
                "position_mm": pos_mm,
                "travel_speed": float(np.round(travel_speed, 4)),
                "torch_angle": float(np.round(torch_angle, 4)),
                "penetration_mm": pen,
                "bead_width_mm": bead,
                "defect_probability": def_prob
            })

        return jsonify({"simulation": results, "segments": segments, "length_mm": length_mm})
    except Exception as e:
        return jsonify({"error": str(e), "trace": traceback.format_exc()}), 500

@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "note": "Flask ML simulation server running"})

# Run the app (note: Python boolean True is used so it runs correctly)
if __name__ == "__main__":
    app.run(host="0.0.0.0",port=5000, debug=False)
