-- ============================================================================
-- INSERT SAMPLE STOCKS
-- ============================================================================
-- Purpose: Insert sample stock data for testing and development
-- Dependencies: stocks table must exist
-- Note: Stock prices and data are sample values for testing purposes
-- ============================================================================

-- Insert major US stocks
INSERT INTO stocks (
    id,
    symbol,
    name,
    market,
    price,
    "lastUpdated",
    sector,
    industry,
    "marketCap",
    "dayHigh",
    "dayLow",
    "openPrice",
    "previousClose",
    volume,
    "createdAt",
    "updatedAt"
)
VALUES
    -- Technology Stocks
    (
        'a1111111-1111-1111-1111-111111111111',
        'AAPL',
        'Apple Inc.',
        'NASDAQ',
        175.50,
        CURRENT_TIMESTAMP,
        'Technology',
        'Consumer Electronics',
        2750000000000,
        176.00,
        174.50,
        175.00,
        174.80,
        55000000,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    (
        'a2222222-2222-2222-2222-222222222222',
        'MSFT',
        'Microsoft Corporation',
        'NASDAQ',
        378.90,
        CURRENT_TIMESTAMP,
        'Technology',
        'Software - Infrastructure',
        2820000000000,
        380.50,
        377.20,
        378.00,
        377.85,
        22000000,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    (
        'a3333333-3333-3333-3333-333333333333',
        'GOOGL',
        'Alphabet Inc. Class A',
        'NASDAQ',
        140.25,
        CURRENT_TIMESTAMP,
        'Technology',
        'Internet Content & Information',
        1760000000000,
        141.50,
        139.80,
        140.00,
        139.95,
        18000000,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    (
        'a4444444-4444-4444-4444-444444444444',
        'AMZN',
        'Amazon.com Inc.',
        'NASDAQ',
        145.80,
        CURRENT_TIMESTAMP,
        'Consumer Cyclical',
        'Internet Retail',
        1510000000000,
        147.20,
        144.90,
        145.50,
        145.30,
        48000000,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    (
        'a5555555-5555-5555-5555-555555555555',
        'NVDA',
        'NVIDIA Corporation',
        'NASDAQ',
        485.60,
        CURRENT_TIMESTAMP,
        'Technology',
        'Semiconductors',
        1200000000000,
        488.90,
        483.20,
        485.00,
        484.75,
        42000000,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    (
        'a6666666-6666-6666-6666-666666666666',
        'META',
        'Meta Platforms Inc.',
        'NASDAQ',
        352.30,
        CURRENT_TIMESTAMP,
        'Communication Services',
        'Internet Content & Information',
        920000000000,
        355.00,
        350.80,
        352.00,
        351.75,
        15000000,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    (
        'a7777777-7777-7777-7777-777777777777',
        'TSLA',
        'Tesla Inc.',
        'NASDAQ',
        242.50,
        CURRENT_TIMESTAMP,
        'Consumer Cyclical',
        'Auto Manufacturers',
        770000000000,
        245.80,
        240.20,
        242.00,
        241.90,
        125000000,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),

    -- Financial Stocks
    (
        'b1111111-1111-1111-1111-111111111111',
        'JPM',
        'JPMorgan Chase & Co.',
        'NYSE',
        156.20,
        CURRENT_TIMESTAMP,
        'Financial Services',
        'Banks - Diversified',
        452000000000,
        157.50,
        155.80,
        156.00,
        155.95,
        8500000,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    (
        'b2222222-2222-2222-2222-222222222222',
        'BAC',
        'Bank of America Corporation',
        'NYSE',
        32.45,
        CURRENT_TIMESTAMP,
        'Financial Services',
        'Banks - Diversified',
        258000000000,
        32.80,
        32.20,
        32.40,
        32.35,
        42000000,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    (
        'b3333333-3333-3333-3333-333333333333',
        'V',
        'Visa Inc.',
        'NYSE',
        265.30,
        CURRENT_TIMESTAMP,
        'Financial Services',
        'Credit Services',
        540000000000,
        267.00,
        264.50,
        265.00,
        264.85,
        6200000,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),

    -- Healthcare Stocks
    (
        'c1111111-1111-1111-1111-111111111111',
        'JNJ',
        'Johnson & Johnson',
        'NYSE',
        160.75,
        CURRENT_TIMESTAMP,
        'Healthcare',
        'Drug Manufacturers - General',
        398000000000,
        161.50,
        160.20,
        160.50,
        160.40,
        5800000,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    (
        'c2222222-2222-2222-2222-222222222222',
        'UNH',
        'UnitedHealth Group Inc.',
        'NYSE',
        525.80,
        CURRENT_TIMESTAMP,
        'Healthcare',
        'Healthcare Plans',
        492000000000,
        528.50,
        524.20,
        525.50,
        525.30,
        2800000,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    (
        'c3333333-3333-3333-3333-333333333333',
        'PFE',
        'Pfizer Inc.',
        'NYSE',
        28.95,
        CURRENT_TIMESTAMP,
        'Healthcare',
        'Drug Manufacturers - General',
        162000000000,
        29.20,
        28.75,
        28.90,
        28.85,
        38000000,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),

    -- Energy Stocks
    (
        'd1111111-1111-1111-1111-111111111111',
        'XOM',
        'Exxon Mobil Corporation',
        'NYSE',
        105.20,
        CURRENT_TIMESTAMP,
        'Energy',
        'Oil & Gas Integrated',
        418000000000,
        106.50,
        104.80,
        105.00,
        104.95,
        18000000,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    (
        'd2222222-2222-2222-2222-222222222222',
        'CVX',
        'Chevron Corporation',
        'NYSE',
        148.60,
        CURRENT_TIMESTAMP,
        'Energy',
        'Oil & Gas Integrated',
        282000000000,
        149.80,
        148.20,
        148.50,
        148.35,
        7500000,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    )
ON CONFLICT (symbol) DO NOTHING;

-- Verify insertion
DO $$
DECLARE
    stock_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO stock_count FROM stocks;
    RAISE NOTICE 'Total stocks in database: %', stock_count;
    RAISE NOTICE 'Sample stocks inserted successfully!';
END $$;

-- Display sample stocks by sector
SELECT
    sector,
    COUNT(*) as stock_count,
    ROUND(AVG(price)::numeric, 2) as avg_price,
    SUM("marketCap") as total_market_cap
FROM stocks
GROUP BY sector
ORDER BY total_market_cap DESC;

-- Display all inserted stocks
SELECT
    symbol,
    name,
    market,
    price,
    sector,
    industry,
    "marketCap"
FROM stocks
ORDER BY "marketCap" DESC;
