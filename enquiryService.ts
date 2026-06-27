import React, { useState } from 'react';
import { Play, Youtube, Instagram, ExternalLink, X } from 'lucide-react';
import { VideoItem, SystemSettings } from '../types';

interface VideosProps {
  videos: VideoItem[];
  settings: SystemSettings;
}

export default function Videos({ videos, settings }: VideosProps) {
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);

  // Separate featured video from the secondary thumbnails
  const featuredVideo = videos[0] || null;
  const secondaryVideos = videos.slice(1, 4); // Show up to 3 thumbnails

  // Helper to resolve clean embeddable link for popup
  const getEmbedUrl = (url: string) => {
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&]{11})/);
      if (match && match[1]) {
        return `https://www.youtube.com/embed/${match[1]}?autoplay=1`;
      }
    }
    return url; // Return original if not a standard watch link
  };

  return (
    <section id="videos" className="py-20 lg:py-28 bg-white border-b border-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl text-left space-y-4 mb-16">
          <span className="text-[11px] font-bold tracking-widest text-german-red uppercase font-mono">
            VIDEOS
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-neutral-900 tracking-tight font-display">
            See how the classes work.
          </h2>
          <p className="text-sm sm:text-base text-neutral-500 leading-relaxed font-light">
            Watch real class demos, sample speaking practice circles, and personal feedback from students who achieved their goals.
          </p>
        </div>

        {/* Video Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          
          {/* Left Column: One Large Featured Video */}
          {featuredVideo && (
            <div className="lg:col-span-7 flex flex-col justify-between text-left">
              <div 
                id={`video_thumbnail_${featuredVideo.id}`}
                onClick={() => setSelectedVideo(featuredVideo)}
                className="relative group aspect-video rounded-none overflow-hidden shadow-xl border border-neutral-200/80 bg-neutral-950 cursor-pointer"
              >
                <img
                  src={featuredVideo.thumbnail}
                  alt={featuredVideo.title}
                  className="w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                {/* Visual Overlay */}
                <div className="absolute inset-0 bg-neutral-900/10 group-hover:bg-neutral-900/30 transition-all z-10 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-german-red/90 group-hover:bg-german-red text-white flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                    <Play className="w-6 h-6 fill-white ml-1" />
                  </div>
                </div>
                {/* Badge */}
                <span className="absolute top-4 left-4 bg-german-red text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-none z-20 font-mono">
                  Featured Class Demo
                </span>
              </div>
              
              <div className="mt-4">
                <h3 className="text-lg font-bold text-neutral-900 font-display">
                  {featuredVideo.title}
                </h3>
                <p className="text-xs text-neutral-500 mt-1">Get an inside look at Rajveer Sir's structured, clear grammar explanations and teaching style.</p>
              </div>
            </div>
          )}

          {/* Right Column: Three smaller video thumbnails */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider font-mono text-left">More Class Previews & Guides</p>
              
              <div className="space-y-3">
                {secondaryVideos.map((vid) => (
                  <div
                    key={vid.id}
                    id={`video_thumbnail_${vid.id}`}
                    onClick={() => setSelectedVideo(vid)}
                    className="flex items-center space-x-4 p-2 rounded-none border border-neutral-200/60 hover:border-neutral-300 bg-neutral-50/50 hover:bg-neutral-50 transition-all cursor-pointer text-left group"
                  >
                    <div className="relative w-28 aspect-video rounded-none overflow-hidden shrink-0 bg-neutral-900 border border-neutral-200">
                      <img
                        src={vid.thumbnail}
                        alt={vid.title}
                        className="w-full h-full object-cover opacity-90"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/30 transition-all">
                        <div className="w-8 h-8 rounded-full bg-neutral-950/80 text-white flex items-center justify-center">
                          <Play className="w-3.5 h-3.5 fill-white ml-0.5" />
                        </div>
                      </div>
                    </div>
                    <div className="min-w-0">
                      <span className="text-[9px] font-bold text-german-red uppercase tracking-wider font-mono bg-german-red/10 px-1.5 py-0.5 rounded-none">
                        {vid.category}
                      </span>
                      <h4 className="text-xs sm:text-sm font-semibold text-neutral-900 mt-1.5 truncate group-hover:text-german-red transition-colors" title={vid.title}>
                        {vid.title}
                      </h4>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick social links */}
            <div className="pt-4 border-t border-neutral-100 flex flex-col sm:flex-row sm:items-center gap-4 text-left">
              <a
                href={settings.youtubeChannelUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center space-x-2 bg-neutral-900 hover:bg-neutral-800 text-white px-4 py-2.5 rounded-none text-xs font-bold uppercase tracking-wider transition-all"
              >
                <Youtube className="w-4 h-4 text-red-500" />
                <span>View All on YouTube</span>
              </a>
              <a
                href={settings.instagramProfileUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-neutral-600 hover:text-neutral-950 transition-all py-1"
              >
                <Instagram className="w-4 h-4 text-pink-600" />
                <span>View Instagram Reels</span>
              </a>
            </div>
          </div>

        </div>

      </div>

      {/* Video Modal Popup */}
      {selectedVideo && (
        <div id="video_modal" className="fixed inset-0 bg-neutral-950/90 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-4xl bg-black rounded-none overflow-hidden shadow-2xl border border-white/10">
            {/* Top Bar with title & close */}
            <div className="p-4 bg-neutral-900 border-b border-white/5 flex items-center justify-between text-white">
              <h3 className="text-xs sm:text-sm font-bold font-display truncate max-w-md">{selectedVideo.title}</h3>
              <button
                id="close_video_modal"
                onClick={() => setSelectedVideo(null)}
                className="p-1 text-neutral-400 hover:text-white rounded-full bg-neutral-800 hover:bg-neutral-700 transition-all cursor-pointer"
                title="Close Player"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Embed Iframe Frame */}
            <div className="relative aspect-video">
              {selectedVideo.url.includes('youtube.com') || selectedVideo.url.includes('youtu.be') ? (
                <iframe
                  src={getEmbedUrl(selectedVideo.url)}
                  title={selectedVideo.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              ) : selectedVideo.url.endsWith('.mp4') ? (
                <video
                  src={selectedVideo.url}
                  controls
                  autoPlay
                  className="absolute inset-0 w-full h-full object-contain"
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 bg-neutral-900 text-neutral-300">
                  <p className="text-sm">Cannot stream this external source directly inside the frame.</p>
                  <a
                    href={selectedVideo.url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 bg-white text-neutral-900 px-4 py-2 rounded text-xs font-bold uppercase tracking-wider inline-flex items-center space-x-1.5"
                  >
                    <span>View Link Externally</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </section>
  );
}
