/* NILAMGURU — js/uzhavali/home.js */
(async function () {
    await mountAppShell("uzhavali", "home");
    const user = getCurrentUser();
    const hour = new Date().getHours();
    const timeGreeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
    document.getElementById("greeting-text").textContent = `${timeGreeting}, ${user?.name?.split(" ")[0] || "Uzhavali"} 👨‍🌾`;
    mountBackendStatus();
})();
