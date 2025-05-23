import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

const Input: React.FC<InputProps> = ({ label, id, error, icon, className, ...props }) => {
  const describedBy = error ? `${id}-error` : undefined;
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-1">
          {label}
        </label>
      )}
      <div className="relative rounded-md shadow-sm">
        {icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" aria-hidden="true">
                {icon}
            </div>
        )}
        <input
          id={id}
          className={`
            ${icon ? 'pl-10' : 'px-3'} 
            py-2 block w-full sm:text-sm 
            bg-gray-800 border-gray-700 rounded-md 
            text-gray-100 placeholder-gray-500 
            focus:ring-indigo-500 focus:border-indigo-500 focus:bg-gray-700
            disabled:opacity-50 disabled:cursor-not-allowed
            ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-700'}
            ${className}
          `}
          aria-describedby={describedBy}
          aria-invalid={!!error}
          {...props}
        />
      </div>
      {error && <p id={describedBy} className="mt-1 text-xs text-red-400" role="alert">{error}</p>}
    </div>
  );
};

export default Input;