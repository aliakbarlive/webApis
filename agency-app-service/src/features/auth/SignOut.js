import React, { useEffect } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { signOutAsync } from './authSlice';

const SignOut = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(signOutAsync());
  }, [dispatch]);

  return <h1>Hi</h1>;
};

export default SignOut;
