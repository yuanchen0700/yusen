import React from 'react';
import { BlogPost } from '../types';
import { Link } from 'react-router-dom';
import { Calendar, ArrowRight, Hash } from 'lucide-react';

interface ArticleListProps {
  posts: BlogPost[];
  selectedCategory: string | null;
  selectedTag: string | null;
}

export const ArticleList: React.FC<ArticleListProps> = ({ posts, selectedCategory, selectedTag }) => {
  // Filter
  const filtered = posts.filter(post => {
    const catMatch = selectedCategory ? post.category === selectedCategory : true;
    const tagMatch = selectedTag ? post.tags.includes(selectedTag) : true;
    return catMatch && tagMatch;
  });

  // Sort by created date desc
  const sorted = filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  // Helper to clean preview text
  const getPreviewText = (content: string) => {
    const lines = content.split('\n');
    // 1. Filter out metadata lines (starting with #, @, or images) to avoid showing tags/titles in preview
    const bodyLines = lines.filter(line => {
      const trimmed = line.trim();
      if (!trimmed) return false;
      // Skip Metadata/Header lines
      if (trimmed.startsWith('#') || trimmed.startsWith('＃')) return false; 
      if (trimmed.startsWith('@') || trimmed.startsWith('＠')) return false;
      // Skip Images
      if (trimmed.startsWith('![')) return false;
      return true;
    });

    // 2. Join and strip any remaining inline markdown syntax
    const cleanText = bodyLines.join(' ')
      .replace(/(\*\*|__)(.*?)\1/g, '$2') // Bold
      .replace(/(\*|_)(.*?)\1/g, '$2')   // Italic
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Links
      .replace(/`([^`]+)`/g, '$1');      // Inline Code

    return cleanText.substring(0, 160) + (cleanText.length > 160 ? '...' : '');
  };

  if (sorted.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-slate-400">
        <p className="text-xl">No posts found.</p>
        <button onClick={() => window.location.reload()} className="mt-4 text-primary hover:underline">Clear filters</button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800">
          {selectedCategory ? `${selectedCategory} Articles` : selectedTag ? `#${selectedTag} Articles` : 'Latest Articles'}
        </h2>
        <p className="text-slate-500 mt-1">Found {sorted.length} posts</p>
      </div>

      <div className="space-y-6">
        {sorted.map((post) => (
          <Link to={`/post/${post.id}`} key={post.id} className="block group">
            <article className="bg-white rounded-2xl p-6 md:p-8 border border-slate-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
               {/* Decorative accent */}
               <div className="absolute top-0 left-0 w-1 h-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity"></div>

               <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                 <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 text-slate-600 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                        @{post.category}
                      </span>
                      <div className="flex gap-2">
                        {post.tags.slice(0, 3).map(t => (
                          <span key={t} className="inline-flex items-center text-xs text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded">
                            <Hash size={10} className="mr-0.5 opacity-50"/> {t}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <h3 className="text-xl md:text-2xl font-bold text-slate-800 mb-3 group-hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    
                    <p className="text-slate-500 line-clamp-3 mb-4 leading-relaxed font-serif text-sm md:text-base">
                      {getPreviewText(post.content)}
                    </p>
                 </div>
               </div>

               <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-50">
                  <div className="flex items-center text-xs text-slate-400 font-medium">
                    <Calendar size={14} className="mr-1.5" />
                    {new Date(post.createdAt).toLocaleDateString()}
                  </div>
                  <span className="flex items-center text-sm font-semibold text-primary opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all duration-300">
                    Read Article <ArrowRight size={16} className="ml-1" />
                  </span>
               </div>
            </article>
          </Link>
        ))}
      </div>
    </div>
  );
};
