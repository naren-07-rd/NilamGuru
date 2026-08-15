# 🌱 NilamGuru — Agriculture Web Application

NilamGuru is an agriculture technology platform combining **AI-powered crop &
fertilizer recommendation** with an **agricultural marketplace**, built for two
kinds of users:

- 👨‍🌾 **Uzhavali** — Farmer
- 🏪 **Vanigar** — Seller / Trader

---

## 1. Technology Stack

**Frontend:** HTML5, CSS3, Vanilla JavaScript only (no framework, no build step).
**Backend:** FastAPI (existing, provided by you) + your existing trained ML models.
**Communication:** Browser `fetch()` → FastAPI → ML models → JSON → UI.

No React, Vue, Angular, Tailwind, Bootstrap, or any bundler is used anywhere in
this project, per the project requirements.

---

## 2. Project Structure

```text
nilamguru/
├── index.html                     Landing page + splash intro
├── pages/
│   ├── login.html / register.html / role-selection.html
│   ├── otp.html / forgot-password.html
│   ├── uzhavali/                  Farmer pages (10 files)
│   └── vanigar/                   Seller pages (9 files)
├── css/
│   ├── style.css                  Design tokens, reset, typography
│   ├── components.css             Buttons, cards, forms, nav, modal, toast...
│   ├── pages.css                  Page-specific styling
│   └── responsive.css             375 / 390 / 414 / 768 / 1024 / 1280 / 1440 / 1920
├── js/
│   ├── config.js                  ⭐ Change API_BASE_URL here only
│   ├── api.js                     All backend calls go through this file
│   ├── auth.js                    Session handling (demo mode, see below)
│   ├── navigation.js               Renders shared header/sidebar/bottom-nav
│   ├── validation.js               Form validation helpers
│   ├── utils.js                    Toasts, loading states, formatting
│   ├── uzhavali/                  Farmer page scripts
│   └── vanigar/                   Seller page scripts
├── assets/
│   ├── images/
│   └── icons/
└── README.md
```

---

## 3. Running the Frontend

This is a static site — no npm install, no build step.

**Option A — VS Code Live Server (recommended)**
1. Open the `nilamguru/` folder in VS Code.
2. Install the "Live Server" extension if you don't have it.
3. Right-click `index.html` → "Open with Live Server".

**Option B — any static server**
```bash
cd nilamguru
python -m http.server 5500
# then open http://127.0.0.1:5500
```

> Opening `index.html` directly via `file://` mostly works, but some browsers
> restrict `fetch()` on `file://` — a local server is safer.

---

## 4. Running the Backend

```bash
cd your-fastapi-project
uvicorn main:app --reload
```

By default this serves at `http://127.0.0.1:8000`.

### Enable CORS (required)

Your FastAPI code did not show CORS middleware. Since the browser frontend
runs on a different origin (e.g. `http://127.0.0.1:5500`) than FastAPI
(`http://127.0.0.1:8000`), you must add this **without changing any ML/model
logic**:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],       # tighten this to your real frontend URL(s) in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## 5. Backend URL Configuration

Everything reads a single constant in `js/config.js`:

```javascript
const API_BASE_URL = "http://127.0.0.1:8000";
```

Change this **one line** to your deployed FastAPI URL when you go live —
nothing else in the codebase hardcodes the backend URL.

Note: plain static HTML cannot read a `.env` file directly (there's no build
step to inject it). `js/config.js` is the intended equivalent — edit it by
hand, or generate it from your `.env` with a small script if you want that
workflow later.

---

## 6. Real API Integration (confirmed, working)

| Endpoint | Method | Purpose |
|---|---|---|
| `/` | GET | Health check |
| `/predict/crop` | POST | Crop ML prediction |
| `/predict/fertilizer` | POST | Fertilizer ML prediction |

### Crop prediction

Request:
```json
{ "N": 90, "P": 42, "K": 43, "temperature": 25.5, "humidity": 82, "ph": 6.5, "rainfall": 200 }
```
Response:
```json
{ "recommended_crop": "rice" }
```

