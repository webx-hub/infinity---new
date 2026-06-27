import React from 'react';
import { Play, Check, Youtube, ArrowRight } from 'lucide-react';
import { SystemSettings } from '../types';

interface A2SeriesProps {
  settings: SystemSettings;
  onSelectCourse: (level: string) => void;
}

export default function A2Series({ settings, onSelectCourse }: A2SeriesProps) {
  // Convert watch playlist link to embeds format for secure iframe rendering
  const embedUrl = 'https://www.youtube.com/embed/AHTcZG7p79o?list=PL8h9_rQ0QruaMOUls7hrDcc-6-Es__t7V';

  const seriesPoints = [
    'Complete free A2 level syllabus learning videos',
    'Interactive grammar consolidation & vocabulary logs',
    'Self-paced learning structure with no schedule lock',
    'Excellent source for rapid exam revisions or demo',
    'Seamless streaming directly on YouTube or embedded'
  ];

  return (
    <section id="free-a2-series" className="py-20 lg:py-28 bg-neutral-100 border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl text-left space-y-4 mb-16">
          <span className="text-[11px] font-bold tracking-widest text-german-red uppercase font-mono">
            FREE LEARNING SERIES
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-neutral-900 tracking-tight font-display">
            Free German A2 Series
          </h2>
          <p className="text-sm sm:text-base text-neutral-500 leading-relaxed font-light">
            A free video series for students who want to understand German A2, revise important concepts, or build foundational fluency at their own pace.
          </p>
        </div>

        {/* Video & Specs Double Column */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Column: Embed Player */}
          <div className="lg:col-span-6 w-full">
            <div className="relative aspect-video rounded-none overflow-hidden shadow-xl border border-neutral-200 bg-black">
              <iframe
                src={embedUrl}
                title="Free German A2 Series Playlist"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          {/* Right Column: Key details */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <div>
              <h3 className="text-xl font-bold text-neutral-900 font-display">
                German A2 Free Series Playlist
              </h3>
              <p className="text-xs text-neutral-500 mt-1">Uploaded and managed by Rajveer Sir</p>
            </div>

            {/* Checklist */}
            <div className="space-y-3">
              {seriesPoints.map((point, idx) => (
                <div key={idx} className="flex items-start space-x-2.5">
                  <div className="p-0.5 bg-neutral-200 text-neutral-800 rounded-none mt-0.5">
                    <Check className="w-3.5 h-3.5 text-german-red" />
                  </div>
                  <span className="text-xs sm:text-sm text-neutral-700 font-light">
                    {point}
                  </span>
                </div>
              ))}
            </div>

            {/* Actions Grid */}
            <div className="pt-2 space-y-4">
              <a
                href={settings.freeA2PlaylistUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center space-x-2.5 bg-neutral-900 hover:bg-neutral-800 text-white px-5 py-3 rounded-none text-xs font-bold font-display uppercase tracking-wider transition-colors"
              >
                <Youtube className="w-4 h-4 text-red-500" />
                <span>Watch Full A2 Playlist</span>
              </a>

              <div className="border-t border-neutral-200 pt-4 space-y-3">
                <p className="text-xs text-neutral-500 leading-relaxed max-w-md">
                  For complete structured learning, interactive live speaking practice, personal homework evaluations, and personal guidance, students can join our active program batch.
                </p>
                
                <button
                  onClick={() => onSelectCourse('A2')}
                  className="inline-flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-german-red hover:text-neutral-950 transition-colors cursor-pointer"
                >
                  <span>Enquire for A2 Course</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
