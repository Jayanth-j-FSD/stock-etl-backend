import appConfig from './app.config';

describe('AppConfig', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('should return default configuration when environment variables are not set', () => {
    delete process.env.NODE_ENV;
    delete process.env.PORT;

    const config = appConfig();

    expect(config).toEqual({
      nodeEnv: 'development',
      port: 3000,
    });
  });

  it('should use environment variables when set', () => {
    process.env.NODE_ENV = 'production';
    process.env.PORT = '8080';

    const config = appConfig();

    expect(config).toEqual({
      nodeEnv: 'production',
      port: 8080,
    });
  });

  it('should parse PORT as integer', () => {
    process.env.PORT = '5000';

    const config = appConfig();

    expect(config.port).toBe(5000);
    expect(typeof config.port).toBe('number');
  });

  it('should handle invalid PORT by using default', () => {
    process.env.PORT = 'invalid';

    const config = appConfig();

    expect(config.port).toBe(NaN);
  });

  it('should use development as default NODE_ENV', () => {
    delete process.env.NODE_ENV;

    const config = appConfig();

    expect(config.nodeEnv).toBe('development');
  });
});
