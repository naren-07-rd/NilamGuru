/* ==========================================================================
   NILAMGURU — js/uzhavali/crop.js
   REAL backend integration: POST /predict/crop
   Request body EXACTLY: { N, P, K, temperature, humidity, ph, rainfall }
   Response EXACTLY: { recommended_crop }
   ========================================================================== */
(async function () {
    await mountAppShell("uzhavali", "home");
    const fieldIds = ["N", "P", "K", "temperature", "humidity", "ph", "rainfall"];
    const form = document.getElementById("crop-form");
    const formView = document.getElementById("form-view");
    const resultView = document.getElementById("result-view");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const fields = fieldIds.map((id) => ({
            el: document.getElementById(id),
            rules: [
                [isRequired, "This field is required."],
                [isValidNumber, "Enter a valid number."]
            ]
        }));
        if (!validateForm(fields)) return;

        const payload = {};
        fieldIds.forEach((id) => (payload[id] = Number(document.getElementById(id).value)));

        const btn = document.getElementById("predict-btn");
        setButtonLoading(btn, "Predicting...");

        try {
            const response = await predictCrop(payload);
            const crop = response.recommended_crop;

            logCropPrediction({ inputs: payload, result: crop });

            document.getElementById("result-crop").textContent = crop;
            document.getElementById("result-why-text").textContent = cropReason(crop);
            formView.classList.add("hidden");
            resultView.classList.remove("hidden");
        } catch (err) {
            showToast(err.message, "error");
        } finally {
            resetButton(btn);
        }
    });

    document.getElementById("new-prediction-btn").addEventListener("click", () => {
        form.reset();
        resultView.classList.add("hidden");
        formView.classList.remove("hidden");
    });

    function cropReason(crop) {
        const key = String(crop || "").trim().toLowerCase();
        const reasons = {
            rice: "Rice is the best match predicted by your NilamGuru model. Its learned pattern is commonly associated with warm, humid and water-available growing conditions.",
            maize: "Maize is the best match predicted by your NilamGuru model. It generally performs well in warm conditions with adequate moisture and balanced soil nutrients.",
            wheat: "Wheat is the best match predicted by your NilamGuru model. It generally suits cooler growing conditions with suitable soil moisture and nutrient availability.",
            cotton: "Cotton is the best match predicted by your NilamGuru model. It generally suits warm conditions with suitable moisture and soil conditions.",
            sugarcane: "Sugarcane is the best match predicted by your NilamGuru model. It generally prefers warm conditions with good water availability and fertile soil.",
            barley: "Barley is the best match predicted by your NilamGuru model. It generally suits relatively cooler conditions with suitable soil moisture.",
            millets: "Millets are the best match predicted by your NilamGuru model. They are generally suited to warm conditions and can perform well with comparatively lower water availability.",
            groundnut: "Groundnut is the best match predicted by your NilamGuru model. It generally prefers warm conditions and well-drained soil with suitable moisture.",
            pulses: "Pulses are the best match predicted by your NilamGuru model. They generally perform well under moderate moisture conditions with suitable soil nutrients.",
            "oil seeds": "Oil seeds are the best match predicted by your NilamGuru model. They generally require suitable temperature, moisture and soil nutrient conditions."
        };
        return reasons[key] || `The NilamGuru model selected ${crop} as the best match for the combination of farm conditions you entered.`;
    }
})();
