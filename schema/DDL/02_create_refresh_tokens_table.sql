-- ============================================================================
-- CREATE REFRESH_TOKENS TABLE
-- ============================================================================
-- Purpose: Store JWT refresh tokens for user session management
-- Dependencies: users table (foreign key)
-- Relationships: Many-to-One with users
-- ============================================================================

CREATE TABLE IF NOT EXISTS refresh_tokens (
    -- Primary Key
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Token Data
    token TEXT NOT NULL,

    -- User Reference (Foreign Key)
    "userId" UUID NOT NULL,

    -- Token Lifecycle
    "expiresAt" TIMESTAMP NOT NULL,
    "isRevoked" BOOLEAN NOT NULL DEFAULT FALSE,

    -- Audit Timestamp
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- Foreign Key Constraint
    CONSTRAINT fk_refresh_tokens_user
        FOREIGN KEY ("userId")
        REFERENCES users(id)
        ON DELETE CASCADE,

    -- Unique constraint on token
    CONSTRAINT refresh_tokens_token_unique UNIQUE (token)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_userId ON refresh_tokens("userId");
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_token ON refresh_tokens(token);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_expiresAt ON refresh_tokens("expiresAt");
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_isRevoked ON refresh_tokens("isRevoked");

-- Composite index for common queries
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_userId_isRevoked
    ON refresh_tokens("userId", "isRevoked");

-- Comments
COMMENT ON TABLE refresh_tokens IS 'JWT refresh tokens for user session management';
COMMENT ON COLUMN refresh_tokens.id IS 'Unique identifier for the refresh token (UUID)';
COMMENT ON COLUMN refresh_tokens.token IS 'JWT refresh token string';
COMMENT ON COLUMN refresh_tokens."userId" IS 'Reference to the user who owns this token';
COMMENT ON COLUMN refresh_tokens."expiresAt" IS 'Token expiration timestamp';
COMMENT ON COLUMN refresh_tokens."isRevoked" IS 'Token revoked status (true if manually invalidated)';
COMMENT ON COLUMN refresh_tokens."createdAt" IS 'Token creation timestamp';

-- Success message
DO $$
BEGIN
    RAISE NOTICE 'Refresh tokens table created successfully!';
END $$;
