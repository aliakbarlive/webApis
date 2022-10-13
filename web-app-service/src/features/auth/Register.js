import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import moment from 'moment';
import axios from 'axios';

import {
  registerWithEmailAndPasswordAsync,
  registerWithInviteTokenAsync,
} from './authSlice';
import { setAppNotification } from '../appNotifications/appNotificationSlice';
import AuthLayout from 'layouts/auth/AuthLayout';
import logo from 'assets/logos/square-logo.png';
import { Link } from 'react-router-dom';
import classNames from 'utils/classNames';
import ExpiredInvite from './ExpiredInvite';
import InviteNotFound from './InviteNotFound';
import PageLoader from 'components/PageLoader';

const Register = ({ history }) => {
  const { inviteToken } = useParams();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });

  const [invite, setInvite] = useState({});
  const [loading, setLoading] = useState(inviteToken ? true : false);

  useEffect(() => {
    const getInviteDetails = async () => {
      try {
        const invite = await axios({
          method: 'GET',
          url: `/invites/${inviteToken}`,
        });
        setInvite(invite.data.data);
        setFormData((prevFormData) => {
          return { ...prevFormData, email: invite.data.data.email };
        });
      } catch (error) {
        history.push('/');
      }

      setLoading(false);
    };

    if (inviteToken) {
      getInviteDetails();
    }
  }, [inviteToken]);

  const onInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = (e) => {
    e.preventDefault();

    if (inviteToken) {
      dispatch(registerWithInviteTokenAsync(formData, inviteToken, history));
    } else {
      dispatch(registerWithEmailAndPasswordAsync(formData, history));
    }
  };

  const onResendInvite = async () => {
    await axios({
      method: 'GET',
      url: `/invites/${invite.inviteId}/resend`,
    });

    dispatch(
      setAppNotification('success', `New invitation sent to ${invite.email}`)
    );
  };

  const expiredInvite = invite && moment().isAfter(invite.inviteExpire);

  return loading ? (
    <PageLoader />
  ) : (
    <AuthLayout>
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <img
          className="mx-auto h-12 w-auto rounded-md"
          src={logo}
          alt="Workflow"
        />
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {expiredInvite
            ? 'Your invitation has expired'
            : !invite
            ? 'Invitation not found'
            : 'Register your account'}
        </h2>
        {!inviteToken && (
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link
              to="/sign-in"
              className="font-medium text-red-600 hover:text-red-500"
            >
              sign in to your account
            </Link>
          </p>
        )}
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {expiredInvite ? (
            <ExpiredInvite onResendInvite={onResendInvite} />
          ) : !invite ? (
            <InviteNotFound />
          ) : (
            <form
              className="space-y-6"
              action="#"
              method="POST"
              onSubmit={onSubmit}
            >
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-gray-700"
                >
                  First Name
                </label>
                <div className="mt-1">
                  <input
                    id="firstName"
                    name="firstName"
                    autoComplete="firstName"
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                    value={formData.firstName}
                    onChange={onInputChange}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Last Name
                </label>
                <div className="mt-1">
                  <input
                    id="lastName"
                    name="lastName"
                    autoComplete="lastName"
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                    value={formData.lastName}
                    onChange={onInputChange}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email address
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className={classNames(
                      inviteToken && 'bg-gray-100',
                      'appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm disabled:opacity-50'
                    )}
                    value={formData.email}
                    onChange={onInputChange}
                    disabled={inviteToken ? true : false}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                    value={formData.password}
                    onChange={onInputChange}
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Sign Up
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </AuthLayout>
  );
};

export default Register;
