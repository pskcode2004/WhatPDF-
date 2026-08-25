import { Navbar } from '@/components/layout/Navbar'
import { getTranslations } from 'next-intl/server'

export default async function TermsPage({
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
        <h1 className="text-3xl font-bold mb-6">{t('terms')}</h1>
        
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 space-y-6 text-gray-700 leading-relaxed">
          {locale === 'th' ? (
            <>
              <p>ยินดีต้อนรับสู่ <strong>WhatPDF?</strong> การเข้าใช้บริการเว็บไซต์นี้ หมายความว่าคุณยอมรับข้อตกลงการใช้งานดังต่อไปนี้</p>
              
              <h2 className="text-xl font-semibold text-gray-900 mt-8">1. การใช้บริการ</h2>
              <p>บริการของเราเปิดให้ใช้งานฟรี 100% สำหรับการแปลงไฟล์ส่วนบุคคลหรือธุรกิจ อย่างไรก็ตาม คุณไม่ได้รับอนุญาตให้ใช้บริการของเราเพื่อกระทำการใดๆ ที่ผิดกฎหมาย หรือละเมิดลิขสิทธิ์ของบุคคลที่สาม</p>
              
              <h2 className="text-xl font-semibold text-gray-900 mt-8">2. ขอบเขตความรับผิดชอบ</h2>
              <p>เราให้บริการ "ตามสภาพที่มี" (As is) โดยไม่มีการรับประกันใดๆ เกี่ยวกับความสมบูรณ์ ความถูกต้อง หรือความพร้อมใช้งานของบริการ เราจะไม่รับผิดชอบต่อความเสียหายหรือการสูญหายของข้อมูลที่อาจเกิดขึ้นจากการใช้บริการนี้ (โปรดสำรองไฟล์ต้นฉบับของคุณเสมอ)</p>
              
              <h2 className="text-xl font-semibold text-gray-900 mt-8">3. การเปลี่ยนแปลงบริการ</h2>
              <p>เราขอสงวนสิทธิ์ในการปรับปรุง เปลี่ยนแปลง หรือยุติการให้บริการชั่วคราวหรือถาวร โดยไม่จำเป็นต้องแจ้งให้ทราบล่วงหน้า</p>
              
              <h2 className="text-xl font-semibold text-gray-900 mt-8">4. ติดต่อเรา</h2>
              <p>หากมีข้อสงสัยเกี่ยวกับข้อตกลงการใช้งาน กรุณาติดต่อ: <a href="mailto:pskcode2004@gmail.com" className="text-brand-600 hover:underline">pskcode2004@gmail.com</a></p>
            </>
          ) : (
            <>
              <p>Welcome to <strong>WhatPDF?</strong> By using this service, you agree to the following terms and conditions.</p>
              
              <h2 className="text-xl font-semibold text-gray-900 mt-8">1. Use of Service</h2>
              <p>Our service is 100% free for both personal and commercial file conversions. However, you are strictly prohibited from using our service for any illegal activities or to infringe upon the copyrights of third parties.</p>
              
              <h2 className="text-xl font-semibold text-gray-900 mt-8">2. Limitation of Liability</h2>
              <p>The service is provided "As is" without any warranties regarding its completeness, accuracy, or availability. We are not liable for any damages or data loss that may result from using this service. (Please always back up your original files.)</p>
              
              <h2 className="text-xl font-semibold text-gray-900 mt-8">3. Service Modifications</h2>
              <p>We reserve the right to modify, suspend, or discontinue the service, either temporarily or permanently, at any time without prior notice.</p>
              
              <h2 className="text-xl font-semibold text-gray-900 mt-8">4. Contact Us</h2>
              <p>If you have any questions regarding these terms, please contact: <a href="mailto:pskcode2004@gmail.com" className="text-brand-600 hover:underline">pskcode2004@gmail.com</a></p>
            </>
          )}
        </div>
      </div>
    </main>
  )
}
