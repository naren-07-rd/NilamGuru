/* ==========================================================================
   NILAMGURU — js/uzhavali/marketplace.js
   BACKEND REQUIRED: marketplace/product APIs don't exist yet.
   Uses getProducts() from api.js (localStorage demo service). The fetch
   call shape below is what real integration will look like.
   ========================================================================== */
(async function () {
    await mountAppShell("uzhavali", "marketplace");

    const grid = document.getElementById("product-grid");
    const chipsRow = document.getElementById("filter-chips");
    const searchInput = document.getElementById("search-input");

    let activeCategory = "all";
    let searchTerm = "";
    let debounceTimer;

    // Build filter chips from config
    chipsRow.innerHTML =
        `<button class="chip active" data-cat="all">All</button>` +
        PRODUCT_CATEGORIES.map((c) => `<button class="chip" data-cat="${c.id}">${c.icon} ${c.label}</button>`).join("");

    chipsRow.addEventListener("click", (e) => {
        const btn = e.target.closest(".chip");
        if (!btn) return;
        activeCategory = btn.dataset.cat;
        chipsRow.querySelectorAll(".chip").forEach((c) => c.classList.toggle("active", c === btn));
        loadProducts();
    });

    searchInput.addEventListener("input", () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            searchTerm = searchInput.value.trim();
            loadProducts();
        }, 300);
    });

    async function loadProducts() {
        showLoading(grid, "Loading marketplace...");
        try {
            const { products } = await getProducts({ category: activeCategory, search: searchTerm });
            if (products.length === 0) {
                renderEmptyState(grid, { icon: "🛒", title: "No products found", message: "Try a different search or category." });
                return;
            }
            grid.innerHTML = products.map(renderCard).join("");
        } catch (err) {
            renderErrorState(grid, err.message, loadProducts);
        }
    }

    function renderCard(p) {
        return `
        <div class="product-card">
            <div class="thumb">
                <span class="category-chip">${p.category}</span>
                ${p.icon}
            </div>
            <div class="body">
                <div class="name">${escapeHtml(p.name)}</div>
                <div class="meta">${escapeHtml(p.seller)} · ${escapeHtml(p.location)}</div>
                <div class="rating">⭐ ${p.rating}</div>
                <div class="price-row">
                    <span class="price">${formatCurrency(p.price)}</span>
                    <span class="unit">/ ${escapeHtml(p.unit)}</span>
                </div>
            </div>
            <div class="actions">
                <a href="product-details.html?id=${p.id}" class="btn btn-secondary btn-sm btn-block">View</a>
                <a href="product-details.html?id=${p.id}#enquire" class="btn btn-primary btn-sm btn-block">Enquire</a>
            </div>
        </div>`;
    }

    loadProducts();
})();
