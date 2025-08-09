-- ============================================================================
-- DYNAMIC USER DATA SYSTEM - DATABASE MIGRATION SCRIPT
-- Creates all necessary tables for user data management system
-- ============================================================================

-- Version: 1.0
-- Created: 2024
-- Description: Migration for dynamic user data management with complete CRUD operations

USE smartcookingai;

-- ============================================================================
-- 1. USER PREFERENCES TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS user_preferences (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    language_preference VARCHAR(10) DEFAULT 'vi',
    serving_size_preference INT DEFAULT 4,
    cooking_time_preference INT DEFAULT 30,
    difficulty_preference VARCHAR(20) DEFAULT 'MEDIUM',
    calorie_goal INT DEFAULT 2000,
    notification_settings JSON DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_preferences_user_id (user_id),
    
    CONSTRAINT chk_serving_size CHECK (serving_size_preference BETWEEN 1 AND 20),
    CONSTRAINT chk_cooking_time CHECK (cooking_time_preference BETWEEN 5 AND 480),
    CONSTRAINT chk_calorie_goal CHECK (calorie_goal BETWEEN 800 AND 5000),
    CONSTRAINT chk_difficulty CHECK (difficulty_preference IN ('EASY', 'MEDIUM', 'HARD')),
    CONSTRAINT chk_language CHECK (language_preference IN ('vi', 'en', 'ja', 'ko', 'zh'))
);

-- ============================================================================
-- 2. USER CUISINE PREFERENCES TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS user_cuisine_preferences (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    cuisine VARCHAR(100) NOT NULL,
    preference_score DECIMAL(3,2) DEFAULT 1.0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_cuisine (user_id, cuisine),
    INDEX idx_user_cuisine_user_id (user_id),
    INDEX idx_user_cuisine_cuisine (cuisine),
    
    CONSTRAINT chk_preference_score CHECK (preference_score BETWEEN 0.0 AND 1.0)
);

-- ============================================================================
-- 3. USER DIETARY RESTRICTIONS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS user_dietary_restrictions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    restriction VARCHAR(50) NOT NULL,
    severity VARCHAR(20) DEFAULT 'STRICT',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_restriction (user_id, restriction),
    INDEX idx_user_dietary_user_id (user_id),
    INDEX idx_user_dietary_restriction (restriction),
    
    CONSTRAINT chk_restriction CHECK (restriction IN (
        'VEGAN', 'VEGETARIAN', 'GLUTEN_FREE', 'DAIRY_FREE', 
        'NUT_FREE', 'KETO', 'PALEO', 'HALAL', 'KOSHER'
    )),
    CONSTRAINT chk_severity CHECK (severity IN ('STRICT', 'MODERATE', 'FLEXIBLE'))
);

-- ============================================================================
-- 4. USER FAVORITE RECIPES TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS user_favorite_recipes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    recipe_id BIGINT NOT NULL,
    rating INT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_recipe_favorite (user_id, recipe_id),
    INDEX idx_user_favorite_user_id (user_id),
    INDEX idx_user_favorite_recipe_id (recipe_id),
    INDEX idx_user_favorite_created_at (created_at),
    
    CONSTRAINT chk_rating CHECK (rating IS NULL OR rating BETWEEN 1 AND 5)
);

-- ============================================================================
-- 5. ENHANCED AI INTERACTIONS TABLE
-- ============================================================================

DROP TABLE IF EXISTS ai_interactions_backup;
CREATE TABLE ai_interactions_backup AS SELECT * FROM ai_interactions;

ALTER TABLE ai_interactions 
ADD COLUMN IF NOT EXISTS success BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS error_message TEXT,
ADD COLUMN IF NOT EXISTS model_used VARCHAR(50),
ADD COLUMN IF NOT EXISTS tokens_used INT,
ADD COLUMN IF NOT EXISTS session_id VARCHAR(100),
ADD INDEX IF NOT EXISTS idx_ai_interaction_user_id (user_id),
ADD INDEX IF NOT EXISTS idx_ai_interaction_type (interaction_type),
ADD INDEX IF NOT EXISTS idx_ai_interaction_created_at (created_at),
ADD INDEX IF NOT EXISTS idx_ai_interaction_language (language),
ADD INDEX IF NOT EXISTS idx_ai_interaction_session_id (session_id);

-- Update interaction_type enum to include new types
ALTER TABLE ai_interactions 
MODIFY interaction_type ENUM(
    'CHAT', 
    'RECIPE_GENERATION', 
    'IMAGE_RECOGNITION', 
    'VOICE',
    'NUTRITION_ANALYSIS',
    'MEAL_PLANNING',
    'SHOPPING_LIST_GENERATION'
) NOT NULL;

