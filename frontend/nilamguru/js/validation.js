/* ==========================================================================
   NILAMGURU — validation.js
   Reusable field validators + helpers to show/clear field errors.
   ========================================================================== */

function showFieldError(inputEl, message) {
    if (!inputEl) return;
    inputEl.classList.add("invalid");
    const group = inputEl.closest(".form-group");
    if (!group) return;
    let err = group.querySelector(".field-error");
    if (!err) {
        err = document.createElement("div");
        err.className = "field-error";
        group.appendChild(err);
    }
    err.textContent = message;
    err.classList.add("show");
}

function clearFieldError(inputEl) {
    if (!inputEl) return;
    inputEl.classList.remove("invalid");
    const group = inputEl.closest(".form-group");
    const err = group && group.querySelector(".field-error");
    if (err) err.classList.remove("show");
}

function isRequired(value) {
    return value !== null && value !== undefined && String(value).trim().length > 0;
}

function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isValidPhone(value) {
    return /^[0-9]{10}$/.test(value.replace(/\D/g, ""));
}

function isEmailOrPhone(value) {
    return isValidEmail(value) || isValidPhone(value);
}

function isValidNumber(value) {
    return value !== "" && !Number.isNaN(Number(value));
}

function isNumberInRange(value, min, max) {
    const n = Number(value);
    return isValidNumber(value) && n >= min && n <= max;
}

function passwordStrength(value) {
    if (value.length < 6) return "weak";
    const hasUpper = /[A-Z]/.test(value);
    const hasNumber = /[0-9]/.test(value);
    const hasSpecial = /[^A-Za-z0-9]/.test(value);
    const score = [hasUpper, hasNumber, hasSpecial].filter(Boolean).length;
    if (value.length >= 8 && score >= 2) return "strong";
    if (value.length >= 6) return "medium";
    return "weak";
}

/**
 * Validates a set of {element, rules} pairs.
 * rules: array of [testFn, message]
 * Returns true if the whole form is valid.
 */
function validateForm(fields) {
    let valid = true;
    fields.forEach(({ el, rules }) => {
        clearFieldError(el);
        for (const [test, message] of rules) {
            if (!test(el.value)) {
                showFieldError(el, message);
                valid = false;
                break;
            }
        }
    });
    return valid;
}
