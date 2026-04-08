"use client";

import { Download, Globe, Mail, Phone } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { useInvoice } from "@/context/invoice-context";
import { formatDate } from "@/utils/formatters";
import { generatePDF } from "@/utils/pdf-generator";

interface InvoicePreviewProps {
  onBack: () => void;
}

import { saveInvoiceToHistory } from "@/utils/history";

export default function InvoicePreview({ onBack }: InvoicePreviewProps) {
  const { invoice } = useInvoice();

  const handleDownloadPDF = () => {
    generatePDF(`invoice-${invoice.invoiceNumber}`);
    saveInvoiceToHistory(invoice);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Invoice Preview</h1>
          <div className="space-x-2">
            <Button variant="outline" onClick={onBack}>
              Back
            </Button>
            <Button onClick={handleDownloadPDF}>
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </div>

        <Card id="invoice-document" className="relative overflow-hidden shadow-xl rounded-2xl p-4 bg-white">
          {/* Watermark */}
          <img
            src="/ubuntu.webp"
            alt="watermark"
            className="absolute inset-0 w-full h-full object-contain opacity-5 pointer-events-none"
          />

          <CardContent className="p-10 relative z-10">
            {/* Top Logo */}
            <div className="flex justify-between items-center mb-4">
              <img src="/ubuntu.webp" alt="logo" className="h-32" />
              <div className="text-right">
                <h2 className="text-3xl font-bold">INVOICE</h2>
                <p className="text-gray-500">#{invoice.invoiceNumber}</p>
                <p className="text-sm text-gray-500">
                  {formatDate(invoice.date)}
                </p>
              </div>
            </div>    

            <hr className="border-gray-300 mb-4"/>          

            {/* From / To */}
            <div className="grid grid-cols-2 gap-8 mb-10">
              <div>
                <h3 className="text-sm font-semibold text-gray-500 mb-1">
                  FROM
                </h3>
                <p className="font-semibold text-xl mb-2">{invoice.fromName}</p>
              <div className="flex items-center gap-2 mb-1"><Mail className="w-5"/>info@ubuntulogistics.co.ke</div>
               <div className="flex items-center gap-2 mb-1"><Phone className="w-5"/> +254 728 798 89</div>
            <div className="flex items-center gap-2 mb-1"><Globe className="w-5"/>www.ubuntulogistics.co.ke</div>
              </div>
              <div className="text-right">
                <h3 className="text-sm font-semibold text-gray-500 mb-1">
                  BILL TO
                </h3>
                <p className="font-semibold text-xl">{invoice.toName}</p>
                <p className="text-gray-600">{invoice.toEmail}</p>
                
              </div>
            </div>

            {/* Table */}
            <div className="rounded-xl overflow-hidden border">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="text-left py-3 px-4">Description</th>
                    <th className="text-center py-3 px-4">Qty</th>
                    <th className="text-right py-3 px-4">Rate</th>
                    <th className="text-right py-3 px-4">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items.map((item) => (
                    <tr key={item.id} className="border-t">
                      <td className="py-3 px-4">{item.description}</td>
                      <td className="py-3 px-4 text-center">
                        {item.quantity}
                      </td>
                      <td className="py-3 px-4 text-right">
                        KES {Number(item.rate).toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-right font-medium">
                        KES {Number(item.amount).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="flex justify-end mt-8">
              <div className="w-72 bg-gray-50 p-4 rounded-xl border">
                <div className="flex justify-between mb-2">
                  <span>Subtotal</span>
                  <span>KES {Number(invoice.subtotal).toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Tax ({invoice.taxRate || 0}%)</span>
                  <span>KES {Number(invoice.taxAmount).toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>Total</span>
                  <span>KES {Number(invoice.total).toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="mt-8">
              <h3 className="text-sm font-semibold text-gray-500 mb-1">
                Payment Instructions
              </h3>
              <p className="text-gray-600 font-bold">PAY TO TILL NUMBER: 454370</p>
              <p className="text-gray-600 font-bold">TRANSFER ARENA</p>
            </div>

            {/* Stamp + Footer */}
            <div className="mt-12 flex justify-between items-end">
              <div className="relative">
                <img
                  src="/stamp.webp"
                  alt="stamp"
                  className="h-32"
                />

                {/* Date inside stamp */}
                <p className="absolute inset-0 flex items-center justify-center text-sm font-bold text-red-500">
                  {formatDate(invoice.date)}
                </p>
              </div>

              <img src="/ubuntu.webp" alt="footer logo" className="h-32" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
