import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Shield, ArrowRight, Activity } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center flex-grow py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-3xl text-center space-y-8"
      >
        <div className="flex justify-center mb-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className="w-24 h-24 bg-[#22C55E]/10 rounded-full flex items-center justify-center border-2 border-[#22C55E]/30"
          >
            <Shield className="text-[#22C55E] drop-shadow-lg" size={50} />
          </motion.div>
        </div>

        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-white drop-shadow-md">
          Welcome to <span className="text-[#22C55E]">SafeVoice</span>
        </h1>
        
        <p className="text-xl text-slate-400 leading-relaxed font-light">
          A truly anonymous, end-to-end encrypted incident reporting platform. 
          Your voice matters, and your identity is fundamentally 
          protected from end-to-end.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-10">
          <Link to="/report">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 bg-[#22C55E] hover:bg-[#16a34a] text-black font-bold py-4 px-8 rounded-xl shadow-[0_0_20px_rgba(34,197,94,0.3)] transition-colors"
            >
              Submit a New Report <ArrowRight size={20} />
            </motion.button>
          </Link>
          
          <Link to="/track">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 bg-[#1E293B] hover:bg-slate-800 text-white font-semibold py-4 px-8 rounded-xl border border-[#334155] hover:border-slate-500 transition-colors shadow-lg"
            >
              <Activity size={20} className="text-[#22C55E]" /> Track Existing Case
            </motion.button>
          </Link>
        </div>
      </motion.div>

      {/* Decorative background elements */}
      <div className="fixed top-20 left-10 w-72 h-72 bg-[#22C55E] rounded-full mix-blend-multiply filter blur-[128px] opacity-10 pointer-events-none"></div>
      <div className="fixed bottom-20 right-10 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-10 pointer-events-none"></div>
    </div>
  );
}
