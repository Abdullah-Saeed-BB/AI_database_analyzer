CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- 1. USER MANAGEMENT & AUTHENTICATION
-- ==========================================

CREATE TYPE user_role AS ENUM ('employee', 'manager', 'admin');

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,  -- Argon2id recommended
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role user_role DEFAULT 'employee',
    last_login_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);


-- Indexes for auth queries
CREATE INDEX idx_users_email ON users(email);

-- ==========================================
-- 2. CONVERSATION MANAGEMENT
-- ==========================================

CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255),  -- Auto-generated or user-edited
    prompt VARCHAR(255),  -- Auto-generated or user-edited
    is_archived BOOLEAN DEFAULT false,
    res_text TEXT,
    res_sql VARCHAR(500), 
    res_data JSONB DEFAULT '{}',  -- Session context, preferences
    metadata JSONB DEFAULT '{}',  -- Custom app metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- For user's conversation list (sorted by recent activity)
CREATE INDEX idx_conversations_user_updated ON conversations(user_id, created_at DESC);
