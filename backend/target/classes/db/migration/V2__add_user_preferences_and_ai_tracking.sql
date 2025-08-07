-- Migration để thêm bảng theo dõi tương tác AI của người dùng và tùy chọn người dùng

-- Tạo bảng user_preferences để lưu trữ tùy chọn của người dùng
CREATE TABLE IF NOT EXISTS user_preferences (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    language_preference VARCHAR(10) DEFAULT 'vi',
    spice_preference ENUM('MILD', 'MEDIUM', 'HOT', 'EXTRA_HOT') DEFAULT 'MEDIUM',
    ai_assistant_enabled BIT DEFAULT 1,
    preferred_ai_model VARCHAR(50) DEFAULT 'gpt-4',
    dark_mode BIT DEFAULT 0,
    personalization_level INT DEFAULT 5,
    enable_recommendations BIT DEFAULT 1,
    dynamic_preferences JSON,
    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at DATETIME(6) DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP(6),
    CONSTRAINT fk_preferences_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Tạo bảng user_cuisine_preferences để lưu trữ sở thích ẩm thực của người dùng
CREATE TABLE IF NOT EXISTS user_cuisine_preferences (
    preference_id BIGINT NOT NULL,
    cuisine VARCHAR(255),
    CONSTRAINT fk_cuisine_preference FOREIGN KEY (preference_id) REFERENCES user_preferences(id) ON DELETE CASCADE
);

-- Tạo bảng user_dietary_preferences để lưu trữ chế độ ăn của người dùng
CREATE TABLE IF NOT EXISTS user_dietary_preferences (
    preference_id BIGINT NOT NULL,
    diet_type VARCHAR(255),
    CONSTRAINT fk_dietary_preference FOREIGN KEY (preference_id) REFERENCES user_preferences(id) ON DELETE CASCADE
);

-- Tạo bảng user_ingredient_preferences để lưu trữ nguyên liệu yêu thích của người dùng
CREATE TABLE IF NOT EXISTS user_ingredient_preferences (
    preference_id BIGINT NOT NULL,
    ingredient VARCHAR(255),
    CONSTRAINT fk_ingredient_preference FOREIGN KEY (preference_id) REFERENCES user_preferences(id) ON DELETE CASCADE
);

-- Tạo bảng user_ingredient_dislikes để lưu trữ nguyên liệu không thích của người dùng
CREATE TABLE IF NOT EXISTS user_ingredient_dislikes (
    preference_id BIGINT NOT NULL,
    ingredient VARCHAR(255),
    CONSTRAINT fk_ingredient_dislike FOREIGN KEY (preference_id) REFERENCES user_preferences(id) ON DELETE CASCADE
);

-- Tạo bảng user_ai_interaction để lưu trữ tương tác của người dùng với AI
CREATE TABLE IF NOT EXISTS user_ai_interaction (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    input TEXT NOT NULL,
    output TEXT NOT NULL,
    ai_type ENUM('GPT', 'GEMINI', 'VOICE', 'VISION') NOT NULL,
    metadata JSON,
    execution_time_ms INT,
    tokens_used INT,
    cost_usd DECIMAL(10,2),
    success BIT,
    error_message VARCHAR(255),
    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    CONSTRAINT fk_ai_interaction_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Cập nhật bảng recipes để thêm các trường liên quan đến AI
ALTER TABLE recipes 
ADD COLUMN IF NOT EXISTS ai_prompt TEXT,
ADD COLUMN IF NOT EXISTS ai_model VARCHAR(255),
ADD COLUMN IF NOT EXISTS ai_confidence DECIMAL(3,2),
ADD COLUMN IF NOT EXISTS source ENUM('AI_GENERATED', 'USER', 'IMPORTED'),
ADD COLUMN IF NOT EXISTS views INT DEFAULT 0,
ADD COLUMN IF NOT EXISTS favorites INT DEFAULT 0,
ADD COLUMN IF NOT EXISTS average_rating DECIMAL(3,2),
ADD COLUMN IF NOT EXISTS total_ratings INT DEFAULT 0;

-- Tạo chỉ mục để tối ưu hóa truy vấn
CREATE INDEX IF NOT EXISTS idx_user_preferences_user_id ON user_preferences(user_id);
CREATE INDEX IF NOT EXISTS idx_user_ai_interaction_user_id ON user_ai_interaction(user_id);
CREATE INDEX IF NOT EXISTS idx_user_ai_interaction_ai_type ON user_ai_interaction(ai_type);
CREATE INDEX IF NOT EXISTS idx_user_ai_interaction_created_at ON user_ai_interaction(created_at);
