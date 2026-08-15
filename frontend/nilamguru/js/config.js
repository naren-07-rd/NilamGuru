/* ==========================================================================
   NILAMGURU — config.js
   Single source of truth for backend URL + shared configuration.
   Change API_BASE_URL here ONLY — never hardcode the URL in other files.
   ========================================================================== */

// 👉 Change this to your deployed FastAPI URL when you go live.
const API_BASE_URL = "http://127.0.0.1:8000";

// ---------------------------------------------------------------------------
// REAL backend endpoints (confirmed against the FastAPI code you provided).
// Do not rename these — they must match the backend exactly.
// ---------------------------------------------------------------------------
const ENDPOINTS = {
    HEALTH: "/",
    PREDICT_CROP: "/predict/crop",
    PREDICT_FERTILIZER: "/predict/fertilizer"
};

// ---------------------------------------------------------------------------
// Features NOT YET backed by a real FastAPI endpoint.
// Everything below runs on localStorage "demo mode" until real APIs exist.
// Flip a flag to false the moment you wire up the real endpoint.
// ---------------------------------------------------------------------------
const DEMO_MODE = {
    auth: true,
    marketplace: true,
    enquiries: true,
    notifications: true,
    profile: true,
    listings: true
};

// Soil types — configurable list. Replace with the exact categories your
// soil_type encoder was trained on once you confirm them.
const SOIL_TYPES = ["Sandy", "Loamy", "Clayey", "Black", "Red"];

// Crop types — configurable list. Replace with the exact categories your
// crop_type encoder was trained on once you confirm them.
const CROP_TYPES = [
    "Maize", "Rice", "Wheat", "Cotton", "Sugarcane",
    "Barley", "Millets", "Groundnut", "Pulses", "Oil seeds"
];

// Marketplace categories (used across marketplace + listings — demo data)
const PRODUCT_CATEGORIES = [
    { id: "animals", label: "Animals", icon: "🐄" },
    { id: "tools", label: "Tools", icon: "🚜" },
    { id: "seeds", label: "Seeds", icon: "🌱" },
    { id: "fertilizer", label: "Fertilizer", icon: "🧪" },
    { id: "produce", label: "Produce", icon: "🌾" }
];
