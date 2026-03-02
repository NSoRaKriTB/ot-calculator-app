export default function Footer() {
  return (
    <footer className="border-t bg-muted/50">
      <div className="mx-auto max-w-4xl px-4 py-6 sm:py-8">
        <div className="space-y-3 text-center text-xs text-muted-foreground">
          <p>
            ผลการคำนวณเป็นเพียงค่าประมาณตามอัตราขั้นต่ำของ{' '}
            <strong className="text-foreground">พ.ร.บ.คุ้มครองแรงงาน พ.ศ. 2541</strong>{' '}
            นายจ้างอาจตกลงจ่ายในอัตราที่สูงกว่าได้
          </p>
          <p>
            สูตร: รายเดือน = เงินเดือน &divide; (30 &times; ชม.ทำงาน/วัน) |
            รายวัน = ค่าจ้างรายวัน &divide; ชม.ทำงาน/วัน
          </p>
          <p className="text-muted-foreground/60">
            &copy; {new Date().getFullYear()} NSoRaKriTB |
            เครื่องคำนวณค่าล่วงเวลาตามกฎหมายแรงงานไทย
          </p>
        </div>
      </div>
    </footer>
  );
}
