'use client';

import { useHistory } from '@/hooks/useHistory';
import HistoryCard from './HistoryCard';
import { Button } from '@/components/ui/button';
import { ClipboardList } from 'lucide-react';

export default function HistoryList() {
  const { history, removeEntry, clearAll } = useHistory();

  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-16">
        <ClipboardList className="size-10 text-muted-foreground/50" />
        <p className="mt-3 text-sm font-medium text-muted-foreground">
          ยังไม่มีประวัติการคำนวณ
        </p>
        <p className="mt-1 text-xs text-muted-foreground/70">
          ผลการคำนวณจะถูกบันทึกอัตโนมัติ
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {history.length} รายการ
        </p>
        <Button variant="ghost" size="sm" onClick={clearAll} className="text-destructive hover:text-destructive">
          ลบทั้งหมด
        </Button>
      </div>
      <div className="space-y-3">
        {history.map((result) => (
          <HistoryCard
            key={result.id}
            result={result}
            onDelete={() => removeEntry(result.id)}
          />
        ))}
      </div>
    </div>
  );
}
