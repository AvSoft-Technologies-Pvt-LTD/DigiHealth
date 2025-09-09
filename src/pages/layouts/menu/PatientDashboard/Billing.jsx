import React, { useState, useRef, useCallback } from "react";
import { useSelector } from "react-redux";
import {
  Search, Plus, FileText, Eye, Download, Printer,
  CreditCard, Share2, Receipt, Stethoscope, X, Calendar,
  User, Phone, Mail, MapPin
} from "lucide-react";
import DynamicTable from "../../../../components/microcomponents/DynamicTable";
import PaymentGateway from "../../../../components/microcomponents/PaymentGatway";

const Billing = () => {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showPaymentGateway, setShowPaymentGateway] = useState(false);
  const [paymentInvoice, setPaymentInvoice] = useState(null);
  const searchInputRef = useRef(null);
  const user = useSelector((state) => state.auth.user);

  const records = [
    { id: 1, invoiceNo: "INV-001", date: "2025-01-15", doctorName: "Dr. Rajesh Sharma", serviceType: "OPD Consultation", billedAmount: 800, paidAmount: 500, balance: 300, status: "pending", method: "card", items: [{ description: "Consultation Fee", quantity: 1, cost: 500, amount: 500 }, { description: "Medical Report", quantity: 1, cost: 200, amount: 200 }, { description: "Prescription", quantity: 1, cost: 100, amount: 100 }], subtotal: 800, discount: 0, tax: 0, total: 800 },
    { id: 2, invoiceNo: "INV-002", date: "2025-01-12", doctorName: "Dr. Priya Patel", serviceType: "Lab Test - Blood Work", billedAmount: 1200, paidAmount: 1200, balance: 0, status: "paid", method: "upi", items: [{ description: "Complete Blood Count", quantity: 1, cost: 600, amount: 600 }, { description: "Lipid Profile", quantity: 1, cost: 400, amount: 400 }, { description: "Blood Sugar Test", quantity: 1, cost: 200, amount: 200 }], subtotal: 1200, discount: 0, tax: 0, total: 1200 },
    { id: 3, invoiceNo: "INV-003", date: "2025-01-10", doctorName: "Dr. Amit Kumar", serviceType: "X-Ray Examination", billedAmount: 600, paidAmount: 300, balance: 300, status: "pending", method: "cash", items: [{ description: "Chest X-Ray", quantity: 1, cost: 400, amount: 400 }, { description: "Radiologist Report", quantity: 1, cost: 200, amount: 200 }], subtotal: 600, discount: 0, tax: 0, total: 600 },
    { id: 4, invoiceNo: "INV-004", date: "2024-12-28", doctorName: "Dr. Sarah Wilson", serviceType: "Emergency Consultation", billedAmount: 1500, paidAmount: 0, balance: 1500, status: "pending", method: "pending", items: [{ description: "Emergency Consultation", quantity: 1, cost: 1000, amount: 1000 }, { description: "Emergency Medicine", quantity: 1, cost: 300, amount: 300 }, { description: "Medical Supplies", quantity: 1, cost: 200, amount: 200 }], subtotal: 1500, discount: 0, tax: 0, total: 1500 },
    { id: 5, invoiceNo: "INV-005", date: "2025-01-08", doctorName: "Dr. Vikram Singh", serviceType: "Physiotherapy Session", billedAmount: 900, paidAmount: 900, balance: 0, status: "paid", method: "card", items: [{ description: "Physiotherapy Session", quantity: 3, cost: 300, amount: 900 }], subtotal: 900, discount: 0, tax: 0, total: 900 },
  ];

  const filteredRecords = records.filter((record) => {
    if (!searchQuery) return true;
    const searchLower = searchQuery.toLowerCase();
    return (
      record.invoiceNo.toLowerCase().includes(searchLower) ||
      record.doctorName.toLowerCase().includes(searchLower) ||
      record.serviceType.toLowerCase().includes(searchLower)
    );
  });

  const handleSearchToggle = useCallback(() => {
    setIsSearchExpanded(!isSearchExpanded);
    if (!isSearchExpanded) setTimeout(() => searchInputRef.current?.focus(), 100);
    else setSearchQuery("");
  }, [isSearchExpanded]);

  const handleSearchChange = useCallback((e) => setSearchQuery(e.target.value), []);

  const handleClearSearch = useCallback(() => { setSearchQuery(""); setIsSearchExpanded(false); }, []);

  const handleAddBill = useCallback(() => alert("Add new bill functionality will be implemented here"), []);

  const getStatusBadgeClass = useCallback((status) => status === "paid" ? "status-completed" : "status-pending", []);

  const getStatusText = useCallback((status) => status === "paid" ? "Paid" : "Pending", []);

  const handleView = useCallback((record) => {
    setSelectedInvoice({
      ...record,
      patientName: `${user?.firstName || ""} ${user?.lastName || ""}`.trim() || "---",
      patientEmail: user?.email || "---",
      patientPhone: user?.phone || "---",
      patientAddress: user?.address || "---",
    });
  }, [user]);

  const handleDownload = useCallback((record) => {
    const invoice = {
      ...record,
      patientName: `${user?.firstName || ""} ${user?.lastName || ""}`.trim() || "---",
      patientEmail: user?.email || "---",
      patientPhone: user?.phone || "---",
      patientAddress: user?.address || "---",
    };
    setSelectedInvoice(invoice);
    setTimeout(() => {
      const invoiceElement = document.getElementById("invoice-print-template");
      if (invoiceElement) {
        const content = `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Invoice ${record.invoiceNo}</title><link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet"><style>${getInvoiceCSS()}</style></head><body>${invoiceElement.outerHTML}</body></html>`;
        const blob = new Blob([content], { type: "text/html" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `Invoice_${record.invoiceNo}.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        setSelectedInvoice(null);
      }
    }, 100);
  }, [user]);

  const handlePrint = useCallback((record) => {
    const invoice = {
      ...record,
      patientName: `${user?.firstName || ""} ${user?.lastName || ""}`.trim() || "---",
      patientEmail: user?.email || "---",
      patientPhone: user?.phone || "---",
      patientAddress: user?.address || "---",
    };
    setSelectedInvoice(invoice);
    setTimeout(() => {
      const printContent = document.getElementById("invoice-print-template").innerHTML;
      const WinPrint = window.open("", "", "width=900,height=650");
      WinPrint.document.write(`<html><head><title>Invoice ${record.invoiceNo}</title><link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet"><style>${getInvoiceCSS()}@media print { body { margin: 0; padding: 0; } .invoice-container { margin: 0; padding: 15px; box-shadow: none; border: none; } .no-print { display: none !important; } }</style></head><body>${printContent}</body></html>`);
      WinPrint.document.close();
      WinPrint.focus();
      setTimeout(() => { WinPrint.print(); WinPrint.close(); setSelectedInvoice(null); }, 250);
    }, 300);
  }, [user]);

  const handlePay = useCallback((record) => {
    const invoice = {
      ...record,
      patientName: `${user?.firstName || ""} ${user?.lastName || ""}`.trim() || "---",
      patientEmail: user?.email || "---",
      patientPhone: user?.phone || "---",
      patientAddress: user?.address || "---",
    };
    setPaymentInvoice(invoice);
    setShowPaymentGateway(true);
  }, [user]);

  const handleShare = useCallback((record) => {
    const shareData = { title: `Invoice ${record.invoiceNo}`, text: `Medical Invoice from DigiHealth - Amount: ₹${record.billedAmount}`, url: window.location.href };
    if (navigator.canShare && navigator.canShare(shareData)) navigator.share(shareData).catch(console.error);
    else navigator.clipboard.writeText(`Invoice ${record.invoiceNo} - Amount: ₹${record.billedAmount} - ${window.location.href}`).catch(console.error);
  }, []);

  const handlePaymentSuccess = useCallback(() => { setShowPaymentGateway(false); setPaymentInvoice(null); }, []);

  const handlePaymentFailure = useCallback(() => { setShowPaymentGateway(false); setPaymentInvoice(null); }, []);

  const getInvoiceCSS = useCallback(() => `
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.4; color: #374151; background: white; font-size: 14px; }
    .invoice-container { max-width: 800px; margin: 0 auto; background: white; padding: 20px; border: 1px solid #e5e7eb; }
    .invoice-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 25px; padding-bottom: 15px; border-bottom: 2px solid #3b82f6; }
    .invoice-title { font-size: 28px; font-weight: 700; color: #3b82f6; margin-bottom: 4px; }
    .invoice-number { font-size: 14px; color: #6b7280; font-weight: 500; }
    .company-info { text-align: right; display: flex; align-items: center; gap: 8px; }
    .company-logo { width: 50px; height: 50px; background: #3b82f6; border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
    .company-name { font-size: 18px; font-weight: 600; color: #3b82f6; white-space: nowrap; }
    .invoice-details { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 25px; }
    .detail-section h3 { font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid #e5e7eb; padding-bottom: 4px; }
    .detail-item { display: flex; align-items: center; margin-bottom: 4px; font-size: 13px; }
    .detail-item svg { width: 14px; height: 14px; margin-right: 6px; color: #6b7280; }
    .detail-item span { color: #374151; }
    .patient-name { font-weight: 600; color: #111827 !important; }
    .invoice-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 13px; }
    .invoice-table th { background: #f8fafc; padding: 10px 12px; text-align: left; font-weight: 600; color: #374151; border: 1px solid #e2e8f0; font-size: 12px; }
    .invoice-table th:nth-child(2), .invoice-table th:nth-child(3), .invoice-table th:nth-child(4) { text-align: right; }
    .invoice-table td { padding: 10px 12px; border: 1px solid #e2e8f0; color: #374151; }
    .invoice-table td:nth-child(2), .invoice-table td:nth-child(3), .invoice-table td:nth-child(4) { text-align: right; font-weight: 500; }
    .invoice-table tr:nth-child(even) { background: #f9fafb; }
    .invoice-totals { display: flex; justify-content: flex-end; margin-bottom: 25px; }
    .totals-section { width: 280px; }
    .total-row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 13px; border-bottom: 1px solid #f3f4f6; }
    .total-row span:first-child { color: #6b7280; }
    .total-row span:last-child { font-weight: 500; color: #374151; }
    .total-row.final { background: #3b82f6; color: white; padding: 12px 16px; margin-top: 10px; border-radius: 6px; font-weight: 600; font-size: 16px; border: none; }
    .total-row.final span { color: white !important; }
    .invoice-footer { margin-top: 25px; padding-top: 15px; border-top: 1px solid #e5e7eb; text-align: center; }
    .terms { font-size: 11px; color: #6b7280; margin-bottom: 10px; text-align: left; }
    .terms h4 { font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px; }
    .thank-you { font-size: 14px; font-weight: 500; color: #3b82f6; margin-bottom: 4px; }
    .contact-info { font-size: 11px; color: #6b7280; }
    @media print { body { margin: 0; padding: 0; } .invoice-container { margin: 0; padding: 15px; box-shadow: none; border: none; } .no-print { display: none !important; } }
  `, []);

const InvoiceTemplate = React.memo(({ invoice, showActions }) => {
  if (!invoice) return null;
  return (
    <>
      <div className="bg-white rounded-lg">
        <div className="p-6">
          {/* Header Section */}
          <div className="flex justify-between items-start mb-6 pb-4 border-b-2 border-[var(--accent-color)]">
            <div>
              <h1 className="h2-heading">INVOICE</h1>
              <p className="text-sm text-gray-600 font-medium">#{invoice.invoiceNo}</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-12 h-12 bg-[var(--accent-color)] rounded-lg flex items-center justify-center">
                <Stethoscope className="text-white" size={20} />
              </div>
              <div>
                <div className="text-lg font-semibold text-[var(--accent-color)]">DigiHealth</div>
                <div className="text-xs text-gray-500">Healthcare Solutions</div>
              </div>
            </div>
          </div>

          {/* Invoice and Patient Details */}
          <div className="grid grid-cols-2 gap-8 mb-6">
            <div>
              <h3 className="text-xs font-semibold text-gray-700 mb-3 uppercase tracking-wide border-b border-gray-200 pb-1">Invoice Details</h3>
              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                  <span>Date: {invoice.date}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                  <span>Due: {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Stethoscope className="w-4 h-4 mr-2 text-gray-500" />
                  <span>Doctor: {invoice.doctorName}</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-xs font-semibold text-gray-700 mb-3 uppercase tracking-wide border-b border-gray-200 pb-1">Patient Information</h3>
              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <User className="w-4 h-4 mr-2 text-gray-500" />
                  <span className="font-medium">{invoice.patientName}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Mail className="w-4 h-4 mr-2 text-gray-500" />
                  <span>{invoice.patientEmail}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Phone className="w-4 h-4 mr-2 text-gray-500" />
                  <span>{invoice.patientPhone}</span>
                </div>
                <div className="flex items-center text-sm">
                  <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                  <span>{invoice.patientAddress}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Invoice Items Table */}
          <div className="mb-6">
            <table className="w-full border-collapse border border-gray-200 text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-200 px-4 py-3 text-left font-semibold">Description</th>
                  <th className="border border-gray-200 px-4 py-3 text-right font-semibold">Unit Cost</th>
                  <th className="border border-gray-200 px-4 py-3 text-right font-semibold">Qty</th>
                  <th className="border border-gray-200 px-4 py-3 text-right font-semibold">Amount</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map((item, index) => (
                  <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-25"}>
                    <td className="border border-gray-200 px-4 py-3">{item.description}</td>
                    <td className="border border-gray-200 px-4 py-3 text-right font-medium">₹{item.cost}</td>
                    <td className="border border-gray-200 px-4 py-3 text-right font-medium">{item.quantity}</td>
                    <td className="border border-gray-200 px-4 py-3 text-right font-medium">₹{item.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Invoice Totals */}
          <div className="flex justify-end mb-6">
            <div className="w-72">
              <div className="space-y-2">
                <div className="flex justify-between py-1 text-sm border-b border-gray-100">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">₹{invoice.subtotal || invoice.billedAmount}</span>
                </div>
                <div className="flex justify-between py-1 text-sm border-b border-gray-100">
                  <span className="text-gray-600">Discount</span>
                  <span className="font-medium">₹{invoice.discount}</span>
                </div>
                <div className="flex justify-between py-1 text-sm border-b border-gray-100">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium">₹{invoice.tax}</span>
                </div>
                <div className="bg-[var(--accent-color)] text-white py-3 px-4 mt-3 rounded-md font-semibold text-lg flex justify-between">
                  <span>Total Amount</span>
                  <span>₹{invoice.total || invoice.billedAmount}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="pt-4 border-t border-gray-200">
            <div className="mb-4">
              <h4 className="text-xs font-semibold text-gray-700 mb-2">Terms & Conditions</h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                Payment is due within 30 days of invoice date. Late payments may incur additional charges. For any queries regarding this invoice, please contact us at billing@digihealth.com
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-[var(--accent-color)] mb-1">Thank you for choosing DigiHealth for your healthcare needs</p>
              <p className="text-xs text-gray-500">contact@digihealth.com | +91 98765 43210</p>
            </div>
          </div>

          {/* Actions */}
          {showActions && (
            <div className="no-print mt-6 pt-4 border-t border-gray-200 flex flex-wrap gap-3 justify-center">
              <button
                onClick={() => handlePrint(invoice)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-gray-700 border text-sm"
              >
                <Printer className="w-4 h-4" /> Print
              </button>
              
              {invoice.balance > 0 && (
                <button
                  onClick={() => handlePay(invoice)}
                  className="flex items-center gap-2 px-4 py-2 bg-[var(--accent-color)] hover:bg-[var(--accent-color)]/90 text-white rounded-lg transition-colors text-sm"
                >
                  <CreditCard className="w-4 h-4" /> Pay ₹{invoice.balance}
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Print Template (Hidden) */}
      <div id="invoice-print-template" style={{ display: 'none' }}>
        <div className="invoice-container">
          <div className="invoice-header">
            <div>
              <div className="invoice-title">INVOICE</div>
              <div className="invoice-number">#{invoice.invoiceNo}</div>
            </div>
            <div className="company-info">
              <div className="company-logo">
                <svg width="20" height="20" fill="white" viewBox="0 0 24 24">
                  <path d="M11.5 2L12.5 3l-1 1-1-1 1-1zM7.5 6L9 7.5 7.5 9 6 7.5 7.5 6zm9 0L18 7.5 16.5 9 15 7.5 16.5 6zM12 6c-3.31 0-6 2.69-6 6 0 .35.03.69.08 1.02L3.5 18h17l-2.58-4.98c.05-.33.08-.67.08-1.02 0-3.31-2.69-6-6-6z" />
                </svg>
              </div>
              <div className="company-text">
                <div className="company-name">DigiHealth Healthcare Solutions</div>
              </div>
            </div>
          </div>
          <div className="invoice-details">
            <div className="detail-section">
              <h3>Invoice Details</h3>
              <div className="detail-item">
                <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z" />
                </svg>
                <span>Date: {invoice.date}</span>
              </div>
              <div className="detail-item">
                <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z" />
                </svg>
                <span>Due: {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}</span>
              </div>
              <div className="detail-item">
                <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.5 2L12.5 3l-1 1-1-1 1-1zM7.5 6L9 7.5 7.5 9 6 7.5 7.5 6zm9 0L18 7.5 16.5 9 15 7.5 16.5 6zM12 6c-3.31 0-6 2.69-6 6 0 .35.03.69.08 1.02L3.5 18h17l-2.58-4.98c.05-.33.08-.67.08-1.02 0-3.31-2.69-6-6-6z" />
                </svg>
                <span>Doctor: {invoice.doctorName}</span>
              </div>
            </div>
            <div className="detail-section">
              <h3>Patient Information</h3>
              <div className="detail-item">
                <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
                <span className="patient-name">{invoice.patientName}</span>
              </div>
              <div className="detail-item">
                <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                </svg>
                <span>{invoice.patientEmail}</span>
              </div>
              <div className="detail-item">
                <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                </svg>
                <span>{invoice.patientPhone}</span>
              </div>
              <div className="detail-item">
                <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                </svg>
                <span>{invoice.patientAddress}</span>
              </div>
            </div>
          </div>
          <table className="invoice-table">
            <thead>
              <tr>
                <th>Description</th>
                <th>Unit Cost</th>
                <th>Qty</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item, index) => (
                <tr key={index}>
                  <td>{item.description}</td>
                  <td>₹{item.cost}</td>
                  <td>{item.quantity}</td>
                  <td>₹{item.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="invoice-totals">
            <div className="totals-section">
              <div className="total-row">
                <span>Subtotal</span>
                <span>₹{invoice.subtotal || invoice.billedAmount}</span>
              </div>
              <div className="total-row">
                <span>Discount</span>
                <span>₹{invoice.discount}</span>
              </div>
              <div className="total-row">
                <span>Tax</span>
                <span>₹{invoice.tax}</span>
              </div>
              <div className="total-row final">
                <span>Total Amount</span>
                <span>₹{invoice.total || invoice.billedAmount}</span>
              </div>
            </div>
          </div>
          <div className="invoice-footer">
            <div className="terms">
              <h4>Terms & Conditions</h4>
              <p>Payment is due within 30 days of invoice date. Late payments may incur additional charges. For any queries regarding this invoice, please contact us at billing@digihealth.com</p>
            </div>
            <div className="thank-you">Thank you for choosing DigiHealth for your healthcare needs</div>
            <div className="contact-info">contact@digihealth.com | +91 98765 43210</div>
          </div>
        </div>
      </div>
    </>
  );
});


  const tableColumns = [
    { header: "Invoice ID", accessor: "invoiceNo", clickable: true },
    { header: "Date", accessor: "date" },
    { header: "Doctor/Provider", accessor: "doctorName" },
    { header: "Service", accessor: "serviceType" },
    { header: "Billed Amount", accessor: "billedAmount", cell: (row) => `₹${row.billedAmount}` },
    { header: "Paid Amount", accessor: "paidAmount", cell: (row) => `₹${row.paidAmount}` },
    { header: "Status", accessor: "status", cell: (row) => <span className={getStatusBadgeClass(row.status)}>{getStatusText(row.status)}</span> },
    {
      header: "Actions", accessor: "actions", cell: (row) => (
        <div className="flex items-center gap-2 justify-end">
           <button onClick={() => handleShare(row)} className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors" title="Share"><Share2 className="w-4 h-4" /></button>
          {row.balance > 0 && <button onClick={() => handlePay(row)} className="flex items-center gap-1 px-2 py-1 text-xs text-white bg-[var(--accent-color)] hover:bg-[var(--accent-color)]/90 rounded-lg transition-colors" title="Pay Now"><span>Pay</span></button>}
        </div>
      ),
    },
  ];

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full md:w-auto"><h1 className="h2-heading">Billing</h1></div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <button onClick={handleSearchToggle} className={`flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-300 ${isSearchExpanded ? "bg-[var(--accent-color)] text-white" : "bg-gray-100 text-[var(--primary-color)] hover:bg-gray-200"}`} title="Search Records"><Search className="w-4 h-4" /></button>
              <div className={`transition-all duration-300 ease-in-out ${isSearchExpanded ? "w-64 opacity-100" : "w-0 opacity-0"} overflow-hidden`}><input ref={searchInputRef} type="text" value={searchQuery} onChange={handleSearchChange} placeholder="Search invoices, doctors..." className="input-field" /></div>
            </div>
          </div>
        </div>
      </div>
      {filteredRecords.length > 0 ? (
        <div className="overflow-x-auto"><DynamicTable columns={tableColumns} data={filteredRecords} showSearchBar={false} onCellClick={(row, column) => column.accessor === "invoiceNo" && handleView(row)} /></div>
      ) : searchQuery ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Search className="w-16 h-16 text-gray-400 mb-4" /><h3 className="h3-heading mb-2">No records found</h3><p className="paragraph mb-6">No records found for "{searchQuery}"</p><button onClick={handleClearSearch} className="btn btn-secondary">Clear Search</button>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <FileText className="w-16 h-16 text-gray-400 mb-4" /><h3 className="h3-heading mb-2">No billing records found</h3><p className="paragraph mb-6">You don't have any billing records yet. Add your first bill to get started.</p><button onClick={handleAddBill} className="btn btn-primary"><Plus className="w-5 h-5" />Add First Bill</button>
        </div>
      )}
      {showPaymentGateway && paymentInvoice && (
        <PaymentGateway
          isOpen={showPaymentGateway}
          onClose={() => { setShowPaymentGateway(false); setPaymentInvoice(null); }}
          amount={paymentInvoice.balance}
          bookingId={paymentInvoice.invoiceNo}
          merchantName="DigiHealth"
          methods={["card", "upi", "wallet", "netbanking"]}
          onPay={handlePaymentSuccess}
          bookingDetails={{
            serviceType: paymentInvoice.serviceType,
            doctorName: paymentInvoice.doctorName,
            hospitalName: "DigiHealth Hospital",
            appointmentDate: paymentInvoice.date,
            appointmentTime: "10:30 AM",
            patient: [{ name: paymentInvoice.patientName, age: 28, gender: "Female", patientId: "PT12345" }],
            contactEmail: paymentInvoice.patientEmail,
            contactPhone: paymentInvoice.patientPhone,
            fareBreakup: { consultationFee: paymentInvoice.balance * 0.8, taxes: paymentInvoice.balance * 0.15, serviceFee: paymentInvoice.balance * 0.05 },
          }}
          currency="₹"
        />
      )}
      {selectedInvoice && !showPaymentGateway && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 modal-fadeIn">
          <div className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center z-10">
                <h2 className="text-xl font-semibold text-gray-800">Invoice Details</h2>
                <button onClick={() => setSelectedInvoice(null)} className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-lg hover:bg-gray-100" title="Close"><X size={20} /></button>
              </div>
              <div className="overflow-y-auto max-h-[calc(90vh-80px)] custom-scrollbar"><InvoiceTemplate invoice={selectedInvoice} showActions={true} /></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Billing;
