import React from 'react';
import { BlogPost } from '../types';
import { Mail, Github, Twitter, X, Hash, Layers } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

interface SidebarProps {
  posts: BlogPost[];
  isOpen: boolean;
  onClose: () => void;
  selectedCategory: string | null;
  onSelectCategory: (cat: string | null) => void;
  selectedTag: string | null;
  onSelectTag: (tag: string | null) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  posts,
  isOpen,
  onClose,
  selectedCategory,
  onSelectCategory,
  selectedTag,
  onSelectTag,
}) => {
  const navigate = useNavigate();
  // Extract unique categories and tags
  const categories = Array.from(new Set(posts.map((p) => p.category))).sort();
  const tags = Array.from(new Set(posts.flatMap((p) => p.tags))).sort();

  const handleCategoryClick = (cat: string | null) => {
    onSelectCategory(cat);
    // Force navigation to home to ensure the list is visible
    navigate('/'); 
    onClose();
  };

  const handleTagClick = (tag: string | null) => {
    // Toggle tag logic: if clicking the same tag, clear it
    const newTag = selectedTag === tag ? null : tag;
    onSelectTag(newTag);
    navigate('/');
    onClose();
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-72 bg-surface border-r border-slate-200 shadow-xl md:shadow-none transition-transform duration-300 ease-in-out md:translate-x-0 md:static ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } flex flex-col`}
      >
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-indigo-600 font-mono tracking-tighter" onClick={() => {
             onSelectCategory(null);
             onSelectTag(null);
             onClose();
          }}>
            ZENITH.MD
          </Link>
          <button onClick={onClose} className="md:hidden text-slate-400 hover:text-slate-800">
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-6 space-y-8">
          
          {/* Categories Section */}
          <div>
            <div className="flex items-center space-x-2 text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
              <Layers size={14} />
              <span>Categories</span>
            </div>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => handleCategoryClick(null)}
                  className={`block w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                    selectedCategory === null ? 'bg-primary/10 text-primary font-medium' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  All Posts
                </button>
              </li>
              {categories.map((cat) => (
                <li key={cat}>
                  <button
                    onClick={() => handleCategoryClick(cat)}
                    className={`flex items-center w-full text-left px-3 py-2 rounded-md text-sm transition-colors group ${
                      selectedCategory === cat ? 'bg-primary/10 text-primary font-medium' : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span>{cat}</span>
                    <span className="ml-auto text-xs opacity-50 bg-slate-200 px-1.5 py-0.5 rounded-full group-hover:bg-slate-300">
                      {posts.filter(p => p.category === cat).length}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Tags Section */}
          <div>
            <div className="flex items-center space-x-2 text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
              <Hash size={14} />
              <span>Trending Tags</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => handleTagClick(tag)}
                  className={`text-xs px-2.5 py-1 rounded-full border transition-all ${
                    selectedTag === tag 
                      ? 'bg-primary text-white border-primary shadow-md' 
                      : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:text-slate-700'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </nav>

        {/* Footer / About Me */}
        <div className="p-6 border-t border-slate-100 bg-slate-50/50">
          <div className="flex items-center space-x-4">
            <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-lg">
              Z
            </div>
            <div>
              <p className="text-sm font-medium text-slate-800">About Me</p>
              <p className="text-xs text-slate-500">Python & React Dev</p>
            </div>
          </div>
          <div className="mt-4 flex space-x-4 text-slate-400">
             <a href="#" className="hover:text-primary transition-colors"><Github size={18} /></a>
             <a href="#" className="hover:text-blue-400 transition-colors"><Twitter size={18} /></a>
             <a href="mailto:hello@example.com" className="hover:text-red-400 transition-colors"><Mail size={18} /></a>
          </div>
        </div>
      </aside>
    </>
  );
};