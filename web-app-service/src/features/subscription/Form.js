import React, { useState, useEffect } from 'react';
import { Redirect, withRouter } from 'react-router-dom';
import _ from 'lodash';
import axios from 'axios';
import { Country, State } from 'country-state-city';
import { useFormik } from 'formik';
import { useSelector, useDispatch } from 'react-redux';
import { selectCurrentAccount } from '../accounts/accountsSlice';
import OnboardingLayout from 'layouts/onboarding/OnboardingLayout';
import classNames from 'utils/classNames';
import Input from 'components/aron/Input';
import Label from 'components/aron/Label';
import Spinner from 'components/Spinner';
import { percentageFormatter } from 'utils/formatter';

const Form = ({ history }) => {
  const dispatch = useDispatch();

  const currentAccount = useSelector(selectCurrentAccount);

  const [hostedPageDetails, setHostedPageDetails] = useState(null);
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState('');

  const [provinces, setProvinces] = useState([]);
  const [province, setProvince] = useState('');

  const [isLoading, setIsLoading] = useState(false);

  const [subTotal, setSubTotal] = useState(0);
  const [taxRate, setTaxRate] = useState(0.0);
  const [taxes, setTaxes] = useState(0);
  const [total, setTotal] = useState(0);

  const [taxRates] = useState([
    { name: 'Alberta', taxRate: 0.05 },
    { name: 'British Columbia', taxRate: 0.12 },
    { name: 'Manitoba', taxRate: 0.12 },
    { name: 'New Brunswick', taxRate: 0.15 },
    { name: 'Newfoundland and Labrador', taxRate: 0.15 },
    { name: 'Northwest Territories', taxRate: 0.05 },
    { name: 'Nova Scotia', taxRate: 0.15 },
    { name: 'Nunavut', taxRate: 0.05 },
    { name: 'Ontario', taxRate: 0.13 },
    { name: 'Prince Edward Island', taxRate: 0.15 },
    { name: 'Quebec', taxRate: 0.14975 },
    { name: 'Saskatchewan', taxRate: 0.11 },
    { name: 'Yukon', taxRate: 0.05 },
  ]);

  // * Get all countries
  useEffect(() => {
    setCountries(Country.getAllCountries());
  }, []);

  // * Get all provinces/states when country selection changes
  useEffect(() => {
    if (country) {
      setProvinces(State.getStatesOfCountry(country.isoCode));
    }
  }, [country]);

  // * Get hosted page details
  useEffect(() => {
    const getHostedPageDetails = async () => {
      const res = await axios({
        method: 'GET',
        url: `/accounts/${currentAccount.accountId}/hosted-page`,
      });

      setHostedPageDetails(res.data.data);
    };

    if (currentAccount && currentAccount.plan.name === 'agency') {
      getHostedPageDetails();
    }
  }, [currentAccount]);

  // * Calculate subtotal on hostedPageDetails change
  useEffect(() => {
    if (hostedPageDetails) {
      const addonsTotal = _.sum(
        hostedPageDetails.addons.map((addon) => parseFloat(addon.price))
      );

      setSubTotal(parseFloat(hostedPageDetails.price) + addonsTotal);
    }
  }, [hostedPageDetails]);

  // * Calculate taxes based on country and province change
  useEffect(() => {
    if (country.name === 'Canada' && province) {
      const selectedTaxRate = taxRates.find(
        ({ name }) => name === province.name
      );

      if (selectedTaxRate) {
        setTaxRate(selectedTaxRate.taxRate);
        setTaxes(subTotal * selectedTaxRate.taxRate);
      }
    } else {
      setTaxRate(0.0);
      setTaxes(0);
    }
  }, [country, province, taxRates, subTotal]);

  useEffect(() => {
    setTotal(subTotal + taxes);
  }, [taxes, subTotal]);

  const createSubscription = async (values) => {
    setIsLoading(true);

    const res = await axios({
      method: 'POST',
      url: '/agency/subscription',
      data: {
        ...hostedPageDetails,
        display_name: values.company,
        first_name: values.firstName,
        last_name: values.lastName,
        company_name: values.company,
        billing_address: {
          street: values.address,
          city: values.city,
          state: values.province,
          country: values.country,
          zip: values.postalCode,
        },
      },
    });

    // * Push user to the hosted page URL
    window.location.href = res.data.output.url;

    setIsLoading(false);
  };

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      company: '',
      address: '',
      city: '',
      country: '',
      province: '',
      postalCode: '',
    },
    validate: (values) => {
      const errors = {};

      if (!values.firstName) {
        errors.firstName = 'First Name is required';
      } else if (values.firstName.length > 20) {
        errors.firstName = 'First name must be 20 characters or less';
      }

      if (!values.lastName) {
        errors.lastName = 'Last Name is required';
      } else if (values.lastName.length > 20) {
        errors.lastName = 'Last name must be 20 characters or less';
      }

      if (!values.email) {
        errors.email = 'Email is required';
      } else if (
        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
      ) {
        errors.email =
          'Please enter an email address in format: name@example.com';
      }

      if (!values.company) {
        errors.company = 'Company is required';
      }

      if (!values.address) {
        errors.address = 'Address is required';
      }

      if (!values.city) {
        errors.city = 'City is required';
      }

      if (!values.country) {
        errors.country = 'Country is required';
      }

      if (!values.province) {
        errors.province = 'State/Province is required';
      }

      if (!values.postalCode) {
        errors.postalCode = 'ZIP/Postal Code is required';
      }

      return errors;
    },
    onSubmit: async (values) => {
      await createSubscription(values);
    },
  });

  
  return (
    <OnboardingLayout>
      <div className="sm:mx-auto sm:w-full sm:max-w-xl">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Account Subscription
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Let's set up your monthly subscription
        </p>
      </div>

      <form onSubmit={formik.handleSubmit}>
        <div className="mt-8 px-4 sm:px-0 sm:mx-auto sm:w-full sm:max-w-xl">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Account Information
            </h3>

            <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  type="text"
                  name="firstName"
                  id="firstName"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.firstName}
                  error={formik.errors.firstName}
                  touched={formik.touched.firstName}
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  type="text"
                  name="lastName"
                  id="lastName"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.lastName}
                  error={formik.errors.lastName}
                  touched={formik.touched.lastName}
                />
              </div>

              <div className="sm:col-span-2">
                <Label htmlFor="company">Company</Label>
                <Input
                  type="text"
                  name="company"
                  id="company"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.company}
                  error={formik.errors.company}
                  touched={formik.touched.company}
                />
              </div>

              <div className="sm:col-span-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  type="text"
                  name="email"
                  id="email"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.email}
                  error={formik.errors.email}
                  touched={formik.touched.email}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 px-4 sm:px-0 sm:mx-auto sm:w-full sm:max-w-xl">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Billing Address
            </h3>

            <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
              <div className="sm:col-span-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  type="text"
                  name="address"
                  id="address"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.address}
                  error={formik.errors.address}
                  touched={formik.touched.address}
                />
              </div>

              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  type="text"
                  name="city"
                  id="city"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.city}
                  error={formik.errors.city}
                  touched={formik.touched.city}
                />
              </div>

              <div>
                <label
                  htmlFor="country"
                  className="block text-sm font-medium text-gray-700"
                >
                  Country
                </label>
                <div className="mt-1">
                  <select
                    id="country"
                    name="country"
                    autoComplete="country"
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-200 focus:border-green-300 sm:text-sm"
                    value={formik.values.country}
                    onChange={(e) => {
                      setCountry(
                        countries.find(({ name }) => name === e.target.value)
                      );
                      formik.handleChange(e);
                    }}
                  >
                    <option>Select Country</option>
                    {countries &&
                      countries.map(({ name, isoCode }) => (
                        <option value={isoCode}>{name}</option>
                      ))}
                  </select>
                </div>
              </div>

              <div>
                <Label htmlFor="province">State/Province</Label>

                <div className="mt-1">
                  <select
                    id="province"
                    name="province"
                    autoComplete="province"
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-200 focus:border-green-300 sm:text-sm"
                    value={formik.values.province}
                    onChange={(e) => {
                      setProvince(
                        provinces.find(({ name }) => name === e.target.value)
                      );
                      formik.handleChange(e);
                    }}
                  >
                    <option>Select State/Province</option>
                    {provinces &&
                      provinces.map(({ name }) => (
                        <option value={name}>{name}</option>
                      ))}
                  </select>
                </div>

                {/* <Input
                  type="text"
                  name="province"
                  id="province"
                  onBlur={formik.handleBlur}
                  onChange={(e) => {
                    setProvince(e.target.value);
                    formik.handleChange(e);
                  }}
                  value={formik.values.province}
                  error={formik.errors.province}
                  touched={formik.touched.province}
                /> */}
              </div>

              <div>
                <Label htmlFor="postalCode">ZIP/Postal Code</Label>
                <Input
                  type="text"
                  name="postalCode"
                  id="postalCode"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.postalCode}
                  error={formik.errors.postalCode}
                  touched={formik.touched.postalCode}
                />
              </div>
            </div>
          </div>
        </div>

        {hostedPageDetails && (
          <div className="mt-8 px-4 sm:px-0 sm:mx-auto sm:w-full sm:max-w-xl">
            <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Subscription Summary
              </h3>

              <ul
                // role="list"
                className="text-sm font-medium text-gray-900 divide-y divide-gray-200"
              >
                <li className="flex justify-between py-6 space-x-4">
                  <div className="flex-col space-y-2">
                    <div className="flex items-center">
                      <h3>{hostedPageDetails.name}</h3>
                      <span className="ml-2 items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                        Monthly
                      </span>
                    </div>

                    <p className="text-gray-500">
                      {hostedPageDetails.plan_description}
                    </p>
                  </div>
                  <p className="flex-none text-base font-medium">
                    ${hostedPageDetails.price.toFixed(2)}
                  </p>
                </li>

                {hostedPageDetails.addons.map((addon) => (
                  <li
                    key={addon.code}
                    className="flex justify-between py-6 space-x-4"
                  >
                    <div className="flex-col space-y-2">
                      <div className="flex items-center">
                        <h3>{addon.name}</h3>
                        <span
                          className={classNames(
                            addon.type === 'one_time'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-green-100 text-green-800',
                            'ml-2 items-center px-2 py-0.5 rounded text-xs font-medium'
                          )}
                        >
                          {addon.type === 'one_time'
                            ? 'One-Time Fee'
                            : 'Monthly Fee'}
                        </span>
                      </div>

                      <p className="text-gray-500">{addon.addon_description}</p>
                    </div>
                    <p className="flex-none text-base font-medium">
                      ${parseFloat(addon.price).toFixed(2)}
                    </p>
                  </li>
                ))}
              </ul>

              <dl className="text-sm font-medium text-gray-500 space-y-6 mt-5">
                <div className="flex justify-between">
                  <dt>Subtotal</dt>
                  <dd className="text-gray-900">${subTotal.toFixed(2)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt>Taxes ({percentageFormatter(taxRate)})</dt>
                  <dd className="text-gray-900">${taxes.toFixed(2)}</dd>
                </div>
                <div className="flex justify-between border-t border-gray-200 text-gray-900 pt-6">
                  <dt className="text-base">Total</dt>
                  <dd className="text-base">${total.toFixed(2)}</dd>
                </div>
              </dl>
            </div>
          </div>
        )}

        <div className="mt-8 px-4 sm:px-0 sm:mx-auto sm:w-full sm:max-w-xl">
          <div className="flex justify-end">
            <button
              type="submit"
              className="flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              {isLoading && (
                <span className="mr-2">
                  <Spinner color="white" />
                </span>
              )}
              Proceed to Checkout
            </button>
          </div>
        </div>
      </form>
    </OnboardingLayout>
  );
};

export default withRouter(Form);
