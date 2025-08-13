-- Create function to increment view count safely
CREATE OR REPLACE FUNCTION increment_view_count(post_id INTEGER)
RETURNS void AS $$
BEGIN
    UPDATE posts 
    SET view_count = view_count + 1 
    WHERE id = post_id AND is_published = true;
END;
$$ LANGUAGE plpgsql;
