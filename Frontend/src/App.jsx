import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Report from "./pages/Report";
import Success from "./pages/Success";
import Admin from "./pages/Admin";
import Tracking from "./pages/Tracking";
import { Shield, Bell, User } from "lucide-react";

const NavBar = () => {
  const location = useLocation();

  return (
    <nav className="flex items-center justify-between px-8 py-5 border-b border-[#1E293B] bg-[#0B1120]">
      <Link to="/" className="flex items-center gap-2 text-2xl font-bold tracking-tight">
        <span className="text-[#22C55E]">Safe</span>
        <span className="text-white">Voice</span>
      </Link>
      
      <div className="flex items-center gap-6">
        <Link 
          to="/" 
          className={`text-sm font-medium transition-colors ${location.pathname === '/' ? 'text-[#22C55E] border-b-2 border-[#22C55E] pb-1' : 'text-slate-300 hover:text-white'}`}
        >
          Home
        </Link>
        <Link 
          to="/track" 
          className={`text-sm font-medium transition-colors ${location.pathname === '/track' ? 'text-[#22C55E] border-b-2 border-[#22C55E] pb-1' : 'text-slate-300 hover:text-white'}`}
        >
          Track Complaint
        </Link>
        <Link 
          to="/report" 
          className="bg-[#22C55E] hover:bg-[#16a34a] text-black font-semibold text-sm px-4 py-2 rounded-md transition-colors"
        >
          New Report
        </Link>
        <button className="text-slate-400 hover:text-white transition-colors">
          <Bell size={20} />
        </button>
        <Link to="/admin" className="text-slate-400 hover:text-white transition-colors">
          <User size={20} />
        </Link>
      </div>
    </nav>
  );
};

const Footer = () => (
  <footer className="mt-auto py-8 text-center text-xs text-slate-500 flex flex-col items-center gap-4">
    <p className="font-semibold text-slate-300 text-sm">SafeVoice Security</p>
    <div className="flex gap-6">
      <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
      <a href="#" className="hover:text-white transition-colors">Security Whitepaper</a>
      <a href="#" className="hover:text-white transition-colors">Contact Support</a>
    </div>
    <p>&copy; 2024 SafeVoice Security. All data encrypted via AWS S3.</p>
  </footer>
);

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-[#0B1120] text-slate-200 font-sans">
        <NavBar />
        <main className="flex-grow flex flex-col pt-12 pb-16 px-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/report" element={<Report />} />
            <Route path="/success" element={<Success />} />
            <Route path="/track" element={<Tracking />} />
            <Route path="/track/:id" element={<Tracking />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
