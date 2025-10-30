-- ============================================================================
-- CREATE USERS TABLE
-- ============================================================================
-- Purpose: Store user account information with authentication details
-- Dependencies: None (base table)
-- Relationships: One-to-Many with refresh_tokens
-- ============================================================================

CREATE TABLE IF NOT EXISTS users (
    -- Primary Key
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- User Credentials
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,

    -- User Profile
    "firstName" VARCHAR(255),
    "lastName" VARCHAR(255),

    -- Status
    "isActive" BOOLEAN NOT NULL DEFAULT TRUE,

    -- Audit Timestamps
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP NULL,

    -- Constraints
    CONSTRAINT users_email_check CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_isActive ON users("isActive");
CREATE INDEX IF NOT EXISTS idx_users_deletedAt ON users("deletedAt") WHERE "deletedAt" IS NULL;
CREATE INDEX IF NOT EXISTS idx_users_createdAt ON users("createdAt");

-- Comments
COMMENT ON TABLE users IS 'User accounts with authentication and profile information';
COMMENT ON COLUMN users.id IS 'Unique identifier for the user (UUID)';
COMMENT ON COLUMN users.email IS 'User email address (unique, used for login)';
COMMENT ON COLUMN users.password IS 'Bcrypt hashed password';
COMMENT ON COLUMN users."firstName" IS 'User first name';
COMMENT ON COLUMN users."lastName" IS 'User last name';
COMMENT ON COLUMN users."isActive" IS 'Account active status (soft disable)';
COMMENT ON COLUMN users."createdAt" IS 'Record creation timestamp';
COMMENT ON COLUMN users."updatedAt" IS 'Record last update timestamp';
COMMENT ON COLUMN users."deletedAt" IS 'Soft delete timestamp (NULL if not deleted)';

-- Success message
DO $$
BEGIN
    RAISE NOTICE 'Users table created successfully!';
END $$;
