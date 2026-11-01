
import { useEffect, useState } from 'react';
import DashboardLayout from '../../compontes/Layout/DashBoradLayout';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utilit/axiosInstance';
import { API_PATHS } from '../../utilit/apiPath';
import { LuFileSpreadsheet } from 'react-icons/lu';
import TaskCard from '../../Cards/TaskCard';
import toast from 'react-hot-toast';

interface AssignedUser {
  _id: string;
  profileImageUrl?: string;
}

interface Task {
  _id: string;
  title: string;
  description: string;
  status: string;
  progress: number;
  createdAt: string;
  dueDate?: string | null;
  category: string;
  reward: number;
  targetUrl?: string;
  assignedTo?: AssignedUser[];
  attachments?: unknown[];
  completedTodoCount?: number;
  toChecklist?: {
    text: string;
    completed: boolean;
  }[];
}

interface Tab {
  label: string;
  count: number;
}

interface TaskStatusTabsProps {
  tabs: Tab[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Mangetasks() {
  const [allTasks, setAllTasks] = useState<Task[]>([]);
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [filterStatus, setFilterStatus] = useState('All');

  const navigate = useNavigate();

  const getAllTasks = async (status: string) => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.TASKS.GET_ALL_TASKS,
        {
          params: {
            status: status === 'All' ? '' : status,
          },
        }
      );

      const tasks: Task[] = response.data?.tasks || [];
      setAllTasks(tasks);

      const statusSummary = response.data?.statusSummary || {};

      const statusArray: Tab[] = [
        { label: 'All', count: statusSummary.all || 0 },
        { label: 'pending', count: statusSummary.pendingTasks || 0 },
        { label: 'in progress', count: statusSummary.inprogressTasks || 0 },
        { label: 'completed', count: statusSummary.completedTasks || 0 },
      ];

      setTabs(statusArray);

      console.log('First task:', tasks[0]);
      console.log('Assigned users:', tasks[0]?.assignedTo);
      console.log('Attachments:', tasks[0]?.attachments);

      tasks.forEach((item) => {
        console.log('Progress:', item.progress);
        console.log('Completed:', item.completedTodoCount);
        console.log('Checklist:', item.toChecklist);
      });
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast.error('Failed to load tasks');
    }
  };

  const handleClick = (task: Task) => {
    navigate('/admin/Createtask', {
      state: { taskId: task._id },
    });
  };

  // Download task report
  const handleDownloadReport = async () => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.REPORTS.EXPORT_TASKS,
        {
          responseType: 'blob',
        }
      );

      const url = window.URL.createObjectURL(
        new Blob([response.data])
      );

      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'task_detials.xlsx');

      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading task:', error);
      toast.error(
        'Failed to download task details. Please try again later.'
      );
    }
  };

  useEffect(() => {
    getAllTasks(filterStatus);
  }, [filterStatus]);

  return (
    <DashboardLayout activeMenu="Manage Tasks">
      <div className="my-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl md:text-xl font-medium">
              My Tasks
            </h2>

            <button
              className="flex lg:hidden download-btn"
              onClick={handleDownloadReport}
            >
              <LuFileSpreadsheet className="text-lg" />
              Download Report
            </button>
          </div>

          {tabs?.[0]?.count > 0 && (
            <div className="flex items-center gap-3">
              <TaskStatuTabs
                tabs={tabs}
                activeTab={filterStatus}
                setActiveTab={setFilterStatus}
              />

              <button
                className="hidden lg:flex download-btn"
                onClick={handleDownloadReport}
              >
                <LuFileSpreadsheet className="text-lg" />
                Download Report
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {allTasks.map((item) => (
            <TaskCard
              key={item._id}
              title={item.title}
              description={item.description}
              status={item.status}
              progress={item.progress}
              createdAt={item.createdAt}
              dueDate={item.dueDate ?? ''}
              category={item.category}
              reward={item.reward}
              targetUrl={item.targetUrl ?? ''}
              assignTo={
  item.assignedTo
    ?.map((user) => user.profileImageUrl)
    .filter((image): image is string => Boolean(image)) || []
}
              attachementCount={item.attachments?.length || 0}
              completedTodoCount={item.completedTodoCount || 0}
              toChecklist={item.toChecklist || []}
              onClick={() => handleClick(item)}
            />
          ))}
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
            className={`relative px-3 md:px-4 py-2 text-sm font-medium ${
              activeTab === tab.label
                ? 'text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            } cursor-pointer`}
            onClick={() => setActiveTab(tab.label)}
          >
            <div className="flex items-center">
              <span className="text-xs">{tab.label}</span>
              <span
                className={`text-xs ml-2 px-2 py-0.5 rounded-full ${
                  activeTab === tab.label
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200/70 text-gray-600'
                }`}
              >
                {tab.count}
              </span>
            </div>

            {activeTab === tab.label && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};
