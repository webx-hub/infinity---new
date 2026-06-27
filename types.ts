import { Course, VideoItem, Testimonial, SystemSettings } from './types';

export const DEFAULT_COURSES: Course[] = [
  {
    id: 'course_1',
    number: '01',
    level: 'A1',
    title: 'Foundation',
    description: 'For students starting German from the beginning.',
    topics: [
      'Basic grammar & sentence structure',
      'Daily essential vocabulary',
      'Personal introductions & greetings',
      'Basic everyday conversations',
      'Pronunciation & listening practice'
    ],
    duration: '2 Months',
    schedule: 'Monday to Friday',
    fee: 16000,
    originalFee: 18000
  },
  {
    id: 'course_2',
    number: '02',
    level: 'A2',
    title: 'Elementary',
    description: 'For students who understand basic German and want to improve communication.',
    topics: [
      'Complex sentence formation',
      'Grammar consolidation & expansion',
      'Daily situational communication',
      'Interactive reading & writing tasks',
      'A2 Goethe exam preparation topics'
    ],
    duration: '2 Months',
    schedule: 'Monday to Friday',
    fee: 16000,
    originalFee: 18000
  },
  {
    id: 'course_3',
    number: '03',
    level: 'B1',
    title: 'Intermediate',
    description: 'For students preparing for Ausbildung, study, jobs or German exams.',
    topics: [
      'Advanced grammatical clauses',
      'Fluent speaking & debating confidence',
      'Structured professional writing',
      'Complex reading comprehension',
      'Full Goethe & ÖSD B1 exam preparation'
    ],
    duration: '2 Months',
    schedule: 'Monday to Friday',
    fee: 16000,
    originalFee: 18000
  },
  {
    id: 'course_4',
    number: '04',
    level: 'B2',
    title: 'Upper Intermediate',
    description: 'For students targeting professional, academic or higher-level German opportunities.',
    topics: [
      'Professional workplace communication',
      'Advanced syntax & stylistic nuances',
      'German job interview preparation',
      'Academic discussion & essay writing',
      'Goethe B2 exam strategies & practice'
    ],
    duration: '2 Months',
    schedule: 'Monday to Friday',
    fee: 16000,
    originalFee: 18000
  }
];

export const DEFAULT_VIDEOS: VideoItem[] = [
  {
    id: 'vid_1',
    title: 'German A1 Demo Class — Learn Basics Easily',
    type: 'youtube',
    url: 'https://www.youtube.com/watch?v=AHTcZG7p79o',
    thumbnail: 'https://img.youtube.com/vi/AHTcZG7p79o/maxresdefault.jpg',
    category: 'Demo'
  },
  {
    id: 'vid_2',
    title: 'Student Review — From A1 to B1 Goethe Exam Cleared',
    type: 'youtube',
    url: 'https://www.youtube.com/watch?v=AHTcZG7p79o',
    thumbnail: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=800&auto=format&fit=crop',
    category: 'Feedback'
  },
  {
    id: 'vid_3',
    title: 'Interactive Speaking & Pronunciation Workshop',
    type: 'youtube',
    url: 'https://www.youtube.com/watch?v=AHTcZG7p79o',
    thumbnail: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=800&auto=format&fit=crop',
    category: 'Practice'
  },
  {
    id: 'vid_4',
    title: 'How to Apply for Ausbildung & Study Visa in Germany',
    type: 'youtube',
    url: 'https://www.youtube.com/watch?v=AHTcZG7p79o',
    thumbnail: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=800&auto=format&fit=crop',
    category: 'Guidance'
  }
];

export const DEFAULT_TESTIMONIALS: Testimonial[] = [
  {
    id: 'test_1',
    name: 'Amanpreet Singh',
    level: 'B1 Student',
    review: 'Rajveer Sir explains complex German grammar in a highly clear, logical, and understandable way. The course structure and daily speaking sessions helped me clear my Goethe B1 exam in one go.',
    videoUrl: 'https://www.youtube.com/watch?v=AHTcZG7p79o'
  },
  {
    id: 'test_2',
    name: 'Sneha Sharma',
    level: 'A2 Student',
    review: 'The personalized guidance at Easy German is unparalleled. They don\'t just focus on finishing the book, they make sure you speak the language confidently in real-life scenarios. Highly recommended!',
    videoUrl: ''
  },
  {
    id: 'test_3',
    name: 'Rahul Verma',
    level: 'B2 Graduate',
    review: 'Excellent batch timing and interactive classes. The preparation resources and focus on vocabulary helped me secure an Ausbildung contract in Germany. Rajveer Sir is the best mentor.',
    videoUrl: 'https://www.youtube.com/watch?v=AHTcZG7p79o'
  }
];

export const DEFAULT_SETTINGS: SystemSettings = {
  phone: '9131688225',
  whatsapp: '9131688225',
  googleMapsShareUrl: 'https://maps.app.goo.gl/aW45dFEdrSxxczRf8',
  googleMapsEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3666.2754637777717!2d77.4328574!3d23.2330556!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x397c43dc2c2c2fbb%3A0xc6cf6d427d142171!2sEasy%20German%20by%20Rajveer%20Sir!5e0!3m2!1sen!2sin!4v1719223000000!5m2!1sen!2sin',
  youtubeChannelUrl: 'https://www.youtube.com/@easygermanbyrajveersir2553',
  instagramProfileUrl: 'https://www.instagram.com/easy_german_by_rajveer_sir',
  freeA2PlaylistUrl: 'https://www.youtube.com/watch?v=AHTcZG7p79o&list=PL8h9_rQ0QruaMOUls7hrDcc-6-Es__t7V',
  heroBgUrl: 'https://images.unsplash.com/photo-1599946347371-68eb71b16afc?q=80&w=1600&auto=format&fit=crop',
  teacherPhotoUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=800&auto=format&fit=crop'
};
