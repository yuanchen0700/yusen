import os
import re
import json
import shutil
import markdown
from datetime import datetime

# --- CONFIGURATION ---
SOURCE_DIR = "posts"         # Folder where you put .md files
OUTPUT_DIR = "public"        # Output root
ASSET_DIR = "public/images"  # Where processed images go
DATA_FILE = "public/blog_data.json" # The JSON file React will load

class BlogGenerator:
    def __init__(self):
        self.stats = {
            "total": 0,
            "updated": 0,
            "latest_post": None
        }
        
        # Ensure directories exist
        if not os.path.exists(ASSET_DIR):
            os.makedirs(ASSET_DIR)

    def create_sample_posts(self):
        """Creates the posts directory and sample files if they don't exist."""
        if not os.path.exists(SOURCE_DIR):
            os.makedirs(SOURCE_DIR)
            print(f"Created directory: {SOURCE_DIR}")
        
        # Check if empty
        if not os.listdir(SOURCE_DIR):
            print("Directory 'posts' is empty. Creating sample posts...")
            
            sample_1 = """# Welcome to Zenith Blog
@General #Welcome #Guide
This is your first generated blog post.

## How to use
1. Put your markdown files in the `posts` folder.
2. Use `@Category` and `#Tag` in the first 5 lines.
3. Run this script to generate the site data.

Enjoy writing!
"""
            sample_2 = """@Tech #Python #Code
# Python Code Example
Here is how you display code:

```python
def hello_world():
    print("Hello Zenith!")
```

The system automatically highlights this.
"""
            with open(os.path.join(SOURCE_DIR, "welcome.md"), "w", encoding="utf-8") as f:
                f.write(sample_1)
            
            with open(os.path.join(SOURCE_DIR, "python_demo.md"), "w", encoding="utf-8") as f:
                f.write(sample_2)
                
            print("Sample posts created.")

    def parse_md_file(self, filepath):
        """
        Parses MD file based on specific rules:
        1. Tags (#/＃) and Category (@/＠) in first 5 lines.
        2. Title from first H1 or H2.
        3. Images ![alt](doc_name/img.png) mapped to public/images.
        """
        filename = os.path.basename(filepath)
        doc_name = os.path.splitext(filename)[0] # This is "aa" in your example
        
        with open(filepath, 'r', encoding='utf-8') as f:
            lines = f.readlines()

        # --- 1. Metadata Parsing (First 5 lines) ---
        header_lines = lines[:5]
        full_text = "".join(lines) # We keep headers in body or you can strip them

        tags = []
        category = "Uncategorized"
        title = doc_name

        # Regex for Tags (Chinese or English hash)
        tag_pattern = re.compile(r'(?:#|＃)([\w\u4e00-\u9fa5]+)')
        # Regex for Category (Chinese or English at symbol)
        cat_pattern = re.compile(r'(?:@|＠)([\w\u4e00-\u9fa5]+)')
        # Regex for Title
        h1_pattern = re.compile(r'^#\s+(.+)', re.MULTILINE)
        h2_pattern = re.compile(r'^##\s+(.+)', re.MULTILINE)

        for line in header_lines:
            # Find all tags in line
            found_tags = tag_pattern.findall(line)
            for t in found_tags:
                if t not in tags:
                    tags.append(t)
            
            # Find category (first one wins)
            if category == "Uncategorized":
                cat_match = cat_pattern.search(line)
                if cat_match:
                    category = cat_match.group(1)

        # Find Title
        h1 = h1_pattern.search(full_text)
        if h1:
            title = h1.group(1).strip()
        else:
            h2 = h2_pattern.search(full_text)
            if h2:
                title = h2.group(1).strip()

        # --- 2. Image Processing ---
        # Pattern: ![alt](doc_name/image.png)
        def image_replacer(match):
            alt_text = match.group(1)
            original_path = match.group(2) # e.g. "aa/a1.png"
            
            # Determine absolute path of source image
            # Assuming structure: posts/aa.md and posts/aa/a1.png
            abs_src_path = os.path.join(os.path.dirname(filepath), original_path)
            
            if os.path.exists(abs_src_path):
                # Create a unique filename for the public folder
                img_filename = os.path.basename(original_path)
                # Prefix with doc_name to avoid collisions: aa_a1.png
                new_filename = f"{doc_name}_{img_filename}"
                dest_path = os.path.join(ASSET_DIR, new_filename)
                
                # Copy file
                shutil.copy2(abs_src_path, dest_path)
                
                # Return new markdown link pointing to public/images
                return f'![{alt_text}](/images/{new_filename})'
            else:
                # print(f"Warning: Image not found {abs_src_path}")
                return match.group(0) # parsing failed, keep original

        # Update Markdown content with new image paths
        img_pattern = re.compile(r'!\[(.*?)\]\((.*?)\)')
        processed_md = img_pattern.sub(image_replacer, full_text)

        # --- 3. File Stats ---
        stat = os.stat(filepath)
        created_at = datetime.fromtimestamp(stat.st_ctime).isoformat()
        updated_at = datetime.fromtimestamp(stat.st_mtime).isoformat()

        return {
            "id": doc_name,
            "title": title,
            "category": category,
            "tags": tags,
            "content": processed_md, 
            "createdAt": created_at,
            "updatedAt": updated_at,
            "slug": doc_name,
            "nextPost": None, 
            "prevPost": None
        }

    def calculate_links(self, posts):
        # Sort posts by createdAt Descending
        posts.sort(key=lambda x: x['createdAt'], reverse=True)

        for i, post in enumerate(posts):
            same_cat_posts = [p for p in posts if p['category'] == post['category']]
            cat_index = next((idx for idx, p in enumerate(same_cat_posts) if p['id'] == post['id']), -1)

            # --- NEXT POST (Older) ---
            next_p = None
            if cat_index != -1 and cat_index < len(same_cat_posts) - 1:
                 next_p = same_cat_posts[cat_index + 1]
            elif i < len(posts) - 1:
                 next_p = posts[i + 1]
            
            if next_p:
                post['nextPost'] = {'id': next_p['id'], 'title': next_p['title']}

            # --- PREV POST (Newer) ---
            prev_p = None
            if cat_index > 0:
                prev_p = same_cat_posts[cat_index - 1]
            elif i > 0:
                prev_p = posts[i - 1]

            if prev_p:
                post['prevPost'] = {'id': prev_p['id'], 'title': prev_p['title']}

        return posts

    def needs_update(self):
        if not os.path.exists(DATA_FILE):
            return True
            
        json_mtime = os.path.getmtime(DATA_FILE)
        
        for root, dirs, files in os.walk(SOURCE_DIR):
            for file in files:
                if file.endswith('.md'):
                    md_path = os.path.join(root, file)
                    if os.path.getmtime(md_path) > json_mtime:
                        return True
        return False

    def generate(self):
        self.create_sample_posts()
        
        print("--- Checking for updates ---")
        if not self.needs_update():
            print("No changes detected. Skipping regeneration.")
            try:
                with open(DATA_FILE, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    print(f"Existing Total Posts: {len(data)}")
            except:
                pass
            return

        print("--- Generating Blog Data ---")
        files = [f for f in os.listdir(SOURCE_DIR) if f.endswith('.md')]
        posts = []

        for f in files:
            path = os.path.join(SOURCE_DIR, f)
            post_data = self.parse_md_file(path)
            posts.append(post_data)
            self.stats['updated'] += 1

        # Calculate Links and Sort
        posts = self.calculate_links(posts)
        
        # Save Stats
        self.stats['total'] = len(posts)
        if posts:
            self.stats['latest_post'] = posts[0]

        # Write JSON
        with open(DATA_FILE, 'w', encoding='utf-8') as f:
            json.dump(posts, f, ensure_ascii=False, indent=2)

        print(f"Successfully generated {self.stats['total']} posts.")
        if self.stats['latest_post']:
             print(f"Latest Post: {self.stats['latest_post']['title']} ({self.stats['latest_post']['createdAt']})")

if __name__ == "__main__":
    gen = BlogGenerator()
    gen.generate()
