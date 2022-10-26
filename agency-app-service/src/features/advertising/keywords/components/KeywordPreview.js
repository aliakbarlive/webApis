import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import ReactTooltip from 'react-tooltip';

import { getProductsAsync } from 'features/advertising/advertisingSlice';

const KeywordPreview = ({
  accountId,
  marketplace,
  campaignType,
  adGroupName,
  campaignName,
  adGroupId,
  keywordId,
  keywordText,
  matchType,
  showProducts = true,
  bid,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [products, setProducts] = useState(t('Loading'));

  const getProducts = () => {
    if (products === t('Loading') && showProducts) {
      dispatch(
        getProductsAsync({
          accountId,
          marketplace,
          campaignType,
          advAdGroupId: adGroupId,
          include: ['listing'],
        })
      ).then((response) => {
        let productsDisplay = '';

        if (!response.rows.length) {
          productsDisplay = 'No Product Ads';
        }

        response.rows
          .filter((product) => product.listing.title)
          .forEach((product, index) => {
            const no = index + 1;
            const productTitle = `<span>${no}. ${product.listing.title}</span>`;
            productsDisplay = productsDisplay
              ? `${productsDisplay} ${productTitle}`
              : productTitle;
          });

        setProducts(`<div class="flex flex-col">${productsDisplay}</div>`);
        ReactTooltip.rebuild();
      });
    }
  };

  return (
    <div className="flex flex-col">
      <span
        data-html={true}
        data-tip={products}
        onMouseEnter={getProducts}
        data-for={keywordId}
        key={`${products}-${keywordId}`}
      >
        {keywordText}
      </span>
      {showProducts && (
        <ReactTooltip
          html={true}
          place="right"
          id={keywordId}
          className="max-w-xs text-black"
          backgroundColor="rgba(229, 231, 235, var(--tw-bg-opacity))"
          textColor="rgba(17, 24, 39, var(--tw-text-opacity))"
        />
      )}
      <span className="text-xs text-gray-400">
        {t('Advertising.Campaign')}: {campaignName}
      </span>
      <span className="text-xs text-gray-400">
        {t('Advertising.AdGroup')}: {adGroupName}
      </span>
      <span className="text-xs text-gray-400">
        {matchType && `${t('Advertising.Keyword.MatchType')}: ${matchType}`}
      </span>
      {bid && <span className="text-xs text-gray-400">{`Bid: ${bid}`}</span>}
    </div>
  );
};

export default KeywordPreview;
