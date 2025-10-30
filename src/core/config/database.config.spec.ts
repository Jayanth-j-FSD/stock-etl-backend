import databaseConfig from './database.config';

describe('DatabaseConfig', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('should return default database configuration', () => {
    delete process.env.DB_HOST;
    delete process.env.DB_PORT;
    delete process.env.DB_USER;
    delete process.env.DB_PASS;
    delete process.env.DB_NAME;
    process.env.NODE_ENV = 'development';

    const config = databaseConfig();

    expect(config).toMatchObject({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'stocks_db',
      synchronize: true,
      logging: true,
    });
  });

  it('should use environment variables for database connection', () => {
    process.env.DB_HOST = 'db.example.com';
    process.env.DB_PORT = '5433';
    process.env.DB_USER = 'myuser';
    process.env.DB_PASS = 'mypassword';
    process.env.DB_NAME = 'mydb';
    process.env.NODE_ENV = 'production';

    const config = databaseConfig();

    expect(config).toMatchObject({
      type: 'postgres',
      host: 'db.example.com',
      port: 5433,
      username: 'myuser',
      password: 'mypassword',
      database: 'mydb',
      synchronize: false,
      logging: false,
    });
  });

  it('should disable synchronize and logging in production', () => {
    process.env.NODE_ENV = 'production';

    const config = databaseConfig();

    expect(config.synchronize).toBe(false);
    expect(config.logging).toBe(false);
  });

  it('should enable synchronize and logging in development', () => {
    process.env.NODE_ENV = 'development';

    const config = databaseConfig();

    expect(config.synchronize).toBe(true);
    expect(config.logging).toBe(true);
  });

  it('should parse DB_PORT as integer', () => {
    process.env.DB_PORT = '3306';

    const config = databaseConfig();

    expect((config as any).port).toBe(3306);
    expect(typeof (config as any).port).toBe('number');
  });

  it('should have correct entity and migration paths', () => {
    const config = databaseConfig();

    expect(config.entities).toBeDefined();
    expect(Array.isArray(config.entities)).toBe(true);
    expect(config.migrations).toBeDefined();
    expect(Array.isArray(config.migrations)).toBe(true);
  });
});
