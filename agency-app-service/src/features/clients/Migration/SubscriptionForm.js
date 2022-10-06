import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Input from 'components/Forms/Input';
import Select from 'components/Forms/Select';
import Textarea from 'components/Forms/Textarea';
import Label from 'components/Forms/Label';
import RequiredAsterisk from 'components/Forms/RequiredAsterisk';
import { useTranslation } from 'react-i18next';

const SubscriptionForm = ({
  operation,
  formData,
  onDataChange,
  editSubscription = false,
}) => {
  const { t } = useTranslation();
  const { plans, dataLoaded, clientLoaded } = useSelector(
    (state) => state.clients
  );

  useEffect(() => {
    if (operation === 'add' && dataLoaded) {
      loadPlan(process.env.REACT_APP_PLAN_CODE);
    }
  }, [dataLoaded, operation]);

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
                  Migration Details
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
                    <Label htmlFor="price">
                      Price <RequiredAsterisk />
                    </Label>
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
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <Label htmlFor="plan_description">Description</Label>
                  <Textarea
                    id="plan_description"
                    value={formData.plan_description}
                    onChange={onInputChange}
                    rows={4}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-1">
                    <Label htmlFor="commissionCa">Commission .CA</Label>
                    <Input
                      id="commissionCa"
                      type="text"
                      label="commission CA"
                      value={formData.commissionCa}
                      onChange={onInputChange}
                    />
                  </div>
                  <div className="col-span-1">
                    <Label htmlFor="commissionUs">Commission .COM</Label>
                    <Input
                      id="commissionUs"
                      type="text"
                      label="commission US"
                      value={formData.commissionUs}
                      onChange={onInputChange}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-1">
                    <Label htmlFor="grossCa">Gross .CA</Label>
                    <Input
                      id="grossCa"
                      type="text"
                      label="gross CA"
                      value={formData.grossCa}
                      onChange={onInputChange}
                    />
                  </div>
                  <div className="col-span-1">
                    <Label htmlFor="grossUs">Gross .COM</Label>
                    <Input
                      id="grossUs"
                      type="text"
                      label="gross US"
                      value={formData.grossUs}
                      onChange={onInputChange}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="baseline">Baseline</Label>
                  <Input
                    id="baseline"
                    type="text"
                    value={formData.baseline}
                    onChange={onInputChange}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-1">
                    <Label htmlFor="amEmail">Account Manager Email</Label>
                    <Input
                      id="amEmail"
                      type="text"
                      value={formData.amEmail}
                      onChange={onInputChange}
                    />
                  </div>
                  <div className="col-span-1">
                    <Label htmlFor="pmEmail">Project Manager Email</Label>
                    <Input
                      id="pmEmail"
                      type="text"
                      value={formData.pmEmail}
                      onChange={onInputChange}
                    />
                  </div>
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
