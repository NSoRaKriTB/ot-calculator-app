'use client';

import type { CalculationResult } from '@/types';
import { formatCurrency, formatNumber } from '@/lib/format';
import { OT_TYPE_LABELS } from '@/lib/constants';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface ResultsBreakdownProps {
  result: CalculationResult;
}

export default function ResultsBreakdown({ result }: ResultsBreakdownProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>รายละเอียดการคำนวณ</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {result.entryResults.map((entryResult, index) => (
            <div key={entryResult.entry.id} className="rounded-lg border bg-muted/30 p-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    #{index + 1} {OT_TYPE_LABELS[entryResult.entry.otType]}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {entryResult.formulaDescription}
                  </p>
                </div>
                <p className="ml-4 text-sm font-bold text-primary">
                  {formatCurrency(entryResult.subtotal)}
                </p>
              </div>
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                <span>อัตรา: x{entryResult.rateMultiplier}</span>
                <span>ชม.: {formatNumber(entryResult.entry.hours)}</span>
                <span>เรท: {formatNumber(entryResult.effectiveRate)} บาท/ชม.</span>
                {entryResult.entry.date && <span>วันที่: {entryResult.entry.date}</span>}
              </div>
            </div>
          ))}
        </div>

        <Separator className="my-4" />

        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">รวมทั้งสิ้น</span>
          <span className="text-xl font-bold text-primary">
            {formatCurrency(result.totalOtPay)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
