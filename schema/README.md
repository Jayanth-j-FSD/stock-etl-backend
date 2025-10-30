# Database Schema Documentation

This directory contains SQL scripts for database setup, maintenance, and sample data management.

## Directory Structure

```
schema/
├── DDL/                            # Data Definition Language (Table Creation)
│   ├── 00_drop_all_tables.sql     # Drop all tables (cleanup)
│   ├── 01_create_users_table.sql  # Users table
│   ├── 02_create_refresh_tokens_table.sql  # Refresh tokens table
│   ├── 03_create_stocks_table.sql # Stocks table
│   └── 04_create_currencies_table.sql  # Currencies table
│
├── DML/                            # Data Manipulation Language (Sample Data)
│   ├── 01_insert_sample_users.sql      # Sample users
│   ├── 02_insert_sample_stocks.sql     # Sample stocks
│   └── 03_insert_sample_currencies.sql # Sample currencies
│
├── setup_database.sql              # Master setup script (DDL + DML)
├── setup_database_ddl_only.sql     # DDL only (no sample data)
└── README.md                       # This file
```

---

## Database Tables

### 1. Users Table
**Purpose:** Store user account information with authentication details

**Columns:**
- `id` (UUID, PK) - Unique user identifier
- `email` (VARCHAR, UNIQUE) - User email for login
- `password` (VARCHAR) - Bcrypt hashed password
- `firstName` (VARCHAR, nullable) - User first name
- `lastName` (VARCHAR, nullable) - User last name
- `isActive` (BOOLEAN, default TRUE) - Account active status
- `createdAt` (TIMESTAMP) - Creation timestamp
- `updatedAt` (TIMESTAMP) - Last update timestamp
- `deletedAt` (TIMESTAMP, nullable) - Soft delete timestamp

**Indexes:**
- `idx_users_email` - Email lookup
- `idx_users_isActive` - Active user filtering
- `idx_users_deletedAt` - Soft delete filtering

**Relationships:**
- One-to-Many with `refresh_tokens`

---

### 2. Refresh Tokens Table
**Purpose:** JWT refresh token management for user sessions

**Columns:**
- `id` (UUID, PK) - Unique token identifier
- `token` (TEXT, UNIQUE) - JWT refresh token string
- `userId` (UUID, FK) - Reference to users table
- `expiresAt` (TIMESTAMP) - Token expiration time
- `isRevoked` (BOOLEAN, default FALSE) - Token revocation status
- `createdAt` (TIMESTAMP) - Token creation timestamp

**Indexes:**
- `idx_refresh_tokens_userId` - User token lookup
- `idx_refresh_tokens_token` - Token lookup
- `idx_refresh_tokens_expiresAt` - Expiration filtering
- `idx_refresh_tokens_userId_isRevoked` - Composite index

**Relationships:**
- Many-to-One with `users` (CASCADE delete)

---

### 3. Stocks Table
**Purpose:** Stock/equity information with trading data

**Columns:**
- `id` (UUID, PK) - Unique stock identifier
- `symbol` (VARCHAR(10), UNIQUE) - Stock ticker symbol
- `name` (VARCHAR) - Company name
- `market` (VARCHAR, nullable) - Stock exchange (NASDAQ, NYSE)
- `price` (DECIMAL(10,2), nullable) - Current price
- `lastUpdated` (TIMESTAMP, nullable) - Last price update
- `sector` (VARCHAR, nullable) - Business sector
- `industry` (VARCHAR, nullable) - Industry classification
- `marketCap` (BIGINT, nullable) - Market capitalization
- `dayHigh` (DECIMAL(10,2), nullable) - Day high price
- `dayLow` (DECIMAL(10,2), nullable) - Day low price
- `openPrice` (DECIMAL(10,2), nullable) - Opening price
- `previousClose` (DECIMAL(10,2), nullable) - Previous close
- `volume` (BIGINT, nullable) - Trading volume
- `createdAt` (TIMESTAMP) - Creation timestamp
- `updatedAt` (TIMESTAMP) - Last update timestamp

**Indexes:**
- `idx_stocks_symbol` - Symbol lookup
- `idx_stocks_name` - Name search
- `idx_stocks_market` - Market filtering
- `idx_stocks_sector` - Sector filtering
- `idx_stocks_search` - Full-text search (GIN index)

