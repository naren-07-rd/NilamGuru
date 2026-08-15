/* NILAMGURU — js/vanigar/edit-listing.js
   BACKEND REQUIRED: updateProduct()/deleteProduct() run on demo localStorage
   data until real listing endpoints exist.
*/
(async function () {
    await mountAppShell("vanigar", "listings");

    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    const content = document.getElementById("content");

    if (!id) {
        renderEmptyState(content, { icon: "📦", title: "No listing selected", message: "Go back to My Listings and choose one to edit." });
        return;
    }

    let product;
    try {
        const res = await getProduct(id);
        product = res.product;
    } catch (err) {
        renderErrorState(content, err.message);
        return;
    }

    content.innerHTML = `
        <h2>Edit Listing</h2>
        <div class="pending-banner">⚠️ Backend integration pending — changes are saved locally until listing APIs exist.</div>
        <form id="edit-form" class="card" novalidate>
            <div class="form-group">
                <label class="form-label" for="name">Product Name</label>
                <input class="form-control" type="text" id="name" value="${escapeHtml(product.name)}" />
            </div>
            <div class="ml-grid">
                <div class="form-group">
                    <label class="form-label" for="category">Category</label>
                    <select class="form-control" id="category">
                        ${PRODUCT_CATEGORIES.map((c) => `<option value="${c.id}" ${c.id === product.category ? "selected" : ""}>${c.icon} ${c.label}</option>`).join("")}
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label" for="unit">Unit</label>
                    <input class="form-control" type="text" id="unit" value="${escapeHtml(product.unit)}" />
                </div>
                <div class="form-group">
                    <label class="form-label" for="price">Price (₹)</label>
                    <input class="form-control" type="number" id="price" value="${product.price}" min="0" />
                </div>
                <div class="form-group">
                    <label class="form-label" for="stock">Stock Quantity</label>
                    <input class="form-control" type="number" id="stock" value="${product.stock}" min="0" />
                </div>
            </div>
            <div class="form-group">
                <label class="form-label" for="status">Status</label>
                <select class="form-control" id="status">
                    <option value="active" ${product.status !== "inactive" && product.status !== "sold_out" ? "selected" : ""}>Active</option>
                    <option value="inactive" ${product.status === "inactive" ? "selected" : ""}>Inactive</option>
                    <option value="sold_out" ${product.status === "sold_out" ? "selected" : ""}>Sold Out</option>
                </select>
            </div>
            <div class="form-group">
                <label class="form-label" for="description">Description</label>
                <textarea class="form-control" id="description" rows="4">${escapeHtml(product.description || "")}</textarea>
            </div>
            <div style="display:flex;gap:10px">
                <button type="submit" class="btn btn-primary btn-block" id="update-btn">Update Listing</button>
                <button type="button" class="btn btn-danger" id="delete-btn">Delete Listing</button>
            </div>
        </form>
    `;

    document.getElementById("edit-form").addEventListener("submit", async (e) => {
        e.preventDefault();
        const nameEl = document.getElementById("name");
        const unitEl = document.getElementById("unit");
        const priceEl = document.getElementById("price");
        const stockEl = document.getElementById("stock");

        const valid = validateForm([
            { el: nameEl, rules: [[isRequired, "Product name is required."]] },
            { el: unitEl, rules: [[isRequired, "Unit is required."]] },
            { el: priceEl, rules: [[isRequired, "Price is required."], [(v) => Number(v) >= 0, "Enter a valid price."]] },
            { el: stockEl, rules: [[isRequired, "Stock quantity is required."], [(v) => Number(v) >= 0, "Enter a valid quantity."]] }
        ]);
        if (!valid) return;

        const btn = document.getElementById("update-btn");
        setButtonLoading(btn, "Updating...");
        try {
            await updateProduct(id, {
                name: nameEl.value.trim(),
                category: document.getElementById("category").value,
                unit: unitEl.value.trim(),
                price: Number(priceEl.value),
                stock: Number(stockEl.value),
                status: document.getElementById("status").value,
                description: document.getElementById("description").value.trim()
            });
            showToast("Listing updated.", "success");
            setTimeout(() => (window.location.href = "listings.html"), 500);
        } catch (err) {
            showToast(err.message, "error");
        } finally {
            resetButton(btn);
        }
    });

    document.getElementById("delete-btn").addEventListener("click", async () => {
        if (!confirm(`Delete "${product.name}"? This can't be undone.`)) return;
        try {
            await deleteProduct(id);
            showToast("Listing deleted.", "success");
            setTimeout(() => (window.location.href = "listings.html"), 500);
        } catch (err) {
            showToast(err.message, "error");
        }
    });
})();