-- ============================================================================
-- 6. LEARNING PROGRESS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS learning_progress (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    completed_lessons INT NOT NULL DEFAULT 0,
    total_lessons INT NOT NULL DEFAULT 20,
    completion_percentage DECIMAL(5,2) DEFAULT 0.0,
    current_skill_level ENUM('BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT') DEFAULT 'BEGINNER',
    current_lesson_id BIGINT,
    learning_streak_days INT DEFAULT 0,
    total_learning_time_minutes INT DEFAULT 0,
    achievements JSON DEFAULT '[]',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_learning_progress_user_id (user_id),
    INDEX idx_learning_progress_skill_level (current_skill_level),
    INDEX idx_learning_progress_completion (completion_percentage),
    
    CONSTRAINT chk_lessons CHECK (completed_lessons <= total_lessons),
    CONSTRAINT chk_completion CHECK (completion_percentage BETWEEN 0.0 AND 100.0),
    CONSTRAINT chk_streak CHECK (learning_streak_days >= 0),
    CONSTRAINT chk_learning_time CHECK (total_learning_time_minutes >= 0)
);

-- ============================================================================
-- 7. MEAL PLANS TABLE (Future enhancement)
-- ============================================================================

CREATE TABLE IF NOT EXISTS meal_plans (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    date DATETIME NOT NULL,
    meal_type ENUM('BREAKFAST', 'LUNCH', 'DINNER', 'SNACK', 'DESSERT') NOT NULL,
    recipe_id BIGINT,
    custom_meal_name VARCHAR(255),
    planned_servings INT DEFAULT 1,
    notes TEXT,
    is_completed BOOLEAN DEFAULT FALSE,
    completed_at DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE SET NULL,
    INDEX idx_meal_plan_user_id (user_id),
    INDEX idx_meal_plan_date (date),
    INDEX idx_meal_plan_meal_type (meal_type),
    INDEX idx_meal_plan_recipe_id (recipe_id),
    
    CONSTRAINT chk_planned_servings CHECK (planned_servings BETWEEN 1 AND 50),
    CONSTRAINT chk_meal_identifier CHECK (recipe_id IS NOT NULL OR custom_meal_name IS NOT NULL)
);

-- ============================================================================
-- 8. SHOPPING LISTS TABLE (Future enhancement)
-- ============================================================================

CREATE TABLE IF NOT EXISTS shopping_lists (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    items JSON NOT NULL DEFAULT '[]',
    recipe_ids JSON DEFAULT '[]',
    total_estimated_cost DECIMAL(10,2),
    currency VARCHAR(3) DEFAULT 'VND',
    is_completed BOOLEAN DEFAULT FALSE,
    completed_at DATETIME,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_shopping_list_user_id (user_id),
    INDEX idx_shopping_list_completed (is_completed),
    INDEX idx_shopping_list_created_at (created_at),
    
    CONSTRAINT chk_estimated_cost CHECK (total_estimated_cost IS NULL OR total_estimated_cost >= 0)
);

-- ============================================================================
-- 9. USER ACTIVITY LOGS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS user_activity_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    activity_type ENUM(
        'LOGIN', 'LOGOUT', 'RECIPE_CREATED', 'RECIPE_UPDATED', 'RECIPE_DELETED',
        'RECIPE_FAVORITED', 'RECIPE_UNFAVORITED', 'AI_INTERACTION', 
        'PROFILE_UPDATED', 'PREFERENCES_UPDATED', 'LEARNING_PROGRESS_UPDATED',
        'MEAL_PLAN_CREATED', 'SHOPPING_LIST_CREATED'
    ) NOT NULL,
    target_id BIGINT,
    target_type VARCHAR(50),
    activity_details JSON,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_activity_log_user_id (user_id),
    INDEX idx_activity_log_activity_type (activity_type),
    INDEX idx_activity_log_created_at (created_at),
    INDEX idx_activity_log_target (target_type, target_id)
);

-- ============================================================================
-- 10. USER SESSIONS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS user_sessions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    session_token VARCHAR(500) NOT NULL UNIQUE,
    refresh_token VARCHAR(500),
    ip_address VARCHAR(45),
    user_agent TEXT,
    device_info JSON,
    is_active BOOLEAN DEFAULT TRUE,
    expires_at DATETIME NOT NULL,
    last_accessed_at DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_session_user_id (user_id),
    INDEX idx_user_session_session_token (session_token),
    INDEX idx_user_session_expires_at (expires_at),
    INDEX idx_user_session_active (is_active, expires_at)
);

-- ============================================================================
-- 11. ENHANCE EXISTING USERS TABLE
-- ============================================================================

