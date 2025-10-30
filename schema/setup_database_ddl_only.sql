-- ============================================================================
-- DATABASE SETUP SCRIPT (DDL ONLY - No Sample Data)
-- ============================================================================
-- Purpose: Create all database tables without inserting sample data
-- Usage: psql -U postgres -d stocks_db -f schema/setup_database_ddl_only.sql
-- Description: Creates clean database structure for production use
-- ============================================================================

\echo '=========================================='
\echo 'Starting Database Setup (DDL Only)...'
\echo 'Database: stocks_db'
\echo 'Script: DDL Only (No Sample Data)'
\echo '=========================================='
\echo ''

-- Start transaction
BEGIN;

\echo 'Creating database tables...'
\echo ''

-- ============================================================================
-- CREATE USERS TABLE
-- ============================================================================

\echo '1. Creating users table...'

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    "firstName" VARCHAR(255),
    "lastName" VARCHAR(255),
    "isActive" BOOLEAN NOT NULL DEFAULT TRUE,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP NULL,
    CONSTRAINT users_email_check CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_isActive ON users("isActive");
CREATE INDEX IF NOT EXISTS idx_users_deletedAt ON users("deletedAt") WHERE "deletedAt" IS NULL;
CREATE INDEX IF NOT EXISTS idx_users_createdAt ON users("createdAt");

COMMENT ON TABLE users IS 'User accounts with authentication and profile information';

\echo '   ✓ Users table created'

-- ============================================================================
-- CREATE REFRESH_TOKENS TABLE
-- ============================================================================

\echo '2. Creating refresh_tokens table...'

CREATE TABLE IF NOT EXISTS refresh_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    token TEXT NOT NULL,
    "userId" UUID NOT NULL,
    "expiresAt" TIMESTAMP NOT NULL,
    "isRevoked" BOOLEAN NOT NULL DEFAULT FALSE,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_refresh_tokens_user
        FOREIGN KEY ("userId")
        REFERENCES users(id)
        ON DELETE CASCADE,
    CONSTRAINT refresh_tokens_token_unique UNIQUE (token)
);

CREATE INDEX IF NOT EXISTS idx_refresh_tokens_userId ON refresh_tokens("userId");
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_token ON refresh_tokens(token);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_expiresAt ON refresh_tokens("expiresAt");
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_isRevoked ON refresh_tokens("isRevoked");
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_userId_isRevoked ON refresh_tokens("userId", "isRevoked");

COMMENT ON TABLE refresh_tokens IS 'JWT refresh tokens for user session management';

\echo '   ✓ Refresh tokens table created'

-- ============================================================================
-- CREATE STOCKS TABLE
-- ============================================================================

\echo '3. Creating stocks table...'

CREATE TABLE IF NOT EXISTS stocks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    symbol VARCHAR(10) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    market VARCHAR(255),
    price DECIMAL(10, 2),
    "lastUpdated" TIMESTAMP,
    sector VARCHAR(255),
    industry VARCHAR(255),
    "marketCap" BIGINT,
    "dayHigh" DECIMAL(10, 2),
    "dayLow" DECIMAL(10, 2),
    "openPrice" DECIMAL(10, 2),
    "previousClose" DECIMAL(10, 2),
    volume BIGINT,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT stocks_symbol_length CHECK (LENGTH(symbol) BETWEEN 1 AND 10),
    CONSTRAINT stocks_price_positive CHECK (price IS NULL OR price >= 0),
    CONSTRAINT stocks_dayHigh_positive CHECK ("dayHigh" IS NULL OR "dayHigh" >= 0),
    CONSTRAINT stocks_dayLow_positive CHECK ("dayLow" IS NULL OR "dayLow" >= 0),
    CONSTRAINT stocks_openPrice_positive CHECK ("openPrice" IS NULL OR "openPrice" >= 0),
    CONSTRAINT stocks_previousClose_positive CHECK ("previousClose" IS NULL OR "previousClose" >= 0),
    CONSTRAINT stocks_volume_positive CHECK (volume IS NULL OR volume >= 0),
    CONSTRAINT stocks_marketCap_positive CHECK ("marketCap" IS NULL OR "marketCap" >= 0)
);

