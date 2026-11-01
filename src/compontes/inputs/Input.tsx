
import { useState } from 'react';
import type { ChangeEvent } from 'react';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa6';

interface InputProps {
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  lable?: string;
  placeholder?: string;
  type?: string;
  className?: string;
}

const Input = ({
  value,
  onChange,
  lable,
  placeholder,
  type = 'text',
  className = '',
}: InputProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword((previous) => !previous);
  };

  return (
    <div className={className}>
      {lable && (
        <div>
          <label className="text-[13px] text-blue-200">
            {lable}
          </label>
        </div>
      )}

      <div className="input-box">
        <input
          type={
            type === 'password'
              ? showPassword
                ? 'text'
                : 'password'
              : type
          }
          placeholder={placeholder}
          className="w-full bg-transparent outline-none"
          value={value}
          onChange={onChange}
        />

        {type === 'password' && (
          <>
            {showPassword ? (
              <FaRegEye
                size={22}
                className="text-blue-600 cursor-pointer"
                onClick={toggleShowPassword}
              />
            ) : (
              <FaRegEyeSlash
                size={22}
                className="text-slate-800 cursor-pointer"
                onClick={toggleShowPassword}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Input;
