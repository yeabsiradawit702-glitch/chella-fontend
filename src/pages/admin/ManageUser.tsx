
import { useEffect, useState } from 'react';
import DashboardLayout from '../../compontes/Layout/DashBoradLayout';

import axiosInstance from '../../utilit/axiosInstance';
import { API_PATHS } from '../../utilit/apiPath';
import { LuFileSpreadsheet } from 'react-icons/lu';
import UserCard from '../../Cards/UserCard';

import toast from 'react-hot-toast';

interface User {
  _id: string;
  name: string;
  email: string;
  profileImageUrl?: string;
  role?: string;
  [key: string]: unknown;
}

const Manageuser = () => {
  const [allUsers, setAllUsers] = useState<User[]>([]);

  const getAllUsers = async () => {
    try {
      const response = await axiosInstance.get<User[]>(
        API_PATHS.USERS.GET_ALL_USERS
      );

      if (response.data?.length > 0) {
        setAllUsers(response.data);
      }
    } catch (error: unknown) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    void getAllUsers();
  }, []);

  // Download user report
  const handelDownloadTReport = async () => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.REPORTS.EXPORT_USERS,
        {
          responseType: 'blob',
        }
      );

      const url = window.URL.createObjectURL(
        new Blob([response.data])
      );

      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'user_details.xlsx');

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (error: unknown) {
      console.error('Error when downloading:', error);
      toast.error('Failed to download. Please try again.');
    }
  };

  return (
    <DashboardLayout activeMenu="Team Members">
      <div className="mt-5 mb-10">
        <div className="flex md:flex-row md:items-center justify-between">
          <h2 className="text-xl md:text-xl font-medium">
            Team Members
          </h2>

          <button
            type="button"
            className="flex md:flex download-btn"
            onClick={handelDownloadTReport}
          >
            <LuFileSpreadsheet className="text-lg" />
            Download Report
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {allUsers.map((user) => (
            <UserCard key={user._id} userInfo={user} />
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Manageuser;
