-- Database Initialization Script for Personalized Nutrition Calculator

CREATE TABLE IF NOT EXISTS activity_levels (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    multiplier NUMERIC(4,3) NOT NULL,
    description TEXT
);

INSERT INTO activity_levels (id, name, multiplier, description) VALUES
('normal', 'Normal Activity', 1.200, 'Desk job, minimal exercise'),
('walking', 'Walking / Light Activity', 1.375, 'Light exercise 1-3 days/week'),
('gym', 'Gym / Strength Training', 1.550, 'Moderate exercise 3-5 days/week'),
('bodybuilding', 'Bodybuilding', 1.700, 'Heavy muscle lifting 5-6 days/week'),
('running', 'Running', 1.600, 'Distance running / high cardio'),
('endurance', 'Endurance Athlete', 1.750, 'Triathlon / marathon training'),
('sports', 'Sports Athlete', 1.650, 'Competitive team sports'),
('highly_active', 'Highly Active', 1.900, 'Heavy physical job + daily training')
ON CONFLICT (id) DO NOTHING;

CREATE TABLE IF NOT EXISTS foods (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    category VARCHAR(50) NOT NULL,
    serving_size VARCHAR(100) NOT NULL,
    calories INT NOT NULL,
    protein_grams NUMERIC(5,2) NOT NULL,
    carbs_grams NUMERIC(5,2) NOT NULL,
    fat_grams NUMERIC(5,2) NOT NULL,
    fiber_grams NUMERIC(5,2) DEFAULT 0,
    is_indian BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO foods (name, category, serving_size, calories, protein_grams, carbs_grams, fat_grams, fiber_grams, is_indian) VALUES
('Boiled Eggs (2 whole)', 'protein', '100g (2 eggs)', 155, 13.00, 1.10, 11.00, 0, true),
('Grilled Chicken Breast', 'protein', '100g cooked', 165, 31.00, 0.00, 3.60, 0, true),
('Paneer (Cottage Cheese)', 'protein', '100g raw', 265, 18.00, 3.50, 20.00, 0, true),
('Soy Chunks (Nutrela)', 'protein', '50g dry', 172, 26.00, 16.00, 0.50, 6.5, true),
('Tadka Dal (Yellow Lentils)', 'protein', '1 bowl (150g)', 140, 8.50, 20.00, 3.00, 5.0, true),
('Black Chana Curry', 'protein', '1 bowl (150g)', 180, 9.50, 28.00, 3.50, 7.0, true),
('Curd / Plain Yogurt', 'protein', '1 bowl (200g)', 120, 7.00, 9.00, 6.00, 0, true),
('Fish Curry (Rohu/Katla)', 'protein', '150g serving', 210, 24.00, 4.00, 11.00, 0, true),
('Double Toned Milk', 'protein', '1 glass (250ml)', 120, 8.00, 12.00, 3.80, 0, true),
('Chickpeas / Chole', 'protein', '1 bowl (150g)', 210, 10.00, 32.00, 4.00, 6.0, true),
('Steamed White Rice', 'carbohydrate', '1 bowl cooked (150g)', 195, 4.00, 43.00, 0.50, 0.5, true),
('Brown Rice', 'carbohydrate', '1 bowl cooked (150g)', 168, 3.80, 35.00, 1.40, 3.0, true),
('Whole Wheat Chapati (Roti)', 'carbohydrate', '1 roti (40g)', 104, 3.10, 20.00, 0.80, 2.5, true),
('Idli (Rice & Urad Dal)', 'carbohydrate', '2 idlis (100g)', 130, 4.50, 26.00, 0.80, 1.0, true),
('Plain Masala Dosa', 'carbohydrate', '1 dosa (120g)', 220, 5.00, 34.00, 7.00, 1.5, true),
('Rolled Oats Porridge', 'carbohydrate', '1 bowl (50g dry)', 190, 6.50, 33.00, 3.50, 5.0, true),
('Boiled Sweet Potato', 'carbohydrate', '1 medium (150g)', 130, 2.00, 30.00, 0.20, 4.0, true),
('Banana', 'carbohydrate', '1 medium (110g)', 105, 1.30, 27.00, 0.30, 3.0, true),
('Roasted Peanuts', 'fat', '30g handful', 170, 7.50, 6.00, 14.00, 2.0, true),
('Raw Almonds', 'fat', '20g (15 nuts)', 116, 4.20, 4.00, 10.00, 2.5, true),
('Natural Peanut Butter', 'fat', '2 tbsp (32g)', 190, 8.00, 7.00, 16.00, 2.0, true),
('Chia / Flax Seeds', 'fat', '1 tbsp (15g)', 75, 2.50, 6.00, 4.50, 4.0, true)
ON CONFLICT DO NOTHING;

CREATE TABLE IF NOT EXISTS nutrition_calculations (
    id SERIAL PRIMARY KEY,
    weight NUMERIC(5,2) NOT NULL,
    height NUMERIC(5,2),
    age INT,
    gender VARCHAR(20),
    activity_level VARCHAR(50) NOT NULL,
    fitness_goal VARCHAR(50) NOT NULL,
    calories INT NOT NULL,
    protein_g NUMERIC(6,2) NOT NULL,
    carbs_g NUMERIC(6,2) NOT NULL,
    fat_g NUMERIC(6,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
