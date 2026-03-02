'use client';

import type { EmployeeType } from '@/types';
import { EMPLOYEE_TYPE_LABELS } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface EmployeeTypeToggleProps {
  value: EmployeeType;
  onChange: (type: EmployeeType) => void;
}

export default function EmployeeTypeToggle({ value, onChange }: EmployeeTypeToggleProps) {
  const types: EmployeeType[] = ['monthly', 'daily'];

  return (
    <div className="w-full">
      <label className="mb-2 block text-sm font-medium">
        ประเภทพนักงาน
      </label>
      <div className="flex rounded-lg border bg-muted p-1" role="radiogroup" aria-label="ประเภทพนักงาน">
        {types.map((type) => (
          <button
            key={type}
            role="radio"
            aria-checked={value === type}
            onClick={() => onChange(type)}
            className={cn(
              'flex-1 rounded-md px-4 py-2 text-sm font-medium transition-all',
              value === type
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {EMPLOYEE_TYPE_LABELS[type]}
          </button>
        ))}
      </div>
    </div>
  );
}
