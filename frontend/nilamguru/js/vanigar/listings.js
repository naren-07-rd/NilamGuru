/* NILAMGURU — js/vanigar/listings.js
   BACKEND REQUIRED: getProducts()/deleteProduct() run on demo localStorage
   data until real listings endpoints exist.
*/
(async function () {
    await mountAppShell("vanigar", "listings");

    const tableBody = document.getElementById("listings-table-body");
    const cards = document.getElementById("listings-cards");
    const tabRow = document.getElementById("tab-row");
    let activeTab = "all";
    let allProducts = [];
    let deleteTargetId = null;

    tabRow.addEventListener("click", (e) => {
        const btn = e.target.closest(".chip");
        if (!btn) return;
        activeTab = btn.dataset.tab;
        tabRow.querySelectorAll(".chip").forEach((c) => c.classList.toggle("active", c === btn));
        render();
    });

    async function load() {
        showLoading(tableBody.closest(".data-table-wrap") || cards);
        try {
            const { products } = await getProducts();
            allProducts = products.map((p) => ({ ...p, status: p.status || "active" }));
            render();
        } catch (err) {
            renderErrorState(cards, err.message, load);
        }
    }

    function render() {
        const filtered = activeTab === "all" ? allProducts : allProducts.filter((p) => p.status === activeTab);

        if (filtered.length === 0) {
            tableBody.innerHTML = "";
            renderEmptyState(cards, { icon: "📦", title: "No listings found", message: "Try a different tab or add a new listing." });
            return;
        }

        tableBody.innerHTML = filtered.map(rowHtml).join("");
        cards.innerHTML = filtered.map(cardHtml).join("");
        attachActions();
    }

    function statusPill(status) {
        const map = { active: "pill-success", inactive: "pill-muted", sold_out: "pill-danger" };
        return `<span class="pill ${map[status] || "pill-muted"}">${status.replace("_", " ")}</span>`;
    }

    function rowHtml(p) {
        return `
        <tr data-id="${p.id}">
            <td>${p.icon} ${escapeHtml(p.name)}</td>
            <td>${formatCurrency(p.price)}</td>
            <td>${p.stock}</td>
            <td>${statusPill(p.status)}</td>
            <td style="display:flex;gap:8px">
                <a href="edit-listing.html?id=${p.id}" class="btn btn-secondary btn-sm">Edit</a>
                <a href="../uzhavali/product-details.html?id=${p.id}" class="btn btn-ghost btn-sm">View</a>
                <button class="btn btn-danger btn-sm delete-btn" data-id="${p.id}" data-name="${escapeHtml(p.name)}">Delete</button>
            </td>
        </tr>`;
    }

    function cardHtml(p) {
        return `
        <div class="card list-row-card" data-id="${p.id}">
            <div class="thumb-sm">${p.icon}</div>
            <div class="info">
                <h4>${escapeHtml(p.name)}</h4>
                <div class="text-muted" style="font-size:0.82rem">${formatCurrency(p.price)} · Stock ${p.stock}</div>
                ${statusPill(p.status)}
            </div>
            <div style="display:flex;flex-direction:column;gap:6px">
                <a href="edit-listing.html?id=${p.id}" class="btn btn-secondary btn-sm">Edit</a>
                <button class="btn btn-danger btn-sm delete-btn" data-id="${p.id}" data-name="${escapeHtml(p.name)}">Delete</button>
            </div>
        </div>`;
    }

    function attachActions() {
        document.querySelectorAll(".delete-btn").forEach((btn) => {
            btn.addEventListener("click", () => {
                deleteTargetId = btn.dataset.id;
                document.getElementById("delete-target-name").textContent = btn.dataset.name;
                document.getElementById("delete-modal").classList.add("open");
            });
        });
    }

    function closeDeleteModal() {
        document.getElementById("delete-modal").classList.remove("open");
        deleteTargetId = null;
    }
    document.getElementById("close-delete-modal").addEventListener("click", closeDeleteModal);
    document.getElementById("cancel-delete").addEventListener("click", closeDeleteModal);
    document.getElementById("confirm-delete").addEventListener("click", async () => {
        if (!deleteTargetId) return;
        try {
            await deleteProduct(deleteTargetId);
            showToast("Listing deleted.", "success");
            closeDeleteModal();
            load();
        } catch (err) {
            showToast(err.message, "error");
        }
    });

    load();
})();
