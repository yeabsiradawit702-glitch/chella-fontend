import  { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Input from '../../../compontes/inputs/Input';
import DashboardLayout from '../../../compontes/Layout/DashBoradLayout';

import {
  BadgeCheck,
  Pencil,
  TrendingUp,
  Users,
  Copy,
  BellRing,
  Power,
  ShieldCheck,
  ChevronRightCircle,
} from 'lucide-react';
import axiosInstance from '../../../utilit/axiosInstance';
import { API_PATHS } from '../../../utilit/apiPath';
import { useNavigate } from 'react-router-dom';


type ProfileUser = {
  _id?: string;
  name?: string;
  email?: string;
  role?: string;
  createdAt?: string;
  profileImageUrl?: string;
  profileImage?: string;
  isVerified?: boolean;
  referralCode?: string;
  notificationsEnabled?: boolean;
  twoFactorEnabled?: boolean;

  privacySettings?: {
    showEmail?: boolean;
    privateProfile?: boolean;
  };
};

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState<ProfileUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileError, setProfileError] = useState('');
  const [copyMessage, setCopyMessage] = useState('');
  const [totalEarned, setTotalEarned] = useState<number | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
const [currentPassword, setCurrentPassword] = useState("");
const [newPassword, setNewPassword] = useState("");
const [confirmPassword, setConfirmPassword] = useState("");
const [passwordLoading, setPasswordLoading] = useState(false);
const [notificationsEnabled, setNotificationsEnabled] = useState(true);
const [showEditForm, setShowEditForm] = useState(false);
const [editName, setEditName] = useState("");
const [editEmail, setEditEmail] = useState("");
const [editLoading, setEditLoading] = useState(false);
  const copyReferralCode = async () => {
  try {
    const code = user?.referralCode;

    if (!code) {
      toast.error("Referral code is empty!");
      return;
    }

    await navigator.clipboard.writeText(code);
    toast.success("Referral code copied!");
  } catch (error) {
    console.error("Clipboard error:", error);
    toast.error("Copy failed!");
  }
};

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setProfileError('');
        const response = await axiosInstance.get(API_PATHS.AUTH.GET_PROFILE);
        const data = response.data;
        const profile = data?.user ?? data?.data?.user ?? data?.data ?? data;
        setUser(profile);
        setNotificationsEnabled(profile.notificationsEnabled ?? true);
      } catch (error: any) {
        console.error('Failed to load profile:', error?.response?.data || error);
        setProfileError(
          error?.response?.data?.message || 'Could not load your profile. Please try again.'
        );
      } finally {
        setLoading(false);
      }
    };

    const fetchDashboardStats = async () => {
      try {
        const response = await axiosInstance.get(
          API_PATHS.TASKS.GET_USER_DASHBOARD_DATA1
        );
        const dashboardData = response.data?.data ?? response.data;
        const earned = Number(dashboardData?.totalEarned);
        setTotalEarned(Number.isFinite(earned) ? earned : 0);
      } catch (error: any) {
        console.error('Failed to load dashboard statistics:', error?.response?.data || error);
        setTotalEarned(null);
      } finally {
        setStatsLoading(false);
      }
    };

    fetchProfile();
    fetchDashboardStats();
  }, []);

  const displayName = user?.name?.trim() || 'Unknown User';
  const initial = displayName.charAt(0).toUpperCase();
  const memberSince = user?.createdAt
    ? new Date(user.createdAt).getFullYear()
    : '—';
  const profileImage = user?.profileImageUrl || user?.profileImage;
  const role = user?.role || 'member';

  const copyAccountId = async () => {
    if (!user?._id) return;
    try {
      await navigator.clipboard.writeText(user._id);
      setCopyMessage('Account ID copied');
      window.setTimeout(() => setCopyMessage(''), 1800);
    } catch {
      setCopyMessage('Could not copy account ID');
      window.setTimeout(() => setCopyMessage(''), 1800);
    }
    
  };
  const handleChangePassword = async () => {
  if (!currentPassword || !newPassword || !confirmPassword) {
    toast.error("Please fill in all password fields");
    return;
  }

  if (newPassword.length < 8) {
    toast.error("Password must be at least 8 characters");
    return;
  }

  if (newPassword !== confirmPassword) {
    toast.error("New passwords do not match");
    return;
  }

  try {
    setPasswordLoading(true);

    await axiosInstance.put(API_PATHS.AUTH.GET_PROFILE, {
      currentPassword,
      password: newPassword,
    });

    toast.success("Password changed successfully!");

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setShowPasswordForm(false);

  } catch (error: any) {
    toast.error(
      error?.response?.data?.message || "Failed to change password"
    );
  } finally {
    setPasswordLoading(false);
  }
};
const handleNotificationToggle = async () => {
  const newValue = !notificationsEnabled;

  try {
    await axiosInstance.put(API_PATHS.AUTH.GET_PROFILE, {
      notificationsEnabled: newValue,
    });

    setNotificationsEnabled(newValue);
    toast.success(
      newValue
        ? "App notifications enabled"
        : "App notifications disabled"
    );
  } catch (error: any) {
    toast.error(
      error?.response?.data?.message || "Could not update notification settings"
    );
  }
};
  const handleEditProfile = async () => {
  if (!editName.trim() || !editEmail.trim()) {
    toast.error("Name and email are required");
    return;
  }

  try {
    setEditLoading(true);

    const response = await axiosInstance.put(
      API_PATHS.AUTH.GET_PROFILE,
      {
        name: editName,
        email: editEmail,
      }
    );

    const updatedUser = response.data.user ?? response.data;

    setUser((prev) => ({
      ...prev,
      ...updatedUser,
    }));

    setShowEditForm(false);
    toast.success("Profile updated successfully!");

  } catch (error: any) {
    toast.error(
      error?.response?.data?.message || "Failed to update profile"
    );
  } finally {
    setEditLoading(false);
  }
};

