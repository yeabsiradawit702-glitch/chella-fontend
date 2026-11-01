
import { LuCircle, LuCircleCheck } from 'react-icons/lu';

interface TaskCardProps {
  title: string;
  description: string;
  status: string;
  progress: number;
  category?: string;
  reward?: number;
  targetUrl?: string;
  createdAt?: string | Date;
  dueDate?: string | Date;
  assignTo?: string[];
  attachementCount?: number;
  completedTodoCount?: number;
  toChecklist?: unknown[];
  onClick?: () => void;
}

const TaskCard = ({
  title,
  description,
  status,
  progress,
  category,
  reward,
  onClick,
}: TaskCardProps) => {

  const isCompleted = status?.toLowerCase() === 'completed';

  const progressValue = isCompleted
    ? 100
    : Math.min(100, Math.max(0, Number(progress) || 0));

  const progressColor = isCompleted
    ? 'bg-green-500'
    : 'bg-yellow-400';

  return (
    <div
      className="bg-gray-800/40 flex flex-col rounded-xl py-4 w-full shadow-md border border-gray-200/50 cursor-pointer"
      onClick={onClick}
    >
      <div className="flex gap-2 px-4">
        <div className="flex justify-between w-full">
          <div className="flex justify-between items-center gap-2">

            {isCompleted || progress >= 100 ? (
              <LuCircleCheck
                className="text-green-500 shrink-0"
                size={20}
              />
            ) : (
              <LuCircle
                className="text-gray-400 shrink-0"
                size={20}
              />
            )}

            <div>
              <p className="text-sm font-medium text-gray-800 mt-4 line-clamp-2">
                {title}
              </p>

              <p className="text-xs text-gray-500 mt-1.5 line-clamp-2 leading-[18px]">
                {description}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-800 bg-gray-800/20 w-20 p-1 flex justify-center rounded-sm">
                {category || 'General'}
              </p>
            </div>
          </div>

          <div>
            <p className="text-sm font-bold text-yellow-300">
              {reward || 0} ETB
            </p>
          </div>
        </div>
      </div>

      <div className="mt-3 p-2">
        <div className="h-1 w-full overflow-hidden rounded-full bg-gray-200">
          <div
            className={`h-full rounded-full transition-all duration-500 ${progressColor}`}
            style={{ width: `${progressValue}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
