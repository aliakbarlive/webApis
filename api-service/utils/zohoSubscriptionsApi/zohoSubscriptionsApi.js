const CustomError = require('./CustomError');
const querystring = require('querystring');
const axios = require('axios');
const moment = require('moment');
const dotenv = require('dotenv');

dotenv.config({ path: 'config/config.env' });
class ZohoSubscriptionsApi {
  constructor() {
    this._refresh_token = process.env.ZOHO_REFRESH_TOKEN;
    this._access_token = '';
    this._access_token_generated = moment();
    this._organization_id = process.env.ZOHO_ORGANIZATION_ID;
    this._client_id = process.env.ZOHO_CLIENT_ID;
    this._client_secret = process.env.ZOHO_CLIENT_SECRET;
    this._redirect_uri = process.env.ZOHO_REDIRECT_URI;
    this._domain_url = process.env.ZOHO_DOMAIN_URL;
  }

  get access_token() {
    return this._access_token;
  }

  async refreshAccessToken() {
    const data = {
      refresh_token: this._refresh_token,
      client_id: this._client_id,
      client_secret: this._client_secret,
      redirect_uri: this._redirect_uri,
      grant_type: 'refresh_token',
    };

    let res = await axios.post(
      'https://accounts.zoho.com/oauth/v2/token',
      querystring.stringify(data)
    );

    if (res.data.access_token) {
      this._access_token = res.data.access_token;
      this._access_token_generated = moment();
    } else if (res.error) {
      throw new CustomError({
        code: res.error,
        message: res.error_description,
      });
    } else {
      throw new CustomError({
        code: 'UNKNOWN_REFRESH_ACCESS_TOKEN_ERROR',
        message: res.body,
      });
    }
  }

  async callAPI(req_params) {
    try {
      if (!req_params.method) {
        throw new CustomError({
          code: 'NO_METHOD_GIVEN',
          message: 'Please provide an operation to call',
        });
      }

      if (!req_params.operation) {
        throw new CustomError({
          code: 'NO_OPERATION_GIVEN',
          message: 'Please provide an operation to call',
        });
      }

      if (!this._access_token || this._access_token == '') {
        console.log('no access token - generating...');
        await this.refreshAccessToken();
      }

      if (moment().diff(this._access_token_generated, 'minutes', true) >= 55) {
        console.log('force refresh access token before it times out');
        await this.refreshAccessToken();
      }

      let headers = {
        'X-com-zoho-subscriptions-organizationid':
          process.env.ZOHO_ORGANIZATION_ID,
        Authorization: `Zoho-oauthtoken ${this._access_token}`,
        ...(req_params.operation.includes('accept=pdf') && {
          'Content-Type': 'application/pdf',
        }),
      };

      let res = await axios({
        method: req_params.method,
        url: `https://${process.env.ZOHO_DOMAIN_URL}/api/v1/${req_params.operation}`,
        data: req_params.body,
        headers,
        ...(req_params.operation.includes('accept=pdf') && {
          responseType: 'arraybuffer',
          responseEncoding: 'binary',
        }),
      });

      if (res.status == 200) {
        if (req_params.operation.includes('page')) {
          const { data, page_context } = res;
          return { data, page_context };
        } else {
          return res.data;
        }
      } else {
        console.log(res.data);
        return res;
      }
    } catch (error) {
      console.log(error.response.data);
      return error.response.data;
    }
  }
}

module.exports = ZohoSubscriptionsApi;
