import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Lock, Mail, Loader2, ArrowRight } from 'lucide-react';
import { ensureAdminConfigInitialized } from '../lib/enquiryService';

interface AdminLoginProps {
  onLoginSuccess: () => void;
  navigate: (path: string) => void;
}

export default function AdminLogin({ onLoginSuccess, navigate }: AdminLoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [correctPassword, setCorrectPassword] = useState('Admin@123');

  // Load correct password from Firebase on mount
  useEffect(() => {
    async function loadConfig() {
      try {
        const pass = await ensureAdminConfigInitialized();
        setCorrectPassword(pass);
      } catch (err) {
        console.error("Could not fetch credentials from Firebase", err);
      }
    }
    loadConfig();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulate network delay for premium feel
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const normalizedEmail = email.trim().toLowerCase();
    
    if (normalizedEmail === 'admin@assam2abroad.com' && password === correctPassword) {
      if (rememberMe) {
        localStorage.setItem('eg_admin_session', 'active');
      } else {
        sessionStorage.setItem('eg_admin_session', 'active');
      }
      setLoading(false);
      onLoginSuccess();
    } else {
      setLoading(false);
      setError('Invalid email address or security password. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col justify-center items-center p-4 relative overflow-hidden select-none">
      {/* Decorative premium gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-german-red/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-german-gold/10 rounded-full blur-[120px]" />

      <div className="w-full max-w-md z-10 space-y-8">
        {/* Branding Title */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center p-3 bg-neutral-900 border border-neutral-800 rounded-2xl mb-2">
            <span className="text-2xl font-bold font-display text-transparent bg-clip-text bg-gradient-to-r from-neutral-200 via-german-gold to-white leading-none">
              A2A
            </span>
          </div>
          <h2 className="text-3xl font-extrabold font-display text-white tracking-tight">
            Assam2Abroad
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 font-light tracking-wide uppercase font-mono">
            Private Administration Panel
          </p>
        </div>

        {/* Card Body */}
        <div className="bg-[rgba(18,18,18,0.7)] backdrop-blur-xl border border-neutral-800 p-8 sm:p-10 rounded-3xl shadow-2xl space-y-6">
          <div className="space-y-1 text-left">
            <h3 className="text-lg font-bold text-white font-display">
              Welcome back
            </h3>
            <p className="text-xs text-neutral-400 font-light leading-relaxed">
              Sign in with your institute master credentials to manage registrations.
            </p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs py-3 px-4 rounded-xl text-left font-light leading-relaxed">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div className="space-y-1.5 text-left">
              <label className="block text-[11px] font-bold uppercase text-neutral-400 tracking-wider font-mono">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  placeholder="admin@assam2abroad.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-neutral-900/60 border border-neutral-800 focus:border-neutral-600 rounded-xl text-sm text-white placeholder-neutral-500 outline-none transition-colors"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5 text-left">
              <div className="flex justify-between items-center">
                <label className="block text-[11px] font-bold uppercase text-neutral-400 tracking-wider font-mono">
                  Security Password
                </label>
                <button
                  type="button"
                  onClick={() => alert("Default credential password is: Admin@123")}
                  className="text-[11px] text-german-gold/80 hover:text-german-gold font-medium transition-colors"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Enter secure password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 bg-neutral-900/60 border border-neutral-800 focus:border-neutral-600 rounded-xl text-sm text-white placeholder-neutral-500 outline-none transition-colors font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-500 hover:text-neutral-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember me */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center space-x-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4.5 h-4.5 rounded border-neutral-800 bg-neutral-900/60 text-german-red focus:ring-0 outline-none cursor-pointer"
                />
                <span className="text-xs text-neutral-400 font-light">
                  Remember me for 30 days
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white hover:bg-neutral-100 text-neutral-950 font-bold py-3.5 px-4 rounded-xl text-xs uppercase tracking-widest font-sans transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.01] cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying Session...</span>
                </>
              ) : (
                <>
                  <span>Access Dashboard</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Legal notice */}
        <p className="text-[11px] text-neutral-500 font-mono">
          Authorized personnel only. Sessions are tracked and logged.
        </p>
      </div>
    </div>
  );
}
