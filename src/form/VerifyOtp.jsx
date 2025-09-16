import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';

const VerifyOtp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendLoading, setResendLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const inputRefs = useRef([]);

  // Extract data from location state
  const email = location.state?.email;
  const phone = location.state?.phone;
  const method = location.state?.method;
  const dummyOtp = location.state?.dummyOtp;

  // Redirect if no email/phone is provided
  useEffect(() => {
    if (!email && !phone) {
      navigate('/forgot-password');
      return;
    }

    // Set the verification code from the passed dummy OTP
    if (dummyOtp) {
      setVerificationCode(dummyOtp);
    } else {
      // Generate a new random OTP if not provided
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setVerificationCode(code);
      toast.success(`Dummy OTP: ${code} (for testing)`, { duration: 6000 });
    }
  }, [email, phone, dummyOtp, navigate]);

  // Start countdown timer
  useEffect(() => {
    if (timer > 0) {
      const countdown = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(countdown);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  const handleOtpChange = (e, index) => {
    const value = e.target.value.replace(/[^0-9]/g, ''); // Only allow numbers
    if (value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      setError(''); // Clear error when user starts typing

      // Auto-focus next input if a digit is entered
      if (value && index < 5) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    // Move focus to previous input on backspace if current input is empty
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Validation: Check if all OTP fields are filled
    if (otp.some(digit => !digit)) {
      setError('OTP is required');
      return;
    }

    const enteredOtp = otp.join('');
    setLoading(true);

    // Simulate OTP verification
    setTimeout(() => {
      setLoading(false);
      if (enteredOtp === verificationCode) {
        toast.success('OTP verified successfully!', {
          duration: 3000,
          position: 'top-center',
        });
        // Navigate to reset password page with email/phone
        navigate('/reset-password', {
          state: {
            email: method === 'email' ? email : null,
            phone: method === 'phone' ? phone : null,
            method,
          },
        });
      } else {
        setError('Invalid OTP. Please try again.');
        toast.error('Invalid OTP. Please try again.');
      }
    }, 1500);
  };

  const handleResendOtp = () => {
    setResendLoading(true);
    setError('');
    setOtp(['', '', '', '', '', '']); // Clear current OTP input

    // Simulate resending OTP
    setTimeout(() => {
      setResendLoading(false);
      const newCode = Math.floor(100000 + Math.random() * 900000).toString();
      setVerificationCode(newCode);
      toast.success(`New OTP: ${newCode} (for testing)`, { duration: 6000 });
      // Reset timer
      setTimer(60);
      setCanResend(false);
    }, 1500);
  };

  const formatContact = () => {
    if (method === 'email') {
      return email;
    } else {
      // Mask phone number for privacy
      return phone.replace(/(\d{3})\d{4}(\d{3})/, '$1****$2');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#f5f9fc] p-4">
      <div className="flex flex-col md:flex-row items-center w-full max-w-4xl bg-white p-6 md:p-8 rounded-2xl shadow-md border border-gray-200">
        {/* Form Section */}
        <div className="w-full md:w-1/2 mb-6 md:mb-0 md:pr-4">
          <div className="text-center mb-8">
            <h2 className="h2-heading mb-2">Verify OTP</h2>
            <p className="text-gray-600 text-sm mb-2">
              We've sent a 6-digit verification code to:
            </p>
            <p className="text-[var(--accent-color)] font-medium text-sm">
              {formatContact()}
            </p>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="flex justify-between mb-6">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  value={digit}
                  onChange={(e) => handleOtpChange(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  ref={(el) => (inputRefs.current[index] = el)}
                  maxLength={1}
                  className={`w-12 h-12 text-center text-xl border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] ${error ? 'border-red-500' : 'border-gray-300'}`}
                  autoComplete="one-time-code"
                />
              ))}
            </div>
            {error && <p className="error-text mb-4">{error}</p>}
            <button
              type="submit"
              className={`btn btn-primary w-full mb-4 ${loading || otp.some(digit => !digit) ? 'btn-disabled' : ''}`}
              disabled={loading || otp.some(digit => !digit)}
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
          </form>
          <div className="text-center space-y-3">
            <div className="flex items-center justify-center space-x-2 text-sm">
              <span className="text-gray-600">Didn't receive the code?</span>
              {canResend ? (
                <button
                  onClick={handleResendOtp}
                  disabled={resendLoading}
                  className="text-[var(--accent-color)] hover:underline font-medium disabled:opacity-50"
                >
                  {resendLoading ? 'Sending...' : 'Resend'}
                </button>
              ) : (
                <span className="text-gray-500">
                  Resend in {timer}s
                </span>
              )}
            </div>
            <p className="text-sm text-gray-600">
              Wrong {method === 'email' ? 'email' : 'phone number'}?{' '}
              <span
                className="text-[var(--accent-color)] hover:underline cursor-pointer font-medium"
                onClick={() => navigate('/forgot-password')}
              >
                Go back
              </span>
            </p>
          </div>
        </div>
        {/* Image Section (hidden on mobile) */}
        <div className="w-full md:w-1/2 md:pl-4 hidden md:block">
          <img
            src="https://img.freepik.com/free-vector/secure-login-concept-illustration_114360-4582.jpg"
            alt="OTP verification illustration"
            className="w-full h-auto rounded-xl animate-slideIn"
          />
        </div>
      </div>
    </div>
  );
};

export default VerifyOtp;
