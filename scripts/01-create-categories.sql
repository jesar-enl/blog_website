-- Create categories table for blog post categories
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  color VARCHAR(7) DEFAULT '#6366f1', -- hex color for category styling
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default categories
INSERT INTO categories (name, slug, description, color) VALUES
  ('Tech', 'tech', 'Technology, programming, and digital innovation', '#3b82f6'),
  ('Mental Health & Wellness', 'mental-health-wellness', 'Mental health awareness, wellness tips, and self-care', '#10b981'),
  ('Lifestyle', 'lifestyle', 'Life experiences, personal stories, and lifestyle tips', '#f59e0b'),
  ('Personal Growth', 'personal-growth', 'Self-improvement, learning, and personal development', '#8b5cf6')
ON CONFLICT (slug) DO NOTHING;
