/* NILAMGURU — js/vanigar/profile.js */
(async function () {
    await mountAppShell("vanigar", "profile");
    const content = document.getElementById("content");
    const user = getCurrentUser();

    try {
        const { profile } = await getProfile();
        content.innerHTML = `
            <div class="pending-banner">⚠️ Backend integration pending — profile data is stored locally until profile APIs exist.</div>
            <div class="profile-header">
                <div class="profile-avatar">${initials(profile.businessName || "Vanigar")}</div>
                <div>
                    <h2 style="margin-bottom:2px">${escapeHtml(profile.businessName || "My Shop")}</h2>
                    <p class="text-muted" style="margin:0">Owner: ${escapeHtml(user?.name || "—")}</p>
                </div>
            </div>

            <div class="card profile-section">
                <h4>Business Information</h4>
                <div class="profile-row"><span>Business Name</span><span>${escapeHtml(profile.businessName)}</span></div>
                <div class="profile-row"><span>Owner Name</span><span>${escapeHtml(user?.name || "—")}</span></div>
                <div class="profile-row"><span>Phone</span><span>${escapeHtml(profile.phone)}</span></div>
                <div class="profile-row"><span>Email</span><span>${escapeHtml(profile.email)}</span></div>
                <div class="profile-row"><span>Location</span><span>${escapeHtml(profile.location)}</span></div>
            </div>

            <div class="card profile-section">
                <h4>Bank Details</h4>
                <div class="profile-row"><span>Account</span><span>${escapeHtml(profile.bankDetails)}</span></div>
            </div>

            <div class="grid grid-2">
                <a href="edit-profile.html" class="btn btn-primary btn-block">Edit Profile</a>
                <button class="btn btn-secondary btn-block" id="logout-btn">Logout</button>
            </div>
        `;
        document.getElementById("logout-btn").addEventListener("click", logoutUser);
    } catch (err) {
        renderErrorState(content, err.message);
    }
})();