const [twoFactorLoading, setTwoFactorLoading] = useState(false);

const handleTwoFactorToggle = async () => {
    if (!user || twoFactorLoading) return;

    const newValue = !user.twoFactorEnabled;

    const password = window.prompt(
        `Enter your current password to ${
            newValue ? 'enable' : 'disable'
        } two-factor authentication:`
    );

    if (!password) return;

    try {
        setTwoFactorLoading(true);

        const response = await axiosInstance.put(
            API_PATHS.AUTH.GET_PROFILE,
            {
                twoFactorEnabled: newValue,
                currentPassword: password
            }
        );

        setUser(prev =>
            prev
                ? {
                    ...prev,
                    twoFactorEnabled: response.data.twoFactorEnabled
                }
                : prev
        );

        toast.success(
            newValue
                ? 'Two-factor authentication enabled!'
                : 'Two-factor authentication disabled!'
        );

    } catch (error: any) {
        toast.error(
            error.response?.data?.message ||
            'Failed to update two-factor authentication'
        );
    } finally {
        setTwoFactorLoading(false);
    }
};


  return (
    <DashboardLayout activeMenu='Profile'>
      <div className="space-y-5 pb-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-white">My Profile</h1>
            <p className="mt-1 text-gray-400">Manage your account information and settings.</p>
          </div>
          <button
            type="button"
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-amber-400 px-4 py-2 text-black transition hover:bg-amber-300 sm:w-40"
           onClick={() => {
  setEditName(user?.name || "");
  setEditEmail(user?.email || "");
  setShowEditForm(true);
}}
          >
            <Pencil size={17} /> Edit profile
          </button>
        </div>
        {showEditForm && (
  <div className="rounded-xl border border-yellow-500/30 bg-gray-900 p-5 space-y-4">

    <h2 className="text-xl font-semibold text-white">
      Edit Your Profile
    </h2>

    <div>
      <label className="mb-2 block text-sm text-gray-300">
        Full Name
      </label>

      <Input
        value={editName}
        onChange={(e) => setEditName(e.target.value)}
        placeholder="Enter your name"
      />
    </div>

    <div>
      <label className="mb-2 block text-sm text-gray-300">
        Email Address
      </label>

      <Input
        type="email"
        value={editEmail}
        onChange={(e) => setEditEmail(e.target.value)}
        placeholder="Enter your email"
      />
    </div>

    <div className="flex gap-3">
      <button
        onClick={handleEditProfile}
        disabled={editLoading}
        className="rounded-lg bg-yellow-400 px-5 py-2 font-semibold text-black"
      >
        {editLoading ? "Saving..." : "Save Changes"}
      </button>

      <button
        onClick={() => setShowEditForm(false)}
        className="rounded-lg border border-gray-600 px-5 py-2 text-white"
      >
        Cancel
      </button>
    </div>

  </div>
)}

        {profileError && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
            {profileError}
          </div>
        )}

        <section className="min-h-60 rounded-xl border border-yellow-500/20 bg-gradient-to-br from-yellow-400/60 to-black p-4 sm:p-6">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
            <div className="flex flex-col gap-3">
              <h2 className="text-xl font-semibold text-white">
                {loading ? 'Loading profile...' : displayName}
              </h2>
              <div className="flex items-center gap-3">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt={`${displayName} profile`}
                    className="h-16 w-16 rounded-full border-2 border-yellow-300 object-cover"
                  />
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-yellow-400 text-xl font-bold text-black">
                    {loading ? '…' : initial}
                  </div>
                )}
                <div className="flex flex-col gap-1">
                  <p className="capitalize text-gray-800">{role} member</p>
                  <p className="flex items-center gap-1 text-sm text-green-700">
                    <BadgeCheck size={17} />
                    {user?.isVerified ? 'Account verified' : 'Account active'}
                  </p>
                </div>
              </div>
            </div>
            <div className="w-fit rounded-xl bg-amber-400/20 px-3 py-2 text-sm text-yellow-200">
              Member since {memberSince}
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 border-t border-white/10 pt-4 sm:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-400">Email address</p>
              <p className="mt-1 break-all text-white">{loading ? 'Loading...' : user?.email || 'No email available'}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-400">Member status</p>
              <p className="mt-1 text-white">{user ? 'Active' : loading ? 'Loading...' : 'Unavailable'}</p>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <section className="grid gap-3 rounded-xl bg-gray-900/30 p-4">
            <h2 className="text-xl text-white">Your statistics</h2>
            <div className="rounded-xl bg-gray-800/20 p-3">
              <div className="flex items-center gap-4">
                <div className="flex h-9 w-9 items-center justify-center rounded bg-yellow-500/50 p-1 text-yellow-300"><TrendingUp /></div>
                <div><p className="text-xs text-gray-400">Total Earned</p><p className="text-white">{statsLoading ? 'Loading...' : totalEarned === null ? 'Unavailable' : `${totalEarned.toLocaleString()} ETB`}</p></div>
              </div>
            </div>
            <div className="rounded-xl bg-gray-800/20 p-3">
              <div className="flex items-center gap-4">
                <div className="flex h-9 w-9 items-center justify-center rounded bg-purple-500/30 p-1 text-purple-300"><Users /></div>
                <div><p className="text-xs text-gray-400">Total Rewards</p><p className="text-white">2</p></div>
              </div>
            </div>
            <div className="rounded-xl bg-gray-800/20 p-3">
              <div className="flex items-center gap-4">
                <div className="flex h-9 w-9 items-center justify-center rounded bg-green-500/30 p-1 text-green-400"><TrendingUp /></div>
                <div><p className="text-xs text-gray-400">This Month</p><p className="text-white">60 ETB</p></div>
              </div>
            </div>
            <p className="text-xs text-gray-500">Total Earned is loaded from the same dashboard API used by your Dashboard page.</p>
          </section>

