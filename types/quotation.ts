export interface QuotationItem {
  id: string;
  date: string;
  pickupPaid: string;
  dropoffReturnTrip: string;
  amount: number | string;
}

export interface QuotationData {
  quotationNumber: string;
  date: string;
  fromName: string;
  fromEmail: string;
  toName: string;
  toEmail: string;
  items: QuotationItem[];
  total: number;
}

export const initialQuotationData: QuotationData = {
  quotationNumber: `QT-${Date.now()}`,
  date: new Date().toISOString().split("T")[0],
  fromName: "",
  fromEmail: "",
  toName: "",
  toEmail: "",
  items: [{ id: "1", date: "", pickupPaid: "", dropoffReturnTrip: "", amount: 0 }],
  total: 0,
};
