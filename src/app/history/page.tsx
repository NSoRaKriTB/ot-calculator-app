import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HistoryList from '@/components/history/HistoryList';

export const metadata: Metadata = {
  title: 'ประวัติการคำนวณ OT | เครื่องคำนวณค่าล่วงเวลา',
  description: 'ดูประวัติการคำนวณค่าล่วงเวลา (OT) ย้อนหลัง',
};

export default function HistoryPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <div className="mx-auto max-w-4xl px-4 py-6 sm:py-8">
          <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-gray-100">
            ประวัติการคำนวณ
          </h1>
          <HistoryList />
        </div>
      </main>
      <Footer />
    </>
  );
}
