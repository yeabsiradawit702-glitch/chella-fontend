
import { useContext, useEffect, useState } from "react";
import {
  LuWallet,
  LuLightbulb,
  LuCircleCheck,
  LuUsers,
  LuFlashlight,
  LuMoveRight,
  LuArrowRight,
  LuReceipt,
  LuTrendingUp,
  LuUserPlus,
  LuArrowLeftRight,
  LuRefreshCw,
} from "react-icons/lu";

import DashboardLayout from "../../../compontes/Layout/DashBoradLayout";
import axiosInstance from "../../../utilit/axiosInstance";
import { API_PATHS } from "../../../utilit/apiPath";
import { UserContext } from "../../../context/UserContext";

// -------------------- TYPES --------------------

interface DashboardUserInfo {
  name: string;
  email: string;
  referralCode?: string;
  etbBalance?: number;
  usdBalance?: number;
}

interface Transaction {
  _id?: string;
  id?: string | number;
  title?: string;
  type?: string;
  description?: string;
  date?: string;
  createdAt?: string;
  amount?: number;
  displayAmount?: number;
  price?: number;
  direction?: "sent" | "received" | "unknown";
  status?: string;
  sender?: { name?: string; email?: string } | string;
  receiver?: { name?: string; email?: string } | string;
}

interface DashboardData {
  statistics?: {
    totalTasks: number;
    pendingTasks: number;
    inprogressTasks: number;
    completedTasks: number;
    overdueTasks: number;
  };

  balance: number;
  totalEarned: number;
  totalReferrals: number;
  tasksToday?: number;
  totalTasksToday?: number;
  pendingTasks?: number;

  user: DashboardUserInfo;
  recentTransactions: Transaction[];
}


