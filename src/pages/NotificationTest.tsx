
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

  const createTestNotification = async () => {
    try {
      await axiosInstance.post("/api/notifications/test");

      toast.success("Test notification created!");
      await fetchNotifications();
    } catch (error) {
      console.error(error);
      toast.error("Could not create test notification");
    }
  };

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
    <div className="min-h-screen w-full overflow-x-hidden px-3 py-4 text-white sm:px-5 sm:py-6 lg:px-8">

      <div className="mx-auto w-full max-w-5xl">

        {/* Header */}
        <div className="mb-5 flex flex-col gap-4 sm:mb-6 sm:flex-row sm:items-center sm:justify-between">

          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-yellow-400/10 text-yellow-400 sm:h-12 sm:w-12">
              <LuBell size={21} />
            </div>

            <div className="min-w-0">
              <h1 className="text-lg font-bold sm:text-xl md:text-2xl">
                Notifications
              </h1>

              <p className="mt-0.5 text-xs text-gray-400 sm:text-sm">
                {unreadCount} unread notifications
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={fetchNotifications}
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-yellow-400 px-4 py-3 text-sm font-semibold text-black transition hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:py-2.5"
          >
            <LuRefreshCw
              size={16}
              className={loading ? "animate-spin" : ""}
            />
            Refresh
          </button>
        </div>

        {/* Action Buttons */}
        <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2">

          <button
            type="button"
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
            className="flex min-h-11 items-center justify-center gap-2 rounded-lg border border-yellow-400 px-3 py-3 text-sm font-semibold text-yellow-400 transition hover:bg-yellow-400 hover:text-black disabled:cursor-not-allowed disabled:opacity-40 sm:py-2.5"
          >
            <LuCheckCheck size={17} />
            Mark all as read
          </button>

          <button
            type="button"
            onClick={createTestNotification}
            className="flex min-h-11 items-center justify-center gap-2 rounded-lg bg-yellow-400 px-3 py-3 text-sm font-semibold text-black transition hover:bg-yellow-300 sm:py-2.5"
          >
            <LuBell size={17} />
            Create Test Notification
          </button>

        </div>

        {/* Notification List Heading */}
        <div className="mb-3 flex items-center justify-between gap-2">
          <h2 className="text-sm font-semibold sm:text-base">
            Recent notifications
          </h2>

          <span className="shrink-0 rounded-full bg-[#252525] px-3 py-1 text-xs text-gray-400">
            {notifications.length} total
          </span>
        </div>

        {/* Loading */}
        {loading && notifications.length === 0 ? (

          <div className="rounded-xl border border-gray-800 bg-[#181818] p-8 text-center text-sm text-gray-400">
            Loading notifications...
          </div>

        ) : notifications.length === 0 ? (

          /* Empty State */
          <div className="rounded-xl border border-gray-800 bg-[#181818] px-4 py-10 text-center sm:py-14">
            <LuBell
              className="mx-auto mb-3 text-gray-500"
              size={32}
            />

            <h3 className="text-sm font-semibold text-gray-300 sm:text-base">
              No notifications yet
            </h3>

            <p className="mt-2 text-xs text-gray-500 sm:text-sm">
              Your notifications will appear here.
            </p>
          </div>

        ) : (

          /* Notification Cards */
          <div className="space-y-3">

            {notifications.map((notification) => (

              <div
                key={notification._id}
                className={`w-full min-w-0 rounded-xl border p-3 transition-colors sm:p-4 md:p-5 ${
                  notification.isRead
                    ? "border-gray-800 bg-[#181818]"
                    : "border-yellow-500/50 bg-[#292510]"
                }`}
              >

                <div className="flex min-w-0 items-start gap-3">

                  {/* Icon */}
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                      notification.isRead
                        ? "bg-gray-700/50 text-gray-400"
                        : "bg-yellow-400/10 text-yellow-400"
                    }`}
                  >
                    <LuBell size={17} />
                  </div>

                  {/* Content */}
                  <div className="min-w-0 flex-1">

                    {/* Title and NEW */}
                    <div className="flex min-w-0 flex-wrap items-start justify-between gap-2">

                      <h3 className="min-w-0 flex-1 break-words text-sm font-semibold sm:text-base">
                        {notification.title}
                      </h3>

                      {!notification.isRead && (
                        <span className="shrink-0 rounded-full bg-yellow-400/10 px-2 py-1 text-[10px] font-bold text-yellow-400">
                          NEW
                        </span>
                      )}

                    </div>

                    {/* Message */}
                    <p className="mt-2 break-words text-xs leading-5 text-gray-300 sm:text-sm sm:leading-6">
                      {notification.message}
                    </p>

                    {/* Date and Action */}
                    <div className="mt-3 flex flex-col gap-3 border-t border-gray-700/40 pt-3 sm:flex-row sm:items-center sm:justify-between">

                      <p className="flex min-w-0 items-center gap-1.5 text-[10px] text-gray-500 sm:text-xs">
                        <LuClock size={13} className="shrink-0" />

                        <span className="break-words">
                          {new Date(
                            notification.createdAt
                          ).toLocaleString()}
                        </span>
                      </p>

                      {!notification.isRead && (
                        <button
                          type="button"
                          onClick={() =>
                            markAsRead(notification._id)
                          }
                          className="flex min-h-10 w-full items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-yellow-400 transition hover:bg-yellow-400/10 sm:min-h-8 sm:w-auto"
                        >
                          <LuCheck size={14} />
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
