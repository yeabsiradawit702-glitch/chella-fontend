
interface DeleteAlterProps {
  onDelete: () => void;
  content: string;
}

const DeleteAlter = ({ onDelete, content }: DeleteAlterProps) => {
  return (
    <div className="text-sm">
      <p className="flex justify-start mt-6">{content}</p>

      <div className="flex items-center justify-center gap-1.5 text-xs md:text-sm font-medium text-rose-500 whitespace-nowrap bg-rose-50 border border-rose-100 rounded-lg px-4 py-2 cursor-pointer">
        <button type="button" className="" onClick={onDelete}>
          Delete
        </button>
      </div>
    </div>
  );
};

export default DeleteAlter;
