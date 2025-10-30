-- ============================================================================
-- MASTER DATABASE SETUP SCRIPT (DDL + DML)
-- ============================================================================
-- Purpose: Complete database setup with tables and sample data
-- Usage: psql -U postgres -d stocks_db -f schema/setup_database.sql
-- Description: Creates all tables and inserts sample data for testing
-- ============================================================================

\echo '=========================================='
\echo 'Starting Database Setup...'
\echo 'Database: stocks_db'
\echo 'Script: Master Setup (DDL + DML)'
\echo '=========================================='
\echo ''

-- Start transaction
BEGIN;

\echo '=========================================='
\echo 'STEP 1: Creating Tables (DDL)'
\echo '=========================================='
\echo ''

-- ============================================================================
-- CREATE USERS TABLE
-- ============================================================================

\echo 'Creating users table...'

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

\echo '✓ Users table created'
\echo ''

-- ============================================================================
-- CREATE REFRESH_TOKENS TABLE
-- ============================================================================

\echo 'Creating refresh_tokens table...'

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

\echo '✓ Refresh tokens table created'
\echo ''

-- ============================================================================
-- CREATE STOCKS TABLE
-- ============================================================================

\echo 'Creating stocks table...'

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

\echo '✓ Stocks table created'
\echo ''

-- ============================================================================
-- CREATE CURRENCIES TABLE
-- ============================================================================

\echo 'Creating currencies table...'

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

\echo '✓ Currencies table created'
\echo ''

\echo '=========================================='
\echo 'STEP 2: Inserting Sample Data (DML)'
\echo '=========================================='
\echo ''

-- ============================================================================
-- INSERT SAMPLE USERS
-- ============================================================================

\echo 'Inserting sample users...'

