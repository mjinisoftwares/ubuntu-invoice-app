"use client";

import { QuotationData, QuotationItem, initialQuotationData } from "@/types/quotation";
import { createContext, ReactNode, useContext, useState } from "react";

interface QuotationContextType {
  quotation: QuotationData;
  updateQuotation: (updates: Partial<QuotationData>) => void;
  addItem: () => void;
  removeItem: (index: number) => void;
  updateItem: (
    index: number,
    field: keyof QuotationItem,
    value: string | number
  ) => void;
}

const QuotationContext = createContext<QuotationContextType | undefined>(undefined);

export function QuotationProvider({ children }: { children: ReactNode }) {
  const [quotation, setQuotation] = useState<QuotationData>(initialQuotationData);

  const updateQuotation = (updates: Partial<QuotationData>) => {
    const newQuotation = { ...quotation, ...updates };

    if (updates.items) {
      newQuotation.total = updates.items.reduce((sum, item) => sum + Number(item.amount || 0), 0);
    }

    setQuotation(newQuotation);
  };

  const addItem = () => {
    const newItem: QuotationItem = {
      id: Date.now().toString(),
      date: "",
      pickupPaid: "",
      dropoffReturnTrip: "",
      amount: 0,
    };
    updateQuotation({ items: [...quotation.items, newItem] });
  };

  const removeItem = (index: number) => {
    if (quotation.items.length > 1) {
      const newItems = quotation.items.filter((_, i) => i !== index);
      updateQuotation({ items: newItems });
    }
  };

  const updateItem = (
    index: number,
    field: keyof QuotationItem,
    value: string | number
  ) => {
    const newItems = [...quotation.items];
    const updatedItem = { ...newItems[index] };
    (updatedItem as any)[field] = value;
    newItems[index] = updatedItem;

    updateQuotation({ items: newItems });
  };

  return (
    <QuotationContext.Provider
      value={{ quotation, updateQuotation, addItem, removeItem, updateItem }}
    >
      {children}
    </QuotationContext.Provider>
  );
}

export function useQuotation() {
  const context = useContext(QuotationContext);
  if (context === undefined) {
    throw new Error("useQuotation must be used within a QuotationProvider");
  }
  return context;
}
