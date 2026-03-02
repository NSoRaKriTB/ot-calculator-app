import type { Metadata } from 'next';
import { Noto_Sans_Thai } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import { SpeedInsights } from '@vercel/speed-insights/next';
import './globals.css';

const notoSansThai = Noto_Sans_Thai({
  variable: '--font-noto-sans-thai',
  subsets: ['thai', 'latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'คำนวณค่าล่วงเวลา OT | เครื่องคำนวณ OT ตามกฎหมายแรงงานไทย',
  description:
    'เครื่องคำนวณค่าล่วงเวลา (OT) ตาม พ.ร.บ.คุ้มครองแรงงาน สำหรับพนักงานรายเดือนและรายวัน คำนวณ OT วันทำงาน วันหยุด วันหยุดนักขัตฤกษ์ ส่งออก PDF และ Excel ฟรี',
  keywords: [
    'คำนวณ OT',
    'ค่าล่วงเวลา',
    'OT calculator',
    'คำนวณค่าล่วงเวลา',
    'กฎหมายแรงงาน',
    'พ.ร.บ.คุ้มครองแรงงาน',
    'OT วันหยุด',
    'ค่าแรงล่วงเวลา',
  ],
  openGraph: {
    title: 'คำนวณค่าล่วงเวลา OT | Thai OT Calculator',
    description:
      'คำนวณค่า OT ตามกฎหมายแรงงานไทย พ.ร.บ.คุ้มครองแรงงาน รองรับพนักงานรายเดือนและรายวัน',
    locale: 'th_TH',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'คำนวณค่าล่วงเวลา OT',
    description: 'เครื่องคำนวณค่า OT ตามกฎหมายแรงงานไทย ฟรี',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" suppressHydrationWarning>
      <body className={`${notoSansThai.variable} font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
          <SpeedInsights />
        </ThemeProvider>
      </body>
    </html>
  );
}
