"use client";

import InvoiceForm from "@/components/invoice-form";
import InvoicePreview from "@/components/invoice-preview";
import QuotationForm from "@/components/quotation-form";
import QuotationPreview from "@/components/quotation-preview";
import RecordsList from "@/components/records-list";
import { Button } from "@/components/ui/button";
import { Eye, FileText, LayoutDashboard, History, Save } from "lucide-react";
import { useState } from "react";
import { useInvoice } from "@/context/invoice-context";
import { useQuotation } from "@/context/quotation-context";
import { saveInvoiceToHistory, saveQuotationToHistory } from "@/utils/history";

export default function Home() {
  const [showPreview, setShowPreview] = useState(false);
  const [activeTab, setActiveTab] = useState<"invoice" | "quotation" | "records">("invoice");
  const [isSaving, setIsSaving] = useState(false);

  const { invoice } = useInvoice();
  const { quotation } = useQuotation();

  const handleSaveDb = async () => {
    setIsSaving(true);
    try {
      if (activeTab === "invoice") {
        await saveInvoiceToHistory(invoice);
        alert(`Invoice ${invoice.invoiceNumber} successfully saved to DB!`);
      } else if (activeTab === "quotation") {
        await saveQuotationToHistory(quotation);
        alert(`Quotation ${quotation.quotationNumber} successfully saved to DB!`);
      }
    } catch (error) {
      console.error("Failed to save to database:", error);
      alert("Failed to save. Please check the console.");
    } finally {
      setIsSaving(false);
    }
  };

  if (showPreview) {
    if (activeTab === "invoice") {
      return <InvoicePreview onBack={() => setShowPreview(false)} />;
    } else {
      return <QuotationPreview onBack={() => setShowPreview(false)} />;
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold">Ubuntu Logistics Document Generator</h1>
            <p className="text-gray-600">
              Create professional invoices and quotations
            </p>
          </div>
          <div className="flex flex-wrap gap-2 text-sm">
            <Button
              variant={activeTab === "invoice" ? "default" : "outline"}
              onClick={() => setActiveTab("invoice")}
            >
              <FileText className="w-4 h-4 mr-2" />
              Invoice
            </Button>
            <Button
              variant={activeTab === "quotation" ? "default" : "outline"}
              onClick={() => setActiveTab("quotation")}
            >
              <LayoutDashboard className="w-4 h-4 mr-2" />
              Quotation
            </Button>
            <Button
              variant={activeTab === "records" ? "default" : "outline"}
              onClick={() => setActiveTab("records")}
            >
              <History className="w-4 h-4 mr-2" />
              Records
            </Button>
            
            {activeTab !== "records" && (
              <>
                <Button 
                  onClick={handleSaveDb} 
                  disabled={isSaving}
                  variant="outline" 
                  className="bg-green-50 text-green-700 hover:bg-green-100 hover:text-green-800 border-green-200"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isSaving ? "Saving..." : "Save Record"}
                </Button>
                <Button onClick={() => setShowPreview(true)} variant="secondary">
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </Button>
              </>
            )}
          </div>
        </div>

        {activeTab === "invoice" && <InvoiceForm />}
        {activeTab === "quotation" && <QuotationForm />}
        {activeTab === "records" && <RecordsList onSelectTab={setActiveTab} />}
      </div>
    </div>
  );
}
