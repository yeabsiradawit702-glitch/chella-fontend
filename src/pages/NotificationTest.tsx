
import { useEffect, useState } from "react";
import axios from "axios";
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

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      setLoading(true);

      const response = await axiosInstance.get("/api/notifications");

      setNotifications(response.data.notifications || []);
      setUnreadCount(response.data.unreadCount || 0);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error(error.response?.data || error.message);
      } else {
        console.error(error);
      }

      toast.error("Could not load notifications");
    } finally {
      setLoading(false);
    }
  };

  // Create test notification
  const createTestNotification = async () => {
    try {
      await axiosInstance.post("/api/notifications/test");

      toast.success("Test notification created!");
      await fetchNotifications();
    } catch (error: unknown) {
      console.error(error);
      toast.error("Could not create test notification");
    }
  };

  // Mark one notification as read
  const markAsRead = async (id: string) => {
    try {
      await axiosInstance.put(`/api/notifications/${id}/read`);

      toast.success("Notification marked as read");
      await fetchNotifications();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update notification");
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      await axiosInstance.put("/api/notifications/read-all");

      toast.success("All notifications marked as read");
      await fetchNotifications();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update notifications");
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <div className="w-full max-w-full overflow-x-hidden px-2 py-3 text-white sm:px-4 md:px-6">

      <div className="mx-auto w-full max-w-4xl">

        {/* Header */}
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-yellow-400/10 text-yellow-400">
              <LuBell size={19} />
            </div>

            <div>
              <h1 className="text-lg font-bold sm:text-xl">
                Notifications
              </h1>

              <p className="text-xs text-gray-400">
                {unreadCount} unread notifications
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={fetchNotifications}
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-yellow-400 px-3 py-2 text-xs font-semibold text-black transition hover:bg-yellow-300 disabled:opacity-50 sm:w-auto"
          >
            <LuRefreshCw
              size={15}
              className={loading ? "animate-spin" : ""}
            />
            Refresh
          </button>
        </div>

        {/* Action Buttons */}
        <div className="mb-4 grid grid-cols-1 gap-2 sm:grid-cols-1">

          <button
            type="button"
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
            className="flex items-center justify-center gap-2 rounded-lg border border-yellow-400 px-3 py-2.5 text-xs font-semibold text-yellow-400 transition hover:bg-yellow-400 hover:text-black disabled:cursor-not-allowed disabled:opacity-40"
          >
            <LuCheckCheck size={15} />
            Mark all as read
          </button>

          <button
            type="button"
            onClick={createTestNotification}
            className="flex items-center justify-center gap-2 rounded-lg bg-yellow-400 px-3 py-2.5 text-xs font-semibold text-black transition hover:bg-yellow-300"
          >
            <LuBell size={15} />
            Create Test Notification
          </button>

        </div>

        {/* Notification List Heading */}
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-sm font-semibold">
            Recent notifications
          </h2>

          <span className="rounded-full bg-[#252525] px-2 py-1 text-[10px] text-gray-400">
            {notifications.length} total
          </span>
        </div>

        {/* Loading */}
        {loading && notifications.length === 0 ? (
          <div className="rounded-lg border border-gray-800 bg-[#181818] p-5 text-center text-xs text-gray-400">
            Loading notifications...
          </div>
        ) : notifications.length === 0 ? (

          /* Empty State */
          <div className="rounded-lg border border-gray-800 bg-[#181818] px-3 py-7 text-center">
            <LuBell
              className="mx-auto mb-2 text-gray-500"
              size={27}
            />

            <h3 className="text-sm font-semibold text-gray-300">
              No notifications yet
            </h3>

            <p className="mt-1 text-xs text-gray-500">
              Your notifications will appear here.
            </p>
          </div>

        ) : (

          /* Notification Cards */
          <div className="space-y-2">

            {notifications.map((notification) => (

              <div
                key={notification._id}
                className={`w-full min-w-0 rounded-lg border p-2.5 sm:p-3 md:p-4 ${
                  notification.isRead
                    ? "border-gray-800 bg-[#181818]"
                    : "border-yellow-500/60 bg-[#292510]"
                }`}
              >

                <div className="flex min-w-0 items-start gap-2">

                  {/* Icon */}
                  <div
                    className={`hidden h-8 w-8 shrink-0 items-center justify-center rounded-full sm:flex ${
                      notification.isRead
                        ? "bg-gray-700/50 text-gray-400"
                        : "bg-yellow-400/10 text-yellow-400"
                    }`}
                  >
                    <LuBell size={16} />
                  </div>

                  {/* Content */}
                  <div className="min-w-0 flex-1">

                    {/* Title and NEW */}
                    <div className="flex items-center justify-between gap-2">

                      <h3 className="min-w-0 break-words text-xs font-semibold sm:text-sm">
                        {notification.title}
                      </h3>

                      {!notification.isRead && (
                        <span className="shrink-0 rounded-full bg-yellow-400/10 px-2 py-0.5 text-[9px] font-bold text-yellow-400">
                          NEW
                        </span>
                      )}

                    </div>

                    {/* Message */}
                    <p className="mt-1 break-words text-[11px] leading-4 text-gray-300 sm:text-xs">
                      {notification.message}
                    </p>

                    {/* Date and Action */}
                    <div className="mt-2 flex flex-wrap items-center justify-between gap-2">

                      <p className="flex items-center gap-1 text-[10px] text-gray-500">
                        <LuClock size={11} />

                        {new Date(
                          notification.createdAt
                        ).toLocaleString()}
                      </p>

                      {!notification.isRead && (
                        <button
                          type="button"
                          onClick={() =>
                            markAsRead(notification._id)
                          }
                          className="flex items-center gap-1 rounded-md px-2 py-1 text-[10px] font-semibold text-yellow-400 transition hover:bg-yellow-400/10"
                        >
                          <LuCheck size={12} />
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
