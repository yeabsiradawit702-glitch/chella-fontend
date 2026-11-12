
import { useEffect, useState } from "react";
import axiosInstance from "../utilit/axiosInstance";
import toast from "react-hot-toast";
import {
  LuBell,
  LuRefreshCw,
  LuCheckCheck,
  LuCheck,
  LuClock,
} from "react-icons/lu";

interface Notification {
  _id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

export default function NotificationTest() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/api/notifications");

      setNotifications(response.data.notifications || []);
      setUnreadCount(response.data.unreadCount || 0);
    } catch (error: any) {
      console.error(error.response?.data || error);
      toast.error("Could not load notifications");
    } finally {
      setLoading(false);
    }
  };

  const createTestNotification = async () => {
    try {
      await axiosInstance.post("/api/notifications/test");
      toast.success("Test notification created!");
      await fetchNotifications();
    } catch (error: any) {
      console.error(error.response?.data || error);
      toast.error("Could not create test notification");
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await axiosInstance.put(`/api/notifications/${id}/read`);
      toast.success("Notification marked as read");
      await fetchNotifications();
    } catch {
      toast.error("Failed to update notification");
    }
  };

  const markAllAsRead = async () => {
    try {
      await axiosInstance.put("/api/notifications/read-all");
      toast.success("All notifications marked as read");
      await fetchNotifications();
    } catch {
      toast.error("Failed to update notifications");
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[#0c0c0c] px-3 py-5 text-white sm:px-5 sm:py-7 md:px-8">
      <div className="mx-auto w-full max-w-4xl">

        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-yellow-400/10 text-yellow-400">
              <LuBell size={23} />
            </div>

            <div className="min-w-0">
              <h1 className="text-xl font-bold sm:text-2xl">
                Notifications
              </h1>
              <p className="text-sm text-gray-400">
                You have {unreadCount} unread notifications
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={fetchNotifications}
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-yellow-400 px-4 py-3 text-sm font-semibold text-black transition hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:py-2.5"
          >
            <LuRefreshCw className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        {/* Action buttons */}
        <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
            className="flex items-center justify-center gap-2 rounded-lg border border-yellow-400 px-4 py-3 text-sm font-semibold text-yellow-400 transition hover:bg-yellow-400 hover:text-black disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-yellow-400"
          >
            <LuCheckCheck size={18} />
            Mark all as read
          </button>

          <button
            type="button"
            onClick={createTestNotification}
            className="flex items-center justify-center gap-2 rounded-lg bg-yellow-400 px-4 py-3 text-sm font-semibold text-black transition hover:bg-yellow-300"
          >
            <LuBell size={18} />
            Create Test Notification
          </button>
        </div>

        {/* Notification count */}
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-semibold sm:text-lg">
            Recent notifications
          </h2>
          <span className="rounded-full bg-[#252525] px-3 py-1 text-xs text-gray-300">
            {notifications.length} total
          </span>
        </div>

        {/* Notification list */}
        {loading && notifications.length === 0 ? (
          <div className="rounded-xl border border-gray-800 bg-[#181818] p-8 text-center text-sm text-gray-400">
            Loading notifications...
          </div>
        ) : notifications.length === 0 ? (
          <div className="rounded-xl border border-gray-800 bg-[#181818] px-4 py-12 text-center">
            <LuBell className="mx-auto mb-3 text-gray-500" size={35} />
            <h3 className="font-semibold text-gray-300">
              No notifications yet
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Your notifications will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification) => (
              <div
                key={notification._id}
                className={`min-w-0 rounded-xl border p-3 transition sm:p-5 ${
                  notification.isRead
                    ? "border-gray-800 bg-[#181818]"
                    : "border-yellow-500/60 bg-[#292510]"
                }`}
              >
                <div className="flex min-w-0 items-start gap-3">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                      notification.isRead
                        ? "bg-gray-700/50 text-gray-400"
                        : "bg-yellow-400/10 text-yellow-400"
                    }`}
                  >
                    <LuBell size={19} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="break-words text-sm font-semibold sm:text-base">
                        {notification.title}
                      </h3>

                      {!notification.isRead && (
                        <span className="shrink-0 rounded-full bg-yellow-400/10 px-2.5 py-1 text-[10px] font-bold text-yellow-400">
                          NEW
                        </span>
                      )}
                    </div>

                    <p className="mt-2 break-words text-sm leading-relaxed text-gray-300">
                      {notification.message}
                    </p>

                    <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <p className="flex items-center gap-1.5 text-xs text-gray-500">
                        <LuClock size={13} />
                        {new Date(notification.createdAt).toLocaleString()}
                      </p>

                      {!notification.isRead && (
                        <button
                          type="button"
                          onClick={() => markAsRead(notification._id)}
                          className="flex min-h-10 w-full items-center justify-center gap-2 rounded-lg border border-yellow-500/40 px-3 py-2 text-xs font-semibold text-yellow-400 transition hover:bg-yellow-400 hover:text-black sm:min-h-0 sm:w-auto"
                        >
                          <LuCheck size={15} />
                          Mark as read
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
