import { useEffect, useState } from 'react';
import ReactTooltip from 'react-tooltip';
import { useDispatch, useSelector } from 'react-redux';
import { XIcon, ExclamationIcon } from '@heroicons/react/solid';

import { getKeywordsAsync } from 'features/advertising/advertisingSlice';
import { selectCurrentDateRange } from 'features/datePicker/datePickerSlice';
import {
  selectCurrentAccount,
  selectCurrentMarketplace,
} from 'features/accounts/accountsSlice';

import { SPONSORED_PRODUCTS } from 'features/advertising/utils/constants';

const NewKeywordItem = ({
  index,
  keyword,
  onChangeKeywordBid,
  onRemove,
  errors = {},
}) => {
  const dispatch = useDispatch();
  const account = useSelector(selectCurrentAccount);
  const marketplace = useSelector(selectCurrentMarketplace);
  const selectedDates = useSelector(selectCurrentDateRange);
  const [duplicateDisplay, setDuplicateDisplay] = useState('');

  useEffect(() => {
    dispatch(
      getKeywordsAsync({
        attributes: 'keywordText,state,matchType,bid',
        accountId: account.accountId,
        marketplace: marketplace.details.countryCode,
        ...selectedDates,
        matchType: keyword.matchType,
        keywordText: keyword.keywordText,
        campaignType: SPONSORED_PRODUCTS,
        include: ['adGroup'],
      })
    ).then((keywords) => {
      let display = '';

      if (keywords.count) {
        keywords.rows.forEach((keyword, index) => {
          const count = index + 1;
          const productTitle = `<span class="mb-2">${count}. ${keyword.AdvAdGroup.AdvCampaign.name} - ${keyword.AdvAdGroup.name}</span>`;
          display = display ? `${display} ${productTitle}` : productTitle;
        });

        setDuplicateDisplay(
          `<div class="flex flex-col text-xs">${display}</div>`
        );
        ReactTooltip.rebuild();
      }
    });
  }, [dispatch, account, marketplace, selectedDates, keyword]);

  return (
    <li className="py-4 border-b">
      <div className="grid grid-cols-12 items-center">
        <p className="col-span-4 flex">
          {keyword.keywordText}
          {duplicateDisplay && (
            <>
              <ExclamationIcon
                data-tip={duplicateDisplay}
                className="ml-1 h-4 w-4 text-red-500 hover:text-red-700 cursor-pointer"
              />
              <ReactTooltip
                place="top"
                html={true}
                className="max-w-xs text-black"
                backgroundColor="rgba(229, 231, 235, var(--tw-bg-opacity))"
                textColor="rgba(17, 24, 39, var(--tw-text-opacity))"
              />
            </>
          )}
        </p>
        <p className="col-span-3">{keyword.matchType}</p>
        <p className="col-span-2"> - </p>
        <div className="mt-0 col-span-3 flex items-center">
          <div className="flex rounded-md shadow-sm">
            <span className="inline-flex items-center px-2 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
              $
            </span>
            <input
              id={`new-keyword-${index}`}
              type="number"
              min={0.02}
              value={keyword.bid}
              className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md focus:outline-none focus:ring-0 focus:border-gray-300 border-gray-300 text-xs"
              onChange={onChangeKeywordBid}
            />
          </div>

          <div className="justify-items-end items-start ml-2">
            <XIcon
              className="h-4 w-4 text-gray-500 cursor-pointer"
              onClick={onRemove}
            />
          </div>
        </div>
      </div>
      {`keywords.${index}.bid` in errors &&
        errors[`keywords.${index}.bid`].map((error) => {
          return (
            <span key={error} className="text-center mt-2 text-xs text-red-600">
              {error}
            </span>
          );
        })}
    </li>
  );
};

export default NewKeywordItem;