**Constraints:**
- Symbol length: 1-10 characters
- All price fields must be non-negative

---

### 4. Currencies Table
**Purpose:** Currency information with exchange rates

**Columns:**
- `id` (UUID, PK) - Unique currency identifier
- `code` (VARCHAR(3), UNIQUE) - ISO 4217 currency code
- `name` (VARCHAR) - Full currency name
- `exchangeRate` (DECIMAL(18,6)) - Exchange rate vs base
- `baseCurrency` (VARCHAR(3)) - Base currency code
- `lastUpdated` (TIMESTAMP) - Last rate update
- `createdAt` (TIMESTAMP) - Creation timestamp
- `updatedAt` (TIMESTAMP) - Last update timestamp

**Indexes:**
- `idx_currencies_code` - Code lookup
- `idx_currencies_baseCurrency` - Base currency filtering
- `idx_currencies_baseCurrency_code` - Composite index
- `idx_currencies_search` - Full-text search (GIN index)

**Constraints:**
- Code must be exactly 3 characters (uppercase)
- Base currency must be exactly 3 characters (uppercase)
- Exchange rate must be positive

---

## Setup Instructions

### Option 1: Using Master Setup Script (Recommended)

This will create all tables AND insert sample data:

```bash
# Using psql command line
psql -U postgres -d stocks_db -f schema/setup_database.sql

# Or using environment variables
PGPASSWORD=your_password psql -h localhost -U postgres -d stocks_db -f schema/setup_database.sql
```

### Option 2: DDL Only (No Sample Data)

Create tables without sample data:

```bash
psql -U postgres -d stocks_db -f schema/setup_database_ddl_only.sql
```

### Option 3: Manual Step-by-Step Setup

**Step 1: Create Database** (if not exists)
```bash
createdb stocks_db
# or
psql -U postgres -c "CREATE DATABASE stocks_db;"
```

**Step 2: Run DDL Scripts** (in order)
```bash
psql -U postgres -d stocks_db -f schema/DDL/01_create_users_table.sql
psql -U postgres -d stocks_db -f schema/DDL/02_create_refresh_tokens_table.sql
psql -U postgres -d stocks_db -f schema/DDL/03_create_stocks_table.sql
psql -U postgres -d stocks_db -f schema/DDL/04_create_currencies_table.sql
```

**Step 3: Run DML Scripts** (optional, for sample data)
```bash
psql -U postgres -d stocks_db -f schema/DML/01_insert_sample_users.sql
psql -U postgres -d stocks_db -f schema/DML/02_insert_sample_stocks.sql
psql -U postgres -d stocks_db -f schema/DML/03_insert_sample_currencies.sql
```

---

## Cleanup and Reset

### Drop All Tables

**Warning:** This will delete all data!

```bash
psql -U postgres -d stocks_db -f schema/DDL/00_drop_all_tables.sql
```

### Complete Database Reset

```bash
# Drop all tables
psql -U postgres -d stocks_db -f schema/DDL/00_drop_all_tables.sql

# Recreate all tables
psql -U postgres -d stocks_db -f schema/setup_database.sql
```

---

## Sample Data

### Sample Users (5 users)
- **admin@stocksbackend.com** - Admin user (active)
- **john.doe@example.com** - Test user (active)
- **jane.smith@example.com** - Test user (active)
- **inactive.user@example.com** - Inactive user
- **bob.wilson@example.com** - Test user (active)

**Note:** The passwords in the sample data are placeholders. Use the `/api/v1/auth/register` endpoint to create users with properly hashed passwords.

### Sample Stocks (16 stocks)
- **Technology:** AAPL, MSFT, GOOGL, NVDA, META
- **Consumer Cyclical:** AMZN, TSLA
- **Financial Services:** JPM, BAC, V
- **Healthcare:** JNJ, UNH, PFE
- **Communication Services:** META
- **Energy:** XOM, CVX

### Sample Currencies (20 currencies)
Major world currencies with exchange rates based on USD:
- USD, EUR, GBP, JPY, CHF, CAD, AUD
- CNY, INR, BRL, MXN, ZAR, KRW, SGD
- HKD, NZD, SEK, NOK, DKK, PLN

---

## Entity Relationship Diagram

