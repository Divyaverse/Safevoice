import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Search, Loader2, ArrowRightCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getComplaintById } from "../api";

export default function Tracking() {
  const { id: routeId } = useParams();
  const [trackingId, setTrackingId] = useState(routeId || "");
  const [complaint, setComplaint] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchComplaint = async (searchId) => {
    if (!searchId) return;
    setIsLoading(true);
    setError(null);
    setComplaint(null);
    try {
      const res = await getComplaintById(searchId);
      if (res.success) {
        setComplaint(res.data);
      } else {
        setError(res.message || "Complaint not found.");
      }
    } catch (err) {
      if (err.response?.status === 404) {
        setError("Invalid Tracking ID. Verification failed.");
      } else {
        setError("Network error. Please try again later.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (routeId) {
      fetchComplaint(routeId);
    }
  }, [routeId]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchComplaint(trackingId.trim());
  };

  const currentStep = () => {
    if (!complaint) return -1;
    switch(complaint.status) {
      case "Pending": return 1;
      case "In Progress": return 2;
      case "Resolved": return 3;
      default: return 0;
    }
  };

  return (
    <div className="max-w-3xl mx-auto w-full pt-10">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-extrabold mb-4">Track Your Report</h1>
        <p className="text-slate-400 max-w-lg mx-auto text-sm">
          Enter your encrypted 14-character SV-Tracking code below to check the real-time status of your submission.
        </p>
      </div>

      <form onSubmit={handleSearch} className="mb-12 relative max-w-xl mx-auto">
        <input 
          type="text" 
          value={trackingId}
          onChange={(e) => setTrackingId(e.target.value)}
          placeholder="e.g. SV-A1B2C3D4"
          className="w-full font-mono text-center uppercase tracking-widest text-lg bg-[#1E293B] border-2 border-[#334155] rounded-xl py-4 pl-6 pr-16 focus:outline-none focus:border-[#22C55E] placeholder:text-slate-600 focus:shadow-[0_0_20px_rgba(34,197,94,0.15)] transition-all"
        />
        <button 
          type="submit" 
          disabled={!trackingId || isLoading}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-[#0B1120] text-[#22C55E] rounded-lg hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? <Loader2 size={24} className="animate-spin" /> : <Search size={24} />}
        </button>
      </form>

      <AnimatePresence mode="wait">
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-red-500/10 border border-red-500/30 text-red-500 p-4 rounded-xl text-center font-medium"
          >
            {error}
          </motion.div>
        )}

        {complaint && !isLoading && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-[#1E293B] border border-[#334155] rounded-2xl p-8 shadow-2xl relative overflow-hidden"
          >
            {complaint.status === "Resolved" && (
                <div className="absolute -right-12 -top-12 opacity-5 pointer-events-none">
                   <div className="w-64 h-64 border-[30px] border-[#22C55E] rounded-full flex items-center justify-center">
                   </div>
                </div>
            )}

            <div className="flex justify-between items-center mb-8 border-b border-[#334155] pb-6">
              <div>
                <p className="text-sm font-bold text-slate-500 tracking-wider mb-1">TRACKING ID</p>
                <p className="font-mono text-2xl font-bold text-[#f8fafc]">{complaint.id}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-slate-500 tracking-wider mb-1">FILED ON</p>
                <p className="font-mono text-slate-300">{new Date(complaint.createdAt).toLocaleDateString()}</p>
              </div>
            </div>

            {/* Progress Stepper */}
            <div className="relative mb-10 pt-4">
               {/* Line Behind */}
               <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-800 -translate-y-1/2 rounded-full z-0"></div>
               {/* Progress Line */}
               <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${(currentStep() - 1) * 50}%` }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="absolute top-1/2 left-0 h-1 bg-[#22C55E] -translate-y-1/2 rounded-full z-0 shadow-[0_0_10px_#22C55E]"
               ></motion.div>
               
               <div className="relative z-10 flex justify-between">
                  {["Received", "In Progress", "Resolved"].map((step, idx) => {
                    const stepNum = idx + 1;
                    const isActive = currentStep() >= stepNum;
                    const isFocus = currentStep() === stepNum;
                    return (
                        <div key={idx} className="flex flex-col items-center gap-3">
                           <motion.div 
                              initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3 + (idx * 0.1) }}
                              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-all duration-500 ${isActive ? 'bg-[#22C55E] border-[#22C55E] text-black shadow-[0_0_15px_rgba(34,197,94,0.5)]' : 'bg-slate-800 border-slate-600 text-slate-500'}`}
                           >
                              {isActive ? "✓" : stepNum}
                           </motion.div>
                           <p className={`text-xs font-bold uppercase tracking-wider ${isFocus ? 'text-[#22C55E]' : isActive ? 'text-white' : 'text-slate-500'}`}>
                             {step}
                           </p>
                        </div>
                    )
                  })}
               </div>
            </div>

            <div className="bg-[#0B1120] rounded-xl p-5 border border-[#334155]">
               <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Snapshot Details</h3>
               <p className="text-slate-200 leading-relaxed italic border-l-2 border-slate-700 pl-4 py-1 mb-4">
                 "{complaint.description}"
               </p>
               <div className="flex gap-4">
                  <span className="px-3 py-1 bg-slate-800 rounded-md text-xs font-medium text-slate-300">Category: {complaint.category}</span>
                  {complaint.fileUrl && (
                     <span className="px-3 py-1 bg-blue-500/10 border border-blue-500/30 rounded-md text-xs font-medium text-blue-400">
                        Contains Encrypted Media
                     </span>
                  )}
               </div>
            </div>
            
            {complaint.status === "In Progress" && (
                <div className="mt-6 flex items-start gap-3 bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 text-blue-400">
                    <ArrowRightCircle size={20} className="shrink-0 mt-0.5" />
                    <p className="text-sm">Your complaint has been assigned to an administrator and is actively being reviewed. Check back soon for resolution.</p>
                </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
