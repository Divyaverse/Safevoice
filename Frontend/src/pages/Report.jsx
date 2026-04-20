import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Lock, AlertCircle, RefreshCw, FileText } from "lucide-react";
import { submitComplaint } from "../api";

export default function Report() {
  const navigate = useNavigate();
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Harassment");
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [file, setFile] = useState(null);
  
  // Loading states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const categories = ["Harassment", "Academic", "Infrastructure", "Financial", "Other"];

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
        setFile(e.target.files[0]);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description.trim()) {
        setError("Complaint description is required");
        return;
    }

    setIsSubmitting(true);
    setError(null);

    const formData = new FormData();
    formData.append("description", description);
    formData.append("category", category);
    formData.append("isAnonymous", isAnonymous);
    if (file) {
      formData.append("file", file);
    }

    try {
      const result = await submitComplaint(formData);
      
      if (result.success) {
        // Redirect to success page, passing the response data
        navigate("/success", { state: { complaint: result.complaint || result.data } });
      } else {
        setError(result.message || "Failed to submit complaint.");
        setIsSubmitting(false);
      }
    } catch (err) {
      console.error(err);
      setError("Server connection failed. Please ensure backend is running.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto w-full flex flex-col items-center">
      {/* Animated Header explaining flow */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-10 w-full"
      >
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">
          Secure Anonymous Reporting
        </h1>
        <div className="flex items-center justify-center gap-3 text-slate-400 text-sm mb-6">
          <div className="flex items-center gap-1 bg-slate-800/50 px-3 py-1.5 rounded-full border border-slate-700">
            <span className="text-white font-medium">Frontend</span>
          </div>
          <motion.div 
             animate={{ x: [0, 5, 0] }} 
             transition={{ repeat: Infinity, duration: 2 }}
          >
             →
          </motion.div>
          <div className="flex items-center gap-1 bg-slate-800/50 px-3 py-1.5 rounded-full border border-slate-700">
            <span className="text-[#22C55E] font-medium">Backend</span>
          </div>
          <motion.div 
             animate={{ x: [0, 5, 0] }} 
             transition={{ repeat: Infinity, duration: 2 }}
          >
             →
          </motion.div>
          <div className="flex items-center gap-1 bg-slate-800/50 px-3 py-1.5 rounded-full border border-slate-700">
            <span className="text-orange-400 font-medium">AWS S3 Vault</span>
          </div>
        </div>
        <p className="text-slate-400 max-w-xl mx-auto leading-relaxed">
          Your identity is cryptographically stripped before reaching our databases. 
          All attachments are uploaded directly to an isolated AWS S3 environment.
        </p>
      </motion.div>

      {/* Main Form */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="w-full max-w-2xl bg-[#1E293B] border border-[#334155] rounded-xl shadow-2xl overflow-hidden relative"
      >
        
        {/* Loading Overlay */}
        <AnimatePresence>
            {isSubmitting && (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-[#0B1120]/90 backdrop-blur-sm z-50 flex flex-col items-center justify-center"
                >
                    <RefreshCw className="text-[#22C55E] animate-spin mb-4" size={48} />
                    <h3 className="text-xl font-bold text-white mb-2">Establishing Secure Connection</h3>
                    <p className="text-slate-400 text-sm animate-pulse">Uploading to AWS S3...</p>
                </motion.div>
            )}
        </AnimatePresence>

        <div className="p-8">
            {error && (
                <div className="mb-6 bg-red-500/10 border border-red-500/50 text-red-500 rounded-lg p-4 flex items-start gap-3">
                    <AlertCircle className="mt-0.5 shrink-0" size={18} />
                    <p className="text-sm font-medium">{error}</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Category Selection */}
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Issue Category</label>
                    <div className="relative">
                        <select 
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full bg-[#0B1120] border border-[#334155] text-white rounded-lg px-4 py-3 appearance-none focus:outline-none focus:border-[#22C55E] focus:ring-1 focus:ring-[#22C55E] transition-all"
                        >
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                            <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1 1.5L6 6.5L11 1.5" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Complaint Textarea */}
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Detailed Description</label>
                    <textarea 
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Please describe the incident in detail... Do not include personal identifiable information."
                        className="w-full bg-[#0B1120] border border-[#334155] text-white rounded-lg px-4 py-3 h-40 resize-none focus:outline-none focus:border-[#22C55E] focus:ring-1 focus:ring-[#22C55E] transition-all placeholder:text-slate-600"
                    ></textarea>
                </div>

                {/* Drag and Drop File Upload */}
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Evidence Attachment <span className="text-slate-500 font-normal">(Optional)</span></label>
                    <div 
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        className="border-2 border-dashed border-[#334155] hover:border-[#22C55E] bg-[#0B1120]/50 rounded-xl p-8 transition-colors flex flex-col items-center justify-center cursor-pointer group relative"
                    >
                        <input 
                            type="file" 
                            id="file-upload" 
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                            onChange={handleFileChange}
                            accept="image/*,.pdf"
                        />
                        {file ? (
                             <div className="flex flex-col items-center text-[#22C55E]">
                                <FileText size={32} className="mb-2" />
                                <p className="text-sm font-semibold truncate max-w-xs">{file.name}</p>
                                <p className="text-xs text-slate-500 mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                             </div>
                        ) : (
                            <>
                                <div className="bg-slate-800 rounded-full p-4 mb-3 group-hover:bg-[#22C55E]/20 group-hover:text-[#22C55E] transition-colors text-slate-400">
                                    <Upload size={24} />
                                </div>
                                <p className="text-sm font-medium text-white mb-1">Click to upload or drag & drop</p>
                                <p className="text-xs text-slate-500">SVG, PNG, JPG or PDF (MAX. 10MB)</p>
                            </>
                        )}
                    </div>
                </div>

                <hr className="border-[#334155]" />

                {/* Anonymity Toggle and Submit */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-2">
                    <label className="flex items-center gap-3 cursor-pointer group">
                        <div className="relative">
                            <input 
                                type="checkbox" 
                                className="sr-only" 
                                checked={isAnonymous} 
                                onChange={(e) => setIsAnonymous(e.target.checked)} 
                            />
                            <div className={`block w-14 h-8 rounded-full transition-colors ${isAnonymous ? 'bg-[#22C55E]' : 'bg-slate-700'}`}></div>
                            <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${isAnonymous ? 'translate-x-6' : ''}`}></div>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm justify-center flex items-center font-bold text-white gap-1"><Lock size={14} className={isAnonymous ? "text-[#22C55E]" : "text-slate-500"} /> Submit Anonymously</span>
                            <span className="text-xs text-slate-500">Identity will be scrubbed</span>
                        </div>
                    </label>

                    <button 
                        type="submit"
                        className="w-full sm:w-auto bg-[#22C55E] hover:bg-[#16a34a] text-black font-bold py-3 px-8 rounded-lg shadow-[0_0_15px_rgba(34,197,94,0.3)] hover:shadow-[0_0_25px_rgba(34,197,94,0.5)] transition-all transform hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0B1120] focus:ring-[#22C55E]"
                    >
                        Submit Report
                    </button>
                </div>
            </form>
        </div>
      </motion.div>
    </div>
  );
}
