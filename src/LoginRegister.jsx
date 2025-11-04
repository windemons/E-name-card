import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faGoogle, faLinkedinIn, faGithub } from '@fortawesome/free-brands-svg-icons';

export default function LoginRegister({ onBackToHome, onLoginSuccess }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [resetMessage, setResetMessage] = useState('');
  
  // State cho Sign In
  const [signInData, setSignInData] = useState({
    username: '',
    password: ''
  });
  const [signInErrors, setSignInErrors] = useState({});

  // State cho Sign Up
  const [signUpData, setSignUpData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [signUpErrors, setSignUpErrors] = useState({});

  // State cho Forgot Password
  const [forgotPasswordData, setForgotPasswordData] = useState({
    email: ''
  });
  const [forgotPasswordErrors, setForgotPasswordErrors] = useState({});

  // Validation functions
  const validateEmail = (email) => {
    const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return regex.test(email);
  };

  const handleSignIn = () => {
    const errors = {};
    
    if (!signInData.username.trim()) {
      errors.username = 'Please enter username';
    }
    
    if (!signInData.password) {
      errors.password = 'Please enter password';
    }
    
    setSignInErrors(errors);
    
    if (Object.keys(errors).length === 0) {
      // Lấy danh sách users từ localStorage
      const storedUsers = localStorage.getItem('users');
      let users = [];
      
      if (storedUsers) {
        try {
          users = JSON.parse(storedUsers);
        } catch (e) {
          console.error('Error parsing users from localStorage:', e);
        }
      }
      
      // Mock users (fallback nếu localStorage trống)
      const mockUsers = [
        { username: 'thinh', password: '123456', email: 'thinh@gmail.com' }
      ];
      
      // Combine cả localStorage users và mock users
      const allUsers = [...users, ...mockUsers];
      
      // Tìm user
      const user = allUsers.find(
        u => u.username === signInData.username && u.password === signInData.password
      );
      
      if (user) {
        console.log('Sign In Success:', user);
        
        // Lưu thông tin user đang đăng nhập vào localStorage
        localStorage.setItem('currentUser', JSON.stringify({
          username: user.username,
          email: user.email,
          loginTime: new Date().toISOString()
        }));
        
        if (onLoginSuccess) {
          onLoginSuccess();
        }
      } else {
        setSignInErrors({
          username: 'Invalid username or password',
          password: 'Invalid username or password'
        });
      }
    }
  };

  const handleSignUp = () => {
    const errors = {};
    
    if (!signUpData.username.trim()) {
      errors.username = 'Please enter username';
    } else if (signUpData.username.length < 3) {
      errors.username = 'Username must be at least 3 characters';
    }
    
    if (!signUpData.email.trim()) {
      errors.email = 'Please enter email';
    } else if (!validateEmail(signUpData.email)) {
      errors.email = 'Please enter a valid email';
    }
    
    if (!signUpData.password) {
      errors.password = 'Please enter password';
    } else if (signUpData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    if (!signUpData.confirmPassword) {
      errors.confirmPassword = 'Please confirm password';
    } else if (signUpData.password !== signUpData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    setSignUpErrors(errors);
    
    if (Object.keys(errors).length === 0) {
      // Lấy danh sách users hiện tại từ localStorage
      const storedUsers = localStorage.getItem('users');
      let users = [];
      
      if (storedUsers) {
        try {
          users = JSON.parse(storedUsers);
        } catch (e) {
          console.error('Error parsing users from localStorage:', e);
        }
      }
      
      // Kiểm tra username hoặc email đã tồn tại chưa
      const usernameExists = users.some(u => u.username === signUpData.username);
      const emailExists = users.some(u => u.email === signUpData.email);
      
      if (usernameExists) {
        setSignUpErrors({ username: 'Username already exists' });
        return;
      }
      
      if (emailExists) {
        setSignUpErrors({ email: 'Email already exists' });
        return;
      }
      
      // Tạo user mới
      const newUser = {
        id: Date.now(),
        username: signUpData.username,
        email: signUpData.email,
        password: signUpData.password,
        createdAt: new Date().toISOString()
      };
      
      // Thêm user mới vào danh sách
      users.push(newUser);
      
      // Lưu lại vào localStorage
      localStorage.setItem('users', JSON.stringify(users));
      
      console.log('Sign Up Success:', newUser);
      console.log('All users in localStorage:', users);
      
      // Hiện modal thành công
      setSuccessMessage('Account created successfully!');
      
      // Reset form
      setSignUpData({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
      });
    }
  };

  const handleForgotPassword = () => {
    const errors = {};
    
    if (!forgotPasswordData.email.trim()) {
      errors.email = 'Please enter your email';
    } else if (!validateEmail(forgotPasswordData.email)) {
      errors.email = 'Please enter a valid email';
    }
    
    setForgotPasswordErrors(errors);
    
    if (Object.keys(errors).length === 0) {
      // Lấy danh sách users từ localStorage
      const storedUsers = localStorage.getItem('users');
      let users = [];
      
      if (storedUsers) {
        try {
          users = JSON.parse(storedUsers);
        } catch (e) {
          console.error('Error parsing users from localStorage:', e);
        }
      }
      
      // Mock users
      const mockUsers = [
        { username: 'thinh', password: '123456', email: 'thinh@gmail.com' }
      ];
      
      const allUsers = [...users, ...mockUsers];
      
      // Kiểm tra email có tồn tại không
      const user = allUsers.find(u => u.email === forgotPasswordData.email);
      
      if (user) {
        console.log('Password reset request for:', user.email);
        // Hiện modal thành công
        setResetMessage(`Password reset link has been sent to ${forgotPasswordData.email}`);
        
        // Reset form
        setForgotPasswordData({ email: '' });
      } else {
        setForgotPasswordErrors({ email: 'Email not found in our system' });
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative" style={{ backgroundColor: '#00343d' }}>
      {/* Back to Home Button */}
      <button
        onClick={onBackToHome}
        className="absolute top-8 left-8 z-50 px-6 py-2 border-2 border-white text-white rounded-full font-medium hover:bg-white transition-all duration-300 flex items-center gap-2"
        style={{ color: 'white' }}
        onMouseEnter={(e) => e.target.style.color = '#00343d'}
        onMouseLeave={(e) => e.target.style.color = 'white'}
      >
        <span>←</span> Back to Home
      </button>

      {/* Success Modal Popup */}
      {successMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-8 shadow-2xl transform animate-scale-in max-w-md mx-4">
            {/* Success Icon */}
            <div className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            
            {/* Success Message */}
            <h3 className="text-2xl font-bold text-center mb-2 text-gray-800">
              Success!
            </h3>
            <p className="text-center text-gray-600 mb-6">
              Your account has been created successfully. You can now sign in with your credentials.
            </p>
            
            {/* Continue Button */}
            <button
              onClick={() => {
                setIsSignUp(false);
                setSuccessMessage('');
              }}
              className="w-full py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-all"
            >
              Continue to Sign In
            </button>
          </div>
        </div>
      )}

      {/* Reset Password Success Modal */}
      {resetMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-8 shadow-2xl transform animate-scale-in max-w-md mx-4">
            {/* Email Icon */}
            <div className="w-20 h-20 rounded-full bg-blue-500 flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
              </svg>
            </div>
            
            {/* Success Message */}
            <h3 className="text-2xl font-bold text-center mb-2 text-gray-800">
              Check Your Email!
            </h3>
            <p className="text-center text-gray-600 mb-6">
              {resetMessage}
            </p>
            
            {/* Continue Button */}
            <button
              onClick={() => {
                setIsForgotPassword(false);
                setResetMessage('');
              }}
              className="w-full py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-all"
            >
              Back to Sign In
            </button>
          </div>
        </div>
      )}

      <div className="relative w-full max-w-4xl h-[550px] rounded-3xl shadow-2xl overflow-hidden" style={{ backgroundColor: '#00343d' }}>
        
        <style jsx>{`
          @keyframes scale-in {
            from {
              opacity: 0;
              transform: scale(0.8);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }
          .animate-scale-in {
            animation: scale-in 0.3s ease-out;
          }
          
          /* Smooth GPU-accelerated transitions */
          .smooth-transition {
            transition: all 0.7s cubic-bezier(0.4, 0.0, 0.2, 1);
            will-change: transform, opacity;
            backface-visibility: hidden;
            transform: translateZ(0);
            -webkit-font-smoothing: antialiased;
          }
        `}</style>
        
        {/* Backdrop to prevent white flash */}
        <div className="absolute inset-0 bg-[#00343d] z-0"></div>
        
        {/* Sign In Form */}
        <div 
          className={`smooth-transition absolute top-0 left-0 w-1/2 h-full ${
            isForgotPassword ? '-translate-x-full opacity-0' : (isSignUp ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100')
          }`}
          style={{ 
            backgroundColor: '#00343d', 
            zIndex: isForgotPassword ? 1 : (isSignUp ? 1 : 10),
            pointerEvents: isForgotPassword ? 'none' : (isSignUp ? 'none' : 'auto')
          }}
        >
          <div className="flex flex-col items-center justify-center h-full px-12 text-white">
            <h1 className="text-4xl font-bold mb-6">Sign in</h1>
            
            {/* Social Icons */}
            <div className="flex gap-3 mb-4">
              <button 
                type="button" 
                className="w-10 h-10 rounded-lg border-2 border-blue-600 flex items-center justify-center text-blue-600 hover:bg-blue-600 hover:text-white transition-all"
                title="Sign in with Facebook"
              >
                <FontAwesomeIcon icon={faFacebookF} className="text-lg" />
              </button>
              <button 
                type="button" 
                className="w-10 h-10 rounded-lg border-2 border-red-500 flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-all"
                title="Sign in with Google"
              >
                <FontAwesomeIcon icon={faGoogle} className="text-lg" />
              </button>
              <button 
                type="button" 
                className="w-10 h-10 rounded-lg border-2 border-blue-700 flex items-center justify-center text-blue-700 hover:bg-blue-700 hover:text-white transition-all"
                title="Sign in with LinkedIn"
              >
                <FontAwesomeIcon icon={faLinkedinIn} className="text-lg" />
              </button>
              <button 
                type="button" 
                className="w-10 h-10 rounded-lg border-2 border-gray-400 flex items-center justify-center text-gray-400 hover:bg-gray-400 hover:text-white transition-all"
                title="Sign in with GitHub"
              >
                <FontAwesomeIcon icon={faGithub} className="text-lg" />
              </button>
            </div>
            
            <p className="text-sm mb-4">or use your email password</p>
            
            {/* Form Inputs */}
            <div className="w-full mb-3">
              <input 
                type="text" 
                placeholder="Username" 
                value={signInData.username}
                onChange={(e) => {
                  setSignInData({...signInData, username: e.target.value});
                  setSignInErrors({...signInErrors, username: ''});
                }}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSignIn();
                  }
                }}
                className={`w-full px-4 py-3 rounded-lg bg-white text-gray-800 outline-none focus:ring-2 focus:ring-yellow-400 ${
                  signInErrors.username ? 'border-2 border-red-500' : ''
                }`}
              />
              {signInErrors.username && (
                <p className="text-red-400 text-xs mt-1">{signInErrors.username}</p>
              )}
            </div>

            <div className="w-full mb-3">
              <input 
                type="password" 
                placeholder="Password" 
                value={signInData.password}
                onChange={(e) => {
                  setSignInData({...signInData, password: e.target.value});
                  setSignInErrors({...signInErrors, password: ''});
                }}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSignIn();
                  }
                }}
                className={`w-full px-4 py-3 rounded-lg bg-white text-gray-800 outline-none focus:ring-2 focus:ring-yellow-400 ${
                  signInErrors.password ? 'border-2 border-red-500' : ''
                }`}
              />
              {signInErrors.password && (
                <p className="text-red-400 text-xs mt-1">{signInErrors.password}</p>
              )}
            </div>
            
            <a 
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                setIsForgotPassword(true);
              }}
              className="text-sm text-white mb-4 hover:underline"
            >
              Forget Your Password?
            </a>
            
            <button 
              onClick={handleSignIn}
              className="px-12 py-3 rounded-lg font-semibold text-black transition-all hover:scale-105"
              style={{ backgroundColor: '#ffcb66' }}
            >
              Sign in
            </button>
          </div>
        </div>

        {/* Sign Up Form */}
        <div 
          className={`smooth-transition absolute top-0 left-0 w-1/2 h-full ${
            isSignUp ? 'translate-x-full opacity-100' : 'translate-x-0 opacity-0'
          }`}
          style={{ 
            backgroundColor: '#00343d',
            zIndex: isSignUp ? 10 : 1,
            pointerEvents: isSignUp ? 'auto' : 'none'
          }}
        >
          <div className="flex flex-col items-center justify-center h-full px-12 text-white">
            <h1 className="text-4xl font-bold mb-4">Create Account</h1>
            
            {/* Social Icons */}
            <div className="flex gap-3 mb-3">
              <button 
                type="button" 
                className="w-10 h-10 rounded-lg border-2 border-blue-600 flex items-center justify-center text-blue-600 hover:bg-blue-600 hover:text-white transition-all"
                title="Sign up with Facebook"
              >
                <FontAwesomeIcon icon={faFacebookF} className="text-lg" />
              </button>
              <button 
                type="button" 
                className="w-10 h-10 rounded-lg border-2 border-red-500 flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-all"
                title="Sign up with Google"
              >
                <FontAwesomeIcon icon={faGoogle} className="text-lg" />
              </button>
              <button 
                type="button" 
                className="w-10 h-10 rounded-lg border-2 border-blue-700 flex items-center justify-center text-blue-700 hover:bg-blue-700 hover:text-white transition-all"
                title="Sign up with LinkedIn"
              >
                <FontAwesomeIcon icon={faLinkedinIn} className="text-lg" />
              </button>
              <button 
                type="button" 
                className="w-10 h-10 rounded-lg border-2 border-gray-400 flex items-center justify-center text-gray-400 hover:bg-gray-400 hover:text-white transition-all"
                title="Sign up with GitHub"
              >
                <FontAwesomeIcon icon={faGithub} className="text-lg" />
              </button>
            </div>
            
            <p className="text-sm mb-3">or use your email for registration</p>
            
            {/* Form Inputs */}
            <div className="w-full mb-2">
              <input 
                type="text" 
                placeholder="Username" 
                value={signUpData.username}
                onChange={(e) => {
                  setSignUpData({...signUpData, username: e.target.value});
                  setSignUpErrors({...signUpErrors, username: ''});
                }}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSignUp();
                  }
                }}
                className={`w-full px-4 py-2 rounded-lg bg-white text-gray-800 outline-none focus:ring-2 focus:ring-yellow-400 ${
                  signUpErrors.username ? 'border-2 border-red-500' : ''
                }`}
              />
              {signUpErrors.username && (
                <p className="text-red-400 text-xs mt-1">{signUpErrors.username}</p>
              )}
            </div>

            <div className="w-full mb-2">
              <input 
                type="email" 
                placeholder="Email" 
                value={signUpData.email}
                onChange={(e) => {
                  setSignUpData({...signUpData, email: e.target.value});
                  setSignUpErrors({...signUpErrors, email: ''});
                }}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSignUp();
                  }
                }}
                className={`w-full px-4 py-2 rounded-lg bg-white text-gray-800 outline-none focus:ring-2 focus:ring-yellow-400 ${
                  signUpErrors.email ? 'border-2 border-red-500' : ''
                }`}
              />
              {signUpErrors.email && (
                <p className="text-red-400 text-xs mt-1">{signUpErrors.email}</p>
              )}
            </div>

            <div className="w-full mb-2">
              <input 
                type="password" 
                placeholder="Password" 
                value={signUpData.password}
                onChange={(e) => {
                  setSignUpData({...signUpData, password: e.target.value});
                  setSignUpErrors({...signUpErrors, password: ''});
                }}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSignUp();
                  }
                }}
                className={`w-full px-4 py-2 rounded-lg bg-white text-gray-800 outline-none focus:ring-2 focus:ring-yellow-400 ${
                  signUpErrors.password ? 'border-2 border-red-500' : ''
                }`}
              />
              {signUpErrors.password && (
                <p className="text-red-400 text-xs mt-1">{signUpErrors.password}</p>
              )}
            </div>

            <div className="w-full mb-4">
              <input 
                type="password" 
                placeholder="Confirm Password" 
                value={signUpData.confirmPassword}
                onChange={(e) => {
                  setSignUpData({...signUpData, confirmPassword: e.target.value});
                  setSignUpErrors({...signUpErrors, confirmPassword: ''});
                }}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSignUp();
                  }
                }}
                className={`w-full px-4 py-2 rounded-lg bg-white text-gray-800 outline-none focus:ring-2 focus:ring-yellow-400 ${
                  signUpErrors.confirmPassword ? 'border-2 border-red-500' : ''
                }`}
              />
              {signUpErrors.confirmPassword && (
                <p className="text-red-400 text-xs mt-1">{signUpErrors.confirmPassword}</p>
              )}
            </div>
            
            <button 
              onClick={handleSignUp}
              className="px-12 py-3 rounded-lg font-semibold text-black transition-all hover:scale-105"
              style={{ backgroundColor: '#ffcb66' }}
            >
              Sign up
            </button>
          </div>
        </div>

        {/* Forgot Password Form */}
        <div 
          className={`smooth-transition absolute top-0 left-0 w-1/2 h-full ${
            isForgotPassword ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'
          }`}
          style={{ 
            backgroundColor: '#00343d',
            zIndex: isForgotPassword ? 10 : 1,
            pointerEvents: isForgotPassword ? 'auto' : 'none'
          }}
        >
          <div className="flex flex-col items-center justify-center h-full px-12 text-white">
            <h1 className="text-4xl font-bold mb-6">Reset Password</h1>
            
            {/* Icon */}
            <div className="w-20 h-20 rounded-full bg-yellow-400 flex items-center justify-center mb-6">
              <svg className="w-10 h-10 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path>
              </svg>
            </div>
            
            <p className="text-sm mb-6 text-center max-w-sm">
              Enter your email address and we'll send you a link to reset your password
            </p>
            
            {/* Form Input */}
            <div className="w-full mb-6">
              <input 
                type="email" 
                placeholder="Email Address" 
                value={forgotPasswordData.email}
                onChange={(e) => {
                  setForgotPasswordData({email: e.target.value});
                  setForgotPasswordErrors({});
                }}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleForgotPassword();
                  }
                }}
                className={`w-full px-4 py-3 rounded-lg bg-white text-gray-800 outline-none focus:ring-2 focus:ring-yellow-400 ${
                  forgotPasswordErrors.email ? 'border-2 border-red-500' : ''
                }`}
              />
              {forgotPasswordErrors.email && (
                <p className="text-red-400 text-xs mt-1">{forgotPasswordErrors.email}</p>
              )}
            </div>
            
            <button 
              onClick={handleForgotPassword}
              className="px-12 py-3 rounded-lg font-semibold text-black transition-all hover:scale-105"
              style={{ backgroundColor: '#ffcb66' }}
            >
              Send Reset Link
            </button>
          </div>
        </div>

        {/* Toggle Panel - Hello Friend (Right) */}
        <div 
          className={`smooth-transition absolute top-0 right-0 w-1/2 h-full ${
            isForgotPassword ? 'translate-x-full opacity-0' : (isSignUp ? '-translate-x-full opacity-0' : 'translate-x-0 opacity-100')
          }`}
          style={{ 
            backgroundColor: '#ffcb66', 
            zIndex: 5,
            pointerEvents: isForgotPassword ? 'none' : (isSignUp ? 'none' : 'auto')
          }}
        >
          <div className="flex flex-col items-center justify-center h-full px-12 text-center rounded-3xl">
            <h1 className="text-5xl font-bold mb-4 text-black">Hello, Friend!</h1>
            <p className="text-black mb-8 font-medium">
              Register with your personal details to use all of site features
            </p>
            <button 
              onClick={() => setIsSignUp(true)}
              className="px-12 py-3 bg-white text-black rounded-lg font-semibold transition-all hover:scale-105"
            >
              Sign up
            </button>
          </div>
        </div>

        {/* Toggle Panel - Welcome Back (Left) */}
        <div 
          className={`smooth-transition absolute top-0 left-0 w-1/2 h-full ${
            isForgotPassword ? 'translate-x-full opacity-0' : (isSignUp ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0')
          }`}
          style={{ 
            backgroundColor: '#ffcb66',
            zIndex: 5,
            pointerEvents: isForgotPassword ? 'none' : (isSignUp ? 'auto' : 'none')
          }}
        >
          <div className="flex flex-col items-center justify-center h-full px-12 text-center rounded-3xl">
            <h1 className="text-5xl font-bold mb-4 text-black">Welcome Back!</h1>
            <p className="text-black mb-8 font-medium">
              Enter your personal details to use all of site features
            </p>
            <button 
              onClick={() => setIsSignUp(false)}
              className="px-12 py-3 bg-white text-black rounded-lg font-semibold transition-all hover:scale-105"
            >
              Sign in
            </button>
          </div>
        </div>

        {/* Toggle Panel - Forgot Password (Right) */}
        <div 
          className={`smooth-transition absolute top-0 right-0 w-1/2 h-full ${
            isForgotPassword ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
          }`}
          style={{ 
            backgroundColor: '#ffcb66',
            zIndex: 5,
            pointerEvents: isForgotPassword ? 'auto' : 'none'
          }}
        >
          <div className="flex flex-col items-center justify-center h-full px-12 text-center rounded-3xl">
            <h1 className="text-5xl font-bold mb-4 text-black">Need Help?</h1>
            <p className="text-black mb-8 font-medium">
              Don't worry! Enter your email and we'll help you reset your password
            </p>
            <div className="flex flex-col gap-3">
              <button 
                onClick={() => setIsForgotPassword(false)}
                className="px-12 py-3 bg-white text-black rounded-lg font-semibold transition-all hover:scale-105"
              >
                Back to Sign In
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}