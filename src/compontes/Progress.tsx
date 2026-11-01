
interface ProgressProps {
  progress: number;
  status: string;
}

const Progress = ({ progress, status }: ProgressProps) => {
  const getColor = () => {
    switch (status?.toLowerCase()) {
      case 'in progress':
        return 'text-cyan-500 bg-cyan-50 border border-cyan-500/10';

      case 'completed':
        return 'text-green-500 bg-green-50 border border-green-500/10';

      default:
        return 'text-violet-500 bg-violet-50 border border-violet-500/10';
    }
  };

  const progressValue = Math.min(100, Math.max(0, Number(progress) || 0));

  return (
    <div className="w-full bg-gray-200 rounded-full h-1.5">
      <div
        className={`${getColor()} h-1.5 rounded-full text-center text-xs font-medium`}
        style={{ width: `${progressValue}%` }}
      />
    </div>
  );
};

export default Progress;
