import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Label from 'components/Forms/Label';
import Input from 'components/Forms/Input';
import Select from 'components/Forms/Select';
import {
  PlusCircleIcon,
  MinusIcon,
  CalculatorIcon,
} from '@heroicons/react/solid';
import Toggle from 'components/Forms/Toggle';
import InputPrepend from 'components/Forms/InputPrepend';
import TierRule from './TierRule';
import Error from 'components/Forms/Error';
import OrderMetricsCalculator from './OrderMetricsCalculator';
import BsPopover from 'components/BsPopover';
import classNames from 'utils/classNames';
import Textarea from 'components/Forms/Textarea';

const Commission = ({
  formData,
  marketplaces,
  account,
  onDataChange,
  layout = 'grid',
  errors = null,
}) => {
  const { t } = useTranslation();
  const [disableThreshold, setDisableThreshold] = useState(
    formData.type === 'rolling' || formData.type === 'benchmark' ? true : false
  );
  const [showBaseline, setShowBaseline] = useState(
    formData.type === 'benchmark' ? true : false
  );
  const [hasRules, setHasRules] = useState(
    formData.type === 'rules' ? true : false
  );

  useEffect(() => {
    setDisableThreshold(
      formData.type === 'benchmark' || formData.type === 'rolling'
        ? false
        : true
    );
    setShowBaseline(formData.type === 'benchmark' ? true : false);
    setHasRules(formData.type === 'tiered' ? true : false);
  }, [formData.type]);

  const onInputChange = (e) => {
    onDataChange({ [e.target.name]: e.target.value });
  };
  const onSwitchChange = () => {
    onDataChange({ commence: !formData.commence });
  };

  const onRuleChange = ({ name, value, index }) => {
    let rules = [...formData.rules];
    rules[index] = { ...rules[index], [name]: value };

    onDataChange({
      rules,
    });
  };
  const addRule = () => {
    const newRule = {
      min: 0,
      max: 0,
      rate: 0,
    };
    let rules = formData.rules ? [...formData.rules, newRule] : [newRule];

    onDataChange({ rules });
  };

  const removeRule = (idx) => {
    let rules = [...formData.rules];
    rules.splice(idx, 1);
    onDataChange({
      rules,
    });
  };

  const onAddManagedAsin = () => {
    const ma = {
      asin: '',
      baseline: 0,
    };

    let managedAsins = formData.managedAsins
      ? [...formData.managedAsins, ma]
      : [ma];

    onDataChange({
      managedAsins,
    });
  };

  const updateManagedAsin = (e, idx, prop) => {
    let managedAsins = [...formData.managedAsins];
    managedAsins[idx] = { ...managedAsins[idx], [prop]: e.target.value };
    onDataChange({
      managedAsins,
    });
  };

  const removeManagedAsin = (idx) => {
    let managedAsins = [...formData.managedAsins];
    managedAsins.splice(idx, 1);
    onDataChange({
      managedAsins,
    });
  };

  const hasSpApiCredentials = () => {
    return (
      account &&
      account.credentials &&
      account.credentials.find((c) => c.service == 'spApi')
    );
  };

  const applyBenchmarkValue = (value) => {
    onDataChange({ preContractAvgBenchmark: value });
  };

  const applyAsinBenchmarkValue = (value, idx) => {
    let managedAsins = [...formData.managedAsins];
    managedAsins[idx] = { ...managedAsins[idx], baseline: value };
    onDataChange({
      managedAsins,
    });
  };

  const typeDescriptions = {
    gross: 'previous month total sales / rate',
    benchmark:
      'Trailing 12 (or X) month average monthly revenue before contract date',
    rolling: 'Rolling average based on X months',
    tiered: 'Similar to gross but with variable rates based on provided values',
    yearlySalesImprovement: 'Average based on previous year of the same month',
  };

  return (
    <div
      className={classNames(
        layout === 'grid'
          ? `sm:grid md:grid-cols-4 xl:grid-cols-8 sm:gap-x-4 sm:gap-y-3`
          : `flex flex-col space-y-2`,
        'text-left bg-gray-50 p-3 rounded-lg shadow-sm'
      )}
    >
      <div className="col-span-2">
        <Label htmlFor="type" classes="text-left">
          {t('Type')}
        </Label>
        <div className="flex flex-col">
          <Select id="type" value={formData.type} onChange={onInputChange}>
            <option value="gross">Gross</option>
            <option value="benchmark">Benchmarked Average</option>
            <option value="rolling">Rolling Average</option>
            <option value="tiered">Tiered</option>
            <option value="yearlySalesImprovement">
              Yearly Sales Improvement
            </option>
          </Select>
          {layout === 'grid' ? (
            ''
          ) : (
            <sub className="text-xs indent-2 text-yellow-500 italic">
              {typeDescriptions[formData.type]}
            </sub>
          )}
        </div>
      </div>
      <div className="col-span-1">
        <Label htmlFor="marketplaceId" classes="text-left sm:mt-0">
          {t('Marketplace')}
        </Label>
        <div>
          <Select
            id="marketplaceId"
            value={formData.marketplaceId}
            onChange={onInputChange}
            required
          >
            {marketplaces.map((marketplace) => {
              return (
                <option
                  value={marketplace.marketplaceId}
                  key={marketplace.marketplaceId}
                >
                  {marketplace.countryCode}
                </option>
              );
            })}
          </Select>
        </div>
      </div>
      <div className={classNames(hasRules && 'hidden', 'col-span-1')}>
        <Label htmlFor="rate" classes="text-left">
          {t('Rate')}
        </Label>
        <div>
          <InputPrepend
            id="rate"
            type="number"
            value={formData.rate}
            onChange={onInputChange}
            prependText="%"
          />
        </div>
        <Error>{errors?.rate}</Error>
      </div>
      <div className={classNames(disableThreshold && 'hidden', 'col-span-1')}>
        <Label htmlFor="monthThreshold" classes="text-left whitespace-nowrap">
          {t('MonthThreshold')}
        </Label>
        <div>
          <Input
            id="monthThreshold"
            type="number"
            value={formData.monthThreshold}
            onChange={onInputChange}
            disabled={disableThreshold}
          />
        </div>
        <Error>{errors?.monthThreshold}</Error>
      </div>

      <div
        className={classNames(
          !showBaseline && 'hidden',
          showBaseline && formData.managedAsins?.length > 0 ? 'hidden' : '',
          'col-span-1'
        )}
      >
        <Label htmlFor="baseline" classes="text-left">
          {t('Baseline')}
        </Label>
        <div className="relative flex items-center">
          <Input
            id="preContractAvgBenchmark"
            type="number"
            value={formData.preContractAvgBenchmark}
            onChange={onInputChange}
            disabled={
              !showBaseline ||
              (showBaseline && formData.managedAsins?.length > 0)
            }
          />
          {hasSpApiCredentials() && (
            <div className="absolute inset-y-0 right-1 flex py-1.5 pr-1.5 ">
              <OrderMetricsCalculator
                data={formData}
                account={account}
                setCalculatedValue={applyBenchmarkValue}
              />
            </div>
          )}
        </div>
        <Error>{errors?.preContractAvgBenchmark}</Error>
      </div>

      <div className="col-span-full">
        <div className="text-left">
          <label className="text-xs mt-2 flex items-center">
            <Toggle onChange={onSwitchChange} checked={formData.commence} />
            <span className="ml-2">{t('Commission.AddToPendingInvoice')}</span>
          </label>
        </div>
      </div>

      <div
        className={classNames(
          !hasRules && 'hidden',
          'col-span-3 bg-white p-2 rounded-lg border'
        )}
      >
        <Label htmlFor="rules" classes="text-left capitalize">
          {t('Rules')}
        </Label>
        <div className={'border-t'}>
          <table cellPadding="3">
            <thead>
              <tr>
                <th>
                  <Label classes="">
                    {t('Min')}. {t('Gross')}
                  </Label>
                </th>
                <th>
                  <Label classes="">
                    {t('Max')}. {t('Gross')}
                  </Label>
                </th>
                <th>
                  <Label classes="">{t('Rate')} %</Label>
                </th>
                <th>&nbsp;</th>
              </tr>
            </thead>
            <tbody>
              {formData.rules &&
                formData.rules.map((rule, i) => {
                  return (
                    <TierRule
                      rule={rule}
                      removeRule={removeRule}
                      onRuleChange={onRuleChange}
                      index={i}
                      key={i}
                    />
                  );
                })}
              <tr>
                <td colSpan="3">
                  <button
                    type="button"
                    className="flex justify-center text-sm border border-dashed border-gray-300 py-1 w-full text-center text-red-500 hover:bg-red-50"
                    onClick={addRule}
                    //disabled={commissionOptional}
                  >
                    <PlusCircleIcon
                      className="h-6 w-6 inline"
                      aria-hidden="true"
                    />
                    <span className="sr-only ml-1">{t('Add')}</span>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="col-span-3 bg-white p-2 rounded-lg border">
        {formData.managedAsins && formData.managedAsins.length > 0 && (
          <div className="">
            <Label htmlFor="" classes="text-left capitalize">
              Managed Asins
            </Label>
            <div className="flex items-center space-x-2 border-t pt-1">
              <span className="w-1/2 text-xs">ASIN</span>
              <span
                className={classNames(
                  !showBaseline && 'hidden',
                  'w-1/2 text-xs'
                )}
              >
                Baseline
              </span>
              <span>&nbsp;</span>
            </div>
            <div className="">
              {formData.managedAsins.map((ma, i) => {
                return (
                  <>
                    <div key={i} className="flex items-center space-x-2 mb-1">
                      <Input
                        name="asinList"
                        type="text"
                        placeholder="ASIN"
                        value={ma.asin}
                        onChange={(e) => updateManagedAsin(e, i, 'asin')}
                        classes="appearance-none px-3 py-2 placeholder-gray-400 focus:outline-none"
                      />
                      <div className="relative flex items-center">
                        <Input
                          name="asinListBaseline"
                          type="number"
                          placeholder="Baseline"
                          value={ma.baseline}
                          onChange={(e) => updateManagedAsin(e, i, 'baseline')}
                          classes={`appearance-none px-3 py-2 placeholder-gray-400 focus:outline-none ${
                            !showBaseline && 'hidden'
                          }`}
                        />
                        {hasSpApiCredentials() && showBaseline && (
                          <div className="absolute inset-y-0 right-1 flex py-1.5 pr-1.5 ">
                            <OrderMetricsCalculator
                              data={formData}
                              account={account}
                              asin={ma.asin}
                              index={i}
                              setCalculatedValue={applyAsinBenchmarkValue}
                            />
                          </div>
                        )}
                      </div>
                      <button
                        type="button"
                        className="inline bg-gray-500 rounded-full hover:bg-red-900 text-white mx-1"
                        onClick={() => removeManagedAsin(i)}
                      >
                        <MinusIcon className="h-4 w-4" aria-hidden="true" />
                      </button>
                    </div>
                    <span className="flex flex-col mb-1">
                      <Error>{errors?.[`managedAsins.${i}.asin`]}</Error>
                      <Error>{errors?.[`managedAsins.${i}.baseline`]}</Error>
                    </span>
                  </>
                );
              })}
            </div>
          </div>
        )}
        <button
          type="button"
          className="text-sm py-1 px-2 bg-green-100 hover:bg-green-200 rounded-md text-gray-700 w-full mt-2"
          onClick={onAddManagedAsin}
        >
          <PlusCircleIcon className="h-4 w-4 inline mr-1" aria-hidden="true" />
          Managed ASIN
        </button>
      </div>
    </div>
  );
};
export default Commission;
