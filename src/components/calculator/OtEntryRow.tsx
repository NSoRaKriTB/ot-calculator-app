'use client';

import { useState } from 'react';
import type { OtEntry, OtType } from '@/types';
import { OT_TYPE_LABELS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CalendarIcon, Trash2 } from 'lucide-react';
import { th } from 'react-day-picker/locale';

interface OtEntryRowProps {
  entry: OtEntry;
  index: number;
  error?: string;
  canRemove: boolean;
  onUpdate: (id: string, field: keyof OtEntry, value: string) => void;
  onRemove: (id: string) => void;
}

const otTypeOptions = Object.entries(OT_TYPE_LABELS) as [OtType, string][];

function parseDate(dateStr: string): Date | undefined {
  if (!dateStr) return undefined;
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function formatDateStr(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function formatThaiDate(date: Date): string {
  return date.toLocaleDateString('th-TH', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function DatePickerField({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const selected = parseDate(value);

  return (
    <div className="w-full space-y-1.5 sm:w-40">
      <Label>วันที่ (ไม่บังคับ)</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              'w-full justify-start text-left font-normal',
              !selected && 'text-muted-foreground'
            )}
          >
            <CalendarIcon className="size-4 shrink-0" />
            {selected ? formatThaiDate(selected) : 'เลือกวันที่'}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            locale={th}
            mode="single"
            selected={selected}
            onSelect={(date) => {
              onChange(date ? formatDateStr(date) : '');
              setOpen(false);
            }}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

export default function OtEntryRow({
  entry,
  index,
  error,
  canRemove,
  onUpdate,
  onRemove,
}: OtEntryRowProps) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border bg-muted/50 p-3 sm:flex-row sm:items-end">
      <div className="flex-1 space-y-1.5">
        <Label>ประเภท OT #{index + 1}</Label>
        <Select
          value={entry.otType}
          onValueChange={(val) => onUpdate(entry.id, 'otType', val)}
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {otTypeOptions.map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="w-full space-y-1.5 sm:w-32">
        <Label>จำนวนชั่วโมง</Label>
        <Input
          type="number"
          min="0.5"
          max="24"
          step="0.5"
          value={entry.hours || ''}
          placeholder="0"
          aria-invalid={!!error}
          onChange={(e) => onUpdate(entry.id, 'hours', e.target.value)}
        />
        {error && (
          <p className="text-xs text-destructive" role="alert">
            {error}
          </p>
        )}
      </div>
      <DatePickerField
        value={entry.date || ''}
        onChange={(val) => onUpdate(entry.id, 'date', val)}
      />
      {canRemove && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => onRemove(entry.id)}
          className="self-end text-muted-foreground hover:text-destructive"
          aria-label={`ลบรายการ OT #${index + 1}`}
        >
          <Trash2 className="size-4" />
        </Button>
      )}
    </div>
  );
}
