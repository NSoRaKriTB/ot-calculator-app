'use client';

import { useState } from 'react';
import type { CalculationResult } from '@/types';
import { Button } from '@/components/ui/button';
import { FileDown, FileSpreadsheet, Loader2 } from 'lucide-react';

interface ExportButtonsProps {
  result: CalculationResult;
}

export default function ExportButtons({ result }: ExportButtonsProps) {
  const [pdfLoading, setPdfLoading] = useState(false);
  const [excelLoading, setExcelLoading] = useState(false);

  const handleExportPdf = async () => {
    setPdfLoading(true);
    try {
      const { exportToPdf } = await import('@/lib/export-pdf');
      await exportToPdf(result);
    } catch (error) {
      console.error('PDF export failed:', error);
    } finally {
      setPdfLoading(false);
    }
  };

  const handleExportExcel = async () => {
    setExcelLoading(true);
    try {
      const { exportToExcel } = await import('@/lib/export-excel');
      await exportToExcel(result);
    } catch (error) {
      console.error('Excel export failed:', error);
    } finally {
      setExcelLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <Button variant="secondary" disabled={pdfLoading} onClick={handleExportPdf} className="flex-1">
        {pdfLoading ? <Loader2 className="size-4 animate-spin" /> : <FileDown className="size-4" />}
        ส่งออก PDF
      </Button>
      <Button variant="secondary" disabled={excelLoading} onClick={handleExportExcel} className="flex-1">
        {excelLoading ? <Loader2 className="size-4 animate-spin" /> : <FileSpreadsheet className="size-4" />}
        ส่งออก Excel
      </Button>
    </div>
  );
}
