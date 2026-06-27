import React from 'react';
import { Compass, BookOpen, MessageSquare, HelpCircle, GraduationCap, Target } from 'lucide-react';

export default function WhyChooseUs() {
  return (
    <section id="why-choose-us" className="py-20 lg:py-24 bg-neutral-50 border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl text-left space-y-4 mb-16">
          <span className="text-[11px] font-bold tracking-widest text-german-red uppercase font-mono">
            WHY CHOOSE US
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-neutral-900 tracking-tight font-display">
            What students receive.
          </h2>
        </div>

        {/* Deliverables Double Column */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16 items-start text-left">
          
          {/* Left Column */}
          <div className="space-y-8">
            <div className="flex items-start space-x-4">
              <div className="p-2 bg-neutral-200 text-neutral-800 rounded-none shrink-0">
                <GraduationCap className="w-5 h-5 text-german-red" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-neutral-900">Structured learning from A1 to B2</h4>
                <p className="text-xs sm:text-sm text-neutral-500 font-light leading-relaxed">
                  Every level has a clear schedule, custom study materials, and rigorous module exams to ensure complete assimilation of topics before moving ahead.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="p-2 bg-neutral-200 text-neutral-800 rounded-none shrink-0">
                <BookOpen className="w-5 h-5 text-german-red" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-neutral-900">Clear grammar explanation</h4>
                <p className="text-xs sm:text-sm text-neutral-500 font-light leading-relaxed">
                  Complex German grammar rules are simplified into clear logical formulas. We break down declensions, cases, and word orders with extensive bilingual practice.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="p-2 bg-neutral-200 text-neutral-800 rounded-none shrink-0">
                <MessageSquare className="w-5 h-5 text-german-red" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-neutral-900">Regular speaking practice</h4>
                <p className="text-xs sm:text-sm text-neutral-500 font-light leading-relaxed">
                  Avoid static reading; participate in daily interactive dialogue workshops, simulated roleplays, and correct conversational pronunciation reviews.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            <div className="flex items-start space-x-4">
              <div className="p-2 bg-neutral-200 text-neutral-800 rounded-none shrink-0">
                <HelpCircle className="w-5 h-5 text-german-red" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-neutral-900">Course guidance and support</h4>
                <p className="text-xs sm:text-sm text-neutral-500 font-light leading-relaxed">
                  Students have regular evaluation checks, mock visa interviews, and direct guidance for Goethe exam booking processes.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="p-2 bg-neutral-200 text-neutral-800 rounded-none shrink-0">
                <Target className="w-5 h-5 text-german-red" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-neutral-900">Practical preparation for Germany goals</h4>
                <p className="text-xs sm:text-sm text-neutral-500 font-light leading-relaxed">
                  Whether targeting study admissions, Ausbildung contracts, or employment opportunities, our training directly matches your functional target requirements.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="p-2 bg-neutral-200 text-neutral-800 rounded-none shrink-0">
                <Compass className="w-5 h-5 text-german-red" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-neutral-900">Focused learning environment</h4>
                <p className="text-xs sm:text-sm text-neutral-500 font-light leading-relaxed">
                  No distractions. Small batch sizes with highly motivated peers who share similar professional dreams of migrating or studying in Germany.
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Subtle Bottom Quote */}
        <div className="mt-16 sm:mt-20 border-t border-neutral-300 pt-8 text-center max-w-3xl mx-auto">
          <p className="text-sm sm:text-base font-light italic text-neutral-600 leading-relaxed font-display">
            “The aim is not only to complete a level, but to understand and use the language with confidence in the real world.”
          </p>
        </div>

      </div>
    </section>
  );
}
