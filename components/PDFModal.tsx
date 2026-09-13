"use client"
import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogHeader, DialogDescription } from "@/components/ui/dialog";
import dynamic from "next/dynamic";

const PDFDocument = dynamic(() => import("@/components/PDFDocument"), { ssr: false });

export default function PDFModal({ document, settings }: { document: any, settings?: any }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="text-green-600 hover:underline text-sm font-medium">
        พิมพ์ PDF
      </DialogTrigger>
      <DialogContent className="!max-w-5xl !w-[90vw] h-[90vh] p-0 overflow-hidden flex flex-col">
        <DialogHeader className="p-4 border-b bg-slate-50 flex-none hidden">
          <DialogTitle>เอกสาร PDF - {document.number}</DialogTitle>
          <DialogDescription>แสดงตัวอย่าง PDF สำหรับพิมพ์หรือดาวน์โหลด</DialogDescription>
        </DialogHeader>
        <div className="flex-1 w-full relative">
          {open && <PDFDocument data={document} settings={settings} />}
        </div>
      </DialogContent>
    </Dialog>
  );
}
