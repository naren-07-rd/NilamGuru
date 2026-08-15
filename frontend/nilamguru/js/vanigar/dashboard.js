/* ==========================================================================
   NILAMGURU — js/vanigar/dashboard.js
   BACKEND REQUIRED: listing/enquiry/sales stats run on demo data until
   the corresponding FastAPI endpoints exist.
   ========================================================================== */
(async function () {
    await mountAppShell("vanigar", "dashboard");
    mountBackendStatus();

    const user = getCurrentUser();
    document.getElementById("greeting-text").textContent = `Vanigar 🏪, ${user?.name?.split(" ")[0] || "welcome back"}`;

    const recentGrid = document.getElementById("recent-listings");

    try {
        const [{ products }, { enquiries }] = await Promise.all([getProducts(), getEnquiries()]);
        const active = products.filter((p) => (p.status || "active") === "active");

        document.getElementById("stat-total").textContent = products.length;
        document.getElementById("stat-active").textContent = active.length;
        document.getElementById("stat-enquiries").textContent = enquiries.length;
        document.getElementById("stat-sales").textContent = formatCurrency(0);

        if (products.length === 0) {
            renderEmptyState(recentGrid, { icon: "📦", title: "No listings yet", message: "Add your first product to get started." });
        } else {
            recentGrid.innerHTML = products.slice(0, 4).map((p) => `
                <div class="product-card">
                    <div class="thumb"><span class="category-chip">${p.category}</span>${p.icon}</div>
                    <div class="body">
                        <div class="name">${escapeHtml(p.name)}</div>
                        <div class="meta">Stock: ${p.stock}</div>
                        <div class="price-row"><span class="price">${formatCurrency(p.price)}</span></div>
                    </div>
                    <div class="actions"><a href="edit-listing.html?id=${p.id}" class="btn btn-secondary btn-sm btn-block">Edit</a></div>
                </div>
            `).join("");
        }
    } catch (err) {
        showToast(err.message, "error");
    }
})();
