import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { XIcon } from '@heroicons/react/solid';

import {
  ENABLED_STATUS,
  NEGATIVE_EXACT,
  NEGATIVE_MATCH_TYPES,
} from 'features/advertising/utils/constants';
import { startCase } from 'lodash';

const NegativeKeywordForm = ({ form, updateForm }) => {
  const { t } = useTranslation();
  const [rawInputs, setRawInputs] = useState('');
  const [selectedMatchType, setSelectedMatchType] = useState(NEGATIVE_EXACT);

  const addNegativeKeywords = () => {
    let newKeywords = [...form];

    rawInputs.split('\n').forEach((keywordText) => {
      newKeywords.push({
        keywordText,
        matchType: selectedMatchType,
        state: ENABLED_STATUS,
      });
    });

    setRawInputs('');
    updateForm(newKeywords);
  };

  const onRemoveNegativeKeyword = (index) => {
    let newNegativeKeywords = form.filter((keyword, idx) => idx !== index);
    updateForm(newNegativeKeywords);
  };

  return (
    <div className="mt-4 border rounded-md">
      <div className="p-4 border-b">
        <h3 className="text-sm font-medium text-gray-700">
          {t('Advertising.CampaignBuilder.NegKeywordTargeting')}
        </h3>
      </div>

      <div className="grid grid-cols-2">
        <div className="border-r p-4">
          <div className="grid grid-cols-12 gap-2 items-start border-gray-200 items-center">
            <label className="block text-xs font-medium text-gray-700 col-span-2">
              {t('Advertising.CampaignBuilder.Targeting.Keyword.MatchType')}
            </label>

            <div className="space-y-4 sm:flex sm:items-center sm:space-y-0 sm:space-x-10 col-span-10">
              {NEGATIVE_MATCH_TYPES.map((matchType) => (
                <div key={matchType} className="flex items-center">
                  <input
                    name={matchType}
                    type="radio"
                    value={matchType}
                    className="focus:ring-red-500 h-4 w-4 text-red-600 border-gray-300"
                    checked={selectedMatchType === matchType}
                    onChange={(e) => setSelectedMatchType(e.target.value)}
                  />
                  <label
                    htmlFor={matchType}
                    className="ml-3 block text-xs font-medium text-gray-700"
                  >
                    {startCase(matchType)}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <textarea
            rows="10"
            className="resize-none mt-4 shadow-sm block w-full text-xs border-gray-300 rounded-md focus:outline-none focus:ring-0 focus:border-gray-300"
            value={rawInputs}
            onChange={(e) => setRawInputs(e.target.value)}
          />

          <div className="flex justify-end mt-2">
            <button
              disabled={!rawInputs}
              className="text-xs border px-2 py-1 bg-gray-100 border-gray-300 rounded-md focus:outline-none focus:ring-0 focus:border-gray-300"
              onClick={addNegativeKeywords}
            >
              {t('Advertising.CampaignBuilder.Targeting.Keyword.AddKeywords')}
            </button>
          </div>
        </div>

        <div className="text-xs justify-between text-gray-700">
          <div className="p-4 flex text-xs justify-between border-b">
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
          <ul className="h-96 overflow-y-auto">
            <li className="py-4 grid grid-cols-12 border-b px-4">
              <p className="col-span-6">
                {t('Advertising.CampaignBuilder.Targeting.Keyword.Keywords')}
              </p>
              <p className="col-span-4">
                {t('Advertising.CampaignBuilder.Targeting.Keyword.MatchType')}
              </p>
            </li>
            {form.map((keyword, index) => (
              <li
                key={index}
                className="py-4 grid grid-cols-12 items-center border-b mx-4"
              >
                <p className="col-span-6">{keyword.keywordText}</p>
                <p className="col-span-4">{startCase(keyword.matchType)}</p>
                <div className="mt-0 col-span-2 flex items-center">
                  <div className="justify-items-end items-start ml-2">
                    <XIcon
                      className="h-4 w-4 text-gray-500 cursor-pointer"
                      onClick={() => onRemoveNegativeKeyword(index)}
                    />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
export default NegativeKeywordForm;
