import React, { useState, useEffect } from 'react';
import { Menu, X, MessageCircle, Globe, ChevronDown } from 'lucide-react';

interface NavbarProps {
  phone: string;
}

export default function Navbar({ phone }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [isScrolled, setIsScrolled] = useState(false);
  const [logoError, setLogoError] = useState(false);

  const navLinks = [
    { name: 'Home', href: '#hero' },
    { name: 'Courses', href: '#courses' },
    { name: 'About Us', href: '#about' },
    { name: 'Free A2 Series', href: '#free-a2-series' },
    { name: 'Videos', href: '#videos' },
    { name: 'Student Reviews', href: '#reviews' },
    { name: 'Contact', href: '#contact' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      // Toggle scrolled state
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      const scrollPosition = window.scrollY + 160;

      // Find current active section
      for (const link of navLinks) {
        const id = link.href.substring(1);
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScrollToSection = (id: string) => {
    setIsOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const navbarOffset = isScrolled ? 100 : 140;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - navbarOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full transition-all duration-300">
      {/* Dynamic Background with Glassmorphism */}
      <div className="absolute inset-0 bg-[rgba(255,255,255,0.85)] backdrop-blur-[16px] border-b border-neutral-200/50 -z-10 shadow-xs" />

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* DESKTOP HEADER (TWO ROWS) */}
        <div className="hidden lg:flex flex-col">
          
          {/* TOP ROW */}
          <div className={`flex justify-between items-center border-b border-neutral-100/80 transition-all duration-300 ${
            isScrolled ? 'h-0 py-0 overflow-hidden opacity-0 scale-y-0' : 'h-12 py-2 opacity-100'
          }`}>
            {/* Left: Institute Tagline */}
            <div className="flex items-center space-x-3 text-neutral-400 font-mono text-[11px] tracking-widest uppercase">
              <span>Bhopal’s Premier German Language Institute</span>
            </div>

            {/* Right: Small WhatsApp & Language Dropdown */}
            <div className="flex items-center space-x-6">
              <a 
                href="https://wa.me/919131688225"
                target="_blank"
                rel="noreferrer"
                className="flex items-center space-x-1.5 text-neutral-600 hover:text-emerald-600 transition-colors text-[13px] font-medium"
              >
                <MessageCircle className="w-4 h-4 text-emerald-500 fill-emerald-500/10" />
                <span>WhatsApp Us</span>
              </a>

              <div className="flex items-center space-x-1 text-neutral-500 text-[13px] font-medium border-l border-neutral-200 pl-4 select-none">
                <Globe className="w-3.5 h-3.5 text-neutral-400" />
                <span>English</span>
                <ChevronDown className="w-3 h-3 text-neutral-400" />
              </div>
            </div>
          </div>

          {/* BOTTOM ROW (or Scrolled Header) */}
          <div className={`flex justify-between items-center transition-all duration-300 ${
            isScrolled ? 'h-16' : 'h-20'
          }`}>
            
            {/* Logo Mark & Text */}
            <div className="flex items-center space-x-4">
              <div 
                onClick={() => handleScrollToSection('hero')} 
                className="flex items-center space-x-3 group cursor-pointer"
              >
                {!logoError ? (
                  <img
                    src="/whatsapp image 2026-06-24 at 7.29.31 PM.jpeg"
                    alt="Easy German by Rajveer Sir"
                    referrerPolicy="no-referrer"
                    onError={() => setLogoError(true)}
                    className="h-10 max-h-[40px] w-auto object-contain shrink-0 transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex items-center space-x-3.5">
                    <span className="w-10 h-10 bg-neutral-900 text-german-gold font-bold font-display text-[15px] flex items-center justify-center tracking-tighter rounded-none border border-neutral-800 shrink-0">
                      EG
                    </span>
                    <div className="flex flex-col">
                      <span className="text-[14px] font-extrabold text-neutral-900 font-display leading-none tracking-tight uppercase">
                        EASY GERMAN
                      </span>
                      <span className="text-[10px] text-neutral-500 font-semibold tracking-widest mt-1 uppercase font-sans">
                        by Rajveer Sir
                      </span>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="h-6 w-px bg-neutral-200" />
              <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest font-sans">
                GERMAN LANGUAGE INSTITUTE
              </span>
            </div>

            {/* Navigation Links */}
            <nav className="flex items-center space-x-6">
              {navLinks.map((link) => {
                const id = link.href.substring(1);
                const isActive = activeSection === id;
                return (
                  <button
                    key={link.name}
                    onClick={() => handleScrollToSection(id)}
                    className={`text-[14px] font-semibold transition-all relative py-1 cursor-pointer font-sans tracking-tight border-b-2 hover:text-german-red ${
                      isActive 
                        ? 'text-german-red border-german-red' 
                        : 'text-neutral-700 border-transparent'
                    }`}
                  >
                    {link.name}
                  </button>
                );
              })}
            </nav>

            {/* CTA Button */}
            <div className="flex items-center">
              <a
                href="https://wa.me/919131688225"
                target="_blank"
                rel="noreferrer"
                className="bg-neutral-900 hover:bg-german-red text-white px-5 py-2.5 rounded-none text-[14px] font-bold tracking-tight transition-colors cursor-pointer font-sans"
              >
                Enquire on WhatsApp
              </a>
            </div>

          </div>

        </div>

        {/* MOBILE HEADER (COMPACT) */}
        <div className="flex lg:hidden justify-between items-center h-16">
          {/* Logo */}
          <div 
            onClick={() => handleScrollToSection('hero')} 
            className="flex items-center space-x-2.5 cursor-pointer"
          >
            {!logoError ? (
              <div className="flex items-center space-x-2">
                <img
                  src="/whatsapp image 2026-06-24 at 7.29.31 PM.jpeg"
                  alt="Easy German Logo"
                  referrerPolicy="no-referrer"
                  onError={() => setLogoError(true)}
                  className="h-10 w-auto object-contain shrink-0"
                />
                <div className="h-4 w-px bg-neutral-200 xs:block hidden" />
                <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider font-sans xs:block hidden">
                  GERMAN LANGUAGE INSTITUTE
                </span>
              </div>
            ) : (
              <div className="flex items-center space-x-2.5">
                <span className="w-8 h-8 bg-neutral-900 text-german-gold font-bold font-display text-xs flex items-center justify-center tracking-tighter rounded-none border border-neutral-800">
                  EG
                </span>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-neutral-900 font-display leading-none tracking-tight">
                    EASY GERMAN
                  </span>
                  <span className="text-[9px] text-neutral-500 font-medium tracking-wide mt-0.5 font-sans">
                    by Rajveer Sir
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Hamburger Menu Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-neutral-600 hover:text-neutral-900 focus:outline-none transition-colors cursor-pointer"
            aria-label="Toggle Menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

      </div>

      {/* MOBILE DRAWER WITH GLASSMORPHISM */}
      {isOpen && (
        <div 
          id="mobile_menu" 
          className="lg:hidden w-full bg-[rgba(255,255,255,0.92)] backdrop-blur-[16px] border-t border-neutral-200"
        >
          <div className="px-4 pt-4 pb-6 space-y-2">
            {navLinks.map((link) => {
              const id = link.href.substring(1);
              const isActive = activeSection === id;
              return (
                <button
                  key={link.name}
                  onClick={() => handleScrollToSection(id)}
                  className={`block w-full text-left px-3 py-3 rounded-none text-[15px] font-semibold tracking-tight transition-colors ${
                    isActive 
                      ? 'text-german-red bg-neutral-100/50 font-bold border-l-2 border-german-red pl-2.5' 
                      : 'text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900'
                  }`}
                >
                  {link.name}
                </button>
              );
            })}
            
            <div className="pt-4 border-t border-neutral-200/80 flex flex-col space-y-3">
              <a
                href="https://wa.me/919131688225"
                target="_blank"
                rel="noreferrer"
                className="w-full bg-neutral-900 hover:bg-german-red text-white py-3 rounded-none text-[14px] font-bold text-center flex items-center justify-center space-x-2 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <MessageCircle className="w-4 h-4 text-emerald-400 fill-emerald-400/20" />
                <span>Enquire on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
