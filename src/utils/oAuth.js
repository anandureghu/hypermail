const { google } = require("googleapis");
const { clientId, clientSecret, redirectUri } = require('../config/app.config');

module.exports.oAuth2Client = new google.auth.OAuth2(
  clientId,
  clientSecret,
  redirectUri
);
