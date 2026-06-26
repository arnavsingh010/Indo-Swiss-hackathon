# Supply Chain Risk Forecasting

> **An AI-powered decision support system for risk-aware inventory forecasting using LightGBM, Quantile Regression, Conformal Prediction, SHAP Explainability, and a Business Decision Engine.**

---

## Live Demo

**Frontend (Vercel):**

> **https://indo-swiss-hackathon.vercel.app/**

**GitHub Repository:**

> **https://github.com/arnavsingh010/Indo-Swiss-hackathon**

---

## Project Overview

Accurate inventory forecasting is essential for resilient supply chain management. Conventional forecasting systems typically provide only a single demand estimate, offering little information regarding prediction uncertainty or the operational risks associated with inventory decisions.

This project proposes an AI-powered decision support system that extends traditional forecasting by integrating probabilistic forecasting, uncertainty quantification, explainable artificial intelligence, and business decision rules. The system not only predicts future demand but also quantifies uncertainty, explains the primary causes of forecasting risk, classifies inventory risk levels, and recommends actionable strategies for supply chain managers.

The prototype was developed as part of the **AI for Public Good: Sustainable & Resilient Supply Chains** Hackathon.

---

# Key Features

* LightGBM-based demand forecasting
* Quantile Regression (10th, 50th and 90th percentile forecasts)
* Conformal Prediction for calibrated uncertainty estimation
* SHAP-based explainability
* Business-oriented risk decomposition
* Inventory risk classification
* Risk-aware reorder quantity recommendation
* Business Decision Engine for manager recommendations
* Interactive dashboard built using Next.js

---

# System Architecture

```
Historical Sales Data
          │
          ▼
Feature Engineering
          │
          ▼
LightGBM Forecasting
          │
          ▼
Quantile Regression
          │
          ▼
Conformal Prediction
          │
          ▼
SHAP Explainability
          │
          ▼
Business Decision Engine
          │
          ▼
Interactive Dashboard
```

---

# Machine Learning Pipeline

## Stage 1 — Data Preparation

* Data preprocessing
* Missing value handling
* Lag feature generation
* Rolling statistics
* Calendar and pricing feature engineering
* Categorical feature encoding

---

## Stage 2 — Baseline Forecasting

A LightGBM regression model is trained to establish a baseline demand forecast.

---

## Stage 3 — Probabilistic Forecasting

Three LightGBM Quantile Regression models estimate:

* Lower Forecast (Q10)
* Median Forecast (Q50)
* Upper Forecast (Q90)

These predictions provide uncertainty-aware demand estimation rather than a single point forecast.

---

## Stage 4 — Conformal Prediction

Split Conformal Prediction calibrates the quantile intervals to produce statistically valid prediction intervals while remaining model-agnostic.

Outputs include:

* Calibrated lower bound
* Calibrated upper bound
* Coverage evaluation

---

## Stage 5 — Explainable AI

TreeSHAP is used to explain model predictions.

Feature contributions are aggregated into business-oriented categories:

* Demand Trend
* Demand Volatility
* Seasonality & Events
* Data Reliability

The Demand Trend component is separated to generate **Pure Risk Drivers**, allowing managers to understand why uncertainty exists.

---

## Stage 6 — Decision Engine

The Decision Engine combines:

* Forecast uncertainty
* Inventory risk level
* Primary risk driver

to generate:

* Recommended reorder quantity
* Inventory risk classification
* Actionable manager recommendations

---

# Dashboard Features

The dashboard provides, for each inventory item:

* Median demand forecast
* Safe upper forecast bound
* Recommended reorder quantity
* Inventory risk level
* Risk decomposition
* Primary risk driver
* Recommended manager actions

---

#  Repository Structure

```
Supply-Chain-Risk-Forecasting/

│
├── Frontend/
│      Next.js dashboard
│
├── Models/
│      Trained LightGBM models
│
├── Outputs/
│      Dashboard data
│      SHAP visualizations
│      Evaluation reports
│
├── Notebook.ipynb
│
├── README.md
│
└── requirements.txt
```

---

# Technology Stack

### Machine Learning

* Python
* LightGBM
* SHAP
* NumPy
* Pandas
* Scikit-learn

### Frontend

* React
* Vite

### Deployment

* Vercel

---

# Dataset

This project utilizes the **Walmart M5 Forecasting Dataset**, containing historical product sales, calendar events, pricing information, and SNAP indicators across multiple stores.

---

# Results

The proposed framework provides:

* Probabilistic demand forecasting
* Calibrated uncertainty estimation
* Explainable forecasting risk
* Inventory risk classification
* Business-oriented inventory recommendations

Rather than producing only a demand forecast, the system functions as a complete inventory decision support pipeline.

---

# Future Scope

Potential extensions include:

* Real-time forecasting API
* Multi-warehouse inventory optimization
* Supplier lead-time uncertainty modelling
* Cost-aware optimization
* Reinforcement learning for inventory policies

---

# Running the Project

Clone the repository

```bash
git clone <repository-url>
```

Navigate to the frontend

```bash
cd Frontend
npm install
npm run dev
```

The machine learning pipeline can be reproduced using the notebook included in the repository.

---

# Authors

**Arnav Singh**

Hackathon Submission

**AI for Public Good: Sustainable & Resilient Supply Chains**
