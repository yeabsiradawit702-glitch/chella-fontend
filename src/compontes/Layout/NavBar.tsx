
import { useContext, useState } from "react";
import type { ChangeEvent } from "react";
import SideMenu from "./SideMenu";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";
import { LuWallet } from "react-icons/lu";
import { UserContext } from "../../context/UserContext";
import NotificationBell from "../NotificationBell";
import { Link } from "react-router-dom";

type Currency = "ETB" | "USD";

interface NavBarProps {
  activeMenu: string;
}

const NavBar = ({ activeMenu }: NavBarProps) => {
  const [openSideMenu, setOpenSideMenu] = useState(false);

  const {
    user,
    selectedCurrency,
    setSelectedCurrency,
  } = useContext(UserContext);

  const selectedBalance =
    selectedCurrency === "USD"
      ? user?.usdBalance
      : user?.etbBalance;

  const handleCurrencyChange = (
    event: ChangeEvent<HTMLSelectElement>
  ) => {
    const currency = event.target.value as Currency;
    setSelectedCurrency(currency);
  };

  return (
    <header className="sticky top-0 z-50 w-full min-w-0 bg-[#0b0b0b] text-white">

      <div className="flex h-14 w-full min-w-0 items-center justify-between gap-2 px-3 sm:px-5 md:px-7">

        {/* Mobile Menu */}
        <button
          type="button"
          className="flex shrink-0 items-center justify-center text-white lg:hidden"
          onClick={() => setOpenSideMenu(!openSideMenu)}
          aria-label="Toggle menu"
        >
          {openSideMenu ? (
            <HiOutlineX className="text-xl" />
          ) : (
            <HiOutlineMenu className="text-xl" />
          )}
        </button>

        {/* Wallet Balances */}
        <div className="hidden min-w-0 items-center gap-2 text-xs md:flex lg:gap-3 lg:text-[13px]">
          <span className="text-gray-400">ETB:</span>
          <span className="font-semibold text-yellow-400">
            {Number(user?.etbBalance || 0).toFixed(2)}
          </span>

          <span className="text-gray-400">USD:</span>
          <span className="font-semibold text-green-400">
            ${Number(user?.usdBalance || 0).toFixed(2)}
          </span>
        </div>

        {/* Right Side */}
        <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-3 md:gap-4">

          {/* Notification */}
          <div className="relative z-[60] shrink-0">
            <NotificationBell />
          </div>

          {/* Currency Selector */}
          <div className="hidden items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-2 py-1.5 sm:flex">
            <LuWallet className="text-lg text-yellow-400" />

            <select
              value={selectedCurrency}
              onChange={handleCurrencyChange}
              className="w-16 bg-transparent text-sm font-semibold text-white outline-none"
            >
              <option value="ETB" className="bg-[#171717]">
                ETB
              </option>
              <option value="USD" className="bg-[#171717]">
                USD
              </option>
            </select>

            <span className="text-sm font-semibold text-yellow-400">
              {Number(selectedBalance || 0).toFixed(2)}
            </span>
          </div>

          {/* User Profile */}
          <Link
            to="/user/profile"
            className="flex min-w-0 items-center gap-2 rounded-full bg-white/[0.04] px-1.5 py-1 transition hover:bg-white/[0.08] sm:px-3 sm:gap-3"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-yellow-400">
              {user?.profileImageUrl ? (
                <img
                  src={user.profileImageUrl}
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-xl font-bold text-black">
                  {(user?.name || "C").charAt(0).toUpperCase()}
                </span>
              )}
            </div>

            <div className="hidden min-w-0 flex-col items-start sm:flex">
              <span className="max-w-24 truncate text-sm font-semibold text-white md:max-w-32 md:text-base">
                {user?.name || "ChellaUser"}
              </span>

              <span className="text-[9px] text-gray-500">
                {user?.role === "admin"
                  ? "Administrator"
                  : "Premium Member"}
              </span>
            </div>
          </Link>
        </div>
      </div>

      {/* Mobile Sidebar */}
      {openSideMenu && (
        <div className="fixed inset-y-14 left-0 z-[70] w-64 border-r border-white/10 bg-[#111111] shadow-xl lg:hidden">
          <SideMenu activeMenu={activeMenu} />
        </div>
      )}
    </header>
  );
};

export default NavBar;
