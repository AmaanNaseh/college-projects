# AI-Powered Energy Optimization for SCADA Systems

## Project Overview

This project is an **AI-Powered Energy Optimization System** integrated with a SCADA-like Human-Machine Interface (HMI). It leverages machine learning to predict and optimize energy consumption in industrial and commercial buildings using environmental and operational data.

The system allows operators to monitor environmental parameters in real-time, predict energy usage, and adjust operations for maximum efficiency. It is designed to integrate into existing industrial automation workflows for **smart energy management**.

#### Deployed Link: https://scada-energy-optimizer.netlify.app

---

## Table of Contents

- [Introduction](#introduction)
- [SCADA Systems Overview](#scada-systems-overview)
- [Project Features](#project-features)
- [Industrial Use Case](#industrial-use-case)
- [System Architecture](#system-architecture)
- [Technologies Used](#technologies-used)
- [Installation & Setup](#installation--setup)
- [Usage](#usage)
- [Screenshots](#screenshots)
- [Future Enhancements](#future-enhancements)
- [References](#references)

---

## Introduction

Industrial energy management is a critical challenge for modern facilities. Traditional SCADA systems provide monitoring and control capabilities but often lack **predictive energy optimization**.

This project enhances SCADA with AI capabilities:

- **Predictive modeling:** Uses environmental parameters to predict energy consumption.
- **Real-time optimization:** Simulates energy consumption per hour.
- **Dynamic control interface:** Operators can adjust parameters like temperature, humidity, solar radiation, and occupancy to optimize energy usage.
- **Visualization:** Hourly charts, radial gauges, and live monitoring panels provide actionable insights.

---

## SCADA Systems Overview

**SCADA (Supervisory Control and Data Acquisition)** is an industrial control system used to monitor and control physical processes in real-time. It is widely used in industries such as:

- Manufacturing
- Power generation and distribution
- Water treatment plants
- Oil and gas

Key features of SCADA systems:

- **Real-time data acquisition** from sensors and IoT devices.
- **Human-Machine Interface (HMI)** for operators to interact with machines.
- **Data logging** and historical data analysis.
- **Alarming and event management** for operational anomalies.

By integrating AI-powered energy prediction into SCADA, facilities can **reduce energy wastage**, **lower operational costs**, and achieve **sustainable industrial automation**.

---

## Project Features

### Environmental Sensors Panel

- Input sliders for:
  - Temperature (°C)
  - Humidity (%)
  - Wind Speed (km/h)
  - Solar Radiation (W/m²)
  - Occupancy (people)
  - Duration (hours)
- Real-time feedback with radial gauges.

### AI Optimization

- Linear Regression ML model predicts **optimized energy consumption (kWh)** based on environmental parameters.
- Dynamic target function displayed for transparency:

```
Energy = a*Temp + b*Humidity + c*Wind + d*Solar + e*Occupancy + Intercept
```

### Energy Monitoring Dashboard

- **Total Consumption** display (kWh).
- **Hourly Rate** visualization (kWh/h).
- **Real-Time Area Chart** showing predicted hourly energy usage.
- **System Status Indicator**: READY, PROCESSING, OPTIMIZED, ERROR.

### HMI Interface

- Fully responsive React.js interface with Tailwind CSS.
- Interactive sliders and charts mimic a SCADA HMI experience.
- Color-coded gauges for fast visual interpretation.

---

## Industrial Use Case

**Scenario:**  
A manufacturing plant wants to optimize its HVAC, lighting, and machinery energy usage based on weather conditions and occupancy patterns.

**Workflow:**

1. SCADA system collects environmental data via IoT sensors.
2. AI model predicts energy consumption.
3. Operators adjust parameters in the HMI to reduce energy usage.
4. System simulates hourly consumption for planning.
5. Historical and real-time monitoring allows decision-making for **energy savings**.

**Benefits:**

- Reduction in energy costs by up to 15-25%.
- Enhanced predictive maintenance using environmental insights.
- Integration into fully automated smart industrial systems.
- Improved sustainability and regulatory compliance.

---

## System Architecture

```
[Environmental Sensors] ---> [SCADA HMI Interface (React)] ---> [Flask Backend (AI Model)]
         |                                                |
         v                                                v
  [IoT Data Streams]                             [Energy Optimization & Predictions]
                                                        |
                                                        v
                                          [Visualization & Control Feedback]
```

- **Frontend (React + Tailwind CSS):** Interactive HMI interface.
- **Backend (Flask + Scikit-Learn):** Linear Regression model for energy prediction.
- **Communication:** REST API with CORS enabled for frontend-backend integration.
- **Data Visualization:** Area charts, radial gauges, and status indicators for operator feedback.

---

## Technologies Used

- **Frontend:** React.js, Tailwind CSS, Recharts (Charts & Gauges)
- **Backend:** Python Flask, NumPy, Scikit-Learn
- **API Communication:** Fetch API, JSON
- **Energy Prediction:** Linear Regression Machine Learning Model

---

## Installation & Setup

### Backend Setup

```bash
# Clone repository
git clone https://github.com/AmaanNaseh/college-projects.git

cd Sem 7/scada-energy-optimizer/backend

# Install dependencies
pip install flask numpy scikit-learn flask-cors

# Run Flask server
python app.py
```

### Frontend Setup

```bash
cd Sem 7/scada-energy-optimizer/frontend
npm install
npm run dev
```

### Access

- Open browser at `http://localhost:5173` (Vite React default port).
- Backend API runs on `http://localhost:5000`.

---

## Usage

1. Adjust environmental parameters using sliders.
2. Set the desired duration (hours).
3. Click **OPTIMIZE ENERGY** to simulate consumption.
4. Observe:
   - Optimized energy (kWh)
   - Total energy consumption
   - Hourly rate chart
   - Radial gauges for real-time sensor values
   - AI optimization function

---

## Screenshots

<img width="1919" height="686" alt="Image" src="https://github.com/user-attachments/assets/1cd8ef87-a951-412c-8dc6-3ac5b2126209" />

---

## Future Enhancements

- Replace Linear Regression with **Deep Learning models** for better accuracy.
- Integrate real-time IoT data for live predictions.
- Expand environmental parameters to include CO2 levels, machine status, and energy tariffs.
- Add **automatic control algorithms** to adjust building systems in real-time.
- Historical data logging for **predictive maintenance** and **energy auditing**.

---

## References

- [SCADA Systems Overview](https://www.scadatechnology.com)
- [Industrial Energy Management](https://www.energy.gov/eere/amo/industrial-energy-management)
- [Flask Documentation](https://flask.palletsprojects.com/)
- [Scikit-Learn Linear Regression](https://scikit-learn.org/stable/modules/linear_model.html)
- [Recharts for React](https://recharts.org/en-US/)

---

## License

This project is **MIT Licensed**. You are free to use, modify, and distribute this software for industrial and academic purposes.
