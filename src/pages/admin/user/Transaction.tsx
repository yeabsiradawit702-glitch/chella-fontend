
import  { useEffect, useState } from "react";
import DashboardLayout from "../../../compontes/Layout/DashBoradLayout";
import axiosInstance from "../../../utilit/axiosInstance";
import { API_PATHS } from "../../../utilit/apiPath";
import { LuArrowDownUp, LuDownload } from "react-icons/lu";

type Transaction = {
  _id?: string;
  type?: string;
  amount: number;
  displayAmount?: number;
  direction?: "sent" | "received" | "income";
  createdAt?: string;
  date?: string;
  description?: string;
  status?: string;
  sender?: { name?: string; email?: string };
  receiver?: { name?: string; email?: string };
};

type Filter = "All" | "Income" | "Transfers";

export default function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filter, setFilter] = useState<Filter>("All");
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let active = true;

    const fetchTransactions = async () => {
      try {
        setLoading(true);
        setErrorMessage("");

        const response = await axiosInstance.get(
          API_PATHS.TRANSACTIONS.GET_ALL
        );

        if (active) {
          setTransactions(response.data?.transactions || []);
        }
      } catch (error: any) {
        console.error("Failed to load transactions:", error);

        if (active) {
          setErrorMessage(
            error.response?.data?.message ||
              "Failed to load transactions. Please try again."
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchTransactions();

    return () => {
      active = false;
    };
  }, []);

  const getType = (item: Transaction) =>
    (item.type || "Transaction").toLowerCase();

  const isTransfer = (item: Transaction) =>
    getType(item).includes("transfer");

  const isIncome = (item: Transaction) => {
    const type = getType(item);

    return (
      type.includes("income") ||
      type.includes("reward") ||
      type.includes("referral") ||
      type.includes("signup")
    );
  };

  const getDisplayAmount = (item: Transaction) => {
    if (item.displayAmount !== undefined) {
      return Number(item.displayAmount);
    }

    const amount = Math.abs(Number(item.amount || 0));

    if (item.direction === "sent") return -amount;

    return Number(item.amount || 0);
  };

  const getTransactionDate = (item: Transaction) =>
    item.createdAt || item.date;

  const formatDate = (item: Transaction) => {
    const date = getTransactionDate(item);

    if (!date) return "—";

    const parsedDate = new Date(date);

    return Number.isNaN(parsedDate.getTime())
      ? "—"
      : parsedDate.toLocaleDateString();
  };

  const formatAmount = (amount: number) =>
    `${amount > 0 ? "+" : ""}${amount} ETB`;

  const filteredTransactions = transactions.filter((item) => {
    if (filter === "All") return true;

    if (filter === "Income") return isIncome(item);

    if (filter === "Transfers") return isTransfer(item);

    return true;
  });

  // Income includes only reward/income-type records.
  const totalIncome = transactions
    .filter(isIncome)
    .reduce(
      (sum, item) => sum + Math.abs(Number(item.amount || 0)),
      0
    );

  // Only outgoing transfers count as money transferred.
  const totalTransferred = transactions
    .filter(
      (item) => isTransfer(item) && item.direction === "sent"
    )
    .reduce(
      (sum, item) => sum + Math.abs(Number(item.amount || 0)),
      0
    );

  const averageTransaction = transactions.length
    ? Math.round(
        transactions.reduce(
          (sum, item) => sum + Math.abs(getDisplayAmount(item)),
          0
        ) / transactions.length
      )
    : 0;

  const exportCSV = () => {
    const rows = [
      ["Type", "Date", "Amount (ETB)", "Direction", "Status"],
      ...filteredTransactions.map((item) => [
        item.type || "Transaction",
        formatDate(item),
        getDisplayAmount(item),
        item.direction || "",
        item.status || "completed",
      ]),
    ];

    const csv = rows
      .map((row) =>
        row
          .map((value) => `"${String(value).replace(/"/g, '""')}"`)
          .join(",")
      )
      .join("\n");

    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "transactions.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
  };

  return (
    <DashboardLayout activeMenu="Transcation">
      <div className="min-h-screen space-y-6 bg-[#101010] p-5 text-white md:p-7">
        <div>
          <h1 className="text-2xl font-bold">
            Transaction History
          </h1>
          <p className="mt-1 text-sm text-gray-400">
            View your earnings and transfers.
          </p>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryCard
            title="Total Income"
            value={`${totalIncome} ETB`}
            color="bg-green-900/40"
          />

          <SummaryCard
            title="Total Transferred"
            value={`${totalTransferred} ETB`}
            color="bg-blue-900/40"
          />

          <SummaryCard
            title="Total Transactions"
            value={transactions.length}
            color="bg-purple-900/40"
          />

          <SummaryCard
            title="Average Transaction"
            value={`${averageTransaction} ETB`}
            color="bg-yellow-900/40"
          />
        </div>

        {/* Filters and export */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex gap-2">
            {(["All", "Income", "Transfers"] as Filter[]).map(
              (item) => (
                <button
                  key={item}
                  onClick={() => setFilter(item)}
                  className={`rounded-md px-4 py-2 text-sm ${
                    filter === item
                      ? "bg-yellow-400 font-semibold text-black"
                      : "bg-[#292929] text-gray-300 hover:bg-[#383838]"
                  }`}
                >
                  {item}
                </button>
              )
            )}
          </div>

          <button
            onClick={exportCSV}
            disabled={filteredTransactions.length === 0}
            className="flex items-center gap-2 rounded-md bg-[#292929] px-4 py-2 text-sm hover:bg-[#383838] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <LuDownload size={16} />
            Export CSV
          </button>
        </div>

        {/* Transaction table */}
        <div className="overflow-x-auto">
          <div className="mb-3 grid min-w-[600px] grid-cols-4 px-4 text-xs text-gray-400">
            <span>Type</span>
            <span>Date</span>
            <span>Amount</span>
            <span>Status</span>
          </div>

          {loading ? (
            <p className="p-5 text-gray-400">
              Loading transactions...
            </p>
          ) : errorMessage ? (
            <div className="rounded-lg bg-red-900/20 p-5 text-red-300">
              {errorMessage}
              <button
                onClick={() => window.location.reload()}
                className="ml-3 underline"
              >
                Retry
              </button>
            </div>
          ) : filteredTransactions.length === 0 ? (
            <p className="rounded-lg bg-[#202020] p-6 text-center text-gray-400">
              No transactions found.
            </p>
          ) : (
            <div className="space-y-2">
              {filteredTransactions.map((item, index) => {
                const displayAmount = getDisplayAmount(item);
                const outgoing =
                  isTransfer(item) && item.direction === "sent";

                const status = (
                  item.status || "completed"
                ).toLowerCase();

                return (
                  <div
                    key={item._id || index}
                    className="grid min-w-[600px] grid-cols-4 items-center rounded-lg bg-[#202020] p-4 text-sm"
                  >
                    <div className="flex items-center gap-3">
                      <span className="rounded bg-gray-700 p-2">
                        <LuArrowDownUp size={16} />
                      </span>

                      <div>
                        <p className="font-semibold">
                          {item.type || "Transaction"}
                        </p>

                        <p className="text-xs text-gray-500">
                          {outgoing
                            ? `To: ${
                                item.receiver?.name ||
                                item.receiver?.email ||
                                "Recipient"
                              }`
                            : item.direction === "received"
                            ? `From: ${
                                item.sender?.name ||
                                item.sender?.email ||
                                "Sender"
                              }`
                            : item.description || ""}
                        </p>
                      </div>
                    </div>

                    <span className="text-gray-400">
                      {formatDate(item)}
                    </span>

                    <span
                      className={
                        displayAmount < 0
                          ? "font-semibold text-red-400"
                          : "font-semibold text-yellow-400"
                      }
                    >
                      {formatAmount(displayAmount)}
                    </span>

                    <span>
                      <span
                        className={`rounded-full px-3 py-1 text-xs ${
                          status === "completed"
                            ? "bg-green-900 text-green-300"
                            : status === "failed"
                            ? "bg-red-900 text-red-300"
                            : "bg-gray-700 text-gray-300"
                        }`}
                      >
                        {status}
                      </span>
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

function SummaryCard({
  title,
  value,
  color,
}: {
  title: string;
  value: string | number;
  color: string;
}) {
  return (
    <div className={`rounded-lg p-5 ${color}`}>
      <p className="text-sm text-gray-400">{title}</p>
      <h2 className="mt-2 text-2xl font-bold text-yellow-400">
        {value}
      </h2>
    </div>
  );
}
