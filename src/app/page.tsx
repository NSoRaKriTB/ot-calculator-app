import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CalculatorForm from '@/components/calculator/CalculatorForm';
import { OT_RATES, OT_TYPE_LABELS } from '@/lib/constants';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { OtType } from '@/types';

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        <div className="mx-auto max-w-4xl px-4 py-6 sm:py-8">
          {/* SEO Hero */}
          <div className="mb-6 text-center sm:mb-8">
            <h1 className="text-2xl font-bold sm:text-3xl">
              คำนวณค่าล่วงเวลา (OT)
            </h1>
            <p className="mt-2 text-sm text-muted-foreground sm:text-base">
              เครื่องคำนวณ OT ตาม พ.ร.บ.คุ้มครองแรงงาน พ.ศ. 2541
              สำหรับพนักงานรายเดือนและรายวัน
            </p>
          </div>

          {/* Calculator */}
          <CalculatorForm />

          {/* SEO Content - Rate Table */}
          <section className="mt-12 sm:mt-16">
            <h2 className="mb-4 text-xl font-bold">
              อัตราค่าล่วงเวลาตามกฎหมายแรงงานไทย
            </h2>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ประเภท</TableHead>
                  <TableHead className="text-center">รายเดือน</TableHead>
                  <TableHead className="text-center">รายวัน</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(Object.keys(OT_TYPE_LABELS) as OtType[]).map((type) => (
                  <TableRow key={type}>
                    <TableCell>{OT_TYPE_LABELS[type]}</TableCell>
                    <TableCell className="text-center font-medium">
                      {OT_RATES.monthly[type]}x
                    </TableCell>
                    <TableCell className="text-center font-medium">
                      {OT_RATES.daily[type]}x
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <p className="mt-3 text-xs text-muted-foreground">
              * พนักงานรายเดือนจะได้รับเงินเดือนปกติอยู่แล้วในวันหยุด
              จึงได้รับค่าตอบแทนเพิ่มอีก 1 เท่า
              ส่วนพนักงานรายวันจะได้รับ 2 เท่าสำหรับวันหยุดนักขัตฤกษ์
              เนื่องจากไม่ได้รับค่าจ้างวันหยุดอยู่แล้ว
            </p>
          </section>

          {/* FAQ Section for SEO */}
          <section className="mt-10 sm:mt-12">
            <h2 className="mb-4 text-xl font-bold">
              คำถามที่พบบ่อย
            </h2>
            <div className="space-y-3">
              <details className="rounded-lg border">
                <summary className="cursor-pointer px-4 py-3 text-sm font-medium">
                  ค่าล่วงเวลา (OT) คำนวณอย่างไร?
                </summary>
                <div className="px-4 pb-3 text-sm text-muted-foreground">
                  <p>
                    สำหรับพนักงานรายเดือน: อัตราชั่วโมงละ = เงินเดือน &divide;
                    (30 &times; ชั่วโมงทำงานต่อวัน) จากนั้นนำอัตราชั่วโมง
                    &times; ตัวคูณ OT &times; จำนวนชั่วโมง OT
                  </p>
                  <p className="mt-2">
                    สำหรับพนักงานรายวัน: อัตราชั่วโมงละ = ค่าจ้างรายวัน
                    &divide; ชั่วโมงทำงานต่อวัน
                  </p>
                </div>
              </details>
              <details className="rounded-lg border">
                <summary className="cursor-pointer px-4 py-3 text-sm font-medium">
                  กฎหมายกำหนดให้ทำ OT ได้สูงสุดกี่ชั่วโมง?
                </summary>
                <div className="px-4 pb-3 text-sm text-muted-foreground">
                  ตาม พ.ร.บ.คุ้มครองแรงงาน กำหนดให้นายจ้างสามารถให้ลูกจ้าง
                  ทำงานล่วงเวลาได้ไม่เกิน <strong className="text-foreground">36 ชั่วโมงต่อสัปดาห์</strong>{' '}
                  และต้องได้รับความยินยอมจากลูกจ้าง
                  ยกเว้นกรณีเร่งด่วนหรืองานที่มีลักษณะต่อเนื่อง
                </div>
              </details>
              <details className="rounded-lg border">
                <summary className="cursor-pointer px-4 py-3 text-sm font-medium">
                  วันหยุดตามกฎหมายแรงงานมีกี่ประเภท?
                </summary>
                <div className="px-4 pb-3 text-sm text-muted-foreground">
                  มี 3 ประเภท: (1) <strong className="text-foreground">วันหยุดประจำสัปดาห์</strong> อย่างน้อย
                  1 วัน/สัปดาห์ (2) <strong className="text-foreground">วันหยุดตามประเพณี</strong> อย่างน้อย
                  13 วัน/ปี รวมวันแรงงาน (3){' '}
                  <strong className="text-foreground">วันหยุดพักผ่อนประจำปี</strong> อย่างน้อย 6 วัน
                  หลังทำงานครบ 1 ปี
                </div>
              </details>
            </div>
          </section>
        </div>
      </main>
      <Footer />

      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebApplication',
            name: 'เครื่องคำนวณค่าล่วงเวลา OT',
            description:
              'คำนวณค่าล่วงเวลา (OT) ตาม พ.ร.บ.คุ้มครองแรงงาน สำหรับพนักงานรายเดือนและรายวัน',
            applicationCategory: 'FinanceApplication',
            operatingSystem: 'Web',
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'THB',
            },
            inLanguage: 'th',
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: [
              {
                '@type': 'Question',
                name: 'ค่าล่วงเวลา (OT) คำนวณอย่างไร?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'สำหรับพนักงานรายเดือน: อัตราชั่วโมงละ = เงินเดือน ÷ (30 × ชั่วโมงทำงานต่อวัน) สำหรับพนักงานรายวัน: อัตราชั่วโมงละ = ค่าจ้างรายวัน ÷ ชั่วโมงทำงานต่อวัน',
                },
              },
              {
                '@type': 'Question',
                name: 'กฎหมายกำหนดให้ทำ OT ได้สูงสุดกี่ชั่วโมง?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'ตาม พ.ร.บ.คุ้มครองแรงงาน กำหนดให้ทำงานล่วงเวลาได้ไม่เกิน 36 ชั่วโมงต่อสัปดาห์',
                },
              },
              {
                '@type': 'Question',
                name: 'วันหยุดตามกฎหมายแรงงานมีกี่ประเภท?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'มี 3 ประเภท: วันหยุดประจำสัปดาห์ อย่างน้อย 1 วัน/สัปดาห์, วันหยุดตามประเพณี อย่างน้อย 13 วัน/ปี, วันหยุดพักผ่อนประจำปี อย่างน้อย 6 วัน',
                },
              },
            ],
          }),
        }}
      />
    </>
  );
}
