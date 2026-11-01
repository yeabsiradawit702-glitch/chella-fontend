import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import { LuArrowRight } from 'react-icons/lu';

import { useUserAuth } from '../../hooks/useUserAuth';
import { UserContext } from '../../context/UserContext';
import DashboardLayout from '../../compontes/Layout/DashBoradLayout';
import axiosInstance from '../../utilit/axiosInstance';
import { API_PATHS } from '../../utilit/apiPath';
import { addThousandsSeparator } from '../../utilit/helper';

import InfoCard from '../../Cards/InfoCards';
import TaskListTable from '../../compontes/TaskListTable';
import CustomPieChart from '../../charts/CustomPieCharts';
import CustomBarChart from '../../charts/CustomBarCharts';

const COLORS: string[] = ['#8D51FF', '#00BBDB', '#7BCE00'];

interface PieChartItem {
  status: 'pending' | 'in progress' | 'completed';
  count: number;
}

interface BarChartItem {
  priority: 'low' | 'medium' | 'high';
  count: number;
}

interface TaskDistribution {
  all?: number;
  pending?: number;
  inprogress?: number;
  completed?: number;
}

interface TaskPriorityLevels {
  low?: number;
  medium?: number;
  high?: number;
}

interface DashboardCharts {
  taskDistribution?: TaskDistribution;
  taskPriorityLeveles?: TaskPriorityLevels;
  taskPriorityLevels?: TaskPriorityLevels;
}

// Add the task properties required by TaskListTable
interface RecentTask {
  _id: string;
  title: string;
  status: string;
  createdAt?: string | Date;
}

interface DashboardResponse {
  charts?: DashboardCharts;
  recentTasks?: RecentTask[];
}

interface User {
  name?: string;
}

const Dashboard = () => {
  useUserAuth();

  const context = useContext(UserContext);
  const user = context?.user as User | undefined;

  const navigate = useNavigate();

  const [dashboardData, setDashboardData] =
    useState<DashboardResponse | null>(null);

  const [pieChartData, setPiechartData] =
    useState<PieChartItem[]>([]);

  const [barChartData, setBarChartData] =
    useState<BarChartItem[]>([]);

  const prepareChartData = (data?: DashboardCharts | null): void => {
    const taskDistribution = data?.taskDistribution ?? {};

    const taskPriorityLevels =
      data?.taskPriorityLevels ??
      data?.taskPriorityLeveles ??
      {};

    setPiechartData([
      {
        status: 'pending',
        count: taskDistribution.pending ?? 0,
      },
      {
        status: 'in progress',
        count: taskDistribution.inprogress ?? 0,
      },
      {
        status: 'completed',
        count: taskDistribution.completed ?? 0,
      },
    ]);

    setBarChartData([
      {
        priority: 'low',
        count: taskPriorityLevels.low ?? 0,
      },
      {
        priority: 'medium',
        count: taskPriorityLevels.medium ?? 0,
      },
      {
        priority: 'high',
        count: taskPriorityLevels.high ?? 0,
      },
    ]);
  };

  const getDashboardData = async (): Promise<void> => {
    try {
      const response =
        await axiosInstance.get<DashboardResponse>(
          API_PATHS.TASKS.GET_DASHBOARD_DATA
        );

      const data = response.data;

      setDashboardData(data);
      prepareChartData(data.charts);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error fetching dashboard data:', error.message);
      } else {
        console.error('Error fetching dashboard data:', error);
      }
    }
  };

  const onSeeMore = (): void => {
    navigate('/admin/tasks');
  };

  useEffect(() => {
    void getDashboardData();
  }, []);

  const taskDistribution =
    dashboardData?.charts?.taskDistribution ?? {};

  return (
    <DashboardLayout activeMenu="Dashboard">
      <div className="card my-5">
        <div className="col-span-3">
          <h2 className="text-xl md:text-2xl">
            Welcome back! {user?.name ?? ''}
          </h2>

          <p className="text-xs md:text-[13px] text-gray-400 mt-1.5">
            {moment().format('dddd Do MMM YYYY')}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mt-5">
          <InfoCard
            label="Total Tasks"
            value={addThousandsSeparator(taskDistribution.all ?? 0)}
            color="text-blue-600"
          />

          <InfoCard
            label="Pending Tasks"
            value={addThousandsSeparator(taskDistribution.pending ?? 0)}
            color="text-green-600"
          />

          <InfoCard
            label="In Progress Tasks"
            value={addThousandsSeparator(taskDistribution.inprogress ?? 0)}
            color="text-red-600"
          />

          <InfoCard
            label="Completed Tasks"
            value={addThousandsSeparator(taskDistribution.completed ?? 0)}
            color="text-yellow-700"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-4 md:my-6">
        <div className="card">
          <div className="flex items-center justify-center">
            <h5 className="font-medium">Task Distribution</h5>
          </div>

          <CustomPieChart data={pieChartData} colors={COLORS} />
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <h5 className="font-medium">Task Priority Level</h5>
          </div>

          <CustomBarChart data={barChartData} />
        </div>

        <div className="md:col-span-2">
          <div className="card">
            <div className="flex items-center justify-between">
              <h5 className="text-lg">Recent Tasks</h5>

              <button
                type="button"
                className="card-btn"
                onClick={onSeeMore}
              >
                See All
                <LuArrowRight className="text-base" />
              </button>
            </div>

            <TaskListTable
              tableData={dashboardData?.recentTasks ?? []}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;