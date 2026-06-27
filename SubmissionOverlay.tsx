import React from 'react';
import { Youtube, Instagram, ArrowUpRight } from 'lucide-react';
import { SystemSettings } from '../types';

interface FreeResourcesProps {
  settings: SystemSettings;
}

export default function FreeResources({ settings }: FreeResourcesProps) {
  return (
    <section id="free-resources" className="py-20 lg:py-28 bg-white border-b border-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl text-left space-y-4 mb-16">
          <span className="text-[11px] font-bold tracking-widest text-german-red uppercase font-mono">
            LEARN BEYOND THE CLASSROOM
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-neutral-900 tracking-tight font-display">
            Free German learning resources.
          </h2>
          <p className="text-sm sm:text-base text-neutral-500 leading-relaxed font-light">
            Students can access free German learning videos, grammar guidance, demo lessons and short bite-sized content through our official social media channels. Learn correct pronunciation and test your knowledge anywhere.
          </p>
        </div>

        {/* Channels Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          
          {/* Card 1: YouTube */}
          <div className="border border-neutral-200/80 rounded-none p-6 sm:p-8 bg-neutral-50/50 hover:bg-neutral-50 hover:border-neutral-300 transition-all text-left flex flex-col justify-between">
            <div className="space-y-4">
              <div className="inline-flex p-3 bg-red-50 text-german-red rounded-none border border-red-100">
                <Youtube className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-neutral-900 font-display">
                  Learn with Easy German on YouTube
                </h3>
                <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed font-light">
                  Watch full-length German learning series, classroom demo recordings, pronunciation exercises, and tips for qualifying for Germany exams successfully.
                </p>
              </div>
            </div>
            <div className="pt-6">
              <a
                href={settings.youtubeChannelUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-neutral-900 hover:text-german-red transition-colors"
              >
                <span>Visit YouTube Channel</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Card 2: Instagram */}
          <div className="border border-neutral-200/80 rounded-none p-6 sm:p-8 bg-neutral-50/50 hover:bg-neutral-50 hover:border-neutral-300 transition-all text-left flex flex-col justify-between">
            <div className="space-y-4">
              <div className="inline-flex p-3 bg-amber-50 text-neutral-900 rounded-none border border-amber-100">
                <Instagram className="w-6 h-6 text-pink-600" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-neutral-900 font-display">
                  Follow Easy German on Instagram
                </h3>
                <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed font-light">
                  Get daily German words, fast vocabulary quizzes, direct student activities, offline class highlights, and instant updates on newly open language batches.
                </p>
              </div>
            </div>
            <div className="pt-6">
              <a
                href={settings.instagramProfileUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-neutral-900 hover:text-german-red transition-colors"
              >
                <span>Follow on Instagram</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
