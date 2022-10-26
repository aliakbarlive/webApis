import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Redirect, withRouter } from 'react-router-dom';
import _ from 'lodash';
import axios from 'axios';
import { Country, State } from '@bmulingbayan22/country-state';
import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { selectCurrentAccount } from 'features/accounts/accountsSlice';
import { selectAuthenticatedUser } from 'features/auth/authSlice';

import OnboardingLayout from 'layouts/onboarding/OnboardingLayout';
import classNames from 'utils/classNames';
import Input from 'components/aron/Input';
import Label from 'components/aron/Label';
import Spinner from 'components/Spinner';
import { percentageFormatter } from 'utils/formatters';
import { setAlert } from 'features/alerts/alertsSlice';
import { Helmet } from 'react-helmet';

const Subscription = ({ history }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { firstName, lastName, email } = useSelector(selectAuthenticatedUser);

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

  const [zohoCustomer, setZohoCustomer] = useState(null);

  const [taxRates] = useState([
    { name: 'Alberta', taxRate: 0.05 },
    { name: 'British Columbia', taxRate: 0.05 },
    { name: 'Manitoba', taxRate: 0.05 },
    { name: 'New Brunswick', taxRate: 0.15 },
    { name: 'Newfoundland and Labrador', taxRate: 0.15 },
    { name: 'Northwest Territories', taxRate: 0.05 },
    { name: 'Nova Scotia', taxRate: 0.15 },
    { name: 'Nunavut', taxRate: 0.05 },
    { name: 'Ontario', taxRate: 0.13 },
    { name: 'Prince Edward Island', taxRate: 0.15 },
    { name: 'Quebec', taxRate: 0.05 },
    { name: 'Saskatchewan', taxRate: 0.05 },
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

      if (res.data.isMigrate > 0) {
        //console.log('redirect to client migrate');
        history.push(`/client-migration/${currentAccount.accountId}`);
      }

      setHostedPageDetails(res.data.data);

      if (res.data.zohoCustomer) {
        setZohoCustomer(res.data.zohoCustomer);
      }
    };

    if (currentAccount && currentAccount.plan.name === 'agency') {
      getHostedPageDetails();
    }
  }, [currentAccount]);

  // * Calculate subtotal on hostedPageDetails change
  useEffect(() => {
    if (hostedPageDetails) {
      const addonsTotal = _.sum(
        hostedPageDetails.addons.map((addon) => {
          return parseFloat(addon.price) * parseFloat(addon.quantity);
        })
      );

      setSubTotal(parseFloat(hostedPageDetails.price) + addonsTotal);
    }
  }, [hostedPageDetails]);

  // * Calculate taxes based on country and province change
  useEffect(() => {
    if (zohoCustomer) {
      const selectedTaxRate = taxRates.find(
        ({ name }) => name === zohoCustomer.tax_name
      );

      if (selectedTaxRate) {
        setTaxRate(selectedTaxRate.taxRate);
        setTaxes(subTotal * selectedTaxRate.taxRate);
      }
    } else if (country && country.name === 'Canada' && province) {
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
  }, [country, province, taxRates, subTotal, zohoCustomer]);

  useEffect(() => {
    setTotal(subTotal + taxes);
  }, [taxes, subTotal]);

  const createSubscription = async (values) => {
    setIsLoading(true);

    let postUrl = zohoCustomer ? '/old-client' : '';

    let data = zohoCustomer
      ? {
          ...hostedPageDetails,
        }
      : {
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
            country_code: country.isoCode,
          },
        };

    try {
      const res = await axios({
        method: 'POST',
        url: `/agency/subscription${postUrl}`,
        data,
      });

      dispatch(setAlert('success', t('NewSubscription.HostedPageRedirect')));
      // * Push user to the hosted page URL
      window.location.href = res.data.output.url;
    } catch (error) {
      dispatch(
        setAlert(
          'error',
          t('NewSubscription.Error.CreateFailed'),
          error.response ? error.response.data?.errors?.message : error
        )
      );
    }

    setIsLoading(false);
  };

  const formik = useFormik({
    initialValues: {
      firstName: firstName ? firstName : '',
      lastName: lastName ? lastName : '',
      email: email ? email : '',
      company: hostedPageDetails ? hostedPageDetails.customer_name : '',
      address: zohoCustomer ? zohoCustomer.billing_address?.address : '',
      city: zohoCustomer ? zohoCustomer.billing_address?.city : '',
      country: zohoCustomer ? zohoCustomer.billing_address?.country : '',
      province: zohoCustomer ? zohoCustomer.billing_address?.state : '',
      postalCode: zohoCustomer ? zohoCustomer.billing_address?.zip : '',
    },
    enableReinitialize: true,
    validate: (values) => {
      const errors = {};

      if (!zohoCustomer) {
        if (!values.firstName) {
          errors.firstName = t('NewSubscription.Error.FirstName.Required');
        } else if (values.firstName.length > 20) {
          errors.firstName = t('NewSubscription.Error.FirstName.Fail');
        }

        if (!values.lastName) {
          errors.lastName = t('NewSubscription.Error.LastName.Required');
        } else if (values.lastName.length > 20) {
          errors.lastName = t('NewSubscription.Error.LastName.Fail');
        }

        if (!values.email) {
          errors.email = t('NewSubscription.Error.Email.Required');
        } else if (
          !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
        ) {
          errors.email = t('NewSubscription.Error.Email.Fail');
        }

        if (!values.company) {
          errors.company = t('NewSubscription.Error.Company.Required');
        }

        if (!values.address) {
          errors.address = t('NewSubscription.Error.Address.Required');
        }

        if (!values.city) {
          errors.city = t('NewSubscription.Error.City.Required');
        }

        if (!values.country) {
          errors.country = t('NewSubscription.Error.Country.Required');
        }

        if (!values.province) {
          errors.province = t('NewSubscription.Error.State.Required');
        }

        if (!values.postalCode) {
          errors.postalCode = t('NewSubscription.Error.Zip.Required');
        }
      }

      return errors;
    },
    onSubmit: async (values) => {
      await createSubscription(values);
    },
  });

  // * Set focus on first element w/ error
  useEffect(() => {
    if (formik.isSubmitting) {
      if (Object.keys(formik.errors).length > 0) {
        document.getElementsByName(Object.keys(formik.errors)[0])[0].focus();
      }
    }
  }, [formik]);

  // * Check if the current account is onboarding and has a subscription
  if (
    currentAccount &&
    currentAccount.isOnboarding &&
    currentAccount.subscription
  ) {
    return <Redirect to="/onboarding" />;
  }

  return (
    <OnboardingLayout>
      {process.env.REACT_APP_NODE_ENV === 'production' && (
        <Helmet>
          <script>
            var head = document.head; var script =
            document.createElement('script'); script.type = 'text/javascript';
            script.src =
            "https://181966.t.hyros.com/v1/lst/universal-script?ph=63864d682fd26eae3db3c4f2a45700ddbd4cba98eec333ac52aaa6df3a8242ae&tag=!clicked";
            head.appendChild(script);
          </script>
        </Helmet>
      )}

      <div className="sm:mx-auto sm:w-full sm:max-w-xl">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {t('AccountSubscription')}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          {t('NewSubscription.SetupSubscription')}
        </p>
      </div>

      <form onSubmit={formik.handleSubmit}>
        <div className="mt-8 px-4 sm:px-0 sm:mx-auto sm:w-full sm:max-w-xl">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              {t('AccountInformation')}
            </h3>

            <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
              <div>
                <Label htmlFor="firstName">{t('FirstName')}</Label>
                {zohoCustomer ? (
                  <span className="border-gray-100 block mt-1 w-full border rounded-md  shadow-sm py-2 px-3 sm:text-sm bg-gray-50">
                    {formik.values.firstName}
                  </span>
                ) : (
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
                )}
              </div>
              <div>
                <Label htmlFor="lastName">{t('LastName')}</Label>
                {zohoCustomer ? (
                  <span className="border-gray-100 block mt-1 w-full border rounded-md  shadow-sm py-2 px-3 sm:text-sm bg-gray-50">
                    {formik.values.lastName}
                  </span>
                ) : (
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
                )}
              </div>

              <div className="sm:col-span-2">
                <Label htmlFor="company">{t('Company')}</Label>
                {zohoCustomer ? (
                  <span className="border-gray-100 block mt-1 w-full border rounded-md  shadow-sm py-2 px-3 sm:text-sm bg-gray-50">
                    {formik.values.company}
                  </span>
                ) : (
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
                )}
              </div>

              <div className="sm:col-span-2">
                <Label htmlFor="email">{t('Email')}</Label>
                {zohoCustomer ? (
                  <span className="border-gray-100 block mt-1 w-full border rounded-md  shadow-sm py-2 px-3 sm:text-sm bg-gray-50">
                    {formik.values.email}
                  </span>
                ) : (
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
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 px-4 sm:px-0 sm:mx-auto sm:w-full sm:max-w-xl">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              {t('Billing Address')}
            </h3>

            <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
              <div className="sm:col-span-2">
                <Label htmlFor="address">{t('Address')}</Label>
                {zohoCustomer ? (
                  <span className="border-gray-100 block mt-1 w-full border rounded-md  shadow-sm py-2 px-3 sm:text-sm bg-gray-50">
                    {formik.values.address}
                  </span>
                ) : (
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
                )}
              </div>

              <div>
                <Label htmlFor="city">{t('City')}</Label>
                {zohoCustomer ? (
                  <span className="border-gray-100 block mt-1 w-full border rounded-md  shadow-sm py-2 px-3 sm:text-sm bg-gray-50">
                    {formik.values.city}
                  </span>
                ) : (
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
                )}
              </div>

              <div>
                <label
                  htmlFor="country"
                  className="block text-sm font-medium text-gray-700"
                >
                  {t('Country')}
                </label>
                <div className="mt-1">
                  {zohoCustomer ? (
                    <span className="border-gray-100 block mt-1 w-full border rounded-md  shadow-sm py-2 px-3 sm:text-sm bg-gray-50">
                      {formik.values.country}
                    </span>
                  ) : (
                    <select
                      id="country"
                      name="country"
                      autoComplete="country"
                      className={classNames(
                        formik.touched.country && formik.errors.country
                          ? 'border-red-300'
                          : 'border-gray-300',
                        'block w-full  rounded-md shadow-sm focus:ring-green-200 focus:border-green-300 sm:text-sm disabled:bg-gray-50'
                      )}
                      value={formik.values.country}
                      onChange={(e) => {
                        setCountry(
                          countries.find(({ name }) => name === e.target.value)
                        );
                        setProvince('');
                        formik.setFieldValue('province', '');
                        formik.handleChange(e);
                      }}
                    >
                      <option value="">{t('Form.Select.Country')}</option>
                      {countries &&
                        countries.map(({ name }, i) => (
                          <option value={name} key={i}>
                            {name}
                          </option>
                        ))}
                    </select>
                  )}
                </div>
                {formik.touched.country && formik.errors.country && (
                  <p className="mt-2 text-sm text-red-600" id="email-error">
                    {formik.errors.country}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="province">{t('StateProvince')}</Label>

                <div className="mt-1">
                  {zohoCustomer ? (
                    <span className="border-gray-100 block mt-1 w-full border rounded-md  shadow-sm py-2 px-3 sm:text-sm bg-gray-50">
                      {zohoCustomer.billing_address?.state}
                    </span>
                  ) : (
                    <select
                      id="province"
                      name="province"
                      autoComplete="province"
                      className={classNames(
                        formik.touched.province && formik.errors.province
                          ? 'border-red-300'
                          : 'border-gray-300',
                        'block w-full  rounded-md shadow-sm focus:ring-green-200 focus:border-green-300 sm:text-sm disabled:bg-gray-50'
                      )}
                      value={formik.values.province}
                      onChange={(e) => {
                        setProvince(
                          provinces.find(({ name }) => name === e.target.value)
                        );
                        formik.handleChange(e);
                      }}
                    >
                      <option value="">{t('Form.Select.State')}</option>
                      {provinces &&
                        provinces.map(({ name }, i) => (
                          <option value={name} key={i}>
                            {name}
                          </option>
                        ))}
                    </select>
                  )}
                </div>

                {formik.touched.province && formik.errors.province && (
                  <p className="mt-2 text-sm text-red-600" id="email-error">
                    {formik.errors.province}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="postalCode">{t('ZipPostalCode')}</Label>
                {zohoCustomer ? (
                  <span className="border-gray-100 block mt-1 w-full border rounded-md  shadow-sm py-2 px-3 sm:text-sm bg-gray-50">
                    {zohoCustomer.billing_address?.zip}
                  </span>
                ) : (
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
                )}
              </div>
            </div>
          </div>
        </div>

        {hostedPageDetails && (
          <div className="mt-8 px-4 sm:px-0 sm:mx-auto sm:w-full sm:max-w-xl">
            <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                {t('Subscription Summary')}
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
                        {t('Monthly')}
                      </span>
                    </div>

                    <p className="text-gray-500 whitespace-pre-wrap">
                      {hostedPageDetails.plan_description}
                    </p>
                  </div>
                  <p className="flex-none text-base font-medium">
                    ${parseFloat(hostedPageDetails.price).toFixed(2)}
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
                      <p className="text-gray-500">
                        Unit Price:&nbsp;
                        <span className="text-gray-700 mr-5">
                          ${addon.price}
                        </span>
                        Qty:&nbsp;
                        <span className="text-gray-700">{addon.quantity}</span>
                      </p>
                      <p className="text-gray-500 whitespace-pre-wrap">
                        {addon.addon_description}
                      </p>
                    </div>
                    <p className="flex-none text-base font-medium">
                      $
                      {(
                        parseFloat(addon.price) * parseFloat(addon.quantity)
                      ).toFixed(2)}
                    </p>
                  </li>
                ))}
              </ul>

              <dl className="text-sm font-medium text-gray-500 space-y-6 mt-5">
                <div className="flex justify-between">
                  <dt>{t('SubTotal')}</dt>
                  <dd className="text-gray-900">${subTotal.toFixed(2)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt>
                    {t('Taxes')} ({percentageFormatter(taxRate)})
                  </dt>
                  <dd className="text-gray-900">${taxes.toFixed(2)}</dd>
                </div>
                <div className="flex justify-between border-t border-gray-200 text-gray-900 pt-6">
                  <dt className="text-base">{t('Total')}</dt>
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
              className={`${
                isLoading ? 'pointer-events-none' : ''
              } flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500`}
            >
              {isLoading && (
                <span className="mr-2">
                  <Spinner color="white" />
                </span>
              )}
              {t('NewSubscription.Checkout')}
            </button>
          </div>
        </div>
      </form>
    </OnboardingLayout>
  );
};

export default withRouter(Subscription);
