/* NILAMGURU — js/vanigar/enquiries.js
   BACKEND REQUIRED: getEnquiries()/updateEnquiry() run on demo localStorage
   data until real enquiry endpoints exist.
*/
(async function () {
    await mountAppShell("vanigar", "enquiries");

    const list = document.getElementById("enquiries-list");
    const tabRow = document.getElementById("tab-row");
    let activeTab = "all";

    tabRow.addEventListener("click", (e) => {
        const btn = e.target.closest(".chip");
        if (!btn) return;
        activeTab = btn.dataset.tab;
        tabRow.querySelectorAll(".chip").forEach((c) => c.classList.toggle("active", c === btn));
        load();
    });

    async function load() {
        showLoading(list);
        try {
            const { enquiries } = await getEnquiries({ status: activeTab });
            if (enquiries.length === 0) {
                renderEmptyState(list, { icon: "📩", title: "No enquiries here", message: "New enquiries from farmers will show up in this tab." });
                return;
            }
            list.innerHTML = enquiries.map((e) => `
                <div class="card" style="margin-bottom:12px">
                    <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:8px">
                        <div>
                            <strong>${escapeHtml(e.farmer)}</strong>
                            <p class="text-muted" style="margin:2px 0">${escapeHtml(e.productName)} · Qty ${e.quantity}</p>
                            ${e.message ? `<p style="margin:0">${escapeHtml(e.message)}</p>` : ""}
                            <span class="text-muted" style="font-size:0.78rem">${timeAgo(e.date)}</span>
                        </div>
                        <span class="pill ${e.status === "closed" ? "pill-muted" : e.status === "contacted" ? "pill-info" : "pill-success"}">${e.status}</span>
                    </div>
                    <div style="display:flex;gap:8px;margin-top:12px">
                        <a href="enquiry-details.html?id=${e.id}" class="btn btn-secondary btn-sm">View Details</a>
                        ${e.status !== "closed" ? `<button class="btn btn-ghost btn-sm close-btn" data-id="${e.id}">Close Enquiry</button>` : ""}
                    </div>
                </div>
            `).join("");

            list.querySelectorAll(".close-btn").forEach((btn) => {
                btn.addEventListener("click", async () => {
                    await updateEnquiry(btn.dataset.id, { status: "closed" });
                    showToast("Enquiry closed.", "success");
                    load();
                });
            });
        } catch (err) {
            renderErrorState(list, err.message, load);
        }
    }

    load();
})();
