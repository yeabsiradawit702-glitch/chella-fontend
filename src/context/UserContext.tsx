
import { createContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import axiosInstance from "../utilit/axiosInstance";
import { API_PATHS } from "../utilit/apiPath";

// User information returned by your backend
export interface User {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "member";
  profileImageUrl?: string;

  walletBalance?: number;
  balance?: number;
  etbBalance?: number;
  usdBalance?: number;
  totalEarned?: number;
  tasksToday?: number;
  totalRefferals?: number;

  referralCode?: string;
  referredBy?: string;

  notificationsEnabled?: boolean;
  twoFactorEnabled?: boolean;
}

export type Currency = "ETB" | "USD";

interface UserContextType {
  user: User | null;
  loading: boolean;
  updateUser: (userData: User | null) => void;
  clearUser: () => void;
  selectedCurrency: Currency;
  setSelectedCurrency: (currency: Currency) => void;
}

interface UserProviderProps {
  children: ReactNode;
}

// Give the context a type instead of initializing it as null
export const UserContext = createContext<UserContextType>({
  user: null,
  loading: true,
  updateUser: () => {},
  clearUser: () => {},
  selectedCurrency: "ETB",
  setSelectedCurrency: () => {},
});

const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(() => {
    const savedCurrency = localStorage.getItem("selectedCurrency");

    return savedCurrency === "USD" ? "USD" : "ETB";
  });

  // Save selected wallet currency
  useEffect(() => {
    localStorage.setItem("selectedCurrency", selectedCurrency);
  }, [selectedCurrency]);

  // Fetch logged-in user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axiosInstance.get(
          API_PATHS.AUTH.GET_PROFILE
        );
const userData = response.data.user ?? response.data;

console.log("PROFILE RESPONSE:", response.data);
console.log("RESTORED USER:", userData);

setUser(userData);
      } catch (error: unknown) {
        console.error("User not authenticated:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const updateUser = (userData: User | null) => {
    setUser(userData);
  };

  const clearUser = () => {
    setUser(null);
  };

  return (
    <UserContext.Provider
      value={{
        user,
        loading,
        updateUser,
        clearUser,
        selectedCurrency,
        setSelectedCurrency,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
