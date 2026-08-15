/* ==========================================================================
   NILAMGURU — navigation.js
   Renders the shared header / sidebar / bottom-nav into dashboard pages so
   markup isn't duplicated across 19 HTML files. Each dashboard page just
   needs: <div id="app-header"></div> <nav id="app-sidebar"></nav>
   <div id="app-bottomnav"></div> containers plus body[data-page].
   ========================================================================== */

const NAV_ITEMS = {
    uzhavali: [
        { key: "home", label: "Home", icon: "🏠", href: "home.html" },
        { key: "marketplace", label: "Marketplace", icon: "🛒", href: "marketplace.html" },
        { key: "activity", label: "Activity", icon: "📋", href: "activity.html" },
        { key: "profile", label: "Profile", icon: "👤", href: "profile.html" }
    ],
    vanigar: [
        { key: "dashboard", label: "Home", icon: "🏠", href: "dashboard.html" },
        { key: "listings", label: "Listings", icon: "📦", href: "listings.html" },
        { key: "enquiries", label: "Enquiries", icon: "📩", href: "enquiries.html" },
        { key: "profile", label: "Profile", icon: "👤", href: "profile.html" }
    ]
};

// Desktop sidebar gets a couple of extra items that don't fit mobile bottom-nav
const SIDEBAR_EXTRA = {
    uzhavali: [{ key: "notifications", label: "Notifications", icon: "🔔", href: "notifications.html" }],
    vanigar: [{ key: "notifications", label: "Notifications", icon: "🔔", href: "notifications.html" }]
};

function currentRoleFromBody() {
    return document.body.dataset.role || "uzhavali";
}

function renderAppHeader({ role, activePage, unreadCount = 0 } = {}) {
    const header = document.getElementById("app-header");
    if (!header) return;
    const notifHref = activePage === "notifications" ? "#" : "notifications.html";
    const profileHref = activePage === "profile" ? "#" : "profile.html";
    const user = getCurrentUser();

    header.className = "app-header";
    header.innerHTML = `
        <div class="brand"><span class="leaf">🌱</span> NILAMGURU</div>
        <div class="header-actions">
            <a class="icon-button" href="${notifHref}" aria-label="Notifications">
                🔔${unreadCount > 0 ? '<span class="badge-dot"></span>' : ""}
            </a>
            <a class="avatar" href="${profileHref}" aria-label="Profile">
                ${initials(user?.name || (role === "vanigar" ? "Vanigar" : "Uzhavali"))}
            </a>
        </div>
    `;
}

function renderSidebar({ role, activePage }) {
    const sidebar = document.getElementById("app-sidebar");
    if (!sidebar) return;
    const items = [...NAV_ITEMS[role], ...SIDEBAR_EXTRA[role]];
    sidebar.className = "app-sidebar";
    sidebar.innerHTML = `
        <div class="brand"><span class="leaf">🌱</span> NILAMGURU</div>
        <nav>
            ${items
                .map(
                    (item) => `
                <a class="sidebar-link ${item.key === activePage ? "active" : ""}" href="${item.href}">
                    <span class="icon">${item.icon}</span> ${item.label}
                </a>`
                )
                .join("")}
        </nav>
        <div class="sidebar-footer">
            <button class="sidebar-link" id="sidebar-logout" style="width:100%;border:none;background:none;text-align:left">
                <span class="icon">🚪</span> Logout
            </button>
        </div>
    `;
    sidebar.querySelector("#sidebar-logout").addEventListener("click", logoutUser);
}

function renderBottomNav({ role, activePage }) {
    const nav = document.getElementById("app-bottomnav");
    if (!nav) return;
    nav.className = "bottom-nav";
    nav.innerHTML = NAV_ITEMS[role]
        .map(
            (item) => `
        <a class="bottom-nav-link ${item.key === activePage ? "active" : ""}" href="${item.href}">
            <span class="icon">${item.icon}</span>
            <span>${item.label}</span>
        </a>`
        )
        .join("");
}

/**
 * Call once per dashboard page.
 * @param {"uzhavali"|"vanigar"} role
 * @param {string} activePage - matches a NAV_ITEMS[].key
 */
async function mountAppShell(role, activePage) {
    requireAuth({ role });
    renderAppHeader({ role, activePage });
    renderSidebar({ role, activePage });
    renderBottomNav({ role, activePage });

    // Reflect unread notification count in the bell icon (demo data).
    try {
        const { notifications } = await getNotifications(role);
        const unread = notifications.filter((n) => !n.read).length;
        if (unread > 0) renderAppHeader({ role, activePage, unreadCount: unread });
    } catch (_) {
        /* non-fatal */
    }
}

/* ---------- Public navbar mobile menu (landing / marketing pages) ---------- */
function initMobileMenu() {
    const toggle = document.getElementById("nav-toggle");
    const links = document.getElementById("navbar-links");
    if (!toggle || !links) return;
    toggle.addEventListener("click", () => {
        links.classList.toggle("open-mobile");
    });
}
