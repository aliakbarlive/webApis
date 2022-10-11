import React from 'react';
import OnboardingLayout from 'layouts/onboarding/OnboardingLayout';

import {
  ShoppingBagIcon,
  GlobeIcon,
  CursorClickIcon,
} from '@heroicons/react/outline';
import { Link } from 'react-router-dom';

const steps = [
  {
    icon: <ShoppingBagIcon className="h-12 w-12 text-red-500 inline" />,
    title: 'Seller Central',
    description: 'Connect your Seller Central account information',
  },
  {
    icon: <GlobeIcon className="h-12 w-12 text-red-500 inline" />,
    title: 'Marketplaces',
    description: 'Select your primary marketplace.',
  },
  {
    icon: <CursorClickIcon className="h-12 w-12 text-red-500 inline" />,
    title: 'PPC',
    description: 'Option to connect your PPC data',
  },
];

const NewAccount = () => {
  return (
    <OnboardingLayout>
      <div className="sm:mx-auto sm:w-full sm:max-w-3xl">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <h2 className="text-center text-2xl font-extrabold text-gray-900">
            Let's set up an account for you
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sync your Amazon & BetterSeller accounts to get started.
          </p>

          <dl className="mt-6 sm:grid sm:grid-cols-3">
            {steps.map(({ icon, title, description }) => (
              <div className="flex flex-col items-center p-6 text-center ">
                {icon}
                <dt className="mt-4 text-md font-bold text-gray-900 leading-6">
                  {title}
                </dt>
                <dd className="mt-2 text-sm text-gray-600">{description}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-6 flex justify-end">
            <button
              type="button"
              className="mr-2 inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Skip
            </button>
            <Link
              to="/onboarding"
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </OnboardingLayout>
  );
};

export default NewAccount;
