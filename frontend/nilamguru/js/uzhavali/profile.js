/* NILAMGURU — js/uzhavali/profile.js */
(async function () {
    await mountAppShell("uzhavali", "profile");
    const content = document.getElementById("content");
    const user = getCurrentUser();

    try {
        const { profile } = await getProfile();
        content.innerHTML = `
            <div class="pending-banner">⚠️ Backend integration pending — profile data is stored locally until profile APIs exist.</div>
            <div class="profile-header">
                <div class="profile-avatar">${initials(user?.name || "Uzhavali")}</div>
                <div>
                    <h2 style="margin-bottom:2px">${escapeHtml(user?.name || "Uzhavali User")}</h2>
                    <p class="text-muted" style="margin:0">${escapeHtml(profile.location)}</p>
                </div>
            </div>

            <div class="card profile-section">
                <h4>Personal Information</h4>
                <div class="profile-row"><span>Phone</span><span>${escapeHtml(profile.phone)}</span></div>
                <div class="profile-row"><span>Email</span><span>${escapeHtml(profile.email)}</span></div>
                <div class="profile-row"><span>Location</span><span>${escapeHtml(profile.location)}</span></div>
            </div>

            <div class="card profile-section">
                <h4>Land Details</h4>
                <div class="profile-row"><span>Details</span><span>${escapeHtml(profile.landDetails)}</span></div>
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
