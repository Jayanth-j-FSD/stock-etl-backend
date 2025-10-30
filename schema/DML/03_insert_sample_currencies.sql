-- ============================================================================
-- INSERT SAMPLE CURRENCIES
-- ============================================================================
-- Purpose: Insert sample currency data with exchange rates
-- Dependencies: currencies table must exist
-- Note: Exchange rates are sample values based on USD as base currency
-- ============================================================================

-- Insert major world currencies
INSERT INTO currencies (
    id,
    code,
    name,
    "exchangeRate",
    "baseCurrency",
    "lastUpdated",
    "createdAt",
    "updatedAt"
)
VALUES
    -- Base Currency (USD)
    (
        'c1111111-1111-1111-1111-111111111111',
        'USD',
        'United States Dollar',
        1.000000,
        'USD',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),

    -- Major Currencies
    (
        'c2222222-2222-2222-2222-222222222222',
        'EUR',
        'Euro',
        0.920000,
        'USD',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    (
        'c3333333-3333-3333-3333-333333333333',
        'GBP',
        'British Pound Sterling',
        0.790000,
        'USD',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    (
        'c4444444-4444-4444-4444-444444444444',
        'JPY',
        'Japanese Yen',
        148.500000,
        'USD',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    (
        'c5555555-5555-5555-5555-555555555555',
        'CHF',
        'Swiss Franc',
        0.880000,
        'USD',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    (
        'c6666666-6666-6666-6666-666666666666',
        'CAD',
        'Canadian Dollar',
        1.360000,
        'USD',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    (
        'c7777777-7777-7777-7777-777777777777',
        'AUD',
        'Australian Dollar',
        1.530000,
        'USD',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    (
        'c8888888-8888-8888-8888-888888888888',
        'CNY',
        'Chinese Yuan',
        7.240000,
        'USD',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    (
        'c9999999-9999-9999-9999-999999999999',
        'INR',
        'Indian Rupee',
        83.120000,
        'USD',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    (
        'ca111111-1111-1111-1111-111111111111',
        'BRL',
        'Brazilian Real',
        4.980000,
        'USD',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    (
        'ca222222-2222-2222-2222-222222222222',
        'MXN',
        'Mexican Peso',
        17.150000,
        'USD',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    (
        'ca333333-3333-3333-3333-333333333333',
        'ZAR',
        'South African Rand',
        18.850000,
        'USD',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    (
        'ca444444-4444-4444-4444-444444444444',
        'KRW',
        'South Korean Won',
        1325.500000,
        'USD',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    (
        'ca555555-5555-5555-5555-555555555555',
        'SGD',
        'Singapore Dollar',
        1.350000,
        'USD',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    (
        'ca666666-6666-6666-6666-666666666666',
        'HKD',
        'Hong Kong Dollar',
        7.830000,
        'USD',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    (
        'ca777777-7777-7777-7777-777777777777',
        'NZD',
        'New Zealand Dollar',
        1.630000,
        'USD',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    (
        'ca888888-8888-8888-8888-888888888888',
        'SEK',
        'Swedish Krona',
        10.850000,
        'USD',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    (
        'ca999999-9999-9999-9999-999999999999',
        'NOK',
        'Norwegian Krone',
        10.620000,
        'USD',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    (
        'cb111111-1111-1111-1111-111111111111',
        'DKK',
        'Danish Krone',
        6.860000,
        'USD',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    (
        'cb222222-2222-2222-2222-222222222222',
        'PLN',
        'Polish Zloty',
        4.120000,
        'USD',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    )
ON CONFLICT (code) DO NOTHING;

-- Verify insertion
DO $$
DECLARE
    currency_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO currency_count FROM currencies;
    RAISE NOTICE 'Total currencies in database: %', currency_count;
    RAISE NOTICE 'Sample currencies inserted successfully!';
END $$;

-- Display currency statistics
SELECT
    "baseCurrency",
    COUNT(*) as currency_count,
    ROUND(AVG("exchangeRate")::numeric, 6) as avg_rate,
    MIN("exchangeRate") as min_rate,
    MAX("exchangeRate") as max_rate
FROM currencies
GROUP BY "baseCurrency";

-- Display all currencies sorted by exchange rate
SELECT
    code,
    name,
    "exchangeRate",
    "baseCurrency",
    "lastUpdated"
FROM currencies
ORDER BY "exchangeRate" ASC;
