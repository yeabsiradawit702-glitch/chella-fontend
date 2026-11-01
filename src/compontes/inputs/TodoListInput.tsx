import { useState } from 'react';
import type { ChangeEvent } from 'react';
import { HiMiniPlus, HiOutlineTrash } from 'react-icons/hi2';

interface TodoListInputProps {
  todoList: string[];
  setTodoList: (items: string[]) => void;
}

const TodoListInput = ({
  todoList,
  setTodoList,
}: TodoListInputProps) => {
  const [option, setOption] = useState('');

  const handleAddOption = () => {
    if (option.trim()) {
      setTodoList([...todoList, option.trim()]);
      setOption('');
    }
  };

  const handleDeleteOption = (index: number) => {
    const updatedArray = todoList.filter((_, idx) => idx !== index);
    setTodoList(updatedArray);
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setOption(event.target.value);
  };

  return (
    <div>
      {todoList.map((item, index) => (
        <div
          key={`${item}-${index}`}
          className="flex justify-between bg-gray-50 border border-gray-100 px-3 py-2 rounded-md"
        >
          <p className="text-xs text-black">
            <span className="text-xs text-gray-400 font-semibold mr-2">
              {index < 9 ? `0${index + 1}` : index + 1}
            </span>
            {item}
          </p>

          <button
            type="button"
            className="cursor-pointer"
            onClick={() => handleDeleteOption(index)}
          >
            <HiOutlineTrash className="text-lg text-red-500" />
          </button>
        </div>
      ))}

      <div className="flex items-center gap-5 mt-4">
        <input
          type="text"
          placeholder="Enter Task"
          value={option}
          onChange={handleInputChange}
          className="w-full text-[13px] text-black outline-none bg-yellow-100 border border-gray-100 px-3 py-2 rounded-2xl"
        />

        <button
          type="button"
          className="card-btn text-nowrap"
          onClick={handleAddOption}
        >
          <HiMiniPlus className="text-lg" />
          Add
        </button>
      </div>
    </div>
  );
};

export default TodoListInput;