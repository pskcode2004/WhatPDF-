import { Navbar } from '@/components/layout/Navbar'
import { getTranslations } from 'next-intl/server'

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'common' })

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-6">{t('privacy')}</h1>
        
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 space-y-6 text-gray-700 leading-relaxed">
          {locale === 'th' ? (
            <>
              <p><strong>WhatPDF?</strong> เคารพในความเป็นส่วนตัวของคุณ นโยบายนี้อธิบายถึงวิธีการที่เราจัดการกับไฟล์และข้อมูลของคุณ</p>
              
              <h2 className="text-xl font-semibold text-gray-900 mt-8">1. การจัดเก็บและการลบไฟล์</h2>
              <p>ไฟล์ทั้งหมดที่คุณอัปโหลดเพื่อทำการแปลง จะถูกเก็บไว้ในเซิร์ฟเวอร์ของเราชั่วคราวเท่านั้น ระบบจะทำการลบไฟล์ต้นฉบับและไฟล์ที่แปลงเสร็จแล้ว <strong>โดยอัตโนมัติทันทีที่คุณดาวน์โหลดเสร็จ</strong> คุณไม่จำเป็นต้องดำเนินการลบด้วยตนเอง</p>
              
              <h2 className="text-xl font-semibold text-gray-900 mt-8">2. ความปลอดภัยของข้อมูล</h2>
              <p>เราไม่มีการเปิดดู แก้ไข หรือนำไฟล์ของคุณไปใช้เพื่อวัตถุประสงค์อื่นใด นอกเหนือจากการแปลงไฟล์ตามคำสั่งของคุณเท่านั้น ไฟล์ของคุณจะถูกเก็บเป็นความลับ</p>
              
              <h2 className="text-xl font-semibold text-gray-900 mt-8">3. ข้อมูลส่วนบุคคล</h2>
              <p>เราไม่มีการเก็บข้อมูลส่วนบุคคล (เช่น ชื่อ อีเมล หรือรหัสผ่าน) เนื่องจากระบบของเราเปิดให้ใช้งานได้ฟรีโดยไม่ต้องสมัครสมาชิกหรือเข้าสู่ระบบ</p>
              
              <h2 className="text-xl font-semibold text-gray-900 mt-8">4. การติดต่อเรา</h2>
              <p>หากมีข้อสงสัยเกี่ยวกับความเป็นส่วนตัว กรุณาติดต่อ: <a href="mailto:pskcode2004@gmail.com" className="text-brand-600 hover:underline">pskcode2004@gmail.com</a></p>
            </>
          ) : (
            <>
              <p><strong>WhatPDF?</strong> respects your privacy. This policy explains how we handle your files and data.</p>
              
              <h2 className="text-xl font-semibold text-gray-900 mt-8">1. File Storage and Deletion</h2>
              <p>All files you upload for conversion are stored on our servers temporarily. The system will <strong>automatically delete both the original and converted files immediately after you download them</strong>. You do not need to delete them manually.</p>
              
              <h2 className="text-xl font-semibold text-gray-900 mt-8">2. Data Security</h2>
              <p>We do not view, edit, or use your files for any purpose other than converting them according to your request. Your files are kept strictly confidential.</p>
              
              <h2 className="text-xl font-semibold text-gray-900 mt-8">3. Personal Information</h2>
              <p>We do not collect any personal information (such as name, email, or passwords) since our service is 100% free and does not require registration or login.</p>
              
              <h2 className="text-xl font-semibold text-gray-900 mt-8">4. Contact Us</h2>
              <p>If you have any questions regarding privacy, please contact: <a href="mailto:pskcode2004@gmail.com" className="text-brand-600 hover:underline">pskcode2004@gmail.com</a></p>
            </>
          )}
        </div>
      </div>
    </main>
  )
}
