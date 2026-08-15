# 🌱 NilamGuru

### Smart Farming • ML-Powered Crop & Fertilizer Recommendation

NilamGuru is a Machine Learning based smart farming web application designed to help farmers make better crop and fertilizer decisions using soil and environmental information.

The application combines a responsive frontend with a FastAPI backend and trained Machine Learning models. Farmers can enter soil and environmental parameters and receive ML-powered crop and fertilizer recommendations.

---

## 🚀 Live Application

- **Frontend:** Deployed on Vercel
- **Backend API:** https://nilamguru.onrender.com
- **API Documentation:** https://nilamguru.onrender.com/docs
- **GitHub Repository:** https://github.com/naren-07-rd/NilamGuru

> The frontend is deployed separately from the backend, while both are maintained in this single GitHub repository.

---

## 🎯 Project Objective

Agricultural decisions often depend on soil characteristics, nutrient levels, weather conditions, and crop requirements.

NilamGuru aims to provide a simple digital interface where users can enter these parameters and receive data-driven recommendations.

### The main ML capabilities are:

- 🌾 Crop recommendation
- 🧪 Fertilizer recommendation
- 📊 Soil and environmental parameter processing
- ⚡ Fast API-based ML prediction
- 🌐 Responsive web interface

---

## ✨ Features

### 🌾 Crop Recommendation

The crop recommendation model accepts:

- Nitrogen (N)
- Phosphorus (P)
- Potassium (K)
- Temperature
- Humidity
- Soil pH
- Rainfall

It returns the recommended crop.

### 🧪 Fertilizer Recommendation

The fertilizer recommendation model accepts:

- Temperature
- Humidity
- Moisture
- Soil type
- Crop type
- Nitrogen
- Potassium
- Phosphorus

It returns the recommended fertilizer.

### 🌐 Web Application

The frontend contains multiple sections and role-oriented pages, including:

- Home
- Authentication UI
- Farmer/Uzhavali pages
- Seller/Vanigar pages
- Crop recommendation
- Fertilizer recommendation
- Marketplace
- Product pages
- Enquiries
- Notifications
- Profile
- Activity

Some of these features currently operate in frontend demo mode using browser `localStorage` and are not yet connected to a persistent backend database.

---

## 🏗️ System Architecture

```text
                         ┌──────────────────────┐
                         │       User           │
                         │    Web Browser       │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │   NilamGuru Frontend │
                         │ HTML / CSS / JS      │
                         │      Vercel          │
                         └──────────┬───────────┘
                                    │
                         HTTPS API Requests
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │    FastAPI Backend   │
                         │       Render         │
                         └──────────┬───────────┘
                                    │
                  ┌─────────────────┴─────────────────┐
                  │                                   │
                  ▼                                   ▼
       ┌────────────────────┐             ┌────────────────────┐
       │ Crop Recommendation│             │ Fertilizer         │
       │ ML Model           │             │ Recommendation     │
       │ + Label Encoder    │             │ Model + Encoders   │
       └────────────────────┘             └────────────────────┘
```

---

## 🧠 Machine Learning

The project contains trained models and encoders for the two current prediction services.

### Crop Recommendation

```text
Input
  ↓
N, P, K
Temperature
Humidity
pH
Rainfall
  ↓
Crop Recommendation Model
  ↓
Label Encoder
  ↓
Recommended Crop
```

### Fertilizer Recommendation

```text
Input
  ↓
Temperature
Humidity
Moisture
Soil Type
Crop Type
N, P, K
  ↓
Encoders
  ↓
Fertilizer Recommendation Model
  ↓
Fertilizer Encoder
  ↓
Recommended Fertilizer
```

---

## 🔌 Backend API

The FastAPI backend currently exposes the following real endpoints:

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/` | API health check |
| POST | `/predict/crop` | Crop recommendation |
| POST | `/predict/fertilizer` | Fertilizer recommendation |

Interactive API documentation is available through FastAPI Swagger UI:

`https://nilamguru.onrender.com/docs`

---

## 📁 Project Structure

The repository intentionally keeps the frontend and backend in a single repository.

```text
NilamGuru/
│
├── Dataset/
│   ├── Crop_recommendation.csv
│   ├── Fertilizer Prediction.csv
│   └── model
│
├── frontend/
│   └── nilamguru/
│       ├── .gitignore
│       ├── README.md
│       ├── index.html
│       ├── css/
│       ├── js/
│       └── pages/
│
├── models/
│   ├── crop_encoder.pkl
│   ├── crop_label_encoder.pkl
│   ├── crop_recommendation_model.pkl
│   ├── fertilizer_encoder.pkl
│   ├── fertilizer_model.pkl
│   └── soil_encoder.pkl
│
├── notebook/
│   ├── crop_prediction.ipynb
│   └── fertilizer_prediction.ipynb
│
├── main.py
├── requirements.txt
├── pyproject.toml
├── uv.lock
├── .gitignore
├── .python-version
└── README.md
```

