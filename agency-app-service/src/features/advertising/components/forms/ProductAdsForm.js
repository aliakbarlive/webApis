import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { SearchIcon, XIcon } from '@heroicons/react/solid';

import {
  getInventoryAsync,
  selectInventory,
  selectLoading,
} from 'features/products/inventory/inventorySlice';

import Spinner from 'components/Spinner';

import classNames from 'utils/classNames';
import InventoryItem from './productAds/InventoryItem';
import InventoryPagination from './productAds/InventoryPagination';

const tabs = ['Search', 'Enter List', 'Upload'];

const ProductAdsForm = ({ form, updateForm, errors = {} }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const loading = useSelector(selectLoading);
  const inventory = useSelector(selectInventory);
  const activeTab = 'Search';
  const [query, setQuery] = useState('');

  const [params, setParams] = useState({
    page: 1,
    pageSize: 50,
    status: 'Active',
    search: '',
  });

  useEffect(() => {
    dispatch(getInventoryAsync(params));
  }, [dispatch, params]);

  const onChangeQuery = (e) => {
    const { value } = e.target;
    setQuery(value);
    if (value === '') setParams({ ...params, page: 1, search: value });
  };

  const onSearch = () => {
    setParams({ ...params, page: 1, search: query });
  };

  const onAddProductAds = ({ sellerSku, asin }) => {
    let newForm = [...form];
    newForm.push({ asin, sku: sellerSku });
    updateForm(newForm);
  };

  const onRemoveProductAds = (index) => {
    let newForm = [...form];
    newForm.splice(index, 1);
    updateForm(newForm);
  };

  const inventoryIsSelected = (inventory) => {
    return !!form.find((productAd) => {
      if (productAd.asin && productAd.sku) {
        return (
          inventory.asin === productAd.asin &&
          inventory.sellerSku === productAd.sku
        );
      }

      if (productAd.sku) {
        return inventory.sellerSku === productAd.sku;
      }

      if (productAd.asin) {
        return inventory.asin === productAd.asin;
      }

      return null;
    });
  };

  return (
    <div className="mt-4 border rounded-md">
      <div className="p-4 border-b">
        <h3 className="text-sm font-medium text-gray-700">
          {t('Advertising.CampaignBuilder.ProductAds.Products')}
        </h3>
      </div>

      <div className="grid grid-cols-2">
        <div className="border-r">
          <div className="block">
            <div className="">
              <nav
                className="-mb-px px-2 flex space-x-6 border-b"
                aria-label="Tabs"
              >
                {tabs.map((tab) => (
                  <div
                    key={tab}
                    className={classNames(
                      tab === activeTab
                        ? 'border-red-500 text-red-600'
                        : 'border-transparent text-gray-700 hover:text-gray-800 hover:border-gray-300',
                      tab === 'Search'
                        ? 'cursor-pointer'
                        : 'cursor-not-allowed',
                      'whitespace-nowrap py-4 px-1 border-b text-xs font-medium'
                    )}
                  >
                    {tab}
                  </div>
                ))}
              </nav>
              <div className="border-b p-3">
                <div className="mt-1 flex rounded-md shadow-sm">
                  <div className="relative flex items-stretch flex-grow focus-within:z-10">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <SearchIcon
                        className="h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                    </div>
                    <input
                      type="search"
                      className="focus:outline-none focus:ring-0 focus:border-gray-300 block w-full rounded-none rounded-l-md pl-10 text-xs border-gray-300"
                      placeholder={t(
                        'Advertising.CampaignBuilder.ProductAds.SearchPlaceholder'
                      )}
                      value={query}
                      onChange={onChangeQuery}
                    />
                  </div>
                  <button
                    type="button"
                    className="text-xs -ml-px relative inline-flex items-center space-x-2 px-2 py-2 border border-gray-300 rounded-r-md text-gray-700 bg-gray-50 focus:outline-none focus:ring-0 focus:border-gray-300"
                    onClick={onSearch}
                  >
                    {t('Advertising.CampaignBuilder.ProductAds.Search')}
                  </button>
                </div>
              </div>

              {/* Inventory List */}
              <ul className="divide-y divide-gray-200 h-72 overflow-y-auto px-2">
                {loading ? (
                  <div className="flex h-full items-center justify-center">
                    <Spinner height="50" width="50" />
                  </div>
                ) : (
                  inventory.rows.map((item) => {
                    const selected = inventoryIsSelected(item);
                    return (
                      <li
                        key={`options-${item.inventoryItemId}`}
                        className="py-4 grid grid-cols-12"
                      >
                        <InventoryItem inventory={item} />

                        <div className="grid col-span-2 justify-items-end items-start">
                          <button
                            className={classNames(
                              selected
                                ? 'cursor-not-allowed'
                                : 'cursor-pointer',
                              'text-xs border border-gray-300 px-2 py-1 bg-gray-100 rounded'
                            )}
                            onClick={() => onAddProductAds(item)}
                          >
                            {selected
                              ? t(
                                  'Advertising.CampaignBuilder.ProductAds.Added'
                                )
                              : t('Advertising.CampaignBuilder.ProductAds.Add')}
                          </button>
                        </div>
                      </li>
                    );
                  })
                )}
              </ul>

              <InventoryPagination
                to={inventory.to}
                from={inventory.from}
                count={inventory.count}
                prevPage={inventory.prevPage}
                nextPage={inventory.nextPage}
                onNext={() =>
                  setParams({ ...params, page: inventory.nextPage })
                }
                onPrevious={() =>
                  setParams({ ...params, page: inventory.prevPage })
                }
              />
            </div>
          </div>
        </div>
        <div className="p-4">
          <div className="mt-2 flex justify-between text-xs">
            <p className="font-medium">{form.length} Products</p>
            <p
              className="cursor-pointer text-gray-500"
              onClick={() => updateForm([])}
            >
              {t('Advertising.CampaignBuilder.ProductAds.RemoveAll')}
            </p>
          </div>

          {'productAds' in errors &&
            form.length === 0 &&
            errors['productAds'].map((error) => {
              return (
                <p
                  key={error}
                  className="text-center mt-8 text-xs text-red-600"
                >
                  {error}
                </p>
              );
            })}

          {/* Selected Inventory List */}
          <ul className="divide-y divide-gray-200 h-96 overflow-y-auto px-2 mt-4">
            {form.map((productAd, index) => {
              let inventoryItem = null;

              if (productAd.asin && productAd.sku) {
                inventoryItem = inventory.rows.find(
                  (i) =>
                    i.sellerSku === productAd.sku && i.asin === productAd.asin
                );
              }

              if (productAd.asin) {
                inventoryItem = inventory.rows.find(
                  (i) => i.asin === productAd.asin
                );
              }

              inventoryItem = inventory.rows.find(
                (i) => i.sellerSku === productAd.sku
              );

              if (inventoryItem) {
                return (
                  <li
                    key={`selected-${inventoryItem.inventoryItemId}`}
                    className="py-4 grid grid-cols-12"
                  >
                    <InventoryItem inventory={inventoryItem} />

                    <div className="grid col-span-2 justify-items-end items-start">
                      <XIcon
                        className="h-5 w-5 text-gray-400 cursor-pointer"
                        onClick={() => onRemoveProductAds(index)}
                      />
                    </div>
                  </li>
                );
              }
              return null;
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};
export default ProductAdsForm;
