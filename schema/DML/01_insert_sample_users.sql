-- ============================================================================
-- INSERT SAMPLE USERS
-- ============================================================================
-- Purpose: Insert sample user data for testing and development
-- Note: Passwords are bcrypt hashed (original: "Password123!")
-- Dependencies: users table must exist
-- ============================================================================

-- Insert sample users
INSERT INTO users (id, email, password, "firstName", "lastName", "isActive", "createdAt", "updatedAt")
VALUES
    -- Admin User
    (
        '11111111-1111-1111-1111-111111111111',
        'admin@stocksbackend.com',
        '$2b$10$YourBcryptHashedPasswordHere123456789012345678901234567890',
        'Admin',
        'User',
        TRUE,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),

    -- Test User 1
    (
        '22222222-2222-2222-2222-222222222222',
        'john.doe@example.com',
        '$2b$10$YourBcryptHashedPasswordHere123456789012345678901234567890',
        'John',
        'Doe',
        TRUE,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),

    -- Test User 2
    (
        '33333333-3333-3333-3333-333333333333',
        'jane.smith@example.com',
        '$2b$10$YourBcryptHashedPasswordHere123456789012345678901234567890',
        'Jane',
        'Smith',
        TRUE,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),

    -- Test User 3 (Inactive)
    (
        '44444444-4444-4444-4444-444444444444',
        'inactive.user@example.com',
        '$2b$10$YourBcryptHashedPasswordHere123456789012345678901234567890',
        'Inactive',
        'User',
        FALSE,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),

    -- Test User 4
    (
        '55555555-5555-5555-5555-555555555555',
        'bob.wilson@example.com',
        '$2b$10$YourBcryptHashedPasswordHere123456789012345678901234567890',
        'Bob',
        'Wilson',
        TRUE,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    )
ON CONFLICT (email) DO NOTHING;

-- Verify insertion
DO $$
DECLARE
    user_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO user_count FROM users;
    RAISE NOTICE 'Total users in database: %', user_count;
    RAISE NOTICE 'Sample users inserted successfully!';
    RAISE NOTICE 'Note: To use these users, register through the API to generate proper bcrypt passwords.';
END $$;

-- Display sample users
SELECT
    id,
    email,
    "firstName",
    "lastName",
    "isActive",
    "createdAt"
FROM users
ORDER BY "createdAt" DESC;
