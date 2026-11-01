
import { useContext, useEffect, useState } from 'react';
import DashboardLayout from '../../../compontes/Layout/DashBoradLayout';
import { useUserAuth } from '../../../hooks/useUserAuth';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../../utilit/axiosInstance';
import { API_PATHS } from '../../../utilit/apiPath';
import InfoCard from '../../../Cards/InfoCards';
import { addThousandsSeparator } from '../../../utilit/helper';
import TaskCard from '../../../Cards/TaskCard';
import { UserContext } from '../../../context/UserContext';

interface ChecklistItem {
  text: string;
  completed: boolean;
}

interface AssignedUser {
  _id?: string;
  name?: string;
  profileImageUrl?: string;
}

interface Task {
  _id: string;
  title: string;
  description: string;
  status: string;
  progress?: number;
  createdAt: string;
  dueDate?: string | null;
  category: string;
  reward: number;
  targetUrl?: string;
  assignedTo?: AssignedUser[];
  toChecklist?: ChecklistItem[];
  attachments?: unknown[];
  attachements?: unknown[];
}

interface TaskTab {
  label: string;
  count: number;
}

interface TaskDistribution {
  all?: number;
  pending?: number;
  inprogress?: number;
  completed?: number;
}

interface DashboardData {
  charts?: {
    taskDistribution?: TaskDistribution;
  };
  tasks?: Task[];
}

interface TasksResponse {
  tasks?: Task[];
  statusSummary?: {
    all?: number;
    pendingTasks?: number;
    completedTasks?: number;
  };
}

interface TaskStatusTabsProps {
  tabs: TaskTab[];
  activeTab: string;
  setActiveTab: (value: string) => void;
}

export default function Tasks() {
  useUserAuth();

  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const [allTasks, setAllTasks] = useState<Task[]>([]);
  const [tabs, setTabs] = useState<TaskTab[]>([]);
  const [filterStatus, setFilterStatus] = useState('All');
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);

  const getAllTasks = async (status: string): Promise<void> => {
    try {
      const response = await axiosInstance.get<TasksResponse>(
        API_PATHS.TASKS.GET_ALL_TASKS,
        {
          params: {
            status: status === 'All' ? '' : status,
          },
        }
      );

      const tasks = response.data?.tasks ?? [];
      setAllTasks(tasks);

      const statusSummary = response.data?.statusSummary ?? {};

      const statusArray: TaskTab[] = [
        { label: 'All', count: statusSummary.all ?? 0 },
        { label: 'pending', count: statusSummary.pendingTasks ?? 0 },
        { label: 'completed', count: statusSummary.completedTasks ?? 0 },
      ];

      setTabs(statusArray);
    } catch (error: unknown) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleClick = (taskId: string): void => {
    navigate(`/user/taskdetails/${taskId}`);
  };

  useEffect(() => {
    getAllTasks(filterStatus);
  }, [filterStatus]);

  const getDashboardData = async (): Promise<void> => {
    try {
      const response = await axiosInstance.get<DashboardData>(
        API_PATHS.TASKS.GET_USER_DASHBOARD_DATA
      );

      console.log('Logged-in user:', user);
      console.log('User task API response:', response.data);

      if (response.data) {
        setDashboardData(response.data);
      }
    } catch (error: unknown) {
      console.error('Error fetching user dashboard:', error);
    }
  };

  useEffect(() => {
    getDashboardData();
  }, []);

  const distribution = dashboardData?.charts?.taskDistribution;

  return (
    <DashboardLayout activeMenu="Tasks">
      <div className="my-5">
        <div className="flex flex-col lg:flex-col sm:flex-col lg:items-center">
          <div className="flex items-center justify-between gap-3">
            <div className="grid grid-cols-2 sm:grid-cols md:grid-cols-4 gap-3 md:gap-6 mt-5">
              <InfoCard
                label="Total Tasks"
                value={addThousandsSeparator(distribution?.all ?? 0)}
                color="text-blue-600"
              />

              <InfoCard
                label="pending Tasks"
                value={addThousandsSeparator(distribution?.pending ?? 0)}
                color="text-green-600"
              />

              <InfoCard
                label="in progress Tasks"
                value={addThousandsSeparator(distribution?.inprogress ?? 0)}
                color="text-red-600"
              />

              <InfoCard
                label="completed Tasks"
                value={addThousandsSeparator(distribution?.completed ?? 0)}
                color="text-yellow-600"
              />
            </div>
          </div>

          {tabs[0]?.count > 0 && (
            <div className="flex items-center gap-3">
              <TaskStatuTabs
                tabs={tabs}
                activeTab={filterStatus}
                setActiveTab={setFilterStatus}
              />
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-1 gap-4 mt-4">
          {allTasks.map((item) => {
            const totalTodos = item.toChecklist?.length ?? 0;

            const completedTodos =
              item.toChecklist?.filter((todo) => todo.completed).length ?? 0;

            const progress =
              totalTodos > 0
                ? Math.round((completedTodos / totalTodos) * 100)
                : item.progress ?? 0;

            const attachmentCount =
              item.attachments?.length ?? item.attachements?.length ?? 0;

            return (
              <TaskCard
                key={item._id}
                title={item.title}
                description={item.description}
                status={item.status}
                progress={progress}
                createdAt={item.createdAt}
                dueDate={item.dueDate ?? ''}
                category={item.category}
                reward={item.reward}
                targetUrl={item.targetUrl ?? ''}
                assignTo={item.assignedTo?.map(
                  (assignedUser) => assignedUser.profileImageUrl ?? ''
                ) ?? []}
                attachementCount={attachmentCount}
                toChecklist={item.toChecklist ?? []}
                completedTodoCount={completedTodos}
                onClick={() => handleClick(item._id)}
              />
            );
          })}

          {allTasks.length === 0 && (
            <p className="text-center text-gray-500 py-8">
              No tasks found.
            </p>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

const TaskStatuTabs = ({
  tabs,
  activeTab,
  setActiveTab,
}: TaskStatusTabsProps) => {
  return (
    <div className="my-2">
      <div className="flex">
        {tabs.map((tab) => (
          <button
            key={tab.label}
            type="button"
            className={`relative px-3 md:px-4 py-2 text-sm font-medium ${
              activeTab === tab.label
                ? 'text-black bg-yellow-400 rounded-sm p-1'
                : 'text-gray-500 hover:text-gray-700'
            } cursor-pointer`}
            onClick={() => setActiveTab(tab.label)}
          >
            <div className="flex items-center">
              <span className="text-xs">{tab.label}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
