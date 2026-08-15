/* NILAMGURU — js/uzhavali/notifications.js */
(async function () {
    await mountAppShell("uzhavali", "notifications");
    const ROLE = "uzhavali";
    const list = document.getElementById("notif-list");

    async function load() {
        showLoading(list);
        try {
            const { notifications } = await getNotifications(ROLE);
            if (notifications.length === 0) {
                renderEmptyState(list, { icon: "🔔", title: "You're all caught up", message: "No notifications right now." });
                return;
            }
            list.innerHTML = notifications
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .map((n) => `
                <div class="notif-item ${n.read ? "" : "unread"}" data-id="${n.id}">
                    <span class="n-icon">${n.icon}</span>
                    <div>
                        <div>${escapeHtml(n.text)}</div>
                        <div class="n-time">${timeAgo(n.date)}</div>
                    </div>
                </div>`)
                .join("");
            list.querySelectorAll(".notif-item.unread").forEach((el) => {
                el.addEventListener("click", async () => {
                    await markNotificationRead(ROLE, el.dataset.id);
                    el.classList.remove("unread");
                });
            });
        } catch (err) {
            renderErrorState(list, err.message, load);
        }
    }

    document.getElementById("mark-all-btn").addEventListener("click", async () => {
        await markAllNotificationsRead(ROLE);
        showToast("All notifications marked as read.", "success");
        load();
    });

    load();
})();
