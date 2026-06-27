import React, { useState } from 'react';
import { Youtube, Instagram, MessageCircle } from 'lucide-react';
import { SystemSettings } from '../types';

interface FooterProps {
  settings: SystemSettings;
}

export default function Footer({ settings }: FooterProps) {
  const [logoError, setLogoError] = useState(false);
  const footerLinks = [
    { name: 'Courses', href: '#courses' },
    { name: 'About Us', href: '#about' },
    { name: 'Free A2 Series', href: '#free-a2-series' },
    { name: 'Videos', href: '#videos' },
    { name: 'Student Reviews', href: '#reviews' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <footer className="bg-neutral-950 text-white pt-16 pb-8 border-t border-neutral-900 text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start pb-12 border-b border-neutral-900">
          
          {/* Brand Col */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center space-x-3">
              {!logoError ? (
                <div className="flex items-center space-x-3">
                  <img
                    src="/whatsapp image 2026-06-24 at 7.29.31 PM.jpeg"
                    alt="Easy German by Rajveer Sir"
                    referrerPolicy="no-referrer"
                    onError={() => setLogoError(true)}
                    className="h-12 w-auto object-contain shrink-0"
                  />
                  <div className="h-5 w-px bg-neutral-800" />
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider font-sans">
                    GERMAN LANGUAGE INSTITUTE
                  </span>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <span className="w-9 h-9 bg-neutral-900 text-german-gold rounded-none font-extrabold font-display text-base flex items-center justify-center tracking-tighter border border-neutral-800">
                    EG
                  </span>
                  <span className="text-base font-bold font-display tracking-tight text-white">
                    Easy German by Rajveer Sir
                  </span>
                </div>
              )}
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed max-w-sm font-light">
              Premium German language training institute guiding students properly through structured modules from A1 level up to Upper Intermediate B2.
            </p>
            {/* Quick social shortcuts */}
            <div className="flex items-center space-x-3 pt-2">
              <a
                href={settings.youtubeChannelUrl}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-none bg-neutral-900 hover:bg-german-red hover:text-white flex items-center justify-center text-neutral-400 transition-colors"
                title="YouTube Channel"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a
                href={settings.instagramProfileUrl}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-none bg-neutral-900 hover:bg-german-red hover:text-white flex items-center justify-center text-neutral-400 transition-colors"
                title="Instagram Profile"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://wa.me/919131688225"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-none bg-neutral-900 hover:bg-german-red hover:text-white flex items-center justify-center text-neutral-400 transition-colors"
                title="WhatsApp Direct"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Links Col */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-400 font-mono">Quick Navigation</h4>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
              {footerLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-neutral-400 hover:text-white transition-colors"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>

          {/* Contact Col */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-400 font-mono">Student Helpdesk</h4>
            <div className="space-y-1">
              <p className="text-[10px] text-neutral-500 font-mono">WHATSAPP SUPPORT</p>
              <a 
                href="https://wa.me/919131688225" 
                target="_blank" 
                rel="noreferrer" 
                className="text-sm font-bold text-white hover:text-german-gold transition-colors font-mono block flex items-center space-x-1.5"
              >
                <MessageCircle className="w-4 h-4 text-emerald-500 fill-emerald-500/20" />
                <span>WhatsApp: 9131688225</span>
              </a>
              <p className="text-[10px] text-neutral-400 mt-2 font-light">Easy German by Rajveer Sir, Bhopal, MP, India</p>
            </div>
          </div>

        </div>

        {/* Bottom Bar without Admin Gate */}
        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center text-xs text-neutral-500 space-y-4 sm:space-y-0">
          <p>© 2026 Easy German by Rajveer Sir. All rights reserved.</p>
        </div>

      </div>
    </footer>
  );
}
