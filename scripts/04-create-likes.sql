-- Create likes table for post interactions
CREATE TABLE IF NOT EXISTS likes (
  id SERIAL PRIMARY KEY,
  post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
  user_ip VARCHAR(45) NOT NULL, -- store IP for anonymous likes
  user_agent TEXT, -- store user agent for better uniqueness
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create unique constraint to prevent duplicate likes from same IP/user agent
CREATE UNIQUE INDEX IF NOT EXISTS idx_likes_unique ON likes(post_id, user_ip, user_agent);
CREATE INDEX IF NOT EXISTS idx_likes_post ON likes(post_id);
