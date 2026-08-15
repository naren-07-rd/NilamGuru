/* ==========================================================================
   NILAMGURU — js/uzhavali/fertilizer.js
   REAL backend integration: POST /predict/fertilizer
   Request body EXACTLY:
     { temperature, humidity, moisture, soil_type, crop_type, nitrogen, potassium, phosphorous }
   Response EXACTLY: { recommended_fertilizer }
   soil_type / crop_type are sent as STRINGS — FastAPI's encoder handles them.
   ========================================================================== */
(async function () {
    await mountAppShell("uzhavali", "home");
    // Populate dropdowns from config.js (configurable until encoder categories confirmed)
    const soilSelect = document.getElementById("soil_type");
    const cropSelect = document.getElementById("crop_type");
    soilSelect.innerHTML = SOIL_TYPES.map((s) => `<option value="${s}">${s}</option>`).join("");
    cropSelect.innerHTML = CROP_TYPES.map((c) => `<option value="${c}">${c}</option>`).join("");

    const numericIds = ["temperature", "humidity", "moisture", "nitrogen", "potassium", "phosphorous"];
    const form = document.getElementById("fert-form");
    const formView = document.getElementById("form-view");
    const resultView = document.getElementById("result-view");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const fields = numericIds.map((id) => ({
            el: document.getElementById(id),
            rules: [
                [isRequired, "This field is required."],
                [isValidNumber, "Enter a valid number."]
            ]
        }));
        if (!validateForm(fields)) return;

        const payload = { soil_type: soilSelect.value, crop_type: cropSelect.value };
        numericIds.forEach((id) => (payload[id] = Number(document.getElementById(id).value)));

        const btn = document.getElementById("predict-btn");
        setButtonLoading(btn, "Predicting...");

        try {
            const response = await predictFertilizer(payload);
            const fertilizer = response.recommended_fertilizer;

            logFertilizerPrediction({ inputs: payload, result: fertilizer });

            document.getElementById("result-fert").textContent = fertilizer;
            document.getElementById("result-why-text").textContent = fertilizerReason(fertilizer);
            formView.classList.add("hidden");
            resultView.classList.remove("hidden");
        } catch (err) {
            if (/not supported|unseen label|unknown category/i.test(err.message)) {
                showToast("This value is not supported by the current ML model.", "error");
            } else {
                showToast(err.message, "error");
            }
        } finally {
            resetButton(btn);
        }
    });

    document.getElementById("new-prediction-btn").addEventListener("click", () => {
        form.reset();
        resultView.classList.add("hidden");
        formView.classList.remove("hidden");
    });

    function fertilizerReason(fertilizer) {
        const name = String(fertilizer || "").trim().toLowerCase();
        if (name === "17-17-17") {
            return "17-17-17 is a balanced NPK fertilizer. The NilamGuru model selected it as the best match for the soil, crop and nutrient conditions you entered.";
        }
        if (name.includes("urea")) {
            return "Urea is a nitrogen-rich fertilizer. The NilamGuru model selected it as the best match for the soil, crop and nutrient conditions you entered.";
        }
        return `${fertilizer} was selected by the NilamGuru model as the best fertilizer match for the conditions you entered.`;
    }
})();
