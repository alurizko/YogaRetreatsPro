-- Test data for YogaRetreatPro based on bookyogaretreats.com structure
-- Execute this after running supabase_setup.sql

-- Insert sample retreats with realistic data
INSERT INTO retreats (
  title, description, short_description, location, address, 
  price_from, price_to, currency, duration_days, max_participants,
  min_age, max_age, difficulty_level, start_date, end_date,
  images, amenities, included, not_included, schedule,
  requirements, cancellation_policy, status, featured,
  category_id, country_id
) VALUES 
(
  '8 Day Spirit Awakening with Ayahuasca and Cacao in Puerto Viejo de Talamanca',
  'Embark on a transformative journey of self-discovery through ancient plant medicine ceremonies, yoga, and meditation in the heart of Costa Rica''s Caribbean coast. This retreat combines traditional healing practices with modern wellness techniques.',
  'Transform your life with sacred plant medicine, yoga, and meditation in Costa Rica''s tropical paradise.',
  'Puerto Viejo de Talamanca, Costa Rica',
  'Playa Cocles, Puerto Viejo de Talamanca, Limón Province, Costa Rica',
  3350, 3350, 'USD', 8, 12, 21, 65, 'intermediate',
  '2024-04-15', '2024-04-23',
  ARRAY['https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop'],
  ARRAY['Airport transfer', 'Private beach access', 'Jungle location', 'Organic meals', 'Ceremony space'],
  ARRAY['8 nights accommodation', 'All organic meals', 'Daily yoga classes', 'Meditation sessions', 'Plant medicine ceremonies', 'Airport transfers', 'Welcome and closing ceremonies'],
  ARRAY['International flights', 'Travel insurance', 'Personal expenses', 'Alcoholic beverages'],
  '6:00 AM - Morning meditation\n7:00 AM - Yoga practice\n9:00 AM - Breakfast\n11:00 AM - Free time/Beach\n1:00 PM - Lunch\n3:00 PM - Workshop/Ceremony preparation\n6:00 PM - Evening yoga\n7:30 PM - Dinner\n9:00 PM - Ceremony (selected evenings)',
  'Open mind and heart, willingness to participate in ceremonies, good physical health',
  'Free cancellation up to 30 days before start date. 50% refund 15-30 days before. No refund within 15 days.',
  'published', true,
  (SELECT id FROM categories WHERE slug = 'spiritual' LIMIT 1),
  (SELECT id FROM countries WHERE code = 'CR' LIMIT 1)
),
(
  '5 Day Yoga Retreat in Tulum Caribbean Beach, Discovering the Magical Sacred Mayan Cenotes',
  'Immerse yourself in the ancient Mayan culture while practicing yoga on pristine Caribbean beaches. Explore mystical cenotes, enjoy traditional Temazcal ceremonies, and reconnect with nature in this magical destination.',
  'Experience yoga, cenotes, and Mayan culture on Tulum''s stunning Caribbean coast.',
  'Tulum, Mexico',
  'Tulum Beach Road, Tulum, Quintana Roo, Mexico',
  2240, 2240, 'USD', 5, 16, 18, 60, 'all',
  '2024-05-10', '2024-05-15',
  ARRAY['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1545389336-cf090694435e?w=800&h=600&fit=crop'],
  ARRAY['Beachfront location', 'Cenote access', 'Temazcal ceremony', 'Mayan ruins tours', 'Bicycle rental'],
  ARRAY['5 nights beachfront accommodation', 'All healthy meals', 'Daily yoga classes', 'Cenote excursions', 'Temazcal ceremony', 'Mayan ruins tour', 'Airport transfers'],
  ARRAY['International flights', 'Travel insurance', 'Personal expenses', 'Spa treatments'],
  '6:30 AM - Beach yoga\n8:30 AM - Breakfast\n10:00 AM - Cenote excursion or free time\n1:00 PM - Lunch\n3:00 PM - Rest/Beach time\n5:30 PM - Sunset yoga\n7:30 PM - Dinner\n9:00 PM - Evening meditation or cultural activity',
  'Basic swimming ability for cenote activities, comfortable with outdoor activities',
  'Free cancellation up to 21 days before start date. 75% refund 14-21 days before. 50% refund 7-14 days before.',
  'published', true,
  (SELECT id FROM categories WHERE slug = 'yoga' LIMIT 1),
  (SELECT id FROM countries WHERE code = 'MX' LIMIT 1)
),
(
  '4 Day Revive and Thrive: Serene Caribbean Healing Haven in Samana',
  'Rejuvenate your body and soul in the Dominican Republic''s most pristine peninsula. This wellness retreat focuses on holistic healing, stress relief, and personal transformation through yoga, meditation, and natural therapies.',
  'Revitalize your mind, body, and spirit in the Dominican Republic''s healing paradise.',
  'Samaná, Dominican Republic',
  'Las Terrenas, Samaná Peninsula, Dominican Republic',
  1100, 1100, 'USD', 4, 14, 25, 70, 'beginner',
  '2024-06-01', '2024-06-05',
  ARRAY['https://images.unsplash.com/photo-1545389336-cf090694435e?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=600&fit=crop'],
  ARRAY['Beachfront resort', 'Spa facilities', 'Tropical gardens', 'Infinity pool', 'Wellness center'],
  ARRAY['4 nights luxury accommodation', 'All gourmet meals', 'Daily yoga and meditation', 'Spa treatments', 'Wellness workshops', 'Beach activities', 'Airport transfers'],
  ARRAY['International flights', 'Travel insurance', 'Additional spa treatments', 'Excursions'],
  '7:00 AM - Morning meditation\n8:00 AM - Yoga practice\n9:30 AM - Healthy breakfast\n11:00 AM - Spa treatment or free time\n1:00 PM - Lunch\n3:00 PM - Workshop or beach time\n6:00 PM - Sunset yoga\n7:30 PM - Dinner\n9:00 PM - Evening relaxation',
  'No specific requirements, suitable for all levels',
  'Free cancellation up to 14 days before start date. 50% refund within 14 days.',
  'published', true,
  (SELECT id FROM categories WHERE slug = 'wellness' LIMIT 1),
  (SELECT id FROM countries WHERE code = 'DO' LIMIT 1)
),
(
  '7 Day Hatha Yoga and Meditation Retreat in Rishikesh, India',
  'Journey to the birthplace of yoga in the foothills of the Himalayas. Learn authentic Hatha yoga from experienced Indian masters, practice meditation by the sacred Ganges River, and immerse yourself in ancient yogic traditions.',
  'Authentic yoga experience in the spiritual capital of the world, Rishikesh.',
  'Rishikesh, India',
  'Laxman Jhula, Rishikesh, Uttarakhand, India',
  899, 899, 'USD', 7, 20, 18, 65, 'intermediate',
  '2024-07-20', '2024-07-27',
  ARRAY['https://images.unsplash.com/photo-1588286840104-8957b019727f?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=800&h=600&fit=crop'],
  ARRAY['Ganges riverfront', 'Traditional ashram', 'Himalayan views', 'Sacred temples', 'Yoga certification'],
  ARRAY['7 nights ashram accommodation', 'Vegetarian meals', 'Daily Hatha yoga classes', 'Meditation sessions', 'Philosophy classes', 'Ganga Aarti ceremony', 'Yoga certification'],
  ARRAY['International flights', 'Visa fees', 'Personal expenses', 'Additional excursions'],
  '5:30 AM - Morning meditation\n6:30 AM - Hatha yoga practice\n8:30 AM - Breakfast\n10:00 AM - Philosophy class\n12:00 PM - Lunch\n2:00 PM - Rest time\n4:00 PM - Afternoon yoga\n6:00 PM - Meditation\n7:30 PM - Dinner\n8:30 PM - Satsang or free time',
  'Basic yoga experience preferred, vegetarian diet during retreat',
  'Free cancellation up to 30 days before. 70% refund 15-30 days before. No refund within 15 days.',
  'published', true,
  (SELECT id FROM categories WHERE slug = 'yoga' LIMIT 1),
  (SELECT id FROM countries WHERE code = 'IN' LIMIT 1)
),
(
  '10 Day Vinyasa Flow Retreat in Ubud, Bali with Sacred Temples Tour',
  'Experience the magic of Bali through dynamic Vinyasa yoga practice, temple visits, and cultural immersion. This retreat combines intensive yoga training with spiritual exploration in Bali''s cultural heart.',
  'Dynamic Vinyasa yoga and Balinese culture in the heart of Ubud.',
  'Ubud, Bali, Indonesia',
  'Monkey Forest Road, Ubud, Gianyar Regency, Bali, Indonesia',
  1850, 1850, 'USD', 10, 18, 20, 55, 'intermediate',
  '2024-08-05', '2024-08-15',
  ARRAY['https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop'],
  ARRAY['Rice field views', 'Traditional Balinese architecture', 'Infinity pool', 'Spa services', 'Cultural activities'],
  ARRAY['10 nights boutique accommodation', 'All organic meals', 'Daily Vinyasa classes', 'Temple tours', 'Balinese cooking class', 'Traditional massage', 'Airport transfers'],
  ARRAY['International flights', 'Visa fees', 'Personal shopping', 'Additional spa treatments'],
  '6:00 AM - Morning Vinyasa flow\n8:00 AM - Breakfast\n10:00 AM - Cultural activity or free time\n1:00 PM - Lunch\n3:00 PM - Rest or spa time\n5:00 PM - Evening yoga\n7:00 PM - Dinner\n8:30 PM - Meditation or cultural evening',
  'Intermediate yoga experience, comfortable with dynamic sequences',
  'Free cancellation up to 45 days before. 80% refund 30-45 days before. 50% refund 15-30 days before.',
  'published', true,
  (SELECT id FROM categories WHERE slug = 'yoga' LIMIT 1),
  (SELECT id FROM countries WHERE code = 'ID' LIMIT 1)
);

