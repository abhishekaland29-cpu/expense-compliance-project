import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ShieldCheckIcon, 
  EnvelopeIcon, 
  LockClosedIcon, 
  BuildingLibraryIcon,
  FingerPrintIcon,
  KeyIcon
} from '@heroicons/react/24/outline';

const Login = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', credentials);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user)); 
      navigate('/dashboard'); 
    } catch (err) {
      console.error("Login Error:", err);
      alert("Access Denied: " + (err.response?.data?.message || "Invalid credentials"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row font-['Inter'] bg-white">
      
      {/* LEFT PANEL: The Brand Identity */}
      <div className="hidden md:flex md:w-[40%] bg-[#002D72] p-16 flex-col justify-between text-white relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-400/5 rounded-full blur-3xl -ml-48 -mb-48"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-16">
            <div className="bg-white/10 p-3 rounded-xl border border-white/20">
              <BuildingLibraryIcon className="w-8 h-8 text-blue-300" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tighter uppercase">Zero-Leak</h1>
              <p className="text-[10px] uppercase tracking-[0.3em] text-blue-300 font-bold">Secure Access</p>
            </div>
          </div>

          <h2 className="text-5xl font-black leading-[1.1] mb-10">
            Secure <br /> 
            <span className="text-blue-400">Personnel</span> <br /> 
            Authorization.
          </h2>
          
          <div className="space-y-8">
            <SecurityFeature 
              icon={<FingerPrintIcon />} 
              title="Identity Assurance" 
              desc="Multi-layered validation for every login session." 
            />
            <SecurityFeature 
              icon={<KeyIcon />} 
              title="Encrypted Vault" 
              desc="Your credentials are protected by AES-256 military-grade standards." 
            />
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-4 pt-10 border-t border-white/10 text-blue-200">
          <ShieldCheckIcon className="w-5 h-5" />
          <p className="text-xs font-semibold uppercase tracking-widest">Certified Compliance Engine</p>
        </div>
      </div>

      {/* RIGHT PANEL: The Login Form */}
      <div className="flex-1 bg-slate-50 flex items-center justify-center p-8 md:p-24">
        <div className="max-w-md w-full">
          <div className="mb-12">
            <h3 className="text-4xl font-black text-slate-800 tracking-tight mb-3">Welcome Back</h3>
            <p className="text-slate-500 font-medium">Identify yourself to access the secure terminal.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-8">
            {/* Email Field */}
            <div className="group">
              <label className="text-[10px] font-black text-slate-400 uppercase mb-3 block tracking-widest">Corporate Identifier</label>
              <div className="relative">
                <EnvelopeIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#002D72] w-6 h-6 transition-colors" />
                <input 
                  type="email" 
                  name="email" 
                  placeholder="name@company.com" 
                  className="w-full bg-white border border-slate-200 pl-14 pr-6 py-5 rounded-2xl focus:ring-4 focus:ring-blue-500/5 focus:border-[#002D72] outline-none transition-all font-semibold text-slate-700" 
                  onChange={handleChange} 
                  required 
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="group">
              <div className="flex justify-between items-end mb-3">
                <label className="text-[10px] font-black text-slate-400 uppercase block tracking-widest">Secret Key</label>
                <a href="#" className="text-[10px] font-bold text-[#002D72] uppercase tracking-widest hover:underline">Forgot?</a>
              </div>
              <div className="relative">
                <LockClosedIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#002D72] w-6 h-6 transition-colors" />
                <input 
                  type="password" 
                  name="password" 
                  placeholder="••••••••" 
                  className="w-full bg-white border border-slate-200 pl-14 pr-6 py-5 rounded-2xl focus:ring-4 focus:ring-blue-500/5 focus:border-[#002D72] outline-none transition-all font-semibold text-slate-700" 
                  onChange={handleChange} 
                  required 
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button 
                type="submit" 
                disabled={loading}
                className={`w-full bg-[#002D72] hover:bg-[#003da1] text-white py-6 rounded-2xl font-black uppercase tracking-[0.2em] shadow-2xl shadow-blue-900/30 active:scale-[0.99] transition-all flex items-center justify-center gap-4 text-lg ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {loading ? (
                  <>
                    <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Authorizing...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheckIcon className="w-7 h-7" />
                    <span>Authorize Session</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Bottom Navigation */}
          <div className="mt-16 text-center pt-8 border-t border-slate-200 flex flex-col gap-6">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
              New Personnel? 
              <Link to="/signup" className="text-[#002D72] ml-2 hover:underline decoration-2 underline-offset-4 font-black">
                Register Organization
              </Link>
            </p>
            <div className="flex items-center justify-center gap-2 text-[10px] text-slate-300 font-bold uppercase tracking-tighter">
               <LockClosedIcon className="w-3 h-3" />
               <span>SSL 256-Bit Secure Environment</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Internal component for the left panel feature items
const SecurityFeature = ({ icon, title, desc }) => (
  <div className="flex gap-4 items-start">
    <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center shrink-0 border border-white/20">
      {React.cloneElement(icon, { className: "w-6 h-6 text-blue-300" })}
    </div>
    <div>
      <p className="font-black uppercase text-sm tracking-widest mb-1">{title}</p>
      <p className="text-xs text-blue-100/60 font-medium leading-relaxed max-w-[240px]">{desc}</p>
    </div>
  </div>
);

export default Login;