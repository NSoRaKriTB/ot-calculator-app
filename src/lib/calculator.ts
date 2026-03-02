import type {
  CalculatorInput,
  CalculationResult,
  OtEntryResult,
  EmployeeType,
  OtType,
} from '@/types';
import {
  OT_RATES,
  OT_TYPE_LABELS,
  MONTHLY_DIVISOR_DAYS,
  MAX_OT_HOURS_PER_WEEK,
} from './constants';
import { formatNumber } from './format';

export function calculateHourlyRate(input: CalculatorInput): number {
  if (input.employeeType === 'monthly') {
    const salary = input.monthlySalary ?? 0;
    return salary / (MONTHLY_DIVISOR_DAYS * input.workingHoursPerDay);
  }
  const wage = input.dailyWage ?? 0;
  return wage / input.workingHoursPerDay;
}

export function getOtMultiplier(
  employeeType: EmployeeType,
  otType: OtType
): number {
  return OT_RATES[employeeType][otType];
}

export function generateFormulaDescription(
  hourlyRate: number,
  multiplier: number,
  hours: number,
  otType: OtType,
  employeeType: EmployeeType,
  input: CalculatorInput
): string {
  const label = OT_TYPE_LABELS[otType];
  const subtotal = hourlyRate * multiplier * hours;

  if (employeeType === 'monthly') {
    const salary = input.monthlySalary ?? 0;
    return `${label} = ${formatNumber(salary)} ÷ (30 × ${input.workingHoursPerDay}) × ${multiplier} × ${hours} ชม. = ${formatNumber(subtotal)} บาท`;
  }

  const wage = input.dailyWage ?? 0;
  return `${label} = ${formatNumber(wage)} ÷ ${input.workingHoursPerDay} × ${multiplier} × ${hours} ชม. = ${formatNumber(subtotal)} บาท`;
}

export function calculateOt(input: CalculatorInput): CalculationResult {
  const baseHourlyRate = calculateHourlyRate(input);
  let totalOtPay = 0;
  let totalOtHours = 0;

  const entryResults: OtEntryResult[] = input.entries.map((entry) => {
    const multiplier = getOtMultiplier(input.employeeType, entry.otType);
    const effectiveRate = baseHourlyRate * multiplier;
    const subtotal = effectiveRate * entry.hours;

    totalOtPay += subtotal;
    totalOtHours += entry.hours;

    return {
      entry,
      rateMultiplier: multiplier,
      hourlyRate: baseHourlyRate,
      effectiveRate,
      subtotal,
      formulaDescription: generateFormulaDescription(
        baseHourlyRate,
        multiplier,
        entry.hours,
        entry.otType,
        input.employeeType,
        input
      ),
    };
  });

  return {
    id: crypto.randomUUID(),
    input,
    baseHourlyRate,
    entryResults,
    totalOtPay,
    totalOtHours,
    weeklyOtExceeded: totalOtHours > MAX_OT_HOURS_PER_WEEK,
    calculatedAt: new Date().toISOString(),
  };
}
