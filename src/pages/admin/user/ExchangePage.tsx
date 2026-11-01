
import { useContext, useEffect, useState } from "react";
import { ArrowDownUp, ArrowLeftRight, RefreshCw, Wallet } from "lucide-react";
import axiosInstance from "../../../utilit/axiosInstance";
import { UserContext } from "../../../context/UserContext";
import DashboardLayout from "../../../compontes/Layout/DashBoradLayout";

type Currency = "ETB" | "USD";

export default function ExchangePage() {
  const { user, updateUser } = useContext(UserContext);

  const [fromCurrency, setFromCurrency] = useState<Currency>("ETB");
  const [amount, setAmount] = useState("");
  const [exchangeRate, setExchangeRate] = useState(155);
  const [loading, setLoading] = useState(false);
  const [loadingRate, setLoadingRate] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const toCurrency: Currency =
    fromCurrency === "ETB" ? "USD" : "ETB";

  const fromBalance = Number(
    fromCurrency === "ETB" ? user?.etbBalance : user?.usdBalance
  );

  const amountNumber = Number(amount);

  const convertedAmount =
    fromCurrency === "ETB"
      ? amountNumber / exchangeRate
      : amountNumber * exchangeRate;

  const formattedConversion = Number.isFinite(convertedAmount)
    ? convertedAmount.toFixed(2)
    : "0.00";

  useEffect(() => {
    const getRate = async () => {
      try {
        const response = await axiosInstance.get(
          "api/transactions/exchange/rate"
        );

        const rate = Number(response.data?.usdToEtb);

        if (Number.isFinite(rate) && rate > 0) {
          setExchangeRate(rate);
        }
      } catch (err) {
        console.error("Unable to load exchange rate:", err);
        setError("Unable to load exchange rate.");
      } finally {
        setLoadingRate(false);
      }
    };

    void getRate();
  }, []);

  const handleExchange = async () => {
    setError("");
    setMessage("");

    if (!user) {
      setError("Please log in before exchanging currency.");
      return;
    }

    if (
      !Number.isFinite(amountNumber) ||
      amountNumber <= 0 ||
      !/^\d+(\.\d{1,2})?$/.test(amount.trim())
    ) {
      setError("Enter a valid amount with up to 2 decimal places.");
      return;
    }

    if (amountNumber > fromBalance) {
      setError(`Insufficient ${fromCurrency} balance.`);
      return;
    }

    if (!Number.isFinite(convertedAmount) || convertedAmount < 0.01) {
      setError("The converted amount is too small.");
      return;
    }

    setLoading(true);

    try {
      const response = await axiosInstance.post(
        "api/transactions/exchange",
        {
          fromCurrency,
          amount: amountNumber,
        }
      );

      const fromBalanceAfter = Number(response.data?.fromBalance);
      const toBalanceAfter = Number(response.data?.toBalance);

      if (
        !Number.isFinite(fromBalanceAfter) ||
        !Number.isFinite(toBalanceAfter)
      ) {
        throw new Error("The server returned invalid balance information.");
      }

      const updatedEtbBalance =
        fromCurrency === "ETB" ? fromBalanceAfter : toBalanceAfter;

      const updatedUsdBalance =
        fromCurrency === "USD" ? fromBalanceAfter : toBalanceAfter;

      updateUser({
        ...user,
        etbBalance: updatedEtbBalance,
        usdBalance: updatedUsdBalance,
      });

      setMessage(
        `Successfully exchanged ${amountNumber.toFixed(2)} ${fromCurrency} to ${toBalanceAfter.toFixed(2)} ${toCurrency}.`
      );

      setAmount("");
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Exchange failed. Please try again.";

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setAmount("");
    setError("");
    setMessage("");
  };

  return (
    <DashboardLayout activeMenu="Exchange Currency">
      <div className="min-h-screen bg-[#0b0b0b] px-4 py-8 text-white sm:px-6">
        <div className="mx-auto max-w-2xl">
          <div className="mb-8">
            <p className="mb-2 text-yellow-400">Chella Wallet</p>
            <h1 className="text-3xl font-bold">Currency Exchange</h1>
            <p className="mt-2 text-sm text-gray-400">
              Exchange between your ETB and USD wallets.
            </p>
          </div>

          <div className="mb-5 grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-white/10 bg-[#171717] p-4">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Wallet size={17} />
                ETB Balance
              </div>
              <p className="mt-2 text-xl font-bold text-yellow-400">
                {Number(user?.etbBalance || 0).toFixed(2)} ETB
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-[#171717] p-4">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Wallet size={17} />
                USD Balance
              </div>
              <p className="mt-2 text-xl font-bold text-green-400">
                ${Number(user?.usdBalance || 0).toFixed(2)}
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#171717] p-5 sm:p-7">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Exchange amount</h2>
              <ArrowDownUp className="text-yellow-400" />
            </div>

            <div className="rounded-xl border border-white/10 bg-[#0b0b0b] p-4">
              <p className="mb-3 text-xs text-gray-400">You send</p>

              <div className="flex items-center gap-3">
                <select
                  value={fromCurrency}
                  onChange={(e) => {
                    setFromCurrency(e.target.value as Currency);
                    setAmount("");
                    setError("");
                    setMessage("");
                  }}
                  className="rounded-lg border border-white/10 bg-[#171717] px-3 py-3 font-semibold text-white outline-none"
                >
                  <option value="ETB">ETB</option>
                  <option value="USD">USD</option>
                </select>

                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-transparent text-right text-2xl font-bold outline-none"
                />
              </div>

              <p className="mt-3 text-xs text-gray-500">
                Available: {Number.isFinite(fromBalance) ? fromBalance.toFixed(2) : "0.00"} {fromCurrency}
              </p>
            </div>

            <div className="my-3 flex justify-center">
              <button
                type="button"
                onClick={swapCurrencies}
                className="rounded-full border border-yellow-400/30 bg-yellow-400/10 p-3 text-yellow-400 transition hover:bg-yellow-400/20"
                title="Swap currencies"
              >
                <ArrowLeftRight size={20} />
              </button>
            </div>

            <div className="rounded-xl border border-white/10 bg-[#0b0b0b] p-4">
              <p className="mb-3 text-xs text-gray-400">You receive</p>

              <div className="flex items-center justify-between gap-3">
                <span className="rounded-lg border border-white/10 bg-[#171717] px-3 py-3 font-semibold">
                  {toCurrency}
                </span>

                <span className="break-all text-right text-2xl font-bold text-green-400">
                  {formattedConversion}
                </span>
              </div>

              <p className="mt-3 text-xs text-gray-500">
                Your estimated converted amount
              </p>
            </div>

            <div className="my-5 rounded-lg border border-yellow-400/20 bg-yellow-400/[0.05] p-4">
              <p className="text-sm text-gray-400">Current exchange rate</p>
              <p className="mt-1 font-semibold text-yellow-300">
                {loadingRate
                  ? "Loading rate..."
                  : `1 USD = ${exchangeRate.toFixed(2)} ETB`}
              </p>
            </div>

            {error && (
              <p className="mb-4 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
                {error}
              </p>
            )}

            {message && (
              <p className="mb-4 rounded-lg border border-green-500/20 bg-green-500/10 p-3 text-sm text-green-400">
                {message}
              </p>
            )}

            <button
              type="button"
              onClick={() => void handleExchange()}
              disabled={loading || loadingRate || !amount.trim()}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-yellow-400 px-5 py-4 font-bold text-black transition hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RefreshCw className="animate-spin" size={18} />
                  Exchanging...
                </>
              ) : (
                <>
                  <ArrowDownUp size={18} />
                  Exchange {fromCurrency} to {toCurrency}
                </>
              )}
            </button>
          </div>

          <p className="mt-5 text-center text-xs text-gray-500">
            Review the exchange rate and amount before confirming.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
