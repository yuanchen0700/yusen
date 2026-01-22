import { BlogPost } from '../types';

/**
 * Parses raw markdown content based on the prompt's specific rules:
 * 1. Tags: # or ＃ in first 5 lines
 * 2. Category: @ or ＠ in first 5 lines
 * 3. Title: First # H1 or ## H2
 */
export const parseMarkdownPost = (
  filename: string,
  rawContent: string,
  createdAt: string,
  updatedAt: string
): BlogPost => {
  const lines = rawContent.split('\n');
  const headLines = lines.slice(0, 5);
  
  const tags: string[] = [];
  let category = 'Uncategorized';
  let title = filename; // Default to filename if no title found

  // Regex for tags (Chinese or English hash)
  const tagRegex = /(?:#|＃)([\w\u4e00-\u9fa5]+)/g;
  // Regex for category (Chinese or English at symbol)
  const catRegex = /(?:@|＠)([\w\u4e00-\u9fa5]+)/;

  // 1. Parse Metadata from first 5 lines
  headLines.forEach(line => {
    // Extract Tags
    let tagMatch;
    while ((tagMatch = tagRegex.exec(line)) !== null) {
      if (!tags.includes(tagMatch[1])) {
        tags.push(tagMatch[1]);
      }
    }
    
    // Extract Category (take the first one found)
    const catMatch = line.match(catRegex);
    if (catMatch && category === 'Uncategorized') {
      category = catMatch[1];
    }
  });

  // 2. Parse Title (Look through whole file for first H1 or H2)
  for (const line of lines) {
    const h1Match = line.match(/^#\s+(.+)/);
    if (h1Match) {
      title = h1Match[1].trim();
      break;
    }
    const h2Match = line.match(/^##\s+(.+)/);
    if (h2Match) {
      title = h2Match[1].trim();
      break;
    }
  }

  // 3. Fix Image Paths (Simulation)
  // Input: ![a1](aa/a1.png) -> Output: In a real app, this would change the src.
  // For this React demo, we leave it, but the Python script handles the copying.

  return {
    id: filename,
    slug: filename,
    title,
    content: rawContent,
    tags,
    category,
    createdAt,
    updatedAt
  };
};

export const getNextPrevPost = (currentId: string, posts: BlogPost[]) => {
  // Sort by date desc
  const sorted = [...posts].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  const currentIndex = sorted.findIndex(p => p.id === currentId);
  
  if (currentIndex === -1) return { prev: null, next: null };

  const currentPost = sorted[currentIndex];
  
  // Try to find next/prev in the SAME category first
  const sameCategory = sorted.filter(p => p.category === currentPost.category);
  const catIndex = sameCategory.findIndex(p => p.id === currentId);

  let next = null;
  let prev = null;

  // Logic: "Next" in UI usually means Newer post (index - 1), but prompt says "Next One"
  // "Next" in reading flow usually means older post (index + 1).
  // Let's interpret "Next" as the next one to read (older) and "Prev" as newer.
  
  // Try category context
  if (catIndex < sameCategory.length - 1) {
    next = sameCategory[catIndex + 1];
  } else {
    // Fallback to chronological next (older)
    if (currentIndex < sorted.length - 1) next = sorted[currentIndex + 1];
  }

  if (catIndex > 0) {
    prev = sameCategory[catIndex - 1];
  } else {
    // Fallback to chronological prev (newer)
    if (currentIndex > 0) prev = sorted[currentIndex - 1];
  }

  return { prev, next };
};
