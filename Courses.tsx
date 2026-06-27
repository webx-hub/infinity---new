import React from 'react';
import { Shield, Sparkles, GraduationCap, CheckCircle } from 'lucide-react';
import { SystemSettings } from '../types';

interface AboutProps {
  settings: SystemSettings;
}

export default function About({ settings }: AboutProps) {
  const handleScrollToContact = () => {
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const checkPoints = [
    'Structured level-wise learning with detailed manuals',
    'Clear, logical grammar explanations in standard English & Hindi',
    'Regular speaking practice & real-time communication clinics',
    'Guidance for Ausbildung, Study Visa, & German Job roadmap'
  ];

  return (
    <section id="about" className="py-20 lg:py-28 bg-neutral-100 border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Portrait Area */}
          <div className="lg:col-span-5 flex justify-center">
            <div id="portrait_container" className="relative group max-w-sm lg:max-w-none w-full">
              {/* Decorative clean offset border for premium touch */}
              <div className="absolute -inset-2 border border-neutral-300 z-0 transform translate-x-2 translate-y-2 group-hover:translate-x-1 group-hover:translate-y-1 transition-transform" />
              <div className="relative z-10 bg-white p-3 shadow-lg border border-neutral-200 overflow-hidden rounded-none">
                <img
                  src={settings.teacherPhotoUrl}
                  alt="Rajveer Sir Portrait"
                  className="w-full aspect-[4/5] object-cover filter grayscale group-hover:grayscale-0 transition-all duration-500 rounded-none"
                  referrerPolicy="no-referrer"
                />
                <div className="pt-3 text-center">
                  <p className="text-sm font-bold text-neutral-950 font-display">Rajveer Sir</p>
                  <p className="text-[10px] text-neutral-500 uppercase font-mono mt-0.5">Founder & Lead Trainer</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Information & Points */}
          <div className="lg:col-span-7 space-y-6 md:space-y-8 text-left">
            
            <div className="space-y-3">
              <span className="text-[11px] font-bold tracking-widest text-german-red uppercase font-mono block">
                ABOUT EASY GERMAN
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-neutral-900 tracking-tight font-display">
                A practical approach to learning German.
              </h2>
            </div>

            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-light">
              Easy German by Rajveer Sir provides highly structured German language training from beginner A1 to upper intermediate B2. The entire curriculum is focused on helping students understand the grammatical mechanics properly, communicate with natural confidence, and prepare strategically for their study, jobs, or Ausbildung visa interviews.
            </p>

            {/* Checkpoints Grid */}
            <div className="space-y-3.5 pt-2">
              {checkPoints.map((point, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="mt-1 flex items-center justify-center shrink-0">
                    <CheckCircle className="w-4 h-4 text-german-red" />
                  </div>
                  <span className="text-xs sm:text-sm text-neutral-700 font-medium leading-tight">
                    {point}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-4">
              <button
                id="speak_with_us_btn"
                onClick={handleScrollToContact}
                className="bg-neutral-900 hover:bg-german-red text-white px-6 py-3 rounded-none text-xs font-bold font-display uppercase tracking-wider transition-colors duration-300 cursor-pointer"
              >
                Speak With Us
              </button>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
