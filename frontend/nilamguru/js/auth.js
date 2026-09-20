let currentUser = null;

async function getCurrentUser() {
    if (currentUser) {
        return currentUser;
    }

    try {
        const data = await apiRequest("/auth/me", {
            method: "GET"
        });

        currentUser = {
            id: data.id,
            name: data.name,
            identifier: data.email,
            email: data.email,
            role: data.role,
            is_verified: data.is_verified
        };

        return currentUser;

    } catch (_) {
        currentUser = null;
        return null;
    }
}

async function setUserRole(role) {
    console.warn(
        "Role selection is not connected to the backend yet:",
        role
    );
}

async function isLoggedIn() {
    const user = await getCurrentUser();
    return !!user;
}
async function logoutUser() {
    try {
        await apiRequest("/auth/logout", {
            method: "POST"
        });
    } catch (error) {
        console.error("Logout error:", error);
    }

    currentUser = null;

    window.location.href = resolvePath("pages/login.html");
}


async function requireAuth({ role } = {}) {

    const user = await getCurrentUser();

    if (!user) {
        window.location.href = resolvePath("pages/login.html");
        return null;
    }

    if (role && user.role !== role) {

        if (!user.role) {
            window.location.href = resolvePath(
                "pages/role-selection.html"
            );
        } else {
            window.location.href = resolvePath(
                user.role === "vanigar"
                    ? "pages/vanigar/dashboard.html"
                    : "pages/uzhavali/home.html"
            );
        }

        return null;
    }

    return user;
}


function resolvePath(rootRelativePath) {
    const depth = window.location.pathname.split("/pages/")[1]
        ? window.location.pathname.split("/pages/")[1].split("/").length - 1
        : -1; // -1 => at project root (index.html)
    const prefix = depth <= 0 ? "" : "../".repeat(depth);
    return prefix + rootRelativePath;
}
