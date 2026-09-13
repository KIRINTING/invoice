"use client"
import dynamic from 'next/dynamic';

const PDFDocument = dynamic(() => import("@/components/PDFDocument"), { ssr: false });

export default function PDFClient({ data }: { data: any }) {
  return <PDFDocument data={data} />;
}

