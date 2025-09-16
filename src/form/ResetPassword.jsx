import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiEye, FiEyeOff, FiCheck } from 'react-icons/fi';
import toast from 'react-hot-toast';

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const email = location.state?.email;
  const phone = location.state?.phone;
  const method = location.state?.method;

  useEffect(() => {
    // Redirect if no email/phone is provided
    if (!email && !phone) {
      navigate('/forgot-password');
      return;
    }
  }, [email, phone, navigate]);

  const validatePassword = (password) => {
    const errors = {};
    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 8) {
      errors.password = 'Password must be at least 8 characters long';
    }
    return errors;
  };

  const validateConfirmPassword = (password, confirmPassword) => {
    const errors = {};
    if (!confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    return errors;
  };

  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, text: '', color: '' };
    let score = 0;
    const checks = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };
    score = Object.values(checks).filter(Boolean).length;
    if (score <= 2) return { strength: score, text: 'Weak', color: 'text-red-500' };
    if (score <= 3) return { strength: score, text: 'Fair', color: 'text-yellow-500' };
    if (score <= 4) return { strength: score, text: 'Good', color: 'text-blue-500' };
    return { strength: score, text: 'Strong', color: 'text-green-500' };
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate all fields
    const passwordErrors = validatePassword(password);
    const confirmPasswordErrors = validateConfirmPassword(password, confirmPassword);
    const allErrors = { ...passwordErrors, ...confirmPasswordErrors };
    setErrors(allErrors);
    
    if (Object.keys(allErrors).length > 0) {
      return;
    }

    setLoading(true);

    // Simulate password reset
    setTimeout(() => {
      setLoading(false);
      toast.success('Password reset successful! You can now login with your new password.', {
        duration: 5000,
        position: 'top-center',
      });
      
      // Navigate to login page with success message
      navigate('/login', {
        state: {
          message: 'Password reset successful! Please login with your new password.',
          email: method === 'email' ? email : null,
        },
      });
    }, 1500);
  };

  const passwordStrength = getPasswordStrength(password);

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#f5f9fc] p-4">
      <div className="flex flex-col md:flex-row items-center w-full max-w-4xl bg-white p-6 md:p-8 rounded-2xl shadow-md border border-gray-200">
        {/* Form Section */}
        <div className="w-full md:w-1/2 mb-6 md:mb-0 md:pr-4">
          <div className="text-center mb-8">
            <h2 className="h2-heading mb-2">Reset Password</h2>
            <p className="text-gray-600 text-sm">
              Create a new secure password for your account.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* New Password */}
            <div className="floating-input relative w-full mb-4" data-placeholder="New Password">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`input-field peer pr-10 ${errors.password ? 'border-red-500' : ''}`}
                disabled={loading}
                placeholder=""
              />
              <button
                type="button"
                tabIndex={-1}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xl text-gray-400 hover:text-[var(--primary-color)] focus:outline-none"
                onClick={() => setShowPassword(prev => !prev)}
              >
                {showPassword ? <FiEye /> : <FiEyeOff />}
              </button>
            </div>

            {/* Password Strength Indicator */}
            {password && (
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-600">Password Strength:</span>
                  <span className={`text-xs font-medium ${passwordStrength.color}`}>
                    {passwordStrength.text}
                  </span>
                </div>
                <div className="flex space-x-1 mb-2">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <div
                      key={level}
                      className={`h-2 w-full rounded ${
                        level <= passwordStrength.strength
                          ? passwordStrength.strength <= 2
                            ? 'bg-red-500'
                            : passwordStrength.strength <= 3
                            ? 'bg-yellow-500'
                            : passwordStrength.strength <= 4
                            ? 'bg-blue-500'
                            : 'bg-green-500'
                          : 'bg-gray-200'
                      }`}
                    />
                  ))}
                </div>
                <div className="text-xs text-gray-600 space-y-1">
                  <div className="flex items-center space-x-1">
                    <FiCheck className={password.length >= 8 ? 'text-green-500' : 'text-gray-300'} />
                    <span>At least 8 characters</span>
                  </div>
                </div>
              </div>
            )}

            {errors.password && <p className="error-text mb-4">{errors.password}</p>}

            {/* Confirm Password */}
            <div className="floating-input relative w-full mb-6" data-placeholder="Confirm New Password">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`input-field peer pr-10 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                disabled={loading}
                placeholder=""
              />
              <button
                type="button"
                tabIndex={-1}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xl text-gray-400 hover:text-[var(--primary-color)] focus:outline-none"
                onClick={() => setShowConfirmPassword(prev => !prev)}
              >
                {showConfirmPassword ? <FiEye /> : <FiEyeOff />}
              </button>
            </div>

            {errors.confirmPassword && <p className="error-text mb-4">{errors.confirmPassword}</p>}
            {errors.general && <p className="error-text mb-4">{errors.general}</p>}

            <button
              type="submit"
              className={`btn btn-primary w-full mb-4${loading ? ' btn-disabled' : ''}`}
              disabled={loading || !password || !confirmPassword}
            >
              {loading ? 'Resetting Password...' : 'Reset Password'}
            </button>
          </form>

          <div className="text-center">
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
            src="https://img.freepik.com/free-vector/reset-password-concept-illustration_114360-7886.jpg"
            alt="Reset password illustration"
            className="w-full h-auto rounded-xl animate-slideIn"
          />
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;