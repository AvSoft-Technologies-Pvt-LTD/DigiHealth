import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import QRCode from "qrcode";
import { Download, X, Check, Crown, Star, Shield, Zap, KeyRound } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logo from '../assets/logo.png';

const API_BASE_URL = "https://6801242781c7e9fbcc41aacf.mockapi.io/api/AV1";
const CARD_API_URL = "https://681075c727f2fdac24116e70.mockapi.io/user/healthcard";

const subscriptionPlans = [
  {
    id: "basic",
    name: "Basic",
    price: "₹299",
    period: "/month",
    icon: Shield,
    color: "blue",
    gradient: "from-blue-700 to-blue-900",
    cardGradient: "from-[#1E40AF] to-[#1E3A8A]",
    qrColor: "#1E40AF",
    benefits: [
      "Basic health card",
      "QR code access",
      "Emergency contacts",
      "Basic medical history"
    ]
  },
  {
    id: "silver",
    name: "Silver",
    price: "₹599",
    period: "/month",
    icon: Star,
    color: "gray",
    gradient: "from-gray-600 to-gray-800", // Darker gradient for Silver
    cardGradient: "from-[#374151] to-[#1F2937]", // Darker gradient for Silver card
    qrColor: "#6B7280",
    benefits: [
      "Enhanced health card design",
      "Priority medical support",
      "Detailed health analytics",
      "Family member cards"
    ]
  },
  {
    id: "gold",
    name: "Gold",
    price: "₹999",
    period: "/month",
    icon: Crown,
    color: "yellow",
    gradient: "from-yellow-500 to-yellow-700",
    cardGradient: "from-[#FFD700] to-[#FFA500]",
    qrColor: "#B8860B",
    benefits: [
      "Premium gold card design",
      "24/7 health concierge",
      "Advanced health monitoring",
      "Specialist consultations"
    ]
  },
  {
    id: "platinum",
    name: "Platinum",
    price: "₹1,499",
    period: "/month",
    icon: Zap,
    color: "purple",
    gradient: "from-purple-800 to-purple-950",
    cardGradient: "from-[#4C1D95] to-[#5B21B6]",
    qrColor: "#7C3AED",
    benefits: [
      "Exclusive platinum card",
      "Personal health manager",
      "AI-powered health insights",
      "Global medical coverage"
    ]
  }
];

