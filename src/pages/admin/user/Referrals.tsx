
import  { useEffect, useState } from 'react';
import DashboardLayout from '../../../compontes/Layout/DashBoradLayout';
import ReferralSection from '../../../compontes/ReferralSection';
import axiosInstance from '../../../utilit/axiosInstance';
import { API_PATHS } from '../../../utilit/apiPath';

export default function Referrals() {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [referralData, setReferralData] = useState<any>({
    totalReferrals: 0,
    referralEarnings: 0,
    referrals: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dashboardResponse, referralResponse] = await Promise.all([
          axiosInstance.get(
            API_PATHS.TASKS.GET_USER_DASHBOARD_DATA1
          ),
          axiosInstance.get(
            API_PATHS.TASKS.GET_MY_REFERRALS
          ),
        ]);


        setDashboardData(dashboardResponse.data);
        setReferralData(referralResponse.data);
        console.log("DASHBOARD DATA:", dashboardResponse.data);
console.log("REFERRAL DATA:", referralResponse.data);

      } catch (error) {
        console.error('Failed to load referral data:', error);
      }
    };

    void fetchData();
  }, []);

  return (
    <DashboardLayout activeMenu="Refferals">
      <ReferralSection
        referralCode={dashboardData?.user?.referralCode || ''}
        totalReferred={Number(referralData?.totalReferrals || 0)}
        referralEarnings={Number(referralData?.referralEarnings || 0)}
        referrals={referralData?.referrals || []}
      />
    </DashboardLayout>
  );
}
