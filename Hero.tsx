import React, { useState, useEffect } from 'react';
import { Inquiry, SystemSettings } from '../types';
import { MessageCircle, MapPin, Send } from 'lucide-react';

interface ContactProps {
  settings: SystemSettings;
  selectedLevel: string;
  setSelectedLevel: React.Dispatch<React.SetStateAction<string>>;
  onAddInquiry: (inq: Omit<Inquiry, 'id' | 'date'>) => void;
}

export default function Contact({ settings, selectedLevel, setSelectedLevel, onAddInquiry }: ContactProps) {
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [purpose, setPurpose] = useState('Study in Germany');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // Sync selected level from course row clicks if changed
  useEffect(() => {
    // If selectedLevel is updated, we do not need to do anything as selectedLevel is bound to the select field
  }, [selectedLevel]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !mobile) {
      alert('Please enter your name and mobile number.');
      return;
    }

    onAddInquiry({
      name,
      mobile,
      email,
      level: selectedLevel,
      purpose,
      message,
      source: 'inline'
    });

    localStorage.setItem('hasSubmittedGermanInquiry', 'true');
    setSubmitted(true);
    
    // Clear form
    setName('');
    setMobile('');
    setEmail('');
    setMessage('');

    // Reset success message after 6 seconds
    setTimeout(() => {
      setSubmitted(false);
    }, 6000);
  };

  return (
    <section id="contact" className="py-20 lg:py-28 bg-white border-b border-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Premium Inquiry Form */}
          <div className="lg:col-span-7 bg-neutral-50 border border-neutral-200 rounded-none p-6 sm:p-8 text-left">
            <div className="space-y-3 mb-8">
              <span className="text-[11px] font-bold tracking-widest text-german-red uppercase font-mono block">
                REGISTRATION
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 tracking-tight font-display">
                Start with a counselling session.
              </h2>
              <p className="text-xs sm:text-sm text-neutral-500 font-light leading-relaxed">
                Tell us your current level and your goal for Germany. Our academic counselling team will guide you toward the right program and batch timing.
              </p>
            </div>

            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-neutral-500 mb-1">Full Name *</label>
                    <input 
                      type="text"
                      required
                      placeholder="e.g. Aman Sharma"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3.5 py-2.5 border border-neutral-300 rounded-none text-xs focus:ring-1 focus:ring-german-red focus:border-german-red outline-none bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-neutral-500 mb-1">Mobile / WhatsApp Number *</label>
                    <input 
                      type="tel"
                      required
                      placeholder="e.g. 9131688225"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      className="w-full px-3.5 py-2.5 border border-neutral-300 rounded-none text-xs focus:ring-1 focus:ring-german-red focus:border-german-red outline-none bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-1">
                    <label className="block text-[10px] font-bold uppercase text-neutral-500 mb-1">German Level</label>
                    <select
                      value={selectedLevel}
                      onChange={(e) => setSelectedLevel(e.target.value)}
                      className="w-full px-3 py-2.5 border border-neutral-300 rounded-none text-xs focus:ring-1 focus:ring-german-red focus:border-german-red outline-none bg-white"
                    >
                      <option value="A1">A1 — Foundation</option>
                      <option value="A2">A2 — Elementary</option>
                      <option value="B1">B1 — Intermediate</option>
                      <option value="B2">B2 — Upper Intermediate</option>
                      <option value="Not Sure Yet">Not Sure Yet</option>
                    </select>
                  </div>

                  <div className="sm:col-span-1">
                    <label className="block text-[10px] font-bold uppercase text-neutral-500 mb-1">Primary Goal</label>
                    <select
                      value={purpose}
                      onChange={(e) => setPurpose(e.target.value)}
                      className="w-full px-3 py-2.5 border border-neutral-300 rounded-none text-xs focus:ring-1 focus:ring-german-red focus:border-german-red outline-none bg-white"
                    >
                      <option value="Study in Germany">Study in Germany</option>
                      <option value="Ausbildung">Ausbildung (Vocational)</option>
                      <option value="Job in Germany">Job in Germany</option>
                      <option value="German Language Learning">General Study</option>
                      <option value="Other">Other Goals</option>
                    </select>
                  </div>

                  <div className="sm:col-span-1">
                    <label className="block text-[10px] font-bold uppercase text-neutral-500 mb-1">Email (Optional)</label>
                    <input 
                      type="email"
                      placeholder="e.g. user@domain.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2.5 border border-neutral-300 rounded-none text-xs focus:ring-1 focus:ring-german-red focus:border-german-red outline-none bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-neutral-500 mb-1">Message / Current Status (Optional)</label>
                  <textarea 
                    rows={3}
                    placeholder="Tell us about your visa target date, or study stream..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-neutral-300 rounded-none text-xs focus:ring-1 focus:ring-german-red focus:border-german-red outline-none bg-white resize-none"
                  />
                </div>

                <button 
                  id="send_inquiry_btn"
                  type="submit"
                  className="w-full sm:w-auto bg-neutral-900 hover:bg-german-red text-white hover:text-white px-7 py-3 rounded-none text-xs font-bold font-display uppercase tracking-wider transition-all duration-300 flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <span>Send Inquiry</span>
                  <Send className="w-4 h-4" />
                </button>

              </form>
            ) : (
              <div id="inline_success_message" className="py-12 text-center space-y-4 bg-white border border-neutral-200 rounded-none">
                <div className="w-14 h-14 bg-emerald-100 rounded-none flex items-center justify-center mx-auto text-emerald-600 font-bold text-lg">
                  ✓
                </div>
                <div className="space-y-1">
                  <h4 className="text-lg font-bold text-neutral-900 font-display">Thank you.</h4>
                  <p className="text-xs text-neutral-500">Your inquiry has been stored. We will contact you shortly.</p>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Contact details & Google map */}
          <div className="lg:col-span-5 space-y-8 text-left">
            <div className="space-y-3">
              <span className="text-[11px] font-bold tracking-widest text-neutral-400 uppercase font-mono block">
                REACH US
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 tracking-tight font-display">
                Start with a counselling session.
              </h2>
              <p className="text-sm text-neutral-500 font-light leading-relaxed">
                Tell us your current level and your goal for Germany. Get guidance directly on WhatsApp.
              </p>
            </div>

            {/* Premium WhatsApp and Directions details */}
            <div className="p-6 border border-neutral-200 bg-neutral-50 rounded-none space-y-4">
              <div className="flex items-center space-x-3 text-neutral-950 font-sans">
                <MessageCircle className="w-5 h-5 text-emerald-500 fill-emerald-500/10" />
                <span className="text-base font-bold">WhatsApp: 9131688225</span>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 pt-1">
                <a
                  href="https://wa.me/919131688225"
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-4 text-center rounded-none text-xs font-mono uppercase tracking-wider transition-colors flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 fill-white/10" />
                  <span>Chat on WhatsApp</span>
                </a>
                <a
                  href={settings.googleMapsShareUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 bg-neutral-900 hover:bg-neutral-800 text-white font-bold py-3 px-4 text-center rounded-none text-xs font-mono uppercase tracking-wider transition-colors flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <MapPin className="w-4 h-4 text-german-red" />
                  <span>Get Directions</span>
                </a>
              </div>
            </div>

            {/* Google Map Frame */}
            <div className="border border-neutral-200 rounded-none overflow-hidden shadow-sm bg-neutral-100 aspect-video relative">
              <iframe 
                src={settings.googleMapsEmbedUrl}
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0"
              />
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
