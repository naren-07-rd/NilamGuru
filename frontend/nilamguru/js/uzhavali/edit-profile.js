/* NILAMGURU — js/uzhavali/edit-profile.js */
(async function () {
    await mountAppShell("uzhavali", "profile");
    const user = getCurrentUser();

    try {
        const { profile } = await getProfile();
        document.getElementById("name").value = user?.name || "";
        document.getElementById("phone").value = profile.phone || "";
        document.getElementById("email").value = profile.email || "";
        document.getElementById("location").value = profile.location || "";
        document.getElementById("landDetails").value = profile.landDetails || "";
    } catch (err) {
        showToast(err.message, "error");
    }

    document.getElementById("edit-form").addEventListener("submit", async (e) => {
        e.preventDefault();
        const nameEl = document.getElementById("name");
        const emailEl = document.getElementById("email");
        const phoneEl = document.getElementById("phone");

        const valid = validateForm([
            { el: nameEl, rules: [[isRequired, "Name is required."]] },
            { el: phoneEl, rules: [[isRequired, "Phone is required."], [isValidPhone, "Enter a valid 10-digit phone."]] },
            { el: emailEl, rules: [[isRequired, "Email is required."], [isValidEmail, "Enter a valid email."]] }
        ]);
        if (!valid) return;

        const btn = document.getElementById("save-btn");
        setButtonLoading(btn, "Saving...");
        try {
            await updateProfile({
                phone: phoneEl.value.trim(),
                email: emailEl.value.trim(),
                location: document.getElementById("location").value.trim(),
                landDetails: document.getElementById("landDetails").value.trim()
            });
            const updatedUser = { ...user, name: nameEl.value.trim() };
            saveSession(updatedUser);
            showToast("Profile updated.", "success");
            setTimeout(() => (window.location.href = "profile.html"), 500);
        } catch (err) {
            showToast(err.message, "error");
        } finally {
            resetButton(btn);
        }
    });
})();
