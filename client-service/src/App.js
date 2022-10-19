import React, { useEffect } from 'react';

import { useDispatch } from 'react-redux';

import { getMe } from 'features/auth/authSlice';

import Routes from './routes/Routes';
import Alert from 'features/alert/Alert';

const App = () => {
  const dispatch = useDispatch();

  // Check if user is logged in
  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  return (
    <>
      <Alert />
      <Routes />
    </>
  );
};

export default App;
