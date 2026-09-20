async function apiRequest(endpoint, options = {}) {
    let response;
    try {
            response = await fetch(`${API_BASE_URL}${endpoint}`, {
                 ...options,
                credentials: "include",

                headers: {
                     "Content-Type": "application/json",
                    ...(options.headers || {})
        }
    });
    } catch (networkErr) {
        throw new Error(
            "Unable to connect to NilamGuru server. Please make sure FastAPI is running."
        );
    }

    let data = {};
    try {
        data = await response.json();
    } catch (_) {
        // no JSON body
    }

    if (!response.ok) {
        if (response.status === 422 || response.status === 400) {
            const detail = Array.isArray(data.detail)
                ? data.detail.map((d) => d.msg).join(", ")
                : data.detail;
            throw new Error(detail || "Please check the values you entered.");
        }
        if (response.status === 401) {
            throw new Error(data.detail || "Please log in again.");
        }
        if (response.status >= 500) {
            throw new Error("Something went wrong on the server. Please try again.");
        }
        throw new Error(data.detail || "Something went wrong");
    }

    return data;
}

async function checkBackendHealth() {
    return apiRequest(ENDPOINTS.HEALTH, { method: "GET" });
}

/* ---------- REAL: Crop ML ---------- */
/**
 * @param {{N:number,P:number,K:number,temperature:number,humidity:number,ph:number,rainfall:number}} data
 * @returns {Promise<{recommended_crop:string}>}
 */
async function predictCrop(data) {
    return apiRequest(ENDPOINTS.PREDICT_CROP, {
        method: "POST",
        body: JSON.stringify(data)
    });
}

/* ---------- REAL: Fertilizer ML ---------- */
/**
 * @param {{temperature:number,humidity:number,moisture:number,soil_type:string,crop_type:string,nitrogen:number,potassium:number,phosphorous:number}} data
 * @returns {Promise<{recommended_fertilizer:string}>}
 */
async function predictFertilizer(data) {
    return apiRequest(ENDPOINTS.PREDICT_FERTILIZER, {
        method: "POST",
        body: JSON.stringify(data)
    });
}


const DEMO_LATENCY = 450;
const wait = (ms = DEMO_LATENCY) => new Promise((res) => setTimeout(res, ms));

function readStore(key, fallback) {
    try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : fallback;
    } catch (_) {
        return fallback;
    }
}
function writeStore(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

/* ----- Auth (BACKEND REQUIRED — demo/localStorage only) ----- */
async function loginUser({ identifier, password }) {
    // Current backend authentication uses email.
    if (!identifier || !identifier.includes("@")) {
        throw new Error("Please enter a valid email address.");
    }

    const data = await apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify({
            email: identifier,
            password: password
        })
    });

    return {
        user: {
            name: data.user.name,
            identifier: data.user.email,
            role: data.user.role,
            id: data.user.id,
            is_verified: data.user.is_verified
        }
    };
}

async function registerUser({ name, identifier, password, role }) {
    // The current backend registration schema expects email.
    if (!identifier || !identifier.includes("@")) {
        throw new Error("Please register using a valid email address.");
    }

    const data = await apiRequest("/auth/register", {
        method: "POST",
        body: JSON.stringify({
            name: name,
            email: identifier,
            password: password
        })
    });

    // Keep the existing frontend response format.
    return {
        user: {
            name: data.user.name,
            identifier: data.user.email,
            role: data.user.role,
            id: data.user.id,
            is_verified: data.user.is_verified
        }
    };
}

async function verifyOTP(code) {
    await wait();
    if (String(code).length !== 4) {
        throw new Error("Enter the 4-digit code sent to you.");
    }
    return { verified: true };
}

