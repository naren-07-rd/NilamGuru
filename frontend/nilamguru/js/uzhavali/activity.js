/* NILAMGURU — js/uzhavali/activity.js */
(async function () {
    await mountAppShell("uzhavali", "activity");

    const cropEl = document.getElementById("crop-timeline");
    const fertEl = document.getElementById("fert-timeline");
    const enqEl = document.getElementById("enquiry-timeline");

    try {
        const { cropPredictions, fertilizerPredictions, enquiries } = await getActivity();

        cropPredictions.length
            ? (cropEl.innerHTML = cropPredictions.map((c) => `
                <div class="timeline-item">
                    <div class="t-time">${timeAgo(c.date)}</div>
                    <strong>🌾 Recommended: ${escapeHtml(c.result)}</strong>
                    <p class="text-muted" style="margin:2px 0 0">N:${c.inputs.N} P:${c.inputs.P} K:${c.inputs.K} · pH ${c.inputs.ph}</p>
                </div>`).join(""))
            : renderEmptyState(cropEl, { icon: "🌾", title: "No crop predictions yet", message: "Try the Crop Recommendation tool from Home." });

        fertilizerPredictions.length
            ? (fertEl.innerHTML = fertilizerPredictions.map((f) => `
                <div class="timeline-item">
                    <div class="t-time">${timeAgo(f.date)}</div>
                    <strong>🧪 Recommended: ${escapeHtml(f.result)}</strong>
                    <p class="text-muted" style="margin:2px 0 0">${escapeHtml(f.inputs.soil_type)} soil · ${escapeHtml(f.inputs.crop_type)}</p>
                </div>`).join(""))
            : renderEmptyState(fertEl, { icon: "🧪", title: "No fertilizer predictions yet", message: "Try the Fertilizer Recommendation tool from Home." });

        enquiries.length
            ? (enqEl.innerHTML = enquiries.map((e) => `
                <div class="timeline-item">
                    <div class="t-time">${timeAgo(e.date)}</div>
                    <strong>🛒 Enquiry: ${escapeHtml(e.productName)}</strong>
                    <p class="text-muted" style="margin:2px 0 0">Qty ${e.quantity} · <span class="pill pill-muted">${e.status}</span></p>
                </div>`).join(""))
            : renderEmptyState(enqEl, { icon: "🛒", title: "No enquiries yet", message: "Enquiries you send in the marketplace will appear here." });
    } catch (err) {
        showToast(err.message, "error");
    }
})();
