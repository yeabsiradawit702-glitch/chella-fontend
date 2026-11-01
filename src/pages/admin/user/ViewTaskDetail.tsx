
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../../../utilit/axiosInstance';
import { API_PATHS } from '../../../utilit/apiPath';
import DashboardLayout from '../../../compontes/Layout/DashBoradLayout';
import moment from 'moment';
import AvatarGroup from '../../../compontes/AvatarGroup';
import YouTubeReward from '../../../Cards/YouTubeReward';

interface ChecklistItem {
  text: string;
  completed: boolean;
}

interface AssignedUser {
  _id: string;
  name?: string;
  profileImageUrl?: string;
}

interface Task {
  _id: string;
  title: string;
  description: string;
  status: string;
  category: string;
  reward: number;
  targetUrl?: string;
  dueDate?: string;
  assignedTo?: AssignedUser[];
  toChecklist?: ChecklistItem[];
}

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

interface RewardResponse {
  message?: string;
  reward?: number;
  balance?: number;
}

interface InfoBoxProps {
  label: string;
  value: string | number;
}

interface TodoCheckListProps {
  text: string;
  isChecked: boolean;
  onChange: () => void;
}

export default function ViewTaskDetail() {
  const { id } = useParams<{ id: string }>();

  const [task, setTask] = useState<Task | null>(null);
  const [instagramLoading, setInstagramLoading] = useState(false);
  const [instagramMessage, setInstagramMessage] = useState('');

  const getStatusTagColor = (status: string): string => {
    switch (status) {
      case 'in progress':
        return 'text-cyan-500 bg-cyan-50 border border-cyan-500/10';

      case 'completed':
        return 'text-green-500 bg-green-50 border border-green-500/10';

      default:
        return 'text-violet-500 bg-violet-50 border border-violet-500/10';
    }
  };

  const getTaskDetailsByID = async (): Promise<void> => {
    if (!id) return;

    try {
      const response = await axiosInstance.get(
        API_PATHS.TASKS.GET_TASK_BY_ID(id)
      );

      if (response.data) {
        const taskInfo = response.data.task ?? response.data;
        setTask(taskInfo as Task);
      }
    } catch (error) {
      const apiError = error as ApiError;
      console.error(
        'Error fetching task:',
        apiError.response?.data || apiError.message
      );
    }
  };

  const claimInstagramReward = async (): Promise<void> => {
    if (!id || instagramLoading) return;

    setInstagramLoading(true);
    setInstagramMessage('');

    try {
      const response = await axiosInstance.post<RewardResponse>(
        API_PATHS.TASKS.CLAIM_INSTAGRAM_REWARD(id)
      );

      setInstagramMessage(
        `${response.data.message ?? 'Reward claimed'}. Reward: ${
          response.data.reward ?? 0
        } ETB. Balance: ${response.data.balance ?? 0} ETB`
      );
    } catch (error) {
      const apiError = error as ApiError;

      setInstagramMessage(
        apiError.response?.data?.message || 'Could not claim reward.'
      );
    } finally {
      setInstagramLoading(false);
    }
  };

  const updateTodoChecklist = async (index: number): Promise<void> => {
    if (!id || !task?.toChecklist?.[index]) return;

    const previousTask = task;

    const updatedChecklist = task.toChecklist.map((item, i) =>
      i === index
        ? { ...item, completed: !item.completed }
        : item
    );

    setTask({
      ...task,
      toChecklist: updatedChecklist,
    });

    try {
      const response = await axiosInstance.put(
        API_PATHS.TASKS.UPDATE_TODO_CHECKLIST(id),
        { toChecklist: updatedChecklist }
      );

      const updatedTask = response.data?.task ?? response.data;

      if (updatedTask?.toChecklist) {
        setTask(updatedTask as Task);
      }
    } catch (error) {
      setTask(previousTask);

      const apiError = error as ApiError;

      console.error(
        'Error updating checklist:',
        apiError.response?.data || apiError.message
      );
    }
  };

  const handleLinkClick = (link: string): void => {
    if (!link) return;

    const url = /^https?:\/\//i.test(link)
      ? link
      : `https://${link}`;

    window.open(url, '_blank', 'noopener,noreferrer');
  };

  useEffect(() => {
    getTaskDetailsByID();
  }, [id]);

  return (
    <DashboardLayout activeMenu="My Tasks">
      <div className="mt-5">
        {task && (
          <div className="grid grid-cols-1 md:grid-cols-4 mt-4">
            <div className="form-card col-span-3">
              <div className="flex items-center justify-between">
                <h2 className="text-sm md:text-xl font-medium">
                  {task.title}
                </h2>

                <div
                  className={`text-[11px] md:text-[13px] font-medium ${getStatusTagColor(
                    task.status
                  )} px-4 py-0.5 rounded`}
                >
                  {task.status}
                </div>
              </div>

              <div className="mt-4">
                <InfoBox
                  label="Description"
                  value={task.description}
                />
              </div>

              <div className="grid grid-cols-12 gap-4 mt-4">
                <div className="col-span-6 md:col-span-4">
                  <InfoBox
                    label="Category"
                    value={task.category}
                  />
                </div>

                <div className="col-span-6 md:col-span-4">
                  <InfoBox
                    label="Reward"
                    value={task.reward}
                  />
                </div>

                <div className="col-span-6 md:col-span-4">
                  <InfoBox
                    label="Due Date"
                    value={
                      task.dueDate
                        ? moment(task.dueDate).format('Do MMM YYYY')
                        : 'N/A'
                    }
                  />
                </div>

                <div className="col-span-6 md:col-span-4">
                  <label className="text-xs font-medium text-slate-500">
                    Assigned To
                  </label>

                  <AvatarGroup
                    avatars={
                      task.assignedTo?.map(
                        (item) => item.profileImageUrl || ''
                      ) || []
                    }
                    maxVisible={5}
                  />
                </div>
              </div>

              <div className="mt-2">
                <label className="text-xs font-medium text-slate-500">
                  Todo Checklist
                </label>

                {task.toChecklist?.map((item, index) => (
                  <TodoCheckList
                    key={`todo_${index}`}
                    text={item.text}
                    isChecked={item.completed}
                    onChange={() => updateTodoChecklist(index)}
                  />
                ))}
              </div>

              {task.category?.trim().toLowerCase() === 'video' &&
                task.targetUrl && (
                  <YouTubeReward
                    taskId={task._id}
                    targetUrl={task.targetUrl}
                  />
                )}

              {/* Instagram Reward Section */}
              {['instagram', 'social'].includes(
                task.category?.trim().toLowerCase()
              ) && (
                <div className="mt-5 rounded-xl border border-gray-200 bg-white p-4">
                  <h3 className="mb-3 font-semibold">
                    Instagram Follow Task
                  </h3>

                  {task.targetUrl && (
                    <a
                      href={task.targetUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block rounded-lg bg-pink-600 px-4 py-2 text-white"
                    >
                      Open Instagram
                    </a>
                  )}

                  <button
                    type="button"
                    onClick={claimInstagramReward}
                    disabled={instagramLoading}
                    className="ml-3 rounded-lg bg-green-600 px-4 py-2 text-white disabled:opacity-50"
                  >
                    {instagramLoading
                      ? 'Claiming...'
                      : 'Claim Reward'}
                  </button>

                  {instagramMessage && (
                    <p className="mt-3 text-sm text-gray-700">
                      {instagramMessage}
                    </p>
                  )}
                </div>
              )}

              {/* Target URL */}
              {task.targetUrl && (
                <div className="mt-2">
                  <label className="text-xs font-medium text-slate-500">
                    Target URL
                  </label>

                  <p
                    className="text-sm text-blue-600 cursor-pointer break-all"
                    onClick={() =>
                      handleLinkClick(task.targetUrl!)
                    }
                  >
                    {task.targetUrl}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

const InfoBox = ({ label, value }: InfoBoxProps) => {
  return (
    <>
      <label className="text-xs font-medium text-slate-500">
        {label}
      </label>

      <p className="text-[12px] md:text-[13px] font-medium text-gray-700 mt-0.5">
        {value}
      </p>
    </>
  );
};

const TodoCheckList = ({
  text,
  isChecked,
  onChange,
}: TodoCheckListProps) => {
  return (
    <div className="flex items-center gap-3 p-3">
      <input
        type="checkbox"
        checked={isChecked}
        onChange={onChange}
        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm outline-none cursor-pointer"
      />

      <p className="text-[13px] text-gray-800">{text}</p>
    </div>
  );
};
