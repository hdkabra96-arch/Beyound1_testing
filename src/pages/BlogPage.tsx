import React from 'react';
import { BLOG_POSTS } from '../data/public-content';
import { BookOpen, Clock, User, ArrowRight } from 'lucide-react';

export const BlogPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-12">
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 text-xs font-bold">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Educational Insights</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Beyond Classroom Blog
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Articles, research, and tips for parents and teachers on removing math anxiety and building visual conceptual understanding.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {BLOG_POSTS.map((post) => (
          <div
            key={post.id}
            className="rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 shadow-xl overflow-hidden flex flex-col justify-between group hover:-translate-y-1 transition-transform"
          >
            <div className="space-y-4 p-6">
              <div className="relative h-48 rounded-2xl overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-slate-900/80 text-amber-400 text-[10px] font-bold backdrop-blur-md">
                  {post.gradeLevel}
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-3 text-[11px] text-slate-400">
                  <span className="flex items-center gap-1"><User className="w-3 h-3 text-indigo-400" /> {post.author}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-emerald-400" /> {post.readTime}</span>
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white line-clamp-2">{post.title}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">{post.excerpt}</p>
              </div>
            </div>

            <div className="p-6 pt-0 border-t border-slate-200/40 dark:border-slate-800/60 mt-auto">
              <button className="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 hover:underline cursor-pointer">
                <span>Read Full Article</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
