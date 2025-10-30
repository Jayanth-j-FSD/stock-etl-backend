-- ============================================================================
-- CREATE CURRENCIES TABLE
-- ============================================================================
-- Purpose: Store currency information with exchange rates
-- Dependencies: None (independent table)
-- Relationships: None
-- ============================================================================

CREATE TABLE IF NOT EXISTS currencies (
    -- Primary Key
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Currency Identity
    code VARCHAR(3) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,

    -- Exchange Rate Information
    "exchangeRate" DECIMAL(18, 6) NOT NULL,
    "baseCurrency" VARCHAR(3) NOT NULL,
    "lastUpdated" TIMESTAMP NOT NULL,

    -- Audit Timestamps
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- Constraints
    CONSTRAINT currencies_code_length CHECK (LENGTH(code) = 3),
    CONSTRAINT currencies_code_uppercase CHECK (code = UPPER(code)),
    CONSTRAINT currencies_baseCurrency_length CHECK (LENGTH("baseCurrency") = 3),
    CONSTRAINT currencies_baseCurrency_uppercase CHECK ("baseCurrency" = UPPER("baseCurrency")),
    CONSTRAINT currencies_exchangeRate_positive CHECK ("exchangeRate" > 0)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_currencies_code ON currencies(code);
CREATE INDEX IF NOT EXISTS idx_currencies_baseCurrency ON currencies("baseCurrency");
CREATE INDEX IF NOT EXISTS idx_currencies_lastUpdated ON currencies("lastUpdated");
CREATE INDEX IF NOT EXISTS idx_currencies_createdAt ON currencies("createdAt");

-- Composite index for common queries
CREATE INDEX IF NOT EXISTS idx_currencies_baseCurrency_code
    ON currencies("baseCurrency", code);

-- Full-text search index for code and name
CREATE INDEX IF NOT EXISTS idx_currencies_search
    ON currencies USING gin(to_tsvector('english', code || ' ' || name));

-- Comments
COMMENT ON TABLE currencies IS 'Currency information with exchange rates';
COMMENT ON COLUMN currencies.id IS 'Unique identifier for the currency (UUID)';
COMMENT ON COLUMN currencies.code IS 'ISO 4217 currency code (3 characters uppercase, e.g., USD, EUR)';
COMMENT ON COLUMN currencies.name IS 'Full currency name (e.g., United States Dollar)';
COMMENT ON COLUMN currencies."exchangeRate" IS 'Exchange rate relative to base currency';
COMMENT ON COLUMN currencies."baseCurrency" IS 'Base currency code for the exchange rate';
COMMENT ON COLUMN currencies."lastUpdated" IS 'Last exchange rate update timestamp';
COMMENT ON COLUMN currencies."createdAt" IS 'Record creation timestamp';
COMMENT ON COLUMN currencies."updatedAt" IS 'Record last update timestamp';

-- Success message
DO $$
BEGIN
    RAISE NOTICE 'Currencies table created successfully!';
END $$;
