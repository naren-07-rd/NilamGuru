/* NILAMGURU — js/vanigar/edit-profile.js */
(async function () {
    await mountAppShell("vanigar", "profile");
    const user = getCurrentUser();

    try {
        const { profile } = await getProfile();
        document.getElementById("ownerName").value = user?.name || "";
        document.getElementById("businessName").value = profile.businessName || "";
        document.getElementById("phone").value = profile.phone || "";
        document.getElementById("email").value = profile.email || "";
        document.getElementById("location").value = profile.location || "";
        document.getElementById("bankDetails").value = profile.bankDetails || "";
    } catch (err) {
        showToast(err.message, "error");
    }

    document.getElementById("edit-form").addEventListener("submit", async (e) => {
        e.preventDefault();
        const ownerEl = document.getElementById("ownerName");
        const businessEl = document.getElementById("businessName");
        const emailEl = document.getElementById("email");
        const phoneEl = document.getElementById("phone");

        const valid = validateForm([
            { el: ownerEl, rules: [[isRequired, "Owner name is required."]] },
            { el: businessEl, rules: [[isRequired, "Business name is required."]] },
            { el: phoneEl, rules: [[isRequired, "Phone is required."], [isValidPhone, "Enter a valid 10-digit phone."]] },
            { el: emailEl, rules: [[isRequired, "Email is required."], [isValidEmail, "Enter a valid email."]] }
        ]);
        if (!valid) return;

        const btn = document.getElementById("save-btn");
        setButtonLoading(btn, "Saving...");
        try {
            await updateProfile({
                businessName: businessEl.value.trim(),
                phone: phoneEl.value.trim(),
                email: emailEl.value.trim(),
                location: document.getElementById("location").value.trim(),
                bankDetails: document.getElementById("bankDetails").value.trim()
            });
            const updatedUser = { ...user, name: ownerEl.value.trim() };
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
