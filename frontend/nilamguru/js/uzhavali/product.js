/* ==========================================================================
   NILAMGURU — js/uzhavali/product.js
   BACKEND REQUIRED: getProduct()/sendEnquiry() run on demo localStorage
   data until real marketplace/enquiry endpoints exist.
   ========================================================================== */
(async function () {
    await mountAppShell("uzhavali", "marketplace");

    const params = new URLSearchParams(window.location.search);
    const productId = params.get("id");
    const content = document.getElementById("content");
    let product = null;
    let qty = 1;

    if (!productId) {
        renderEmptyState(content, { icon: "🛒", title: "No product selected", message: "Go back to the marketplace and choose a product." });
        return;
    }

    try {
        const res = await getProduct(productId);
        product = res.product;
        render();
    } catch (err) {
        renderErrorState(content, err.message);
        return;
    }

    if (window.location.hash === "#enquire") openModal();

    function render() {
        content.innerHTML = `
            <div class="pd-grid">
                <div class="pd-image">${product.icon}</div>
                <div>
                    <span class="pill pill-muted">${escapeHtml(product.category)}</span>
                    <h2 style="margin-top:10px">${escapeHtml(product.name)}</h2>
                    <div class="rating" style="margin-bottom:10px">⭐ ${product.rating} rating</div>
                    <div style="font-family:var(--font-display);font-size:1.6rem;font-weight:800;color:var(--primary-green)">
                        ${formatCurrency(product.price)} <span style="font-size:0.9rem;color:var(--text-faint);font-weight:500">/ ${escapeHtml(product.unit)}</span>
                    </div>
                    <p class="text-muted" style="margin:14px 0">${escapeHtml(product.description || "")}</p>
                    <div class="profile-section">
                        <div class="profile-row"><span>Seller</span><span>${escapeHtml(product.seller)}</span></div>
                        <div class="profile-row"><span>Location</span><span>${escapeHtml(product.location)}</span></div>
                        <div class="profile-row"><span>Stock</span><span>${product.stock} ${escapeHtml(product.unit)}(s) available</span></div>
                    </div>
                    <div class="pd-qty-row">
                        <span class="form-label" style="margin:0">Quantity</span>
                        <div class="qty-stepper">
                            <button type="button" id="qty-minus">−</button>
                            <span id="qty-value">1</span>
                            <button type="button" id="qty-plus">+</button>
                        </div>
                    </div>
                    <div style="display:flex;gap:12px;flex-wrap:wrap">
                        <button class="btn btn-primary" id="buy-now-btn">Buy Now</button>
                        <button class="btn btn-secondary" id="enquire-btn">💬 Chat / Enquire</button>
                    </div>
                </div>
            </div>
        `;

        document.getElementById("qty-minus").addEventListener("click", () => updateQty(-1));
        document.getElementById("qty-plus").addEventListener("click", () => updateQty(1));
        document.getElementById("enquire-btn").addEventListener("click", openModal);
        document.getElementById("buy-now-btn").addEventListener("click", () => {
            showToast("Checkout requires a payments backend — not available yet.", "info");
        });
    }

    function updateQty(delta) {
        qty = Math.max(1, Math.min(product.stock, qty + delta));
        document.getElementById("qty-value").textContent = qty;
        document.getElementById("enquiry-qty").value = qty;
    }

    function openModal() {
        document.getElementById("enquiry-qty").value = qty;
        document.getElementById("enquiry-modal").classList.add("open");
    }
    function closeModal() {
        document.getElementById("enquiry-modal").classList.remove("open");
    }

    document.getElementById("close-modal").addEventListener("click", closeModal);
    document.getElementById("enquiry-modal").addEventListener("click", (e) => {
        if (e.target.id === "enquiry-modal") closeModal();
    });

    document.getElementById("enquiry-form").addEventListener("submit", async (e) => {
        e.preventDefault();
        const qtyEl = document.getElementById("enquiry-qty");
        const valid = validateForm([{ el: qtyEl, rules: [[isRequired, "Quantity is required."], [(v) => Number(v) > 0, "Enter a valid quantity."]] }]);
        if (!valid) return;

        const btn = document.getElementById("send-enquiry-btn");
        setButtonLoading(btn, "Sending...");
        try {
            await sendEnquiry({
                productId: product.id,
                productName: product.name,
                quantity: Number(qtyEl.value),
                message: document.getElementById("enquiry-message").value.trim()
            });
            closeModal();
            showToast("✓ Enquiry Sent! Your enquiry has been sent to the seller.", "success");
            document.getElementById("enquiry-form").reset();
        } catch (err) {
            showToast(err.message, "error");
        } finally {
            resetButton(btn);
        }
    });
})();