-- Add additional fields to users table if they don't exist
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS cooking_skill_level ENUM('BEGINNER', 'INTERMEDIATE', 'ADVANCED') DEFAULT 'BEGINNER',
ADD COLUMN IF NOT EXISTS timezone VARCHAR(50) DEFAULT 'Asia/Ho_Chi_Minh',
ADD COLUMN IF NOT EXISTS date_format VARCHAR(20) DEFAULT 'dd/MM/yyyy';

-- Add indexes for better performance
ALTER TABLE users
ADD INDEX IF NOT EXISTS idx_users_cooking_skill (cooking_skill_level),
ADD INDEX IF NOT EXISTS idx_users_city (city),
ADD INDEX IF NOT EXISTS idx_users_country (country),
ADD INDEX IF NOT EXISTS idx_users_role (role),
ADD INDEX IF NOT EXISTS idx_users_active (is_active),
ADD INDEX IF NOT EXISTS idx_users_created_at (created_at);

-- ============================================================================
-- 12. ENHANCE EXISTING RECIPES TABLE
-- ============================================================================

-- Add indexes for better performance
ALTER TABLE recipes
ADD INDEX IF NOT EXISTS idx_recipes_created_by (created_by),
ADD INDEX IF NOT EXISTS idx_recipes_category (category),
ADD INDEX IF NOT EXISTS idx_recipes_difficulty (difficulty),
ADD INDEX IF NOT EXISTS idx_recipes_cooking_time (cooking_time),
ADD INDEX IF NOT EXISTS idx_recipes_calories (calories),
ADD INDEX IF NOT EXISTS idx_recipes_created_at (created_at),
ADD INDEX IF NOT EXISTS idx_recipes_public (is_public);

-- Add full-text search indexes for recipe search
ALTER TABLE recipes
ADD FULLTEXT INDEX IF NOT EXISTS ft_recipes_title (title_vi, title_en),
ADD FULLTEXT INDEX IF NOT EXISTS ft_recipes_description (description_vi, description_en);

-- ============================================================================
-- 13. CREATE VIEWS FOR ANALYTICS
-- ============================================================================

-- User Statistics View
CREATE OR REPLACE VIEW user_statistics AS
SELECT 
    u.id as user_id,
    u.name,
    u.email,
    u.cooking_skill_level,
    u.created_at as member_since,
    COUNT(DISTINCT r.id) as total_recipes,
    COUNT(DISTINCT f.id) as total_favorites,
    COUNT(DISTINCT ai.id) as total_ai_interactions,
    lp.completion_percentage as learning_progress,
    lp.current_skill_level as learning_skill_level
FROM users u
LEFT JOIN recipes r ON u.id = r.created_by
LEFT JOIN user_favorite_recipes f ON u.id = f.user_id
LEFT JOIN ai_interactions ai ON u.id = ai.user_id
LEFT JOIN learning_progress lp ON u.id = lp.user_id
WHERE u.is_active = TRUE
GROUP BY u.id;

-- Recipe Analytics View
CREATE OR REPLACE VIEW recipe_analytics AS
SELECT 
    r.id as recipe_id,
    r.title_vi,
    r.title_en,
    r.difficulty,
    r.cooking_time,
    r.calories,
    r.created_by,
    r.created_at,
    COUNT(DISTINCT f.user_id) as favorite_count,
    AVG(f.rating) as average_rating,
    COUNT(DISTINCT ai.user_id) as ai_generation_count
FROM recipes r
LEFT JOIN user_favorite_recipes f ON r.id = f.recipe_id
LEFT JOIN ai_interactions ai ON JSON_EXTRACT(ai.output_data, '$.recipe_id') = r.id
WHERE r.is_public = TRUE
GROUP BY r.id;

-- Daily Usage Analytics View
CREATE OR REPLACE VIEW daily_usage_analytics AS
SELECT 
    DATE(created_at) as date,
    COUNT(*) as total_activities,
    COUNT(DISTINCT user_id) as unique_users,
    COUNT(CASE WHEN activity_type = 'RECIPE_CREATED' THEN 1 END) as recipes_created,
    COUNT(CASE WHEN activity_type = 'AI_INTERACTION' THEN 1 END) as ai_interactions,
    COUNT(CASE WHEN activity_type = 'LOGIN' THEN 1 END) as logins
FROM user_activity_logs
GROUP BY DATE(created_at)
ORDER BY date DESC;

-- ============================================================================
-- 14. CREATE STORED PROCEDURES
-- ============================================================================

DELIMITER $$

