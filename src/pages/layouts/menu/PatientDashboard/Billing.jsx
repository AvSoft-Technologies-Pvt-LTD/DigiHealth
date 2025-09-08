//Billing.jsx
import React, { useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Search, Plus, FileText, Eye, Download, Printer, CreditCard, Share2, Receipt } from 'lucide-react';
import DynamicTable from '../../../../components/microcomponents/DynamicTable';
import PaymentGatewayPage from '../../../../components/microcomponents/PaymentGatway';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import logo from "../../../../assets/logo.png";

const Billing = () => {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showPaymentGateway, setShowPaymentGateway] = useState(false);
  const [paymentInvoice, setPaymentInvoice] = useState(null);
  const searchInputRef = useRef(null);
  const user = useSelector((state) => state.auth.user);

  const [records] = useState([
    {
      id: 1,
      invoiceNo: 'INV-001',
      date: '2025-01-15',
      doctorName: 'Dr. Rajesh Sharma',
      serviceType: 'OPD Consultation',
      billedAmount: 800,
      paidAmount: 500,
      balance: 300,
      status: 'pending',
      method: 'card',
      items: [
        { description: 'Consultation Fee', quantity: 1, cost: 500, amount: 500 },
        { description: 'Medical Report', quantity: 1, cost: 200, amount: 200 },
        { description: 'Prescription', quantity: 1, cost: 100, amount: 100 }
      ],
      subtotal: 800,
      discount: 0,
      tax: 0,
      total: 800
    },
    {
      id: 2,
      invoiceNo: 'INV-002',
      date: '2025-01-12',
      doctorName: 'Dr. Priya Patel',
      serviceType: 'Lab Test - Blood Work',
      billedAmount: 1200,
      paidAmount: 1200,
      balance: 0,
      status: 'paid',
      method: 'upi',
      items: [
        { description: 'Complete Blood Count', quantity: 1, cost: 600, amount: 600 },
        { description: 'Lipid Profile', quantity: 1, cost: 400, amount: 400 },
        { description: 'Blood Sugar Test', quantity: 1, cost: 200, amount: 200 }
      ],
      subtotal: 1200,
      discount: 0,
      tax: 0,
      total: 1200
    },
    {
      id: 3,
      invoiceNo: 'INV-003',
      date: '2025-01-10',
      doctorName: 'Dr. Amit Kumar',
      serviceType: 'X-Ray Examination',
      billedAmount: 600,
      paidAmount: 300,
      balance: 300,
      status: 'pending',
      method: 'cash',
      items: [
        { description: 'Chest X-Ray', quantity: 1, cost: 400, amount: 400 },
        { description: 'Radiologist Report', quantity: 1, cost: 200, amount: 200 }
      ],
      subtotal: 600,
      discount: 0,
      tax: 0,
      total: 600
    },
    {
      id: 4,
      invoiceNo: 'INV-004',
      date: '2024-12-28',
      doctorName: 'Dr. Sarah Wilson',
      serviceType: 'Emergency Consultation',
      billedAmount: 1500,
      paidAmount: 0,
      balance: 1500,
      status: 'pending',
      method: 'pending',
      items: [
        { description: 'Emergency Consultation', quantity: 1, cost: 1000, amount: 1000 },
        { description: 'Emergency Medicine', quantity: 1, cost: 300, amount: 300 },
        { description: 'Medical Supplies', quantity: 1, cost: 200, amount: 200 }
      ],
      subtotal: 1500,
      discount: 0,
      tax: 0,
      total: 1500
    },
    {
      id: 5,
      invoiceNo: 'INV-005',
      date: '2025-01-08',
      doctorName: 'Dr. Vikram Singh',
      serviceType: 'Physiotherapy Session',
      billedAmount: 900,
      paidAmount: 900,
      balance: 0,
      status: 'paid',
      method: 'card',
      items: [
        { description: 'Physiotherapy Session', quantity: 3, cost: 300, amount: 900 }
      ],
      subtotal: 900,
      discount: 0,
      tax: 0,
      total: 900
    }
  ]);

  const filteredRecords = records.filter((record) => {
    if (!searchQuery) return true;
    const searchLower = searchQuery.toLowerCase();
    return (
      record.invoiceNo.toLowerCase().includes(searchLower) ||
      record.doctorName.toLowerCase().includes(searchLower) ||
      record.serviceType.toLowerCase().includes(searchLower)
    );
  });

  const handleSearchToggle = () => {
    setIsSearchExpanded(!isSearchExpanded);
    if (!isSearchExpanded) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    } else {
      setSearchQuery("");
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setIsSearchExpanded(false);
  };

  const handleAddBill = () => alert('Add new bill functionality will be implemented here');

  const getStatusBadgeClass = (status) => status === 'paid' ? 'status-completed' : 'status-pending';
  const getStatusText = (status) => status === 'paid' ? 'Paid' : 'Pending';

  const handleView = (record) => {
    const invoiceWithUser = {
      ...record,
      patientName: `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || "---",
      patientEmail: user?.email || "---",
      patientPhone: user?.phone || "---",
      patientAddress: user?.address || "---",
    };
    setSelectedInvoice(invoiceWithUser);
  };

  const handleDownload = (record) => {
    const invoiceWithUser = {
      ...record,
      patientName: `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || "---",
      patientEmail: user?.email || "---",
      patientPhone: user?.phone || "---",
      patientAddress: user?.address || "---",
    };
    setSelectedInvoice(invoiceWithUser);
    setTimeout(() => {
      const invoiceElement = document.getElementById('invoice-template');
      if (invoiceElement) {
        const content = `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Invoice ${record.invoiceNo}</title><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet"><style>${getInvoiceCSS()}</style></head><body>${invoiceElement.outerHTML}</body></html>`;
        const blob = new Blob([content], { type: 'text/html' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Invoice_${record.invoiceNo}.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        toast.success('Invoice downloaded successfully!');
        setSelectedInvoice(null);
      }
    }, 100);
  };

  const handlePrint = (record) => {
    const invoiceWithUser = {
      ...record,
      patientName: `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || "---",
      patientEmail: user?.email || "---",
      patientPhone: user?.phone || "---",
      patientAddress: user?.address || "---",
    };
    setSelectedInvoice(invoiceWithUser);
    setTimeout(() => {
      const printContent = document.getElementById("invoice-template").innerHTML;
      const WinPrint = window.open("", "", "width=900,height=650");
      WinPrint.document.write(`
        <html>
          <head>
            <title>Invoice</title>
            <style>
              ${getInvoiceCSS()}
              @media print {
                .no-print { display: none !important; }
                body { margin: 0; background: white; }
                #invoice-template { box-shadow: none !important; border: none !important; margin: 0 !important; }
              }
            </style>
          </head>
          <body>
            ${printContent}
          </body>
        </html>
      `);
      WinPrint.document.close();
      WinPrint.focus();
      WinPrint.print();
      WinPrint.close();
    }, 300);
  };

  const handlePay = (record) => {
    const invoiceWithUser = {
      ...record,
      patientName: `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || "---",
      patientEmail: user?.email || "---",
      patientPhone: user?.phone || "---",
      patientAddress: user?.address || "---",
    };
    setPaymentInvoice(invoiceWithUser);
    setShowPaymentGateway(true);
  };

  const handleShare = (record) => {
    const shareData = {
      title: `Invoice ${record.invoiceNo}`,
      text: `Medical Invoice from AV Swasthya - Amount: ₹${record.billedAmount}`,
      url: window.location.href,
    };
    if (navigator.canShare && navigator.canShare(shareData)) {
      navigator.share(shareData)
        .then(() => toast.success('Invoice shared successfully!'))
        .catch((err) => {
          console.error('Error sharing:', err);
          toast.error('Failed to share invoice.');
        });
    } else {
      navigator.clipboard.writeText(`Invoice ${record.invoiceNo} - Amount: ₹${record.billedAmount} - ${window.location.href}`)
        .then(() => toast.success('Invoice details copied to clipboard!'))
        .catch(() => toast.error('Failed to copy to clipboard.'));
    }
  };

  const handlePaymentSuccess = (paymentData) => {
    toast.success(`Payment successful! Transaction ID: ${paymentData.paymentId}`);
    setShowPaymentGateway(false);
    setPaymentInvoice(null);
  };

  const handlePaymentFailure = (errorData) => {
    toast.error(`Payment failed: ${errorData.reason}`);
    setShowPaymentGateway(false);
    setPaymentInvoice(null);
  };

  const getInvoiceCSS = () => `
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      line-height: 1.6;
      color: #374151;
      background: white;
    }
    #invoice-template {
      max-width: 800px;
      margin: 0 auto;
      background: white;
      box-shadow: none;
      border: none;
    }
    .invoice-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 40px;
      padding: 0;
    }
    .invoice-title {
      font-size: 36px;
      font-weight: 700;
      color: #111827;
      margin-bottom: 8px;
      letter-spacing: -0.025em;
    }
    .invoice-icon {
      width: 48px;
      height: 48px;
      background: #f3f4f6;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .invoice-details {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 40px;
      margin-bottom: 40px;
    }
    .detail-section h3 {
      font-size: 14px;
      font-weight: 600;
      color: #6b7280;
      margin-bottom: 12px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .detail-section p {
      font-size: 14px;
      color: #374151;
      margin-bottom: 4px;
      line-height: 1.5;
    }
    .invoice-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 32px;
    }
    .invoice-table th {
      background: #f9fafb;
      padding: 12px 16px;
      text-align: left;
      font-weight: 600;
      font-size: 14px;
      color: #374151;
      border-bottom: 1px solid #e5e7eb;
    }
    .invoice-table th:nth-child(2),
    .invoice-table th:nth-child(3),
    .invoice-table th:nth-child(4) {
      text-align: right;
    }
    .invoice-table td {
      padding: 16px;
      border-bottom: 1px solid #f3f4f6;
      font-size: 14px;
      color: #374151;
    }
    .invoice-table td:nth-child(2),
    .invoice-table td:nth-child(3),
    .invoice-table td:nth-child(4) {
      text-align: right;
    }
    .invoice-totals {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 32px;
    }
    .totals-section {
      width: 300px;
    }
    .total-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      font-size: 14px;
      color: #374151;
    }
    .total-row:not(:last-child) {
      border-bottom: 1px solid #f3f4f6;
    }
    .total-row.final {
      background: #374151;
      color: white;
      padding: 16px 20px;
      margin-top: 12px;
      border-radius: 4px;
      font-weight: 600;
      font-size: 18px;
    }
    .invoice-terms {
      margin-top: 40px;
      padding-top: 24px;
      border-top: 1px solid #e5e7eb;
    }
    .invoice-terms h3 {
      font-size: 14px;
      font-weight: 600;
      color: #374151;
      margin-bottom: 8px;
    }
    .invoice-terms p {
      font-size: 12px;
      color: #6b7280;
      line-height: 1.5;
    }
    .invoice-actions {
      margin-top: 32px;
      padding-top: 24px;
      border-top: 1px solid #e5e7eb;
      display: flex;
      gap: 12px;
      justify-content: center;
    }
    @media print {
      .invoice-actions { display: none !important; }
      body { background: white !important; }
      #invoice-template { box-shadow: none !important; margin: 0 !important; }
    }
  `;

  const InvoiceTemplate = ({ invoice, showActions = true }) => {
    if (!invoice) return null;

    return (
      <div id="invoice-template" style={{ padding: '40px', maxWidth: '800px', margin: '0 auto', background: 'white' }}>
        <div className="invoice-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px' }}>
          <div>
            <h1 className="invoice-title" style={{ fontSize: '36px', fontWeight: '700', color: '#111827', marginBottom: '8px', letterSpacing: '-0.025em' }}>
              INVOICE
            </h1>
          </div>
          <div style={{ textAlign: 'right' }}>
            <img
              src={logo}
              alt="Company Logo"
              style={{ maxHeight: '100px', width: 'auto' }}
            />
          </div>
        </div>
        <div className="invoice-details" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', marginBottom: '40px' }}>
          <div>
            <div className="detail-section" style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#6b7280', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Invoice number
              </h3>
              <p style={{ fontSize: '14px', color: '#374151', marginBottom: '4px' }}>
                {invoice?.invoiceNo || "00001"}
              </p>
            </div>
            <div className="detail-section" style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#6b7280', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Date of issue
              </h3>
              <p style={{ fontSize: '14px', color: '#374151', marginBottom: '4px' }}>
                {invoice?.date || new Date().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '/')}
              </p>
            </div>
          </div>
          <div>
            <div className="detail-section">
              <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#6b7280', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Billed to
              </h3>
              <p style={{ fontSize: '14px', color: '#374151', marginBottom: '4px' }}>
                {invoice?.patientName || "Client Name"}
              </p>
              <p style={{ fontSize: '14px', color: '#374151', marginBottom: '4px' }}>
                Street address
              </p>
              <p style={{ fontSize: '14px', color: '#374151', marginBottom: '4px' }}>
                City, State, Country
              </p>
              <p style={{ fontSize: '14px', color: '#374151', marginBottom: '4px' }}>
                ZIP Code
              </p>
            </div>
          </div>
        </div>
        <table className="invoice-table" style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '32px' }}>
          <thead>
            <tr>
              <th style={{ background: '#f9fafb', padding: '12px 16px', textAlign: 'left', fontWeight: '600', fontSize: '14px', color: '#374151', borderBottom: '1px solid #e5e7eb' }}>
                Description
              </th>
              <th style={{ background: '#f9fafb', padding: '12px 16px', textAlign: 'right', fontWeight: '600', fontSize: '14px', color: '#374151', borderBottom: '1px solid #e5e7eb' }}>
                Unit cost
              </th>
              <th style={{ background: '#f9fafb', padding: '12px 16px', textAlign: 'right', fontWeight: '600', fontSize: '14px', color: '#374151', borderBottom: '1px solid #e5e7eb' }}>
                Qty / Hr rate
              </th>
              <th style={{ background: '#f9fafb', padding: '12px 16px', textAlign: 'right', fontWeight: '600', fontSize: '14px', color: '#374151', borderBottom: '1px solid #e5e7eb' }}>
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            {invoice?.items?.length > 0 ? (
              invoice.items.map((item, idx) => (
                <tr key={idx}>
                  <td style={{ padding: '16px', borderBottom: '1px solid #f3f4f6', fontSize: '14px', color: '#374151' }}>
                    {item.description || "Your item name"}
                  </td>
                  <td style={{ padding: '16px', borderBottom: '1px solid #f3f4f6', fontSize: '14px', color: '#374151', textAlign: 'right' }}>
                    ₹{item.cost || 0}
                  </td>
                  <td style={{ padding: '16px', borderBottom: '1px solid #f3f4f6', fontSize: '14px', color: '#374151', textAlign: 'right' }}>
                    {item.quantity || 1}
                  </td>
                  <td style={{ padding: '16px', borderBottom: '1px solid #f3f4f6', fontSize: '14px', color: '#374151', textAlign: 'right' }}>
                    ₹{item.amount || 0}
                  </td>
                </tr>
              ))
            ) : (
              Array.from({ length: 6 }, (_, idx) => (
                <tr key={idx}>
                  <td style={{ padding: '16px', borderBottom: '1px solid #f3f4f6', fontSize: '14px', color: '#374151' }}>
                    Your item name
                  </td>
                  <td style={{ padding: '16px', borderBottom: '1px solid #f3f4f6', fontSize: '14px', color: '#374151', textAlign: 'right' }}>
                    ₹0
                  </td>
                  <td style={{ padding: '16px', borderBottom: '1px solid #f3f4f6', fontSize: '14px', color: '#374151', textAlign: 'right' }}>
                    1
                  </td>
                  <td style={{ padding: '16px', borderBottom: '1px solid #f3f4f6', fontSize: '14px', color: '#374151', textAlign: 'right' }}>
                    ₹0
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <div className="invoice-totals" style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '32px' }}>
          <div className="totals-section" style={{ width: '300px' }}>
            <div className="total-row" style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontSize: '14px', color: '#374151', borderBottom: '1px solid #f3f4f6' }}>
              <span>Subtotal</span>
              <span>₹{invoice?.subtotal || invoice?.billedAmount || 0}</span>
            </div>
            <div className="total-row" style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontSize: '14px', color: '#374151', borderBottom: '1px solid #f3f4f6' }}>
              <span>Discount</span>
              <span>₹{invoice?.discount || 0}</span>
            </div>
            <div className="total-row" style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontSize: '14px', color: '#374151', borderBottom: '1px solid #f3f4f6' }}>
              <span>Tax rate</span>
              <span>{invoice?.taxRate || 0}%</span>
            </div>
            <div className="total-row" style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontSize: '14px', color: '#374151', borderBottom: '1px solid #f3f4f6' }}>
              <span>Tax</span>
              <span>₹{invoice?.tax || 0}</span>
            </div>
            <div className="total-row final" style={{ background: '#374151', color: 'white', padding: '16px 20px', marginTop: '12px', borderRadius: '4px', fontWeight: '600', fontSize: '18px', display: 'flex', justifyContent: 'space-between' }}>
              <span>Invoice total</span>
              <span>₹{invoice?.total || invoice?.billedAmount || 2000}</span>
            </div>
          </div>
        </div>
        <div className="invoice-terms" style={{ marginTop: '40px', paddingTop: '24px', borderTop: '1px solid #e5e7eb' }}>
          <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>Terms</h3>
          <p style={{ fontSize: '12px', color: '#6b7280', lineHeight: '1.5' }}>
            E.g. Please pay invoice by {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '/')}
          </p>
        </div>
        <div style={{ marginTop: '48px', textAlign: 'center', fontSize: '12px', color: '#9ca3af' }}>
          <p>Thank you for choosing AV Swasthya for your healthcare needs</p>
          <p style={{ marginTop: '4px' }}>contact@avswasthya.com | +91 98765 43210</p>
        </div>
        {showActions && (
          <div className="invoice-actions no-print" style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid #e5e7eb', display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button
              onClick={() => handlePrint(invoice)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-gray-700 border"
            >
              <Printer className="w-4 h-4" /> Print
            </button>
            {invoice?.balance > 0 && (
              <button
                onClick={() => handlePay(invoice)}
                className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
              >
                <CreditCard className="w-4 h-4" /> Pay ₹{invoice.balance}
              </button>
            )}
          </div>
        )}
      </div>
    );
  };

  const tableColumns = [
    { header: 'Invoice ID', accessor: 'invoiceNo', clickable: true },
    { header: 'Date', accessor: 'date' },
    { header: 'Doctor/Provider', accessor: 'doctorName' },
    { header: 'Service', accessor: 'serviceType' },
    { header: 'Billed Amount', accessor: 'billedAmount', cell: (row) => `₹${row.billedAmount}` },
    { header: 'Paid Amount', accessor: 'paidAmount', cell: (row) => `₹${row.paidAmount}` },
    { header: 'Status', accessor: 'status', cell: (row) => <span className={getStatusBadgeClass(row.status)}>{getStatusText(row.status)}</span> },
    {
      header: 'Actions',
      accessor: 'actions',
      cell: (row) => (
        <div className="flex items-center gap-2 justify-end">
          {row.balance > 0 && (
            <button
              onClick={() => handlePay(row)}
              className="flex items-center gap-1 px-2 py-1 text-xs text-white bg-orange-500 hover:bg-orange-600 rounded-lg transition-colors"
              title="Pay Now"
            >
              <span>Pay</span>
            </button>
          )}
          <button onClick={() => handleShare(row)} className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors" title="Share">
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <h1 className="h2-heading">Billing</h1>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <button
                onClick={handleSearchToggle}
                className={`flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-300 ${
                  isSearchExpanded
                    ? "bg-[var(--accent-color)] text-white"
                    : "bg-gray-100 text-[var(--primary-color)] hover:bg-gray-200"
                }`}
                title="Search Records"
              >
                <Search className="w-4 h-4" />
              </button>
              <div className={`transition-all duration-300 ease-in-out ${
                isSearchExpanded ? "w-64 opacity-100" : "w-0 opacity-0"
              } overflow-hidden`}>
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Search invoices, doctors..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)] text-sm"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

   

      {filteredRecords.length > 0 ? (
        <div className="overflow-x-auto">
          <DynamicTable columns={tableColumns} data={filteredRecords} showSearchBar={false} onCellClick={(row, column) => column.accessor === 'invoiceNo' && handleView(row)} />
        </div>
      ) : searchQuery ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Search className="w-16 h-16 text-gray-400 mb-4" />
          <h3 className="h3-heading mb-2">No records found</h3>
          <p className="paragraph mb-6">No records found for "{searchQuery}"</p>
          <button onClick={handleClearSearch} className="btn btn-secondary">Clear Search</button>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <FileText className="w-16 h-16 text-gray-400 mb-4" />
          <h3 className="h3-heading mb-2">No billing records found</h3>
          <p className="paragraph mb-6">You don't have any billing records yet. Add your first bill to get started.</p>
          <button onClick={handleAddBill} className="btn btn-primary flex items-center gap-2">
            <Plus className="w-5 h-5" /> Add First Bill
          </button>
        </div>
      )}

      {showPaymentGateway && paymentInvoice && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 modal-fadeIn p-4">
          <div className="relative w-full max-w-md mx-auto">
            <button
              onClick={() => { setShowPaymentGateway(false); setPaymentInvoice(null); }}
              className="absolute top-4 right-4 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
              title="Close Payment Gateway"
            >
              <span className="text-gray-600 text-xl">✕</span>
            </button>
            <div className="">
              <PaymentGatewayPage
                isOpen={showPaymentGateway}
                onClose={() => { setShowPaymentGateway(false); setPaymentInvoice(null); }}
                amount={paymentInvoice.balance}
                bookingId={paymentInvoice.invoiceNo}
                merchantName="AV Swasthya"
                methods={['card', 'upi', 'wallet', 'netbanking']}
                onPaymentSuccess={handlePaymentSuccess}
                onPaymentFailure={handlePaymentFailure}
                currency="₹"
                customerDetails={{
                  name: `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || "Patient Name",
                  email: user?.email || "patient@example.com",
                  phone: user?.phone || "+91 9876543210"
                }}
                description={`Payment for ${paymentInvoice.serviceType} - ${paymentInvoice.doctorName}`}
              />
            </div>
          </div>
        </div>
      )}

      {selectedInvoice && !showPaymentGateway && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 modal-fadeIn">
          <div className="relative w-full max-w-5xl mx-auto">
            <div className="bg-white rounded-xl shadow-2xl w-full max-h-[90vh] overflow-y-auto modal-slideUp">
              <div className="flex justify-end p-4 border-b border-gray-200">
                <button onClick={() => setSelectedInvoice(null)} className="text-gray-400 hover:text-gray-600 text-xl transition-colors" title="Close">
                  ✕
                </button>
              </div>
              <InvoiceTemplate invoice={selectedInvoice} showActions={true} />
            </div>
          </div>
        </div>
      )}

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      <style>{`
        .h2-heading {
          font-size: 2rem;
          font-weight: 700;
          color: #0E1630;
          margin: 0;
        }
        .h3-heading {
          font-size: 1.5rem;
          font-weight: 600;
          color: #0E1630;
        }
        .h4-heading {
          font-size: 1.25rem;
          font-weight: 600;
          color: #0E1630;
        }
        .paragraph {
          line-height: 1.6;
          color: rgba(14, 22, 48, 0.7);
        }
        .status-completed {
          background: #dcfce7;
          color: #166534;
          padding: 0.25rem 0.75rem;
          border-radius: 1rem;
          font-size: 0.75rem;
          font-weight: 600;
        }
        .status-pending {
          background: #fef3c7;
          color: #92400e;
          padding: 0.25rem 0.75rem;
          border-radius: 1rem;
          font-size: 0.75rem;
          font-weight: 600;
        }
        .btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          padding: 0.5rem 2rem;
          border-radius: 9999px;
          color: white;
          font-weight: 600;
          transition: all 0.3s;
          text-decoration: none;
          border: none;
          cursor: pointer;
        }
        .btn-primary {
          background: #0E1630;
        }
        .btn-primary:hover {
          transform: scale(1.05);
          box-shadow: 0 1px 2px rgba(0,0,0,0.1);
        }
        .btn-secondary {
          border: 1px solid #01D48C;
          color: #01D48C;
          background: white;
        }
        .btn-secondary:hover {
          background: #01D48C;
          color: white;
          box-shadow: 0 4px 6px rgba(1, 212, 140, 0.4);
        }
        .input-field {
          padding: 0.75rem 1rem;
          border: 1px solid #d1d5db;
          border-radius: 0.5rem;
          font-size: 0.875rem;
          transition: border-color 0.2s;
        }
        .input-field:focus {
          outline: none;
          border-color: #01D48C;
          box-shadow: 0 0 0 3px rgba(1, 212, 140, 0.1);
        }
        .modal-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .modal-slideUp {
          animation: slideUp 0.3s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @media print {
          body * { visibility: hidden; }
          #invoice-template, #invoice-template * { visibility: visible; }
          #invoice-template {
            position: absolute;
            left: 0;
            top: 0;
            width: 100% !important;
            margin: 0 !important;
            box-shadow: none !important;
          }
          .no-print { display: none !important; }
        }
      `}</style>
    </div>
  );
};

export default Billing;