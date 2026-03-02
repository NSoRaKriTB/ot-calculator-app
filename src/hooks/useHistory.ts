'use client';

import { useCallback } from 'react';
import type { CalculationResult } from '@/types';
import { useLocalStorage } from './useLocalStorage';
import { MAX_HISTORY_ENTRIES } from '@/lib/constants';

export function useHistory() {
  const [history, setHistory] = useLocalStorage<CalculationResult[]>('ot-calc-history', []);

  const addEntry = useCallback(
    (result: CalculationResult) => {
      setHistory((prev) => {
        const updated = [result, ...prev];
        if (updated.length > MAX_HISTORY_ENTRIES) {
          return updated.slice(0, MAX_HISTORY_ENTRIES);
        }
        return updated;
      });
    },
    [setHistory]
  );

  const removeEntry = useCallback(
    (id: string) => {
      setHistory((prev) => prev.filter((entry) => entry.id !== id));
    },
    [setHistory]
  );

  const clearAll = useCallback(() => {
    setHistory([]);
  }, [setHistory]);

  return { history, addEntry, removeEntry, clearAll };
}
