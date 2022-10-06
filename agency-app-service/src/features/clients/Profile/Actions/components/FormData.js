import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import Radio from 'components/Forms/Radio';
import Toggle from 'components/Forms/Toggle';
import Textarea from 'components/Forms/Textarea';
import Checkbox from 'components/Forms/Checkbox';
import Select from 'components/Forms/Select';
import Button from 'components/Button';
import { PlusIcon } from '@heroicons/react/solid';

import { cloneDeep } from 'lodash';

const FormData = ({ formData, setFormData, data, asinDefaultData }) => {
  const { t } = useTranslation();

  const goals = [
    '',
    'Growth Strategy (High ACOS, High Spend)',
    'Balance Strategy (Dynamic ACOS)',
    'Profit Strategy (Low ACOS, Low Budget)',
  ];

  const [selectedAsin, setSelectedAsin] = useState(0);

  const onInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value === 'true'
          ? true
          : e.target.value === 'false'
          ? false
          : e.target.value,
    });
  };

  const onInputChangeAsin = (e) => {
    let newAsin = JSON.parse(JSON.stringify(formData.asins));
    newAsin[selectedAsin][e.target.name] =
      e.target.value === 'true'
        ? true
        : e.target.value === 'false'
        ? false
        : e.target.value;

    setFormData({
      ...formData,
      asins: newAsin,
    });
  };

  const onCheck = (e, key, i) => {
    let newData = cloneDeep([...formData[key]]);
    newData[i].value = !newData[i].value;
    setFormData({
      ...formData,
      [key]: newData,
    });
  };

  const onAddAsin = () => {
    setFormData({
      ...formData,
      asins: [...formData.asins, asinDefaultData],
    });
    setSelectedAsin(selectedAsin + 1);
  };

  const onSelectAsin = (e, i) => {
    e.preventDefault();
    setSelectedAsin(i);
  };

  const onSwitchChange = (name) => {
    let newAsin = JSON.parse(JSON.stringify(formData.asins));
    newAsin[selectedAsin][name] = !newAsin[selectedAsin][name];

    setFormData({
      ...formData,
      asins: newAsin,
    });
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      {/* **col 1** */}
      <div className="cols-1">
        <div className="grid grid-cols-8 gap-4 my-2">
          <div className="col-span-3 mt-1">
            <span className="align-middle text-sm font-medium text-gray-700 sm:col-span-3 md:col-span-1">
              {t('Clients.ClientChecklists.BrandOnboarding.AccountManager')}
            </span>
          </div>
          <div className="col-span-5">
            <input
              id="accountManager"
              name="accountManager"
              autoComplete="accountManager"
              required
              value={formData.accountManager}
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
              onChange={onInputChange}
            />
          </div>
        </div>

        <div className="grid grid-cols-8 gap-4 my-2">
          <div className="col-span-3 mt-1">
            <span className="align-middle text-sm font-medium text-gray-700 sm:col-span-3 md:col-span-1">
              {t('Clients.ClientChecklists.BrandOnboarding.StartDate')}
            </span>
          </div>
          <div className="col-span-5">
            <input
              id="startDate"
              name="startDate"
              autoComplete="startDate"
              type="date"
              required
              value={formData.startDate}
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
              onChange={onInputChange}
            />
          </div>
        </div>

        <div>
          <span className="align-middle text-xl font-medium text-gray-900 sm:col-span-3 md:col-span-1">
            {t('Clients.ClientChecklists.BrandOnboarding.AccountInformation')}
          </span>
        </div>

        <div className="grid grid-cols-8 gap-4 my-2">
          <div className="col-span-3 mt-1">
            <span className="align-middle text-sm font-medium text-gray-700 sm:col-span-3 md:col-span-1">
              {t('Clients.ClientChecklists.BrandOnboarding.AccountName')}
            </span>
          </div>
          <div className="col-span-5">
            <input
              id="accountName"
              name="accountName"
              autoComplete="accountName"
              required
              value={formData.accountName}
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
              onChange={onInputChange}
            />
          </div>
        </div>

        <div className="grid grid-cols-8 gap-4 my-2">
          <div className="col-span-5 mt-1">
            <span className="align-middle text-sm font-medium text-gray-700  sm:col-span-3 md:col-span-1">
              {t(
                'Clients.ClientChecklists.BrandOnboarding.IsExistingBrandStore'
              )}
            </span>
          </div>
          <div className="flex col-span-3">
            <div className="mx-2">
              <Radio
                value={true}
                checked={formData.isExistingBrand}
                name="isExistingBrand"
                label="Yes"
                classes="mx-2"
                onChange={onInputChange}
              />
            </div>

            <div className="mx-2">
              <Radio
                value={false}
                checked={formData.isExistingBrand === false ? true : false}
                name="isExistingBrand"
                label="No"
                classes="mx-2"
                onChange={onInputChange}
              />
            </div>
          </div>
        </div>

        {formData.isExistingBrand && (
          <div className="grid grid-cols-8 gap-4 my-2">
            <div className="col-span-3 mt-1">
              <span className="align-middle text-sm font-medium text-gray-700 sm:col-span-3 md:col-span-1">
                {t('Clients.ClientChecklists.BrandOnboarding.BrandStoreLink')}
              </span>
            </div>
            <div className="col-span-5">
              <input
                id="brandStrokeLink"
                name="brandStrokeLink"
                autoComplete="brandStrokeLink"
                required
                value={formData.brandStrokeLink}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                onChange={onInputChange}
              />
            </div>
          </div>
        )}

        <div className="grid grid-cols-8 gap-4 my-2">
          <div className="col-span-3 mt-1">
            <span className="align-middle text-sm font-medium text-gray-700 sm:col-span-3 md:col-span-1">
              {t('Clients.ClientChecklists.BrandOnboarding.WebsiteLink')}
            </span>
          </div>
          <div className="col-span-5">
            <input
              id="websiteLink"
              name="websiteLink"
              autoComplete="websiteLink"
              value={formData.websiteLink}
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
              onChange={onInputChange}
            />
          </div>
        </div>

        <div className="grid grid-cols-8 gap-4 my-2">
          <div className="col-span-3 mt-1">
            <span className="align-middle text-sm font-medium text-gray-700 sm:col-span-3 md:col-span-1">
              {t('Clients.ClientChecklists.BrandOnboarding.LinktoClientAssets')}
            </span>
          </div>
          <div className="col-span-5">
            <input
              id="linkToClientAssets"
              name="linkToClientAssets"
              autoComplete="linkToClientAssets"
              required
              value={formData.linkToClientAssets}
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
              onChange={onInputChange}
            />
          </div>
        </div>

        <div className="grid grid-cols-8 gap-4 my-2">
          <div className="col-span-3 mt-1">
            <span className="align-middle text-sm font-medium text-gray-700 sm:col-span-3 md:col-span-1">
              {t('Clients.ClientChecklists.BrandOnboarding.BrandGuide')}
            </span>
          </div>
          <div className="col-span-5">
            <Textarea
              id="brandGuide"
              name="brandGuide"
              autoComplete="brandGuide"
              required
              value={formData.brandGuide}
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
              onChange={onInputChange}
            />
          </div>
        </div>

        <div className="grid grid-cols-8 gap-4 my-2">
          <div className="col-span-3 mt-1">
            <span className="align-middle text-sm font-medium text-gray-700 sm:col-span-3 md:col-span-1">
              {t('Clients.ClientChecklists.BrandOnboarding.BrandInfo')}
            </span>
          </div>
          <div className="col-span-5">
            <Textarea
              id="brandInfo"
              name="brandInfo"
              autoComplete="brandInfo"
              value={formData.brandInfo}
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
              onChange={onInputChange}
            />
          </div>
        </div>

        <div>
          <span className="align-middle text-xl font-medium text-gray-900 sm:col-span-3 md:col-span-1">
            {t('Clients.ClientChecklists.BrandOnboarding.WorkNeeded')}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            {formData.designWork &&
              formData.designWork.map((el, i) => {
                return (
                  <p key={i}>
                    <Checkbox
                      id={el.key}
                      checked={el.value}
                      onChange={(e) => onCheck(e, 'designWork', i)}
                      name={el.key}
                    />
                    <span className="ml-2 text-xs text-gray-500">
                      {el.label}
                    </span>
                  </p>
                );
              })}
          </div>

          <div>
            {formData.writtenWork &&
              formData.writtenWork.map((el, i) => (
                <p key={i}>
                  <Checkbox
                    id={el.key}
                    checked={el.value}
                    onChange={(e) => onCheck(e, 'writtenWork', i)}
                    name={el.key}
                  />
                  <span className="ml-2 text-xs text-gray-500">{el.label}</span>
                </p>
              ))}
          </div>
        </div>

        <div className="grid grid-cols-8 gap-4 my-2">
          <div className="col-span-3 mt-1">
            <span className="align-middle text-sm font-medium text-gray-700 sm:col-span-3 md:col-span-1">
              {t('Clients.ClientChecklists.BrandOnboarding.OrganicSales3Mos')}
            </span>
          </div>
          <div className="col-span-5">
            <input
              id="organicSales3Mos"
              name="organicSales3Mos"
              autoComplete="organicSales3Mos"
              value={formData.organicSales3Mos}
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
              onChange={onInputChange}
            />
          </div>
        </div>

        <div className="grid grid-cols-8 gap-4 my-2">
          <div className="col-span-3 mt-1">
            <span className="align-middle text-sm font-medium text-gray-700 sm:col-span-3 md:col-span-1">
              {t('Clients.ClientChecklists.BrandOnboarding.PpcSales3Mos')}
            </span>
          </div>
          <div className="col-span-5">
            <input
              id="ppcSales3Mos"
              name="ppcSales3Mos"
              autoComplete="ppcSales3Mos"
              value={formData.ppcSales3Mos}
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
              onChange={onInputChange}
            />
          </div>
        </div>

        <div className="grid grid-cols-8 gap-4 my-2">
          <div className="col-span-3 mt-1">
            <span className="align-middle text-sm font-medium text-gray-700 sm:col-span-3 md:col-span-1">
              {t('Clients.ClientChecklists.BrandOnboarding.acos3Mos')}
            </span>
          </div>
          <div className="col-span-5">
            <input
              id="acos3Mos"
              name="acos3Mos"
              autoComplete="acos3Mos"
              value={formData.acos3Mos}
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
              onChange={onInputChange}
            />
          </div>
        </div>

        <div className="grid grid-cols-8 gap-4 my-2">
          <div className="col-span-3 mt-1">
            <span className="align-middle text-sm font-medium text-gray-700 sm:col-span-3 md:col-span-1">
              {t('Clients.ClientChecklists.BrandOnboarding.TargetACOS')}
            </span>
          </div>
          <div className="col-span-5">
            <input
              id="targetAcos"
              name="targetAcos"
              autoComplete="targetAcos"
              value={formData.targetAcos}
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
              onChange={onInputChange}
            />
          </div>
        </div>

        <div className="grid grid-cols-8 gap-4 my-2">
          <div className="col-span-3 mt-1">
            <span className="align-middle text-sm font-medium text-gray-700 sm:col-span-3 md:col-span-1">
              {t('Clients.ClientChecklists.BrandOnboarding.TargetBudget')}
            </span>
          </div>
          <div className="col-span-5">
            <input
              id="targetBudget"
              name="targetBudget"
              autoComplete="targetBudget"
              value={formData.targetBudget}
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
              onChange={onInputChange}
            />
          </div>
        </div>

        <div className="grid grid-cols-8 gap-4 my-2">
          <div className="col-span-3 mt-1">
            <span className="align-middle text-sm font-medium text-gray-700 sm:col-span-3 md:col-span-1">
              {t('Clients.ClientChecklists.BrandOnboarding.PPCGoal')}
            </span>
          </div>
          <div className="col-span-5">
            <Select
              id="ppcGoal"
              name="ppcGoal"
              className="font-medium text-sm mb-2 md:mb-0"
              value={formData.ppcGoal}
              onChange={onInputChange}
            >
              {goals.map((option) => {
                return (
                  <option key={option} value={option}>
                    {option}
                  </option>
                );
              })}
            </Select>
          </div>
        </div>
      </div>
      {/* **col 2** */}
      <div>
        <div className="flex">
          <span className="mx-2 align-middle text-xl font-medium text-gray-900 sm:col-span-3 md:col-span-1">
            ASIN's
          </span>
          <Button color="green" classes="h-8 mx-2" onClick={() => onAddAsin()}>
            <PlusIcon className="w-6 h-6 inline" />
          </Button>
          {formData.asins.length > 0 &&
            formData.asins.map((el, i) => (
              <span
                key={i}
                className={`mx-2 text-${
                  i === selectedAsin ? 'red' : 'grey'
                }-600`}
              >
                <button onClick={(e) => onSelectAsin(e, i)}>
                  ASIN {i + 1}
                </button>
              </span>
            ))}
        </div>

        <div className="grid grid-cols-8 gap-4 my-2">
          <div className="col-span-5 mt-1">
            <span className="align-middle text-sm font-medium text-gray-700  sm:col-span-3 md:col-span-1">
              {t('Clients.ClientChecklists.BrandOnboarding.IsParent')}
            </span>
          </div>
          <div className="flex col-span-3">
            <div className="mx-2">
              <Radio
                value={true}
                checked={
                  formData.asins.length > 0
                    ? formData.asins[selectedAsin].isParent
                    : false
                }
                name="isParent"
                label="Yes"
                classes="mx-2"
                onChange={onInputChangeAsin}
              />
            </div>

            <div className="mx-2">
              <Radio
                value={false}
                checked={
                  formData.asins.length > 0 &&
                  formData.asins[selectedAsin].isParent === false
                    ? true
                    : false
                }
                name="isParent"
                label="No"
                classes="mx-2"
                onChange={onInputChangeAsin}
              />
            </div>
          </div>
        </div>

        {formData.asins.length > 0 && formData.asins[selectedAsin].isParent && (
          <div className="grid grid-cols-8 gap-4 my-2">
            <div className="col-span-3 mt-1">
              <span className="align-middle text-sm font-medium text-gray-700 sm:col-span-3 md:col-span-1">
                {t('Clients.ClientChecklists.BrandOnboarding.ChildrenAsin')}
              </span>
            </div>
            <div className="col-span-5">
              <Textarea
                id="childrenAsin"
                name="childrenAsin"
                autoComplete="childrenAsin"
                required
                value={
                  formData.asins.length > 0
                    ? formData.asins[selectedAsin].childrenAsin
                    : ''
                }
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                onChange={onInputChangeAsin}
              />
            </div>
          </div>
        )}

        {formData.asins.length > 0 && !formData.asins[selectedAsin].isParent && (
          <div className="grid grid-cols-8 gap-4 my-2">
            <div className="col-span-3 mt-1">
              <span className="align-middle text-sm font-medium text-gray-700 sm:col-span-3 md:col-span-1">
                ASIN
              </span>
            </div>
            <div className="col-span-5">
              <input
                id="asinName"
                name="asinName"
                autoComplete="asinName"
                required
                value={
                  formData.asins.length > 0
                    ? formData.asins[selectedAsin].asinName
                    : ''
                }
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                onChange={onInputChangeAsin}
              />
            </div>
          </div>
        )}

        <div className="grid grid-cols-8 gap-4 my-2">
          <div className="col-span-5 mt-1">
            <span className="align-middle text-sm font-medium text-gray-700  sm:col-span-3 md:col-span-1">
              {t('Clients.ClientChecklists.BrandOnboarding.isAmazonListed')}
            </span>
          </div>
          <div className="flex col-span-3">
            <div className="mx-2">
              <Radio
                value={true}
                checked={
                  formData.asins.length > 0
                    ? formData.asins[selectedAsin].isAmazonListed
                    : false
                }
                name="isAmazonListed"
                label="Yes"
                classes="mx-2"
                onChange={onInputChangeAsin}
              />
            </div>

            <div className="mx-2">
              <Radio
                value={false}
                checked={
                  formData.asins.length > 0 &&
                  formData.asins[selectedAsin].isAmazonListed === false
                    ? true
                    : false
                }
                name="isAmazonListed"
                label="No"
                classes="mx-2"
                onChange={onInputChangeAsin}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-8 gap-4 my-2">
          <div className="col-span-3 mt-1">
            <span className="align-middle text-sm font-medium text-gray-700 sm:col-span-3 md:col-span-1">
              {t('Clients.ClientChecklists.BrandOnboarding.AmazonLink')}
            </span>
          </div>
          <div className="col-span-5">
            <input
              id="amazonLink"
              name="amazonLink"
              autoComplete="amazonLink"
              required
              value={
                formData.asins.length > 0
                  ? formData.asins[selectedAsin].amazonLink
                  : ''
              }
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
              onChange={onInputChangeAsin}
            />
          </div>
        </div>

        <div className="grid grid-cols-8 gap-4 my-2">
          <div className="col-span-3 mt-1">
            <span className="align-middle text-sm font-medium text-gray-700 sm:col-span-3 md:col-span-1">
              List 2 Competitors
            </span>
          </div>
          <div className="col-span-5">
            <Textarea
              id="competitors"
              name="competitors"
              autoComplete="competitors"
              required
              value={
                formData.asins.length > 0
                  ? formData.asins[selectedAsin].competitors
                  : ''
              }
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
              onChange={onInputChangeAsin}
            />
          </div>
        </div>

        <div className="grid grid-cols-8 gap-4 my-2">
          <div className="col-span-3 mt-1">
            <span className="align-middle text-sm font-medium text-gray-700 sm:col-span-3 md:col-span-1">
              {t('Clients.ClientChecklists.BrandOnboarding.keywords')}
            </span>
          </div>
          <div className="col-span-5">
            <Textarea
              id="keywords"
              name="keywords"
              autoComplete="keywords"
              required
              value={
                formData.asins.length > 0
                  ? formData.asins[selectedAsin].keywords
                  : ''
              }
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
              onChange={onInputChangeAsin}
            />
          </div>
        </div>

        <div className="grid grid-cols-8 gap-4 my-2">
          <div className="col-span-3 mt-1">
            <span className="align-middle text-sm font-medium text-gray-700 sm:col-span-3 md:col-span-1">
              {t('Clients.ClientChecklists.BrandOnboarding.audience')}
            </span>
          </div>
          <div className="col-span-5">
            <Textarea
              id="audience"
              name="audience"
              autoComplete="audience"
              required
              value={
                formData.asins.length > 0
                  ? formData.asins[selectedAsin].audience
                  : ''
              }
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
              onChange={onInputChangeAsin}
            />
          </div>
        </div>

        <div className="grid grid-cols-8 gap-4 my-2">
          <div className="col-span-3 mt-1">
            <span className="align-middle text-sm font-medium text-gray-700 sm:col-span-3 md:col-span-1">
              {t(
                'Clients.ClientChecklists.BrandOnboarding.featuresAndBenefits'
              )}
            </span>
          </div>
          <div className="col-span-5">
            <Textarea
              id="featuresAndBenefits"
              name="featuresAndBenefits"
              autoComplete="featuresAndBenefits"
              required
              value={
                formData.asins.length > 0
                  ? formData.asins[selectedAsin].featuresAndBenefits
                  : ''
              }
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
              onChange={onInputChangeAsin}
            />
          </div>
        </div>

        <div className="grid grid-cols-8 gap-4 my-2">
          <div className="col-span-3 mt-1">
            <span className="align-middle text-sm font-medium text-gray-700 sm:col-span-3 md:col-span-1">
              {t('Clients.ClientChecklists.BrandOnboarding.instructional')}
            </span>
          </div>
          <div className="col-span-5">
            <Textarea
              id="instructional"
              name="instructional"
              autoComplete="instructional"
              required
              value={
                formData.asins.length > 0
                  ? formData.asins[selectedAsin].instructional
                  : ''
              }
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
              onChange={onInputChangeAsin}
            />
          </div>
        </div>

        <div className="grid grid-cols-8 gap-4 my-2">
          <div className="col-span-3 mt-1">
            <span className="align-middle text-sm font-medium text-gray-700 sm:col-span-3 md:col-span-1">
              {t('Clients.ClientChecklists.BrandOnboarding.RestrictedKeywords')}
            </span>
          </div>
          <div className="col-span-5">
            <Textarea
              id="restrictedKeywords"
              name="restrictedKeywords"
              autoComplete="restrictedKeywords"
              required
              value={
                formData.asins.length > 0
                  ? formData.asins[selectedAsin].restrictedKeywords
                  : ''
              }
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
              onChange={onInputChangeAsin}
            />
          </div>
        </div>
        <div className="grid grid-cols-8 gap-4 my-2">
          <div className="col-span-4">
            <Toggle
              onChange={() => onSwitchChange('priority')}
              checked={
                formData.asins.length > 0
                  ? formData.asins[selectedAsin].priority
                  : false
              }
            />
            <span className="ml-2">Priority:</span>
          </div>
          <div className="col-span-4">
            <Toggle
              onChange={() => onSwitchChange('runPpc')}
              checked={
                formData.asins.length > 0
                  ? formData.asins[selectedAsin].runPpc
                  : false
              }
            />
            <span className="ml-2">
              {t('Clients.ClientChecklists.BrandOnboarding.runPpc')}
            </span>
          </div>
        </div>

        {formData.asins.length > 0 && formData.asins[selectedAsin].runPpc && (
          <>
            <div className="grid grid-cols-8 gap-4 my-2">
              <div className="col-span-3 mt-1">
                <span className="align-middle text-sm font-medium text-gray-700 sm:col-span-3 md:col-span-1">
                  {t('Clients.ClientChecklists.BrandOnboarding.productSku')}
                </span>
              </div>
              <div className="col-span-5">
                <input
                  id="productSku"
                  name="productSku"
                  autoComplete="productSku"
                  required
                  value={
                    formData.asins.length > 0
                      ? formData.asins[selectedAsin].productSku
                      : ''
                  }
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                  onChange={onInputChangeAsin}
                />
              </div>
            </div>

            <div className="grid grid-cols-8 gap-4 my-2">
              <div className="col-span-3 mt-1">
                <span className="align-middle text-sm font-medium text-gray-700 sm:col-span-3 md:col-span-1">
                  Product SKU
                </span>
              </div>
              <div className="col-span-5">
                <input
                  id="productMargin"
                  name="productMargin"
                  autoComplete="productMargin"
                  required
                  value={
                    formData.asins.length > 0
                      ? formData.asins[selectedAsin].productMargin
                      : ''
                  }
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                  onChange={onInputChangeAsin}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default FormData;
