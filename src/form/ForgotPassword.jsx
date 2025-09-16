import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [method, setMethod] = useState('email'); // 'email' or 'phone'
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Load remembered email on component mount
  useEffect(() => {
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail) {
      setEmail(rememberedEmail);
      setRememberMe(true);
    }
  }, []);

  // Handle remember me functionality
  const handleRememberMeChange = (checked) => {
    setRememberMe(checked);
    if (checked && email) {
      localStorage.setItem('rememberedEmail', email);
    } else {
      localStorage.removeItem('rememberedEmail');
    }
  };

  // Update remembered email when email changes
  useEffect(() => {
    if (rememberMe && email) {
      localStorage.setItem('rememberedEmail', email);
    }
  }, [email, rememberMe]);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^[+]?[\d\s\-()]{10,}$/;
    return phoneRegex.test(phone);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation based on method
    if (method === 'email') {
      if (!email) {
        setError('Email is required');
        return;
      }
      if (!validateEmail(email)) {
        setError('Please enter a valid email address');
        return;
      }
    } else {
      if (!phone) {
        setError('Phone number is required');
        return;
      }
      if (!validatePhone(phone)) {
        setError('Please enter a valid phone number');
        return;
      }
    }

    setLoading(true);

    // Fixed dummy OTP
    const dummyOtp = '654321';

    // Simulate API call delay
    setTimeout(() => {
      setLoading(false);
      
      // Show success message with dummy OTP
      toast.success(
        `OTP sent to your ${method}! Dummy OTP: ${dummyOtp}`, 
        {
          duration: 6000,
          position: 'top-center',
        }
      );

      // Navigate to OTP verification with the generated OTP
      navigate('/verify-otp', { 
        state: { 
          email: method === 'email' ? email : null,
          phone: method === 'phone' ? phone : null,
          method,
          dummyOtp
        } 
      });
    }, 1500);
  };

  const handleMethodChange = (newMethod) => {
    setMethod(newMethod);
    setError('');
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/[^+\d\s\-()]/g, ''); // Only allow phone number characters
    setPhone(value);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#f5f9fc] p-4">
      <div className="flex flex-col md:flex-row items-center w-full max-w-4xl bg-white p-6 md:p-8 rounded-2xl shadow-md border border-gray-200">
        {/* Form Section */}
        <div className="w-full md:w-1/2 mb-6 md:mb-0 md:pr-4">
          <div className="text-center mb-8">
            <h2 className="h2-heading mb-2">Forgot Password?</h2>
            <p className="text-gray-600 text-sm">
              Don't worry! Choose your preferred method to receive a reset code.
            </p>
          </div>

          {/* Method Selection */}
          <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
            <button
              type="button"
              onClick={() => handleMethodChange('email')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                method === 'email'
                  ? 'bg-white text-[var(--accent-color)] shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Email
            </button>
            <button
              type="button"
              onClick={() => handleMethodChange('phone')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                method === 'phone'
                  ? 'bg-white text-[var(--accent-color)] shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Phone
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {method === 'email' ? (
              <div className="floating-input relative w-full mb-6" data-placeholder="Email Address">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`input-field peer ${error ? 'border-red-500' : ''}`}
                  disabled={loading}
                  placeholder=""
                />
              </div>
            ) : (
              <div className="floating-input relative w-full mb-6" data-placeholder="Phone Number">
                <input
                  type="tel"
                  value={phone}
                  onChange={handlePhoneChange}
                  className={`input-field peer ${error ? 'border-red-500' : ''}`}
                  disabled={loading}
                  placeholder=""
                />
              </div>
            )}

            {error && <p className="error-text mb-4">{error}</p>}

            {method === 'email' && (
              <div className="flex items-center mb-6">
                <label className="flex items-center space-x-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => handleRememberMeChange(e.target.checked)}
                    className="accent-[var(--accent-color)]"
                  />
                  <span>Remember this email</span>
                </label>
              </div>
            )}

            <button
              type="submit"
              className={`btn btn-primary w-full mb-4 ${loading ? 'btn-disabled' : ''}`}
              disabled={loading}
            >
              {loading ? 'Sending...' : `Send OTP via ${method === 'email' ? 'Email' : 'SMS'}`}
            </button>
          </form>

          <div className="text-center space-y-3">
            <p className="text-sm text-gray-600">
              Remember your password?{' '}
              <span
                className="text-[var(--accent-color)] hover:underline cursor-pointer font-medium"
                onClick={() => navigate('/login')}
              >
                Back to Login
              </span>
            </p>
          </div>
        </div>

        {/* Image Section (hidden on mobile) */}
        <div className="w-full md:w-1/2 md:pl-4 hidden md:block">
          <img
            src="https://img.freepik.com/free-vector/forgot-password-concept-illustration_114360-1010.jpg"
            alt="Forgot password illustration"
            className="w-full h-auto rounded-xl animate-slideIn"
          />
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;