INSERT INTO users (id, email, password, "firstName", "lastName", "isActive", "createdAt", "updatedAt")
VALUES
    ('11111111-1111-1111-1111-111111111111', 'admin@stocksbackend.com', '$2b$10$YourBcryptHashedPasswordHere123456789012345678901234567890', 'Admin', 'User', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('22222222-2222-2222-2222-222222222222', 'john.doe@example.com', '$2b$10$YourBcryptHashedPasswordHere123456789012345678901234567890', 'John', 'Doe', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('33333333-3333-3333-3333-333333333333', 'jane.smith@example.com', '$2b$10$YourBcryptHashedPasswordHere123456789012345678901234567890', 'Jane', 'Smith', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('44444444-4444-4444-4444-444444444444', 'inactive.user@example.com', '$2b$10$YourBcryptHashedPasswordHere123456789012345678901234567890', 'Inactive', 'User', FALSE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('55555555-5555-5555-5555-555555555555', 'bob.wilson@example.com', '$2b$10$YourBcryptHashedPasswordHere123456789012345678901234567890', 'Bob', 'Wilson', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (email) DO NOTHING;

\echo '✓ Sample users inserted'
\echo ''

-- ============================================================================
-- INSERT SAMPLE STOCKS
-- ============================================================================

\echo 'Inserting sample stocks...'

INSERT INTO stocks (id, symbol, name, market, price, "lastUpdated", sector, industry, "marketCap", "dayHigh", "dayLow", "openPrice", "previousClose", volume, "createdAt", "updatedAt")
VALUES
    ('a1111111-1111-1111-1111-111111111111', 'AAPL', 'Apple Inc.', 'NASDAQ', 175.50, CURRENT_TIMESTAMP, 'Technology', 'Consumer Electronics', 2750000000000, 176.00, 174.50, 175.00, 174.80, 55000000, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('a2222222-2222-2222-2222-222222222222', 'MSFT', 'Microsoft Corporation', 'NASDAQ', 378.90, CURRENT_TIMESTAMP, 'Technology', 'Software - Infrastructure', 2820000000000, 380.50, 377.20, 378.00, 377.85, 22000000, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('a3333333-3333-3333-3333-333333333333', 'GOOGL', 'Alphabet Inc. Class A', 'NASDAQ', 140.25, CURRENT_TIMESTAMP, 'Technology', 'Internet Content & Information', 1760000000000, 141.50, 139.80, 140.00, 139.95, 18000000, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('a4444444-4444-4444-4444-444444444444', 'AMZN', 'Amazon.com Inc.', 'NASDAQ', 145.80, CURRENT_TIMESTAMP, 'Consumer Cyclical', 'Internet Retail', 1510000000000, 147.20, 144.90, 145.50, 145.30, 48000000, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('a5555555-5555-5555-5555-555555555555', 'NVDA', 'NVIDIA Corporation', 'NASDAQ', 485.60, CURRENT_TIMESTAMP, 'Technology', 'Semiconductors', 1200000000000, 488.90, 483.20, 485.00, 484.75, 42000000, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('a6666666-6666-6666-6666-666666666666', 'META', 'Meta Platforms Inc.', 'NASDAQ', 352.30, CURRENT_TIMESTAMP, 'Communication Services', 'Internet Content & Information', 920000000000, 355.00, 350.80, 352.00, 351.75, 15000000, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('a7777777-7777-7777-7777-777777777777', 'TSLA', 'Tesla Inc.', 'NASDAQ', 242.50, CURRENT_TIMESTAMP, 'Consumer Cyclical', 'Auto Manufacturers', 770000000000, 245.80, 240.20, 242.00, 241.90, 125000000, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('b1111111-1111-1111-1111-111111111111', 'JPM', 'JPMorgan Chase & Co.', 'NYSE', 156.20, CURRENT_TIMESTAMP, 'Financial Services', 'Banks - Diversified', 452000000000, 157.50, 155.80, 156.00, 155.95, 8500000, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('b2222222-2222-2222-2222-222222222222', 'BAC', 'Bank of America Corporation', 'NYSE', 32.45, CURRENT_TIMESTAMP, 'Financial Services', 'Banks - Diversified', 258000000000, 32.80, 32.20, 32.40, 32.35, 42000000, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('b3333333-3333-3333-3333-333333333333', 'V', 'Visa Inc.', 'NYSE', 265.30, CURRENT_TIMESTAMP, 'Financial Services', 'Credit Services', 540000000000, 267.00, 264.50, 265.00, 264.85, 6200000, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('c1111111-1111-1111-1111-111111111111', 'JNJ', 'Johnson & Johnson', 'NYSE', 160.75, CURRENT_TIMESTAMP, 'Healthcare', 'Drug Manufacturers - General', 398000000000, 161.50, 160.20, 160.50, 160.40, 5800000, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('c2222222-2222-2222-2222-222222222222', 'UNH', 'UnitedHealth Group Inc.', 'NYSE', 525.80, CURRENT_TIMESTAMP, 'Healthcare', 'Healthcare Plans', 492000000000, 528.50, 524.20, 525.50, 525.30, 2800000, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('c3333333-3333-3333-3333-333333333333', 'PFE', 'Pfizer Inc.', 'NYSE', 28.95, CURRENT_TIMESTAMP, 'Healthcare', 'Drug Manufacturers - General', 162000000000, 29.20, 28.75, 28.90, 28.85, 38000000, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('d1111111-1111-1111-1111-111111111111', 'XOM', 'Exxon Mobil Corporation', 'NYSE', 105.20, CURRENT_TIMESTAMP, 'Energy', 'Oil & Gas Integrated', 418000000000, 106.50, 104.80, 105.00, 104.95, 18000000, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('d2222222-2222-2222-2222-222222222222', 'CVX', 'Chevron Corporation', 'NYSE', 148.60, CURRENT_TIMESTAMP, 'Energy', 'Oil & Gas Integrated', 282000000000, 149.80, 148.20, 148.50, 148.35, 7500000, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (symbol) DO NOTHING;

\echo '✓ Sample stocks inserted'
\echo ''

-- ============================================================================
-- INSERT SAMPLE CURRENCIES
-- ============================================================================

\echo 'Inserting sample currencies...'

INSERT INTO currencies (id, code, name, "exchangeRate", "baseCurrency", "lastUpdated", "createdAt", "updatedAt")
VALUES
    ('c1111111-1111-1111-1111-111111111111', 'USD', 'United States Dollar', 1.000000, 'USD', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('c2222222-2222-2222-2222-222222222222', 'EUR', 'Euro', 0.920000, 'USD', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('c3333333-3333-3333-3333-333333333333', 'GBP', 'British Pound Sterling', 0.790000, 'USD', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('c4444444-4444-4444-4444-444444444444', 'JPY', 'Japanese Yen', 148.500000, 'USD', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('c5555555-5555-5555-5555-555555555555', 'CHF', 'Swiss Franc', 0.880000, 'USD', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('c6666666-6666-6666-6666-666666666666', 'CAD', 'Canadian Dollar', 1.360000, 'USD', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('c7777777-7777-7777-7777-777777777777', 'AUD', 'Australian Dollar', 1.530000, 'USD', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('c8888888-8888-8888-8888-888888888888', 'CNY', 'Chinese Yuan', 7.240000, 'USD', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('c9999999-9999-9999-9999-999999999999', 'INR', 'Indian Rupee', 83.120000, 'USD', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('ca111111-1111-1111-1111-111111111111', 'BRL', 'Brazilian Real', 4.980000, 'USD', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (code) DO NOTHING;

\echo '✓ Sample currencies inserted'
\echo ''

-- Commit transaction
COMMIT;

\echo '=========================================='
\echo 'Database Setup Complete!'
\echo '=========================================='
\echo ''

-- Display summary
\echo 'Summary:'
SELECT 'users' as table_name, COUNT(*) as row_count FROM users
UNION ALL
SELECT 'refresh_tokens', COUNT(*) FROM refresh_tokens
UNION ALL
SELECT 'stocks', COUNT(*) FROM stocks
UNION ALL
SELECT 'currencies', COUNT(*) FROM currencies;

\echo ''
\echo 'Next Steps:'
\echo '1. Start your application: npm run start:dev'
\echo '2. Register users via API: POST /api/v1/auth/register'
\echo '3. Access Swagger documentation: http://localhost:3000/api/docs'
\echo ''
\echo '=========================================='
