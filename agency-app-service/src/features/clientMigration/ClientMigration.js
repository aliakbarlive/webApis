import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import Loading from 'components/Loading';
import logo from 'assets/logos/bs-si-logo.png';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setIsAuthenticated, setUser } from 'features/auth/authSlice';
import { setCurrentAccount } from 'features/accounts/accountsSlice';
import { setAlert } from 'features/alerts/alertsSlice';

const ClientMigration = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const history = useHistory();
  const [loading, setLoading] = useState(true);
  const { token } = params;
  const [hasError, setHasError] = useState(false);

  if (!token) {
    history.push('/');
  }

  const getMigration = async () => {
    try {
      await axios.get(`/client-migration/${token}`).then((response) => {
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
      dispatch(
        setAlert(
          'error',
          'Failed',
          'Unable to generate link. please contact administrator'
        )
      );
      setHasError(true);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      getMigration();
    }
  }, [token]);

  return (
    <div className="min-h-screen pt-16 pb-12 flex flex-col bg-white">
      <main className="flex-grow flex flex-col justify-center max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-16">
          <div className="text-center">
            <img
              className="adapt-img inline"
              src={logo}
              alt="betterseller logo"
              width="215"
            />
            <div className="p-5 mt-10 bg-gray-50 rounded-lg sm:w-1/2 mx-auto bg-yellow-50 text-yellow-700 flex text-center justify-center">
              {loading
                ? 'Generating link. please wait'
                : hasError
                ? 'Unable to generate link. please contact administrator'
                : 'Redirecting'}
              &nbsp;&nbsp;
              <Loading />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ClientMigration;
