import { createContext, useState, useEffect } from "react";
import axiosInstance from "../utilit/axiosInstance";
import { API_PATHS } from "../utilit/apiPath";

export const UserContext = createContext(null);

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axiosInstance.get(
          API_PATHS.AUTH.GET_PROFILE
        );

        setUser(response.data.user ?? response.data);
      } catch (error) {
        console.error(
          "User not authenticated:",
          error.response?.data || error.message
        );

        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const updateUser = (userData) => {
    setUser(userData);
  };

  const clearUser = () => {
    setUser(null);
  };

  return (
    <UserContext.Provider
      value={{ user, loading, updateUser, clearUser }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;