-- Procedure to calculate learning progress
CREATE OR REPLACE PROCEDURE UpdateLearningProgress(IN userId BIGINT)
BEGIN
    DECLARE completed INT DEFAULT 0;
    DECLARE total INT DEFAULT 20;
    DECLARE percentage DECIMAL(5,2) DEFAULT 0.0;
    
    -- Calculate completion percentage
    SELECT completed_lessons, total_lessons INTO completed, total
    FROM learning_progress 
    WHERE user_id = userId;
    
    IF total > 0 THEN
        SET percentage = (completed * 100.0) / total;
    END IF;
    
    -- Update the record
    UPDATE learning_progress 
    SET completion_percentage = percentage,
        updated_at = CURRENT_TIMESTAMP
    WHERE user_id = userId;
END$$

-- Procedure to get user analytics
CREATE OR REPLACE PROCEDURE GetUserAnalytics(IN userId BIGINT)
BEGIN
    SELECT 
        u.id,
        u.name,
        COUNT(DISTINCT r.id) as total_recipes,
        COUNT(DISTINCT f.recipe_id) as total_favorites,
        COUNT(DISTINCT ai.id) as total_interactions,
        AVG(r.cooking_time) as avg_cooking_time,
        AVG(r.calories) as avg_calories,
        COALESCE(lp.completion_percentage, 0) as learning_progress
    FROM users u
    LEFT JOIN recipes r ON u.id = r.created_by
    LEFT JOIN user_favorite_recipes f ON u.id = f.user_id
    LEFT JOIN ai_interactions ai ON u.id = ai.user_id
    LEFT JOIN learning_progress lp ON u.id = lp.user_id
    WHERE u.id = userId
    GROUP BY u.id;
END$$

DELIMITER ;

-- ============================================================================
-- 15. INSERT SAMPLE DATA (Optional)
-- ============================================================================

-- Insert default learning progress for existing users
INSERT IGNORE INTO learning_progress (user_id, completed_lessons, total_lessons, completion_percentage)
SELECT id, 0, 20, 0.0 
FROM users 
WHERE is_active = TRUE;

-- Insert default preferences for existing users
INSERT IGNORE INTO user_preferences (user_id, language_preference, serving_size_preference, cooking_time_preference)
SELECT id, COALESCE(language_preference, 'vi'), 4, 30
FROM users 
WHERE is_active = TRUE;

-- ============================================================================
-- 16. CREATE TRIGGERS
-- ============================================================================

DELIMITER $$

-- Trigger to auto-update learning progress percentage
CREATE OR REPLACE TRIGGER trg_learning_progress_update
    BEFORE UPDATE ON learning_progress
    FOR EACH ROW
BEGIN
    IF NEW.total_lessons > 0 THEN
        SET NEW.completion_percentage = (NEW.completed_lessons * 100.0) / NEW.total_lessons;
    END IF;
END$$

-- Trigger to log recipe activities
CREATE OR REPLACE TRIGGER trg_recipe_activity_log
    AFTER INSERT ON recipes
    FOR EACH ROW
BEGIN
    INSERT INTO user_activity_logs (user_id, activity_type, target_id, target_type, activity_details)
    VALUES (NEW.created_by, 'RECIPE_CREATED', NEW.id, 'recipe', 
            JSON_OBJECT('recipe_title', NEW.title_vi, 'difficulty', NEW.difficulty));
END$$

-- Trigger to log favorite activities
CREATE OR REPLACE TRIGGER trg_favorite_activity_log
    AFTER INSERT ON user_favorite_recipes
    FOR EACH ROW
BEGIN
    INSERT INTO user_activity_logs (user_id, activity_type, target_id, target_type, activity_details)
    VALUES (NEW.user_id, 'RECIPE_FAVORITED', NEW.recipe_id, 'recipe', 
            JSON_OBJECT('recipe_id', NEW.recipe_id));
END$$

DELIMITER ;

-- ============================================================================
-- 17. FINAL VERIFICATION & CLEANUP
-- ============================================================================

-- Clean up expired sessions
DELETE FROM user_sessions WHERE expires_at < NOW();

-- Update statistics
ANALYZE TABLE users, recipes, ai_interactions, user_preferences, 
               user_cuisine_preferences, user_dietary_restrictions, 
               user_favorite_recipes, learning_progress;

-- Display migration summary
SELECT 'Migration completed successfully!' as status,
       NOW() as completed_at,
       (SELECT COUNT(*) FROM users WHERE is_active = TRUE) as active_users,
       (SELECT COUNT(*) FROM recipes WHERE is_public = TRUE) as public_recipes,
       (SELECT COUNT(*) FROM user_preferences) as user_preferences_created,
       (SELECT COUNT(*) FROM learning_progress) as learning_progress_created;

-- ============================================================================
-- MIGRATION COMPLETED
-- ============================================================================
