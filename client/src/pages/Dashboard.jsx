import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import { 
  UserPlusIcon, UsersIcon, CurrencyDollarIcon, 
  XMarkIcon, UserCircleIcon, ArrowLeftOnRectangleIcon,
  ShieldCheckIcon, ExclamationTriangleIcon, CheckCircleIcon,
  BuildingLibraryIcon, ChartBarIcon, MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [team, setTeam] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [newMember, setNewMember] = useState({ 
    fullName: '', email: '', role: 'Employee', managerId: '' 
  });

  const adminData = JSON.parse(localStorage.getItem('user'));

  const stats = useMemo(() => {
    const totalApproved = expenses
      .filter(e => e.status === 'Approved')
      .reduce((sum, e) => sum + parseFloat(e.orig_amount || 0), 0);
    const leakageCount = expenses.filter(e => e.orig_amount > 1000).length;
    return { totalApproved, leakageCount };
  }, [expenses]);

  const fetchData = useCallback(async () => {
    if (!adminData?.companyId) return;
    try {
      const [teamRes, expenseRes] = await Promise.all([
        axios.get(`http://localhost:5000/api/admin/team/${adminData.companyId}`),
        axios.get(`http://localhost:5000/api/admin/all-expenses/${adminData.companyId}`)
      ]);
      setTeam(teamRes.data);
      setExpenses(expenseRes.data);
    } catch (err) {
      console.error("Fetch Error:", err);
    }
  }, [adminData?.companyId]);

  useEffect(() => {
    if (!adminData) navigate('/login');
    else fetchData();
  }, [fetchData, navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const handleApproveReject = async (expenseId, status) => {
    try {
      await axios.post('http://localhost:5000/api/admin/approve-expense', {
        expenseId, status, adminNote: `Verified by ${adminData.fullName}`
      });
      fetchData();
    } catch (err) {
      alert("Action failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 w-full font-['Inter'] flex flex-col">
      {/* 1. Full-Width Sticky Navbar */}
      <nav className="sticky top-0 z-50 bg-[#002D72] text-white py-3 px-6 md:px-12 flex justify-between items-center shadow-xl">
        <div className="flex items-center gap-4">
          <div className="bg-white/10 p-2 rounded-lg">
            <BuildingLibraryIcon className="w-6 h-6 text-blue-300" />
          </div>
          <div>
            <h1 className="text-lg font-bold leading-tight">Zero-Leak</h1>
            <p className="text-[10px] uppercase tracking-tighter opacity-60">Enterprise Compliance</p>
          </div>
        </div>

        <div className="flex items-center gap-8">
          <div className="hidden lg:flex items-center gap-2 bg-black/20 px-4 py-2 rounded-full border border-white/10">
            <MagnifyingGlassIcon className="w-4 h-4 text-blue-300" />
            <input className="bg-transparent text-xs outline-none w-48 placeholder:text-blue-200" placeholder="Search Transactions..." />
          </div>
          
          <div className="flex items-center gap-4 border-l border-white/20 pl-8">
            <div className="text-right">
              <p className="text-[10px] uppercase font-bold text-blue-300">Authorized Admin</p>
              <p className="text-sm font-semibold">{adminData?.fullName}</p>
            </div>
            <button onClick={handleLogout} className="group flex items-center gap-2 p-2 hover:bg-red-500/20 rounded-lg transition-all">
              <ArrowLeftOnRectangleIcon className="w-5 h-5 text-red-300 group-hover:text-red-400" />
            </button>
          </div>
        </div>
      </nav>

      {/* 2. Main Body (Full Screen Container) */}
      <main className="flex-1 w-full px-6 md:px-12 py-8">
        
        {/* Breadcrumb Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <h2 className="text-3xl font-black text-slate-800 tracking-tight">System Overview</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Real-time Financial Monitoring</p>
            </div>
          </div>
          <button 
             onClick={() => setShowModal(true)}
             className="bg-[#002D72] hover:bg-[#003da1] text-white px-8 py-3 rounded-xl text-sm font-black uppercase tracking-widest transition-all shadow-lg shadow-blue-900/20 active:scale-95"
          >
            Deploy Personnel
          </button>
        </div>

        {/* 3. Stats Strip (Full Width Grid) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard icon={<UsersIcon />} label="Total Personnel" value={team.length} color="blue" />
          <StatCard icon={<CurrencyDollarIcon />} label="Company Capital Approved" value={`$${stats.totalApproved.toLocaleString()}`} color="emerald" />
          <StatCard icon={<ChartBarIcon />} label="Transactions Awaiting Review" value={expenses.filter(e => e.status === 'Pending').length} color="slate" />
          <StatCard icon={<ExclamationTriangleIcon />} label="High-Risk Leakage Events" value={stats.leakageCount} color={stats.leakageCount > 0 ? "red" : "slate"} />
        </div>

        {/* 4. Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Compliance Queue (Takes more space) */}
          <div className="lg:col-span-9">
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden min-h-[500px]">
              <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/50">
                <h3 className="font-black text-xs uppercase tracking-[0.2em] text-slate-500">Transaction Verification Queue</h3>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-[11px] uppercase font-black text-slate-400 bg-[#F1F5F9] border-y border-slate-200">
                      <th className="px-8 py-4">Financial Entity</th>
                      <th className="px-8 py-4">GL Category</th>
                      <th className="px-8 py-4 text-right">Transaction Amount</th>
                      <th className="px-8 py-4">Risk Level</th>
                      <th className="px-8 py-4 text-center">Compliance Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {expenses.filter(e => e.status === 'Pending').map(exp => (
                      <tr key={exp.id} className="hover:bg-blue-50/30 transition-colors">
                        <td className="px-8 py-5">
                          <p className="font-bold text-[#002D72] text-sm">{exp.full_name}</p>
                          <p className="text-[10px] text-slate-400 font-mono">TXNID-{exp.id}</p>
                        </td>
                        <td className="px-8 py-5">
                           <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-full uppercase">{exp.category}</span>
                        </td>
                        <td className="px-8 py-5 text-right font-mono font-black text-slate-800">
                          ${parseFloat(exp.orig_amount).toFixed(2)}
                        </td>
                        <td className="px-8 py-5">
                          {exp.orig_amount > 1000 ? (
                            <span className="inline-flex items-center gap-1.5 text-red-700 text-[10px] font-black bg-red-50 px-3 py-1.5 rounded-lg border border-red-100">
                              <ExclamationTriangleIcon className="w-3 h-3" /> CRITICAL RISK
                            </span>
                          ) : (
                            <span className="text-emerald-700 text-[10px] font-black bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100">SECURE TRANSACTION</span>
                          )}
                        </td>
                        <td className="px-8 py-5">
                          <div className="flex justify-center gap-4">
                            <button onClick={() => handleApproveReject(exp.id, 'Approved')} className="group flex items-center gap-2 text-emerald-600 hover:bg-emerald-50 px-4 py-2 rounded-lg transition-all border border-transparent hover:border-emerald-200">
                               <CheckCircleIcon className="w-5 h-5" />
                               <span className="text-[10px] font-black uppercase">Approve</span>
                            </button>
                            <button onClick={() => handleApproveReject(exp.id, 'Rejected')} className="group flex items-center gap-2 text-red-500 hover:bg-red-50 px-4 py-2 rounded-lg transition-all border border-transparent hover:border-red-200">
                               <XMarkIcon className="w-5 h-5" />
                               <span className="text-[10px] font-black uppercase">Reject</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {expenses.filter(e => e.status === 'Pending').length === 0 && (
                  <div className="p-24 text-center">
                    <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <ShieldCheckIcon className="w-10 h-10 text-slate-300" />
                    </div>
                    <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-xs">Queue Clear / All Funds Secured</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Org Sidebar (Takes less space) */}
          <div className="lg:col-span-3">
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden sticky top-28">
              <div className="p-6 border-b border-slate-100 bg-[#F1F5F9]/30">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Financial Officers</h3>
              </div>
              <div className="p-4 space-y-2">
                {team.map(m => (
                  <div key={m.id} className="flex items-center gap-4 p-4 hover:bg-slate-50 rounded-xl transition-all border border-transparent hover:border-slate-100">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#002D72] flex items-center justify-center font-black text-sm border border-blue-200">
                      {m.full_name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-black text-slate-800">{m.full_name}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">{m.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Modal - Corporate Design */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center z-[60] p-6">
          <div className="max-w-md w-full bg-white rounded-3xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] overflow-hidden">
            <div className="bg-[#002D72] px-8 py-8 text-white">
              <h3 className="font-black text-2xl uppercase tracking-tighter">Personnel Enrollment</h3>
              <p className="text-blue-200 text-xs mt-1">Registering a new financial entity within the organization.</p>
            </div>
            <form onSubmit={async (e) => {
               e.preventDefault();
               const payload = { ...newMember, companyId: adminData.companyId, managerId: null };
               await axios.post('http://localhost:5000/api/admin/add-member', payload);
               setShowModal(false);
               fetchData();
            }} className="p-8 space-y-6">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block">Legal Identity</label>
                <input required className="w-full bg-slate-50 border border-slate-200 p-4 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="Enter full name..." value={newMember.fullName} onChange={e => setNewMember({...newMember, fullName: e.target.value})} />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block">Secure Email</label>
                <input required type="email" className="w-full bg-slate-50 border border-slate-200 p-4 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="name@bank.com" value={newMember.email} onChange={e => setNewMember({...newMember, email: e.target.value})} />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block">Clearance</label>
                    <select className="w-full bg-slate-50 border border-slate-200 p-4 rounded-xl outline-none" value={newMember.role} onChange={e => setNewMember({...newMember, role: e.target.value})}>
                    <option>Employee</option>
                    <option>Manager</option>
                    </select>
                </div>
                <button type="button" onClick={() => setShowModal(false)} className="px-6 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-xl font-bold transition-all">Cancel</button>
              </div>
              <button type="submit" className="w-full bg-[#002D72] hover:bg-[#003da1] text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] transition-all shadow-xl shadow-blue-900/20 active:scale-[0.98]">
                Deploy Account
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const StatCard = ({ icon, label, value, color }) => {
  const colors = {
    blue: "text-blue-600 bg-blue-50 border-blue-100",
    emerald: "text-emerald-600 bg-emerald-50 border-emerald-100",
    red: "text-red-700 bg-red-50 border-red-200 animate-pulse",
    slate: "text-slate-600 bg-slate-50 border-slate-100"
  };
  return (
    <div className="bg-white p-8 rounded-[1.5rem] border border-slate-200 shadow-sm flex flex-col items-center text-center">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 border ${colors[color]}`}>
        {React.cloneElement(icon, { className: "w-6 h-6" })}
      </div>
      <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">{label}</p>
      <p className="text-3xl font-black text-slate-800">{value}</p>
    </div>
  );
};

export default Dashboard;