### Fertilizer prediction

Request:
```json
{
  "temperature": 28, "humidity": 60, "moisture": 40,
  "soil_type": "Sandy", "crop_type": "Maize",
  "nitrogen": 12, "potassium": 10, "phosphorous": 8
}
```
Response:
```json
{ "recommended_fertilizer": "Urea" }
```

`soil_type` and `crop_type` are sent as **strings** — FastAPI's encoders
handle the conversion to whatever the model expects. Nothing is encoded in
the browser.

The dropdown option lists for Soil Type and Crop Type live in `js/config.js`
(`SOIL_TYPES`, `CROP_TYPES`) — they're placeholders until you confirm the
exact categories your encoders were trained on. Update that one array and
every page picks it up automatically.

A small floating **backend status badge** (🟢/🔴) is shown on ML pages —
it pings `GET /` so you can immediately tell whether an issue is frontend or
FastAPI.

---

## 7. Authentication — currently DEMO MODE

⚠️ **The FastAPI backend you provided has no authentication endpoints.**

To keep the app fully clickable, `js/auth.js` + the relevant parts of
`js/api.js` implement a clearly-labeled **demo/localStorage session**:
register, login, role selection, and logout all work, but no real account is
created on any server, and **no password is ever sent anywhere** — it's only
compared locally against what's in `localStorage`.

When you build real auth endpoints, replace the bodies of `loginUser()`,
`registerUser()`, and `verifyOTP()` in `js/api.js` with real `apiRequest()`
calls — the function signatures used across the app won't need to change.

---

## 8. Features Currently Backed by Demo Data (⚠️ BACKEND REQUIRED)

These are fully interactive in the UI (search, filter, add, edit, delete,
reply, mark as read, etc.) but persist to `localStorage`, not FastAPI, and
every relevant page shows a "⚠️ Backend integration pending" banner:

- Marketplace / product listings
- Farmer & seller enquiries
- Notifications
- Farmer & seller profiles
- Farmer activity history (enquiries portion; crop/fertilizer history is
  logged locally from real ML calls)

Every demo function lives in `js/api.js` under the `DEMO SERVICES` section
and is documented with the real endpoint it should eventually call.

---

## 9. ML Prediction Flow

```
HTML form → JavaScript validation → Fetch API → FastAPI → existing ML model
→ JSON response → result card rendered in the browser
```

No prediction logic, encoding, or model behavior is duplicated in
JavaScript — the browser only sends the raw values the user entered.

---

## 10. Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| "Unable to connect to NilamGuru server" toast | FastAPI isn't running, or wrong URL | `uvicorn main:app --reload`, check `API_BASE_URL` in `js/config.js` |
| Browser console: CORS error | CORS middleware missing on FastAPI | Add the CORS snippet in section 4 |
| 🔴 Backend Offline badge | Same as above | Confirm `http://127.0.0.1:8000/` returns `{"message": "Nilamguru API is running"}` |
| "This value is not supported by the current ML model" | soil_type/crop_type sent isn't a category your encoder was trained on | Update `SOIL_TYPES`/`CROP_TYPES` in `js/config.js` to match your encoder exactly |
| 422 Unprocessable Entity | A field is missing or the wrong type | Check the exact field names in section 6 — they must match exactly |
| Nothing happens after Login/Register | You're testing "Login" without registering first (demo mode has no seed accounts) | Register once, then log in with the same email/phone + password |
| Marketplace/listings/enquiries "reset" | Demo data lives in this browser's `localStorage` | Expected in demo mode — will persist server-side once real APIs exist |

---

## 11. Deployment Notes

1. Deploy FastAPI (e.g. Render, Railway, a VM with Gunicorn+Uvicorn) and note
   its public HTTPS URL.
2. Update `API_BASE_URL` in `js/config.js` to that URL.
3. Update FastAPI's CORS `allow_origins` to your real frontend domain instead
   of `"*"`.
4. Deploy the static frontend anywhere that serves static files (Netlify,
   Vercel, GitHub Pages, S3 + CloudFront, Nginx, etc.) — no build step needed.
