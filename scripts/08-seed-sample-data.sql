-- Insert sample blog posts for testing
INSERT INTO posts (
  title, 
  slug, 
  excerpt, 
  content, 
  category_id, 
  author_name,
  is_published, 
  is_featured,
  published_at,
  reading_time
) VALUES
(
  'Getting Started with Next.js 15',
  'getting-started-nextjs-15',
  'Explore the latest features and improvements in Next.js 15, including enhanced performance and developer experience.',
  'Next.js 15 brings exciting new features that make building React applications even more powerful and efficient. In this comprehensive guide, we''ll explore the key improvements and how to leverage them in your projects.

## What''s New in Next.js 15

The latest version introduces several groundbreaking features:

- **Enhanced App Router**: Improved routing with better performance
- **Server Components**: More efficient server-side rendering
- **Improved TypeScript Support**: Better type safety and developer experience

## Getting Started

To start using Next.js 15, simply run:

\`\`\`bash
npx create-next-app@latest my-app
