import React, { useState, useEffect } from 'react';
import { HashRouter, Route, Routes, useParams } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { ArticleList } from './components/ArticleList';
import { ArticleView } from './components/ArticleView';
import { MOCK_MARKDOWN_FILES } from './services/mockData';
import { parseMarkdownPost } from './utils/parser';
import { BlogPost, GeneratorStats } from './types';
import { Menu } from 'lucide-react';

// Wrapper to get ID from params
const PostRoute = ({ posts }: { posts: BlogPost[] }) => {
  const { id } = useParams();
  const post = posts.find(p => p.id === id);
  if (!post) return <div className="p-10 text-center text-slate-500">Post not found</div>;
  return <ArticleView post={post} allPosts={posts} />;
};

export default function App() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [stats, setStats] = useState<GeneratorStats | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Attempt to load the Python-generated JSON data
    fetch('/blog_data.json')
      .then(res => {
        if (!res.ok) throw new Error("No generated data found");
        return res.json();
      })
      .then((data: BlogPost[]) => {
        setPosts(data);
        if (data.length > 0) {
            setStats({
                totalPosts: data.length,
                newlyGenerated: 0, 
                lastGeneratedPost: { title: data[0].title, date: data[0].createdAt }
            });
        }
        setLoading(false);
      })
      .catch(err => {
        console.warn("Could not load blog_data.json, falling back to mock data.", err);
        // Fallback to client-side parsing for demo/development if Python script hasn't run
        const parsedPosts = MOCK_MARKDOWN_FILES.map(file => 
          parseMarkdownPost(file.filename, file.content, file.createdAt, file.updatedAt)
        );
        // Sort explicitly if using mock
        parsedPosts.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setPosts(parsedPosts);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="flex h-screen items-center justify-center text-slate-400">Loading Blog...</div>;

  return (
    <HashRouter>
      <div className="flex min-h-screen bg-background text-slate-800 font-sans">
        
        {/* Sidebar Navigation */}
        <Sidebar 
          posts={posts} 
          isOpen={isMobileMenuOpen} 
          onClose={() => setIsMobileMenuOpen(false)}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          selectedTag={selectedTag}
          onSelectTag={setSelectedTag}
        />

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col min-w-0 transition-all duration-300">
          
          {/* Mobile Header */}
          <header className="sticky top-0 z-30 bg-surface/80 backdrop-blur-md border-b border-slate-200 px-4 h-16 flex items-center md:hidden justify-between">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-md"
            >
              <Menu size={24} />
            </button>
            <span className="font-bold text-lg text-slate-800">Zenith</span>
            <div className="w-8" /> {/* Spacer */}
          </header>

          <div className="flex-1 overflow-auto">
            <Routes>
              <Route path="/" element={
                <ArticleList 
                  posts={posts} 
                  selectedCategory={selectedCategory}
                  selectedTag={selectedTag}
                />
              } />
              <Route path="/post/:id" element={<PostRoute posts={posts} />} />
            </Routes>
          </div>
        </main>
      </div>
    </HashRouter>
  );
}
