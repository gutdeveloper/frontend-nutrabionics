import React from 'react';
import { FieldError } from 'react-hook-form';
import { Input } from '../atoms/Input';
import { FormError } from '../atoms/FormError';

interface FormFieldProps {
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  error?: FieldError;
  register: any;
  disabled?: boolean;
  step?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  id,
  label,
  type = 'text',
  placeholder,
  required = false,
  error,
  register,
  disabled = false,
  step,
}) => {
  return (
    <div className="space-y-1">
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700"
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <Input
        id={id}
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        step={step}
        {...register}
        aria-invalid={error ? 'true' : 'false'}
      />
      {error && <FormError message={error.message} />}
    </div>
  );
}; 