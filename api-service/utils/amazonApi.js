const axios = require('axios');
const qs = require('qs');
const dotenv = require('dotenv');

dotenv.config({ path: 'config/config.env' });

class AmazonApi {
  constructor({ clientId, clientSecret }) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.redirectUrl = process.env.SP_API_REDIRECT_URL;
    this.baseUrl = 'https://api.amazon.com';
  }

  async generateToken(oAuthCode, redirectUrl) {
    try {
      const headers = {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
      };

      const response = await axios({
        method: 'post',
        url: `${this.baseUrl}/auth/o2/token`,
        data: qs.stringify({
          grant_type: 'authorization_code',
          code: oAuthCode,
          redirect_uri: `https://${redirectUrl}`,
          client_id: this.clientId,
          client_secret: this.clientSecret,
        }),
        // headers,
      });

      const { refresh_token, access_token, expires_in } = response.data;

      return {
        oAuthCode,
        refreshToken: refresh_token,
        accessToken: access_token,
        accessTokenExpire: expires_in,
      };
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = AmazonApi;
