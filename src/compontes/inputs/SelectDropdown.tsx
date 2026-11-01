
import { useState } from 'react';
import { LuChevronDown } from 'react-icons/lu';

interface DropdownOption {
  value: string;
  lable: string;
}

interface SelectDropdownProps {
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const SelectDropdown = ({
  options,
  value,
  onChange,
  placeholder = 'Select an option',
}: SelectDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (option: string) => {
    onChange(option);
    setIsOpen(false);
  };

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div className="relative w-full">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-sm text-yellow outline-none bg-white border border-slate-100 px-2.5 py-3 rounded-md mt-2 flex justify-between items-center"
      >
        {selectedOption ? selectedOption.lable : placeholder}

        <span className="ml-2">
          <LuChevronDown className={isOpen ? 'rotate-180' : ''} />
        </span>
      </button>

      {isOpen && (
        <div className="absolute w-full bg-white border border-slate-100 rounded-md mt-1 shadow-md z-10">
          {options.map((option) => (
            <div
              key={option.value}
              onClick={() => handleSelect(option.value)}
              className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-100"
            >
              {option.lable}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SelectDropdown;
