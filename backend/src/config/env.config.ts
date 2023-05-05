export const EnvConfiguration = () => ({
  enviroment: process.env.NODE_ENV || 'dev',
  port: process.env.BACKEND_PORT || 3000,
  portDB: process.env.BBDD_PORT,
  nameDB: process.env.POSTGRES_DB,
  userDB: process.env.POSTGRES_USER,
  passwordDB: process.env.POSTGRES_PASSWORD,
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  secretJwt: process.env.JWT_SECRET,
  webURL: process.env.WEB_URL,
});
