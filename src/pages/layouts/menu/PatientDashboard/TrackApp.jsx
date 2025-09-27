import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  MapPin, 
  Phone, 
  Download, 
  Printer, 
  Share2, 
  Clock,
  Calendar,
  CreditCard,
  Building2,
  TestTube,
  Check
} from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const TrackAppointment = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const printRef = useRef();

  useEffect(() => {
    fetchAppointment();
    const interval = setInterval(fetchAppointment, 10000);
    return () => clearInterval(interval);
  }, [bookingId]);

  const fetchAppointment = async () => {
    try {
      const res = await axios.get("https://680b3642d5075a76d98a3658.mockapi.io/Lab/payment");
      const found = res.data.find((item) => item.bookingId === bookingId);
      if (!found) throw new Error("Appointment not found");
      setAppointment(found);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching appointment:", error);
      alert("Failed to fetch appointment details. Please try again later.");
    }
  };

  const handleDownloadReport = async () => {
    const input = printRef.current;
    const canvas = await html2canvas(input);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${appointment?.testTitle || "Lab_Report"}.pdf`);
  };

  const handlePrintReceipt = () => {
    const printContent = printRef.current.innerHTML;
    const printWindow = window.open("", "", "width=900,height=650");
    printWindow.document.write(`
      <html>
        <head>
          <title>Print Receipt</title>
          <style>
            body { font-family: sans-serif; padding: 20px; }
            h1 { margin-bottom: 20px; }
            .no-print { display: none !important; }
          </style>
        </head>
        <body>${printContent}</body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const handleShareDetails = () => {
    if (navigator.share) {
      navigator.share({
        title: "Track Your Appointment",
        text: `Appointment for ${appointment?.patientName} at ${appointment?.labName}`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  const steps = [
    { title: "Appointment", subtitle: "Confirmed" },
    { title: "Technician", subtitle: "On the Way" },
    { title: "Sample", subtitle: "Collected" },
    { title: "Test", subtitle: "Processing" },
    { title: "Report", subtitle: "Ready" }
  ];

  const getCurrentStep = (status) => {
    const statusMap = {
      "Appointment Confirmed": 0,
      "Technician On the Way": 1,
      "Sample Collected": 2,
      "Test Processing": 3,
      "Report Ready": 4,
    };
    return statusMap[status] || 0;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4 text-center">Loading appointment details...</p>
        </div>
      </div>
    );
  }

  const currentStep = appointment ? getCurrentStep(appointment.status) : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Back button */}
        <button
          className="mb-6 flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
          onClick={() => navigate("/patientdashboard/app", { state: { activeTab: "lab" } })}
        >
          ← Back to Home
        </button>

        {/* Header Section */}
        <div className="bg-[var(--color-surface)] rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
    
    {/* Left: Lab Info */}
    <div className="flex items-center gap-4">
      <div className="bg-[var(--accent-color)]/10 rounded-xl p-3">
        <Building2 className="w-7 h-7 text-[var(--accent-color)]" />
      </div>
      <div>
        <h1 className="h4-heading">{appointment?.labName}</h1>
        <div className="flex flex-wrap items-center gap-4 mt-1">
          <div className="flex items-center gap-1 paragraph">
            <MapPin className="w-4 h-4 opacity-70" />
            <span>{appointment?.location}</span>
          </div>
          <div className="flex items-center gap-1 paragraph">
            <Phone className="w-4 h-4 opacity-70" />
            <span>{appointment?.labPhone || "+91 98765 43210"}</span>
          </div>
        </div>
      </div>
    </div>

    {/* Right: Appointment Details & Actions */}
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
      <div className="text-left sm:text-right">
        <div className="flex items-center gap-2 h4-heading">
          <Calendar className="w-5 h-5 text-[var(--accent-color)]" />
          <span>{appointment?.date ? new Date(appointment.date).toDateString() : "-"}</span>
        </div>
        <div className="flex items-center gap-2 paragraph mt-1">
          <Clock className="w-4 h-4 opacity-70" />
          <span>{appointment?.time || "-"}</span>
        </div>
      </div>
      
      <div className="flex items-center gap-2 no-print">
        <button
          onClick={handlePrintReceipt}
          className="flex items-center gap-2 bg-gray-50 hover:bg-gray-100 text-[var(--primary-color)] px-3 py-2 rounded-lg transition-all duration-200"
        >
          <Printer className="w-4 h-4" />
        </button>
        <button
          onClick={handleShareDetails}
          className="flex items-center gap-2 bg-gray-50 hover:bg-gray-100 text-[var(--primary-color)] px-3 py-2 rounded-lg transition-all duration-200"
        >
          <Share2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  </div>
</div>

        <div ref={printRef}>
          {/* Appointment Progress */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-100">
            <div className="text-center mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Appointment Progress</h2>
              <p className="text-gray-600">Track your appointment status in real-time</p>
            </div>

            {/* Progress Tracker */}
            <div className="max-w-5xl mx-auto">
              {/* Progress Line Container */}
              <div className="relative mb-16">
                {/* Background Line */}
                <div className="absolute top-6 left-8 right-0 h-1 bg-gray-200 rounded-full"></div>
                
                {/* Active Progress Line */}
                <div 
                  className="absolute top-6 left-0 h-1 bg-green-500 rounded-full transition-all duration-1000 ease-out"
                  style={{ 
                    width: `${(currentStep / (steps.length - 1)) * 100}%` 
                  }}
                ></div>

                {/* Steps Container */}
                <div className="relative flex justify-between">
                  {steps.map((step, index) => {
                    const isCompleted = index < currentStep;
                    const isCurrent = index === currentStep;
                    const isUpcoming = index > currentStep;

                    return (
                      <div key={index} className="flex flex-col items-center">
                        {/* Circle */}
                        <div className={`
                          relative z-10 w-12 h-12 rounded-full flex items-center justify-center
                          transition-all duration-500 ease-out
                          ${isCompleted 
                            ? 'bg-green-500 text-white shadow-lg' 
                            : isCurrent 
                            ? 'bg-green-500 text-white shadow-lg animate-pulse' 
                            : 'bg-gray-200 text-gray-400'
                          }
                        `}>
                          {isCompleted ? (
                            <Check className="w-6 h-6" />
                          ) : (
                            <div className={`
                              w-3 h-3 rounded-full 
                              ${isCurrent ? 'bg-white' : 'bg-current'}
                            `} />
                          )}
                        </div>

                        {/* Step Text */}
                        <div className="mt-4 text-center">
                          <div className={`
                            text-sm font-semibold transition-colors duration-300
                            ${isCompleted || isCurrent ? 'text-green-600' : 'text-gray-500'}
                          `}>
                            {step.title}
                          </div>
                          <div className={`
                            text-xs mt-1 transition-colors duration-300
                            ${isCompleted || isCurrent ? 'text-green-600' : 'text-gray-400'}
                          `}>
                            {step.subtitle}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Current Status Message */}
          
            </div>
          </div>

          {/* Info Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Test Info */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-blue-100 rounded-xl p-3">
                  <TestTube className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900">Test Information</h4>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600">Test Name</span>
                  <span className="font-semibold text-gray-900">{appointment?.testTitle}</span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="text-gray-600">Report Time</span>
                  <span className="font-semibold text-gray-900">
                    {appointment?.reportTime || "24-48 hours"}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Info */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 bg-blue-100 rounded-lg p-3">
                  <CreditCard className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-gray-900">Payment & Booking</h4>
                  <p className="text-gray-600 mt-1">Receipt and booking details</p>

                  <div className="mt-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="text-gray-600">Amount Paid</div>
                      <div className="text-lg font-bold text-green-600">
                        ₹{appointment?.amountPaid}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-gray-600">Payment Status</div>
                      <div className="px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-700">
                        {appointment?.paymentStatus}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-gray-600">Type</div>
                      <div className="text-gray-900 font-medium">
                        {appointment?.appointmentType || "Lab Visit"}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-gray-600">Booking ID</div>
                      <div className="font-mono text-xs bg-gray-50 px-3 py-1 rounded border">
                        {appointment?.bookingId}
                      </div>
                    </div>

                  
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>  
    </div>
  );
};

export default TrackAppointment;