
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

console.log("Notification API response:", response.data);

setNotifications(response.data.notifications || []);
setUnreadCount(response.data.unreadCount || 0);
console.log("Unread count:", response.data.unreadCount);
console.log("Notifications:", response.data.notifications);
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
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) fetchNotifications();
        }}
        className="relative p-2 rounded-full hover:bg-gray-100"
      >
        <LuBell size={23} />

        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full min-w-5 h-5 flex items-center justify-center px-1">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-12 z-50 w-80 sm:w-96 bg-white border border-gray-200 rounded-xl shadow-xl">
          <div className="flex justify-between items-center p-4 border-b">
            <h3 className="font-semibold text-gray-800">
              Notifications
            </h3>

            <button
              onClick={markAllAsRead}
              className="text-sm text-blue-600 flex items-center gap-1"
              disabled={unreadCount === 0}
            >
              <LuCheckCheck size={16} />
              Mark all read
            </button>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="text-center text-gray-500 p-6">
                No notifications yet.
              </p>
            ) : (
              notifications.map((notification) => (
                <button
                  key={notification._id}
                  onClick={() => {
                    if (!notification.isRead) {
                      markAsRead(notification._id);
                    }
                  }}
                  className={`w-full text-left p-4 border-b hover:bg-gray-50 ${
                    !notification.isRead ? "bg-blue-50" : ""
                  }`}
                >
                  <div className="flex justify-between gap-2">
                    <p className="font-semibold text-sm text-gray-800">
                      {notification.title}
                    </p>

                    {!notification.isRead && (
                      <span className="w-2 h-2 rounded-full bg-blue-600 mt-1 shrink-0" />
                    )}
                  </div>

                  <p className="text-sm text-gray-600 mt-1">
                    {notification.message}
                  </p>

                  <p className="text-xs text-gray-400 mt-2">
                    {new Date(notification.createdAt).toLocaleString()}
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