/* ----- Marketplace (BACKEND REQUIRED — demo data) ----- */
const MOCK_PRODUCTS = [
    { id: "p1", name: "Organic Urea 50kg", category: "fertilizer", price: 340, unit: "bag", rating: 4.6, seller: "Green Agro Traders", location: "Salem", stock: 120, icon: "🧪", description: "High-grade nitrogen fertilizer suitable for most cereal and cash crops. Improves vegetative growth and yield." },
    { id: "p2", name: "Hybrid Maize Seeds", category: "seeds", price: 220, unit: "kg", rating: 4.8, seller: "AgriSeed Co.", location: "Coimbatore", stock: 300, icon: "🌱", description: "High-yield hybrid maize seed variety, disease resistant and suited for red loamy soils." },
    { id: "p3", name: "Mini Power Tiller", category: "tools", price: 45000, unit: "unit", rating: 4.4, seller: "FarmTech Equipments", location: "Erode", stock: 8, icon: "🚜", description: "Compact power tiller ideal for small to medium farms, low fuel consumption." },
    { id: "p4", name: "Desi Cow (Milch)", category: "animals", price: 38000, unit: "head", rating: 4.7, seller: "Kaveri Dairy Farm", location: "Thanjavur", stock: 3, icon: "🐄", description: "Healthy, vaccinated desi cow, currently in milk, average yield 8L/day." },
    { id: "p5", name: "Fresh Tomatoes", category: "produce", price: 28, unit: "kg", rating: 4.3, seller: "Vellore Farmers Collective", location: "Vellore", stock: 500, icon: "🌾", description: "Farm-fresh tomatoes harvested this week, sold in bulk for retailers and traders." },
    { id: "p6", name: "NPK 19:19:19 25kg", category: "fertilizer", price: 890, unit: "bag", rating: 4.5, seller: "Green Agro Traders", location: "Salem", stock: 60, icon: "🧪", description: "Balanced water-soluble fertilizer for all growth stages." },
    { id: "p7", name: "Paddy Seeds (ADT-45)", category: "seeds", price: 65, unit: "kg", rating: 4.6, seller: "AgriSeed Co.", location: "Thanjavur", stock: 800, icon: "🌱", description: "Popular short-duration paddy variety suited for Tamil Nadu delta regions." },
    { id: "p8", name: "Battery Sprayer 16L", category: "tools", price: 2600, unit: "unit", rating: 4.2, seller: "FarmTech Equipments", location: "Madurai", stock: 25, icon: "🚜", description: "Rechargeable battery sprayer for pesticide and fertilizer application." }
];

async function getProducts({ category = "all", search = "" } = {}) {
    await wait();
    let items = readStore("nilamguru_products", MOCK_PRODUCTS);
    if (category !== "all") items = items.filter((p) => p.category === category);
    if (search) {
        const s = search.toLowerCase();
        items = items.filter((p) => p.name.toLowerCase().includes(s) || p.category.toLowerCase().includes(s));
    }
    return { products: items };
}

async function getProduct(id) {
    await wait();
    const items = readStore("nilamguru_products", MOCK_PRODUCTS);
    const product = items.find((p) => p.id === id);
    if (!product) throw new Error("Product not found.");
    return { product };
}

async function createProduct(product) {
    await wait();
    const items = readStore("nilamguru_products", MOCK_PRODUCTS);
    const newProduct = { ...product, id: "p" + Date.now(), rating: 0, status: "active" };
    items.unshift(newProduct);
    writeStore("nilamguru_products", items);
    return { product: newProduct };
}

async function updateProduct(id, updates) {
    await wait();
    const items = readStore("nilamguru_products", MOCK_PRODUCTS);
    const idx = items.findIndex((p) => p.id === id);
    if (idx === -1) throw new Error("Listing not found.");
    items[idx] = { ...items[idx], ...updates };
    writeStore("nilamguru_products", items);
    return { product: items[idx] };
}

async function deleteProduct(id) {
    await wait();
    const items = readStore("nilamguru_products", MOCK_PRODUCTS).filter((p) => p.id !== id);
    writeStore("nilamguru_products", items);
    return { deleted: true };
}

/* ----- Enquiries (BACKEND REQUIRED — demo data) ----- */
async function sendEnquiry({ productId, productName, quantity, message }) {
    await wait();
    const enquiries = readStore("nilamguru_enquiries", []);
    const enquiry = {
        id: "e" + Date.now(),
        productId, productName, quantity, message,
        farmer: "Uzhavali (You)",
        status: "new",
        date: new Date().toISOString()
    };
    enquiries.unshift(enquiry);
    writeStore("nilamguru_enquiries", enquiries);
    return { enquiry };
}

async function getEnquiries({ status = "all" } = {}) {
    await wait();
    let items = readStore("nilamguru_enquiries", []);
    if (status !== "all") items = items.filter((e) => e.status === status);
    return { enquiries: items };
}

