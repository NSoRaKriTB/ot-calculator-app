import type { CalculationResult } from '@/types';
import { OT_TYPE_LABELS, EMPLOYEE_TYPE_LABELS } from './constants';
import { formatNumber } from './format';

export async function exportToExcel(result: CalculationResult): Promise<void> {
  const XLSX = await import('xlsx');

  // Sheet 1: Summary
  const summaryData = [
    ['รายงานการคำนวณค่าล่วงเวลา (OT)'],
    [],
    ['ประเภทพนักงาน', EMPLOYEE_TYPE_LABELS[result.input.employeeType]],
    [
      result.input.employeeType === 'monthly' ? 'เงินเดือน (บาท)' : 'ค่าจ้างรายวัน (บาท)',
      result.input.employeeType === 'monthly'
        ? result.input.monthlySalary ?? 0
        : result.input.dailyWage ?? 0,
    ],
    ['ชั่วโมงทำงานต่อวัน', result.input.workingHoursPerDay],
    ['อัตราชั่วโมง (บาท)', Number(formatNumber(result.baseHourlyRate).replace(/,/g, ''))],
    [],
    ['ค่าล่วงเวลารวม (บาท)', result.totalOtPay],
    ['ชั่วโมง OT รวม', result.totalOtHours],
    ['เกิน 36 ชม./สัปดาห์', result.weeklyOtExceeded ? 'ใช่' : 'ไม่'],
    [],
    ['คำนวณเมื่อ', new Date(result.calculatedAt).toLocaleString('th-TH')],
  ];

  // Sheet 2: Breakdown
  const breakdownHeader = [
    '#',
    'ประเภท OT',
    'จำนวนชั่วโมง',
    'ตัวคูณ',
    'อัตราต่อชม. (บาท)',
    'รวม (บาท)',
    'วันที่',
  ];

  const breakdownData = result.entryResults.map((er, i) => [
    i + 1,
    OT_TYPE_LABELS[er.entry.otType],
    er.entry.hours,
    er.rateMultiplier,
    Number(formatNumber(er.effectiveRate).replace(/,/g, '')),
    er.subtotal,
    er.entry.date || '-',
  ]);

  const wb = XLSX.utils.book_new();

  // Create summary sheet
  const ws1 = XLSX.utils.aoa_to_sheet(summaryData);
  ws1['!cols'] = [{ wch: 25 }, { wch: 20 }];
  XLSX.utils.book_append_sheet(wb, ws1, 'สรุป');

  // Create breakdown sheet
  const ws2 = XLSX.utils.aoa_to_sheet([breakdownHeader, ...breakdownData]);
  ws2['!cols'] = [
    { wch: 5 },
    { wch: 30 },
    { wch: 12 },
    { wch: 8 },
    { wch: 15 },
    { wch: 15 },
    { wch: 12 },
  ];
  XLSX.utils.book_append_sheet(wb, ws2, 'รายละเอียด OT');

  XLSX.writeFile(wb, `ot-calculation-${result.id.slice(0, 8)}.xlsx`);
}
