'use client';

import { useState, useCallback } from 'react';
import { useCalculator } from '@/hooks/useCalculator';
import { useHistory } from '@/hooks/useHistory';
import EmployeeTypeToggle from './EmployeeTypeToggle';
import OtEntryRow from './OtEntryRow';
import ResultsSummary from './ResultsSummary';
import ResultsBreakdown from './ResultsBreakdown';
import ExportButtons from '@/components/export/ExportButtons';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import Toast from '@/components/ui/Toast';
import { Plus, Calculator, RotateCcw } from 'lucide-react';

export default function CalculatorForm() {
  const {
    state,
    setEmployeeType,
    setMonthlySalary,
    setDailyWage,
    setWorkingHours,
    addEntry,
    removeEntry,
    updateEntry,
    calculate,
    reset,
  } = useCalculator();

  const { addEntry: addToHistory } = useHistory();
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
  } | null>(null);

  const handleCalculate = useCallback(() => {
    const result = calculate();
    if (result) {
      addToHistory(result);
      setToast({ message: 'คำนวณเสร็จแล้ว บันทึกลงประวัติเรียบร้อย', type: 'success' });
    }
  }, [calculate, addToHistory]);

  const handleReset = useCallback(() => {
    reset();
    setToast({ message: 'ล้างข้อมูลแล้ว', type: 'info' });
  }, [reset]);

  return (
    <div className="space-y-6">
      {/* Employee Info */}
      <Card>
        <CardHeader>
          <CardTitle>ข้อมูลพนักงาน</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <EmployeeTypeToggle value={state.employeeType} onChange={setEmployeeType} />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {state.employeeType === 'monthly' ? (
              <div className="space-y-1.5">
                <Label htmlFor="salary">เงินเดือน (บาท)</Label>
                <Input
                  id="salary"
                  type="number"
                  min="0"
                  step="100"
                  placeholder="เช่น 25000"
                  value={state.monthlySalary}
                  aria-invalid={!!state.errors.salary}
                  onChange={(e) => setMonthlySalary(e.target.value)}
                />
                {state.errors.salary && (
                  <p className="text-xs text-destructive">{state.errors.salary}</p>
                )}
              </div>
            ) : (
              <div className="space-y-1.5">
                <Label htmlFor="wage">ค่าจ้างรายวัน (บาท)</Label>
                <Input
                  id="wage"
                  type="number"
                  min="0"
                  step="10"
                  placeholder="เช่น 500"
                  value={state.dailyWage}
                  aria-invalid={!!state.errors.salary}
                  onChange={(e) => setDailyWage(e.target.value)}
                />
                {state.errors.salary && (
                  <p className="text-xs text-destructive">{state.errors.salary}</p>
                )}
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="hours">ชั่วโมงทำงานต่อวัน</Label>
              <Input
                id="hours"
                type="number"
                min="1"
                max="24"
                step="1"
                placeholder="8"
                value={state.workingHoursPerDay}
                aria-invalid={!!state.errors.workingHours}
                onChange={(e) => setWorkingHours(e.target.value)}
              />
              {state.errors.workingHours && (
                <p className="text-xs text-destructive">{state.errors.workingHours}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* OT Entries */}
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>รายการ OT</CardTitle>
          <Button variant="outline" size="sm" onClick={addEntry}>
            <Plus className="size-4" />
            เพิ่มรายการ
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {state.entries.map((entry, index) => (
            <OtEntryRow
              key={entry.id}
              entry={entry}
              index={index}
              error={state.errors[`entry-${index}`]}
              canRemove={state.entries.length > 1}
              onUpdate={updateEntry}
              onRemove={removeEntry}
            />
          ))}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button size="lg" className="flex-1" onClick={handleCalculate}>
          <Calculator className="size-4" />
          คำนวณค่าล่วงเวลา
        </Button>
        <Button variant="outline" size="lg" onClick={handleReset}>
          <RotateCcw className="size-4" />
          ล้างข้อมูล
        </Button>
      </div>

      {/* Results */}
      {state.result && (
        <div className="space-y-4" aria-live="polite">
          <ResultsSummary result={state.result} />
          <ResultsBreakdown result={state.result} />
          <ExportButtons result={state.result} />
        </div>
      )}

      {/* Toast */}
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </div>
  );
}
