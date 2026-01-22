export const MOCK_MARKDOWN_FILES = [
  {
    filename: 'welcome',
    createdAt: '2023-10-01T10:00:00Z',
    updatedAt: '2023-10-05T14:30:00Z',
    content: `
# Welcome to Zenith
@General #Welcome #Guide
This is your first generated blog post.

## How to use
1. Put your markdown files in the \`posts\` folder.
2. Use \`@Category\` and \`#Tag\` in the first 5 lines.
3. Run this script to generate the site data.

Enjoy writing!
    `
  },
  {
    filename: 'python_guide',
    createdAt: '2023-10-15T09:00:00Z',
    updatedAt: '2023-10-15T09:00:00Z',
    content: `
@Tech #Python #Code
# Python Code Example
Here is how you display code.

Note that we are testing the preview functionality. 
The title above and tags should not appear in the preview summary.
Only this text should appear.

\`\`\`python
def hello_world():
    print("Hello Zenith!")
\`\`\`
    `
  },
  {
    filename: 'kyoto_trip',
    createdAt: '2023-11-01T12:00:00Z',
    updatedAt: '2023-11-02T16:00:00Z',
    content: `
# Trip to Kyoto
@Life ＃Travel ＃Japan
This is my travel log.

The food was amazing. We visited several temples.
    `
  }
];