```
┌─────────────────┐
│     users       │
│─────────────────│
│ id (PK)         │
│ email (UNIQUE)  │
│ password        │
│ firstName       │
│ lastName        │
│ isActive        │
│ createdAt       │
│ updatedAt       │
│ deletedAt       │
└────────┬────────┘
         │
         │ 1:N
         │
         ▼
┌─────────────────┐
│ refresh_tokens  │
│─────────────────│
│ id (PK)         │
│ token (UNIQUE)  │
│ userId (FK)     │◄── CASCADE DELETE
│ expiresAt       │
│ isRevoked       │
│ createdAt       │
└─────────────────┘

┌─────────────────┐
│     stocks      │
│─────────────────│
│ id (PK)         │
│ symbol (UNIQUE) │
│ name            │
│ market          │
│ price           │
│ sector          │
│ industry        │
│ marketCap       │
│ volume          │
│ ...             │
└─────────────────┘

┌─────────────────┐
│   currencies    │
│─────────────────│
│ id (PK)         │
│ code (UNIQUE)   │
│ name            │
│ exchangeRate    │
│ baseCurrency    │
│ lastUpdated     │
│ ...             │
└─────────────────┘
```

---

## Database Configuration

### Environment Variables (.env)

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_DATABASE=stocks_db
```

### TypeORM Configuration

The application uses TypeORM with auto-sync enabled in development. The entities are located in:
- `src/domain/users/user.entity.ts`
- `src/domain/auth/refresh-token.entity.ts`
- `src/domain/stocks/stock.entity.ts`
- `src/domain/currency/currency.entity.ts`

---

## Common Operations

### View All Tables
```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
```

### Check Table Row Counts
```sql
SELECT
    'users' as table_name,
    COUNT(*) as row_count
FROM users
UNION ALL
SELECT 'refresh_tokens', COUNT(*) FROM refresh_tokens
UNION ALL
SELECT 'stocks', COUNT(*) FROM stocks
UNION ALL
SELECT 'currencies', COUNT(*) FROM currencies;
```

### View Table Schemas
```sql
\d+ users
\d+ refresh_tokens
\d+ stocks
\d+ currencies
```

### View Indexes
```sql
SELECT
    tablename,
    indexname,
    indexdef
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename, indexname;
```

---

## Maintenance

### Vacuum Tables (Performance)
```sql
VACUUM ANALYZE users;
VACUUM ANALYZE refresh_tokens;
VACUUM ANALYZE stocks;
VACUUM ANALYZE currencies;
```

### Reindex Tables
```sql
REINDEX TABLE users;
REINDEX TABLE refresh_tokens;
REINDEX TABLE stocks;
REINDEX TABLE currencies;
```

### Update Statistics
```sql
ANALYZE users;
ANALYZE refresh_tokens;
ANALYZE stocks;
ANALYZE currencies;
```

---

## Best Practices

1. **Always backup before running DDL changes:**
   ```bash
   pg_dump stocks_db > backup_$(date +%Y%m%d_%H%M%S).sql
   ```

2. **Test scripts in development first:**
   - Never run untested scripts on production
   - Use transactions when possible

3. **Review permissions:**
   ```sql
   GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO your_app_user;
   ```

4. **Monitor table sizes:**
   ```sql
   SELECT
       schemaname,
       tablename,
       pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
   FROM pg_tables
   WHERE schemaname = 'public'
   ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
   ```

---

## Troubleshooting

### Connection Issues
```bash
# Test connection
psql -U postgres -h localhost -d stocks_db -c "SELECT version();"

# Check if PostgreSQL is running
pg_isready -h localhost -p 5432
```

### Permission Denied
```sql
-- Grant permissions to user
GRANT ALL PRIVILEGES ON DATABASE stocks_db TO your_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO your_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO your_user;
```

### Foreign Key Violations
```sql
-- Check foreign key constraints
SELECT
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY';
```

---

## Version History

| Version | Date | Description |
|---------|------|-------------|
| 1.0.0 | 2024 | Initial database schema with all tables |

---

## Support

For issues or questions:
1. Check the application logs
2. Review PostgreSQL logs: `/var/log/postgresql/`
3. Verify environment variables in `.env`
4. Consult the main project documentation

---

**Last Updated:** 2024
**PostgreSQL Version:** 12+
**Maintained By:** Development Team
