export type EmployeeType = 'monthly' | 'daily';

export type OtType =
  | 'regular_workday_ot'
  | 'holiday_weekly_normal'
  | 'holiday_traditional_normal'
  | 'holiday_annual_normal'
  | 'holiday_ot';

export interface OtEntry {
  id: string;
  otType: OtType;
  hours: number;
  date?: string;
}

export interface CalculatorInput {
  employeeType: EmployeeType;
  monthlySalary?: number;
  dailyWage?: number;
  workingHoursPerDay: number;
  entries: OtEntry[];
}

export interface OtEntryResult {
  entry: OtEntry;
  rateMultiplier: number;
  hourlyRate: number;
  effectiveRate: number;
  subtotal: number;
  formulaDescription: string;
}

export interface CalculationResult {
  id: string;
  input: CalculatorInput;
  baseHourlyRate: number;
  entryResults: OtEntryResult[];
  totalOtPay: number;
  totalOtHours: number;
  weeklyOtExceeded: boolean;
  calculatedAt: string;
}
