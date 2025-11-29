export default () => ({
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: parseInt(process.env.PORT ?? '3000', 10),
  database: {
    host: process.env.DATABASE_HOST ?? 'localhost',
    port: parseInt(process.env.DATABASE_PORT ?? '3306', 10),
    username: process.env.DATABASE_USER ?? 'root',
    password: process.env.DATABASE_PASSWORD ?? 'estore123',
    name: process.env.DATABASE_NAME ?? 'e_store_db',
  },
  auth: {
    accessTokenSecret: process.env.JWT_ACCESS_SECRET ?? 'access',
    refreshTokenSecret: process.env.JWT_REFRESH_SECRET ?? 'refresh',
    accessTokenExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN ?? '900s',
    refreshTokenExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN ?? '7d',
    bcryptSaltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS ?? '12', 10),
  },
});
