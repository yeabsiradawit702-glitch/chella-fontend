
import { useEffect, useState } from "react";
import axiosInstance from "../utilit/axiosInstance";
import toast from "react-hot-toast";

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
    fetchNotifications();
  } catch (error: any) {
    console.error(error.response?.data || error);
    toast.error("Could not create test notification");
  }
};
  const markAsRead = async (id: string) => {
    try {
      await axiosInstance.put(`/api/notifications/${id}/read`);
      toast.success("Notification marked as read");
      fetchNotifications();
    } catch (error) {
      toast.error("Failed to update notification");
    }
  };

  const markAllAsRead = async () => {
    try {
      await axiosInstance.put("/api/notifications/read-all");
      toast.success("All notifications marked as read");
      fetchNotifications();
    } catch (error) {
      toast.error("Failed to update notifications");
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <div className="min-h-screen bg-[#0c0c0c] p-6 text-white">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Notifications</h1>
            <p className="text-gray-400">
              Unread notifications: {unreadCount}
            </p>
          </div>

          <button
            onClick={fetchNotifications}
            className="rounded-lg bg-yellow-400 px-4 py-2 font-semibold text-black"
          >
            Refresh
          </button>
        </div>

        <button
          onClick={markAllAsRead}
          disabled={unreadCount === 0}
          className="mb-4 rounded-lg border border-yellow-400 px-4 py-2 text-yellow-400 disabled:opacity-40"
        >
          Mark all as read
        </button>
<button
  onClick={createTestNotification}
  className="mb-4 rounded-lg bg-yellow-400 px-4 py-2 font-semibold text-black"
>
  Create Test Notification
</button>
        {loading ? (
          <p>Loading notifications...</p>
        ) : notifications.length === 0 ? (
          <div className="rounded-xl bg-[#202020] p-8 text-center text-gray-400">
            No notifications yet.
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification) => (
              <div
                key={notification._id}
                className={`rounded-xl border p-4 ${
                  notification.isRead
                    ? "border-gray-700 bg-[#202020]"
                    : "border-yellow-500 bg-[#292510]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">
                    {notification.title}
                  </h3>

                  {!notification.isRead && (
                    <span className="text-xs text-yellow-400">
                      NEW
                    </span>
                  )}
                </div>

                <p className="mt-2 text-sm text-gray-300">
                  {notification.message}
                </p>

                <p className="mt-2 text-xs text-gray-500">
                  {new Date(notification.createdAt).toLocaleString()}
                </p>

                {!notification.isRead && (
                  <button
                    onClick={() => markAsRead(notification._id)}
                    className="mt-3 text-sm text-yellow-400"
                  >
                    Mark as read
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
