import React, { useState, useEffect } from 'react';
import { X, MessageCircle } from 'lucide-react';
import { Inquiry } from '../types';

interface InquiryPopupsProps {
  onAddInquiry: (inq: Omit<Inquiry, 'id' | 'date'>) => void;
}

export default function InquiryPopups({ onAddInquiry }: InquiryPopupsProps) {
  // States
  const [showTimedModal, setShowTimedModal] = useState(false);
  const [timedName, setTimedName] = useState('');
  const [timedMobile, setTimedMobile] = useState('');
  const [timedGoal, setTimedGoal] = useState('Study in Germany');
  const [timedSubmitted, setTimedSubmitted] = useState(false);

  const [showExitModal, setShowExitModal] = useState(false);
  const [exitName, setExitName] = useState('');
  const [exitMobile, setExitMobile] = useState('');
  const [exitGoal, setExitGoal] = useState('Study in Germany');
  const [exitSubmitted, setExitSubmitted] = useState(false);

  // Check storage status
  const checkPopupEligibility = (): boolean => {
    const isSubmitted = localStorage.getItem('eg_popup_submitted') === 'true';
    if (isSubmitted) return false;

    const dismissedAt = localStorage.getItem('eg_popup_dismissed_at');
    if (dismissedAt) {
      const diff = Date.now() - parseInt(dismissedAt, 10);
      const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
      if (diff < sevenDaysMs) {
        return false; // Dismissed within 7 days
      }
    }

    const sessionSeen = sessionStorage.getItem('eg_popup_session_seen') === 'true';
    if (sessionSeen) return false; // Already shown or scheduled in this session

    return true;
  };

  // 1. Timed popup effect (triggers after 5 seconds on first landing)
  useEffect(() => {
    if (!checkPopupEligibility()) return;

    const timer = setTimeout(() => {
      // Re-evaluate eligibility right before showing
      if (!checkPopupEligibility()) return;

      setShowTimedModal(true);
      sessionStorage.setItem('eg_popup_session_seen', 'true');
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  // 2. Exit intent effect (Desktop Only)
  useEffect(() => {
    if (!checkPopupEligibility()) return;

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY < 20 && !showTimedModal && !showExitModal) {
        if (!checkPopupEligibility()) return;
        
        setShowExitModal(true);
        sessionStorage.setItem('eg_popup_session_seen', 'true');
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [showTimedModal, showExitModal]);

  // Dismiss action (close / maybe later / click outside) -> set 7 day delay
  const dismissPopup = () => {
    localStorage.setItem('eg_popup_dismissed_at', Date.now().toString());
    setShowTimedModal(false);
    setShowExitModal(false);
  };

  // Submit action -> never show again
  const handleTimedSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!timedName.trim() || !timedMobile.trim()) {
      return;
    }

    onAddInquiry({
      name: timedName.trim(),
      mobile: timedMobile.trim(),
      level: 'Not Sure Yet',
      purpose: timedGoal,
      source: 'popup',
      message: 'Counselling requested via 5s timed popup.'
    });

    localStorage.setItem('eg_popup_submitted', 'true');
    setTimedSubmitted(true);
    setTimeout(() => {
      setShowTimedModal(false);
    }, 2500);
  };

  const handleExitSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!exitName.trim() || !exitMobile.trim()) {
      return;
    }

    onAddInquiry({
      name: exitName.trim(),
      mobile: exitMobile.trim(),
      level: 'Not Sure Yet',
      purpose: exitGoal,
      source: 'exit',
      message: 'Counselling requested via Exit Intent popup.'
    });

    localStorage.setItem('eg_popup_submitted', 'true');
    setExitSubmitted(true);
    setTimeout(() => {
      setShowExitModal(false);
    }, 2500);
  };

  // Click outside overlay handler
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      dismissPopup();
    }
  };

  return (
    <>
      {/* 1. TIMED POPUP */}
      {showTimedModal && (
        <div 
          id="timed_popup_overlay" 
          onClick={handleOverlayClick}
          className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4"
        >
          <div 
            id="timed_popup_box"
            className="bg-white w-full max-w-md rounded-none shadow-2xl relative border border-neutral-100 overflow-hidden animate-fade-in-up"
          >
            {/* Top Close icon */}
            <button 
              id="close_timed_popup"
              onClick={dismissPopup}
              className="absolute top-3 right-3 text-neutral-400 hover:text-neutral-700 p-1 rounded-none transition-colors cursor-pointer"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header */}
            <div className="p-6 pb-4 text-center border-b border-neutral-100">
              <h3 className="text-[20px] font-bold font-display text-neutral-900 tracking-tight">
                Planning to Learn German?
              </h3>
              <p className="text-[14px] text-neutral-500 mt-1.5 font-sans leading-relaxed">
                Get guidance on the right German level for your Germany goal.
              </p>
            </div>

            {/* Form Area */}
            <div className="p-6">
              {!timedSubmitted ? (
                <form onSubmit={handleTimedSubmit} className="space-y-4">
                  <div>
                    <label className="block text-[12px] font-semibold text-neutral-700 mb-1 font-sans">
                      Full Name
                    </label>
                    <input 
                      type="text"
                      required
                      placeholder="Your Full Name"
                      value={timedName}
                      onChange={(e) => setTimedName(e.target.value)}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-none text-[14px] focus:ring-1 focus:ring-german-red focus:border-german-red outline-none bg-white font-sans"
                    />
                  </div>

                  <div>
                    <label className="block text-[12px] font-semibold text-neutral-700 mb-1 font-sans">
                      Mobile Number
                    </label>
                    <input 
                      type="tel"
                      required
                      placeholder="Your Mobile Number"
                      value={timedMobile}
                      onChange={(e) => setTimedMobile(e.target.value)}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-none text-[14px] focus:ring-1 focus:ring-german-red focus:border-german-red outline-none bg-white font-sans"
                    />
                  </div>

                  <div>
                    <label className="block text-[12px] font-semibold text-neutral-700 mb-1 font-sans">
                      Goal
                    </label>
                    <select 
                      value={timedGoal}
                      onChange={(e) => setTimedGoal(e.target.value)}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-none text-[14px] focus:ring-1 focus:ring-german-red focus:border-german-red outline-none bg-white font-sans"
                    >
                      <option value="Study in Germany">Study in Germany</option>
                      <option value="Ausbildung">Ausbildung</option>
                      <option value="Job in Germany">Job in Germany</option>
                      <option value="German Language Learning">German Language Learning</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <button 
                    id="submit_timed_btn"
                    type="submit"
                    className="w-full bg-german-red hover:bg-neutral-900 text-white py-3 rounded-none text-[14px] font-semibold uppercase tracking-wider transition-colors cursor-pointer font-sans"
                  >
                    Get Free Counselling
                  </button>

                  <div className="relative flex py-1.5 items-center">
                    <div className="flex-grow border-t border-neutral-200"></div>
                    <span className="flex-shrink mx-4 text-neutral-400 text-[10px] font-mono uppercase tracking-widest">or</span>
                    <div className="flex-grow border-t border-neutral-200"></div>
                  </div>

                  <a 
                    id="whatsapp_timed_btn"
                    href="https://wa.me/919131688225"
                    target="_blank"
                    rel="noreferrer"
                    className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-none text-[14px] font-semibold uppercase tracking-wider transition-colors cursor-pointer font-sans flex items-center justify-center space-x-2"
                  >
                    <MessageCircle className="w-4 h-4 fill-white/10" />
                    <span>Chat on WhatsApp</span>
                  </a>

                  <p className="text-[11px] text-neutral-400 text-center font-sans">
                    We will contact you only regarding your enquiry.
                  </p>

                  <div className="flex items-center justify-center pt-1">
                    <button 
                      type="button" 
                      onClick={dismissPopup}
                      className="text-[13px] text-neutral-500 hover:text-neutral-800 font-medium transition-colors cursor-pointer"
                    >
                      Maybe Later
                    </button>
                  </div>
                </form>
              ) : (
                <div id="timed_success_message" className="py-8 text-center space-y-3">
                  <div className="w-12 h-12 bg-emerald-100 rounded-none flex items-center justify-center mx-auto text-emerald-600">
                    ✓
                  </div>
                  <h4 className="text-base font-bold text-neutral-900 font-display">Thank you!</h4>
                  <p className="text-xs text-neutral-500">Our counselling team will reach out shortly.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 2. EXIT INTENT POPUP */}
      {showExitModal && (
        <div 
          id="exit_popup_overlay" 
          onClick={handleOverlayClick}
          className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4"
        >
          <div 
            id="exit_popup_box"
            className="bg-white w-full max-w-md rounded-none shadow-2xl relative border border-neutral-100 overflow-hidden animate-scale-in"
          >
            {/* Top Close icon */}
            <button 
              id="close_exit_popup"
              onClick={dismissPopup}
              className="absolute top-3 right-3 text-neutral-400 hover:text-neutral-700 p-1 rounded-none transition-colors cursor-pointer"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Content Header */}
            <div className="p-6 pb-4 text-center border-b border-neutral-100">
              <h3 className="text-[20px] font-bold font-display text-neutral-900 tracking-tight">
                Planning to Learn German?
              </h3>
              <p className="text-[14px] text-neutral-500 mt-1.5 font-sans leading-relaxed">
                Get guidance on the right German level for your Germany goal.
              </p>
            </div>

            {/* Quick Capture */}
            <div className="p-6">
              {!exitSubmitted ? (
                <form onSubmit={handleExitSubmit} className="space-y-4">
                  <div>
                    <label className="block text-[12px] font-semibold text-neutral-700 mb-1 font-sans">
                      Full Name
                    </label>
                    <input 
                      type="text"
                      required
                      placeholder="Your Full Name"
                      value={exitName}
                      onChange={(e) => setExitName(e.target.value)}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-none text-[14px] focus:ring-1 focus:ring-german-red focus:border-german-red outline-none bg-white font-sans"
                    />
                  </div>

                  <div>
                    <label className="block text-[12px] font-semibold text-neutral-700 mb-1 font-sans">
                      Mobile Number
                    </label>
                    <input 
                      type="tel"
                      required
                      placeholder="Your Mobile Number"
                      value={exitMobile}
                      onChange={(e) => setExitMobile(e.target.value)}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-none text-[14px] focus:ring-1 focus:ring-german-red focus:border-german-red outline-none bg-white font-sans"
                    />
                  </div>

                  <div>
                    <label className="block text-[12px] font-semibold text-neutral-700 mb-1 font-sans">
                      Goal
                    </label>
                    <select 
                      value={exitGoal}
                      onChange={(e) => setExitGoal(e.target.value)}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-none text-[14px] focus:ring-1 focus:ring-german-red focus:border-german-red outline-none bg-white font-sans"
                    >
                      <option value="Study in Germany">Study in Germany</option>
                      <option value="Ausbildung">Ausbildung</option>
                      <option value="Job in Germany">Job in Germany</option>
                      <option value="German Language Learning">German Language Learning</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <button 
                    id="submit_exit_btn"
                    type="submit"
                    className="w-full bg-german-red hover:bg-neutral-900 text-white py-3 rounded-none text-[14px] font-semibold uppercase tracking-wider transition-colors cursor-pointer font-sans"
                  >
                    Get Free Counselling
                  </button>

                  <div className="relative flex py-1.5 items-center">
                    <div className="flex-grow border-t border-neutral-200"></div>
                    <span className="flex-shrink mx-4 text-neutral-400 text-[10px] font-mono uppercase tracking-widest">or</span>
                    <div className="flex-grow border-t border-neutral-200"></div>
                  </div>

                  <a 
                    id="whatsapp_exit_btn"
                    href="https://wa.me/919131688225"
                    target="_blank"
                    rel="noreferrer"
                    className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-none text-[14px] font-semibold uppercase tracking-wider transition-colors cursor-pointer font-sans flex items-center justify-center space-x-2"
                  >
                    <MessageCircle className="w-4 h-4 fill-white/10" />
                    <span>Chat on WhatsApp</span>
                  </a>

                  <p className="text-[11px] text-neutral-400 text-center font-sans">
                    We will contact you only regarding your enquiry.
                  </p>

                  <div className="flex items-center justify-center pt-1">
                    <button 
                      type="button" 
                      onClick={dismissPopup}
                      className="text-[13px] text-neutral-500 hover:text-neutral-800 font-medium transition-colors cursor-pointer"
                    >
                      Maybe Later
                    </button>
                  </div>
                </form>
              ) : (
                <div id="exit_success_message" className="py-6 text-center space-y-3">
                  <div className="w-12 h-12 bg-emerald-100 rounded-none flex items-center justify-center mx-auto text-emerald-600">
                    ✓
                  </div>
                  <h4 className="text-base font-bold text-neutral-900 font-display">Counselling Requested!</h4>
                  <p className="text-xs text-neutral-500">We will message you on WhatsApp shortly regarding your Germany career roadmap.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
