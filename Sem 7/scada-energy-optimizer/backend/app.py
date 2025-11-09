from flask import Flask, request, jsonify
from sklearn.linear_model import LinearRegression
import numpy as np
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)

# Expanded dataset with 5 features:
# [temperature, humidity, wind_speed, solar_radiation, occupancy]
X_train = np.array([
    [25, 50, 10, 200, 10],
    [30, 60, 15, 300, 20],
    [35, 70, 12, 400, 30],
    [28, 65, 8, 250, 15],
    [40, 75, 20, 500, 50],
    [32, 55, 18, 320, 35],
    [29, 60, 11, 280, 25],
    [45, 85, 14, 550, 60],
    [38, 68, 17, 410, 40],
    [33, 64, 9, 300, 30],
    [36, 72, 13, 420, 35],
    [31, 58, 16, 310, 20],
])

# Corresponding energy consumption (kWh)
y_train = np.array([120, 150, 180, 140, 220, 170, 155, 240, 200, 160, 195, 165])

# Train the model
model = LinearRegression()
model.fit(X_train, y_train)

@app.route('/')
def home():
    return "AI-Powered Energy Optimization Backend"

@app.route('/optimize_energy', methods=['GET', 'POST'])
def optimize_energy():
    try:
        data = request.get_json()
        # Extract all 5 inputs
        temperature = data['temperature']
        humidity = data['humidity']
        wind_speed = data['wind_speed']
        solar_radiation = data['solar_radiation']
        occupancy = data['occupancy']

        input_data = np.array([[temperature, humidity, wind_speed, solar_radiation, occupancy]])
        optimized_energy = model.predict(input_data)[0]

        # Generate dynamic target function from model coefficients
        coefs = model.coef_
        intercept = model.intercept_
        target_function = (
            f"Energy = {round(coefs[0], 2)}*Temp + {round(coefs[1], 2)}*Humidity + "
            f"{round(coefs[2], 2)}*Wind + {round(coefs[3], 2)}*Solar + "
            f"{round(coefs[4], 2)}*Occupancy + {round(intercept, 2)}"
        )

        return jsonify({
            'optimized_energy': round(optimized_energy, 2),
            'target_function': target_function
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 500))
    app.run(host="0.0.0.0", port=port, debug=False)