-- Add some sample reviews
INSERT INTO reviews (
  retreat_id, user_id, overall_rating, location_rating, accommodation_rating,
  food_rating, instructor_rating, value_rating, title, comment, verified
) VALUES 
(
  (SELECT id FROM retreats WHERE title LIKE '%Ayahuasca%' LIMIT 1),
  (SELECT id FROM profiles LIMIT 1),
  5, 5, 4, 5, 5, 4,
  'Life-changing experience',
  'This retreat completely transformed my perspective on life. The ceremonies were profound and the integration support was excellent. The location in Costa Rica was absolutely magical.',
  true
),
(
  (SELECT id FROM retreats WHERE title LIKE '%Tulum%' LIMIT 1),
  (SELECT id FROM profiles LIMIT 1),
  5, 5, 5, 4, 5, 5,
  'Perfect blend of yoga and culture',
  'Amazing experience combining yoga practice with Mayan culture. The cenotes were breathtaking and the yoga sessions on the beach were unforgettable. Highly recommended!',
  true
),
(
  (SELECT id FROM retreats WHERE title LIKE '%Rishikesh%' LIMIT 1),
  (SELECT id FROM profiles LIMIT 1),
  5, 4, 3, 4, 5, 5,
  'Authentic yoga experience',
  'Practicing yoga in its birthplace was incredible. The teachers were knowledgeable and the spiritual atmosphere was perfect for deepening my practice. Simple accommodation but that added to the authentic experience.',
  true
);

