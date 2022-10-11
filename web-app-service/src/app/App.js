import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { getMeAsync } from 'features/auth/authSlice';
import AppNotifications from 'features/appNotifications/AppNotifications';
import Routes from '../routes/Routes';

function App() {
  const dispatch = useDispatch();

  // Check if user is logged in
  useEffect(() => {
    dispatch(getMeAsync());
  }, [dispatch]);

  return (
    <div className="App">
      <AppNotifications />
      <Routes />
    </div>
  );
}

export default App;
