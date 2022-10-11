import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import axios from 'axios';
import { authSlice } from '../auth/authSlice';
import { accountsSlice } from 'features/accounts/accountsSlice';
import Loader from 'react-loader-spinner';
import { useTranslation } from 'react-i18next';
import logo from 'assets/logos/square-logo.png';
import { useDispatch } from 'react-redux';

const ClientMigration = () => {
  const params = useParams();
  const history = useHistory();
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [isLoading, setLoading] = useState(true);
  const { token } = params;

  const { setIsAuthenticated, setUser } = authSlice.actions;
  const { setCurrentAccount } = accountsSlice.actions;

  useEffect(() => {
    try {
      if (!token) {
        history.push('/');
        return <></>;
      }

      axios.get(`client-migration/${token}`).then((response) => {
        const { user, account, status, zohoUrl } = response.data;

        dispatch(setIsAuthenticated(true));
        dispatch(setUser(user));
        dispatch(setCurrentAccount(account));

        if (status === 'registered') {
          window.location.href = zohoUrl;
        } else {
          history.push('/');
        }
      });
    } catch (error) {
      console.log(error, 'z');
      setLoading(false);
    }
  }, [token, history, axios]);

  return isLoading ? (
    <Loader type="Oval" color="#FFF" height={20} width={20} className="mr-2" />
  ) : (
    <div className="sm:mx-auto sm:w-full sm:max-w-md">
      <img className="mx-auto h-12 w-auto" src={logo} alt="Workflow" />
      <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
        {t('ClientMigration.ErrorMessage')}
      </h2>
    </div>
  );
};

export default ClientMigration;
