import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { 
  PlusIcon, ArrowLeftOnRectangleIcon, 
  BuildingLibraryIcon, CreditCardIcon, 
  ClockIcon, CheckCircleIcon, XCircleIcon,
  ChevronRightIcon, InformationCircleIcon
} from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

const EmployeeDashboard = () => {
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ amount: '', category: 'Travel', description: '' });
  
  const user = JSON.parse(localStorage.getItem('user'));

  const fetchMyExpenses = useCallback(async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/expenses/my/${user.id}`);
      setExpenses(res.data);
    } catch (err) {
      console.error("Error fetching expenses", err);
    }
  }, [user?.id]);

  useEffect(() => {
    if (!user) navigate('/login');
    else fetchMyExpenses();
  }, [user, navigate, fetchMyExpenses]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/expenses/submit', {
        ...formData,
        userId: user.id,
        companyId: user.companyId
      });
      setShowModal(false);
      setFormData({ amount: '', category: 'Travel', description: '' });
      fetchMyExpenses();
    } catch (err) {
      alert("Submission Failed: " + (err.response?.data?.error || "Server Error"));
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 w-full font-['Inter'] flex flex-col">
      {/* 1. Banking Navigation */}
      <nav className="sticky top-0 z-50 bg-[#002D72] text-white py-4 px-6 md:px-12 flex justify-between items-center shadow-lg">
        <div className="flex items-center gap-4">
          <div className="bg-white/10 p-2 rounded-lg">
            <BuildingLibraryIcon className="w-6 h-6 text-blue-300" />
          </div>
          <div>
            <h1 className="text-lg font-bold leading-tight">Zero-Leak</h1>
            <p className="text-[10px] uppercase tracking-tighter opacity-60 italic">Employee Self-Service</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-right hidden sm:block border-r border-white/20 pr-6">
            <p className="text-[10px] uppercase font-bold text-blue-300 leading-none mb-1">Authenticated Employee</p>
            <p className="text-sm font-semibold">{user?.fullName}</p>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 hover:text-red-300 transition-colors group">
            <span className="text-xs font-black uppercase tracking-widest hidden md:inline">Secure Sign Out</span>
            <ArrowLeftOnRectangleIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </nav>

      {/* 2. Main Content */}
      <main className="flex-1 w-full px-6 md:px-12 py-10">
        
        {/* Header Action Area */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <p className="text-blue-700 text-xs font-black uppercase tracking-[0.2em] mb-2">Internal Accounts / Reimbursements</p>
            <h2 className="text-3xl font-black text-slate-800 tracking-tight">Financial Submission Portal</h2>
          </div>
          <button 
            onClick={() => setShowModal(true)} 
            className="flex items-center justify-center gap-3 bg-[#002D72] hover:bg-[#003da1] text-white px-10 py-4 rounded-xl font-black uppercase tracking-widest transition-all shadow-xl shadow-blue-900/20 active:scale-95"
          >
            <PlusIcon className="w-5 h-5 stroke-[3]" /> File New Claim
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Submission History Table */}
          <div className="lg:col-span-8">
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden min-h-[400px]">
              <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                <h3 className="font-black text-xs uppercase tracking-widest text-slate-500 flex items-center gap-2">
                  <CreditCardIcon className="w-4 h-4 text-blue-600" /> Recent Submission History
                </h3>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-[11px] uppercase font-black text-slate-400 bg-slate-50 border-b border-slate-200">
                      <th className="px-8 py-4">Verification Details</th>
                      <th className="px-8 py-4">Category</th>
                      <th className="px-8 py-4 text-right">Amount</th>
                      <th className="px-8 py-4 text-center">Audit Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {expenses.length > 0 ? (
                      expenses.map(exp => (
                        <tr key={exp.id} className="hover:bg-blue-50/30 transition-colors group">
                          <td className="px-8 py-5">
                            <p className="font-bold text-slate-800">{exp.description}</p>
                            <p className="text-[10px] text-slate-400 font-mono mt-0.5">FILED ON: {new Date(exp.created_at).toLocaleDateString()}</p>
                          </td>
                          <td className="px-8 py-5">
                            <span className="text-[10px] font-black text-slate-500 bg-slate-100 px-3 py-1 rounded-full border border-slate-200 uppercase">
                              {exp.category}
                            </span>
                          </td>
                          <td className="px-8 py-5 text-right font-mono font-black text-slate-900">
                            ${parseFloat(exp.orig_amount).toFixed(2)}
                          </td>
                          <td className="px-8 py-5 flex justify-center">
                            <StatusBadge status={exp.status} />
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="py-24 text-center">
                          <div className="flex flex-col items-center gap-4 opacity-40">
                             <InformationCircleIcon className="w-12 h-12" />
                             <p className="font-black text-xs uppercase tracking-[0.2em]">No Financial Transactions Found</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Quick Info Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-[#002D72] p-8 rounded-2xl text-white shadow-xl">
              <h4 className="font-black text-xs uppercase tracking-widest opacity-60 mb-6">Submission Policy</h4>
              <ul className="space-y-4">
                <li className="flex gap-4">
                  <div className="w-2 h-2 bg-blue-300 rounded-full mt-1.5 shrink-0" />
                  <p className="text-sm font-medium">Claims exceeding $1,000 are subject to **High-Risk Leakage Audit**.</p>
                </li>
                <li className="flex gap-4">
                  <div className="w-2 h-2 bg-blue-300 rounded-full mt-1.5 shrink-0" />
                  <p className="text-sm font-medium">Processing time is typically 3-5 business days for standard category claims.</p>
                </li>
              </ul>
            </div>
            
            <div className="bg-white border border-slate-200 p-8 rounded-2xl shadow-sm">
               <h4 className="font-black text-[10px] text-slate-400 uppercase tracking-widest mb-4">Verification Center</h4>
               <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                 <div className="flex items-center gap-3">
                    <ClockIcon className="w-5 h-5 text-orange-500" />
                    <p className="text-xs font-bold text-slate-600">Pending Review</p>
                 </div>
                 <p className="font-black text-lg text-slate-800">
                   {expenses.filter(e => e.status === 'Pending').length}
                 </p>
               </div>
            </div>
          </div>
        </div>
      </main>

      {/* 3. Corporate Submission Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center z-[60] p-6">
          <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl overflow-hidden border border-white/20">
            <div className="bg-[#002D72] px-10 py-8 text-white">
              <h3 className="font-black text-2xl uppercase tracking-tighter">New Expense Filing</h3>
              <p className="text-blue-200 text-xs mt-1">Please ensure all values reflect the official receipt.</p>
            </div>
            <form onSubmit={handleSubmit} className="p-10 space-y-6">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block">Transaction Amount ($)</label>
                <input required type="number" className="w-full bg-slate-50 border border-slate-200 p-4 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-mono font-bold" placeholder="0.00"
                  value={formData.amount} onChange={(e) => setFormData({...formData, amount: e.target.value})} 
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block">General Ledger Category</label>
                <select className="w-full bg-slate-50 border border-slate-200 p-4 rounded-xl outline-none cursor-pointer font-bold text-slate-700"
                  value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}
                >
                  <option>Travel</option>
                  <option>Meals</option>
                  <option>Software</option>
                  <option>Office Supplies</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block">Business Justification</label>
                <textarea required className="w-full bg-slate-50 border border-slate-200 p-4 rounded-xl h-28 outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm font-medium" placeholder="Describe the purpose..."
                  value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})}
                ></textarea>
              </div>
              <div className="flex gap-4 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-4 text-slate-400 font-black uppercase text-[10px] tracking-widest hover:text-red-500 transition-colors">Cancel</button>
                <button type="submit" className="flex-[2] bg-[#002D72] py-4 rounded-2xl text-white font-black uppercase tracking-widest shadow-xl shadow-blue-900/20 active:scale-[0.98] transition-all">Submit for Audit</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const StatusBadge = ({ status }) => {
  const styles = {
    Pending: 'bg-orange-50 text-orange-600 border-orange-100',
    Approved: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    Rejected: 'bg-red-50 text-red-600 border-red-100'
  };
  const icons = {
    Pending: <ClockIcon className="w-3 h-3" />,
    Approved: <CheckCircleIcon className="w-3 h-3" />,
    Rejected: <XCircleIcon className="w-3 h-3" />
  };
  return (
    <span className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase border tracking-[0.15em] flex items-center gap-2 ${styles[status]}`}>
      {icons[status]} {status}
    </span>
  );
};

export default EmployeeDashboard;