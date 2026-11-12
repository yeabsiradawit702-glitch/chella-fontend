
import { useEffect, useState } from "react";
import { LuBell, LuCheckCheck } from "react-icons/lu";
import axiosInstance from "../utilit/axiosInstance";

interface Notification {
  _id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const fetchNotifications = async () => {
    try {
      const response = await axiosInstance.get("/api/notifications");

      setNotifications(response.data.notifications || []);
      setUnreadCount(response.data.unreadCount || 0);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAsRead = async (id: string) => {
    try {
      await axiosInstance.put(`/api/notifications/${id}/read`);
      await fetchNotifications();
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await axiosInstance.put("/api/notifications/read-all");
      await fetchNotifications();
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    }
  };

  return (
    <div className="relative">

      {/* Notification Bell */}
      <button
        type="button"
        onClick={() => {
          setIsOpen(!isOpen);

          if (!isOpen) {
            fetchNotifications();
          }
        }}
        aria-label="Notifications"
        aria-expanded={isOpen}
        className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white transition hover:bg-white/10"
      >
        <LuBell size={23} />

        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {isOpen && (
        <div
          className="
            fixed
            right-3
            top-16
            z-[100]
            w-[calc(100vw-24px)]
            max-w-96
            overflow-hidden
            rounded-xl
            border
            border-gray-200
            bg-white
            text-gray-800
            shadow-2xl

            sm:absolute
            sm:right-0
            sm:top-12
            sm:w-96
          "
        >

          {/* Header */}
          <div className="flex items-center justify-between gap-2 border-b border-gray-200 p-3 sm:p-4">

            <h3 className="text-sm font-bold sm:text-base">
              Notifications
            </h3>

            <button
              type="button"
              onClick={markAllAsRead}
              disabled={unreadCount === 0}
              className="
                flex shrink-0 items-center gap-1
                rounded-md px-2 py-1.5
                text-xs font-medium text-blue-600
                transition hover:bg-blue-50
                disabled:cursor-not-allowed
                disabled:opacity-40
                sm:text-sm
              "
            >
              <LuCheckCheck size={15} />
              Mark all read
            </button>

          </div>

          {/* Notification List */}
          <div
            className="
              max-h-[min(65vh,420px)]
              overflow-y-auto
              overscroll-contain
            "
          >

            {notifications.length === 0 ? (

              <div className="p-8 text-center">
                <LuBell
                  size={30}
                  className="mx-auto mb-2 text-gray-400"
                />

                <p className="text-sm text-gray-500">
                  No notifications yet.
                </p>
              </div>

            ) : (

              notifications.map((notification) => (

                <button
                  type="button"
                  key={notification._id}
                  onClick={() => {
                    if (!notification.isRead) {
                      markAsRead(notification._id);
                    }
                  }}
                  className={`
                    block w-full min-w-0
                    border-b border-gray-200
                    p-3 text-left
                    transition hover:bg-gray-50
                    sm:p-4
                    ${
                      !notification.isRead
                        ? "bg-blue-50"
                        : "bg-white"
                    }
                  `}
                >

                  {/* Title */}
                  <div className="flex min-w-0 items-start justify-between gap-2">

                    <p className="min-w-0 break-words text-xs font-semibold leading-5 text-gray-800 sm:text-sm">
                      {notification.title}
                    </p>

                    {!notification.isRead && (
                      <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-blue-600" />
                    )}

                  </div>

                  {/* Message */}
                  <p className="mt-1 break-words text-xs leading-5 text-gray-600 sm:text-sm">
                    {notification.message}
                  </p>

                  {/* Date */}
                  <p className="mt-2 break-words text-[10px] text-gray-400 sm:text-xs">
                    {new Date(
                      notification.createdAt
                    ).toLocaleString()}
                  </p>

                </button>

              ))

            )}

          </div>

        </div>
      )}

    </div>
  );
}
