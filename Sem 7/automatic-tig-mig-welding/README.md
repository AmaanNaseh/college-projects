# 🦾 Automatic TIG–MIG Welding of Stainless Steel using Industrial Robot

This project demonstrates an **AI-assisted welding process simulation** for **TIG (Tungsten Inert Gas)** and **MIG (Metal Inert Gas)** welding modes, focusing on **stainless steel** welding automation.  
It uses a **Flask-based backend (Python + scikit-learn)** for predictive modeling and a **React-based frontend** for visualization and user interaction.

---

## 🚀 Overview

The system predicts key welding quality parameters — **penetration depth**, **bead width**, and **defect probability** — based on controllable process parameters.  
It can also **simulate a virtual welding pass** and visualize variations along a weld length, helping optimize robotic welding parameters before deployment.

---

## 🧠 Features

- Dual-mode support: **TIG (mode=0)** and **MIG (mode=1)**
- Predicts:
  - **Penetration depth (mm)**
  - **Bead width (mm)**
  - **Defect probability and label**
- Simulates a full weld pass with travel speed and torch angle variations
- Real-time visualization (progress bar + spark animation)
- Built-in **synthetic dataset generator** (physics-inspired)
- Backend ML models: Random Forest regressors & classifier
- RESTful API for prediction and simulation

---

## 🧩 System Architecture

Frontend (React)
|
| HTTP (POST/GET)
↓
Backend (Flask + ML models)
|
↓
ML Engine (RandomForest Models trained on synthetic data)

---

## 🧰 Tech Stack

| Component         | Technology                                    |
| ----------------- | --------------------------------------------- |
| **Frontend**      | React, Axios, HTML5, CSS3                     |
| **Backend**       | Flask, scikit-learn, NumPy, pandas            |
| **ML Models**     | RandomForestRegressor, RandomForestClassifier |
| **Language**      | Python 3.9+                                   |
| **Visualization** | Dynamic progress & sparks animation in React  |

---

## ⚙️ Backend Setup (Flask + ML)

### Prerequisites

- Python 3.9 or later
- `pip` package manager

### Installation

```bash
# Clone repository
git clone https://github.com/AmaanNaseh/sem7-minor-project.git

# Navigate to Backend
cd Website/backend

# Install dependencies
pip install -r requirements.txt

# Run Backend Server
python app.py
```

### 🌐 API Endpoints

| Endpoint      | Method | Description                                             |
| ------------- | ------ | ------------------------------------------------------- |
| `/health`     | GET    | Check server status                                     |
| `/model_info` | GET    | Get model details and feature info                      |
| `/predict`    | POST   | Predict penetration, bead width, and defect probability |
| `/simulate`   | POST   | Simulate a full welding pass (time-series output)       |

### Example Request (/predict)

```json
{
  "mode": 1,
  "current": 180,
  "voltage": 25,
  "wire_feed_speed": 8,
  "travel_speed": 6,
  "torch_angle": 7,
  "gas_flow_rate": 15,
  "material_thickness": 3
}
```

### Example Response

```json
{
  "penetration_mm": 2.84,
  "bead_width_mm": 6.12,
  "defect_probability": 0.24,
  "defect_label": 0
}
```

---

## 💻 Frontend Setup (React)

### Prerequisites

- Node.js (v16 or later)
- npm or yarn

### Installation

```bash
# Navigate to Frontend
cd Website/frontend

# Install Dependencies
npm install

# Run Server
npm run dev
```

---

## 🧾 Project Structure

```bash
project/
├── backend/
│ ├── app.py
│ ├── requirements.txt
│ └── ...
├── frontend/
│ ├── src/
│ │ ├── App.jsx
│ │ └── ...
│ └── package.json
└── README.md
```

---

## 📚 Future Scope

- Integration with real sensor feedback from robotic welding arm
- Support for adaptive control and self-tuning of parameters
- Incorporate CNN-based weld defect detection (using image data)
- Add dashboard analytics for weld quality trends