function Healthcard({ hideLogin }) {
  const [userData, setUserData] = useState(null);
  const [healthId, setHealthId] = useState("");
  const [isCardGenerated, setIsCardGenerated] = useState(false);
  const [rtoData, setRtoData] = useState({ states: { "Maharashtra": "MH" }, districts: { "Mumbai": "01" } });
  const [qrImage, setQrImage] = useState("");
  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);
  const [showModal, setShowModal] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(true);
  const [subscription, setSubscription] = useState(localStorage.getItem("subscription") || null);
  const [selectedPlan, setSelectedPlan] = useState(subscriptionPlans.find(p => p.id === "gold"));
  const navigate = useNavigate();
  const userEmail = useSelector((state) => state.auth.user?.email);
  const cardRef = useRef(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/users?email=${userEmail}`);
        if (res.data && res.data.length > 0) {
          setUserData(res.data[0]);
        }
      } catch (err) {
        console.error("Failed to fetch user data", err);
        setUserData(null);
      }
    };
    if (userEmail) fetchUserData();
  }, [userEmail]);

  useEffect(() => {
    if (healthId && subscription) {
      const plan = subscriptionPlans.find(p => p.id === subscription);
      QRCode.toDataURL(
        healthId,
        {
          width: 128,
          margin: 2,
          color: { dark: plan?.qrColor || "#01D48C", light: "#FFFFFF" },
        },
        (err, url) => {
          if (err) return console.error("QR generation failed:", err);
          setQrImage(url);
        }
      );
    }
  }, [healthId, subscription]);

  const generateHealthId = (userData) => {
    const now = new Date();
    const datePart =
      String(now.getFullYear()).slice(-2) +
      String(now.getMonth() + 1).padStart(2, "0") +
      String(now.getDate()).padStart(2, "0");
    const stateCode = rtoData.states?.[userData.state] || "XX";
    const districtCode = rtoData.districts?.[userData.city] || "00";
    const gender = userData.gender?.charAt(0).toUpperCase() || "X";
    const aadhaar = userData.aadhaar?.slice(-4) || "0000";
    const serial = Math.floor(Math.random() * 9) + 1;
    return `${datePart}-${stateCode}${districtCode}${gender}-${aadhaar}${serial}`;
  };

  useEffect(() => {
    const autoGenerateCard = async () => {
      if (!userData?.aadhaar || isCardGenerated || !subscription) return;
      try {
        const genId = generateHealthId(userData);
        setHealthId(genId);
        localStorage.setItem("healthId", genId);
        setIsCardGenerated(true);
      } catch (e) {
        console.error("Auto generation failed", e);
        toast.error("Could not auto-generate Health Card.");
      }
    };
    autoGenerateCard();
  }, [userData, isCardGenerated, subscription, rtoData]);

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
  };

  const handleScan = () => {
    setShowModal(true);
    toast.info(`OTP sent to ${userData.phone}: 123456`, { autoClose: 3000 });
  };

  const handleVerifyOTP = () => {
    const otp = otpDigits.join("");
    if (otp === "123456") {
      toast.success("OTP verified!", { autoClose: 2000 });
      setTimeout(() => {
        navigate("/medical-records", { state: { userData, healthId } });
      }, 1200);
    } else {
      toast.error("Invalid OTP. Please try again.", { autoClose: 3000 });
    }
  };

  const handleOtpChange = (e, idx) => {
    const value = e.target.value.replace(/[^0-9]/g, "").slice(0, 1);
    const newOtp = [...otpDigits];
    newOtp[idx] = value;
    setOtpDigits(newOtp);
    if (value && idx < 5) {
      document.getElementById(`otp-input-${idx + 1}`)?.focus();
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setOtpDigits(["", "", "", "", "", ""]);
  };

  const handleSubscriptionChoice = (planId) => {
    setSubscription(planId);
    localStorage.setItem("subscription", planId);
    setSelectedPlan(subscriptionPlans.find(p => p.id === planId));
    setShowSubscriptionModal(false);
  };

  const handleChangePlan = () => {
    setShowSubscriptionModal(true);
  };

  const currentPlan = subscriptionPlans.find(p => p.id === subscription);

  if (!userData) return <div className="text-center p-4">Loading user data...</div>;

  if (!subscription || showSubscriptionModal) {
    return (
      <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-md flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 w-full max-w-4xl mx-auto max-h-[90vh] overflow-y-auto shadow-xl relative">
          <button
            onClick={() => setShowSubscriptionModal(false)}
            className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 transition"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Choose Your Health Plan
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              Select the perfect plan for your healthcare needs and unlock premium features
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {subscriptionPlans.map((plan) => {
              const IconComponent = plan.icon;
              const isSelected = selectedPlan?.id === plan.id;
              return (
                <div
                  key={plan.id}
                  onClick={() => setSelectedPlan(plan)}
                  className={`relative cursor-pointer rounded-xl p-6 border-2 transition-all duration-300 hover:scale-102 hover:shadow-lg ${
                    isSelected
                      ? `border-${plan.color}-500 bg-${plan.color}-50 shadow-2xl ring-4 ring-${plan.color}-200`
                      : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                  }`}
                >
                  {plan.id === 'gold' && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-gradient-to-r from-yellow-500 to-yellow-700 text-white text-xs px-3 py-1 rounded-full font-semibold shadow-md whitespace-nowrap">
                        Most Popular
                      </span>
                    </div>
                  )}
                  <div className="text-center mb-4">
                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r ${plan.gradient} text-white mb-3 shadow-md`}>
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-1">{plan.name}</h3>
                    <div className="mb-3">
                      <span className="text-2xl font-bold text-gray-900">{plan.price}</span>
                      <span className="text-gray-500 text-sm">{plan.period}</span>
                    </div>
                  </div>
                  <ul className="space-y-2 mb-6 min-h-[120px]">
                    {plan.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start gap-2 text-xs text-gray-600">
                        <Check className={`w-3 h-3 mt-0.5 text-${plan.color}-500 flex-shrink-0`} />
                        <span className="leading-snug">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                  {isSelected && (
                    <div className={`absolute inset-0 rounded-xl border-2 border-${plan.color}-500 bg-${plan.color}-50/20 flex items-center justify-center`}>
                      <div className={`bg-${plan.color}-500 text-white rounded-full p-2 shadow-md`}>
                        <Check className="w-5 h-5" />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <div className="flex justify-center gap-4 mt-8">
            <button
              onClick={() => selectedPlan && handleSubscriptionChoice(selectedPlan.id)}
              disabled={!selectedPlan}
              className={`px-8 py-3 rounded-lg font-semibold transition-all duration-300 shadow-md ${
                selectedPlan
                  ? `bg-gradient-to-r ${selectedPlan.gradient} text-white hover:shadow-lg transform hover:scale-102`
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-50'
              }`}
            >
              {selectedPlan ? `Activate ${selectedPlan.name} Plan` : 'Select a Plan First'}
            </button>
          </div>
          <div className="text-center mt-6 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              🔒 Secure payment • 30-day money back guarantee • Cancel anytime
            </p>
          </div>
        </div>
      </div>
    );
  }

  const textColor = currentPlan?.id === "gold" ? "text-gray-800" : "text-white";
  const accentColor = currentPlan?.id === "gold" ? "text-gray-700" :
                     currentPlan?.id === "platinum" ? "text-purple-300" :
                     currentPlan?.id === "silver" ? "text-gray-200" : "text-blue-200";

  return (
    <div className="flex flex-col items-center justify-center min-w-full p-4">
      <ToastContainer position="top-right" />
      {currentPlan && (
        <div className="mb-6 flex items-center justify-center gap-3">
          <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r ${currentPlan.gradient} text-white font-bold shadow-xl`}>
            <currentPlan.icon className="w-5 h-5" />
            <span className="text-lg">{currentPlan.name} Member</span>
          </div>
          <button
            onClick={handleChangePlan}
            className="text-sm text-gray-300 hover:underline font-medium"
          >
            Change Plan
          </button>
        </div>
      )}
      <div
        ref={cardRef}
        className="relative w-full max-w-[400px] h-[250px] rounded-xl overflow-hidden shadow-xl mx-auto"
        style={{
          background: currentPlan?.cardGradient ?
            `linear-gradient(135deg, ${currentPlan.cardGradient.replace('from-[', '').replace('] to-[', ', ').replace(']', '')})` :
            'linear-gradient(135deg, #6B7280, #374151)'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
        <div className="relative h-full p-2 px-4 flex flex-col">
          <div className="flex justify-between items-start">
            <div className="flex items-center"></div>
            <div className="text-right">
              <div className="flex items-center">
                <img
                  src={logo}
                  alt="DigiHealth Logo"
                  className="w-16 h-16 object-contain"
                />
                <h1 className={`text-xl font-bold ${accentColor}`}>DigiHealth</h1>
              </div>
            </div>
          </div>
          <div className="flex justify-between items-center -mt-3">
            <div className="flex items-center gap-4">
              <img
                src={userData.photo || "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150"}
                alt="User"
                className="w-20 h-20 object-cover rounded-full border-2 border-white shadow-[0_10PX_15px_rgba(0,0,0,0.3)]"
              />
              <div className="space-y-0.5">
                <p className={`font-bold text-lg tracking-wider uppercase ${textColor}`}>
                  {userData.firstName} {userData.lastName}
                </p>
                <div className="flex items-center gap-2">
                  <div className={`flex items-center gap-2 text-sm ${textColor}`}>
                    <span className={"font-semibold text-sm"}>DOB:</span>
                    <span>{formatDate(userData.dob)}</span>
                    <span>|</span>
                  </div>
                  <div className={`flex items-center gap-2 text-sm ${textColor}`}>
                    <span className={"font-semibold text-sm"}>Gender:</span>
                    <span>{userData.gender}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4 flex justify-between items-center px-3">
            <div className="flex flex-col">
              <span className={`text-xs font-semibold ${textColor}`}>Health ID</span>
              <div className={`font-mono text-2xl tracking-wider font-bold ${textColor} inline-block`}>
                {healthId}
              </div>
              <div className={`flex items-center gap-2 text-xs mt-1 ${textColor}`}>
                <span className={"text-xs font-bold"}>Valid Upto:</span>
                <span>12/28</span>
              </div>
            </div>
            <div className="w-16 h-16 bg-white p-1.5 rounded-lg flex items-center justify-center shadow-lg">
              {qrImage && (
                <img
                  src={qrImage}
                  alt="QR Code"
                  className="w-full h-full cursor-pointer border-2 border-white shadow-[0_10PX_15px_rgba(0,0,0,0.3)]"
                  onClick={handleScan}
                />
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="flex gap-4 mt-6 justify-center w-full">
        <button
          onClick={() => {
            const title = document.title;
            document.title = "DigiHealth Card";
            window.print();
            document.title = title;
          }}
          className={`flex items-center gap-2 font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg ${
            currentPlan ? `bg-gradient-to-r ${currentPlan.gradient} text-white hover:shadow-xl` : 'bg-gray-600 text-white hover:bg-gray-700'
          }`}
        >
          <Download className="w-4 h-4" />
          Download Card
        </button>
        {!hideLogin && (
          <button
            onClick={() => navigate("/login")}
            className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-semibold"
          >
            Login
          </button>
        )}
      </div>
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-sm mx-auto shadow-2xl border border-blue-100">
            <div className="flex flex-col items-center mb-6">
              <div className="bg-blue-100 rounded-full p-3 mb-3">
                <KeyRound className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-1">OTP Verification</h2>
              <p className="text-gray-500 text-sm text-center">
                Enter the 6-digit code sent to <span className="font-semibold">{userData.phone}</span>
              </p>
            </div>
            <div className="flex justify-center gap-2 mb-6">
              {otpDigits.map((digit, idx) => (
                <input
                  key={idx}
                  id={`otp-input-${idx}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(e, idx)}
                  className="w-10 h-12 text-center text-xl border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  autoFocus={idx === 0}
                />
              ))}
            </div>
            <div className="flex justify-between items-center mb-4">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleVerifyOTP}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold shadow"
              >
                Verify
              </button>
            </div>
            <div className="text-xs text-gray-400 text-center">
              Didn&apos;t receive the code? <span className="text-blue-600 cursor-pointer hover:underline">Resend</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Healthcard;