async function updateEnquiry(id, updates) {
    await wait();
    const items = readStore("nilamguru_enquiries", []);
    const idx = items.findIndex((e) => e.id === id);
    if (idx === -1) throw new Error("Enquiry not found.");
    items[idx] = { ...items[idx], ...updates };
    writeStore("nilamguru_enquiries", items);
    return { enquiry: items[idx] };
}

/* ----- Notifications (BACKEND REQUIRED — demo data) ----- */
const MOCK_NOTIFICATIONS_FARMER = [
    { id: "n1", icon: "🌾", text: "Your crop prediction is ready.", read: false, date: new Date(Date.now() - 3600e3).toISOString() },
    { id: "n2", icon: "📩", text: "New response from seller Green Agro Traders.", read: false, date: new Date(Date.now() - 7200e3).toISOString() },
    { id: "n3", icon: "🛒", text: "Your enquiry was received.", read: true, date: new Date(Date.now() - 86400e3).toISOString() }
];
const MOCK_NOTIFICATIONS_SELLER = [
    { id: "n1", icon: "📩", text: "New enquiry received for Organic Urea 50kg.", read: false, date: new Date(Date.now() - 1800e3).toISOString() },
    { id: "n2", icon: "🛒", text: "Your listing 'Hybrid Maize Seeds' is now active.", read: true, date: new Date(Date.now() - 90000e3).toISOString() },
    { id: "n3", icon: "⚠️", text: "Stock running low for Battery Sprayer 16L.", read: false, date: new Date(Date.now() - 172800e3).toISOString() }
];

async function getNotifications(role) {
    await wait();
    const key = `nilamguru_notifications_${role}`;
    const fallback = role === "vanigar" ? MOCK_NOTIFICATIONS_SELLER : MOCK_NOTIFICATIONS_FARMER;
    return { notifications: readStore(key, fallback) };
}

async function markNotificationRead(role, id) {
    await wait(150);
    const key = `nilamguru_notifications_${role}`;
    const fallback = role === "vanigar" ? MOCK_NOTIFICATIONS_SELLER : MOCK_NOTIFICATIONS_FARMER;
    const items = readStore(key, fallback).map((n) => (n.id === id ? { ...n, read: true } : n));
    writeStore(key, items);
    return { notifications: items };
}

async function markAllNotificationsRead(role) {
    await wait(150);
    const key = `nilamguru_notifications_${role}`;
    const fallback = role === "vanigar" ? MOCK_NOTIFICATIONS_SELLER : MOCK_NOTIFICATIONS_FARMER;
    const items = readStore(key, fallback).map((n) => ({ ...n, read: true }));
    writeStore(key, items);
    return { notifications: items };
}

/* ----- Profile (BACKEND REQUIRED — demo data) ----- */
async function getProfile() {
    await wait();
    const user = getCurrentUser();
    const profile = readStore("nilamguru_profile", {
        name: user?.name || "Uzhavali User",
        phone: "9876543210",
        email: user?.identifier && user.identifier.includes("@") ? user.identifier : "farmer@example.com",
        location: "Salem, Tamil Nadu",
        landDetails: "3.5 acres, irrigated",
        businessName: "AgroMart Traders",
        bankDetails: "•••• •••• 4321 — SBI"
    });
    return { profile };
}

async function updateProfile(updates) {
    await wait();
    const current = readStore("nilamguru_profile", {});
    const updated = { ...current, ...updates };
    writeStore("nilamguru_profile", updated);
    return { profile: updated };
}

/* ----- Farmer activity (BACKEND REQUIRED — derived from local demo logs) ----- */
async function getActivity() {
    await wait();
    return {
        cropPredictions: readStore("nilamguru_crop_history", []),
        fertilizerPredictions: readStore("nilamguru_fertilizer_history", []),
        enquiries: readStore("nilamguru_enquiries", [])
    };
}

function logCropPrediction(entry) {
    const items = readStore("nilamguru_crop_history", []);
    items.unshift({ ...entry, date: new Date().toISOString() });
    writeStore("nilamguru_crop_history", items.slice(0, 50));
}

function logFertilizerPrediction(entry) {
    const items = readStore("nilamguru_fertilizer_history", []);
    items.unshift({ ...entry, date: new Date().toISOString() });
    writeStore("nilamguru_fertilizer_history", items.slice(0, 50));
}