CREATE INDEX IF NOT EXISTS idx_stocks_symbol ON stocks(symbol);
CREATE INDEX IF NOT EXISTS idx_stocks_name ON stocks(name);
CREATE INDEX IF NOT EXISTS idx_stocks_market ON stocks(market);
CREATE INDEX IF NOT EXISTS idx_stocks_sector ON stocks(sector);
CREATE INDEX IF NOT EXISTS idx_stocks_industry ON stocks(industry);
CREATE INDEX IF NOT EXISTS idx_stocks_lastUpdated ON stocks("lastUpdated");
CREATE INDEX IF NOT EXISTS idx_stocks_createdAt ON stocks("createdAt");
CREATE INDEX IF NOT EXISTS idx_stocks_search ON stocks USING gin(to_tsvector('english', symbol || ' ' || name));

COMMENT ON TABLE stocks IS 'Stock/equity information with trading data';

\echo '   ✓ Stocks table created'

-- ============================================================================
-- CREATE CURRENCIES TABLE
-- ============================================================================

\echo '4. Creating currencies table...'

CREATE TABLE IF NOT EXISTS currencies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(3) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    "exchangeRate" DECIMAL(18, 6) NOT NULL,
    "baseCurrency" VARCHAR(3) NOT NULL,
    "lastUpdated" TIMESTAMP NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT currencies_code_length CHECK (LENGTH(code) = 3),
    CONSTRAINT currencies_code_uppercase CHECK (code = UPPER(code)),
    CONSTRAINT currencies_baseCurrency_length CHECK (LENGTH("baseCurrency") = 3),
    CONSTRAINT currencies_baseCurrency_uppercase CHECK ("baseCurrency" = UPPER("baseCurrency")),
    CONSTRAINT currencies_exchangeRate_positive CHECK ("exchangeRate" > 0)
);

CREATE INDEX IF NOT EXISTS idx_currencies_code ON currencies(code);
CREATE INDEX IF NOT EXISTS idx_currencies_baseCurrency ON currencies("baseCurrency");
CREATE INDEX IF NOT EXISTS idx_currencies_lastUpdated ON currencies("lastUpdated");
CREATE INDEX IF NOT EXISTS idx_currencies_createdAt ON currencies("createdAt");
CREATE INDEX IF NOT EXISTS idx_currencies_baseCurrency_code ON currencies("baseCurrency", code);
CREATE INDEX IF NOT EXISTS idx_currencies_search ON currencies USING gin(to_tsvector('english', code || ' ' || name));

COMMENT ON TABLE currencies IS 'Currency information with exchange rates';

\echo '   ✓ Currencies table created'
\echo ''

-- Commit transaction
COMMIT;

\echo '=========================================='
\echo 'Database Setup Complete (DDL Only)!'
\echo '=========================================='
\echo ''

-- Display created tables
\echo 'Created Tables:'
SELECT
    table_name,
    (SELECT COUNT(*)
     FROM information_schema.columns
     WHERE table_schema = 'public'
     AND table_name = t.table_name) as column_count
FROM information_schema.tables t
WHERE table_schema = 'public'
    AND table_name IN ('users', 'refresh_tokens', 'stocks', 'currencies')
ORDER BY table_name;

\echo ''
\echo 'Next Steps:'
\echo '1. (Optional) Run DML scripts to insert sample data'
\echo '2. Start your application: npm run start:dev'
\echo '3. Register users via API: POST /api/v1/auth/register'
\echo '4. Access Swagger documentation: http://localhost:3000/api/docs'
\echo ''
\echo '=========================================='
