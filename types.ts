export interface BlogPost {
  id: string; // usually filename without extension
  title: string;
  content: string; // HTML content or Markdown content
  tags: string[];
  category: string;
  createdAt: string; // ISO String
  updatedAt: string; // ISO String
  slug: string;
  nextPost?: { id: string; title: string } | null;
  prevPost?: { id: string; title: string } | null;
}

export interface GeneratorStats {
  totalPosts: number;
  newlyGenerated: number;
  lastGeneratedPost: {
    title: string;
    date: string;
  } | null;
}

export interface NavigationContextType {
  isMobileMenuOpen: boolean;
  toggleMobileMenu: () => void;
  closeMobileMenu: () => void;
  selectedCategory: string | null;
  setSelectedCategory: (cat: string | null) => void;
  selectedTag: string | null;
  setSelectedTag: (tag: string | null) => void;
}
