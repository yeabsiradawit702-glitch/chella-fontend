
import { LuUsers, LuCopy, LuLink, LuShare2 } from "react-icons/lu";
import toast from "react-hot-toast";

interface Referral {
  _id: string;
  username?: string;
  name?: string;
  joinedDate?: string | Date;
  rewardEarned?: number;
}

interface ReferralSectionProps {
  referralCode?: string;
  totalReferred?: number;
  referralEarnings?: number;
  referrals?: Referral[];
}

const ReferralSection = ({
  referralCode = "",
  totalReferred = 0,
  referralEarnings = 0,
  referrals = [],
}: ReferralSectionProps) => {
  const shareLink = referralCode
    ? `${window.location.origin}/register?ref=${encodeURIComponent(referralCode)}`
    : "";

  const copyText = async (text: string) => {
    if (!text) {
      toast.error("Referral code is not available");
      return;
    }

    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied successfully!");
    } catch {
      toast.error("Could not copy. Please copy it manually.");
    }
  };

  const shareTwitter = () => {
    if (!shareLink) return;

    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        "Join me! Use my referral link:"
      )}&url=${encodeURIComponent(shareLink)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const shareWhatsApp = () => {
    if (!shareLink) return;

    window.open(
      `https://wa.me/?text=${encodeURIComponent(
        `Join using my referral link: ${shareLink}`
      )}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <div className="space-y-6 bg-[#0c0c0c] p-4 text-white md:p-6">
      <div>
        <h2 className="text-xl font-bold">Refer Friends</h2>
        <p className="mt-1 text-sm text-gray-400">
          Earn rewards when your friends join and complete qualifying tasks.
        </p>
      </div>

      {/* Referral code */}
      <section className="rounded-lg bg-[#49400c] p-5">
        <h3 className="mb-3 font-semibold">Your Referral Code</h3>

        <div className="rounded-lg bg-[#292929] p-2">
          <p className="mb-2 text-xs text-gray-400">
            Share this code with your friends
          </p>

          <div className="flex items-center justify-between gap-3 rounded bg-[#202020] p-3">
            <span className="break-all font-semibold text-yellow-400">
              {referralCode || "Loading referral code..."}
            </span>

            <button
              type="button"
              onClick={() => copyText(referralCode)}
              className="flex shrink-0 items-center gap-1 rounded bg-yellow-400 px-3 py-1.5 text-sm font-semibold text-black hover:bg-yellow-300"
            >
              <LuCopy size={14} /> Copy
            </button>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={shareTwitter}
            className="rounded bg-yellow-400 px-3 py-2 text-sm font-semibold text-black hover:bg-yellow-300"
          >
            <LuShare2 className="mr-1 inline" />
            Share on Twitter
          </button>

          <button
            type="button"
            onClick={shareWhatsApp}
            className="rounded bg-yellow-400 px-3 py-2 text-sm font-semibold text-black hover:bg-yellow-300"
          >
            Share on WhatsApp
          </button>

          <button
            type="button"
            onClick={() => copyText(shareLink)}
            className="rounded border border-yellow-400 px-3 py-2 text-sm text-yellow-400 hover:bg-yellow-400 hover:text-black"
          >
            <LuLink className="mr-1 inline" />
            Share Link
          </button>
        </div>
      </section>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-lg bg-[#202020] p-5">
          <p className="text-sm text-gray-400">Total Referred</p>
          <h3 className="mt-2 text-2xl font-bold text-yellow-400">
            {totalReferred}
          </h3>
          <p className="text-xs text-gray-500">Friends joined</p>
        </div>

        <div className="rounded-lg bg-[#202020] p-5">
          <p className="text-sm text-gray-400">Earnings from Referrals</p>
          <h3 className="mt-2 text-2xl font-bold text-green-400">
            {referralEarnings} ETB
          </h3>
          <p className="text-xs text-gray-500">Total rewards earned</p>
        </div>

        <div className="rounded-lg bg-[#202020] p-5">
          <p className="text-sm text-gray-400">Potential Earnings</p>
          <h3 className="mt-2 text-2xl font-bold text-purple-400">
            {totalReferred * 20} ETB
          </h3>
          <p className="text-xs text-gray-500">
            Example estimate at 20 ETB per referral
          </p>
        </div>
      </div>

      {/* Referral table */}
      <section className="overflow-x-auto rounded-lg bg-[#202020] p-5">
        <h3 className="mb-4 font-semibold text-yellow-400">
          <LuUsers className="mr-2 inline" />
          Your Referrals
        </h3>

        <table className="w-full min-w-[480px] text-left text-sm">
          <thead>
            <tr className="border-b border-gray-700 text-gray-400">
              <th className="py-3">Username</th>
              <th className="py-3">Joined Date</th>
              <th className="py-3">Reward Earned</th>
            </tr>
          </thead>

          <tbody>
            {referrals.length > 0 ? (
              referrals.map((referral) => (
                <tr key={referral._id} className="border-b border-gray-800">
                  <td className="py-3">
                    {referral.username || referral.name || "User"}
                  </td>

                  <td className="py-3 text-gray-400">
                    {referral.joinedDate
                      ? new Date(referral.joinedDate).toLocaleDateString()
                      : "—"}
                  </td>

                  <td className="py-3 text-yellow-400">
                    +{referral.rewardEarned || 0} ETB
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="py-6 text-center text-gray-500">
                  No referrals yet. Share your code with friends!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

      {/* How it works */}
      <section className="rounded-lg bg-[#202020] p-5">
        <h3 className="mb-6 font-semibold">How It Works</h3>

        <div className="grid grid-cols-1 gap-6 text-center sm:grid-cols-3">
          {[
            {
              number: 1,
              title: "Share Your Code",
              description: "Copy and share your referral code with friends.",
            },
            {
              number: 2,
              title: "They Register",
              description: "Your friends sign up using your referral link.",
            },
            {
              number: 3,
              title: "You Earn",
              description: "Earn rewards when referral requirements are met.",
            },
          ].map((step) => (
            <div key={step.number}>
              <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-yellow-500/20 font-bold text-yellow-400">
                {step.number}
              </div>

              <h4 className="font-semibold">{step.title}</h4>

              <p className="mt-2 text-sm text-gray-400">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ReferralSection;
