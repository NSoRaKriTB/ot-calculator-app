'use client';

import { useState } from 'react';
import type { CalculationResult } from '@/types';
import { formatCurrency, formatNumber, formatDate } from '@/lib/format';
import { EMPLOYEE_TYPE_LABELS, OT_TYPE_LABELS } from '@/lib/constants';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { X } from 'lucide-react';

interface HistoryCardProps {
  result: CalculationResult;
  onDelete: () => void;
}

export default function HistoryCard({ result, onDelete }: HistoryCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card
      className="cursor-pointer transition-shadow hover:shadow-md"
      onClick={() => setExpanded(!expanded)}
    >
      <CardContent>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary">
                {EMPLOYEE_TYPE_LABELS[result.input.employeeType]}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {formatDate(result.calculatedAt)}
              </span>
            </div>
            <p className="mt-2 text-xl font-bold text-primary">
              {formatCurrency(result.totalOtPay)}
            </p>
            <p className="text-xs text-muted-foreground">
              {result.entryResults.length} รายการ | {formatNumber(result.totalOtHours)} ชม.
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="text-muted-foreground hover:text-destructive"
            aria-label="ลบรายการ"
          >
            <X className="size-4" />
          </Button>
        </div>

        {expanded && (
          <>
            <Separator className="my-4" />
            <div className="mb-3 grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-muted-foreground">
                  {result.input.employeeType === 'monthly' ? 'เงินเดือน' : 'ค่าจ้างรายวัน'}:
                </span>{' '}
                <span className="font-medium">
                  {formatCurrency(
                    result.input.employeeType === 'monthly'
                      ? result.input.monthlySalary ?? 0
                      : result.input.dailyWage ?? 0
                  )}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">อัตราชั่วโมง:</span>{' '}
                <span className="font-medium">{formatNumber(result.baseHourlyRate)} บาท</span>
              </div>
            </div>
            <div className="space-y-2">
              {result.entryResults.map((er, i) => (
                <div
                  key={er.entry.id}
                  className="flex items-center justify-between rounded-md bg-muted px-3 py-2 text-xs"
                >
                  <span>
                    #{i + 1} {OT_TYPE_LABELS[er.entry.otType]} ({formatNumber(er.entry.hours)} ชม. x {er.rateMultiplier}x)
                  </span>
                  <span className="font-medium">{formatCurrency(er.subtotal)}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