export default function DashboardUser() {
  const [dashboardData, setDashboardData] =
    useState<DashboardData | null>(null);
 const {user}=useContext(UserContext)
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [viewAll, setViewAll] = useState<boolean>(false);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const fetchDashboardData = async (): Promise<void> => {
      try {
        setLoading(true);
        setError("");

        const response = await axiosInstance.get(
          API_PATHS.TASKS.GET_USER_DASHBOARD_DATA1
        );

        setDashboardData(response.data);
      } catch (err: unknown) {
        console.error("Dashboard error:", err);
        setError("Unable to load dashboard data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    void fetchDashboardData();
  }, []);

  // Fetch transactions from the transaction-history API.
  useEffect(() => {
    const fetchRecentTransactions = async (): Promise<void> => {
      try {
        const response = await axiosInstance.get(
          API_PATHS.TRANSACTIONS.GET_ALL
        );

        const items = response.data?.transactions;
        setRecentTransactions(Array.isArray(items) ? items : []);
      } catch (err) {
        console.error("Recent transactions error:", err);
        // Keep the dashboard usable if the transaction endpoint fails.
        setRecentTransactions([]);
      }
    };

    void fetchRecentTransactions();
  }, []);

  const data = dashboardData;

  const formatDate = (date?: string): string => {
    if (!date) return "Date unavailable";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleDateString();
  };

  // Prefer the dedicated transaction-history API, with dashboard data as fallback.
  const transactions = recentTransactions.length > 0
    ? recentTransactions
    : Array.isArray(data?.recentTransactions)
      ? data.recentTransactions
      : [];

  const visibleTransactions = viewAll
    ? transactions
    : transactions.slice(0, 3);


  if (loading) {
    return (
      <DashboardLayout activeMenu="Dashboard">
        <div className="flex min-h-[60vh] items-center justify-center gap-3 text-yellow-400">
          <LuRefreshCw className="animate-spin text-2xl" />
          <p>Loading your dashboard...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout activeMenu="Dashboard">
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-6 text-red-400">
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-3 rounded-lg bg-red-500/20 px-4 py-2"
          >
            Try again
          </button>
        </div>
      </DashboardLayout>
    );
  }
  const totalETBBalance = Number(
  user?.etbBalance ??
  data?.user?.etbBalance ??
  data?.balance ??
  0
);

  

  const summaryCards = [
{
  title: "Total Balance",
  value: `${totalETBBalance.toFixed(2)} ETB`,
  subtitle: "Available for withdrawal",
  icon: LuWallet,
  color: "yellow",
},
    {
      title: "Total Earned",
      value: `${data?.totalEarned ?? 0} ETB`,
      subtitle: "All-time earnings",
      icon: LuLightbulb,
      color: "green",
    },
 {
  title: "Tasks Today",
  value: `${data?.tasksToday ?? 0}/${data?.totalTasksToday ?? 0}`,
  subtitle: "Tasks completed today",
  icon: LuCircleCheck,
  color: "green",
},
    {
      title: "Total Referrals",
      value: `${data?.totalReferrals ?? 0}`,
      subtitle: "Friends joined",
      icon: LuUsers,
      color: "purple",
    },
  ];

  const colorStyles: Record<
    string,
    { card: string; title: string; value: string; icon: string }
  > = {
    yellow: {
      card: "bg-yellow-500/15 border-yellow-500/10",
      title: "text-yellow-400/70",
      value: "text-yellow-400",
      icon: "bg-yellow-400/20 text-yellow-400",
    },
    green: {
      card: "bg-green-600/20 border-green-500/10",
      title: "text-green-400/70",
      value: "text-green-400",
      icon: "bg-green-500/20 text-green-400",
    },
    blue: {
      card: "bg-blue-600/20 border-blue-500/10",
      title: "text-blue-400/70",
      value: "text-blue-400",
      icon: "bg-blue-500/20 text-blue-400",
    },
    purple: {
      card: "bg-purple-600/25 border-purple-500/10",
      title: "text-purple-400/70",
      value: "text-purple-400",
      icon: "bg-purple-500/20 text-purple-400",
    },
  };

  return (
    <DashboardLayout activeMenu="Dashboard">
      <div className="min-h-screen space-y-6 bg-[#0b0b0b] p-4 text-white sm:p-6">
        {/* HEADER */}

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
           

            <h1 className="text-2xl font-bold tracking-tight">
              Welcome Back, {data?.user?.name ?? "User"}!
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Here&apos;s an overview of your earnings and activity.
            </p>
          </div>

       
        </div>

        {/* SUMMARY CARDS */}

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {summaryCards.map((card) => {
            const Icon = card.icon;
            const style = colorStyles[card.color];

            return (
              <div
                key={card.title}
                className={`flex min-w-0 items-start justify-between gap-3 rounded-xl border p-5 transition duration-200 hover:-translate-y-1 ${style.card}`}
              >
                <div className="min-w-0">
                  <p className={`text-xs ${style.title}`}>
                    {card.title}
                  </p>

                  <h2 className={`mt-1 break-words text-2xl font-bold ${style.value}`}>
                    {card.value}
                  </h2>

                  <p className="mt-2 text-xs text-gray-500">
                    {card.subtitle}
                  </p>
                </div>

                <div className={`shrink-0 rounded-md p-2.5 ${style.icon}`}>
                  <Icon size={20} />
                </div>
              </div>
            );
          })}
        </section>

        {/* ACTION CARDS */}

        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          <button
            type="button"
            onClick={() => {
              window.location.href = "/user/tasks";
            }}
            className="group flex flex-col items-start rounded-xl border border-white/5 bg-[#191919] p-5 text-left transition hover:border-yellow-400/30 hover:bg-[#202020]"
          >
            <span className="rounded-md bg-yellow-400/15 p-2.5 text-yellow-400">
              <LuFlashlight size={22} />
            </span>

            <h3 className="mt-3 font-semibold">Complete Tasks</h3>

            <p className="mt-1 text-sm text-gray-500">
              {data?.pendingTasks ?? 0} pending tasks
            </p>

            <span className="mt-3 flex items-center gap-2 text-xs text-yellow-400">
              Earn now
              <LuMoveRight className="transition group-hover:translate-x-1" />
            </span>
          </button>

          <div className="flex flex-col items-start rounded-xl border border-white/5 bg-[#191919] p-5">
            <span className="rounded-md bg-yellow-400/15 p-2.5 text-yellow-400">
              <LuUserPlus size={22} />
            </span>

            <h3 className="mt-3 font-semibold">Refer Friends</h3>

            <p className="mt-1 text-sm text-gray-400">
              Earn rewards for referring friends.
            </p>

            <p className="mt-3 text-xs text-purple-400">
              Total referrals: {data?.totalReferrals ?? 0}
            </p>

            {data?.user?.referralCode && (
              <button
                type="button"
                onClick={() => {
                     window.location.href = "/user/referrals";
                  void navigator.clipboard.writeText(
                    data.user.referralCode!
                  );
                }}
                className="mt-2 flex items-center gap-2 text-xs text-yellow-400 hover:text-yellow-300"
              >
                Copy referral code
                <LuArrowRight size={14} />
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => {
              window.location.href = "/user/transfer";
            }}
            className="group flex flex-col items-start rounded-xl border border-white/5 bg-[#191919] p-5 text-left transition hover:border-yellow-400/30 hover:bg-[#202020]"
          >
            <span className="rounded-md bg-yellow-400/15 p-2.5 text-yellow-400">
              <LuArrowLeftRight size={22} />
            </span>

            <h3 className="mt-3 font-semibold">Transfer Balance</h3>

            <p className="mt-1 text-sm text-gray-500">
              Send balance to other users.
            </p>

            <span className="mt-3 flex items-center gap-2 text-xs text-yellow-400">
              Transfer
              <LuMoveRight className="transition group-hover:translate-x-1" />
            </span>
          </button>
        </section>

        {/* RECENT TRANSACTIONS */}

        <section className="rounded-xl border border-white/5 bg-[#141414] p-4 sm:p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="font-semibold">Recent Transactions</h2>
              <p className="mt-1 text-xs text-gray-500">
                Your latest account activity
              </p>
            </div>

            {transactions.length > 3 && (
              <button
                type="button"
                onClick={() => setViewAll((previous) => !previous)}
                className="shrink-0 text-xs font-medium text-yellow-400 hover:text-yellow-300"
              >
                {viewAll ? "Show less" : "View all"}
              </button>
            )}
          </div>

          {visibleTransactions.length > 0 ? (
            <div className="space-y-2">
              {visibleTransactions.map((transaction, index) => {
                const rawAmount = Number(
                  transaction.displayAmount ??
                    transaction.amount ??
                    transaction.price ??
                    0
                );
                const amount =
                  transaction.displayAmount !== undefined
                    ? rawAmount
                    : transaction.direction === "sent"
                      ? -Math.abs(rawAmount)
                      : transaction.direction === "received"
                        ? Math.abs(rawAmount)
                        : rawAmount;

                const getPersonLabel = (
                  person?: { name?: string; email?: string } | string
                ): string => {
                  if (person && typeof person === "object") {
                    return person.name?.trim() || person.email?.trim() || "";
                  }
                  return typeof person === "string" ? person : "";
                };

                const senderLabel = getPersonLabel(transaction.sender);
                const receiverLabel = getPersonLabel(transaction.receiver);

                const otherPerson =
                  transaction.direction === "sent"
                    ? receiverLabel
                    : transaction.direction === "received"
                      ? senderLabel
                      : "";

                const transactionTitle =
                  transaction.title ??
                  transaction.description ??
                  (otherPerson
                    ? `${transaction.direction === "sent" ? "To" : "From"}: ${otherPerson}`
                    : transaction.type ?? "Transaction");

                return (
                  <div
                    key={
                      transaction._id ??
                      transaction.id ??
                      `${transaction.title ?? "transaction"}-${index}`
                    }
                    className="flex items-center justify-between gap-3 rounded-lg bg-[#1b1b1b] p-3 transition hover:bg-[#222222] sm:p-4"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="shrink-0 rounded-md bg-yellow-400/15 p-2.5 text-yellow-400">
                        <LuReceipt size={19} />
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">
                          {transactionTitle}
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                          {formatDate(transaction.createdAt ?? transaction.date)}
                        </p>
                      </div>
                    </div>

                    <p
                      className={`shrink-0 text-xs font-semibold sm:text-sm ${
                        amount >= 0
                          ? "text-green-400"
                          : "text-red-400"
                      }`}
                    >
                      {amount > 0 ? "+" : ""}
                      {amount.toLocaleString()} ETB
                    </p>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-lg bg-[#1b1b1b] px-4 py-10 text-center">
              <LuTrendingUp size={30} className="text-gray-600" />
              <p className="mt-3 text-sm text-gray-300">
                No transactions yet
              </p>
              <p className="mt-1 text-xs text-gray-500">
                Your rewards and transfers will appear here.
              </p>
            </div>
          )}
        </section>
      </div>
    </DashboardLayout>
  );
}
