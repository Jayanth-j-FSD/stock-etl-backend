import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => ({
  // Access token configuration
  accessSecret: process.env.JWT_ACCESS_SECRET || 'your-access-secret-change-in-production',
  accessExpiresIn: process.env.JWT_ACCESS_EXPIRATION || '15m',

  // Refresh token configuration
  refreshSecret: process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-change-in-production',
  refreshExpiresIn: process.env.JWT_REFRESH_EXPIRATION || '7d',
}));
