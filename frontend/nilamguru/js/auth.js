/* ==========================================================================
   NILAMGURU — auth.js
   BACKEND REQUIRED: the FastAPI backend has no auth endpoints yet.
   This file provides a clearly-labeled DEMO/localStorage session so the
   rest of the app (protected pages, role-based nav, profile) is fully
   functional. Swap saveSession()/getCurrentUser() internals for real
   token handling once auth endpoints exist — never store real passwords
   here or in localStorage.
   ========================================================================== */

const SESSION_KEY = "nilamguru_user";

function saveSession(user) {
    // Demo only — do not store passwords or secrets here.
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

function getCurrentUser() {
    try {
        const raw = localStorage.getItem(SESSION_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch (_) {
        return null;
    }
}

function setUserRole(role) {
    const user = getCurrentUser() || {};
    user.role = role;
    saveSession(user);
}

function isLoggedIn() {
    return !!getCurrentUser();
}

function logoutUser() {
    localStorage.removeItem(SESSION_KEY);
    window.location.href = resolvePath("pages/login.html");
}

/**
 * Redirects to login if there's no session. Optionally enforces a role
 * and bounces to role-selection if the role is missing.
 * Call at the top of any protected dashboard page.
 */
function requireAuth({ role } = {}) {
    const user = getCurrentUser();
    if (!user) {
        window.location.href = resolvePath("pages/login.html");
        return null;
    }
    if (role && user.role !== role) {
        if (!user.role) {
            window.location.href = resolvePath("pages/role-selection.html");
        } else {
            // Logged-in user of the other role tried to open this page.
            window.location.href = resolvePath(
                user.role === "vanigar" ? "pages/vanigar/dashboard.html" : "pages/uzhavali/home.html"
            );
        }
        return null;
    }
    return user;
}

/**
 * Resolves an app-root-relative path (e.g. "pages/login.html") to a
 * correct relative URL no matter how deep the current page is nested.
 * Depth is inferred from how many "/pages/.../" segments deep we are.
 */
function resolvePath(rootRelativePath) {
    const depth = window.location.pathname.split("/pages/")[1]
        ? window.location.pathname.split("/pages/")[1].split("/").length - 1
        : -1; // -1 => at project root (index.html)
    const prefix = depth <= 0 ? "" : "../".repeat(depth);
    return prefix + rootRelativePath;
}
