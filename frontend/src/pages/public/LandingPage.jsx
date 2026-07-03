import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  HiOutlineOfficeBuilding,
  HiOutlineExclamationCircle,
  HiOutlineCalendar,
  HiOutlinePresentationChartLine,
  HiOutlineLightningBolt,
  HiOutlineShieldCheck,
  HiOutlineArrowRight
} from 'react-icons/hi';

export const LandingPage = () => {
  const features = [
    { label: 'Room Management', desc: 'Automated room allocation and status tracking.', icon: HiOutlineOfficeBuilding },
    { label: 'Complaint System', desc: 'Submit and track complaints with real-time status updates.', icon: HiOutlineExclamationCircle },
    { label: 'Mess Menu Details', desc: 'Access weekly/monthly menu schedules and holidays.', icon: HiOutlineCalendar },
    { label: 'Analytics Dashboard', desc: 'Complete statistical charts on occupancy and complaints.', icon: HiOutlinePresentationChartLine },
    { label: 'Real-time Updates', desc: 'Powered by WebSockets for instant notifications.', icon: HiOutlineLightningBolt },
    { label: 'Secure Access', desc: 'Role-based authorization and encrypted passwords.', icon: HiOutlineShieldCheck }
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 font-sans overflow-x-hidden">
      
      {/* 1. Header Navbar */}
      <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="text-xl font-black tracking-wider text-[#b3001e]">
            SmartHostel
          </span>
          <div className="flex gap-4">
            <Link to="/login" className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition duration-200">
              Login
            </Link>
            <Link to="/register" className="px-5 py-2 text-xs font-bold text-white bg-[#b3001e] hover:bg-[#900018] rounded-xl transition duration-200">
              Register
            </Link>
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-12 md:pt-20 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          <div className="space-y-6">


            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-tight"
            >
              Modernizing hostel<br />
              <span className="text-[#b3001e]">
                management operations.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-sm text-slate-500 leading-relaxed max-w-xl"
            >
              A unified campus housing platform providing smart room allocations, digital maintenance tickets, instant student gates-pass verification, and detailed admin statistics.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap gap-4 pt-2"
            >
              <Link to="/login" className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider rounded-xl bg-[#b3001e] text-white hover:bg-[#900018] transition flex items-center gap-2 shadow-lg shadow-[#b3001e]/15">
                Get Started <HiOutlineArrowRight className="h-4 w-4" />
              </Link>
              <a href="#features" className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-350 transition">
                Learn More
              </a>
            </motion.div>
          </div>

          {/* Graphical Mock Illustration */}
          <div className="relative">
            <div className="absolute inset-0 bg-[#fff0eb] rounded-3xl blur-3xl transform rotate-3 scale-95 opacity-50" />
            <div className="relative bg-white border border-slate-200/60 p-6 rounded-3xl shadow-xl space-y-6">
              
              <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                <div>
                  <p className="text-[10px] text-gray-400 font-extrabold uppercase">Live Feed</p>
                  <p className="text-sm font-bold text-gray-800">Recent Activity Log</p>
                </div>
                <span className="px-2.5 py-1 text-[10px] font-bold rounded-lg bg-emerald-100 text-emerald-800">
                  System Normal
                </span>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="p-2 bg-[#fff0eb] text-[#b3001e] rounded-xl">
                    <HiOutlineOfficeBuilding className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-gray-800">Room A101 allocated</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">Assigned to Aarav Sharma</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="p-2 bg-[#fff0eb] text-[#b3001e] rounded-xl">
                    <HiOutlineExclamationCircle className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-gray-800">Complaint #104 status updated</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">Progress marked to: in-progress</p>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* 3. Features Bento Grid */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-20 border-t border-slate-200/50 space-y-16">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-black text-slate-900">
            Smart Features
          </h2>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Everything you need to automate, track, and optimize student housing operations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feat, idx) => (
            <div
              key={idx}
              className="group p-6 bg-white rounded-2xl border border-slate-200/60 hover:border-[#b3001e]/20 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
            >
              <div className="p-3 bg-[#fff0eb] rounded-xl text-[#b3001e] w-fit mb-4 group-hover:scale-105 transition duration-200">
                <feat.icon className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                {feat.label}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {feat.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Footer */}
      <footer className="w-full py-8 border-t border-slate-200/50 text-center text-xs text-slate-400 bg-white">
        <p>&copy; {new Date().getFullYear()} SmartHostel. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;