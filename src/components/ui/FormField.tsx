import * as React from 'react';
import { Input, type InputProps } from './Input';
import { Label } from './Label';

interface FormFieldProps extends InputProps {
  label: string;
  id: string;
}

const FormField = React.forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, id, className, ...props }, ref) => {
    return (
      <div className="space-y-2">
        <Label htmlFor={id} className="text-zinc-300">
          {label}
        </Label>
        <Input id={id} ref={ref} className={className} {...props} />
      </div>
    );
  }
);
FormField.displayName = 'FormField';

export { FormField };
