-- Seed core classifications if they do not exist
INSERT INTO public.classification (classification_name)
VALUES ('Sport'), ('SUV'), ('Truck')
ON CONFLICT (classification_name) DO NOTHING;

-- Sport vehicles
WITH cls AS (
  SELECT classification_id FROM public.classification WHERE classification_name = 'Sport'
)
INSERT INTO public.inventory (
  inv_make, inv_model, inv_year, inv_price, inv_miles, inv_color, inv_description, inv_image, inv_thumbnail, classification_id
)
SELECT 'CSE', 'Sprint', 2021, 24999, 15000, 'Red',
       'Agile and quick, perfect for city driving.',
       '/images/placeholder.svg', '/images/placeholder.svg', classification_id
FROM cls
UNION ALL
SELECT 'CSE', 'Flash', 2022, 27999, 8000, 'Blue',
       'Sporty handling with comfortable interior.',
       '/images/placeholder.svg', '/images/placeholder.svg', classification_id
FROM cls
ON CONFLICT DO NOTHING;

-- SUV vehicles
WITH cls AS (
  SELECT classification_id FROM public.classification WHERE classification_name = 'SUV'
)
INSERT INTO public.inventory (
  inv_make, inv_model, inv_year, inv_price, inv_miles, inv_color, inv_description, inv_image, inv_thumbnail, classification_id
)
SELECT 'CSE', 'Trailblazer', 2020, 32999, 22000, 'Black',
       'Spacious SUV with modern safety features.',
       '/images/placeholder.svg', '/images/placeholder.svg', classification_id
FROM cls
UNION ALL
SELECT 'CSE', 'Voyager', 2023, 38999, 5000, 'Silver',
       'Family-friendly SUV with great fuel economy.',
       '/images/placeholder.svg', '/images/placeholder.svg', classification_id
FROM cls
ON CONFLICT DO NOTHING;

-- Truck vehicles
WITH cls AS (
  SELECT classification_id FROM public.classification WHERE classification_name = 'Truck'
)
INSERT INTO public.inventory (
  inv_make, inv_model, inv_year, inv_price, inv_miles, inv_color, inv_description, inv_image, inv_thumbnail, classification_id
)
SELECT 'CSE', 'Hauler', 2019, 28999, 35000, 'White',
       'Capable truck with impressive towing capacity.',
       '/images/placeholder.svg', '/images/placeholder.svg', classification_id
FROM cls
UNION ALL
SELECT 'CSE', 'WorkPro', 2021, 34999, 18000, 'Gray',
       'Durable truck built for demanding jobs.',
       '/images/placeholder.svg', '/images/placeholder.svg', classification_id
FROM cls
ON CONFLICT DO NOTHING;

-- Verify
-- SELECT classification_name, COUNT(*)
-- FROM public.inventory i
-- JOIN public.classification c USING (classification_id)
-- GROUP BY classification_name
-- ORDER BY classification_name;
