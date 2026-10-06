# Mental Health Score Predictor

A machine learning web application that predicts a student's mental health score based on social media usage, academic information, lifestyle habits, and stress level.

## Overview

This project uses a trained machine learning model to predict a student's mental health score from **0 to 10**.

The project includes:

* Data analysis and preprocessing
* Machine learning model training
* FastAPI backend
* HTML/CSS/JavaScript frontend
* REST API for making predictions
* Git/GitHub version control

## Features

* Predicts a student's mental health score
* Input validation using Pydantic
* Interactive web interface
* FastAPI REST API
* Handles categorical and numerical features
* Model loaded using Joblib

## Tech Stack

### Machine Learning

* Python
* Pandas
* NumPy
* Scikit-learn
* Joblib
* Jupyter Notebook

### Backend

* FastAPI
* Pydantic
* Uvicorn

### Frontend

* HTML
* CSS
* JavaScript

### Development Tools

* VS Code
* Git
* GitHub

## Project Structure

```text
mental-health-predictor/
│
├── index.html
├── style.css
├── script.js
│
├── main.py
├── Mental_Health_Model.pkl
│
├── mental_health_predictor.ipynb
├── Student Social Media And Mental Health Impact.csv
│
├── requirements.txt
├── .gitignore
└── README.md
```

## How It Works

The application follows this flow:

```text
User enters information
        ↓
HTML / JavaScript frontend
        ↓
POST request to FastAPI
        ↓
Pydantic validates input
        ↓
Input converted into a Pandas DataFrame
        ↓
Trained ML model makes prediction
        ↓
Predicted mental health score
        ↓
Displayed on the webpage
```

## Running the Project Locally

### 1. Clone the repository

```bash
git clone https://github.com/adhyayan825-blip/mental-health-predictor.git
cd mental-health-predictor
```

### 2. Create a virtual environment

```bash
python -m venv venv
```

Activate it on Windows:

```bash
venv\Scripts\activate
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

### 4. Start the FastAPI server

```bash
uvicorn main:app --reload --port 8001
```

The API will run at:

```text
http://127.0.0.1:8001
```

FastAPI's interactive documentation is available at:

```text
http://127.0.0.1:8001/docs
```

### 5. Run th
