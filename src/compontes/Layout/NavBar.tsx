
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
    <header className="sticky top-0 z-50 min-w-0 left-0 bg-[#0b0b0b] w-full text-white">
      <div className="h-14 flex items-center justify-between sm:px-7">
        <button
          type="button"
          className="lg:hidden text-white"
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
        <div className="hidden sm:flex items-center gap-3 text-[13px]">
          <span className="text-gray-400">ETB:</span>
          <span className="text-yellow-400 font-semibold">
            {Number(user?.etbBalance || 0).toFixed(2)}
          </span>

          <span className="text-gray-400">USD:</span>
          <span className="text-green-400 font-semibold">
            ${Number(user?.usdBalance || 0).toFixed(2)}
          </span>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3 sm:gap-4">
          <NotificationBell />

          {/* Currency Selector */}
          <div className="hidden sm:flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-2 py-1.5">
            <LuWallet className="text-yellow-400 text-lg" />

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
            className="flex items-center gap-2 sm:gap-3 rounded-full bg-white/[0.04] hover:bg-white/[0.08] py-1 px-2 sm:px-3"
          >
            <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center overflow-hidden shrink-0">
              {user?.profileImageUrl ? (
                <img
                  src={user.profileImageUrl}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-black font-bold text-2xl">
                  {(user?.name || "C").charAt(0).toUpperCase()}
                </span>
              )}
            </div>

            <div className="flex flex-col items-start">
              <span className="text-[16px] font-semibold text-white">
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
        <div className="fixed inset-y-14 left-0 z-50 w-64 bg-[#111111] border-r border-white/10 shadow-xl lg:hidden">
          <SideMenu activeMenu={activeMenu} />
        </div>
      )}
    </header>
  );
};

export default NavBar;
