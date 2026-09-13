"use client"
import { Document, Page, Text, View, StyleSheet, Font, PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';
import { format } from 'date-fns';

// Register Thai Font (Kanit)
Font.register({
  family: 'Kanit',
  src: '/fonts/Kanit-Regular.ttf'
});
Font.register({
  family: 'KanitBold',
  src: '/fonts/Kanit-Bold.ttf'
});

const styles = StyleSheet.create({
  page: { padding: 40, fontFamily: 'Kanit', fontSize: 12 },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  title: { fontSize: 24, fontFamily: 'KanitBold' },
  companyInfo: { color: '#4b5563' },
  docInfo: { textAlign: 'right' },
  section: { marginTop: 20, paddingBottom: 10, borderBottom: '1 solid #e5e7eb' },
  tableHeader: { flexDirection: 'row', backgroundColor: '#f3f4f6', padding: 8, fontFamily: 'KanitBold', marginTop: 20 },
  tableRow: { flexDirection: 'row', padding: 8, borderBottom: '1 solid #e5e7eb' },
  col1: { width: '50%' },
  col2: { width: '15%', textAlign: 'center' },
  col3: { width: '15%', textAlign: 'right' },
  col4: { width: '20%', textAlign: 'right' },
  summary: { marginTop: 20, alignSelf: 'flex-end', width: '40%' },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
  summaryTotal: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4, fontFamily: 'KanitBold', borderTop: '1 solid #000', marginTop: 4, paddingTop: 4 },
  notes: { marginTop: 40, fontSize: 10, color: '#6b7280' }
});

export default function PDFDocument({ data, settings }: { data: any, settings?: any }) {
  const getTypeTitle = (type: string) => {
    switch(type) {
      case 'QUOTATION': return 'ใบเสนอราคา / QUOTATION';
      case 'INVOICE': return 'ใบแจ้งหนี้ / INVOICE';
      case 'RECEIPT': return 'ใบเสร็จรับเงิน / RECEIPT';
      default: return 'DOCUMENT';
    }
  }

  const MyDoc = (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.companyInfo}>
            <Text style={styles.title}>{getTypeTitle(data.type)}</Text>
            <Text style={{ marginTop: 10 }}>{settings?.companyName || 'Invoicing System Co., Ltd.'}</Text>
            <Text>{settings?.companyAddress || '123 Main St, Bangkok, Thailand 10110'}</Text>
            {settings?.companyPhone && <Text>โทร: {settings.companyPhone}</Text>}
            {settings?.companyTaxId && <Text>เลขประจำตัวผู้เสียภาษี: {settings.companyTaxId}</Text>}
          </View>
          <View style={styles.docInfo}>
            <Text style={{ fontFamily: 'KanitBold' }}>เลขที่: {data.number}</Text>
            <Text>วันที่: {format(new Date(data.date), 'dd/MM/yyyy')}</Text>
            {data.dueDate && <Text>ครบกำหนด: {format(new Date(data.dueDate), 'dd/MM/yyyy')}</Text>}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={{ fontFamily: 'KanitBold' }}>ลูกค้า:</Text>
          <Text>{data.client.name}</Text>
          {data.client.address && <Text>{data.client.address}</Text>}
          {data.client.taxId && <Text>เลขประจำตัวผู้เสียภาษี: {data.client.taxId}</Text>}
        </View>

        <View style={styles.tableHeader}>
          <Text style={styles.col1}>รายละเอียด</Text>
          <Text style={styles.col2}>จำนวน</Text>
          <Text style={styles.col3}>ราคาต่อหน่วย</Text>
          <Text style={styles.col4}>จำนวนเงิน</Text>
        </View>

        {data.items.map((item: any, i: number) => (
          <View key={i} style={styles.tableRow}>
            <Text style={styles.col1}>{item.description}</Text>
            <Text style={styles.col2}>{item.quantity}</Text>
            <Text style={styles.col3}>{item.unitPrice.toFixed(2)}</Text>
            <Text style={styles.col4}>{item.amount.toFixed(2)}</Text>
          </View>
        ))}

        <View style={styles.summary}>
          <View style={styles.summaryRow}>
            <Text>รวมเป็นเงิน:</Text>
            <Text>{data.subtotal.toFixed(2)}</Text>
          </View>
          {data.discount > 0 && (
            <View style={styles.summaryRow}>
              <Text>ส่วนลด:</Text>
              <Text>-{data.discount.toFixed(2)}</Text>
            </View>
          )}
          {data.vatType !== 'NONE' && (
            <View style={styles.summaryRow}>
              <Text>ภาษีมูลค่าเพิ่ม {data.taxRate}% {data.vatType === 'INCLUSIVE' ? '(รวมในราคา)' : ''}:</Text>
              <Text>{data.taxAmount.toFixed(2)}</Text>
            </View>
          )}
          <View style={styles.summaryTotal}>
            <Text>ยอดสุทธิ:</Text>
            <Text>{data.total.toFixed(2)}</Text>
          </View>
        </View>

        {data.notes && (
          <View style={styles.notes}>
            <Text style={{ fontFamily: 'KanitBold' }}>หมายเหตุ:</Text>
            <Text>{data.notes}</Text>
          </View>
        )}
      </Page>
    </Document>
  )

  return (
    <div style={{ width: '100%', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '10px', backgroundColor: '#f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontFamily: 'sans-serif', fontWeight: 'bold' }}>เอกสาร PDF</span>
        <PDFDownloadLink document={MyDoc} fileName={`document-${data.number}.pdf`}>
          {({ blob, url, loading, error }) => (
            <button 
              style={{ padding: '8px 16px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
              disabled={loading}
            >
              {loading ? 'กำลังสร้างเอกสาร...' : 'ดาวน์โหลด PDF'}
            </button>
          )}
        </PDFDownloadLink>
      </div>
      <div style={{ flex: 1, position: 'relative' }}>
        {typeof window !== "undefined" && (
          <PDFViewer style={{ width: '100%', height: '100%', border: 'none' }}>
            {MyDoc}
          </PDFViewer>
        )}
      </div>
    </div>
  )
}

