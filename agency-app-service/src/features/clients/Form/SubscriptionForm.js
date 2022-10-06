import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import { Cashify } from 'cashify';
// import currency from 'currency.js';
import { fetchAddons } from 'features/clients/clientsSlice';
import AddOn from './AddOn';
import Input from 'components/Forms/Input';
import Select from 'components/Forms/Select';
import Textarea from 'components/Forms/Textarea';
import Label from 'components/Forms/Label';
import { PlusCircleIcon } from '@heroicons/react/solid';
import RequiredAsterisk from 'components/Forms/RequiredAsterisk';
import InputAppend from 'components/Forms/InputAppend';
import Checkbox from 'components/Forms/Checkbox';
import InputPrice from 'components/Forms/InputPrice';
import { useTranslation } from 'react-i18next';
import { setAlert } from 'features/alerts/alertsSlice';
import Error from 'components/Forms/Error';

const SubscriptionForm = ({
  operation,
  formData,
  onDataChange,
  editSubscription = false,
}) => {
  const { t } = useTranslation();
  const [convertDisabled, setConvertDisabled] = useState(true);
  const [textareaCount, setTextareaCount] = React.useState(0);
  const [noExpiry, setNoExpiry] = useState(true);
  const {
    plans,
    addons,
    salesPersons,
    dataLoaded,
    clientLoaded,
    hasNewAddons,
    errors,
    // currencies,
    // exchangeRates,
  } = useSelector((state) => state.clients);

  const dispatch = useDispatch();
  useEffect(() => {
    if (operation === 'add' && dataLoaded) {
      loadPlan(process.env.REACT_APP_PLAN_CODE);
      setNoExpiry(true);
    }
  }, [dataLoaded, operation, setNoExpiry]);

  useEffect(() => {
    if (hasNewAddons) {
      dispatch(fetchAddons());
    }
  }, [hasNewAddons, dispatch]);

  useEffect(() => {
    if (operation === 'edit') {
      setNoExpiry(
        formData.billing_cycles === '' || formData.billing_cycles === 0
          ? true
          : false
      );
    }
  }, [formData.billing_cycles, operation]);

  useEffect(() => {
    if (operation === 'edit') {
      setConvertDisabled(
        formData.convert_retainer_cycle === '' ||
          formData.convert_retainer_cycle === 0
          ? true
          : false
      );
    }
  }, [formData.convert_retainer_cycle, operation]);

  useEffect(() => {
    setTextareaCount(formData.plan_description.length);
  }, [formData.plan_description]);


  const onInputChange = (e) => {
    onDataChange({ [e.target.name]: e.target.value });
  };

  function loadPlan(plan_code) {
    const plan = plans.find((p) => p.plan_code === plan_code);

    let { recurring_price: price, description: plan_description, name } = plan;
    let currency_code = 'USD';
    let pricebook_id = '';

    onDataChange({
      name,
      plan_code,
      plan_description,
      currency_code,
      price,
      pricebook_id,
    });
  }

  const onPlanChange = (e) => {
    const value = e.target.value;
    if (value !== '') {
      loadPlan(value);
    }
  };

  // function convertPrice(price, from, to) {
  //   const cashify = new Cashify({
  //     base: exchangeRates.base,
  //     rates: exchangeRates.rates,
  //   });

  //   const converted = cashify.convert(price, {
  //     from,
  //     to,
  //   });

  //   return currency(converted, { precision: 2 });
  // }

  // const onCurrencyChange = (e) => {
  //   const { name, value } = e.target;

  //   if (value !== '') {
  //     const pricebook = currencies.find((c) => c.currencyCode == value);
  //     const pricebook_id = value == 'USD' ? '' : pricebook.pricebookId;

  //     let update_values = {
  //       [name]: value,
  //       price: convertPrice(formData.price, formData.currency_code, value),
  //       pricebook_id,
  //     };

  //     if (formData.retainer_after_convert !== '') {
  //       update_values = {
  //         ...update_values,
  //         retainer_after_convert: convertPrice(
  //           formData.retainer_after_convert,
  //           formData.currency_code,
  //           value
  //         ),
  //       };
  //     }

  //     if (formData.addons) {
  //       let myAddons = formData.addons.slice();

  //       myAddons.forEach((addon, i) => {
  //         myAddons = [
  //           ...myAddons.slice(0, i),
  //           {
  //             ...addon,
  //             price: convertPrice(addon.price, formData.currency_code, value),
  //           },
  //         ];
  //       });

  //       update_values = {
  //         ...update_values,
  //         addons: myAddons,
  //       };
  //     }
  //     onDataChange(update_values);
  //   }
  // };

  const onConvertChange = (e) => {
    setConvertDisabled(!e.target.checked);
    if (!e.target.checked) {
      onDataChange({
        convert_retainer_cycle: '',
        retainer_after_convert: '',
      });
    }
  };

  const onExpiryChange = (e) => {
    setNoExpiry(e.target.checked);
    if (e.target.checked) {
      onDataChange({
        billing_cycles: '',
      });
    }
  };

  const addAddon = (e) => {
    e.preventDefault();

    onDataChange({
      addons: [
        ...formData.addons,
        {
          name: '',
          addon_description: '',
          addon_code: '',
          price: 0,
          quantity: 1,
          type: 'one_time',
        },
      ],
    });
  };

  const onAddonChange = (data, index) => {
    const { name, value, label } = data;
    let myAddons = formData.addons.slice();

    if (name === 'addon_code') {
      if (value !== '') {
        let addonExists = myAddons.find((a) => a.addon_code === value);

        if (addonExists) {
          dispatch(setAlert('error', 'Duplicate addons are not allowed'));
          return false;
        }

        let myAddon = addons.find((a) => a.addon_code === value);

        if (myAddon) {
          myAddons[index] = {
            name: myAddon.name,
            addon_code: value,
            addon_description: myAddon.description,
            price: myAddon.price_brackets[0].price,
            type: myAddon.type,
            quantity: myAddon.quantity ? myAddon.quantity : 1,
          };
        } else {
          // create
          myAddons[index] = {
            name: label,
            addon_code: value,
            addon_description: '',
            price: 0,
            type: 'one_time',
            quantity: 1,
          };
        }
      } else {
        //reset
        myAddons[index] = {
          name: '',
          addon_code: '',
          addon_description: '',
          price: 0,
          type: 'one_time',
          quantity: 1,
        };
      }
    } else {
      myAddons[index] = { ...myAddons[index], [name]: value };
    }

    onDataChange({
      addons: myAddons,
    });
  };

  const onAddonRemove = (index) => {
    let myAddons = [...formData.addons]; // make a separate copy of the array
    myAddons.splice(index, 1);
    onDataChange({
      addons: myAddons,
    });
  };

  const getErrors = (index) => {
    if (errors) {
      let filterSpecificAddonErrors = new RegExp(`addons.${index}.`);
      let errorKeys = Object.keys(errors).filter((error) =>
        filterSpecificAddonErrors.test(error)
      );
      let addonErrors = {};
      errorKeys.forEach((v) => {
        let propName = v.replace(`addons.${index}.`, '');
        addonErrors[propName] = errors[v];
      });

      return addonErrors;
    }
    return null;
  };

  return (
    <div
      className={
        (dataLoaded && clientLoaded && operation === 'edit') ||
        (dataLoaded && operation === 'add')
          ? ''
          : 'loading-overlay'
      }
    >
      <div>
        <div className="md:grid md:grid-cols-3 md:gap-6">
          {!editSubscription && (
            <div className="md:col-span-1">
              <div className="px-4 sm:px-0">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  Subscription Details
                </h3>
                <p className="mt-1 text-sm text-gray-600">
                  This information will be used in creating the initial zoho
                  subscription invoice
                </p>
              </div>
            </div>
          )}
          <div
            className={`mt-5 md:mt-0 ${
              editSubscription ? 'md:col-span-3' : 'md:col-span-2'
            } `}
          >
            <div className="shadow sm:rounded-md ">
              <div className="px-4 py-5 bg-white space-y-3 sm:p-6">
                <div>
                  <Label htmlFor="plan">{t('SubscriptionForm.Plan')}</Label>
                  <Select
                    id="plan"
                    label="plan"
                    value={formData.plan_code}
                    onChange={onPlanChange}
                    required
                  >
                    {plans.map((plan) => (
                      <option key={plan.plan_code} value={plan.plan_code}>
                        {plan.name}
                      </option>
                    ))}
                  </Select>
                </div>

                <div className="grid grid-cols-8 gap-4">
                  <div className="col-span-8 lg:col-span-3">
                    <Label htmlFor="price">Price</Label>
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">$</span>
                      </div>
                      <Input
                        type="number"
                        id="price"
                        value={formData.price}
                        onChange={onInputChange}
                        classes="pl-7 r-12"
                        placeholder="0.00"
                        required
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center">
                        <Label htmlFor="currency_code" classes="sr-only">
                          Currency
                        </Label>
                        <span className="pr-4 text-gray-500 sm:text-sm rounded-md">
                          {formData.currency_code}
                        </span>
                        {/* <select
                          id="currency_code"
                          name="currency_code"
                          onChange={onCurrencyChange}
                          value={formData.currency_code}
                          required
                          className="focus:ring-red-500 focus:border-red-500 h-full py-0 pl-2 pr-7 border-transparent bg-transparent text-gray-500 sm:text-sm rounded-md"
                        >
                          {currencies.map((currency) => (
                            <option
                              key={currency.pricebookId}
                              value={currency.currencyCode}
                            >
                              {currency.currencyCode}
                            </option>
                          ))}
                        </select> */}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-6 gap-6">
                  <div className="col-span-6 sm:col-span-6 lg:col-span-3">
                    <Label htmlFor="billing_cycles">
                      Expires After {!noExpiry && <RequiredAsterisk />}
                    </Label>
                    <div className="flex">
                      <InputAppend
                        type="text"
                        name="billing_cycles"
                        id="billing_cycles"
                        value={formData.billing_cycles}
                        onChange={onInputChange}
                        required={!noExpiry}
                        disabled={noExpiry}
                        appendText="cycles"
                        containerClasses="w-1/2 sm:w-auto"
                      />
                      <div className="flex items-center ml-5">
                        <Checkbox
                          id="no-expiry"
                          checked={noExpiry}
                          classes="rounded"
                          onChange={onExpiryChange}
                        />
                        <Label htmlFor="no-expiry" classes="ml-2 text-sm">
                          Never Expires
                        </Label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1">
                  <div className="flex items-start">
                    <div className="flex items-start sm:items-center">
                      <Checkbox
                        id="autoconvert"
                        checked={!convertDisabled}
                        onChange={onConvertChange}
                        classes="rounded"
                      />
                      <Label htmlFor="autoconvert" classes="ml-2">
                        Automatically convert retainer fee after X months
                      </Label>
                    </div>
                  </div>
                  <div>
                    <div className="grid grid-cols-2 gap-6 mt-4 lg:mt-1">
                      <div className="col-span-1">
                        <Label htmlFor="convert_retainer_cycle">
                          Convert After{' '}
                          {!convertDisabled && <RequiredAsterisk />}
                        </Label>
                        <InputAppend
                          id="convert_retainer_cycle"
                          value={formData.convert_retainer_cycle}
                          onChange={onInputChange}
                          disabled={convertDisabled}
                          required={!convertDisabled}
                          appendText="cycles"
                        />
                      </div>

                      <div className="col-span-1">
                        <Label htmlFor="retainer_after_convert">
                          Convert Price{' '}
                          {!convertDisabled && <RequiredAsterisk />}
                        </Label>
                        <InputPrice
                          id="retainer_after_convert"
                          value={formData.retainer_after_convert}
                          onChange={onInputChange}
                          disabled={convertDisabled}
                          required={!convertDisabled}
                          currencyCode={formData.currencyCode}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="plan_description">
                    Description <RequiredAsterisk />
                  </Label>
                  <Textarea
                    id="plan_description"
                    value={formData.plan_description}
                    onChange={onInputChange}
                    rows={4}
                    maxLength={2000}
                  />
                  <div
                    className={`text-right italic text-xs mt-1  ${
                      textareaCount === 2000 ? 'text-red-700' : ''
                    }`}
                  >
                    {textareaCount}/<span className="font-medium">2000</span>{' '}
                    characters
                  </div>
                </div>

                <div>
                  <Label htmlFor="add-addon">Addons</Label>

                  {formData.addons.length > 0 && (
                    <div className="mt-2 mb-4">
                      {formData.addons.map((a, index) => (
                        <AddOn
                          key={index}
                          addons={addons}
                          formData={a}
                          currencyCode={formData.currency_code}
                          onChange={(e) => onAddonChange(e, index)}
                          onRemove={(e) => onAddonRemove(index)}
                          errors={getErrors(index)}
                        />
                      ))}
                    </div>
                  )}

                  <button
                    id="add-adddon"
                    onClick={addAddon}
                    className="flex justify-center text-sm border border-dashed border-gray-300 py-1 w-full text-center text-red-500 hover:bg-red-50"
                  >
                    <PlusCircleIcon className="w-6 h-6 inline" />
                    <span className="sr-only ml-1">Add</span>
                  </button>
                </div>

                <div>
                  <Label htmlFor="salesPerson">Sales Person</Label>
                  <Select
                    id="salesPerson"
                    label="Sales Person"
                    value={formData.salesPerson}
                    onChange={onInputChange}
                  >
                    <option value="">&nbsp;</option>
                    {salesPersons.map((salesPerson) => (
                      <option
                        key={salesPerson.userId}
                        value={salesPerson.userId}
                      >
                        {salesPerson.firstName} {salesPerson.lastName}
                      </option>
                    ))}
                  </Select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SubscriptionForm;
