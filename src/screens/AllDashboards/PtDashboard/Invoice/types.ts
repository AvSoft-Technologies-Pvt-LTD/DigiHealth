// types.ts
export interface InvoiceItem {
  description: string;
  cost: string;
  quantity: string;
  amount: string;
}

export interface Invoice {
  invoiceNo: string;
  date: string;
  dueDate: string;
  doctorName: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  items: InvoiceItem[];
  billedAmount: string;
  discount: string;
  tax: string;
  total: string;
}

export interface InvoiceDetailsProps {
  route: {
    params: {
      invoice: Invoice;
    };
  };
  navigation: {
    goBack: () => void;
  };
}
