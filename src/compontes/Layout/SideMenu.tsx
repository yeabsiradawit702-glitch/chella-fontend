
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import {
  SIDE_MENU_DATA,
  SIDE_MENU_USER_DATA,
} from "../../utilit/data";

interface SideMenuProps {
  activeMenu: string;
}

interface MenuItem {
  path: string;
  lable: string;
  icon: React.ElementType;
}

const SideMenu = ({ activeMenu }: SideMenuProps) => {
  const { user, clearUser } = useContext(UserContext);
  const [sideMenuData, setSideMenuData] = useState<MenuItem[]>([]);
  const navigate = useNavigate();

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    clearUser();
    navigate("/login", { replace: true });
  };

  // Handle menu navigation
  const handleClick = (route: string) => {
    if (route === "logout") {
      handleLogout();
      return;
    }

    navigate(route);
  };

  // Load menu depending on user role
  useEffect(() => {
    if (user) {
      setSideMenuData(
        user.role === "admin"
          ? SIDE_MENU_DATA
          : SIDE_MENU_USER_DATA
      );
    } else {
      setSideMenuData([]);
    }
  }, [user]);

  return (
    <div className="fixed left-0 top-0 z-50 flex h-screen w-64 flex-col overflow-y-auto border-r border-white/10 bg-[#0b0b0b] p-3">
      {/* Sidebar Header */}
      <div className="mb-7 flex flex-col items-start px-3 pt-5">
        <h1 className="text-3xl font-bold tracking-wide text-yellow-300">
          Chella
        </h1>
      </div>

      {/* Dynamic Menu */}
      <nav className="flex-1 space-y-2">
        {sideMenuData.map((item, index) => (
          <button
            key={`menu_${index}`}
            type="button"
            onClick={() => handleClick(item.path)}
            className={`flex w-full items-center gap-4 rounded-lg px-6 py-3 text-left text-sm font-medium transition-colors ${
              activeMenu === item.lable
                ? "border border-yellow-300 bg-yellow-300 text-black"
                : "text-gray-300 hover:bg-gray-800 hover:text-yellow-300"
            }`}
          >
            <item.icon size={20} />
            <span>{item.lable}</span>
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-white/10 px-3 py-4">
        <p className="text-xs text-gray-500">
          Chella APP
        </p>
      </div>
    </div>
  );
};

export default SideMenu;
