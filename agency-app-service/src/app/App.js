import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { getMeAsync } from 'features/auth/authSlice';
import Alerts from 'features/alerts/Alerts';
import Routes from '../routes/Routes';
import { Helmet } from 'react-helmet';
import useSocket from 'hooks/useSocket';

function App() {
  const dispatch = useDispatch();
  const socket = useSocket();

  // Check if user is logged in
  useEffect(() => {
    dispatch(getMeAsync());
  }, [dispatch]);

  return (
    <div className="App">
      <Helmet />
      <Alerts />
      <Routes />
    </div>
  );
}

export default App;
