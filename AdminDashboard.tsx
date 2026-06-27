import React, { useState, useEffect } from 'react';
import { Course, VideoItem, Testimonial, SystemSettings, Inquiry } from './types';
import { 
  DEFAULT_COURSES, DEFAULT_VIDEOS, DEFAULT_TESTIMONIALS, DEFAULT_SETTINGS 
} from './initialData';

// Import subcomponents
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Courses from './components/Courses';
import About from './components/About';
import FreeResources from './components/FreeResources';
import A2Series from './components/A2Series';
import Videos from './components/Videos';
import WhyChooseUs from './components/WhyChooseUs';
import Testimonials from './components/Testimonials';
import Contact from './components/Contact';
import Footer from './components/Footer';
import InquiryPopups from './components/InquiryPopups';

// Import newly created CRM & Firebase components
import SubmissionOverlay from './components/SubmissionOverlay';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import { submitEnquiry } from './lib/enquiryService';

import { MessageCircle } from 'lucide-react';

export default function App() {
  // Routing states
  const [currentPath, setCurrentPath] = useState(() => window.location.pathname);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => {
    return localStorage.getItem('eg_admin_session') === 'active' || 
           sessionStorage.getItem('eg_admin_session') === 'active';
  });

  // Global submission loader & success state
  const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  // Sync route location path Changes
  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
    };
  }, []);

  const navigate = (path: string) => {
    window.history.pushState(null, '', path);
    setCurrentPath(path);
  };

  // 1. Initialize states synchronized with localStorage
  const [courses, setCourses] = useState<Course[]>(() => {
    const saved = localStorage.getItem('eg_courses');
    return saved ? JSON.parse(saved) : DEFAULT_COURSES;
  });

  const [videos, setVideos] = useState<VideoItem[]>(() => {
    const saved = localStorage.getItem('eg_videos');
    return saved ? JSON.parse(saved) : DEFAULT_VIDEOS;
  });

  const [testimonials, setTestimonials] = useState<Testimonial[]>(() => {
    const saved = localStorage.getItem('eg_testimonials');
    return saved ? JSON.parse(saved) : DEFAULT_TESTIMONIALS;
  });

  const [settings, setSettings] = useState<SystemSettings>(() => {
    const saved = localStorage.getItem('eg_settings');
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  });

  const [inquiries, setInquiries] = useState<Inquiry[]>(() => {
    const saved = localStorage.getItem('eg_inquiries');
    return saved ? JSON.parse(saved) : [];
  });

  // 2. Auxiliary application states
  const [selectedLevel, setSelectedLevel] = useState<string>('A1');

  // 3. Save state updates to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('eg_courses', JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem('eg_videos', JSON.stringify(videos));
  }, [videos]);

  useEffect(() => {
    localStorage.setItem('eg_testimonials', JSON.stringify(testimonials));
  }, [testimonials]);

  useEffect(() => {
    localStorage.setItem('eg_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('eg_inquiries', JSON.stringify(inquiries));
  }, [inquiries]);

  // 4. Inject Dynamic SEO title, description, and rich structured JSON-LD schemas
  useEffect(() => {
    // Page metadata
    document.title = "Easy German by Rajveer Sir | German Language Classes A1 to B2";
    
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", "Learn German from A1 to B2 with Easy German by Rajveer Sir. Structured German language classes for study, Ausbildung, jobs and Germany-related opportunities.");
    } else {
      const meta = document.createElement('meta');
      meta.name = "description";
      meta.content = "Learn German from A1 to B2 with Easy German by Rajveer Sir. Structured German language classes for study, Ausbildung, jobs and Germany-related opportunities.";
      document.head.appendChild(meta);
    }

    // A. Local Business & Educational Org Schema
    const businessSchema = {
      "@context": "https://schema.org",
      "@type": ["LocalBusiness", "EducationalOrganization"],
      "name": "Easy German by Rajveer Sir",
      "image": settings.teacherPhotoUrl || "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=800",
      "telephone": settings.phone || "9131688225",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Bhopal",
        "addressRegion": "Madhya Pradesh",
        "addressCountry": "IN"
      },
      "url": window.location.href,
      "priceRange": "₹₹"
    };

    // B. Video Schema for featured demo class
    const videoSchema = {
      "@context": "https://schema.org",
      "@type": "VideoObject",
      "name": "German A1 Demo Class — Easy German by Rajveer Sir",
      "description": "Watch the complete A1 German language demo session with Rajveer Sir. Introduction to pronouns, conjugation, and greetings.",
      "thumbnailUrl": "https://img.youtube.com/vi/AHTcZG7p79o/maxresdefault.jpg",
      "uploadDate": "2026-06-24T08:00:00Z",
      "embedUrl": "https://www.youtube.com/embed/AHTcZG7p79o"
    };

    // C. FAQ Schema
    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is the duration for each German level?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Each level (A1, A2, B1, and B2) has a structured duration of exactly 2 Months of daily study."
          }
        },
        {
          "@type": "Question",
          "name": "What is the class schedule at Easy German?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Classes run from Monday to Friday with rigorous lessons, interactive talking clubs, and Goethe preparation modules."
          }
        },
        {
          "@type": "Question",
          "name": "How do I register for counselling?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "You can send an enquiry form directly on our portal, or contact our helpline via call or WhatsApp at +91 9131688225."
          }
        }
      ]
    };

    const injectSchemaScript = (scriptId: string, schemaObj: any) => {
      let script = document.getElementById(scriptId);
      if (!script) {
        script = document.createElement('script');
        script.id = scriptId;
        script.setAttribute('type', 'application/ld+json');
        document.head.appendChild(script);
      }
      script.innerHTML = JSON.stringify(schemaObj);
    };

    injectSchemaScript('eg-business-schema', businessSchema);
    injectSchemaScript('eg-video-schema', videoSchema);
    injectSchemaScript('eg-faq-schema', faqSchema);
  }, [settings]);

  // 5. Actions & Handlers
  const handleAddInquiry = async (newInq: Omit<Inquiry, 'id' | 'date'>) => {
    setSubmissionStatus('loading');

    // Human-friendly mapping for source form based on requested targets
    let resolvedSource = 'Website Form';
    if (newInq.source === 'popup') resolvedSource = 'Popup Form';
    else if (newInq.source === 'exit') resolvedSource = 'Exit Intent Popup';
    else if (newInq.source === 'inline') {
      if (newInq.purpose === 'Ausbildung') resolvedSource = 'Ausbildung';
      else if (newInq.purpose === 'Study in Germany') resolvedSource = "Bachelor's / Master's";
      else resolvedSource = 'Contact Page';
    }

    try {
      // 1. Submit to Firestore
      await submitEnquiry({
        name: newInq.name,
        phone: newInq.mobile,
        email: newInq.email || '',
        country: newInq.purpose || '',
        program: newInq.level || 'General German Language Class',
        message: newInq.message || '',
        source: resolvedSource
      });

      // 2. Transition to Premium Success animation
      setSubmissionStatus('success');

      // Sync local state as backup
      const fullInquiry: Inquiry = {
        ...newInq,
        id: `inq_${Date.now()}`,
        date: new Date().toISOString()
      };
      setInquiries(prev => [fullInquiry, ...prev]);

      // 3. Keep success state shown for premium experience, then close
      setTimeout(() => {
        setSubmissionStatus('idle');
      }, 3500);
    } catch (err) {
      console.error("Enquiry failed to submit in cloud database:", err);
      setSubmissionStatus('idle');
      alert("Enquiry could not be saved to our cloud server. Please check your internet connection and try again.");
    }
  };

  const handleSelectCourse = (level: string) => {
    setSelectedLevel(level);
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleResetToDefault = () => {
    setCourses(DEFAULT_COURSES);
    setVideos(DEFAULT_VIDEOS);
    setTestimonials(DEFAULT_TESTIMONIALS);
    setSettings(DEFAULT_SETTINGS);
    setInquiries([]);
    localStorage.removeItem('eg_courses');
    localStorage.removeItem('eg_videos');
    localStorage.removeItem('eg_testimonials');
    localStorage.removeItem('eg_settings');
    localStorage.removeItem('eg_inquiries');
  };

  if (currentPath === '/admin-login') {
    if (isAdminAuthenticated) {
      setTimeout(() => navigate('/admin'), 0);
      return null;
    }
    return (
      <AdminLogin 
        onLoginSuccess={() => {
          setIsAdminAuthenticated(true);
          navigate('/admin');
        }} 
        navigate={navigate} 
      />
    );
  }

  if (currentPath === '/admin') {
    if (!isAdminAuthenticated) {
      setTimeout(() => navigate('/admin-login'), 0);
      return null;
    }
    return (
      <AdminDashboard 
        onLogout={() => {
          setIsAdminAuthenticated(false);
          navigate('/admin-login');
        }} 
        navigate={navigate} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-warm-50 text-charcoal-900 flex flex-col relative select-none">
      
      {/* Global Submission Overlay */}
      <SubmissionOverlay status={submissionStatus} />
      
      {/* Dynamic Popups for Lead Capture */}
      <InquiryPopups onAddInquiry={handleAddInquiry} />

      {/* Sticky Premium Header */}
      <Navbar 
        phone={settings.phone} 
      />

      {/* Main Single Page Sections */}
      <main className="flex-1">
        
        {/* Hero Section */}
        <Hero settings={settings} />

        {/* Courses Section */}
        <Courses 
          courses={courses} 
          onSelectCourse={handleSelectCourse} 
        />

        {/* About Section */}
        <About settings={settings} />

        {/* Free Resources Section */}
        <FreeResources settings={settings} />

        {/* Free A2 Series Section */}
        <A2Series 
          settings={settings} 
          onSelectCourse={handleSelectCourse} 
        />

        {/* Video Gallery Section */}
        <Videos 
          videos={videos} 
          settings={settings} 
        />

        {/* Why Choose Us Section */}
        <WhyChooseUs />

        {/* Testimonials Section */}
        <Testimonials testimonials={testimonials} />

        {/* Registration & Maps Section */}
        <Contact 
          settings={settings}
          selectedLevel={selectedLevel}
          setSelectedLevel={setSelectedLevel}
          onAddInquiry={handleAddInquiry}
        />

      </main>

      {/* Minimalist Dark Footer */}
      <Footer 
        settings={settings} 
      />

      {/* 6. CONVERSION ASSETS: FLOATING TRIGGERS */}
      {/* A. Fixed Circular WhatsApp Action Button (Right Side) with Glassmorphism Tooltip */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col space-y-3">
        <a
          id="floating_whatsapp_fab"
          href="https://wa.me/919131688225"
          target="_blank"
          rel="noreferrer"
          className="w-14 h-14 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 group relative border border-emerald-400/20"
          title="Chat on WhatsApp"
        >
          <MessageCircle className="w-7 h-7 fill-white/10" />
          {/* Subtle Glassmorphism Tooltip on Hover */}
          <span className="absolute right-16 bg-[rgba(255,255,255,0.82)] backdrop-blur-[12px] border border-white/35 text-neutral-800 text-[12px] font-semibold tracking-wide px-3 py-1.5 rounded-[12px] shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
            Chat on WhatsApp
          </span>
        </a>
      </div>

    </div>
  );
}
