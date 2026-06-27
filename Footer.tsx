import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Search, Filter, Calendar, TrendingUp, User, Phone, Mail, Globe, 
  BookOpen, MessageSquare, CheckCircle2, Trash2, Copy, ExternalLink, 
  Bell, Clock, Settings, LogOut, ChevronRight, X, Check, Lock, 
  ShieldCheck, HelpCircle, LayoutDashboard, Database, RefreshCw, Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  subscribeToEnquiries, 
  updateEnquiryStatus, 
  deleteEnquiry, 
  updateAdminPassword, 
  Enquiry 
} from '../lib/enquiryService';

interface AdminDashboardProps {
  onLogout: () => void;
  navigate: (path: string) => void;
}

export default function AdminDashboard({ onLogout, navigate }: AdminDashboardProps) {
  // Navigation inside the dashboard
  const [activeTab, setActiveTab] = useState<'home' | 'enquiries' | 'settings'>('home');
  
  // Real-time inquiries list
  const [inquiries, setInquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All'); // 'All', 'New', 'Contacted'
  const [dateFilter, setDateFilter] = useState<string>('All'); // 'All', 'Today', 'Week', 'Month'
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');

  // Selected enquiry for the side panel
  const [selectedInquiry, setSelectedInquiry] = useState<Enquiry | null>(null);

  // Notification Toast states
  const [toasts, setToasts] = useState<{ id: string; message: string; subMessage?: string }[]>([]);
  const [hasNewBadge, setHasNewBadge] = useState(false);

  // Password Settings states
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordStatus, setPasswordStatus] = useState<{ type: 'success' | 'error' | ''; text: string }>({ type: '', text: '' });
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Keep track of previously loaded enquiry IDs to identify newly arriving leads in real-time
  const knownIdsRef = useRef<Set<string>>(new Set());
  const isFirstLoadRef = useRef(true);

  // Counter states for animations
  const [animatedStats, setAnimatedStats] = useState({
    total: 0,
    newCount: 0,
    contacted: 0,
    today: 0
  });

  // Subscribe to real-time updates
  useEffect(() => {
    const unsubscribe = subscribeToEnquiries((allInquiries) => {
      setInquiries(allInquiries);
      setLoading(false);

      // Check if there are brand-new enquiries since we connected
      if (!isFirstLoadRef.current) {
        const newlyAdded = allInquiries.filter(inq => !knownIdsRef.current.has(inq.id));
        if (newlyAdded.length > 0) {
          newlyAdded.forEach(inq => {
            // Push toast notification
            const toastId = `toast_${Date.now()}_${Math.random()}`;
            setToasts(prev => [...prev, {
              id: toastId,
              message: "New enquiry received!",
              subMessage: `${inq.name} - ${inq.program}`
            }]);
            
            // Set notification badge
            setHasNewBadge(true);

            // Auto dismiss toast after 5 seconds
            setTimeout(() => {
              setToasts(prev => prev.filter(t => t.id !== toastId));
            }, 5000);
          });
        }
      }

      // Update known IDs list
      const currentIds = new Set(allInquiries.map(inq => inq.id));
      knownIdsRef.current = currentIds;
      isFirstLoadRef.current = false;
    }, (error) => {
      console.error("Firestore real-time error:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Compute stats based on current database
  const stats = useMemo(() => {
    const total = inquiries.length;
    const newCount = inquiries.filter(i => i.status === 'New').length;
    const contacted = inquiries.filter(i => i.status === 'Contacted').length;
    
    const todayStr = new Date().toISOString().split('T')[0];
    const today = inquiries.filter(i => {
      const inqDate = new Date(i.date).toISOString().split('T')[0];
      return inqDate === todayStr;
    }).length;

    return { total, newCount, contacted, today };
  }, [inquiries]);

  // Handle stats change to trigger smooth mock counters
  useEffect(() => {
    if (loading) return;
    
    const duration = 800; // ms
    const steps = 20;
    const intervalTime = duration / steps;
    
    let currentStep = 0;
    const startStats = { ...animatedStats };
    
    const timer = setInterval(() => {
      currentStep++;
      const ratio = currentStep / steps;
      
      setAnimatedStats({
        total: Math.round(startStats.total + (stats.total - startStats.total) * ratio),
        newCount: Math.round(startStats.newCount + (stats.newCount - startStats.newCount) * ratio),
        contacted: Math.round(startStats.contacted + (stats.contacted - startStats.contacted) * ratio),
        today: Math.round(startStats.today + (stats.today - startStats.today) * ratio)
      });
      
      if (currentStep >= steps) {
        clearInterval(timer);
        setAnimatedStats(stats);
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, [stats, loading]);

  // Filter and Search calculations
  const filteredInquiries = useMemo(() => {
    let result = [...inquiries];

    // Search query
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(i => 
        i.name.toLowerCase().includes(q) || 
        (i.phone && i.phone.includes(q)) || 
        (i.email && i.email.toLowerCase().includes(q))
      );
    }

    // Status filter
    if (statusFilter !== 'All') {
      result = result.filter(i => i.status === statusFilter);
    }

    // Date filter
    if (dateFilter !== 'All') {
      const now = new Date();
      result = result.filter(i => {
        const inqDate = new Date(i.date);
        const diffMs = now.getTime() - inqDate.getTime();
        
        if (dateFilter === 'Today') {
          return inqDate.toDateString() === now.toDateString();
        } else if (dateFilter === 'Week') {
          const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
          return diffMs <= sevenDaysMs;
        } else if (dateFilter === 'Month') {
          const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000;
          return diffMs <= thirtyDaysMs;
        }
        return true;
      });
    }

    // Sorting
    result.sort((a, b) => {
      const timeA = new Date(a.date).getTime();
      const timeB = new Date(b.date).getTime();
      return sortBy === 'newest' ? timeB - timeA : timeA - timeB;
    });

    return result;
  }, [inquiries, searchQuery, statusFilter, dateFilter, sortBy]);

  // Actions
  const handleMarkAsContacted = async (inq: Enquiry) => {
    const nextStatus = inq.status === 'New' ? 'Contacted' : 'New';
    await updateEnquiryStatus(inq.id, nextStatus);
    
    // Update currently viewed item if it's selected
    if (selectedInquiry && selectedInquiry.id === inq.id) {
      setSelectedInquiry(prev => prev ? { ...prev, status: nextStatus } : null);
    }
  };

  const handleDeleteEnquiry = async (id: string) => {
    if (window.confirm("Are you absolutely sure you want to delete this registration permanently? This action is irreversible.")) {
      await deleteEnquiry(id);
      if (selectedInquiry?.id === id) {
        setSelectedInquiry(null);
      }
    }
  };

  const handleCopyDetails = (inq: Enquiry) => {
    const details = `Assam2Abroad Enquiry:
Full Name: ${inq.name}
Phone: ${inq.phone}
Email: ${inq.email || 'N/A'}
Country Goal: ${inq.country || 'N/A'}
Interested Program: ${inq.program}
Source Form: ${inq.source}
Date submitted: ${new Date(inq.date).toLocaleString()}
Status: ${inq.status}`;
    
    navigator.clipboard.writeText(details);
    
    // Add copies alert as small toast
    const toastId = `copy_${Date.now()}`;
    setToasts(prev => [...prev, { id: toastId, message: "Enquiry details copied to clipboard!" }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== toastId));
    }, 3000);
  };

  const handleOpenWhatsApp = (inq: Enquiry) => {
    // Format mobile, stripping non-numeric characters except maybe prefix
    let cleanPhone = inq.phone.replace(/[^0-9]/g, '');
    if (cleanPhone.length === 10) {
      cleanPhone = `91${cleanPhone}`; // Default Indian prefix
    }
    
    const msg = `Hello ${inq.name},

Thank you for contacting Assam2Abroad.

We received your enquiry regarding ${inq.program}.

Our counsellor is ready to assist you.`;

    const encodedMsg = encodeURIComponent(msg);
    const url = `https://wa.me/${cleanPhone}?text=${encodedMsg}`;
    window.open(url, '_blank');
  };

  const handleSendEmail = (inq: Enquiry) => {
    if (!inq.email) {
      alert("No email address provided for this student.");
      return;
    }
    const subject = encodeURIComponent("Assam2Abroad Admissions Consultation");
    const body = encodeURIComponent(`Hello ${inq.name},

Thank you for reaching out to Assam2Abroad regarding our ${inq.program} language program.

We would love to discuss your career goals in Germany. Please reply with your convenient timing for a brief counseling call.

Best regards,
Admissions Team
Assam2Abroad`);
    
    window.location.href = `mailto:${inq.email}?subject=${subject}&body=${body}`;
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordStatus({ type: '', text: '' });

    if (!newPassword) {
      setPasswordStatus({ type: 'error', text: 'Please enter a valid password.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordStatus({ type: 'error', text: 'Confirmation password does not match.' });
      return;
    }

    setPasswordLoading(true);
    try {
      await updateAdminPassword(newPassword);
      setPasswordLoading(false);
      setPasswordStatus({ type: 'success', text: 'Administrative password updated successfully in the cloud.' });
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setPasswordLoading(false);
      setPasswordStatus({ type: 'error', text: 'Failed to write password. Please try again.' });
    }
  };

  const handleClearNotifications = () => {
    setHasNewBadge(false);
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col md:flex-row font-sans relative overflow-x-hidden select-none">
      
      {/* Toast Manager Overlay */}
      <div className="fixed top-6 right-6 z-50 space-y-3 pointer-events-none max-w-sm w-full">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              className="bg-neutral-900 border border-neutral-800 text-white p-4 shadow-2xl rounded-2xl flex items-start space-x-3 pointer-events-auto"
            >
              <div className="p-1.5 bg-neutral-800 rounded-lg text-german-gold shrink-0">
                <Bell className="w-4 h-4 animate-bounce" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-xs font-bold font-sans">{toast.message}</p>
                {toast.subMessage && (
                  <p className="text-[11px] text-neutral-400 mt-0.5 leading-relaxed font-light">{toast.subMessage}</p>
                )}
              </div>
              <button 
                onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
                className="text-neutral-400 hover:text-white transition-colors p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* LEFT SIDEBAR (Premium Dark Sidebar) */}
      <aside className="w-full md:w-64 bg-neutral-950 border-r border-neutral-900 flex flex-col justify-between shrink-0">
        <div className="flex flex-col">
          {/* Logo Heading Header */}
          <div className="p-6 border-b border-neutral-900 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="w-8 h-8 bg-neutral-900 text-german-gold font-bold font-display text-sm flex items-center justify-center rounded-xl border border-neutral-800 shadow-inner">
                A2A
              </span>
              <div className="flex flex-col text-left">
                <span className="text-sm font-extrabold text-white tracking-wide uppercase font-display leading-none">
                  Assam2Abroad
                </span>
                <span className="text-[9px] text-neutral-500 font-mono tracking-widest uppercase mt-1 leading-none">
                  CRM PANEL
                </span>
              </div>
            </div>
            {hasNewBadge && (
              <span className="w-2.5 h-2.5 bg-german-red rounded-full ring-4 ring-german-red/20 animate-pulse" />
            )}
          </div>

          {/* Nav Items */}
          <nav className="p-4 space-y-1.5 flex-1">
            <button
              onClick={() => { setActiveTab('home'); handleClearNotifications(); }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                activeTab === 'home' 
                  ? 'bg-neutral-900 text-white shadow-sm border border-neutral-800' 
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/30'
              }`}
            >
              <LayoutDashboard className={`w-4 h-4 ${activeTab === 'home' ? 'text-german-gold' : 'text-neutral-500'}`} />
              <span>Dashboard Home</span>
            </button>

            <button
              onClick={() => { setActiveTab('enquiries'); handleClearNotifications(); }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                activeTab === 'enquiries' 
                  ? 'bg-neutral-900 text-white shadow-sm border border-neutral-800' 
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/30'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Database className={`w-4 h-4 ${activeTab === 'enquiries' ? 'text-german-gold' : 'text-neutral-500'}`} />
                <span>Enquiries</span>
              </div>
              {stats.newCount > 0 && (
                <span className="bg-german-red text-white text-[9px] font-bold px-2 py-0.5 rounded-full font-mono">
                  {stats.newCount}
                </span>
              )}
            </button>

            <button
              onClick={() => { setActiveTab('settings'); handleClearNotifications(); }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                activeTab === 'settings' 
                  ? 'bg-neutral-900 text-white shadow-sm border border-neutral-800' 
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/30'
              }`}
            >
              <Settings className={`w-4 h-4 ${activeTab === 'settings' ? 'text-german-gold' : 'text-neutral-500'}`} />
              <span>Security</span>
            </button>
          </nav>
        </div>

        {/* Footer Admin Account */}
        <div className="p-4 border-t border-neutral-900/60 bg-neutral-950/40">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 bg-neutral-900 text-neutral-300 font-semibold rounded-xl flex items-center justify-center border border-neutral-800 text-xs uppercase">
                AD
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs font-bold text-white font-sans leading-none">Institute Owner</span>
                <span className="text-[10px] text-neutral-500 mt-1 truncate max-w-[110px] font-light">admin@assam2abroad.com</span>
              </div>
            </div>
            
            <button
              onClick={() => {
                localStorage.removeItem('eg_admin_session');
                sessionStorage.removeItem('eg_admin_session');
                onLogout();
              }}
              className="p-2 text-neutral-500 hover:text-red-400 hover:bg-neutral-900/40 rounded-lg transition-all cursor-pointer"
              title="Logout Securely"
            >
              <LogOut className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* CONTENT AREA (Light, high contrast, clean dashboard screens) */}
      <main className="flex-1 min-w-0 bg-neutral-50 flex flex-col">
        
        {/* Top bar */}
        <header className="h-16 border-b border-neutral-200/60 bg-white px-6 sm:px-8 flex items-center justify-between z-10 shrink-0">
          <div className="flex items-center space-x-3 text-left">
            <h1 className="text-base sm:text-lg font-bold text-neutral-950 font-display">
              {activeTab === 'home' && 'Admissions Intelligence'}
              {activeTab === 'enquiries' && 'Student Enquiry Manager'}
              {activeTab === 'settings' && 'Security Settings'}
            </h1>
            <span className="text-neutral-300">/</span>
            <span className="text-xs text-neutral-500 font-mono tracking-wide uppercase">
              {loading ? 'Synchronizing...' : 'Live Synced'}
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-2 text-xs text-neutral-500 bg-neutral-100 border border-neutral-200/50 px-3 py-1.5 rounded-lg font-mono">
              <Clock className="w-3.5 h-3.5 text-neutral-400" />
              <span>CRM Time (UTC)</span>
            </div>
            
            <button
              onClick={() => {
                setLoading(true);
                setTimeout(() => setLoading(false), 500);
              }}
              className="p-2 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer"
              title="Sync Database"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </header>

        {/* Screen Content Wrapper */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8">
          
          {loading ? (
            <div className="h-64 flex flex-col items-center justify-center space-y-4">
              <Loader2 className="w-10 h-10 animate-spin text-neutral-900 stroke-[1.5]" />
              <p className="text-xs text-neutral-500 font-mono uppercase tracking-widest">
                Fetching Student Dossiers...
              </p>
            </div>
          ) : (
            <>
              {/* TAB 1: DASHBOARD HOME */}
              {activeTab === 'home' && (
                <div className="space-y-8 animate-fade-in text-left">
                  {/* STATISTICS GRID */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                    {/* Stat card 1 */}
                    <div className="bg-white border border-neutral-200 p-5 rounded-2xl shadow-xs relative overflow-hidden flex flex-col justify-between">
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-bold uppercase text-neutral-400 tracking-wider font-mono">
                          Total Enquiries
                        </span>
                        <h4 className="text-2xl sm:text-3xl font-extrabold text-neutral-950 font-mono">
                          {animatedStats.total}
                        </h4>
                      </div>
                      <div className="flex items-center space-x-1 mt-3 pt-3 border-t border-neutral-100 text-[10px] font-mono text-emerald-600">
                        <TrendingUp className="w-3.5 h-3.5" />
                        <span>All channels active</span>
                      </div>
                    </div>

                    {/* Stat card 2 */}
                    <div className="bg-white border border-neutral-200 p-5 rounded-2xl shadow-xs relative overflow-hidden flex flex-col justify-between">
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-bold uppercase text-neutral-400 tracking-wider font-mono">
                          New Enquiries
                        </span>
                        <h4 className="text-2xl sm:text-3xl font-extrabold text-neutral-950 font-mono">
                          {animatedStats.newCount}
                        </h4>
                      </div>
                      <div className="flex items-center space-x-1.5 mt-3 pt-3 border-t border-neutral-100">
                        <span className="w-2 h-2 bg-german-red rounded-full animate-pulse" />
                        <span className="text-[10px] font-mono text-neutral-500">Awaiting consultation</span>
                      </div>
                    </div>

                    {/* Stat card 3 */}
                    <div className="bg-white border border-neutral-200 p-5 rounded-2xl shadow-xs relative overflow-hidden flex flex-col justify-between">
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-bold uppercase text-neutral-400 tracking-wider font-mono font-sans">
                          Contacted Enquiries
                        </span>
                        <h4 className="text-2xl sm:text-3xl font-extrabold text-neutral-950 font-mono">
                          {animatedStats.contacted}
                        </h4>
                      </div>
                      <div className="flex items-center space-x-1 mt-3 pt-3 border-t border-neutral-100 text-[10px] font-mono text-neutral-500">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Counselling closed</span>
                      </div>
                    </div>

                    {/* Stat card 4 */}
                    <div className="bg-white border border-neutral-200 p-5 rounded-2xl shadow-xs relative overflow-hidden flex flex-col justify-between">
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-bold uppercase text-neutral-400 tracking-wider font-mono">
                          Today's Enquiries
                        </span>
                        <h4 className="text-2xl sm:text-3xl font-extrabold text-neutral-950 font-mono">
                          {animatedStats.today}
                        </h4>
                      </div>
                      <div className="flex items-center space-x-1 mt-3 pt-3 border-t border-neutral-100 text-[10px] font-mono text-neutral-500">
                        <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                        <span>Submitted last 24h</span>
                      </div>
                    </div>
                  </div>

                  {/* LATEST REGISTRATIONS TABLE BOX */}
                  <div className="bg-white border border-neutral-200 rounded-3xl overflow-hidden shadow-xs">
                    <div className="p-6 border-b border-neutral-200/60 flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-bold text-neutral-950 font-display">
                          Latest student registrations
                        </h3>
                        <p className="text-xs text-neutral-500 font-light mt-0.5">
                          Student entries matching your premium outreach flows.
                        </p>
                      </div>
                      <button
                        onClick={() => setActiveTab('enquiries')}
                        className="text-xs font-bold font-mono uppercase text-german-red hover:text-neutral-900 tracking-wider transition-colors flex items-center space-x-1 cursor-pointer"
                      >
                        <span>View All Enquiries</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {inquiries.length === 0 ? (
                      <div className="p-12 text-center space-y-3">
                        <div className="w-12 h-12 bg-neutral-100 rounded-2xl flex items-center justify-center mx-auto text-neutral-400 border border-neutral-200/50">
                          <Database className="w-5 h-5" />
                        </div>
                        <h4 className="text-sm font-bold text-neutral-800">No database enquiries</h4>
                        <p className="text-xs text-neutral-400 max-w-xs mx-auto">
                          Submit any consultation form on the front website. Enquiries automatically register here in real-time.
                        </p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="bg-neutral-50 border-b border-neutral-200 text-neutral-400 font-mono text-[10px] font-bold uppercase tracking-wider">
                              <th className="py-4 px-6">Student</th>
                              <th className="py-4 px-6">Program Interest</th>
                              <th className="py-4 px-6">Source</th>
                              <th className="py-4 px-6">Time Received</th>
                              <th className="py-4 px-6 text-right">Outreach</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-neutral-100 text-xs">
                            {inquiries.slice(0, 5).map((inq) => (
                              <tr 
                                key={inq.id}
                                onClick={() => { setSelectedInquiry(inq); setActiveTab('enquiries'); }}
                                className="hover:bg-neutral-50/50 transition-colors cursor-pointer group"
                              >
                                <td className="py-4.5 px-6">
                                  <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 rounded-full bg-neutral-100 border border-neutral-200/50 flex items-center justify-center text-neutral-600 font-semibold uppercase">
                                      {inq.name.charAt(0)}
                                    </div>
                                    <div className="flex flex-col text-left">
                                      <span className="font-bold text-neutral-900 group-hover:text-german-red transition-colors">{inq.name}</span>
                                      <span className="text-[10px] text-neutral-400 font-mono mt-0.5">{inq.phone}</span>
                                    </div>
                                  </div>
                                </td>
                                <td className="py-4.5 px-6">
                                  <span className="px-2.5 py-1 bg-neutral-100 text-neutral-800 border border-neutral-200/40 rounded-lg font-mono font-bold text-[10px] tracking-wide">
                                    {inq.program}
                                  </span>
                                </td>
                                <td className="py-4.5 px-6">
                                  <span className="text-neutral-500 font-medium">
                                    {inq.source}
                                  </span>
                                </td>
                                <td className="py-4.5 px-6 text-neutral-400 font-mono">
                                  {new Date(inq.date).toLocaleString()}
                                </td>
                                <td className="py-4.5 px-6 text-right" onClick={(e) => e.stopPropagation()}>
                                  <div className="flex items-center justify-end space-x-2">
                                    <button
                                      onClick={() => handleOpenWhatsApp(inq)}
                                      className="p-1.5 bg-emerald-500/10 hover:bg-emerald-500 hover:text-white text-emerald-600 rounded-lg transition-all cursor-pointer"
                                      title="Open WhatsApp"
                                    >
                                      <Phone className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      onClick={() => handleCopyDetails(inq)}
                                      className="p-1.5 bg-neutral-100 hover:bg-neutral-900 hover:text-white text-neutral-600 border border-neutral-200/50 rounded-lg transition-all cursor-pointer"
                                      title="Copy Details"
                                    >
                                      <Copy className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>

                  {/* BOTTOM RECENT INSIGHTS ROW */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Source Breakdown */}
                    <div className="bg-white border border-neutral-200 p-6 rounded-3xl lg:col-span-1 space-y-4">
                      <h3 className="text-sm font-bold text-neutral-950 font-display">Source channels</h3>
                      <div className="space-y-3">
                        {['inline', 'popup', 'exit'].map(src => {
                          const count = inquiries.filter(i => i.source === src).length;
                          const pct = inquiries.length > 0 ? Math.round((count / inquiries.length) * 100) : 0;
                          return (
                            <div key={src} className="space-y-1">
                              <div className="flex justify-between text-xs">
                                <span className="capitalize font-medium text-neutral-600">{src === 'inline' ? 'Website Forms' : src + ' Modal'}</span>
                                <span className="font-mono text-neutral-400">{count} ({pct}%)</span>
                              </div>
                              <div className="w-full bg-neutral-100 h-1.5 rounded-full overflow-hidden">
                                <div className="bg-german-red h-full rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Program breakdown */}
                    <div className="bg-white border border-neutral-200 p-6 rounded-3xl lg:col-span-2 space-y-4">
                      <h3 className="text-sm font-bold text-neutral-950 font-display">Program distributions</h3>
                      <div className="grid grid-cols-2 gap-4">
                        {['A1', 'A2', 'B1', 'B2', 'Not Sure Yet'].map(prog => {
                          const count = inquiries.filter(i => i.program === prog).length;
                          return (
                            <div key={prog} className="flex justify-between items-center p-3.5 bg-neutral-50 border border-neutral-100 rounded-xl">
                              <span className="text-xs font-bold font-mono text-neutral-700">{prog}</span>
                              <span className="text-xs font-bold text-neutral-950 font-mono bg-white border border-neutral-200/50 px-2 py-0.5 rounded-lg">{count}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: ENQUIRIES MANAGEMENT PANEL */}
              {activeTab === 'enquiries' && (
                <div className="space-y-6 animate-fade-in text-left">
                  {/* FILTERS & SEARCH TOOLBAR */}
                  <div className="bg-white border border-neutral-200 p-5 rounded-3xl shadow-xs space-y-4 lg:space-y-0 lg:flex lg:items-center lg:justify-between lg:space-x-4">
                    {/* Search Field */}
                    <div className="relative flex-1 max-w-md">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                        <Search className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        placeholder="Search by student name, phone or email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-800 placeholder-neutral-400 outline-none focus:ring-1 focus:ring-neutral-400 focus:border-neutral-400 transition-colors"
                      />
                    </div>

                    {/* Filter fields */}
                    <div className="flex flex-wrap items-center gap-3">
                      {/* Status filter */}
                      <div className="flex items-center space-x-1.5">
                        <span className="text-[10px] font-mono text-neutral-400 font-bold uppercase">Status:</span>
                        <select
                          value={statusFilter}
                          onChange={(e) => setStatusFilter(e.target.value)}
                          className="bg-neutral-50 border border-neutral-200 text-xs px-3 py-2 rounded-xl outline-none"
                        >
                          <option value="All">All Statuses</option>
                          <option value="New">🟢 New</option>
                          <option value="Contacted">🟡 Contacted</option>
                        </select>
                      </div>

                      {/* Date filter */}
                      <div className="flex items-center space-x-1.5">
                        <span className="text-[10px] font-mono text-neutral-400 font-bold uppercase">Date:</span>
                        <select
                          value={dateFilter}
                          onChange={(e) => setDateFilter(e.target.value)}
                          className="bg-neutral-50 border border-neutral-200 text-xs px-3 py-2 rounded-xl outline-none"
                        >
                          <option value="All">All History</option>
                          <option value="Today">Today's Enquiries</option>
                          <option value="Week">This Week</option>
                          <option value="Month">This Month</option>
                        </select>
                      </div>

                      {/* Sort filter */}
                      <div className="flex items-center space-x-1.5">
                        <span className="text-[10px] font-mono text-neutral-400 font-bold uppercase">Sort:</span>
                        <select
                          value={sortBy}
                          onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest')}
                          className="bg-neutral-50 border border-neutral-200 text-xs px-3 py-2 rounded-xl outline-none"
                        >
                          <option value="newest">Newest First</option>
                          <option value="oldest">Oldest First</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* MASTER TABLE AND DETAILS DRAWER */}
                  <div className="relative">
                    <div className="bg-white border border-neutral-200 rounded-3xl overflow-hidden shadow-xs">
                      {filteredInquiries.length === 0 ? (
                        <div className="p-16 text-center space-y-4">
                          <div className="w-14 h-14 bg-neutral-100 rounded-2xl flex items-center justify-center mx-auto text-neutral-400 border border-neutral-200/50">
                            <Search className="w-6 h-6" />
                          </div>
                          <div className="space-y-1">
                            <h4 className="text-sm font-bold text-neutral-900 font-display">No registrations match filters</h4>
                            <p className="text-xs text-neutral-500 max-w-xs mx-auto">
                              Try adjusting your keyword query or switching status filters to reveal student folders.
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full text-left border-collapse">
                            <thead>
                              <tr className="bg-neutral-50 border-b border-neutral-200 text-neutral-400 font-mono text-[10px] font-bold uppercase tracking-wider">
                                <th className="py-4 px-6">Student</th>
                                <th className="py-4 px-6">Country / Goal</th>
                                <th className="py-4 px-6">Interested Program</th>
                                <th className="py-4 px-6">Source Form</th>
                                <th className="py-4 px-6">Date submitted</th>
                                <th className="py-4 px-6">Status</th>
                                <th className="py-4 px-6 text-right">Outreach</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-100 text-xs">
                              {filteredInquiries.map((inq) => {
                                const isSelected = selectedInquiry?.id === inq.id;
                                return (
                                  <tr 
                                    key={inq.id}
                                    onClick={() => setSelectedInquiry(inq)}
                                    className={`hover:bg-neutral-50/50 transition-colors cursor-pointer group ${
                                      isSelected ? 'bg-neutral-50' : ''
                                    }`}
                                  >
                                    <td className="py-4 px-6">
                                      <div className="flex items-center space-x-3">
                                        <div className="w-8 h-8 rounded-full bg-neutral-100 border border-neutral-200/50 flex items-center justify-center text-neutral-600 font-semibold uppercase">
                                          {inq.name.charAt(0)}
                                        </div>
                                        <div className="flex flex-col text-left">
                                          <span className="font-bold text-neutral-900 group-hover:text-german-red transition-colors">{inq.name}</span>
                                          <span className="text-[10px] text-neutral-400 font-mono mt-0.5">{inq.phone}</span>
                                        </div>
                                      </div>
                                    </td>
                                    <td className="py-4 px-6 text-neutral-600 font-medium font-sans">
                                      {inq.country || 'N/A'}
                                    </td>
                                    <td className="py-4 px-6">
                                      <span className="px-2.5 py-1 bg-neutral-100 text-neutral-800 border border-neutral-200/40 rounded-lg font-mono font-bold text-[10px] tracking-wide">
                                        {inq.program}
                                      </span>
                                    </td>
                                    <td className="py-4 px-6">
                                      <span className="text-neutral-500 font-medium">
                                        {inq.source}
                                      </span>
                                    </td>
                                    <td className="py-4 px-6 text-neutral-400 font-mono">
                                      {new Date(inq.date).toLocaleString()}
                                    </td>
                                    <td className="py-4 px-6">
                                      <span className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold font-mono ${
                                        inq.status === 'New' 
                                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/30' 
                                          : 'bg-amber-50 text-amber-700 border border-amber-200/30'
                                      }`}>
                                        <span className={`w-1.5 h-1.5 rounded-full ${inq.status === 'New' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                                        <span>{inq.status}</span>
                                      </span>
                                    </td>
                                    <td className="py-4 px-6 text-right" onClick={(e) => e.stopPropagation()}>
                                      <div className="flex items-center justify-end space-x-1.5">
                                        <button
                                          onClick={() => handleMarkAsContacted(inq)}
                                          className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                                            inq.status === 'New'
                                              ? 'bg-neutral-900 text-white border-neutral-800 hover:bg-neutral-800'
                                              : 'bg-white text-neutral-500 border-neutral-200/50 hover:bg-neutral-50'
                                          }`}
                                          title={inq.status === 'New' ? "Mark as Contacted" : "Mark as New"}
                                        >
                                          <CheckCircle2 className="w-3.5 h-3.5" />
                                        </button>
                                        <button
                                          onClick={() => handleDeleteEnquiry(inq.id)}
                                          className="p-1.5 bg-neutral-50 hover:bg-red-500 hover:text-white hover:border-red-500 text-neutral-400 border border-neutral-200/50 rounded-lg transition-all cursor-pointer"
                                          title="Delete registration"
                                        >
                                          <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>

                    {/* SLIDING SIDE DETAILS DRAWER */}
                    <AnimatePresence>
                      {selectedInquiry && (
                        <>
                          {/* Backdrop click-out overlay */}
                          <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.3 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedInquiry(null)}
                            className="fixed inset-0 bg-neutral-950 z-20 pointer-events-auto"
                          />

                          {/* Content Panel */}
                          <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
                            className="absolute top-0 right-0 h-full w-full sm:max-w-md bg-white border-l border-neutral-200 shadow-2xl z-30 flex flex-col justify-between"
                          >
                            <div className="flex flex-col">
                              {/* Panel Header */}
                              <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
                                <div className="space-y-0.5">
                                  <span className={`inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[9px] font-bold font-mono ${
                                    selectedInquiry.status === 'New' 
                                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                                      : 'bg-amber-50 text-amber-700 border border-amber-100'
                                  }`}>
                                    <span className={`w-1 h-1 rounded-full ${selectedInquiry.status === 'New' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                                    <span>{selectedInquiry.status}</span>
                                  </span>
                                  <h3 className="text-sm font-bold text-neutral-950 font-display">Student Folder Dossier</h3>
                                </div>
                                <button
                                  onClick={() => setSelectedInquiry(null)}
                                  className="p-1.5 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer"
                                >
                                  <X className="w-4 h-4 text-neutral-400 hover:text-neutral-700" />
                                </button>
                              </div>

                              {/* Student Detail fields */}
                              <div className="p-6 space-y-6 overflow-y-auto">
                                {/* Name Avatar card */}
                                <div className="flex items-center space-x-4 bg-neutral-50 p-4 border border-neutral-200/50 rounded-2xl">
                                  <div className="w-12 h-12 bg-neutral-900 text-german-gold font-bold font-display text-base flex items-center justify-center rounded-xl shadow-inner uppercase shrink-0">
                                    {selectedInquiry.name.charAt(0)}
                                  </div>
                                  <div className="flex flex-col">
                                    <span className="text-sm font-bold text-neutral-950 font-display leading-tight">{selectedInquiry.name}</span>
                                    <span className="text-[10px] text-neutral-400 font-mono mt-1">Submitted on {new Date(selectedInquiry.date).toLocaleDateString()}</span>
                                  </div>
                                </div>

                                {/* Contact Grid list */}
                                <div className="space-y-4">
                                  <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest font-mono">Student Information</p>
                                  
                                  <div className="grid grid-cols-1 gap-3.5 text-xs">
                                    {/* Phone */}
                                    <div className="flex items-start justify-between border-b border-neutral-100 pb-2.5">
                                      <div className="flex items-center space-x-2 text-neutral-500">
                                        <Phone className="w-3.5 h-3.5" />
                                        <span>Phone Number</span>
                                      </div>
                                      <span className="font-bold text-neutral-900 font-mono">{selectedInquiry.phone}</span>
                                    </div>

                                    {/* Email */}
                                    <div className="flex items-start justify-between border-b border-neutral-100 pb-2.5">
                                      <div className="flex items-center space-x-2 text-neutral-500">
                                        <Mail className="w-3.5 h-3.5" />
                                        <span>Email Address</span>
                                      </div>
                                      <span className="font-bold text-neutral-900 font-mono truncate max-w-[180px]">{selectedInquiry.email || 'N/A'}</span>
                                    </div>

                                    {/* Country */}
                                    <div className="flex items-start justify-between border-b border-neutral-100 pb-2.5">
                                      <div className="flex items-center space-x-2 text-neutral-500">
                                        <Globe className="w-3.5 h-3.5" />
                                        <span>Target Country / Goal</span>
                                      </div>
                                      <span className="font-bold text-neutral-900">{selectedInquiry.country || 'N/A'}</span>
                                    </div>

                                    {/* Interested Program */}
                                    <div className="flex items-start justify-between border-b border-neutral-100 pb-2.5">
                                      <div className="flex items-center space-x-2 text-neutral-500">
                                        <BookOpen className="w-3.5 h-3.5" />
                                        <span>Program interest</span>
                                      </div>
                                      <span className="px-2 py-0.5 bg-neutral-100 text-neutral-850 rounded font-mono font-bold text-[10px] tracking-wide">
                                        {selectedInquiry.program}
                                      </span>
                                    </div>

                                    {/* Submission source */}
                                    <div className="flex items-start justify-between border-b border-neutral-100 pb-2.5">
                                      <div className="flex items-center space-x-2 text-neutral-500">
                                        <Database className="w-3.5 h-3.5" />
                                        <span>Source Form</span>
                                      </div>
                                      <span className="font-bold text-neutral-700 capitalize">{selectedInquiry.source}</span>
                                    </div>
                                  </div>
                                </div>

                                {/* Custom notes message */}
                                <div className="space-y-2">
                                  <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest font-mono">Message from student</p>
                                  <div className="bg-neutral-50 border border-neutral-100 p-4 rounded-2xl text-xs text-neutral-600 leading-relaxed font-light text-left whitespace-pre-wrap">
                                    {selectedInquiry.message || 'No additional message was submitted with this enquiry.'}
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Actions Footer row */}
                            <div className="p-6 border-t border-neutral-100 bg-neutral-50 space-y-3">
                              <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest font-mono">Outreach & Actions</p>
                              
                              <div className="grid grid-cols-2 gap-3 text-xs">
                                <button
                                  onClick={() => handleOpenWhatsApp(selectedInquiry)}
                                  className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-4 rounded-xl text-center flex items-center justify-center space-x-2 shadow-sm transition-colors cursor-pointer"
                                >
                                  <Phone className="w-4 h-4 fill-white/10" />
                                  <span>Open WhatsApp</span>
                                </button>
                                
                                <button
                                  onClick={() => handleSendEmail(selectedInquiry)}
                                  className="bg-neutral-900 hover:bg-neutral-800 text-white font-bold py-3 px-4 rounded-xl text-center flex items-center justify-center space-x-2 shadow-sm transition-colors cursor-pointer"
                                >
                                  <Mail className="w-4 h-4" />
                                  <span>Send Email</span>
                                </button>
                              </div>

                              <div className="grid grid-cols-3 gap-2.5 pt-1">
                                <button
                                  onClick={() => handleMarkAsContacted(selectedInquiry)}
                                  className="bg-white hover:bg-neutral-50 text-neutral-700 font-semibold py-2.5 px-3 border border-neutral-200/60 rounded-xl text-[11px] flex items-center justify-center space-x-1 transition-colors cursor-pointer"
                                >
                                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                                  <span>{selectedInquiry.status === 'New' ? 'Contacted' : 'Unmark'}</span>
                                </button>

                                <button
                                  onClick={() => handleCopyDetails(selectedInquiry)}
                                  className="bg-white hover:bg-neutral-50 text-neutral-700 font-semibold py-2.5 px-3 border border-neutral-200/60 rounded-xl text-[11px] flex items-center justify-center space-x-1 transition-colors cursor-pointer"
                                >
                                  <Copy className="w-3.5 h-3.5 text-neutral-400" />
                                  <span>Copy Info</span>
                                </button>

                                <button
                                  onClick={() => handleDeleteEnquiry(selectedInquiry.id)}
                                  className="bg-white hover:bg-red-50 text-neutral-500 hover:text-red-600 font-semibold py-2.5 px-3 border border-neutral-200/60 rounded-xl text-[11px] flex items-center justify-center space-x-1 transition-colors cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5 text-red-500" />
                                  <span>Delete</span>
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              )}

              {/* TAB 3: SETTINGS PASSWORD PANEL */}
              {activeTab === 'settings' && (
                <div className="space-y-8 animate-fade-in text-left">
                  {/* Password reset box */}
                  <div className="max-w-xl bg-white border border-neutral-200 rounded-3xl overflow-hidden shadow-xs">
                    <div className="p-6 border-b border-neutral-200/60 flex items-center space-x-3">
                      <div className="p-2 bg-german-red/10 rounded-xl text-german-red">
                        <Lock className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-neutral-950 font-display">Update security credentials</h3>
                        <p className="text-xs text-neutral-500 font-light mt-0.5">Modify the password used to authenticate this dashboard panel.</p>
                      </div>
                    </div>

                    <form onSubmit={handleChangePassword} className="p-6 space-y-5">
                      {passwordStatus.text && (
                        <div className={`p-4 rounded-xl text-xs font-light leading-relaxed border ${
                          passwordStatus.type === 'success' 
                            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600' 
                            : 'bg-red-500/10 border-red-500/20 text-red-600'
                        }`}>
                          {passwordStatus.text}
                        </div>
                      )}

                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-bold uppercase text-neutral-400 tracking-wider font-mono">
                          New Password
                        </label>
                        <input
                          type="password"
                          required
                          placeholder="Min 6 characters recommended"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 focus:border-neutral-400 rounded-xl text-xs text-neutral-800 placeholder-neutral-400 outline-none transition-colors font-mono"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-bold uppercase text-neutral-400 tracking-wider font-mono">
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          required
                          placeholder="Re-type new password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 focus:border-neutral-400 rounded-xl text-xs text-neutral-800 placeholder-neutral-400 outline-none transition-colors font-mono"
                        />
                      </div>

                      <div className="pt-2">
                        <button
                          type="submit"
                          disabled={passwordLoading}
                          className="bg-neutral-950 hover:bg-neutral-900 disabled:opacity-50 text-white font-bold py-3 px-6 rounded-xl text-xs uppercase tracking-wider transition-colors flex items-center justify-center space-x-2 cursor-pointer"
                        >
                          {passwordLoading ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              <span>Saving password...</span>
                            </>
                          ) : (
                            <>
                              <ShieldCheck className="w-4 h-4 text-german-gold" />
                              <span>Update credentials</span>
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </>
          )}

        </div>
      </main>
    </div>
  );
}
