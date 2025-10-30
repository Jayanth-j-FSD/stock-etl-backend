-- ============================================================================
-- CREATE STOCKS TABLE
-- ============================================================================
-- Purpose: Store stock/equity information with trading data
-- Dependencies: None (independent table)
-- Relationships: None
-- ============================================================================

CREATE TABLE IF NOT EXISTS stocks (
    -- Primary Key
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Stock Identity
    symbol VARCHAR(10) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    market VARCHAR(255),

    -- Trading Information
    price DECIMAL(10, 2),
    "lastUpdated" TIMESTAMP,

    -- Classification
    sector VARCHAR(255),
    industry VARCHAR(255),

    -- Market Data
    "marketCap" BIGINT,
    "dayHigh" DECIMAL(10, 2),
    "dayLow" DECIMAL(10, 2),
    "openPrice" DECIMAL(10, 2),
    "previousClose" DECIMAL(10, 2),
    volume BIGINT,

    -- Audit Timestamps
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- Constraints
    CONSTRAINT stocks_symbol_length CHECK (LENGTH(symbol) BETWEEN 1 AND 10),
    CONSTRAINT stocks_price_positive CHECK (price IS NULL OR price >= 0),
    CONSTRAINT stocks_dayHigh_positive CHECK ("dayHigh" IS NULL OR "dayHigh" >= 0),
    CONSTRAINT stocks_dayLow_positive CHECK ("dayLow" IS NULL OR "dayLow" >= 0),
    CONSTRAINT stocks_openPrice_positive CHECK ("openPrice" IS NULL OR "openPrice" >= 0),
    CONSTRAINT stocks_previousClose_positive CHECK ("previousClose" IS NULL OR "previousClose" >= 0),
    CONSTRAINT stocks_volume_positive CHECK (volume IS NULL OR volume >= 0),
    CONSTRAINT stocks_marketCap_positive CHECK ("marketCap" IS NULL OR "marketCap" >= 0)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_stocks_symbol ON stocks(symbol);
CREATE INDEX IF NOT EXISTS idx_stocks_name ON stocks(name);
CREATE INDEX IF NOT EXISTS idx_stocks_market ON stocks(market);
CREATE INDEX IF NOT EXISTS idx_stocks_sector ON stocks(sector);
CREATE INDEX IF NOT EXISTS idx_stocks_industry ON stocks(industry);
CREATE INDEX IF NOT EXISTS idx_stocks_lastUpdated ON stocks("lastUpdated");
CREATE INDEX IF NOT EXISTS idx_stocks_createdAt ON stocks("createdAt");

-- Full-text search index for symbol and name
CREATE INDEX IF NOT EXISTS idx_stocks_search
    ON stocks USING gin(to_tsvector('english', symbol || ' ' || name));

-- Comments
COMMENT ON TABLE stocks IS 'Stock/equity information with trading data';
COMMENT ON COLUMN stocks.id IS 'Unique identifier for the stock (UUID)';
COMMENT ON COLUMN stocks.symbol IS 'Stock symbol/ticker (e.g., AAPL, MSFT)';
COMMENT ON COLUMN stocks.name IS 'Full company/stock name';
COMMENT ON COLUMN stocks.market IS 'Stock market/exchange (e.g., NASDAQ, NYSE)';
COMMENT ON COLUMN stocks.price IS 'Current stock price';
COMMENT ON COLUMN stocks."lastUpdated" IS 'Last price update timestamp';
COMMENT ON COLUMN stocks.sector IS 'Business sector (e.g., Technology, Healthcare)';
COMMENT ON COLUMN stocks.industry IS 'Specific industry classification';
COMMENT ON COLUMN stocks."marketCap" IS 'Market capitalization in base currency';
COMMENT ON COLUMN stocks."dayHigh" IS 'Highest price of the current trading day';
COMMENT ON COLUMN stocks."dayLow" IS 'Lowest price of the current trading day';
COMMENT ON COLUMN stocks."openPrice" IS 'Opening price of the current trading day';
COMMENT ON COLUMN stocks."previousClose" IS 'Previous trading day closing price';
COMMENT ON COLUMN stocks.volume IS 'Trading volume (number of shares traded)';
COMMENT ON COLUMN stocks."createdAt" IS 'Record creation timestamp';
COMMENT ON COLUMN stocks."updatedAt" IS 'Record last update timestamp';

-- Success message
DO $$
BEGIN
    RAISE NOTICE 'Stocks table created successfully!';
END $$;
