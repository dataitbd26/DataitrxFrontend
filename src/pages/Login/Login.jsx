import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet";
import useAuth from "../../Hook/useAuth";

// Import your Data IT Rx assets
import medicalHeroImage from "../../assets/Background/MedicalLogin.jpg"; 
import Logo from "../../assets/Logo/data-it-rx-logo.svg"; 
import logo_dark from "../../assets/Logo/data-it-rx-dark.svg"; 

const Login = () => {
  // App themes: 'mytheme' (your custom config) or 'dark'
  const [theme, setTheme] = useState("mytheme");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isMounted, setIsMounted] = useState(false); // For entrance animation
  const navigate = useNavigate();
  const { loginUser } = useAuth();

  useEffect(() => {
    // Trigger entrance animation shortly after mount
    setTimeout(() => setIsMounted(true), 100);

    const savedEmail = localStorage.getItem("email");
    const savedPassword = localStorage.getItem("password");
    const savedTheme = localStorage.getItem("theme") || "mytheme";
    
    if (savedEmail && savedPassword) {
      setEmail(savedEmail);
      setPassword(savedPassword);
      setRememberMe(true);
    }
    
    // Apply DaisyUI theme and Tailwind dark class
    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
    document.documentElement.classList.toggle("dark", savedTheme === "dark");
  }, []);

  // Email validation
  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

  // Handle toggle between custom 'mytheme' and 'dark'
  const handleThemeToggle = () => {
    const newTheme = theme === "mytheme" ? "dark" : "mytheme";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  // Handle login submission
  const handleLogin = async (e) => {
    e.preventDefault();

    // Input validation
    let valid = true;
    if (!validateEmail(email)) {
      setEmailError("Enter a valid email address.");
      valid = false;
    } else {
      setEmailError("");
    }
    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters.");
      valid = false;
    } else {
      setPasswordError("");
    }
    if (!valid) return;

    setLoading(true);
    try {
      await loginUser(email, password);
      if (rememberMe) {
        localStorage.setItem("email", email);
        localStorage.setItem("password", password);
      } else {
        localStorage.removeItem("email");
        localStorage.removeItem("password");
      }
      setLoading(false);
      toast.success("Login Successful! Accessing Clinical Dashboard...");
      navigate("/dashboard/");
    } catch (error) {
      setLoading(false);
      Swal.fire("Authentication Failed", "Invalid provider email or password. Please try again.", "error");
    }
  };

  // Password reset handler
  const handlePasswordReset = (e) => {
    e.preventDefault();
    setShowForgotModal(false);
    Swal.fire("Request Sent", "If an account exists, a secure reset link will be sent to your email.", "success");
  };

  return (
    <>
      <Helmet>
        <title>Provider Login | Data IT Rx</title>
      </Helmet>

      {/* Theme switcher */}
      <div className="fixed top-6 right-8 z-50 font-primary">
        <button
          onClick={handleThemeToggle}
          className="btn btn-outline btn-sm rounded-full shadow-lg bg-base-100/80 backdrop-blur-md border-none hover:bg-base-200 transition-all hover:scale-105"
        >
          {theme === "dark" ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>
      </div>

      {/* Main Full-Screen Container */}
      <div className="min-h-screen relative flex items-center justify-center p-4 sm:p-8 font-primary overflow-hidden">
        
        {/* Full Screen Background Image with Blur */}
        <div 
          className="absolute inset-0 bg-cover bg-center z-0 transition-all duration-700 scale-105"
          style={{ 
            backgroundImage: `url(${medicalHeroImage})`,
            filter: "blur(4px)" // Added blur to match the aesthetic of your image
          }}
        ></div>

        {/* Dynamic Overlay */}
        <div className="absolute inset-0 bg-base-300/40 backdrop-blur-sm z-0 transition-colors duration-500"></div>

        {/* Centered Login Card with Mount Animation */}
        <div 
          className={`card w-full max-w-md bg-base-100/95 shadow-2xl z-10 border border-base-content/5 backdrop-blur-xl rounded-[2rem] transition-all duration-1000 ease-out transform ${
            isMounted ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
          }`}
        >
          <div className="card-body p-8 sm:p-10">
            
            {/* Dynamic Logo Switching */}
            <div className="flex justify-center mb-4">
              <img
                src={theme === "dark" ? logo_dark : Logo}
                alt="Data IT Rx Logo"
                className="w-48 h-auto transition-opacity duration-300"
              />
            </div>

            <div className="mb-6 text-center">
              <h2 className="text-[28px] font-extrabold font-secondary text-base-content mb-1 tracking-tight">
                Welcome Back
              </h2>
              <p className="text-base-content/60 text-sm font-medium">
                Sign in to your clinical dashboard
              </p>
            </div>

            <form onSubmit={handleLogin} noValidate className="space-y-5">
              {/* Email Input */}
              <div className="form-control w-full relative group">
                <label className="label py-1" htmlFor="loginEmail">
                  <span className="label-text font-bold text-base-content/80 text-xs uppercase tracking-wide">Work Email</span>
                </label>
                <div className="relative">
                  <input
                    id="loginEmail"
                    type="email"
                    placeholder="admin@admin.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input input-bordered w-full bg-base-200/50 focus:bg-base-100 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all rounded-xl pr-10 border-base-content/10"
                    required
                  />
                  {/* Email/Key Icon */}
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-base-content/40 group-focus-within:text-blue-500 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v2H2v-4l4.257-4.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 2 2 0 012 2 1 1 0 102 0 4 4 0 00-4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                {emailError && <span className="text-error text-xs mt-1 ml-1 animate-pulse">{emailError}</span>}
              </div>

              {/* Password Input */}
              <div className="form-control w-full relative group">
                <label className="label py-1" htmlFor="loginPassword">
                  <span className="label-text font-bold text-base-content/80 text-xs uppercase tracking-wide">Password</span>
                </label>
                <div className="relative">
                  <input
                    id="loginPassword"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input input-bordered w-full bg-base-200/50 focus:bg-base-100 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all rounded-xl pr-10 border-base-content/10"
                    required
                  />
                  {/* Password/Key Icon */}
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-base-content/40 group-focus-within:text-blue-500 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v2H2v-4l4.257-4.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 2 2 0 012 2 1 1 0 102 0 4 4 0 00-4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                {passwordError && <span className="text-error text-xs mt-1 ml-1 animate-pulse">{passwordError}</span>}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between pt-2 pb-1">
                <label className="label cursor-pointer justify-start gap-2 p-0 hover:opacity-80 transition-opacity">
                  <input 
                    type="checkbox" 
                    className="checkbox checkbox-sm rounded bg-base-200 border-base-content/20 checked:bg-blue-500 checked:border-blue-500" 
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span className="label-text font-semibold text-base-content/70 text-sm">Remember Me</span>
                </label>
                
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-sm text-blue-500 hover:text-blue-600 font-bold transition-colors"
                >
                  Forgot Password?
                </button>
              </div>

              {/* Submit Button */}
              <div className="form-control mt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn border-none w-full text-white font-secondary text-lg shadow-lg hover:shadow-blue-500/30 transition-all duration-300 transform hover:-translate-y-1 rounded-xl h-12"
                  style={{ backgroundColor: '#1877F2' }} // Bright blue to match your image
                >
                  {loading ? (
                    <span className="loading loading-spinner"></span>
                  ) : (
                    "Sign In"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 bg-neutral/80 z-50 flex justify-center items-center p-4 font-primary backdrop-blur-md transition-opacity animate-fade-in">
          <div className="card bg-base-100 shadow-2xl max-w-sm w-full relative border border-base-content/10 rounded-2xl animate-scale-up">
            <div className="card-body text-center p-8">
              <button
                onClick={() => setShowForgotModal(false)}
                className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4 text-base-content/70 hover:text-base-content"
              >
                ✕
              </button>
              
              <div className="mb-4 text-blue-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
              </div>

              <h3 className="card-title justify-center font-secondary text-2xl mb-2 text-base-content font-bold">Reset Password</h3>
              <p className="text-base-content/70 text-sm mb-6">
                Enter your registered email to receive a secure reset link.
              </p>
              
              <form onSubmit={handlePasswordReset}>
                <div className="form-control w-full mb-5">
                  <input
                    type="email"
                    placeholder="doctor@clinic.com"
                    className="input input-bordered w-full focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 rounded-xl"
                    required
                  />
                </div>
                <button type="submit" className="btn border-none w-full font-secondary text-white rounded-xl" style={{ backgroundColor: '#1877F2' }}>
                  Send Reset Link
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Login;