<div className="rounded-xl h-50 border border-gray-700 bg-[#202020] p-4">
  <h3 className="mb-2 font-semibold text-white">
    Your Referral Code
  </h3>

  <div className="flex items-center gap-3">
    <input
      value={user?.referralCode || ""}
      readOnly
      placeholder="Loading referral code..."
      className="w-full rounded-lg border border-gray-600 bg-[#292929] p-3 text-yellow-400 outline-none"
    />

  <button
  type="button"
  onClick={copyReferralCode}
  className="rounded-lg bg-yellow-400 px-4 py-3 font-semibold text-black"
>
  Copy
</button>
  </div>
</div>

        </div>

        <section className="grid gap-3 rounded-xl bg-gray-900/30 p-4">
          <h2 className="text-xl text-white">Settings</h2>
          <div className="flex items-center justify-between gap-4 rounded-xl bg-gray-800/20 p-3">
  <div className="flex items-center gap-3">
    <BellRing className="text-gray-400" />
    <div>
      <p className="text-white">App Notifications</p>
      <p className="text-xs text-gray-400">
        Receive notifications in your notification bell
      </p>
    </div>
  </div>

  <button
    type="button"
    onClick={handleNotificationToggle}
    aria-label="Toggle app notifications"
    aria-pressed={notificationsEnabled}
    className={`relative h-7 w-12 rounded-full transition ${
      notificationsEnabled ? "bg-yellow-400" : "bg-gray-600"
    }`}
  >
    <span
      className={`absolute top-1 h-5 w-5 rounded-full bg-white transition-all ${
        notificationsEnabled ? "left-6" : "left-1"
      }`}
    />
  </button>
