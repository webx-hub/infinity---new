import React from 'react';
import { Course } from '../types';
import { ArrowUpRight, Check, BookOpen } from 'lucide-react';

interface CoursesProps {
  courses: Course[];
  onSelectCourse: (level: string) => void;
}

export default function Courses({ courses, onSelectCourse }: CoursesProps) {
  return (
    <section id="courses" className="py-20 lg:py-28 bg-white border-b border-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl text-left space-y-4 mb-16">
          <span className="text-[11px] font-bold tracking-widest text-german-red uppercase font-mono">
            PROGRAMMES
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-neutral-900 tracking-tight font-display">
            Programmes designed around your level.
          </h2>
          <p className="text-sm sm:text-base text-neutral-500 leading-relaxed font-light">
            Choose the level based on your current German knowledge. Each program includes detailed grammar lessons, essential daily vocabulary, speaking clinics, listening exercises, and certified preparation models.
          </p>
        </div>

        {/* Course Rows */}
        <div id="course_rows_container" className="border-t border-neutral-200">
          {courses.map((course) => (
            <div 
              key={course.id} 
              id={`course_row_${course.level}`}
              className="py-10 border-b border-neutral-200 flex flex-col lg:grid lg:grid-cols-12 gap-8 lg:gap-6 items-start transition-all hover:bg-neutral-50/50 px-2 lg:px-4 rounded-none"
            >
              {/* Col 1: Large Level Number */}
              <div className="lg:col-span-1 text-left">
                <span className="text-4xl sm:text-5xl font-extrabold text-neutral-200 font-display block tracking-tight">
                  {course.number}
                </span>
                <span className="text-xs font-bold text-german-red uppercase tracking-wider font-mono block mt-1.5">
                  {course.level}
                </span>
              </div>

              {/* Col 2: Title & Detailed Description */}
              <div className="lg:col-span-4 space-y-3 text-left">
                <h3 className="text-lg font-bold text-neutral-900 font-display">
                  {course.level} — {course.title}
                </h3>
                <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed font-light">
                  {course.description}
                </p>
                {/* Embedded Bullet Points */}
                <div className="space-y-1.5 pt-1">
                  <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Key Focus Area:</p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-1.5 text-xs text-neutral-600">
                    {course.topics.map((topic, idx) => (
                      <li key={idx} className="flex items-start space-x-1.5">
                        <Check className="w-3.5 h-3.5 text-german-red shrink-0 mt-0.5" />
                        <span className="font-light">{topic}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Col 3: Practical Schedule & Details */}
              <div className="lg:col-span-4 space-y-4 text-left">
                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider font-mono">Programme Blueprint</p>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-4">
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-neutral-400 font-mono">DURATION</span>
                    <p className="text-xs font-bold text-neutral-800">{course.duration}</p>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-neutral-400 font-mono">TIMING SCHEDULE</span>
                    <p className="text-xs font-bold text-neutral-800">{course.schedule}</p>
                  </div>
                  <div className="space-y-0.5 col-span-2 sm:col-span-1 lg:col-span-2">
                    <span className="text-[10px] text-neutral-400 font-mono">FEES PER LEVEL</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-bold text-neutral-900 font-mono">₹{course.fee.toLocaleString()}</span>
                      <s className="text-xs text-neutral-400 font-mono">₹{course.originalFee.toLocaleString()}</s>
                    </div>
                  </div>
                </div>
              </div>

              {/* Col 4: Inquiry Call-to-Action Buttons */}
              <div className="lg:col-span-3 w-full flex items-center lg:justify-end">
                <button
                  id={`enquire_btn_${course.level}`}
                  onClick={() => onSelectCourse(course.level)}
                  className="w-full lg:w-auto bg-neutral-900 hover:bg-german-red text-white px-5 py-3 rounded-none text-xs font-bold font-display uppercase tracking-wider transition-colors duration-300 flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <span>Enquire for {course.level}</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
