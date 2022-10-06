import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Cookies from 'js-cookie';
import qs from 'qs';
import axios from 'axios';
import PageLoader from 'components/PageLoader';

const AmazonCallback = ({ location, history }) => {
  const dispatch = useDispatch();

  // const account =  useSelector((state) => state.auth.);

  const accountId = Cookies.get('accountId');

  useEffect(() => {
    const redirectUrl = window.location.hostname + window.location.pathname;

    const authorizeSpApi = async (query) => {
      try {
        const res = await axios({
          method: 'post',
          url: '/auth/selling-partner-api/callback',
          data: {
            state: query.state,
            oAuthCode: query.spapi_oauth_code,
            sellingPartnerId: query.selling_partner_id,
            redirectUrl,
          },
          headers: {
            'X-BetterSeller-Account': query.state,
          },
        });

        history.push(
          `/clients/profile/${res.data.data.AgencyClient.agencyClientId}`
        );
      } catch (error) {
        console.log(error);
      }
    };

    const authorizeAdvApi = async (query) => {
      try {
        const res = await axios({
          method: 'post',
          url: '/auth/advertising-api/callback',
          data: {
            oAuthCode: query.code,
            sellingPartnerId: query.selling_partner_id,
            redirectUrl,
          },
          headers: {
            'X-BetterSeller-Account': accountId,
          },
        });

        Cookies.remove('accountId');

        history.push(
          `/clients/profile/${res.data.data.AgencyClient.agencyClientId}`
        );
      } catch (error) {
        console.log(error);
      }
    };

    if (location.search.includes('spapi_oauth_code')) {
      authorizeSpApi(qs.parse(location.search.slice(1)));
      // window.history.replaceState(null, null, window.location.pathname);
    }

    if (location.search.includes('cpc_advertising')) {
      authorizeAdvApi(qs.parse(location.search.slice(1)));

      // window.history.replaceState(null, null, window.location.pathname);
    }
  }, [location.search]);

  return <PageLoader />;
};

export default withRouter(AmazonCallback);