</div>

<div className="flex items-center justify-between gap-4 rounded-xl bg-gray-800/20 p-3">
  <div className="flex items-center gap-3">
    <ShieldCheck className="text-yellow-400" />
    <div>
      <p className="text-white">Two-Step Verification</p>
      <p className="text-xs text-gray-400">
        Add an extra layer of protection to your account
      </p>
      <span className={`text-xs ${
        user?.twoFactorEnabled ? "text-green-400" : "text-gray-400"
      }`}>
        {user?.twoFactorEnabled ? "Enabled" : "Disabled"}
      </span>
    </div>
  </div>

  <button
    type="button"
    onClick={handleTwoFactorToggle}
    disabled={twoFactorLoading || loading}
    className={`relative h-7 w-12 rounded-full transition ${
      user?.twoFactorEnabled ? "bg-yellow-400" : "bg-gray-600"
    }`}
  >
    <span
      className={`absolute top-1 h-5 w-5 rounded-full bg-white transition-all ${
        user?.twoFactorEnabled ? "left-6" : "left-1"
      }`}
    />
  </button>
</div>

      <button
  type="button"
  onClick={() => navigate("/privacy-security")}
  disabled={loading}
  className="flex w-full items-center justify-between gap-4 rounded-xl bg-gray-800/20 p-3 text-left transition hover:bg-gray-800/50 disabled:opacity-50"
>
  <div className="flex items-center gap-3">
    <ShieldCheck className="text-gray-400" />

    <div>
      <p className="text-white">Privacy & Security</p>

      <p className="text-xs text-gray-400">
        Manage your profile visibility and personal information
      </p>

      <div className="mt-2 flex flex-wrap gap-2">
        <span className={`rounded-full px-2 py-1 text-xs ${
          user?.privacySettings?.privateProfile
            ? "bg-yellow-500/20 text-yellow-400"
            : "bg-green-500/20 text-green-400"
        }`}>
          {user?.privacySettings?.privateProfile ? "Private profile" : "Public profile"}
        </span>

        <span className="rounded-full bg-gray-700 px-2 py-1 text-xs text-gray-300">
          Email {user?.privacySettings?.showEmail ? "Visible" : "Hidden"}
        </span>
      </div>
    </div>
  </div>

  <ChevronRightCircle className="shrink-0 text-gray-400" size={20} />
