/* NILAMGURU — js/vanigar/add-listing.js
   BACKEND REQUIRED: createProduct() saves to localStorage until a real
   FastAPI listings endpoint exists.
*/
(async function () {
    await mountAppShell("vanigar", "listings");

    const categorySelect = document.getElementById("category");
    categorySelect.innerHTML = PRODUCT_CATEGORIES.map((c) => `<option value="${c.id}">${c.icon} ${c.label}</option>`).join("");

    const imageInput = document.getElementById("image-input");
    const uploadBox = document.getElementById("upload-box");
    let chosenIcon = null;
    imageInput.addEventListener("change", () => {
        if (imageInput.files[0]) {
            uploadBox.innerHTML = `✅ ${escapeHtml(imageInput.files[0].name)} selected<br><span class="text-muted" style="font-size:0.78rem">Image upload requires backend file storage — the emoji icon for the chosen category is used as the display image in demo mode.</span>`;
        }
    });

    document.getElementById("listing-form").addEventListener("submit", async (e) => {
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

        const category = categorySelect.value;
        const catMeta = PRODUCT_CATEGORIES.find((c) => c.id === category);
        const user = getCurrentUser();

        const btn = document.getElementById("publish-btn");
        setButtonLoading(btn, "Publishing...");
        try {
            await createProduct({
                name: nameEl.value.trim(),
                category,
                icon: catMeta?.icon || "🛒",
                unit: unitEl.value.trim(),
                price: Number(priceEl.value),
                stock: Number(stockEl.value),
                description: document.getElementById("description").value.trim(),
                seller: user?.name || "My Shop",
                location: "Not set",
                rating: 0
            });
            showToast("Listing published!", "success");
            setTimeout(() => (window.location.href = "listings.html"), 500);
        } catch (err) {
            showToast(err.message, "error");
        } finally {
            resetButton(btn);
        }
    });
})();