---

## 🛠️ Technology Stack

### Frontend

- HTML5
- CSS3
- JavaScript
- Responsive Web Design
- Browser localStorage for current demo-only features

### Backend

- Python
- FastAPI
- Uvicorn
- Pydantic
- CORS Middleware

### Machine Learning

- Scikit-learn
- NumPy
- Joblib
- Label Encoders

### Development & Deployment

- Git
- GitHub
- Render
- Vercel
- VS Code

---

## ⚙️ Run the Backend Locally

### 1. Clone the repository

```bash
git clone https://github.com/naren-07-rd/NilamGuru.git
cd NilamGuru
```

### 2. Create and activate a virtual environment

Windows PowerShell:

```powershell
python -m venv .venv
.venv\Scripts\Activate.ps1
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

### 4. Start FastAPI

```bash
uvicorn main:app --reload
```

The local API will be available at:

```text
http://127.0.0.1:8000
```

Swagger documentation:

```text
http://127.0.0.1:8000/docs
```

---

## 🌐 Run the Frontend Locally

The frontend is a static HTML/CSS/JavaScript application.

From:

```text
frontend/nilamguru
```

you can run a simple local HTTP server with Python:

```bash
python -m http.server 5500
```

Then open:

```text
http://127.0.0.1:5500
```

The frontend API configuration is centralized in:

```text
frontend/nilamguru/js/config.js
```

The deployed configuration points the frontend to the Render FastAPI backend.

---

## 🔗 Frontend ↔ Backend Integration

The frontend keeps the backend URL in one place:

```javascript
const API_BASE_URL = "https://nilamguru.onrender.com";
```

The real ML endpoints are:

```text
/predict/crop
/predict/fertilizer
```

This allows the frontend deployed on Vercel to communicate with the FastAPI backend deployed on Render.

---

## 📦 Deployment

### Backend — Render

The FastAPI backend is deployed from the repository root.

**Build Command:**

```bash
pip install -r requirements.txt
```

**Start Command:**

```bash
uvicorn main:app --host 0.0.0.0 --port $PORT
```

The ML models are stored in the repository's `models/` directory and loaded using paths relative to `main.py`.

### Frontend — Vercel

The Vercel project uses:

```text
frontend/nilamguru
```

as its root directory.

The frontend is deployed as a static web application.

---

## 🔐 Current Backend Scope

The current FastAPI backend provides the two ML prediction services and a health-check endpoint.

The following frontend features are currently demo/localStorage based:

- Authentication
- Marketplace data
- Product listings
- Enquiries
- Notifications
- Profile data
- Activity history

These features are intentionally kept separate from the current ML API until their corresponding backend services and database layer are implemented.

---

## 🗄️ Future Development

Planned improvements include:

- [ ] Persistent database integration
- [ ] Real user authentication
- [ ] Secure password handling
- [ ] User profiles stored in the backend
- [ ] Persistent marketplace listings
- [ ] Real product and enquiry management
- [ ] Notification backend
- [ ] Farmer prediction history
- [ ] Seller dashboard data
- [ ] Improved API validation and error handling
- [ ] Production CORS configuration
- [ ] Model monitoring and versioning
- [ ] Cloud database integration
- [ ] Better agricultural insights and recommendations

---

## 🔒 Security Notes

For production expansion, the following should be implemented:

- Restrict CORS to the deployed frontend domain.
- Never store plain-text passwords.
- Move secrets and credentials to environment variables.
- Add authentication and authorization to protected APIs.
- Validate and sanitize user input.
- Use a proper database instead of browser `localStorage` for persistent user data.
- Add logging and monitoring for production APIs.

---

## 📚 Project Learning

This project demonstrates an end-to-end Machine Learning application workflow:

```text
Dataset
   ↓
Data Preparation
   ↓
Model Training
   ↓
Encoding / Preprocessing
   ↓
Model Serialization
   ↓
FastAPI API
   ↓
Frontend Integration
   ↓
GitHub
   ↓
Render + Vercel
   ↓
Live ML Web Application
```

---

## 👨‍💻 Author

### NARENTHIRANATH AS

Computer Science Engineering Student  
Machine Learning • Artificial Intelligence • Software Development

**LinkedIn:**  
https://www.linkedin.com/in/narenthiranath-as-6a5356323

**GitHub:**  
https://github.com/naren-07-rd

---

## ⭐ Acknowledgement

NilamGuru was developed as a learning and project initiative focused on applying Machine Learning and full-stack development to an agriculture-oriented real-world problem.

If you find the project useful or interesting, consider giving the repository a ⭐ on GitHub.

---

## 📄 License

This project currently does not specify a license. Add an appropriate open-source license if you decide to make the project available for reuse or distribution.
