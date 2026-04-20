import { useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle, Copy, ArrowRight, Server, FileText } from "lucide-react";

export default function Success() {
  const location = useLocation();
  const complaint = location.state?.complaint;

  // If someone navigates here directly without a complaint object, give them a fallback
  if (!complaint) {
    return (
      <div className="flex flex-col items-center justify-center p-20">
        <h2 className="text-xl text-slate-400 mb-4">No recent submission detected.</h2>
        <Link to="/" className="text-[#22C55E] hover:underline">Return Home</Link>
      </div>
    );
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(complaint.id);
    // Realistically you'd want a toast notification here
  };

  return (
    <div className="max-w-3xl mx-auto w-full mt-10">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-[#1E293B] border border-[#22C55E]/30 rounded-2xl shadow-[0_0_40px_rgba(34,197,94,0.1)] p-8 md:p-12 text-center"
      >
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.2 }}
          className="mx-auto w-20 h-20 bg-[#22C55E]/20 rounded-full flex items-center justify-center mb-6"
        >
          <CheckCircle className="text-[#22C55E]" size={40} />
        </motion.div>

        <h1 className="text-3xl font-bold text-white mb-2">Secure Submission Complete</h1>
        <p className="text-slate-400 mb-8 max-w-lg mx-auto">
          Your report has been encrypted and securely logged. Please copy the tracking ID below to follow up on your case.
        </p>

        <div className="bg-[#0B1120] border border-[#334155] rounded-xl p-6 mb-8 text-left">
          <div className="mb-6">
            <span className="text-xs font-bold tracking-wider text-slate-500 uppercase mb-2 block">Case Tracking ID</span>
            <div className="flex items-center justify-between bg-slate-800/80 rounded-lg p-4 border border-slate-700">
              <span className="text-2xl font-mono tracking-wider text-white font-bold">{complaint.id}</span>
              <button onClick={handleCopy} className="p-2 text-slate-400 hover:text-white transition-colors" title="Copy to clipboard">
                <Copy size={20} />
              </button>
            </div>
            <p className="text-xs text-orange-400 mt-2 font-medium">⚠️ Save this ID. You will not be able to recover it later.</p>
          </div>

          <hr className="border-[#334155] mb-6" />

          <div>
             <span className="text-xs font-bold tracking-wider text-slate-500 uppercase mb-3 block">AWS Data Verification</span>
             {complaint.fileUrl ? (
               <div className="flex items-start gap-4 p-4 rounded-lg bg-[#22C55E]/5 border border-[#22C55E]/20">
                  <div className="bg-[#22C55E]/20 p-3 rounded-lg text-[#22C55E]">
                    <Server size={24} />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-sm font-medium text-white mb-1">File Uploaded to S3 Bucket</p>
                    <p className="text-xs text-slate-400 font-mono truncate">{complaint.fileUrl}</p>
                    <a href={complaint.fileUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-[#22C55E] mt-2 font-medium hover:underline">
                      <FileText size={12} /> View Secure Object
                    </a>
                  </div>
               </div>
             ) : (
               <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700 text-sm text-slate-400">
                 No cryptographic evidence was attached to this report.
               </div>
             )}
          </div>
        </div>

        <Link 
          to="/" 
          className="inline-flex items-center gap-2 bg-[#22C55E] hover:bg-[#16a34a] text-black font-bold py-3 px-8 rounded-lg transition-transform hover:-translate-y-0.5"
        >
          Return to Hub <ArrowRight size={18} />
        </Link>
      </motion.div>
    </div>
  );
}
