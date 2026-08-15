/* NILAMGURU — js/vanigar/enquiry-details.js
   BACKEND REQUIRED: reply/close run on demo localStorage data until real
   enquiry endpoints exist.
*/
(async function () {
    await mountAppShell("vanigar", "enquiries");

    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    const content = document.getElementById("content");

    if (!id) {
        renderEmptyState(content, { icon: "📩", title: "No enquiry selected", message: "Go back to Enquiries and pick one." });
        return;
    }

    let enquiry;
    try {
        const { enquiries } = await getEnquiries();
        enquiry = enquiries.find((e) => e.id === id);
        if (!enquiry) throw new Error("Enquiry not found.");
    } catch (err) {
        renderErrorState(content, err.message);
        return;
    }

    render();

    function render() {
        content.innerHTML = `
            <h2>Enquiry Details</h2>
            <div class="pending-banner">⚠️ Backend integration pending — replies are stored locally until enquiry APIs exist.</div>
            <div class="card profile-section">
                <div class="profile-row"><span>Farmer</span><span>${escapeHtml(enquiry.farmer)}</span></div>
                <div class="profile-row"><span>Phone</span><span>Not available (demo)</span></div>
                <div class="profile-row"><span>Product</span><span>${escapeHtml(enquiry.productName)}</span></div>
                <div class="profile-row"><span>Quantity</span><span>${enquiry.quantity}</span></div>
                <div class="profile-row"><span>Date</span><span>${formatDate(enquiry.date)}</span></div>
                <div class="profile-row"><span>Status</span><span class="pill ${enquiry.status === "closed" ? "pill-muted" : enquiry.status === "contacted" ? "pill-info" : "pill-success"}">${enquiry.status}</span></div>
            </div>
            ${enquiry.message ? `<div class="card" style="margin-bottom:18px"><strong>Farmer's message</strong><p style="margin:6px 0 0">${escapeHtml(enquiry.message)}</p></div>` : ""}

            <form id="reply-form" class="card">
                <div class="form-group">
                    <label class="form-label" for="reply">Response</label>
                    <textarea class="form-control" id="reply" rows="4" placeholder="Type your reply to the farmer...">${escapeHtml(enquiry.reply || "")}</textarea>
                </div>
                <div style="display:flex;gap:10px">
                    <button type="submit" class="btn btn-primary btn-block" id="reply-btn">Reply Now</button>
                    ${enquiry.status !== "closed" ? '<button type="button" class="btn btn-secondary" id="close-btn">Close</button>' : ""}
                </div>
            </form>
        `;

        document.getElementById("reply-form").addEventListener("submit", async (e) => {
            e.preventDefault();
            const replyEl = document.getElementById("reply");
            const btn = document.getElementById("reply-btn");
            setButtonLoading(btn, "Sending...");
            try {
                await updateEnquiry(id, { reply: replyEl.value.trim(), status: "contacted" });
                enquiry.status = "contacted";
                showToast("Reply sent to farmer.", "success");
                render();
            } catch (err) {
                showToast(err.message, "error");
            } finally {
                resetButton(btn);
            }
        });

        const closeBtn = document.getElementById("close-btn");
        if (closeBtn) {
            closeBtn.addEventListener("click", async () => {
                await updateEnquiry(id, { status: "closed" });
                enquiry.status = "closed";
                showToast("Enquiry closed.", "success");
                render();
            });
        }
    }
})();
