import axios from 'axios';
import ReactTooltip from 'react-tooltip';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Checkbox from 'components/Forms/Checkbox';
import ProductPreview from 'components/ProductPreview';

import {
  TemplateIcon,
  InformationCircleIcon,
  ExclamationIcon,
  UserIcon,
} from '@heroicons/react/outline';

import {
  selectPortfolios,
  getPortfoliosAsync,
  getCampaignsAsync,
  selectCampaigns,
  getProductsAsync,
  selectProducts,
} from 'features/advertising/advertisingSlice';

import { selectCurrentDateRange } from 'features/datePicker/datePickerSlice';
import classNames from 'utils/classNames';

const RuleCustomTarget = ({
  accountId,
  marketplace,
  campaignType,
  advCampaignIds,
  onUpdateCampaigns,
  ruleProducts,
  onUpdateRuleProducts,
  advPortfolioIds,
  onUpdatePortfolios,
}) => {
  const dispatch = useDispatch();
  const selectedDates = useSelector(selectCurrentDateRange);
  const campaigns = useSelector(selectCampaigns);
  const products = useSelector(selectProducts);
  const portfolios = useSelector(selectPortfolios);

  const [portfolioSearch, setPortfolioSearch] = useState('');
  const [campaignSearch, setCampaignSearch] = useState('');
  const [productSearch, setProductSearch] = useState('');
  const [activeTab, setActiveTab] = useState('Portfolios');
  const [target, setTarget] = useState('');

  const [autoSelectedCampaigns, setAutoSelectedCampaigns] = useState([]);
  const [autoSelectedProducts, setAutoSelectedProducts] = useState([]);

  useEffect(() => {
    if (
      advPortfolioIds.length === 0 &&
      advCampaignIds.length === 0 &&
      ruleProducts.length === 0
    ) {
      setTarget('');
      setAutoSelectedCampaigns([]);
      setAutoSelectedProducts([]);
    }

    if (advPortfolioIds.length) {
      setTarget('Portfolios');

      axios
        .get('advertising/campaigns', {
          params: {
            pageSize: 1000,
            accountId,
            marketplace,
            campaignType,
            attributes: 'advCampaignId,name,advPortfolioId',
            advPortfolioIds,
          },
        })
        .then((response) => {
          setAutoSelectedCampaigns(
            response.data.data.rows.map((c) => c.advCampaignId)
          );
        });

      axios
        .get('/advertising/product-ads/products', {
          params: {
            pageSize: 1000,
            accountId,
            marketplace,
            campaignType,
            advPortfolioIds,
          },
        })
        .then((response) =>
          setAutoSelectedProducts(
            response.data.data.rows.map(({ asin, sku }) => {
              return { asin, sku };
            })
          )
        );
    }

    if (advCampaignIds.length) {
      setTarget('Campaigns');

      axios
        .get('/advertising/product-ads/products', {
          params: {
            pageSize: 1000,
            accountId,
            marketplace,
            campaignType,
            advCampaignIds,
          },
        })
        .then((response) =>
          setAutoSelectedProducts(
            response.data.data.rows.map(({ asin, sku }) => {
              return { asin, sku };
            })
          )
        );
    }

    if (ruleProducts.length) {
      setTarget('Products');
    }
  }, [advCampaignIds, ruleProducts, advPortfolioIds]);

  useEffect(() => {
    dispatch(
      getPortfoliosAsync({
        pageSize: 1000,
        accountId,
        marketplace,
        search: portfolioSearch,
        sort: 'name:asc',
      })
    );
  }, [dispatch, accountId, marketplace, portfolioSearch]);

  useEffect(() => {
    dispatch(
      getCampaignsAsync({
        pageSize: 1000,
        accountId,
        marketplace,
        campaignType,
        ...selectedDates,
        attributes: 'advCampaignId,name,advPortfolioId',
        search: campaignSearch,
        sort: 'name:asc',
      })
    );
  }, [
    dispatch,
    accountId,
    marketplace,
    campaignType,
    selectedDates,
    campaignSearch,
  ]);

  useEffect(() => {
    dispatch(
      getProductsAsync({
        pageSize: 1000,
        accountId,
        marketplace,
        campaignType,
        search: productSearch,
        include: ['listing'],
      })
    );
  }, [dispatch, accountId, marketplace, campaignType, productSearch]);

  const onCheckCampaign = (e) => {
    const { id } = e.target;
    let selectedCopy = [...advCampaignIds];

    const index = advCampaignIds.findIndex((sValue) => sValue === id);
    selectedCopy =
      index >= 0
        ? selectedCopy.filter((sValue) => sValue !== id)
        : [...selectedCopy, id];

    onUpdateCampaigns(selectedCopy);
  };

  const onCheckPortfolio = (e) => {
    const { id } = e.target;
    let selectedCopy = [...advPortfolioIds];

    const index = advPortfolioIds.findIndex((sValue) => sValue === id);
    selectedCopy =
      index >= 0
        ? selectedCopy.filter((sValue) => sValue !== id)
        : [...selectedCopy, id];

    onUpdatePortfolios(selectedCopy);
  };

  const onCheckProduct = (e) => {
    let { name: asin, id: sku } = e.target;
    asin = asin !== '' ? asin : null;
    sku = sku !== '' ? sku : null;
    let selectedCopy = [...ruleProducts];

    const index = ruleProducts.findIndex(
      (rp) => rp.sku === sku && rp.asin === asin
    );

    selectedCopy =
      index >= 0
        ? selectedCopy.filter((rp) => rp.sku !== sku && rp.asin !== asin)
        : [...selectedCopy, { asin, sku }];

    onUpdateRuleProducts(selectedCopy);
  };

  return (
    <div className="mt-4">
      <div className="flex">
        <label className="block text-xs font-medium text-gray-700">
          Custom Target
        </label>
        <span>
          <InformationCircleIcon
            className="ml-1 h-4 w-4 text-gray-700"
            aria-hidden="true"
            data-tip="Using custom target will make this rule specific to selected marketplace."
          />
          <ReactTooltip
            place="right"
            className="max-w-xs text-black"
            backgroundColor="rgba(229, 231, 235, var(--tw-bg-opacity))"
            textColor="rgba(17, 24, 39, var(--tw-text-opacity))"
          />
        </span>
      </div>

      <div className="mt-2 border p-2 rounded">
        <nav className="-mb-px flex space-x-6" aria-label="Tabs">
          {['Portfolios', 'Campaigns', 'Products'].map((tab) => (
            <div
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={classNames(
                tab === activeTab
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                'cursor-pointer whitespace-nowrap py-4 px-1 border-b-2 font-medium text-xs mb-1'
              )}
            >
              {tab}
              <span
                className={classNames(
                  tab === activeTab
                    ? 'bg-red-100 text-red-600'
                    : 'bg-gray-100 text-gray-900',
                  'hidden ml-3 py-0.5 px-2.5 rounded-full text-xs font-medium md:inline-block'
                )}
              >
                {tab === 'Portfolios'
                  ? advPortfolioIds.length
                  : tab === 'Campaigns'
                  ? advCampaignIds.length + autoSelectedCampaigns.length
                  : ruleProducts.length + autoSelectedProducts.length}
              </span>
            </div>
          ))}
        </nav>
        {activeTab === 'Portfolios' && (
          <div
            className={`col-span-3 h-${
              (campaigns.rows.length || products.rows.length) &&
              !campaignSearch &&
              !productSearch &&
              !portfolioSearch
                ? 96
                : 48
            }`}
          >
            <div className="border-b p-2">
              <input
                placeholder="Search Portfolio"
                className="px-4 py-2 focus:outline-none focus:ring-0 focus:border-gray-300 block w-full sm:text-xs border border-gray-300 rounded-md"
                value={portfolioSearch}
                onChange={(e) => setPortfolioSearch(e.target.value)}
              />
            </div>
            <div
              className={`overflow-y-scroll h-${
                (campaigns.rows.length || products.rows.length) &&
                !campaignSearch &&
                !productSearch
                  ? 80
                  : 36
              }`}
            >
              <nav className="space-y-1 mt-4" aria-label="Sidebar">
                {campaigns.rows.length === 0 && (
                  <div className="flex flex-col items-center">
                    <ExclamationIcon className="text-red-400 w-8 h-8" />

                    <p className="mt-1 text-xs text-gray-500">
                      No Portfolios found.
                    </p>
                  </div>
                )}
                {portfolios.rows.map((item) => (
                  <div
                    key={item.advPortfolioId}
                    className="flex items-center px-3 py-2 text-xs font-medium rounded-md cursor-pointer text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  >
                    <span className="inline-block py-0.5 px-3">
                      <Checkbox
                        id={item.advPortfolioId}
                        checked={advPortfolioIds.includes(item.advPortfolioId)}
                        onChange={onCheckPortfolio}
                        disabled={target && target !== 'Portfolios'}
                      />
                    </span>
                    <span className="truncate">{item.name}</span>
                  </div>
                ))}
              </nav>
            </div>
          </div>
        )}

        {activeTab === 'Campaigns' && (
          <div
            className={`col-span-3 h-${
              (campaigns.rows.length || products.rows.length) &&
              !campaignSearch &&
              !productSearch &&
              !portfolioSearch
                ? 96
                : 48
            }`}
          >
            <div className="border-b p-2">
              <input
                placeholder="Search Campaign"
                className="px-4 py-2 focus:outline-none focus:ring-0 focus:border-gray-300 block w-full sm:text-xs border border-gray-300 rounded-md"
                value={campaignSearch}
                onChange={(e) => setCampaignSearch(e.target.value)}
              />
            </div>
            <div
              className={`overflow-y-scroll h-${
                (campaigns.rows.length || products.rows.length) &&
                !campaignSearch &&
                !productSearch
                  ? 80
                  : 36
              }`}
            >
              <nav className="space-y-1 mt-4" aria-label="Sidebar">
                {campaigns.rows.length === 0 && (
                  <div className="flex flex-col items-center">
                    <ExclamationIcon className="text-red-400 w-8 h-8" />

                    <p className="mt-1 text-xs text-gray-500">
                      No Campaigns found.
                    </p>
                  </div>
                )}
                {campaigns.rows.map((item) => (
                  <div
                    key={item.advCampaignId}
                    className="flex items-center px-3 py-2 text-xs font-medium rounded-md cursor-pointer text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  >
                    <span className="inline-block py-0.5 px-3">
                      <Checkbox
                        id={item.advCampaignId}
                        checked={
                          advCampaignIds.includes(item.advCampaignId) ||
                          autoSelectedCampaigns.includes(item.advCampaignId)
                        }
                        onChange={onCheckCampaign}
                        disabled={target && target !== 'Campaigns'}
                      />
                    </span>
                    <span className="truncate">{item.name}</span>
                  </div>
                ))}
              </nav>
            </div>
          </div>
        )}

        {activeTab === 'Products' && (
          <div
            className={`col-span-5 h-${
              (campaigns.rows.length || products.rows.length) &&
              !campaignSearch &&
              !productSearch &&
              !portfolioSearch
                ? 96
                : 48
            }`}
          >
            <div className="border-b p-2">
              <input
                placeholder="Search ASIN or SKU"
                className="px-4 py-2 focus:outline-none focus:ring-0 focus:border-gray-300 block w-full sm:text-xs border border-gray-300 rounded-md"
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
              />
            </div>

            <div
              className={`overflow-y-scroll h-${
                (campaigns.rows.length || products.rows.length) &&
                !campaignSearch &&
                !productSearch
                  ? 80
                  : 36
              }`}
            >
              <nav className="space-y-1 mt-4">
                {products.rows.length === 0 && (
                  <div className="flex flex-col items-center">
                    <ExclamationIcon className="text-red-400 w-8 h-8" />

                    <p className="mt-1 text-xs text-gray-500">
                      No Products found.
                    </p>
                  </div>
                )}
                {products.rows.map((product) => (
                  <div
                    key={product.index}
                    className="flex items-center px-3 py-2 text-xs font-medium rounded-md cursor-pointer text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  >
                    <span className="inline-block py-0.5 px-3">
                      <Checkbox
                        name={product.asin}
                        id={product.sku}
                        checked={
                          ruleProducts.findIndex(
                            (rp) =>
                              rp.asin === product.asin && rp.sku === product.sku
                          ) >= 0 ||
                          autoSelectedProducts.findIndex(
                            (rp) =>
                              rp.asin === product.asin && rp.sku === product.sku
                          ) >= 0
                        }
                        onChange={onCheckProduct}
                        disabled={target && target !== 'Products'}
                      />
                    </span>
                    <ProductPreview
                      asin={product.listing.asin ?? product.asin}
                      sku={product.listing.sku ?? product.sku}
                      imageUrl={product.listing.thumbnail}
                      productName={product.listing.title}
                      truncate={false}
                      identifierClassName="flex"
                      displayTooltip={false}
                    />
                  </div>
                ))}
              </nav>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default RuleCustomTarget;
