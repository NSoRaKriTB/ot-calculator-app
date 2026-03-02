'use client';

import type { CalculationResult } from '@/types';
import { formatCurrency, formatNumber } from '@/lib/format';
import { EMPLOYEE_TYPE_LABELS, MAX_OT_HOURS_PER_WEEK } from '@/lib/constants';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

interface ResultsSummaryProps {
  result: CalculationResult;
}

export default function ResultsSummary({ result }: ResultsSummaryProps) {
  return (
    <Card className="border-primary/30 bg-primary/5">
      <CardContent>
        <div className="text-center">
          <p className="text-sm text-muted-foreground">ค่าล่วงเวลารวม</p>
          <p className="mt-1 text-3xl font-bold text-primary sm:text-4xl">
            {formatCurrency(result.totalOtPay)}
          </p>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4 text-center sm:grid-cols-3">
          <div>
            <p className="text-xs text-muted-foreground">อัตราชั่วโมงละ</p>
            <p className="text-sm font-semibold">{formatNumber(result.baseHourlyRate)} บาท</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">รวมชั่วโมง OT</p>
            <p className="text-sm font-semibold">{formatNumber(result.totalOtHours)} ชม.</p>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <p className="text-xs text-muted-foreground">ประเภทพนักงาน</p>
            <p className="text-sm font-semibold">{EMPLOYEE_TYPE_LABELS[result.input.employeeType]}</p>
          </div>
        </div>

        {result.weeklyOtExceeded && (
          <div className="mt-4 flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-destructive">
            <AlertTriangle className="size-4 shrink-0" />
            <p className="text-sm font-medium">
              จำนวนชั่วโมง OT รวม ({formatNumber(result.totalOtHours)} ชม.)
              เกินกว่า {MAX_OT_HOURS_PER_WEEK} ชม./สัปดาห์ ตาม พ.ร.บ.คุ้มครองแรงงาน
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