</button>
          <div className="flex items-center justify-between gap-4 rounded-xl bg-gray-800/20 p-3" 
            onClick={() => navigate("/privacy-security")}>
            <div className="flex items-center gap-3">
              <ShieldCheck className="text-gray-400" />
              <div><p className="text-white">Privacy settings</p><p className="text-xs text-gray-400">Control who can see your profile</p></div>
            </div>
            <span className="text-sm text-gray-400">
  {user?.privacySettings?.privateProfile
    ? "Private"
    : "Public"}
</span>
          </div>
   <button
  type="button"
  onClick={() => setShowPasswordForm(!showPasswordForm)}
  className="flex items-center gap-3 rounded-xl bg-gray-800/20 p-3 text-left text-white hover:bg-gray-800/40"
>
  <ChevronRightCircle className="text-gray-400" />
  Change password
</button>

{showPasswordForm && (
  <div className="space-y-3 rounded-xl border border-gray-700 bg-gray-800/30 p-4">
    <h3 className="font-semibold text-white">Change your password</h3>

    <Input
      type="password"
      value={currentPassword}
      onChange={(e) => setCurrentPassword(e.target.value)}
      placeholder="Current password"
      className="w-full rounded-lg border border-gray-600 bg-gray-900 p-3 text-white outline-none"
    />

    <Input
      type="password"
      value={newPassword}
      onChange={(e) => setNewPassword(e.target.value)}
      placeholder="New password (minimum 8 characters)"
      className="w-full rounded-lg border border-gray-600 bg-gray-900 p-3 text-white outline-none"
    />

    <Input
      type="password"
      value={confirmPassword}
      onChange={(e) => setConfirmPassword(e.target.value)}
      placeholder="Confirm new password"
      className="w-full rounded-lg border border-gray-600 bg-gray-900 p-3 text-white outline-none"
    />

    <div className="flex gap-3">
      <button
        type="button"
        onClick={handleChangePassword}
        disabled={passwordLoading}
        className="rounded-lg bg-yellow-400 px-4 py-2 font-semibold text-black disabled:opacity-50"
      >
        {passwordLoading ? "Updating..." : "Update Password"}
      </button>

      <button
        type="button"
        onClick={() => {
          setShowPasswordForm(false);
          setCurrentPassword("");
          setNewPassword("");
          setConfirmPassword("");
        }}
        className="rounded-lg border border-gray-500 px-4 py-2 text-white"
      >
        Cancel
      </button>
    </div>
  </div>
)}
          <button type="button" onClick={() => { localStorage.removeItem('token'); window.location.href = '/login'; }} className="flex items-center gap-3 rounded-xl bg-red-500/20 p-3 text-left text-red-400 hover:bg-red-500/30">
            <Power /> Log out
          </button>
        </section>

        <section className="flex flex-col items-center gap-2 rounded-xl bg-gray-800/20 p-4 text-center">
          <p className="text-xs text-gray-400">Account ID</p>
          <div className="flex max-w-full items-center gap-2">
            <p className="break-all text-sm text-gray-300">{loading ? 'Loading...' : user?._id || 'Unavailable'}</p>
            <button type="button" onClick={copyAccountId} disabled={!user?._id} aria-label="Copy account ID" className="shrink-0 rounded p-1 text-yellow-400 disabled:opacity-40"><Copy size={16} /></button>
          </div>
          {copyMessage && <p className="text-xs text-green-400">{copyMessage}</p>}
          <p className="text-xs text-gray-500">Member since {memberSince}</p>
        </section>
      </div>
    </DashboardLayout>
  );
}
