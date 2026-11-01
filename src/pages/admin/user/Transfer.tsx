
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CircleAlert,
  CircleCheck,
  LoaderCircle,
  Mail,
  Send,
  ShieldCheck,
  Wallet,
  Zap,
} from "lucide-react";

import axiosInstance from "../../../utilit/axiosInstance";
import { UserContext } from "../../../context/UserContext";
import DashboardLayout from "../../../compontes/Layout/DashBoradLayout";

type TransferStep = "transfer" | "reviewtransfer" | "confirm";

export default function TransferPage() {
  const {
    user,
    updateUser,
    selectedCurrency,
  } = useContext(UserContext);

  const [step, setStep] = useState<TransferStep>("transfer");
  const [receiverEmail, setReceiverEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [availableBalance, setAvailableBalance] = useState<number | null>(null);
  const [senderBalance, setSenderBalance] = useState<number | null>(null);
  const [transactionId, setTransactionId] = useState("");
  const [error, setError] = useState("");
  const [isSending, setIsSending] = useState(false);

  // Select the correct wallet balance.
  const balanceField =
    selectedCurrency === "USD" ? "usdBalance" : "etbBalance";

  const currency = selectedCurrency === "USD" ? "USD" : "ETB";

  const transferAmount = Number(amount);

  const amountIsValid =
    amount.trim() !== "" &&
    Number.isFinite(transferAmount) &&
    transferAmount > 0 &&
    /^\d+(\.\d{1,2})?$/.test(amount.trim());

  const canReview =
    receiverEmail.trim() !== "" &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(receiverEmail.trim()) &&
    amountIsValid &&
    (availableBalance === null || transferAmount <= availableBalance);

  const quickAmounts = [10, 20, 50, 100];

  // Load the selected wallet balance from UserContext.
  useEffect(() => {
    const balance = user?.[balanceField];

    if (balance === undefined || balance === null) {
      setAvailableBalance(null);
    } else {
      setAvailableBalance(Number(balance));
    }

    // Clear the previous amount when switching currencies.
    setAmount("");
    setError("");
  }, [user, balanceField]);

  const handleReview = () => {
    setError("");

    if (
      !receiverEmail.trim() ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(receiverEmail.trim())
    ) {
      setError("Enter a valid receiver email address.");
      return;
    }

    if (!amountIsValid) {
      setError(
        `Enter a valid amount greater than 0 ${currency}, with up to 2 decimal places.`
      );
      return;
    }

    if (
      availableBalance !== null &&
      transferAmount > availableBalance
    ) {
      setError(`You don't have enough ${currency} balance.`);
      return;
    }

    setStep("reviewtransfer");
  };

  const handleConfirmTransfer = async () => {
    setError("");
    setIsSending(true);

    try {
      const response = await axiosInstance.post(
        "api/transactions/transfer",
        {
          receiverEmail: receiverEmail.trim().toLowerCase(),
          amount: transferAmount,
          currency: currency,
        }
      );

      const nextBalance = Number(response.data?.senderBalance);

      setSenderBalance(
        Number.isFinite(nextBalance) ? nextBalance : null
      );

      setTransactionId(
        String(
          response.data?.transaction?._id ??
            response.data?.transaction?.id ??
            "Completed"
        )
      );

      if (Number.isFinite(nextBalance)) {
        setAvailableBalance(nextBalance);

        if (user) {
          updateUser({
            ...user,
            [balanceField]: nextBalance,
          });
        }
      }

      setStep("confirm");
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        "Transfer failed. Please check the details and try again.";

      setError(message);
    } finally {
      setIsSending(false);
    }
  };

  const resetTransfer = () => {
    setReceiverEmail("");
    setAmount("");
    setTransactionId("");
    setSenderBalance(null);
    setError("");
    setStep("transfer");
  };

  const formattedBalance =
    availableBalance === null
      ? "—"
      : availableBalance.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });

  const formattedAmount = transferAmount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <DashboardLayout activeMenu='Transfer' >
      <div className="mx-auto w-full max-w-4xl min-h-screen bg-[#0b0b0b] px-4 py-5 text-white sm:px-6">

        {/* Page heading */}
        <div className="mb-8">
          <p className="mb-2 text-2xl font-medium text-yellow-400">
            Transfer balance
          </p>

          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            {step === "transfer"
              ? "Transfer balance"
              : step === "reviewtransfer"
                ? "Review transfer"
                : "Transfer successful"}
          </h1>

          <p className="mt-2 max-w-2xl text-sm text-gray-400 sm:text-base">
            {step === "transfer"
              ? `Send your ${currency} earnings securely to another Chella user.`
              : step === "reviewtransfer"
                ? "Check the recipient and amount carefully before confirming."
                : "Your transfer has been completed successfully."}
          </p>
        </div>

        {/* Progress steps */}
        <div className="mb-8 grid grid-cols-3 gap-2 sm:gap-4">
          {[
            { number: "01", label: "Transfer", active: step === "transfer" },
            { number: "02", label: "Review", active: step === "reviewtransfer" },
            { number: "03", label: "Complete", active: step === "confirm" },
          ].map((item, index) => {
            const completed =
              (step === "reviewtransfer" && index === 0) ||
              (step === "confirm" && index < 2);

            return (
              <div key={item.number} className="flex items-center gap-2 sm:gap-3">
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-xs font-bold ${
                    item.active || completed
                      ? "border-yellow-400 bg-yellow-400 text-black"
                      : "border-white/10 bg-white/[0.03] text-gray-500"
                  }`}
                >
                  {completed ? <Check size={16} /> : item.number}
                </div>

                <span
                  className={`text-xs font-medium sm:text-sm ${
                    item.active || completed
                      ? "text-white"
                      : "text-gray-500"
                  }`}
                >
                  {item.label}
                </span>

                {index < 2 && (
                  <div className="hidden h-px flex-1 bg-white/10 sm:block" />
                )}
              </div>
            );
          })}
        </div>

        {/* Error */}
        {error && (
          <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
            <CircleAlert className="mt-0.5 shrink-0" size={18} />
            <p>{error}</p>
          </div>
        )}

        {/* STEP 1: Transfer */}
        {step === "transfer" && (
          <div className="grid gap-4">

            <section className="max-w-2xl rounded-xl border border-white/10 bg-[#171717] p-4 sm:p-5">
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-xl bg-yellow-400/10 p-3 text-yellow-400">
                  <Send size={22} />
                </div>

                <div>
                  <h2 className="font-semibold">Transfer details</h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Who are you sending money to?
                  </p>
                </div>
              </div>

              <div className="space-y-4">

                {/* Selected currency */}
                <div className="rounded-xl border border-yellow-400/20 bg-yellow-400/[0.05] p-3">
                  <p className="text-xs text-gray-400">
                    Selected wallet currency
                  </p>
                  <p className="mt-1 font-semibold text-yellow-300">
                    {currency}
                  </p>
                </div>

                {/* Receiver email */}
                <div>
                  <label
                    htmlFor="receiverEmail"
                    className="mb-2 block text-sm font-medium text-gray-300"
                  >
                    Receiver email
                  </label>

                  <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#0b0b0b] px-4 focus-within:border-yellow-400/60">
                    <Mail className="shrink-0 text-gray-500" size={18} />

                    <input
                      id="receiverEmail"
                      type="email"
                      value={receiverEmail}
                      onChange={(event) =>
                        setReceiverEmail(event.target.value)
                      }
                      placeholder="name@example.com"
                      autoComplete="email"
                      className="h-10 w-full bg-transparent text-sm text-white outline-none placeholder:text-gray-600"
                    />
                  </div>

                  <p className="mt-2 text-xs text-gray-500">
                    Enter the email address registered to the receiver's Chella account.
                  </p>
                </div>

                {/* Amount */}
                <div>
                  <label
                    htmlFor="amount"
                    className="mb-2 block text-sm font-medium text-gray-300"
                  >
                    Amount to send
                  </label>

                  <div className="flex items-center rounded-xl border border-white/10 bg-[#0b0b0b] px-4 focus-within:border-yellow-400/60">
                    <input
                      id="amount"
                      type="number"
                      min="0.01"
                      step="0.01"
                      value={amount}
                      onChange={(event) => setAmount(event.target.value)}
                      placeholder="0.00"
                      className="h-11 w-full bg-transparent text-lg font-medium text-white outline-none placeholder:text-gray-700"
                    />

                    <span className="ml-3 rounded-lg bg-yellow-400/10 px-3 py-2 text-sm font-semibold text-yellow-400">
                      {currency}
                    </span>
                  </div>

                  <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                    <span>Quick amount</span>

                    <span>
                      {availableBalance === null
                        ? "Balance checked by server"
                        : `Available: ${formattedBalance} ${currency}`}
                    </span>
                  </div>

                  {/* Quick amounts */}
                  <div className="mt-3 grid grid-cols-4 gap-2">
                    {quickAmounts.map((quickAmount) => (
                      <button
                        key={quickAmount}
                        type="button"
                        onClick={() => {
                          setAmount(String(quickAmount));
                          setError("");
                        }}
                        className={`rounded-lg border px-2 py-2.5 text-sm font-medium transition ${
                          amount === String(quickAmount)
                            ? "border-yellow-400 bg-yellow-400/10 text-yellow-300"
                            : "border-white/10 bg-white/[0.02] text-gray-300 hover:border-yellow-400/40"
                        }`}
                      >
                        {quickAmount} {currency}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Review button */}
                <button
                  type="button"
                  onClick={handleReview}
                  disabled={!canReview}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-yellow-400 px-5 py-3 font-semibold text-black transition hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Review transfer <ArrowRight size={18} />
                </button>
              </div>
            </section>

            {/* Sidebar */}
            <aside className="space-y-4">

              <div className="rounded-2xl border border-yellow-400/20 bg-gradient-to-br from-yellow-400/15 to-[#171717] p-5 sm:p-6">
                <div className="flex items-center gap-3 text-yellow-300">
                  <Wallet size={21} />
                  <span className="text-sm font-medium">
                    Available balance
                  </span>
                </div>

                <p className="mt-2 text-2xl font-semibold tracking-tight">
                  {formattedBalance}{" "}
                  <span className="text-base font-medium text-yellow-300">
                    {currency}
                  </span>
                </p>

                <p className="mt-2 text-xs text-gray-400">
                  Your actual balance is validated by the server when the transfer is submitted.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-[#141414] p-5">
                <h3 className="mb-4 font-semibold">
                  Transfer information
                </h3>

                <div className="space-y-4">
                  <div className="flex gap-3">
                    <span className="rounded-lg bg-green-500/10 p-2 text-green-400">
                      <Zap size={17} />
                    </span>
                    <div>
                      <p className="text-sm font-medium">Fast transfer</p>
                      <p className="mt-1 text-xs leading-5 text-gray-500">
                        The transfer is processed immediately when accepted by the server.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <span className="rounded-lg bg-blue-500/10 p-2 text-blue-400">
                      <ShieldCheck size={17} />
                    </span>
                    <div>
                      <p className="text-sm font-medium">
                        Review before sending
                      </p>
                      <p className="mt-1 text-xs leading-5 text-gray-500">
                        Double-check the receiver email and amount before confirming.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <span className="rounded-lg bg-yellow-400/10 p-2 text-yellow-300">
                      <CircleAlert size={17} />
                    </span>
                    <div>
                      <p className="text-sm font-medium">
                        Transfers may not be reversible
                      </p>
                      <p className="mt-1 text-xs leading-5 text-gray-500">
                        Only send money to someone you trust.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        )}

        {/* STEP 2: Review */}
        {step === "reviewtransfer" && (
          <section className="mx-auto max-w-md rounded-xl border border-white/10 bg-[#171717] p-4 sm:p-5">

            <div className="mb-5 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-yellow-400/10 text-yellow-300">
                <ArrowLeft size={24} />
              </div>

              <h2 className="text-xl font-semibold">
                Confirm your transfer
              </h2>

              <p className="mt-2 text-sm text-gray-400">
                Please review the information below.
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-[#0b0b0b] p-4 sm:p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/5 text-gray-300">
                  <Wallet size={19} />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-xs text-gray-500">From</p>
                  <p className="mt-1 font-medium">
                    Your Chella {currency} wallet
                  </p>
                </div>

                <span className="text-xs text-gray-500">Sender</span>
              </div>

              <div className="ml-5 my-3 h-8 border-l border-dashed border-white/20" />

              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-yellow-400/10 text-yellow-300">
                  <Mail size={19} />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-xs text-gray-500">To</p>
                  <p className="mt-1 break-all font-medium">
                    {receiverEmail}
                  </p>
                </div>

                <span className="text-xs text-yellow-300">
                  Receiver
                </span>
              </div>
            </div>

            <div className="my-4 rounded-lg border border-yellow-400/25 bg-yellow-400/[0.06] p-4 text-center">
              <p className="text-sm text-gray-400">
                You are sending
              </p>

              <p className="mt-2 text-4xl font-bold text-yellow-300">
                {formattedAmount}{" "}
                <span className="text-lg">{currency}</span>
              </p>

              <p className="mt-2 text-xs text-gray-500">
                No extra transfer fee is added by this screen.
              </p>
            </div>

            <div className="mb-4 flex items-start gap-3 rounded-lg border border-yellow-500/20 bg-yellow-500/[0.06] p-3 text-xs text-yellow-300">
              <CircleAlert size={18} className="mt-0.5 shrink-0" />
              <p>
                Make sure the receiver email and amount are correct. Transfers may not be reversible.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setError("");
                  setStep("transfer");
                }}
                disabled={isSending}
                className="flex items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-3 font-medium text-gray-300 transition hover:bg-white/5 disabled:opacity-50"
              >
                <ArrowLeft size={17} /> Edit details
              </button>

              <button
                type="button"
                onClick={() => void handleConfirmTransfer()}
                disabled={isSending}
                className="flex items-center justify-center gap-2 rounded-xl bg-yellow-400 px-4 py-3 font-semibold text-black transition hover:bg-yellow-300 disabled:cursor-wait disabled:opacity-60"
              >
                {isSending ? (
                  <LoaderCircle className="animate-spin" size={18} />
                ) : (
                  <Check size={18} />
                )}

                {isSending ? "Processing..." : "Confirm transfer"}
              </button>
            </div>
          </section>
        )}

        {/* STEP 3: Success */}
        {step === "confirm" && (
          <section className="mx-auto max-w-2xl rounded-2xl border border-green-500/20 bg-[#141414] p-5 text-center sm:p-8">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10 text-green-400">
              <CircleCheck size={34} />
            </div>

            <p className="mt-5 text-sm font-medium uppercase tracking-[0.18em] text-green-400">
              Transfer completed
            </p>

            <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
              Transfer successful!
            </h2>

            <p className="mt-2 text-sm text-gray-400">
              Your money has been sent successfully.
            </p>

            <div className="mt-7 rounded-2xl border border-white/10 bg-[#0b0b0b] p-5 sm:p-6">

              <p className="text-sm text-gray-500">Sent to</p>
              <p className="mt-1 break-all font-semibold">
                {receiverEmail}
              </p>

              <p className="mt-6 text-sm text-gray-500">
                Amount sent
              </p>

              <p className="mt-1 text-4xl font-bold text-yellow-300">
                {formattedAmount}{" "}
                <span className="text-lg">{currency}</span>
              </p>

              <div className="my-6 h-px bg-white/10" />

              <div className="flex items-center justify-between gap-4 text-left">
                <span className="text-sm text-gray-500">
                  Remaining balance
                </span>

                <span className="font-semibold">
                  {senderBalance === null
                    ? "Updated in wallet"
                    : `${senderBalance.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })} ${currency}`}
                </span>
              </div>

              <div className="mt-4 flex items-start justify-between gap-4 text-left">
                <span className="text-sm text-gray-500">
                  Transaction ID
                </span>

                <span className="max-w-[65%] break-all text-right text-xs text-gray-300">
                  {transactionId}
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Link
                to="/Dashboard"
                className="flex items-center justify-center rounded-xl border border-white/10 px-4 py-3 font-medium text-gray-200 transition hover:bg-white/5"
              >
                Go to dashboard
              </Link>

              <button
                type="button"
                onClick={resetTransfer}
                className="flex items-center justify-center gap-2 rounded-xl bg-yellow-400 px-4 py-3 font-semibold text-black transition hover:bg-yellow-300"
              >
                <Send size={17} /> New transfer
              </button>
            </div>
          </section>
        )}

        <p className="mt-8 text-center text-xs text-gray-600">
          Chella wallet · Keep your account details secure
        </p>
      </div>
    </DashboardLayout>
  );
}
