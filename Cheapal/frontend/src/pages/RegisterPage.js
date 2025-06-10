import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import cheapalLogoBitmap from '../logo.png';

const ADMIN_SECRET_I = "17-ARID-1325";
const ADMIN_SECRET_S = "17-ARID-1368";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [secretI, setSecretI] = useState('');
  const [secretS, setSecretS] = useState('');

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === 'role' && value !== 'admin') {
      setSecretI('');
      setSecretS('');
    }
  };

  const handleSecretChange = (e) => {
    const { name, value } = e.target;
    if (name === 'secretI') {
      setSecretI(value);
    } else if (name === 'secretS') {
      setSecretS(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    if (formData.role === 'admin' && (secretI !== ADMIN_SECRET_I || secretS !== ADMIN_SECRET_S)) {
      toast.error('Invalid admin secret key(s).');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        role: formData.role,
      };
      const response = await register(payload);

      if (response?.success) {
        toast.success('Registration successful! Redirecting...');
        setTimeout(() => {
          if (response.user.role === 'admin') {
            navigate('/admin/dashboard');
          } else if (response.user.role === 'seller') {
            navigate('/seller-dashboard');
          } else {
            navigate('/');
          }
        }, 1500);
      } else {
        toast.error(response?.message || 'Registration failed. Please check the form.');
      }
    } catch (err) {
      console.error('Registration Submit Error:', err);
      toast.error(err.response?.data?.message || err.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = () => {
    toast.info('Google Sign-Up not implemented in this example.');
  };

  const formContainerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.1, delayChildren: 0.3, duration: 0.5 } }
  };

  const formItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 120 } }
  };

  const logoContainerMotionVariants = {
    hidden: { opacity: 0, scale: 0.7, y: 50 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.7, type: 'spring', stiffness: 100, delay: 0.2 } }
  };

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
      <link href="https://fonts.googleapis.com/css2?family=Rajdhani:wght@500;600;700&family=Space+Mono&family=Work+Sans:wght@400;500&display=swap" rel="stylesheet" />

      <div className="min-h-screen cryptid-theme-active full-greenish-theme relative">
        <div className="background fixed inset-0 z-[-3]">
          <div
            className="bitmap-overlay"
            style={{ backgroundImage: `url(${cheapalLogoBitmap})` }}
          ></div>
          <div className="noise"></div>
          <div className="gradient-overlay"></div>
        </div>
        <div className="topographic-overlay fixed inset-0 z-[-2]"></div>

        <div className="min-h-screen flex flex-col md:flex-row items-stretch relative z-10">
          <motion.div
            className="md:w-2/5 lg:w-1/2 w-full text-white flex flex-col items-center justify-center p-8 md:p-12 relative overflow-hidden"
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          >
            <motion.div
              id="cheapal-image-logo-container"
              className="z-10 cheapal-image-logo-wrapper mt-12 md:mt-0"
              variants={logoContainerMotionVariants}
              initial="hidden"
              animate="visible"
            >
              <img src={cheapalLogoBitmap} alt="Cheapal Logo" className="max-w-xs md:max-w-sm lg:max-w-md h-auto mt-56" />
            </motion.div>

            <motion.p
              className="text-xl lg:text-2xl text-[var(--misty-gray)] text-center max-w-md mt-1 mb-8 z-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              Your one-stop shop for the best subscription deals.
            </motion.p>
            <div className="mt-auto mb-20 text-[var(--misty-gray)] opacity-70 text-xs z-10">
              © {new Date().getFullYear()} Cheapal Inc. All rights reserved.
            </div>
          </motion.div>

          <div className="md:w-3/5 lg:w-1/2 w-full flex items-start md:items-center justify-center p-6 sm:p-8 md:p-12 relative pt-12 md:pt-20">
            <motion.main
              className="glass-panel w-full max-w-lg"
              variants={formContainerVariants}
              initial="hidden"
              animate="visible"
            >
              <div className="classified-stamp">USER REGISTRATION</div>
              <div className="form-container" id="register-container-form">
                <motion.h1
                  data-text="Create Cheapal Account"
                  className="text-center mb-1 text-2xl text-[var(--bioluminescent-teal)]"
                  variants={formItemVariants}
                >
                  Create Cheapal Account
                </motion.h1>
                <motion.div
                  className="classified-stripe mb-6"
                  variants={formItemVariants}
                >
                  NEW PERSONNEL REGISTRATION
                </motion.div>

                <motion.button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={isSubmitting}
                  className="w-full flex justify-center items-center py-2.5 px-4 border border-[var(--misty-gray)] rounded-md shadow-sm bg-[rgba(45,48,51,0.3)] text-sm font-medium text-white hover:bg-[var(--bioluminescent-teal)] hover:text-[var(--midnight-charcoal)] focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-[var(--bioluminescent-teal)] disabled:opacity-60 transition-colors duration-300 mb-4"
                  variants={formItemVariants}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 48 48">
                    <path fill="#4285F4" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                    <path fill="#34A853" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.28-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                    <path fill="#EA4335" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                  </svg>
                  Sign up with Google
                </motion.button>

                <motion.div className="relative my-4" variants={formItemVariants}>
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-[rgba(var(--misty-gray-rgb),0.2)]"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-glass-panel-inner text-[var(--misty-gray)] backdrop-blur-sm">Or with email</span>
                  </div>
                </motion.div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <motion.div className="form-group" variants={formItemVariants}>
                    <label htmlFor="name">Name</label>
                    <div className="input-container">
                      <span className="input-prefix">{'>'}</span>
                      <input id="name" name="name" type="text" required value={formData.name} onChange={handleChange} placeholder="Name" />
                      <div className="input-glow"></div>
                    </div>
                  </motion.div>
                  <motion.div className="form-group" variants={formItemVariants}>
                    <label htmlFor="email">Email</label>
                    <div className="input-container">
                      <span className="input-prefix">#</span>
                      <input id="email" name="email" type="email" autoComplete="email" required value={formData.email} onChange={handleChange} placeholder="secure.transmission@domain.net" />
                      <div className="input-glow"></div>
                    </div>
                  </motion.div>
                  <motion.div className="form-group" variants={formItemVariants}>
                    <label htmlFor="password">Password</label>
                    <div className="input-container">
                      <span className="input-prefix secure">#</span>
                      <input id="password" name="password" type={showPassword ? "text" : "password"} autoComplete="new-password" required value={formData.password} onChange={handleChange} placeholder="MIN 8 CHARS, ALPHA-NUMERIC" />
                      <div className="input-glow"></div>
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 text-[var(--misty-gray)] hover:text-[var(--bioluminescent-teal)] z-10">
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </motion.div>
                  <motion.div className="form-group" variants={formItemVariants}>
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <div className="input-container">
                      <span className="input-prefix secure">#</span>
                      <input id="confirmPassword" name="confirmPassword" type={showConfirmPassword ? "text" : "password"} autoComplete="new-password" required value={formData.confirmPassword} onChange={handleChange} placeholder="Re-enter Password" />
                      <div className="input-glow"></div>
                      <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 text-[var(--misty-gray)] hover:text-[var(--bioluminescent-teal)] z-10">
                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </motion.div>
                  <motion.div className="form-group" variants={formItemVariants}>
                    <label htmlFor="role">I want to:</label>
                    <div className="input-container">
                      <select
                        id="role" name="role" value={formData.role} onChange={handleChange}
                        className="w-full mt-1 block pl-3 pr-10 py-2.5 text-base focus:outline-none focus:ring-[var(--bioluminescent-teal)] focus:border-[var(--bioluminescent-teal)] sm:text-sm rounded-md"
                      >
                        <option value="user">Buy Subscriptions</option>
                        <option value="seller">Sell Subscriptions</option>
                        <option value="admin">Command (Administrator)</option>
                      </select>
                    </div>
                  </motion.div>

                  {formData.role === 'admin' && (
                    <motion.div
                      className="space-y-3 pt-3 border-t border-[rgba(var(--bioluminescent-teal-rgb),0.2)]"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      transition={{ duration: 0.3 }}
                    >
                      <p className="text-xs text-[var(--evidence-amber)] text-center">Admin Keys (Dev Only)</p>
                      <motion.div className="form-group" variants={formItemVariants}>
                        <label htmlFor="secretI">Secret I</label>
                        <div className="input-container"><input id="secretI" name="secretI" type="text" value={secretI} onChange={handleSecretChange} placeholder="Key I" /> <div className="input-glow"></div></div>
                      </motion.div>
                      <motion.div className="form-group" variants={formItemVariants}>
                        <label htmlFor="secretS">Secret S</label>
                        <div className="input-container"><input id="secretS" name="secretS" type="text" value={secretS} onChange={handleSecretChange} placeholder="Key S" /> <div className="input-glow"></div></div>
                      </motion.div>
                    </motion.div>
                  )}

                  <motion.div className="protocol-acceptance" variants={formItemVariants}>
                    <div className="custom-toggle-container" id="protocol-checkbox-container">
                      <div className="custom-toggle" id="protocol-checkbox-toggle"></div>
                      <input type="hidden" name="protocol-accepted" value="false"/>
                      <span className="text-xs">I acknowledge the <span className="accent-text">Cheapal Field Protocol</span> and accept the terms.</span>
                    </div>
                  </motion.div>

                  <motion.div variants={formItemVariants}>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn-primary w-full"
                      whileHover={!isSubmitting ? { y: -1 } : {}}
                      whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          INITIALIZING...
                        </>
                      ) : (
                        <>
                          <span className="btn-text">REGISTER</span>
                          <span className="btn-glow"></span>
                        </>
                      )}
                    </button>
                  </motion.div>
                </form>

                <motion.div className="form-footer mt-6" variants={formItemVariants}>
                  <p>Already a User? <Link to="/login" className="accent-link">Authenticate Here</Link></p>
                </motion.div>
              </div>
            </motion.main>
          </div>
        </div>
      </div>

      <style jsx global>{`
        :root {
          --expedition-green: #122a1e;
          --midnight-charcoal: #181c22;
          --misty-gray: #a0aec0;
          --bioluminescent-teal: #4fd1c5;
          --evidence-amber: #68d391;
          --scanner-green: #38b2ac;
          --bioluminescent-teal-rgb: 79, 209, 197;
          --evidence-amber-rgb: 104, 211, 145;
          --midnight-charcoal-rgb: 24, 28, 34;
          --misty-gray-rgb: 160, 174, 192;
          --scanner-green-rgb: 56, 178, 172;
          --font-heading: 'Rajdhani', 'Orbitron', sans-serif;
          --font-body: 'Work Sans', sans-serif;
          --font-mono: 'Space Mono', monospace;
          --glass-opacity: 0.2;
          --blur-amount: 6px;
          --glow-strength: 2px;
        }

        .cryptid-theme-active {
          font-family: var(--font-body);
          color: var(--misty-gray);
          line-height: 1.6;
          position: relative;
          overflow-x: hidden;
        }

        .background {
          position: fixed;
          inset: 0;
          z-index: -4;
          background: linear-gradient(135deg, var(--midnight-charcoal), var(--expedition-green) 70%, var(--midnight-charcoal));
          animation: backgroundPulse 25s ease-in-out infinite alternate;
        }

        .bitmap-overlay {
          position: absolute;
          inset: 0;
          background-repeat: repeat;
          opacity: 0.05;
          mix-blend-mode: soft-light;
          pointer-events: none;
          z-index: 1;
        }

        .topographic-overlay {
          position: fixed;
          inset: 0;
          background-image: url('data:image/svg+xml,%3Csvg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg"%3E%3Cdefs%3E%3Cpattern id="topo" patternUnits="userSpaceOnUse" width="200" height="200"%3E%3Cpath d="M0,100 Q50,50 100,100 Q150,150 200,100 M0,50 Q50,0 100,50 Q150,100 200,50 M0,150 Q50,100 100,150 Q150,200 200,150" fill="none" stroke="rgba(var(--bioluminescent-teal-rgb), 0.04)" stroke-width="0.4"/%3E%3C/pattern%3E%3C/defs%3E%3Crect width="100%" height="100%" fill="url(%23topo)"/%3E%3C/svg%3E');
          z-index: -2;
          opacity: 0.5;
          pointer-events: none;
        }

        .noise {
          position: absolute;
          inset: 0;
          background-image: url('data:image/svg+xml,%3Csvg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noiseFilter"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="1" stitchTiles="stitch"/%3E%3C/filter%3E%3Crect width="100%" height="100%" filter="url(%23noiseFilter)" opacity="0.05"/%3E%3C/svg%3E');
          opacity: 0.4;
          z-index: 2;
          mix-blend-mode: screen;
          animation: noiseShift 0.7s steps(2) infinite;
          pointer-events: none;
        }

        .gradient-overlay {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(circle at 10% 90%, rgba(var(--bioluminescent-teal-rgb), 0.1), transparent 35%),
            radial-gradient(circle at 90% 10%, rgba(var(--scanner-green-rgb), 0.07), transparent 35%);
          z-index: 3;
          pointer-events: none;
          opacity: 0.7;
        }

        @keyframes backgroundPulse {
          0%, 100% { filter: hue-rotate(-3deg) brightness(90%); }
          50% { filter: hue-rotate(3deg) brightness(100%); }
        }

        @keyframes noiseShift {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(0.5px, -0.5px); }
          50% { transform: translate(-0.5px, 0.5px); }
          75% { transform: translate(-0.5px, -0.5px); }
        }

        .cheapal-image-logo-wrapper {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .cheapal-image-logo-wrapper img {
          filter: drop-shadow(0 0 12px rgba(var(--bioluminescent-teal-rgb), 0.35))
                  drop-shadow(0 0 25px rgba(var(--bioluminescent-teal-rgb), 0.25));
          transition: filter 0.3s ease-in-out;
        }

        .cheapal-image-logo-wrapper img:hover {
          filter: drop-shadow(0 0 18px rgba(var(--bioluminescent-teal-rgb), 0.55))
                  drop-shadow(0 0 35px rgba(var(--bioluminescent-teal-rgb), 0.35));
        }

        .glass-panel {
          background: rgba(var(--expedition-green-rgb, 20, 43, 33), 0.4);
          backdrop-filter: blur(var(--blur-amount)) contrast(105%) brightness(90%);
          border: 1px solid rgba(var(--bioluminescent-teal-rgb), 0.2);
          box-shadow: 0 6px 30px rgba(0, 0, 0, 0.4),
                      0 0 50px rgba(var(--bioluminescent-teal-rgb), 0.15),
                      inset 0 0 12px rgba(var(--bioluminescent-teal-rgb), 0.08);
          border-radius: 6px;
          padding: 2rem 2.5rem;
          position: relative;
          overflow: hidden;
        }

        .bg-glass-panel-inner {
          background-color: rgba(var(--expedition-green-rgb), 0.4);
        }

        .classified-stamp {
          position: absolute;
          top: 0.8rem;
          right: 0.8rem;
          font-family: var(--font-mono);
          color: rgba(var(--evidence-amber-rgb), 0.6);
          border: 1px solid rgba(var(--evidence-amber-rgb), 0.5);
          padding: 0.1rem 0.25rem;
          font-size: 0.5rem;
          transform: rotate(8deg);
          text-transform: uppercase;
          letter-spacing: 0.8px;
          pointer-events: none;
          z-index: 10;
          opacity: 0.7;
        }

        .form-container h1 {
          font-family: var(--font-heading);
          color: var(--bioluminescent-teal);
          font-size: 1.5rem;
          line-height: 1.2;
          margin-bottom: 0.2rem;
          font-weight: 700;
          text-align: center;
          text-shadow: 0 0 8px rgba(var(--bioluminescent-teal-rgb), 0.4);
        }

        .classified-stripe {
          background-color: rgba(var(--evidence-amber-rgb), 0.9);
          color: var(--midnight-charcoal);
          font-family: var(--font-mono);
          font-size: 0.5rem;
          font-weight: 700;
          padding: 0.2rem 0.4rem;
          display: inline-block;
          margin-bottom: 1.2rem;
          letter-spacing: 1.2px;
          text-align: center;
          width: 100%;
          border-radius: 2px;
          box-shadow: 0 1px 2px rgba(0,0,0,0.2);
        }

        .form-group {
          position: relative;
          margin-bottom: 1rem;
        }

        .form-group label {
          display: block;
          font-size: 0.7rem;
          margin-bottom: 0.25rem;
          color: var(--misty-gray);
          font-family: var(--font-mono);
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .input-container {
          display: flex;
          align-items: center;
          position: relative;
        }

        .input-prefix {
          color: var(--bioluminescent-teal);
          font-family: var(--font-mono);
          font-size: 0.85rem;
          margin-right: 0.4rem;
          opacity: 0.4;
          position: absolute;
          left: 0.7rem;
          top: 50%;
          transform: translateY(-50%);
          z-index: 2;
          pointer-events: none;
        }

        .input-prefix.secure {
          color: var(--evidence-amber);
          opacity: 0.5;
        }

        .input-container input, .input-container select {
          width: 100%;
          padding: 0.6rem 0.8rem;
          padding-left: 1.9rem;
          border: 1px solid rgba(var(--bioluminescent-teal-rgb), 0.2);
          border-radius: 3px;
          background: rgba(var(--midnight-charcoal-rgb), 0.7);
          color: #E0E7FF;
          font-family: var(--font-body);
          transition: border-color 0.2s ease, background-color 0.2s ease, box-shadow 0.2s ease;
          position: relative;
          z-index: 1;
        }

        .input-container input::placeholder {
          color: rgba(var(--misty-gray-rgb), 0.5);
        }

        .input-container input:focus, .input-container select:focus {
          outline: none;
          border-color: var(--bioluminescent-teal);
          background: rgba(var(--midnight-charcoal-rgb), 0.85);
          box-shadow: 0 0 12px rgba(var(--bioluminescent-teal-rgb), 0.25);
        }

        .input-container input.input-error {
          border-color: rgba(244, 67, 54, 0.7) !important;
          box-shadow: 0 0 8px rgba(244, 67, 54, 0.3) !important;
        }

        .form-error-text {
          font-family: var(--font-mono);
          color: #FCA5A5;
          font-size: 0.7rem;
          margin-top: 0.2rem;
          letter-spacing: 0.3px;
        }

        .input-container select {
          padding-left: 0.7rem;
          appearance: none;
          background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20"><path stroke="%2336D8B7" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 8l4 4 4-4"/></svg>');
          background-repeat: no-repeat;
          background-position: right 0.6rem center;
          background-size: 1rem 1rem;
        }

        .input-container .input-glow {
          display: none;
        }

        .input-container button {
          color: var(--misty-gray);
        }

        .input-container button:hover {
          color: var(--bioluminescent-teal);
        }

        .custom-toggle-container {
          color: var(--misty-gray);
          font-size: 0.7rem;
        }

        .custom-toggle {
          background: rgba(var(--midnight-charcoal-rgb), 0.7);
          border: 1px solid rgba(var(--bioluminescent-teal-rgb), 0.2);
        }

        .custom-toggle-container:hover .custom-toggle {
          background: rgba(var(--bioluminescent-teal-rgb), 0.1);
          border-color: var(--bioluminescent-teal);
        }

        .custom-toggle.checked {
          background: rgba(var(--bioluminescent-teal-rgb), 0.25);
          border-color: var(--bioluminescent-teal);
        }

        .custom-toggle.checked::after {
          border-color: var(--bioluminescent-teal);
        }

        .custom-toggle-container .accent-text {
          color: var(--bioluminescent-teal);
        }

        .btn-primary {
          font-family: var(--font-heading);
          padding: 0.6rem 1.3rem;
          font-size: 0.8rem;
          letter-spacing: 1.2px;
          background: var(--bioluminescent-teal);
          color: #0D1B16;
          border: 1px solid var(--bioluminescent-teal);
          font-weight: 700;
          text-transform: uppercase;
        }

        .btn-primary:hover {
          box-shadow: 0 0 18px rgba(var(--bioluminescent-teal-rgb), 0.5);
          background: #45E0C4;
          border-color: #45E0C4;
          color: #0A1410;
        }

        .btn-primary:disabled {
          background: rgba(var(--misty-gray-rgb), 0.2);
          border-color: rgba(var(--misty-gray-rgb), 0.3);
          color: rgba(var(--misty-gray-rgb), 0.6);
        }

        button[onClick*="handleGoogleLogin"] {
          font-family: var(--font-body);
          border: 1px solid rgba(var(--misty-gray-rgb), 0.25);
          background: transparent;
          color: var(--misty-gray);
        }

        button[onClick*="handleGoogleLogin"]:hover {
          background: rgba(var(--bioluminescent-teal-rgb), 0.03);
          border-color: rgba(var(--bioluminescent-teal-rgb), 0.3);
          color: var(--bioluminescent-teal);
        }

        .form-footer {
          font-size: 0.7rem;
          color: var(--misty-gray);
        }

        .accent-link {
          color: var(--bioluminescent-teal);
        }

        .accent-link:hover {
          color: #80F7EA;
        }

        .accent-link::after {
          background-color: var(--bioluminescent-teal);
        }

        @media (max-width: 768px) {
          .glass-panel {
            padding: 1.5rem 1rem;
          }

          .form-container h1 {
            font-size: 1.2rem;
          }

          .classified-stripe {
            font-size: 0.45rem;
            padding: 0.1rem 0.25rem;
            margin-bottom: 0.8rem;
          }

          .form-group label {
            font-size: 0.65rem;
          }

          .input-container input, .input-container select {
            padding: 0.55rem 0.7rem;
            padding-left: 1.7rem;
            font-size: 0.8rem;
          }

          .input-prefix {
            font-size: 0.75rem;
            left: 0.45rem;
          }

          .btn-primary {
            padding: 0.55rem 0.9rem;
            font-size: 0.7rem;
          }

          .form-footer {
            font-size: 0.65rem;
          }

          .custom-toggle-container {
            font-size: 0.65rem;
            padding-left: 22px;
          }

          .custom-toggle {
            height: 15px;
            width: 15px;
          }

          .custom-toggle.checked::after {
            width: 3px;
            height: 6px;
          }

          .cheapal-image-logo-wrapper {
            margin-top: 1rem;
            margin-bottom: 0.5rem;
          }

          .cheapal-image-logo-wrapper img {
            max-width: clamp(180px, 70vw, 300px);
            max-height: 200px;
            width: auto;
            height: auto;
            margin-top: 0;
          }

          .text-xl {
            margin-top: 0.5rem;
            margin-bottom: 0.5rem;
            font-size: clamp(1rem, 4vw, 1.25rem);
          }

          .mt-auto {
            margin-bottom: 1rem;
          }

          .form-container {
            padding-top: 0.5rem;
          }
        }

        @media (max-width: 480px) {
          .glass-panel {
            padding: 1rem 0.75rem;
          }

          .form-container {
            padding: 0.5rem;
            padding-top: 0.25rem;
          }

          .cheapal-image-logo-wrapper {
            margin-top: 0.5rem;
            margin-bottom: 0.25rem;
          }

          .cheapal-image-logo-wrapper img {
            max-width: clamp(150px, 60vw, 250px);
            max-height: 150px;
          }

          .text-xl {
            font-size: clamp(0.875rem, 3.5vw, 1rem);
          }
        }
      `}</style>
    </>
  );
};

export default RegisterPage;