const {
  PORT,
  NODE_ENV,
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI,
  REFRESH_TOKEN,
  SENDER_EMAIL,
  SENDER_NAME
} = process.env;

module.exports = {
  port: PORT || 3000,
  env: NODE_ENV,
  clientId: CLIENT_ID,
  clientSecret: CLIENT_SECRET,
  redirectUri: REDIRECT_URI,
  refreshToken: REFRESH_TOKEN,
  senderEmail: SENDER_EMAIL,
  senderName: SENDER_NAME
};