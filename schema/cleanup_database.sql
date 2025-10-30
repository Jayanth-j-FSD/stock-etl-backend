-- ============================================================================
-- DATABASE CLEANUP SCRIPT
-- Purpose: Remove tables with schema conflicts to allow TypeORM to recreate them
-- ============================================================================

BEGIN;

DO $$ BEGIN RAISE NOTICE 'Starting database cleanup...'; END $$;

-- Drop all existing tables in the correct order (respecting foreign keys)
DROP TABLE IF EXISTS refresh_tokens CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS stocks CASCADE;
DROP TABLE IF EXISTS currencies CASCADE;

DO $$ BEGIN RAISE NOTICE 'All tables dropped successfully!'; END $$;
DO $$ BEGIN RAISE NOTICE 'TypeORM will recreate them on next startup.'; END $$;

COMMIT;
