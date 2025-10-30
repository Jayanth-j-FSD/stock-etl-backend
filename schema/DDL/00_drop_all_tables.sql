-- ============================================================================
-- DROP ALL TABLES (Cleanup Script)
-- ============================================================================
-- Purpose: Drop all tables in the correct order (respecting foreign key constraints)
-- Usage: Run this script to clean up the database before fresh setup
-- Warning: THIS WILL DELETE ALL DATA!
-- ============================================================================

-- Drop tables in reverse order of creation (to respect foreign keys)
DROP TABLE IF EXISTS refresh_tokens CASCADE;
DROP TABLE IF EXISTS stocks CASCADE;
DROP TABLE IF EXISTS currencies CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Drop any sequences or custom types if needed
-- DROP SEQUENCE IF EXISTS custom_sequence;
-- DROP TYPE IF EXISTS custom_type;

-- Verify all tables are dropped
SELECT
    schemaname,
    tablename
FROM pg_tables
WHERE schemaname = 'public'
    AND tablename IN ('users', 'refresh_tokens', 'stocks', 'currencies');

-- Success message
DO $$
BEGIN
    RAISE NOTICE 'All tables have been dropped successfully!';
END $$;
