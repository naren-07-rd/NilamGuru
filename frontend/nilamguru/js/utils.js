/* ==========================================================================
   NILAMGURU — utils.js
   Toasts, loading helpers, formatting, small shared DOM helpers.
   ========================================================================== */

/* ---------- Toasts ---------- */
function ensureToastStack() {
    let stack = document.querySelector(".toast-stack");
    if (!stack) {
        stack = document.createElement("div");
        stack.className = "toast-stack";
        document.body.appendChild(stack);
    }
    return stack;
}

function showToast(message, type = "info", duration = 3200) {
    const stack = ensureToastStack();
    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    const icons = { success: "✅", error: "⚠️", info: "ℹ️" };
    toast.innerHTML = `<span>${icons[type] || ""}</span><span>${message}</span>`;
    stack.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add("show"));
    setTimeout(() => {
        toast.classList.remove("show");
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

/* ---------- Loading helpers ---------- */
function showLoading(element, message = "Loading...") {
    if (!element) return;
    element.innerHTML = `
        <div class="loading-block">
            <span class="loading-spinner dark"></span>
            <p style="margin:0">${message}</p>
        </div>
    `;
}

function setButtonLoading(button, loadingText) {
    if (!button) return;
    button.dataset.originalText = button.dataset.originalText || button.innerHTML;
    button.innerHTML = `<span class="loading-spinner"></span> ${loadingText}`;
    button.disabled = true;
}

function resetButton(button) {
    if (!button) return;
    if (button.dataset.originalText) {
        button.innerHTML = button.dataset.originalText;
    }
    button.disabled = false;
}

/* ---------- Empty / error state blocks ---------- */
function renderEmptyState(container, { icon = "📭", title = "Nothing here yet", message = "" } = {}) {
    if (!container) return;
    container.innerHTML = `
        <div class="state-block">
            <div class="state-icon">${icon}</div>
            <h4>${title}</h4>
            <p style="margin:0">${message}</p>
        </div>
    `;
}

function renderErrorState(container, message = "Something went wrong.", onRetry) {
    if (!container) return;
    container.innerHTML = `
        <div class="state-block">
            <div class="state-icon">⚠️</div>
            <h4>Unable to load</h4>
            <p style="margin:0">${message}</p>
            ${onRetry ? '<button class="btn btn-secondary btn-sm" id="retry-btn" style="margin-top:10px">Try Again</button>' : ""}
        </div>
    `;
    if (onRetry) {
        container.querySelector("#retry-btn").addEventListener("click", onRetry);
    }
}

/* ---------- Formatting ---------- */
function formatCurrency(amount) {
    const n = Number(amount);
    if (Number.isNaN(n)) return "₹0";
    return "₹" + n.toLocaleString("en-IN");
}

function formatDate(dateInput) {
    const d = new Date(dateInput);
    if (Number.isNaN(d.getTime())) return "";
    return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function timeAgo(dateInput) {
    const d = new Date(dateInput);
    const diffMs = Date.now() - d.getTime();
    const mins = Math.floor(diffMs / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    if (days < 7) return `${days}d ago`;
    return formatDate(dateInput);
}

function initials(name = "") {
    return name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((w) => w[0]?.toUpperCase() || "")
        .join("");
}

function escapeHtml(str = "") {
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

function qs(id) { return document.getElementById(id); }

/* ---------- Backend status widget ----------
   Hidden in the user-facing UI. Backend health is still available through
   the FastAPI / endpoint and the browser/network tools during development.
*/
async function mountBackendStatus() {
    return;
}
