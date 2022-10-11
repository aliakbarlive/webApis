import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import axios from 'axios';
import { Provider } from 'react-redux';
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import translationsEN from "./locales/en/translation.json";

import './index.css';
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';

import App from './app/App';
import store from './store/store';
import reportWebVitals from './reportWebVitals';

axios.defaults.baseURL = process.env.REACT_APP_API_BASE_URL;
axios.defaults.withCredentials = true;
axios.interceptors.request.use(function (config) {
  const account = store.getState().accounts.currentAccount;
  const marketplace = store.getState().accounts.currentMarketplace;
  if (account && 'accountId' in account) {
    config.headers['X-BetterSeller-Account'] = account.accountId;
  }
  if (marketplace && 'marketplaceId' in marketplace) {
    config.headers['X-BetterSeller-Marketplace'] = marketplace.marketplaceId;
  }

  return config;
});

// translations
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: false,
    fallbackLng: "en",
    keySeparator: false,
    interpolation: {
      escapeValue: false,
    },
    resources: {
      en: {
        translation: translationsEN,
      },      
    },
  });

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Provider store={store}>
        <App />
      </Provider>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
