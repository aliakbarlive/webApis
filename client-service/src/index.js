import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';

import React from 'react';
import ReactDOM from 'react-dom';

import axios from 'axios';
import { Provider } from 'react-redux';
import store from './store/store';

import App from './App';

axios.defaults.baseURL = process.env.REACT_APP_API_BASE_URL;

axios.interceptors.request.use(function (config) {
  const account = store.getState().account.current;
  const marketplace = store.getState().account.currentMarketplace;
  if ('accountId' in account) {
    config.headers['X-BetterSeller-Account'] = account.accountId;
  }

  if ('marketplaceId' in marketplace) {
    config.headers['X-BetterSeller-Marketplace'] = marketplace.marketplaceId;
  }

  return config;
});

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
