import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import Checkbox from 'components/Forms/Checkbox';

import { MATCH_TYPES } from 'features/advertising/utils/constants';

import classNames from 'utils/classNames';
import { upperFirst } from 'lodash';
import NewKeywordItem from './keywordTargeting/NewKeywordItem';

const tabs = ['Suggested', 'Enter List', 'Upload'];
const CUSTOM = 'custom';
const DEFAULT = 'default';

const KeywordTargetingForm = ({ form, updateForm, errors = {} }) => {
  const { t } = useTranslation();
  const activeTab = 'Enter List';
  const [bidType, setBidType] = useState(CUSTOM);
  const [bid, setBid] = useState('');
  const [selectedMatchTypes, setSelectedMatchTypes] = useState(MATCH_TYPES);
  const [rawInputs, setRawInputs] = useState('');

  const onChangeSelectedMatchType = (e) => {
    const { name, checked } = e.target;
    let smts = checked
      ? [...selectedMatchTypes, name]
      : selectedMatchTypes.filter((smt) => smt !== name);

    setSelectedMatchTypes(smts);
  };

  const addKeywords = () => {
    let newKeywords = [...form];
    if (bidType === DEFAULT) {
      newKeywords = newKeywords.map(({ ...keyword }) => {
        keyword.bid = bid;
        return keyword;
      });
    }

    selectedMatchTypes.forEach((matchType) => {
      rawInputs.split('\n').forEach((keywordText) => {
        newKeywords.push({ keywordText, matchType, bid, state: 'enabled' });
      });
    });

    setRawInputs('');
    updateForm(newKeywords);
  };

  const onChangeKeywordBid = (e) => {
    const { id, value } = e.target;
    const newKeywords = form.map(({ ...keyword }, index) => {
      if (parseInt(id.replace('new-keyword-', '')) === index) {
        keyword.bid = value !== '' ? parseFloat(value) : value;
      }
      return keyword;
    });
    updateForm(newKeywords);
  };

  const onRemoveKeyword = (index) => {
    let newKeywords = form.filter((keyword, idx) => idx !== index);
    updateForm(newKeywords);
  };

  return (
    <div className="mt-4 border rounded-md">
      <div className="p-4 border-b">
        <h3 className="text-sm font-medium text-gray-700">
          {t('Advertising.CampaignBuilder.Targeting.Keyword.Display')}
        </h3>
      </div>

      <div className="grid grid-cols-2 border-b">
        <nav className="-mb-px px-2 flex space-x-6 border-r" aria-label="Tabs">
          {tabs.map((tab) => (
            <div
              key={tab}
              className={classNames(
                tab === activeTab
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-700 hover:text-gray-800 hover:border-gray-300',
                tab === 'Enter List' ? 'cursor-pointer' : 'cursor-not-allowed',
                'whitespace-nowrap py-4 px-1 border-b text-xs font-medium'
              )}
            >
              {tab}
            </div>
          ))}
        </nav>

        <div className="flex p-4 text-xs justify-between">
          <p className="font-medium text-gray-700">
            {t('Advertising.CampaignBuilder.Targeting.Keyword.Added', {
              count: form.length,
            })}
          </p>

          <p
            className="cursor-pointer text-gray-500"
            onClick={() => updateForm([])}
          >
            {t('Advertising.CampaignBuilder.Targeting.Keyword.RemoveAll')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2">
        <div className="border-r p-4">
          <div className="grid grid-cols-12 gap-2 items-start border-gray-200 items-center">
            <label className="block text-xs font-medium text-gray-700 mt-px col-span-2">
              {t('Advertising.CampaignBuilder.Targeting.Keyword.Bid')}
            </label>
            <div className="mt-1 mt-0 col-span-4">
              <select
                value={bidType}
                className="shadow-sm block w-full text-xs border-gray-300 rounded-md focus:outline-none focus:ring-0 focus:border-gray-300"
                onChange={(e) => setBidType(e.target.value)}
              >
                {/* <option>Suggested Bid</option> Disable this for now */}
                <option value={CUSTOM}>
                  {t(
                    'Advertising.CampaignBuilder.Targeting.Keyword.Bid.Custom'
                  )}
                </option>
                <option value={DEFAULT}>
                  {t(
                    'Advertising.CampaignBuilder.Targeting.Keyword.Bid.Default'
                  )}
                </option>
              </select>
            </div>
            <div className="mt-0 col-span-3">
              <div className="flex rounded-md shadow-sm">
                <span className="inline-flex items-center px-2 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                  $
                </span>
                <input
                  type="number"
                  min={0.02}
                  value={bid}
                  onChange={(e) =>
                    setBid(e.target.value === '' ? 0 : e.target.value)
                  }
                  className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md focus:outline-none focus:ring-0 focus:border-gray-300 border-gray-300 text-xs"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-2 items-start border-gray-200 items-center mt-4">
            <label className="block text-xs font-medium text-gray-700 col-span-2">
              {t('Advertising.CampaignBuilder.Targeting.Keyword.MatchType')}
            </label>
            {MATCH_TYPES.map((matchType) => {
              return (
                <div
                  key={matchType}
                  className="text-xs inline-flex text-gray-700 col-span-2"
                >
                  <Checkbox
                    name={matchType}
                    classes="mr-2"
                    checked={selectedMatchTypes.includes(matchType)}
                    onChange={onChangeSelectedMatchType}
                  />
                  <span>{upperFirst(matchType)}</span>
                </div>
              );
            })}
          </div>

          <textarea
            rows="10"
            className="resize-none mt-4 shadow-sm block w-full text-xs border-gray-300 rounded-md focus:outline-none focus:ring-0 focus:border-gray-300"
            value={rawInputs}
            onChange={(e) => setRawInputs(e.target.value)}
          />

          <div className="flex justify-end mt-2">
            <button
              disabled={!(bid && rawInputs && selectedMatchTypes.length)}
              className="text-xs border px-2 py-1 bg-gray-100 border-gray-300 rounded-md focus:outline-none focus:ring-0 focus:border-gray-300"
              onClick={addKeywords}
            >
              {t('Advertising.CampaignBuilder.Targeting.Keyword.AddKeywords')}
            </button>
          </div>
        </div>

        <div className="p-4 text-xs justify-between text-gray-700">
          <ul className="h-96 overflow-y-auto px-2 mt-4">
            <li className="py-4 grid grid-cols-12 border-b">
              <p className="col-span-4">
                {t('Advertising.CampaignBuilder.Targeting.Keyword.Keywords')}
              </p>
              <p className="col-span-3">
                {t('Advertising.CampaignBuilder.Targeting.Keyword.MatchType')}
              </p>
              <p className="col-span-2">
                {t('Advertising.CampaignBuilder.Targeting.Keyword.SuggBid')}
              </p>
              <p className="col-span-3">
                {t('Advertising.CampaignBuilder.Targeting.Keyword.Bid')}
              </p>
            </li>

            {'keywords' in errors &&
              form.length === 0 &&
              errors['keywords'].map((error) => {
                return (
                  <p
                    key={error}
                    className="text-center mt-8 text-xs text-red-600"
                  >
                    {error}
                  </p>
                );
              })}

            {form.map((keyword, index) => (
              <NewKeywordItem
                key={index}
                index={index}
                keyword={keyword}
                onChangeKeywordBid={onChangeKeywordBid}
                onRemove={() => onRemoveKeyword(index)}
                errors={errors}
              />
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default KeywordTargetingForm;
