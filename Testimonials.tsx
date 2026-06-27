import React from 'react';
import { Calendar, Clock, Award, Play, ChevronRight } from 'lucide-react';
import { SystemSettings } from '../types';

interface HeroProps {
  settings: SystemSettings;
}

export default function Hero({ settings }: HeroProps) {
  const handleScrollToContact = () => {
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleScrollToA2 = () => {
    const element = document.getElementById('free-a2-series');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="relative min-h-[90vh] flex items-center bg-neutral-950 overflow-hidden">
      
      {/* Visual Background */}
      <div className="absolute inset-0 z-0">
        <img
          src={settings.heroBgUrl}
          alt="Berlin Skyline Brandenburg Gate"
          className="w-full h-full object-cover object-center opacity-45 scale-105 filter saturate-[0.85]"
          referrerPolicy="no-referrer"
        />
        {/* Dark overlay with soft vignette */}
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/95 via-neutral-950/85 to-neutral-950/70 z-10" />
      </div>

      {/* Content Container */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column Content */}
          <div className="lg:col-span-7 space-y-6 md:space-y-8 text-left">
            
            {/* Small Premium Label */}
            <div className="inline-block px-3.5 py-1.5 border border-german-red text-german-red text-[10px] font-bold tracking-[0.2em] uppercase font-mono">
              GERMAN LANGUAGE TRAINING · A1 TO B2
            </div>

            {/* Main Heading */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-display text-white tracking-tight leading-[1.15]">
              Learn German with <span className="text-german-gold">clarity</span>,<br />structure and <span className="text-white relative inline-block after:absolute after:bottom-1 after:left-0 after:h-[2px] after:w-full after:bg-german-red">real guidance</span>.
            </h1>

            {/* Supporting Text */}
            <p className="text-sm sm:text-base text-neutral-300 leading-relaxed max-w-2xl font-light">
              Comprehensive classes for students preparing for study, Ausbildung, and professional opportunities in Germany. Learn from Rajveer Sir with structured syllabus designs and interactive workshops.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-6 pt-2">
              <button
                onClick={handleScrollToContact}
                className="bg-german-red hover:bg-neutral-800 text-white px-8 py-3.5 rounded-none text-xs font-bold uppercase tracking-wider transition-colors duration-300 flex items-center justify-center space-x-2 cursor-pointer font-display"
              >
                <span>Enquire Now</span>
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                onClick={handleScrollToA2}
                className="text-white text-xs font-bold uppercase tracking-wider border-b-2 border-white pb-1 hover:text-german-gold hover:border-german-gold transition-colors flex items-center justify-center space-x-2 cursor-pointer font-display"
              >
                <Play className="w-3.5 h-3.5 text-german-gold fill-german-gold" />
                <span>Watch Free A2 Series</span>
              </button>
            </div>

            {/* Highlighted Information Row */}
            <div className="border-t border-white/10 pt-6 grid grid-cols-3 gap-4">
              <div className="space-y-1">
                <p className="text-[10px] uppercase tracking-wider text-neutral-400">Levels Supported</p>
                <p className="text-xs sm:text-sm font-semibold text-white font-mono">A1–B2 Levels</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] uppercase tracking-wider text-neutral-400">Duration per Level</p>
                <p className="text-xs sm:text-sm font-semibold text-white font-mono">2 Months</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] uppercase tracking-wider text-neutral-400">Batch Schedule</p>
                <p className="text-xs sm:text-sm font-semibold text-white font-mono">Monday–Friday</p>
              </div>
            </div>

          </div>

          {/* Right Column Programme Panel */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="bg-[rgba(20,20,20,0.58)] backdrop-blur-[12px] p-8 w-full max-w-sm shadow-2xl border border-white/20 rounded-[12px] flex flex-col space-y-6">
              
              <div className="border-b border-white/10 pb-4">
                {/* Accent Line */}
                <div className="w-12 h-0.5 bg-german-gold mb-3" />
                <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-[0.15em] font-mono">German Language Programme</h3>
                <p className="text-lg font-bold text-white font-display mt-1">A1 to B2 Levels</p>
              </div>

              {/* Specs List */}
              <div className="space-y-4">
                <div className="flex justify-between text-xs pb-2 border-b border-white/10">
                  <span className="text-neutral-400 font-medium">Duration</span>
                  <span className="font-semibold text-white">2 Months per Level</span>
                </div>
                <div className="flex justify-between text-xs pb-2 border-b border-white/10">
                  <span className="text-neutral-400 font-medium">Schedule</span>
                  <span className="font-semibold text-white">Monday to Friday Classes</span>
                </div>
                <div className="flex justify-between text-xs pb-1">
                  <span className="text-neutral-400 font-medium">Fee</span>
                  <div className="text-right">
                    <span className="text-base font-bold text-white font-display">₹16,000 per level</span>
                    <div className="text-[10px] text-neutral-400 line-through font-mono">₹18,000</div>
                  </div>
                </div>
              </div>

              {/* Small text block */}
              <div className="bg-white/5 p-4 border border-white/10 text-left rounded-[8px]">
                <p className="text-[11px] text-neutral-300 leading-relaxed font-light">
                  Current fee includes a ₹2,000 reduction per level.
                </p>
              </div>

              <a
                href="https://wa.me/919131688225"
                target="_blank"
                rel="noreferrer"
                className="w-full bg-german-red hover:bg-neutral-900 text-white py-3.5 rounded-none text-xs font-bold uppercase tracking-wider text-center transition-colors font-display cursor-pointer"
              >
                Enquire on WhatsApp
              </a>

            </div>
          </div>

        </div>
      </div>

    </section>
  );
}
