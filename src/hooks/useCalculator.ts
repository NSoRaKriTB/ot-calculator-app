'use client';

import { useReducer, useCallback } from 'react';
import type { EmployeeType, OtType, OtEntry, CalculationResult } from '@/types';
import { calculateOt } from '@/lib/calculator';
import { DEFAULT_WORKING_HOURS_PER_DAY } from '@/lib/constants';

interface CalculatorState {
  employeeType: EmployeeType;
  monthlySalary: string;
  dailyWage: string;
  workingHoursPerDay: string;
  entries: OtEntry[];
  result: CalculationResult | null;
  errors: Record<string, string>;
}

type CalculatorAction =
  | { type: 'SET_EMPLOYEE_TYPE'; payload: EmployeeType }
  | { type: 'SET_MONTHLY_SALARY'; payload: string }
  | { type: 'SET_DAILY_WAGE'; payload: string }
  | { type: 'SET_WORKING_HOURS'; payload: string }
  | { type: 'ADD_ENTRY' }
  | { type: 'REMOVE_ENTRY'; payload: string }
  | { type: 'UPDATE_ENTRY'; payload: { id: string; field: keyof OtEntry; value: string } }
  | { type: 'SET_RESULT'; payload: CalculationResult }
  | { type: 'SET_ERRORS'; payload: Record<string, string> }
  | { type: 'RESET' };

function createEntry(): OtEntry {
  return {
    id: crypto.randomUUID(),
    otType: 'regular_workday_ot',
    hours: 0,
  };
}

const initialState: CalculatorState = {
  employeeType: 'monthly',
  monthlySalary: '',
  dailyWage: '',
  workingHoursPerDay: String(DEFAULT_WORKING_HOURS_PER_DAY),
  entries: [createEntry()],
  result: null,
  errors: {},
};

function reducer(state: CalculatorState, action: CalculatorAction): CalculatorState {
  switch (action.type) {
    case 'SET_EMPLOYEE_TYPE':
      return { ...state, employeeType: action.payload, result: null, errors: {} };
    case 'SET_MONTHLY_SALARY':
      return { ...state, monthlySalary: action.payload, result: null };
    case 'SET_DAILY_WAGE':
      return { ...state, dailyWage: action.payload, result: null };
    case 'SET_WORKING_HOURS':
      return { ...state, workingHoursPerDay: action.payload, result: null };
    case 'ADD_ENTRY':
      return { ...state, entries: [...state.entries, createEntry()], result: null };
    case 'REMOVE_ENTRY':
      return {
        ...state,
        entries: state.entries.length > 1
          ? state.entries.filter((e) => e.id !== action.payload)
          : state.entries,
        result: null,
      };
    case 'UPDATE_ENTRY':
      return {
        ...state,
        entries: state.entries.map((e) =>
          e.id === action.payload.id
            ? {
                ...e,
                [action.payload.field]:
                  action.payload.field === 'hours'
                    ? parseFloat(action.payload.value) || 0
                    : action.payload.value,
              }
            : e
        ),
        result: null,
      };
    case 'SET_RESULT':
      return { ...state, result: action.payload, errors: {} };
    case 'SET_ERRORS':
      return { ...state, errors: action.payload };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

export function useCalculator() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const validate = useCallback((): Record<string, string> => {
    const errors: Record<string, string> = {};

    if (state.employeeType === 'monthly') {
      const salary = parseFloat(state.monthlySalary);
      if (!state.monthlySalary || isNaN(salary) || salary <= 0) {
        errors.salary = 'กรุณากรอกเงินเดือน';
      }
    } else {
      const wage = parseFloat(state.dailyWage);
      if (!state.dailyWage || isNaN(wage) || wage <= 0) {
        errors.salary = 'กรุณากรอกค่าจ้างรายวัน';
      }
    }

    const hours = parseFloat(state.workingHoursPerDay);
    if (!state.workingHoursPerDay || isNaN(hours) || hours <= 0 || hours > 24) {
      errors.workingHours = 'กรุณากรอกชั่วโมงทำงานต่อวัน (1-24)';
    }

    state.entries.forEach((entry, index) => {
      if (!entry.hours || entry.hours <= 0) {
        errors[`entry-${index}`] = 'กรุณากรอกจำนวนชั่วโมง';
      }
      if (entry.hours > 24) {
        errors[`entry-${index}`] = 'ชั่วโมงต่อรายการต้องไม่เกิน 24 ชม.';
      }
    });

    return errors;
  }, [state]);

  const calculate = useCallback(() => {
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      dispatch({ type: 'SET_ERRORS', payload: errors });
      return null;
    }

    const result = calculateOt({
      employeeType: state.employeeType,
      monthlySalary: parseFloat(state.monthlySalary) || undefined,
      dailyWage: parseFloat(state.dailyWage) || undefined,
      workingHoursPerDay: parseFloat(state.workingHoursPerDay),
      entries: state.entries,
    });

    dispatch({ type: 'SET_RESULT', payload: result });
    return result;
  }, [state, validate]);

  const setEmployeeType = (type: EmployeeType) =>
    dispatch({ type: 'SET_EMPLOYEE_TYPE', payload: type });
  const setMonthlySalary = (value: string) =>
    dispatch({ type: 'SET_MONTHLY_SALARY', payload: value });
  const setDailyWage = (value: string) =>
    dispatch({ type: 'SET_DAILY_WAGE', payload: value });
  const setWorkingHours = (value: string) =>
    dispatch({ type: 'SET_WORKING_HOURS', payload: value });
  const addEntry = () => dispatch({ type: 'ADD_ENTRY' });
  const removeEntry = (id: string) =>
    dispatch({ type: 'REMOVE_ENTRY', payload: id });
  const updateEntry = (id: string, field: keyof OtEntry, value: string) =>
    dispatch({ type: 'UPDATE_ENTRY', payload: { id, field, value } });
  const reset = () => dispatch({ type: 'RESET' });

  return {
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
  };
}
