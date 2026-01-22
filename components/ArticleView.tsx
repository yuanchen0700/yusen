import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { BlogPost } from '../types';
import { getNextPrevPost } from '../utils/parser';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Calendar, Clock, Hash } from 'lucide-react';

interface ArticleViewProps {
  post: BlogPost;
  allPosts: BlogPost[];
}

export const ArticleView: React.FC<ArticleViewProps> = ({ post, allPosts }) => {
  const navigate = useNavigate();
  
  // Use Python-calculated links if available, otherwise fall back to client-side helper
  // (Client-side helper is useful if running in fallback mode without Python build)
  const clientSideLinks = getNextPrevPost(post.id, allPosts);
  
  const nextPost = post.nextPost || clientSideLinks.next;
  const prevPost = post.prevPost || clientSideLinks.prev;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 md:py-12 animate-fadeIn">
      {/* Header */}
      <header className="mb-10">
        <div className="flex flex-wrap gap-2 mb-4">
           <button 
             onClick={() => navigate('/')} // In real app, could filter by category
             className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors"
           >
             @{post.category}
           </button>
           {post.tags.map(tag => (
             <span key={tag} className="inline-flex items-center text-xs text-slate-500">
               <Hash size={10} className="mr-0.5" />{tag}
             </span>
           ))}
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
          {post.title}
        </h1>
        <div className="flex items-center text-sm text-slate-500 space-x-6 border-b border-slate-100 pb-8">
          <div className="flex items-center">
            <Calendar size={14} className="mr-2" />
            Created: {new Date(post.createdAt).toLocaleDateString()}
          </div>
          <div className="flex items-center">
             <Clock size={14} className="mr-2" />
             Updated: {new Date(post.updatedAt).toLocaleDateString()}
          </div>
        </div>
      </header>

      {/* Content */}
      <article className="prose prose-slate prose-lg max-w-none prose-headings:font-bold prose-a:text-primary prose-img:rounded-xl">
        <ReactMarkdown 
            remarkPlugins={[remarkGfm]}
            components={{
              // Custom components to style or handle logic
              img: ({node, ...props}) => (
                <div className="my-8">
                  <img {...props} className="rounded-lg shadow-md mx-auto block" alt={props.alt} />
                  {props.alt && <p className="text-center text-sm text-slate-400 mt-2 italic">{props.alt}</p>}
                </div>
              )
            }}
        >
          {post.content}
        </ReactMarkdown>
      </article>

      {/* Footer Navigation */}
      <div className="mt-16 pt-8 border-t border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-4">
        {nextPost ? (
          <Link to={`/post/${nextPost.id}`} className="group flex flex-col p-4 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/30 transition-all">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1 flex items-center">
              <ArrowLeft size={12} className="mr-1 group-hover:-translate-x-1 transition-transform" /> 
              Next Article
            </span>
            <span className="font-medium text-slate-700 group-hover:text-indigo-700 truncate">{nextPost.title}</span>
          </Link>
        ) : <div />}
        
        {prevPost ? (
          <Link to={`/post/${prevPost.id}`} className="group flex flex-col items-end p-4 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/30 transition-all text-right">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1 flex items-center">
              Previous Article
              <ArrowRight size={12} className="ml-1 group-hover:translate-x-1 transition-transform" /> 
            </span>
            <span className="font-medium text-slate-700 group-hover:text-indigo-700 truncate">{prevPost.title}</span>
          </Link>
        ) : <div />}
      </div>
    </div>
  );
};
