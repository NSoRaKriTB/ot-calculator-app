import type { CalculationResult } from '@/types';
import { OT_TYPE_LABELS, EMPLOYEE_TYPE_LABELS } from './constants';
import { formatNumber } from './format';

export async function exportToPdf(result: CalculationResult): Promise<void> {
  const { default: jsPDF } = await import('jspdf');
  const { default: autoTable } = await import('jspdf-autotable');

  const doc = new jsPDF();

  // Use built-in Helvetica (Thai chars may not render perfectly but functional)
  doc.setFont('Helvetica');

  // Title
  doc.setFontSize(18);
  doc.text('OT Calculation Report', 14, 20);
  doc.text('รายงานการคำนวณค่าล่วงเวลา', 14, 28);

  // Employee Info
  doc.setFontSize(11);
  doc.setTextColor(100, 100, 100);
  const salary =
    result.input.employeeType === 'monthly'
      ? `Monthly Salary: ${formatNumber(result.input.monthlySalary ?? 0)} THB`
      : `Daily Wage: ${formatNumber(result.input.dailyWage ?? 0)} THB`;
  doc.text(
    `Employee Type: ${EMPLOYEE_TYPE_LABELS[result.input.employeeType]}`,
    14,
    40
  );
  doc.text(salary, 14, 47);
  doc.text(
    `Hourly Rate: ${formatNumber(result.baseHourlyRate)} THB`,
    14,
    54
  );
  doc.text(
    `Working Hours/Day: ${result.input.workingHoursPerDay}`,
    14,
    61
  );

  // OT Breakdown Table
  doc.setTextColor(0, 0, 0);
  const tableData = result.entryResults.map((er, i) => [
    `#${i + 1}`,
    OT_TYPE_LABELS[er.entry.otType],
    `${formatNumber(er.entry.hours)} hrs`,
    `x${er.rateMultiplier}`,
    `${formatNumber(er.effectiveRate)} THB/hr`,
    `${formatNumber(er.subtotal)} THB`,
  ]);

  autoTable(doc, {
    startY: 70,
    head: [['#', 'OT Type', 'Hours', 'Rate', 'Effective Rate', 'Subtotal']],
    body: tableData,
    theme: 'striped',
    headStyles: {
      fillColor: [37, 99, 235],
      textColor: [255, 255, 255],
    },
    styles: {
      fontSize: 9,
    },
  });

  // Total
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const finalY = (doc as any).lastAutoTable?.finalY || 120;
  doc.setFontSize(14);
  doc.setTextColor(37, 99, 235);
  doc.text(
    `Total OT Pay: ${formatNumber(result.totalOtPay)} THB`,
    14,
    finalY + 15
  );
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(
    `Total OT Hours: ${formatNumber(result.totalOtHours)} hrs`,
    14,
    finalY + 23
  );

  if (result.weeklyOtExceeded) {
    doc.setTextColor(200, 100, 0);
    doc.text('Warning: OT hours exceed 36 hrs/week legal limit', 14, finalY + 31);
  }

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text(
    `Generated: ${new Date(result.calculatedAt).toLocaleString('th-TH')} | Thai Labor Protection Act B.E. 2541`,
    14,
    285
  );

  doc.save(`ot-calculation-${result.id.slice(0, 8)}.pdf`);
}
