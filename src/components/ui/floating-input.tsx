import { type InputHTMLAttributes, useState, forwardRef } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

interface FloatingInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: boolean;
}

const FloatingInput = forwardRef<HTMLInputElement, FloatingInputProps>(
  ({ label, error, type, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";
    const inputType = isPassword ? (showPassword ? "text" : "password") : type;

    return (
      <div className="relative w-full">
        <input
          {...props}
          autoComplete="off"
          type={inputType}
          placeholder=" "
          ref={ref}
          className={`block p-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border appearance-none peer
          focus:outline-none focus:ring-1 transition
          ${
            error
              ? "border-red-500 focus:ring-red-500 focus:border-red-500"
              : "border-gray-300 focus:ring-primary focus:border-primary"
          }`}
        />

        <label
          htmlFor={props.id}
          className={`absolute text-sm duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2
            peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:top-4
            peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4
            start-2 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto
            ${error ? "text-red-500 peer-focus:text-red-500" : "text-gray-500 peer-focus:text-primary"}
         `}
        >
          {label}
        </label>

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute text-gray-500 -translate-y-1/2 right-3 top-1/2 hover:text-gray-700"
          >
            {showPassword ? (
              <EyeSlashIcon className="w-5 h-5 text-gray-400" />
            ) : (
              <EyeIcon className="w-5 h-5 text-gray-400" />
            )}
          </button>
        )}
      </div>
    );
  }
);

FloatingInput.displayName = "FloatingInput";

export default FloatingInput;
