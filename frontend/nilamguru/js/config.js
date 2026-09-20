
const API_BASE_URL = "https://nilamguru.onrender.com";


const ENDPOINTS = {
    HEALTH: "/",
    PREDICT_CROP: "/predict/crop",
    PREDICT_FERTILIZER: "/predict/fertilizer"
};

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
