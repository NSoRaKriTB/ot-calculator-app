import type { EmployeeType, OtType } from '@/types';

export const OT_RATES: Record<EmployeeType, Record<OtType, number>> = {
  monthly: {
    regular_workday_ot: 1.5,
    holiday_weekly_normal: 1.0,
    holiday_traditional_normal: 1.0,
    holiday_annual_normal: 1.0,
    holiday_ot: 3.0,
  },
  daily: {
    regular_workday_ot: 1.5,
    holiday_weekly_normal: 1.0,
    holiday_traditional_normal: 2.0,
    holiday_annual_normal: 2.0,
    holiday_ot: 3.0,
  },
};

export const OT_TYPE_LABELS: Record<OtType, string> = {
  regular_workday_ot: 'OT วันทำงานปกติ',
  holiday_weekly_normal: 'ทำงานวันหยุดประจำสัปดาห์',
  holiday_traditional_normal: 'ทำงานวันหยุดนักขัตฤกษ์',
  holiday_annual_normal: 'ทำงานวันหยุดพักผ่อนประจำปี',
  holiday_ot: 'OT วันหยุด',
};

export const OT_TYPE_DESCRIPTIONS: Record<OtType, string> = {
  regular_workday_ot: 'ค่าล่วงเวลาจากการทำงานเกินเวลาปกติในวันทำงาน',
  holiday_weekly_normal: 'ค่าทำงานในวันหยุดประจำสัปดาห์ (ชั่วโมงปกติ)',
  holiday_traditional_normal: 'ค่าทำงานในวันหยุดตามประเพณี/นักขัตฤกษ์ (ชั่วโมงปกติ)',
  holiday_annual_normal: 'ค่าทำงานในวันหยุดพักผ่อนประจำปี (ชั่วโมงปกติ)',
  holiday_ot: 'ค่าล่วงเวลาจากการทำงานเกินเวลาปกติในวันหยุด (ทุกประเภท)',
};

export const EMPLOYEE_TYPE_LABELS: Record<EmployeeType, string> = {
  monthly: 'พนักงานรายเดือน',
  daily: 'พนักงานรายวัน/รายชั่วโมง',
};

export const MAX_OT_HOURS_PER_WEEK = 36;
export const DEFAULT_WORKING_HOURS_PER_DAY = 8;
export const MONTHLY_DIVISOR_DAYS = 30;
export const MAX_HISTORY_ENTRIES = 50;
