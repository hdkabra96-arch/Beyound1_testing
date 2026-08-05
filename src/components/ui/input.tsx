import React, { useState } from 'react';
import { Eye, EyeOff, Search, X, AlertCircle } from 'lucide-react';

export interface FormFieldProps {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  error,
  helperText,
  required = false,
  children,
  className = '',
}) => {
  return (
    <div className={`space-y-1.5 w-full ${className}`}>
      {label && (
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
          {label}
          {required && <span className="text-rose-500 ml-1">*</span>}
        </label>
      )}
      {children}
      {error && (
        <div className="flex items-center gap-1.5 text-xs text-rose-500 font-medium">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}
      {!error && helperText && (
        <p className="text-xs text-slate-500 dark:text-slate-400">{helperText}</p>
      )}
    </div>
  );
};

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  error?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', leftIcon, rightIcon, error, disabled, ...props }, ref) => {
    return (
      <div className="relative w-full flex items-center">
        {leftIcon && (
          <div className="absolute left-3.5 text-slate-400 dark:text-slate-500 pointer-events-none flex items-center justify-center">
            {leftIcon}
          </div>
        )}
        <input
          ref={ref}
          disabled={disabled}
          className={`
            w-full bg-white/70 dark:bg-slate-900/70 backdrop-blur-md
            text-slate-900 dark:text-slate-100 text-sm font-medium
            border ${
              error
                ? 'border-rose-500 focus:ring-rose-500/20'
                : 'border-slate-200 dark:border-slate-800 focus:border-indigo-500 dark:focus:border-indigo-400'
            }
            rounded-2xl px-4 py-2.5 transition-all outline-none
            focus:ring-4 focus:ring-indigo-500/10 dark:focus:ring-indigo-400/20
            placeholder:text-slate-400 dark:placeholder:text-slate-500
            shadow-sm
            ${leftIcon ? 'pl-10' : ''}
            ${rightIcon ? 'pr-10' : ''}
            ${disabled ? 'opacity-50 cursor-not-allowed bg-slate-100/50 dark:bg-slate-800/50' : ''}
            ${className}
          `}
          {...props}
        />
        {rightIcon && (
          <div className="absolute right-3.5 text-slate-400 dark:text-slate-500 flex items-center justify-center">
            {rightIcon}
          </div>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';

export const PasswordInput = React.forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Input
      ref={ref}
      type={showPassword ? 'text' : 'password'}
      rightIcon={
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
        >
          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      }
      {...props}
    />
  );
});
PasswordInput.displayName = 'PasswordInput';

export interface SearchInputProps extends InputProps {
  onClear?: () => void;
}

export const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ value, onClear, onChange, ...props }, ref) => {
    return (
      <Input
        ref={ref}
        type="text"
        value={value}
        onChange={onChange}
        leftIcon={<Search className="w-4 h-4" />}
        rightIcon={
          value ? (
            <button
              type="button"
              onClick={onClear}
              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : undefined
        }
        placeholder="Search Math topics, worksheets, or Class 1-8 materials..."
        {...props}
      />
    );
  }
);
SearchInput.displayName = 'SearchInput';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: Array<{ value: string; label: string }>;
  error?: boolean;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ options, className = '', error, disabled, ...props }, ref) => {
    return (
      <select
        ref={ref}
        disabled={disabled}
        className={`
          w-full bg-white/70 dark:bg-slate-900/70 backdrop-blur-md
          text-slate-900 dark:text-slate-100 text-sm font-medium
          border ${
            error
              ? 'border-rose-500'
              : 'border-slate-200 dark:border-slate-800 focus:border-indigo-500 dark:focus:border-indigo-400'
          }
          rounded-2xl px-4 py-2.5 transition-all outline-none
          focus:ring-4 focus:ring-indigo-500/10 dark:focus:ring-indigo-400/20
          shadow-sm cursor-pointer
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          ${className}
        `}
        {...props}
      >
        {options.map((opt) => (
          <option
            key={opt.value}
            value={opt.value}
            className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
          >
            {opt.label}
          </option>
        ))}
      </select>
    );
  }
);
Select.displayName = 'Select';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = '', error, disabled, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        disabled={disabled}
        className={`
          w-full bg-white/70 dark:bg-slate-900/70 backdrop-blur-md
          text-slate-900 dark:text-slate-100 text-sm font-medium
          border ${
            error
              ? 'border-rose-500'
              : 'border-slate-200 dark:border-slate-800 focus:border-indigo-500 dark:focus:border-indigo-400'
          }
          rounded-2xl p-4 transition-all outline-none
          focus:ring-4 focus:ring-indigo-500/10 dark:focus:ring-indigo-400/20
          placeholder:text-slate-400 dark:placeholder:text-slate-500
          shadow-sm resize-y min-h-[100px]
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          ${className}
        `}
        {...props}
      />
    );
  }
);
Textarea.displayName = 'Textarea';

export interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
}

export const Switch: React.FC<SwitchProps> = ({
  checked,
  onChange,
  label,
  disabled = false,
}) => {
  return (
    <label
      className={`inline-flex items-center gap-3 cursor-pointer select-none ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      }`}
    >
      <div
        onClick={() => !disabled && onChange(!checked)}
        className={`
          w-12 h-6 rounded-full transition-colors relative p-0.5 ease-in-out duration-300
          ${checked ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'}
        `}
      >
        <div
          className={`
            w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300 transform
            ${checked ? 'translate-x-6' : 'translate-x-0'}
          `}
        />
      </div>
      {label && <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{label}</span>}
    </label>
  );
};

export interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  onChange,
  label,
  disabled = false,
}) => {
  return (
    <label
      className={`inline-flex items-center gap-2.5 cursor-pointer select-none ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      }`}
    >
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
        className="hidden"
      />
      <div
        className={`
          w-5 h-5 rounded-lg border transition-all flex items-center justify-center
          ${
            checked
              ? 'bg-indigo-600 border-indigo-600 text-white'
              : 'border-slate-300 dark:border-slate-700 bg-white/70 dark:bg-slate-900/70'
          }
        `}
      >
        {checked && (
          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
            <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
          </svg>
        )}
      </div>
      {label && <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{label}</span>}
    </label>
  );
};
