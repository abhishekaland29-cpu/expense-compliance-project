import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ShieldCheckIcon, BuildingOfficeIcon, UserIcon, 
  EnvelopeIcon, LockClosedIcon, GlobeAltIcon,
  BuildingLibraryIcon, CheckBadgeIcon, LockOpenIcon
} from '@heroicons/react/24/outline';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    companyName: '',
    fullName: '',
    email: '',
    password: '',
    country: ''
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const countryRes = await axios.get(`https://restcountries.com/v3.1/alpha/${formData.country}?fields=currencies`);
      const currencyCode = Object.keys(countryRes.data.currencies)[0];

      const finalPayload = {
        ...formData,
        baseCurrency: currencyCode,
        role: 'Admin' 
      };

      await axios.post('http://localhost:5000/api/auth/signup', finalPayload);
      alert(`Organization Registered Successfully. Base Currency set to ${currencyCode}`);
      navigate('/login'); 

    } catch (err) {
      console.error("Signup Error:", err);
      const errorMessage = err.response?.data?.message || "Check if backend is running on Port 5000";
      alert("Failed to create organization: " + errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row font-['Inter'] bg-white">
      
      {/* LEFT PANEL: Branding & Trust (Full Height) */}
      <div className="hidden md:flex md:w-[40%] bg-[#002D72] p-16 flex-col justify-between text-white relative overflow-hidden">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-full h-full border-[1px] border-white rounded-full translate-x-1/2 scale-150" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-12">
            <div className="bg-white/10 p-3 rounded-xl border border-white/20">
              <BuildingLibraryIcon className="w-8 h-8 text-blue-300" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tighter uppercase">Zero-Leak</h1>
              <p className="text-[10px] uppercase tracking-[0.3em] text-blue-300 font-bold">Compliance Engine</p>
            </div>
          </div>

          <h2 className="text-5xl font-black leading-tight mb-8">
            Protecting <br /> <span className="text-blue-400 text-6xl">Revenue.</span> <br /> Automating <br /> Compliance.
          </h2>
          
          <div className="space-y-6">
            <TrustPoint icon={<CheckBadgeIcon />} title="Automated Verification" desc="AI-driven auditing for every transaction." />
            <TrustPoint icon={<LockOpenIcon />} title="Zero-Leak Guarantee" desc="Stop expense fraud before it impacts the bottom line." />
          </div>
        </div>

        <div className="relative z-10 pt-10 border-t border-white/10">
          <p className="text-xs text-blue-200 font-medium">Trusted by leading financial institutions worldwide.</p>
        </div>
      </div>

      {/* RIGHT PANEL: The Form (Full Height & Scrollable) */}
      <div className="flex-1 bg-slate-50 flex items-center justify-center p-8 md:p-24 overflow-y-auto">
        <div className="max-w-2xl w-full">
          <div className="mb-12">
            <h3 className="text-3xl font-black text-slate-800 tracking-tight">Register New Organization</h3>
            <p className="text-slate-500 font-medium mt-2">Set up your secure enterprise dashboard in minutes.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Full Width Field */}
              <div className="md:col-span-2 group">
                <label className="text-[10px] font-black text-slate-400 uppercase mb-3 block tracking-widest">Legal Entity Name</label>
                <div className="relative">
                  <BuildingOfficeIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#002D72] w-6 h-6 transition-colors" />
                  <input 
                    type="text" name="companyName" value={formData.companyName} onChange={handleChange}
                    placeholder="e.g. Aland Technical Solutions" 
                    className="w-full bg-white border border-slate-200 pl-14 pr-6 py-5 rounded-2xl focus:ring-4 focus:ring-blue-500/5 focus:border-[#002D72] outline-none transition-all font-semibold text-slate-700" 
                    required 
                  />
                </div>
              </div>

              <div className="group">
                <label className="text-[10px] font-black text-slate-400 uppercase mb-3 block tracking-widest">Administrator Name</label>
                <div className="relative">
                  <UserIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#002D72] w-6 h-6 transition-colors" />
                  <input 
                    type="text" name="fullName" value={formData.fullName} onChange={handleChange}
                    placeholder="Your full name" 
                    className="w-full bg-white border border-slate-200 pl-14 pr-6 py-5 rounded-2xl focus:ring-4 focus:ring-blue-500/5 focus:border-[#002D72] outline-none transition-all font-semibold" 
                    required 
                  />
                </div>
              </div>

              <div className="group">
                <label className="text-[10px] font-black text-slate-400 uppercase mb-3 block tracking-widest">Corporate Email</label>
                <div className="relative">
                  <EnvelopeIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#002D72] w-6 h-6 transition-colors" />
                  <input 
                    type="email" name="email" value={formData.email} onChange={handleChange}
                    placeholder="admin@company.com" 
                    className="w-full bg-white border border-slate-200 pl-14 pr-6 py-5 rounded-2xl focus:ring-4 focus:ring-blue-500/5 focus:border-[#002D72] outline-none transition-all font-semibold" 
                    required 
                  />
                </div>
              </div>

              <div className="group">
                <label className="text-[10px] font-black text-slate-400 uppercase mb-3 block tracking-widest">Master Password</label>
                <div className="relative">
                  <LockClosedIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#002D72] w-6 h-6 transition-colors" />
                  <input 
                    type="password" name="password" value={formData.password} onChange={handleChange}
                    placeholder="••••••••" 
                    className="w-full bg-white border border-slate-200 pl-14 pr-6 py-5 rounded-2xl focus:ring-4 focus:ring-blue-500/5 focus:border-[#002D72] outline-none transition-all font-semibold" 
                    required 
                  />
                </div>
              </div>

              <div className="group">
                <label className="text-[10px] font-black text-slate-400 uppercase mb-3 block tracking-widest">Jurisdiction</label>
                <div className="relative">
                  <GlobeAltIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#002D72] w-6 h-6 transition-colors" />
                  <select 
                    name="country" value={formData.country} onChange={handleChange}
                    className="w-full bg-white border border-slate-200 pl-14 pr-6 py-5 rounded-2xl focus:ring-4 focus:ring-blue-500/5 focus:border-[#002D72] outline-none transition-all font-bold text-slate-700 appearance-none cursor-pointer"
                    required
                  >
                    <option value="">Select Region</option>
                    <option value="IN">India (INR)</option>
                    <option value="US">United States (USD)</option>
                    <option value="GB">United Kingdom (GBP)</option>
                  </select>
                </div>
              </div>

            </div>

            <div className="pt-6">
              <button 
                type="submit" 
                disabled={loading}
                className={`w-full bg-[#002D72] hover:bg-[#003da1] text-white py-6 rounded-2xl font-black uppercase tracking-[0.2em] shadow-2xl shadow-blue-900/30 active:scale-[0.99] transition-all flex items-center justify-center gap-4 text-lg ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {loading ? (
                  <>
                    <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Provisioning System...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheckIcon className="w-7 h-7" />
                    <span>Deploy Secure Organization</span>
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-12 text-center md:text-left border-t border-slate-200 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
              Already Registered? 
              <Link to="/login" className="text-[#002D72] ml-2 hover:underline decoration-2 underline-offset-4 font-black">
                Log In
              </Link>
            </p>
            <p className="text-[10px] text-slate-300 font-bold uppercase tracking-tighter">
              Secured by Zero-Leak Protocol v4.2
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Sub-component for the left panel
const TrustPoint = ({ icon, title, desc }) => (
  <div className="flex gap-4 items-start">
    <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center shrink-0 border border-white/20">
      {React.cloneElement(icon, { className: "w-6 h-6 text-blue-300" })}
    </div>
    <div>
      <p className="font-black uppercase text-xs tracking-wider mb-1">{title}</p>
      <p className="text-xs text-blue-100/70 font-medium leading-relaxed">{desc}</p>
    </div>
  </div>
);

export default Signup;