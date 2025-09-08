//payment Gateway
import React, { useState, useEffect } from "react";
import * as Lucide from "lucide-react";
import logo from "../../assets/logo.png";

const PaymentGateway = ({
  isOpen,
  onClose,
  amount,
  bookingId,
  merchantName = "DigiHealth",
  methods = ["upi", "card", "netbanking", "wallet"],
  onPay,
  currency = "₹",
  logo: propLogo,
}) => {
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [upiId, setUpiId] = useState("");
  const [cardData, setCardData] = useState({ number: "", name: "", expiry: "", cvv: "" });
  const [selectedBank, setSelectedBank] = useState("");
  const [selectedWallet, setSelectedWallet] = useState("");
  const [timeLeft, setTimeLeft] = useState(600);
  const [currentStep, setCurrentStep] = useState("method-selection");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const timer = setInterval(() => setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0)), 1000);
    return () => clearInterval(timer);
  }, [isOpen]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const paymentMethods = [
    { id: "upi", name: "UPI", icon: Lucide.Smartphone, providers: ["GPay", "PhonePe", "Paytm", "BHIM"], color: "text-green-600" },
    { id: "card", name: "Cards", icon: Lucide.CreditCard, providers: ["Visa", "Mastercard", "RuPay"], color: "text-[color:var(--primary-color)]" },
    { id: "netbanking", name: "Netbanking", icon: Lucide.Building2, providers: ["SBI", "HDFC", "ICICI", "Axis"], color: "text-orange-600" },
    { id: "wallet", name: "Wallet", icon: Lucide.Wallet, providers: ["Paytm", "Amazon Pay", "MobiKwik"], color: "text-purple-600" },
  ].filter((method) => methods.includes(method.id));

  const banks = ["State Bank of India", "HDFC Bank", "ICICI Bank", "Axis Bank", "Kotak Mahindra Bank", "Punjab National Bank"];
  const wallets = ["Paytm", "Amazon Pay", "MobiKwik", "Freecharge", "JioMoney"];

  const handleProceed = () => setCurrentStep("payment-form");
  const handleBack = () => { setCurrentStep("method-selection"); setOtp(""); };
  const handleOtpVerify = () => {
    if (otp === "1234") {
      setLoading(true);
      setTimeout(() => {
        const data = selectedMethod === "upi" ? { upiId } :
                     selectedMethod === "card" ? cardData :
                     selectedMethod === "netbanking" ? { bank: selectedBank } : { wallet: selectedWallet };
        onPay(selectedMethod, data);
        setCurrentStep("success");
        setLoading(false);
      }, 2000);
    } else alert("Invalid OTP. Please try again.");
  };
  const handleSubmit = (e) => { e.preventDefault(); setCurrentStep("otp-step"); };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl h-full max-h-[95vh] sm:max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex flex-col lg:flex-row flex-1 min-h-0">
          {/* Left Sidebar */}
          <div className="w-full lg:w-2/5 bg-[color:var(--primary-color)] text-white p-4 sm:p-6 lg:p-8 relative overflow-hidden flex-shrink-0">
            <div className="absolute inset-0 bg-gradient-to-br from-[color:var(--primary-color)] to-[color:var(--primary-color)]/80"></div>
            <div className="relative z-10 h-full flex flex-col">
              <div className="flex items-center gap-3 mb-4 sm:mb-6">
                <img src={propLogo || logo} alt={merchantName} className="h-12 w-12 object-contain" />
                <span className="font-semibold text-lg sm:text-xl">{merchantName}</span>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
                <div className="text-white/80 text-xs sm:text-sm mb-1">Amount to Pay</div>
                <div className="text-2xl sm:text-3xl font-bold">{currency}{amount}</div>
                {bookingId && <div className="text-white/60 text-xs mt-2">Booking ID: #{bookingId}</div>}
              </div>
              <div className="text-right text-white/80 text-sm mb-4 sm:mb-8">⏱ {formatTime(timeLeft)}</div>
              <div className="mt-auto">
                <div className="flex items-center gap-2 text-white/60 text-xs">
                  <Lucide.Shield size={16} /><span>Secured by SSL Encryption</span>
                </div>
              </div>
            </div>
            <div className="absolute bottom-0 right-0 opacity-10"><Lucide.CreditCard size={80} className="sm:w-[120px] sm:h-[120px]" /></div>
            <div className="absolute top-1/2 -right-8 opacity-5"><Lucide.Smartphone size={60} className="sm:w-[100px] sm:h-[100px]" /></div>
          </div>

          {/* Right Payment Section */}
          <div className="w-full lg:w-3/5 flex flex-col min-h-0 relative">
            {/* Updated Top Bar */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-100 flex-shrink-0">
              <div>
                {currentStep !== "method-selection" && (
                  <button
                    onClick={handleBack}
                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-[color:var(--primary-color)] transition-colors"
                  >
                    <Lucide.ArrowLeft size={16} />
                    <span className="hidden sm:inline">Back</span>
                  </button>
                )}
              </div>
              <div>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-[color:var(--primary-color)] transition-colors p-1"
                >
                  <Lucide.X size={24} />
                </button>
              </div>
            </div>

            {/* Rest of the Payment Section */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              {currentStep === "method-selection" && (
                <div className="space-y-4 sm:space-y-6">
                  <h2 className="text-xl sm:text-2xl font-semibold text-[color:var(--primary-color)]">Payment Options</h2>
                  <div className="space-y-3 max-h-[50vh] sm:max-h-none overflow-y-auto">
                    {paymentMethods.map((method) => {
                      const IconComponent = method.icon;
                      return (
                        <div
                          key={method.id}
                          onClick={() => { setSelectedMethod(method.id); handleProceed(); }}
                          className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg cursor-pointer transition-all shadow hover:shadow-lg border border-gray-100 hover:border-[color:var(--primary-color)]/20 bg-white"
                        >
                          <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gray-50 flex items-center justify-center ${method.color}`}>
                            <IconComponent size={20} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-[color:var(--primary-color)] text-sm sm:text-base">{method.name}</div>
                            <div className="text-gray-500 text-xs sm:text-sm truncate">{method.providers.join(", ")}</div>
                          </div>
                          <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 border-gray-300 flex-shrink-0" />
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              {currentStep === "payment-form" && (
                <div className="space-y-4 sm:space-y-6">
                  {selectedMethod === "upi" && (
                    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                      <h3 className="font-semibold flex items-center gap-2 text-[color:var(--primary-color)] text-lg sm:text-xl">
                        <Lucide.QrCode size={20} /> UPI Payment
                      </h3>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                        <div className="text-center">
                          <div className="w-32 h-32 sm:w-48 sm:h-48 mx-auto bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                            <Lucide.QrCode size={80} className="sm:w-[120px] sm:h-[120px] text-gray-400" />
                          </div>
                          <p className="text-xs sm:text-sm text-gray-600">Scan with any UPI app</p>
                        </div>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">UPI ID / Number</label>
                            <input
                              type="text"
                              placeholder="example@okhdfc"
                              value={upiId}
                              onChange={(e) => setUpiId(e.target.value)}
                              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-color)] focus:border-[color:var(--primary-color)] text-sm sm:text-base"
                              required
                            />
                          </div>
                          <button
                            type="submit"
                            className="w-full py-3 bg-[color:var(--primary-color)] text-white rounded-lg hover:bg-[color:var(--primary-color)]/90 transition-colors font-medium text-sm sm:text-base"
                          >
                            Verify and Pay
                          </button>
                        </div>
                      </div>
                    </form>
                  )}
                  {selectedMethod === "card" && (
                    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                      <h3 className="font-semibold flex items-center gap-2 text-[color:var(--primary-color)] text-lg sm:text-xl">
                        <Lucide.CreditCard size={20} /> Card Details
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
                          <input
                            type="text"
                            placeholder="1234 5678 9012 3456"
                            value={cardData.number}
                            onChange={(e) => setCardData({ ...cardData, number: e.target.value })}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-color)] focus:border-[color:var(--primary-color)] text-sm sm:text-base"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Cardholder Name</label>
                          <input
                            type="text"
                            placeholder="John Doe"
                            value={cardData.name}
                            onChange={(e) => setCardData({ ...cardData, name: e.target.value })}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-color)] focus:border-[color:var(--primary-color)] text-sm sm:text-base"
                            required
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
                            <input
                              type="text"
                              placeholder="MM/YY"
                              value={cardData.expiry}
                              onChange={(e) => setCardData({ ...cardData, expiry: e.target.value })}
                              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-color)] focus:border-[color:var(--primary-color)] text-sm sm:text-base"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
                            <input
                              type="password"
                              placeholder="123"
                              value={cardData.cvv}
                              onChange={(e) => setCardData({ ...cardData, cvv: e.target.value })}
                              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-color)] focus:border-[color:var(--primary-color)] text-sm sm:text-base"
                              required
                            />
                          </div>
                        </div>
                      </div>
                      <button
                        type="submit"
                        className="w-full py-3 bg-[color:var(--primary-color)] text-white rounded-lg hover:bg-[color:var(--primary-color)]/90 transition-colors font-medium text-sm sm:text-base"
                      >
                        Pay {currency}{amount}
                      </button>
                    </form>
                  )}
                  {selectedMethod === "netbanking" && (
                    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                      <h3 className="font-semibold flex items-center gap-2 text-[color:var(--primary-color)] text-lg sm:text-xl">
                        <Lucide.Building2 size={20} /> Net Banking
                      </h3>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Select Bank</label>
                        <select
                          value={selectedBank}
                          onChange={(e) => setSelectedBank(e.target.value)}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-color)] focus:border-[color:var(--primary-color)] text-sm sm:text-base bg-white"
                          required
                        >
                          <option value="">Select Bank</option>
                          {banks.map((bank) => <option key={bank} value={bank}>{bank}</option>)}
                        </select>
                      </div>
                      <button
                        type="submit"
                        disabled={!selectedBank}
                        className={`w-full py-3 rounded-lg font-medium text-sm sm:text-base transition-colors ${selectedBank ? "bg-[color:var(--primary-color)] text-white hover:bg-[color:var(--primary-color)]/90" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
                      >
                        Pay {currency}{amount}
                      </button>
                    </form>
                  )}
                  {selectedMethod === "wallet" && (
                    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                      <h3 className="font-semibold flex items-center gap-2 text-[color:var(--primary-color)] text-lg sm:text-xl">
                        <Lucide.Wallet size={20} /> Digital Wallet
                      </h3>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Select Wallet</label>
                        <select
                          value={selectedWallet}
                          onChange={(e) => setSelectedWallet(e.target.value)}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-color)] focus:border-[color:var(--primary-color)] text-sm sm:text-base bg-white"
                          required
                        >
                          <option value="">Select Wallet</option>
                          {wallets.map((wallet) => <option key={wallet} value={wallet}>{wallet}</option>)}
                        </select>
                      </div>
                      <button
                        type="submit"
                        disabled={!selectedWallet}
                        className={`w-full py-3 rounded-lg font-medium text-sm sm:text-base transition-colors ${selectedWallet ? "bg-[color:var(--primary-color)] text-white hover:bg-[color:var(--primary-color)]/90" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
                      >
                        Pay {currency}{amount}
                      </button>
                    </form>
                  )}
                </div>
              )}
              {currentStep === "otp-step" && (
                <div className="text-center space-y-4 sm:space-y-6 max-w-md mx-auto">
                  <div className="w-16 h-16 bg-[color:var(--primary-color)]/10 rounded-full flex items-center justify-center mx-auto">
                    <Lucide.Shield size={24} className="text-[color:var(--primary-color)]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[color:var(--primary-color)] text-lg sm:text-xl mb-2">Enter OTP</h3>
                    <p className="text-sm text-gray-600">We've sent a 4-digit code to your registered mobile number</p>
                  </div>
                  <div className="flex gap-2 justify-center">
                    {[0, 1, 2, 3].map((index) => (
                      <input
                        key={index}
                        type="text"
                        maxLength={1}
                        value={otp[index] || ""}
                        onChange={(e) => {
                          const newOtp = otp.split("");
                          newOtp[index] = e.target.value;
                          setOtp(newOtp.join(""));
                          if (e.target.value && index < 3) {
                            const nextInput = e.target.nextSibling;
                            if (nextInput) nextInput.focus();
                          }
                        }}
                        className="w-10 h-10 sm:w-12 sm:h-12 text-center font-bold border-2 border-[color:var(--primary-color)]/30 rounded-lg outline-none focus:border-[color:var(--primary-color)] text-sm sm:text-base"
                      />
                    ))}
                  </div>
                  <p className="text-xs text-gray-500">Hint: Use OTP "1234" for demo</p>
                  <button
                    onClick={handleOtpVerify}
                    disabled={otp.length !== 4}
                    className={`w-full py-3 rounded-lg font-medium text-sm sm:text-base transition-colors ${otp.length === 4 ? "bg-[color:var(--primary-color)] text-white hover:bg-[color:var(--primary-color)]/90" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
                  >
                    {loading ? "Verifying..." : "Verify & Pay"}
                  </button>
                </div>
              )}
              {currentStep === "success" && (
                <div className="text-center space-y-4 sm:space-y-6 max-w-md mx-auto">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <Lucide.CheckCircle className="text-green-600" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-green-600 text-lg sm:text-xl mb-2">Payment Successful!</h3>
                    <p className="text-sm text-gray-600">Your payment of {currency}{amount} has been processed successfully.</p>
                  </div>
                  <button
                    onClick={onClose}
                    className="w-full py-3 bg-[color:var(--primary-color)] text-white rounded-lg hover:bg-[color:var(--primary-color)]/90 transition-colors font-medium text-sm sm:text-base"
                  >
                    Close
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentGateway;