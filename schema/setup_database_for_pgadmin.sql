-- ============================================================================
-- MASTER DATABASE SETUP SCRIPT (DDL + DML) - pgAdmin Compatible
-- ============================================================================

DO $$ BEGIN RAISE NOTICE '=========================================='; END $$;
DO $$ BEGIN RAISE NOTICE 'Starting Database Setup...'; END $$;
DO $$ BEGIN RAISE NOTICE 'Database: stocks_db'; END $$;
DO $$ BEGIN RAISE NOTICE 'Script: Master Setup (DDL + DML)'; END $$;
DO $$ BEGIN RAISE NOTICE '=========================================='; END $$;

BEGIN;

DO $$ BEGIN RAISE NOTICE 'STEP 1: Creating Tables (DDL)'; END $$;

-- USERS TABLE ---------------------------------------------------------------
DO $$ BEGIN RAISE NOTICE 'Creating users table...'; END $$;

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

DO $$ BEGIN RAISE NOTICE '✓ Users table created'; END $$;

-- REFRESH TOKENS TABLE ------------------------------------------------------
DO $$ BEGIN RAISE NOTICE 'Creating refresh_tokens table...'; END $$;

CREATE TABLE IF NOT EXISTS refresh_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    token TEXT NOT NULL,
    "userId" UUID NOT NULL,
    "expiresAt" TIMESTAMP NOT NULL,
    "isRevoked" BOOLEAN NOT NULL DEFAULT FALSE,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_refresh_tokens_user FOREIGN KEY ("userId")
        REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT refresh_tokens_token_unique UNIQUE (token)
);

CREATE INDEX IF NOT EXISTS idx_refresh_tokens_userId ON refresh_tokens("userId");
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_token ON refresh_tokens(token);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_expiresAt ON refresh_tokens("expiresAt");
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_isRevoked ON refresh_tokens("isRevoked");
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_userId_isRevoked ON refresh_tokens("userId", "isRevoked");

COMMENT ON TABLE refresh_tokens IS 'JWT refresh tokens for user session management';

DO $$ BEGIN RAISE NOTICE '✓ Refresh tokens table created'; END $$;

-- STOCKS TABLE --------------------------------------------------------------
DO $$ BEGIN RAISE NOTICE 'Creating stocks table...'; END $$;

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

DO $$ BEGIN RAISE NOTICE '✓ Stocks table created'; END $$;

-- CURRENCIES TABLE ----------------------------------------------------------
DO $$ BEGIN RAISE NOTICE 'Creating currencies table...'; END $$;

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

DO $$ BEGIN RAISE NOTICE '✓ Currencies table created'; END $$;

-- SAMPLE DATA ---------------------------------------------------------------
DO $$ BEGIN RAISE NOTICE 'STEP 2: Inserting Sample Data (DML)'; END $$;

-- INSERT INTO users (...) ON CONFLICT (email) DO NOTHING;
-- INSERT INTO stocks (...) ON CONFLICT (symbol) DO NOTHING;
-- INSERT INTO currencies (...) ON CONFLICT (code) DO NOTHING;
-- SAMPLE DATA ---------------------------------------------------------------
DO $$ BEGIN RAISE NOTICE 'STEP 2: Inserting Sample Data (DML)'; END $$;

-- Insert sample users
INSERT INTO users (email, password, "firstName", "lastName")
VALUES
    ('admin@example.com', 'hashed-password-admin', 'Admin', 'User'),
    ('jane.doe@example.com', 'hashed-password-jane', 'Jane', 'Doe'),
    ('john.smith@example.com', 'hashed-password-john', 'John', 'Smith')
ON CONFLICT (email) DO NOTHING;

-- Insert sample stocks
INSERT INTO stocks (symbol, name, market, price, "lastUpdated", sector, industry, "marketCap", "dayHigh", "dayLow", "openPrice", "previousClose", volume)
VALUES
    ('AAPL', 'Apple Inc.', 'NASDAQ', 190.25, CURRENT_TIMESTAMP, 'Technology', 'Consumer Electronics', 3000000000000, 192.10, 188.90, 189.50, 189.10, 50000000),
    ('GOOGL', 'Alphabet Inc.', 'NASDAQ', 2800.50, CURRENT_TIMESTAMP, 'Technology', 'Internet Services', 1800000000000, 2825.00, 2780.00, 2795.00, 2805.00, 25000000),
    ('TSLA', 'Tesla Inc.', 'NASDAQ', 250.75, CURRENT_TIMESTAMP, 'Automotive', 'Electric Vehicles', 800000000000, 255.00, 248.50, 249.00, 251.00, 40000000)
ON CONFLICT (symbol) DO NOTHING;

-- Insert sample currencies
INSERT INTO currencies (code, name, "exchangeRate", "baseCurrency", "lastUpdated")
VALUES
    ('USD', 'United States Dollar', 1.000000, 'USD', CURRENT_TIMESTAMP),
    ('EUR', 'Euro', 0.920000, 'USD', CURRENT_TIMESTAMP),
    ('INR', 'Indian Rupee', 83.100000, 'USD', CURRENT_TIMESTAMP)
ON CONFLICT (code) DO NOTHING;

COMMIT;

DO $$ BEGIN RAISE NOTICE '=========================================='; END $$;
DO $$ BEGIN RAISE NOTICE 'Database Setup Complete!'; END $$;
DO $$ BEGIN RAISE NOTICE '=========================================='; END $$;

-- Display summary
SELECT 'users' AS table_name, COUNT(*) AS row_count FROM users
UNION ALL
SELECT 'refresh_tokens', COUNT(*) FROM refresh_tokens
UNION ALL
SELECT 'stocks', COUNT(*) FROM stocks
UNION ALL
SELECT 'currencies', COUNT(*) FROM currencies;


COMMIT;

DO $$ BEGIN RAISE NOTICE '=========================================='; END $$;
DO $$ BEGIN RAISE NOTICE 'Database Setup Complete!'; END $$;
DO $$ BEGIN RAISE NOTICE '=========================================='; END $$;

-- Display summary
SELECT 'users' AS table_name, COUNT(*) AS row_count FROM users
UNION ALL
SELECT 'refresh_tokens', COUNT(*) FROM refresh_tokens
UNION ALL
SELECT 'stocks', COUNT(*) FROM stocks
UNION ALL
SELECT 'currencies', COUNT(*) FROM currencies;