-- Add some sample blog posts
INSERT INTO blog_posts (
  title, slug, content, excerpt, author_id, category_id, status, featured,
  meta_title, meta_description, tags, published_at
) VALUES 
(
  'The Ultimate Guide to Choosing Your First Yoga Retreat',
  'ultimate-guide-choosing-first-yoga-retreat',
  'Choosing your first yoga retreat can be overwhelming with so many options available. This comprehensive guide will help you navigate the decision-making process and find the perfect retreat for your needs...',
  'Everything you need to know about selecting the perfect yoga retreat for beginners.',
  (SELECT id FROM profiles LIMIT 1),
  (SELECT id FROM categories WHERE slug = 'yoga' LIMIT 1),
  'published', true,
  'Ultimate Guide to Choosing Your First Yoga Retreat | YogaRetreatPro',
  'Complete guide to selecting the perfect yoga retreat. Tips for beginners, what to expect, and how to prepare for your transformative journey.',
  ARRAY['yoga', 'retreat', 'beginner', 'guide', 'wellness'],
  NOW() - INTERVAL '7 days'
),
(
  'Top 10 Wellness Destinations for 2024',
  'top-10-wellness-destinations-2024',
  'Discover the most sought-after wellness destinations for 2024. From tropical paradises to mountain sanctuaries, these locations offer the perfect setting for your wellness journey...',
  'Explore the world''s most beautiful and transformative wellness destinations.',
  (SELECT id FROM profiles LIMIT 1),
  (SELECT id FROM categories WHERE slug = 'wellness' LIMIT 1),
  'published', true,
  'Top 10 Wellness Destinations for 2024 | YogaRetreatPro',
  'Discover the best wellness destinations for 2024. From Bali to Costa Rica, find your perfect retreat location.',
  ARRAY['wellness', 'travel', 'destinations', '2024', 'retreat'],
  NOW() - INTERVAL '3 days'
);

-- Update retreat organizer_id with existing profile
UPDATE retreats SET organizer_id = (SELECT id FROM profiles LIMIT 1) WHERE organizer_id IS NULL;
