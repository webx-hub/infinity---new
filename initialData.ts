import React, { useState } from 'react';
import { Testimonial } from '../types';
import { Quote, Play, Youtube, X } from 'lucide-react';

interface TestimonialsProps {
  testimonials: Testimonial[];
}

export default function Testimonials({ testimonials }: TestimonialsProps) {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  // Helper to extract clean embed url
  const getEmbedUrl = (url: string) => {
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&]{11})/);
    return match && match[1] ? `https://www.youtube.com/embed/${match[1]}?autoplay=1` : url;
  };

  return (
    <section id="reviews" className="py-20 lg:py-28 bg-neutral-100 border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl text-left space-y-4 mb-16">
          <span className="text-[11px] font-bold tracking-widest text-german-red uppercase font-mono">
            TESTIMONIALS
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-neutral-900 tracking-tight font-display">
            Student experiences.
          </h2>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((test) => {
            // Get initials
            const initials = test.name
              .split(' ')
              .map((n) => n[0])
              .join('')
              .toUpperCase()
              .slice(0, 2);

            return (
              <div 
                key={test.id} 
                id={`testimonial_card_${test.id}`}
                className="bg-white rounded-none p-6 sm:p-8 border border-neutral-200 shadow-xs flex flex-col justify-between text-left space-y-6 relative group"
              >
                {/* Quote Icon */}
                <Quote className="absolute top-4 right-4 w-8 h-8 text-neutral-100 group-hover:text-neutral-200 transition-colors pointer-events-none" />

                <div className="space-y-4 relative z-10">
                  <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-light italic">
                    “{test.review}”
                  </p>
                </div>

                {/* Footer Info with Avatar initials */}
                <div className="flex items-center justify-between border-t border-neutral-100 pt-4 relative z-10">
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 bg-neutral-900 text-german-gold font-bold font-display text-xs flex items-center justify-center tracking-tighter uppercase shrink-0 rounded-none">
                      {initials}
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-bold text-neutral-900">{test.name}</p>
                      <p className="text-[10px] text-neutral-500 font-mono mt-0.5 uppercase tracking-wider">{test.level}</p>
                    </div>
                  </div>

                  {/* Play Video Testimonial Link if present */}
                  {test.videoUrl && (
                    <button
                      id={`play_video_test_${test.id}`}
                      onClick={() => setActiveVideo(test.videoUrl || null)}
                      className="p-2 bg-neutral-100 hover:bg-german-red text-neutral-700 hover:text-white rounded-none transition-all border border-neutral-200/80 hover:border-german-red shrink-0 cursor-pointer"
                      title="Watch Student Review"
                    >
                      <Play className="w-3 h-3 fill-current ml-0.5" />
                    </button>
                  )}
                </div>

              </div>
            );
          })}
        </div>

      </div>

      {/* Video Testimonial Modal Popup */}
      {activeVideo && (
        <div id="testimonial_video_modal" className="fixed inset-0 bg-neutral-950/90 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-4xl bg-black rounded-none overflow-hidden shadow-2xl border border-white/10 animate-scale-in">
            {/* Top Bar with title & close */}
            <div className="p-4 bg-neutral-900 border-b border-white/5 flex items-center justify-between text-white">
              <h3 className="text-xs sm:text-sm font-bold font-display flex items-center space-x-2">
                <Youtube className="w-4 h-4 text-red-500" />
                <span>Student Review Video</span>
              </h3>
              <button
                id="close_test_video_modal"
                onClick={() => setActiveVideo(null)}
                className="p-1.5 text-neutral-400 hover:text-white rounded-none bg-neutral-800 hover:bg-neutral-700 transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Embed Iframe Frame */}
            <div className="relative aspect-video">
              <iframe
                src={getEmbedUrl(activeVideo)}
                title="Student Video Review Player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      )}

    </section>
  );
}
