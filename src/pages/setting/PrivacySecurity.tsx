
import { useEffect, useState } from "react";
import DashboardLayout from "../../compontes/Layout/DashBoradLayout";
import axiosInstance from "../../utilit/axiosInstance";
import {
  Lock,
  Eye,
  ShieldCheck,
  Trash2,
  Bell,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

type SettingProps = {
  title: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
};

type PrivacyResponse = {
  privacySettings?: {
    showEmail?: boolean;
    privateProfile?: boolean;
  };
  notificationSettings?: {
    taskNotifications?: boolean;
    rewardNotifications?: boolean;
  };
};

function Setting({
  title,
  description,
  checked,
  onChange,
  disabled = false,
}: SettingProps) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-gray-200 py-4 last:border-0">
      <div>
        <h3 className="font-semibold text-gray-800">{title}</h3>
        <p className="text-sm text-gray-500">{description}</p>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={title}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-12 shrink-0 rounded-full transition ${
          checked ? "bg-blue-600" : "bg-gray-300"
        } disabled:cursor-not-allowed disabled:opacity-50`}
      >
        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-all ${
            checked ? "left-7" : "left-1"
          }`}
        />
      </button>
    </div>
  );
}

export default function PrivacySecurity() {
  const navigate = useNavigate();

  const [showEmail, setShowEmail] = useState(false);
  const [privateProfile, setPrivateProfile] = useState(false);
  const [taskNotifications, setTaskNotifications] = useState(true);
  const [rewardNotifications, setRewardNotifications] = useState(true);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchPrivacySettings = async () => {
      try {
        const response = await axiosInstance.get<PrivacyResponse>(
          "/api/auth/privacy"
        );

        setShowEmail(response.data.privacySettings?.showEmail ?? false);
        setPrivateProfile(
          response.data.privacySettings?.privateProfile ?? false
        );
        setTaskNotifications(
          response.data.notificationSettings?.taskNotifications ?? true
        );
        setRewardNotifications(
          response.data.notificationSettings?.rewardNotifications ?? true
        );
      } catch (error: any) {
        console.error(
          "Failed to load privacy settings:",
          error?.response?.data || error
        );
        toast.error(
          error?.response?.data?.message ||
            "Failed to load privacy settings"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPrivacySettings();
  }, []);

  const savePrivacy = async () => {
    if (saving || loading) return;

    try {
      setSaving(true);

      await axiosInstance.put("/api/auth/privacy", {
        showEmail,
        privateProfile,
        taskNotifications,
        rewardNotifications,
      });

      toast.success("Privacy settings saved successfully!");
    } catch (error: any) {
      console.error(
        "Failed to save privacy settings:",
        error?.response?.data || error
      );
      toast.error(
        error?.response?.data?.message || "Could not save privacy settings"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout  activeMenu="Privacy & Security">
      <div className="mx-auto max-w-5xl space-y-6 p-4 sm:p-6">
        <div>
          <button
            type="button"
            onClick={() => navigate("/user/profile")}
            className="mb-4 flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600"
          >
            <ArrowLeft size={17} />
            Back to Profile
          </button>

          <h1 className="text-2xl font-bold text-gray-900">
            Privacy & Security
          </h1>
          <p className="mt-2 text-gray-500">
            Manage your account privacy and security preferences.
          </p>
        </div>

        {/* Privacy Settings */}
        <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-3 flex items-center gap-3">
            <Eye className="text-blue-600" size={22} />
            <h2 className="text-lg font-bold text-gray-900">
              Privacy Settings
            </h2>
          </div>

          {loading ? (
            <div className="flex items-center gap-2 py-8 text-gray-500">
              <Loader2 className="animate-spin" size={20} />
              Loading your settings...
            </div>
          ) : (
            <>
              <Setting
                title="Show Email Address"
                description="Allow others to see your email address."
                checked={showEmail}
                onChange={setShowEmail}
              />

              <Setting
                title="Private Profile"
                description="Limit the visibility of your profile."
                checked={privateProfile}
                onChange={setPrivateProfile}
              />

              <div className="mb-2 mt-6 flex items-center gap-3">
                <Bell className="text-blue-600" size={21} />
                <h2 className="font-bold text-gray-900">
                  Notification Preferences
                </h2>
              </div>

              <Setting
                title="Task Notifications"
                description="Receive notifications about your tasks."
                checked={taskNotifications}
                onChange={setTaskNotifications}
              />

              <Setting
                title="Reward Notifications"
                description="Receive notifications when you earn rewards."
                checked={rewardNotifications}
                onChange={setRewardNotifications}
              />

              <button
                type="button"
                onClick={savePrivacy}
                disabled={saving}
                className="mt-6 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </>
          )}
        </section>

        {/* Account Protection */}
        <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-3 flex items-center gap-3">
            <ShieldCheck className="text-orange-500" size={22} />
            <h2 className="text-lg font-bold text-gray-900">
              Account Protection
            </h2>
          </div>

          <div className="flex items-center justify-between gap-4 border-b border-gray-200 py-4">
            <div className="flex items-center gap-3">
              <Lock className="text-gray-500" size={20} />
              <div>
                <h3 className="font-semibold text-gray-800">
                  Two-factor authentication
                </h3>
                <p className="text-sm text-gray-500">
                  Manage this feature from your Profile settings.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate("/user/profile")}
              className="rounded-lg border border-blue-600 px-3 py-2 text-sm text-blue-600 hover:bg-blue-50"
            >
              Manage
            </button>
          </div>

          <div className="flex items-center justify-between gap-4 py-4">
            <div className="flex items-center gap-3">
              <Trash2 className="text-red-500" size={20} />
              <div>
                <h3 className="font-semibold text-gray-800">
                  Delete Account
                </h3>
                <p className="text-sm text-gray-500">
                  Permanently delete your account and data.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                toast.error(
                  "Account deletion is not available yet. Contact support."
                )
              }
              className="rounded-lg border border-red-200 px-3 py-2 text-red-600 hover:bg-red-50"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}
