import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Clock, CheckCircle2, FileText, Search, ExternalLink, Settings, ShieldAlert } from "lucide-react";
import { getAnalytics, getComplaints, updateComplaintStatus } from "../api";

export default function Admin() {
  const [complaints, setComplaints] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, resolved: 0, withAttachments: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filter, setFilter] = useState("All");

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [analyticsRes, complaintsRes] = await Promise.all([
        getAnalytics(),
        getComplaints()
      ]);
      
      if (analyticsRes.success) setStats(analyticsRes.data);
      if (complaintsRes.success) setComplaints(complaintsRes.data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch admin data. Is the backend running?");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await updateComplaintStatus(id, newStatus);
      if (res.success) {
        // Optimistic UI update
        setComplaints(prev => prev.map(c => c.id === id ? { ...c, status: newStatus } : c));
        // Refresh analytics stats silently
        const analyticsRes = await getAnalytics();
        if (analyticsRes.success) setStats(analyticsRes.data);
      }
    } catch (err) {
      alert("Failed to update status");
    }
  };

  const filteredComplaints = complaints.filter(c => {
    if (filter === "All") return true;
    return c.status === filter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending": return "text-orange-400 bg-orange-400/10 border-orange-400/20";
      case "Resolved": return "text-[#22C55E] bg-[#22C55E]/10 border-[#22C55E]/20";
      case "In Progress": return "text-blue-400 bg-blue-400/10 border-blue-400/20";
      default: return "text-slate-400 bg-slate-800 border-slate-700";
    }
  };

  if (isLoading) return <div className="flex justify-center p-20"><div className="animate-spin text-[#22C55E]"><Settings size={32} /></div></div>;
  if (error) return <div className="text-red-500 text-center p-20">{error}</div>;

  return (
    <div className="max-w-6xl mx-auto w-full">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
             <ShieldAlert className="text-[#22C55E]" /> Admin Dashboard
          </h1>
          <p className="text-slate-400 mt-1">Management and Oversight</p>
        </div>
        <button onClick={fetchData} className="px-4 py-2 bg-slate-800 text-sm font-medium rounded-lg hover:bg-slate-700 border border-slate-700 transition">
          Refresh Systems
        </button>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <div className="bg-[#1E293B] border border-[#334155] rounded-xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-4">
             <span className="text-slate-400 font-medium">Total Signals</span>
             <AlertTriangle className="text-slate-500" size={20} />
          </div>
          <p className="text-4xl font-bold text-white">{stats.total}</p>
        </div>
        
        <div className="bg-[#1E293B] border border-orange-500/30 rounded-xl p-5 shadow-[0_0_15px_rgba(249,115,22,0.05)]">
          <div className="flex items-center justify-between mb-4">
             <span className="text-orange-400 font-medium">Active (Pending)</span>
             <Clock className="text-orange-400" size={20} />
          </div>
          <p className="text-4xl font-bold text-orange-400">{stats.pending}</p>
        </div>

        <div className="bg-[#1E293B] border border-[#22C55E]/30 rounded-xl p-5 shadow-[0_0_15px_rgba(34,197,94,0.05)]">
          <div className="flex items-center justify-between mb-4">
             <span className="text-[#22C55E] font-medium">Clearance Verified</span>
             <CheckCircle2 className="text-[#22C55E]" size={20} />
          </div>
          <p className="text-4xl font-bold text-[#22C55E]">{stats.resolved}</p>
        </div>

        <div className="bg-[#1E293B] border border-blue-500/30 rounded-xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-4">
             <span className="text-blue-400 font-medium">S3 Evidence Files</span>
             <FileText className="text-blue-400" size={20} />
          </div>
          <p className="text-4xl font-bold text-blue-400">{stats.withAttachments}</p>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-[#1E293B] border border-[#334155] rounded-xl shadow-xl overflow-hidden">
        <div className="p-5 border-b border-[#334155] flex flex-wrap items-center justify-between gap-4 bg-slate-800/50">
           <div className="relative">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
             <input 
                type="text" 
                placeholder="Search Database..." 
                className="pl-10 pr-4 py-2 bg-[#0B1120] border border-[#334155] rounded-lg text-sm text-white focus:border-[#22C55E] focus:outline-none w-64"
             />
           </div>
           
           <div className="flex gap-2">
             {["All", "Pending", "In Progress", "Resolved"].map(f => (
               <button 
                 key={f}
                 onClick={() => setFilter(f)}
                 className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors border ${filter === f ? 'bg-[#22C55E] text-black border-[#22C55E]' : 'bg-transparent text-slate-400 border-slate-700 hover:text-white hover:border-slate-500'}`}
               >
                 {f}
               </button>
             ))}
           </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#0B1120]/50 text-xs uppercase tracking-wider text-slate-500 border-b border-[#334155]">
                <th className="p-4 font-semibold">ID Code</th>
                <th className="p-4 font-semibold">Details</th>
                <th className="p-4 font-semibold">Category</th>
                <th className="p-4 font-semibold">Evidence</th>
                <th className="p-4 font-semibold text-center">Status Control</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#334155]">
              {filteredComplaints.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-slate-500">No records found.</td>
                </tr>
              ) : (
                filteredComplaints.map(complaint => (
                  <motion.tr 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    key={complaint.id} 
                    className="hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="p-4">
                      <span className="font-mono text-sm font-bold text-slate-300">{complaint.id}</span>
                    </td>
                    <td className="p-4">
                      <p className="text-sm line-clamp-2 max-w-sm text-slate-300" title={complaint.description}>
                        {complaint.description}
                      </p>
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                        {complaint.category}
                      </span>
                    </td>
                    <td className="p-4">
                      {complaint.fileUrl ? (
                         <a href={complaint.fileUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs text-blue-400 hover:underline">
                            <ExternalLink size={14} /> View Media
                         </a>
                      ) : (
                         <span className="text-xs text-slate-600 font-medium">NO_DATA</span>
                      )}
                    </td>
                    <td className="p-4 align-middle">
                      <div className="flex justify-center">
                        <select 
                          value={complaint.status}
                          onChange={(e) => handleStatusChange(complaint.id, e.target.value)}
                          className={`text-xs font-bold px-3 py-1.5 rounded-full appearance-none text-center cursor-pointer border ${getStatusColor(complaint.status)}`}
                        >
                          <option value="Pending" className="bg-[#0B1120] text-white">Pending</option>
                          <option value="In Progress" className="bg-[#0B1120] text-white">In Progress</option>
                          <option value="Resolved" className="bg-[#0B1120] text-white">Resolved</option>
                        </select>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
