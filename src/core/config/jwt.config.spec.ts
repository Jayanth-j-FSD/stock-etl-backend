import jwtConfig from './jwt.config';

describe('JwtConfig', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('should return default JWT configuration', () => {
    delete process.env.JWT_ACCESS_SECRET;
    delete process.env.JWT_ACCESS_EXPIRATION;
    delete process.env.JWT_REFRESH_SECRET;
    delete process.env.JWT_REFRESH_EXPIRATION;

    const config = jwtConfig();

    expect(config).toEqual({
      accessSecret: 'your-access-secret-change-in-production',
      accessExpiresIn: '15m',
      refreshSecret: 'your-refresh-secret-change-in-production',
      refreshExpiresIn: '7d',
    });
  });

  it('should use environment variables for JWT configuration', () => {
    process.env.JWT_ACCESS_SECRET = 'custom-access-secret';
    process.env.JWT_ACCESS_EXPIRATION = '30m';
    process.env.JWT_REFRESH_SECRET = 'custom-refresh-secret';
    process.env.JWT_REFRESH_EXPIRATION = '14d';

    const config = jwtConfig();

    expect(config).toEqual({
      accessSecret: 'custom-access-secret',
      accessExpiresIn: '30m',
      refreshSecret: 'custom-refresh-secret',
      refreshExpiresIn: '14d',
    });
  });

  it('should have different secrets for access and refresh tokens', () => {
    const config = jwtConfig();

    expect(config.accessSecret).not.toBe(config.refreshSecret);
  });

  it('should have valid expiration formats', () => {
    const config = jwtConfig();

    expect(config.accessExpiresIn).toMatch(/^\d+[smhd]$/);
    expect(config.refreshExpiresIn).toMatch(/^\d+[smhd]$/);
  });

  it('should handle custom expiration formats', () => {
    process.env.JWT_ACCESS_EXPIRATION = '1h';
    process.env.JWT_REFRESH_EXPIRATION = '30d';

    const config = jwtConfig();

    expect(config.accessExpiresIn).toBe('1h');
    expect(config.refreshExpiresIn).toBe('30d');
  });
});
