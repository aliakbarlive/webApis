import { useEffect, useState } from 'react';
import { withRouter } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { pick } from 'lodash';

import {
  createRuleAsync,
  selectRuleActions,
  getRuleActionsAsync,
} from 'features/advertising/advertisingSlice';
import { selectAuthenticatedUser } from 'features/auth/authSlice';

import {
  KEYWORDS,
  GREATER_THAN_OR_EQUAL_TO,
  SEARCH_TERMS,
  SP_KEYWORDS_UPDATE_STATUS,
  SP_KEYWORDS_UPDATE_BID,
  SP_SEARCH_TERMS_CONVERT_AS_NEGATIVE_KEYWORD,
  GREATER_THAN,
  CAMPAIGNS,
  SP_CAMPAIGNS_UPDATE_BUDGET,
  SP_CAMPAIGNS_UPDATE_STATUS,
} from 'features/advertising/utils/constants';

import ConditionsPicker from './ConditionsPicker';
import UpdateStatus from './actions/UpdateStatus';
import UpdateBid from './actions/UpdateBid';
import ConvertAsNegativeKeyword from './actions/ConvertAsNegativeKeyword';
import Checkbox from 'components/Forms/Checkbox';
import RuleCustomTarget from './RuleCustomTarget';

import { userCan } from 'utils/permission';

const CreateRule = ({ history, accountId, marketplace, campaignType }) => {
  const dispatch = useDispatch();
  const user = useSelector(selectAuthenticatedUser);
  const { t } = useTranslation();

  const actions = useSelector(selectRuleActions);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    accountId,
    name: '',
    campaignType,
    recordType: KEYWORDS,
    default: false,
    advCampaignIds: [],
    advPortfolioIds: [],
    products: [],
    filters: [
      {
        attribute: 'impressions',
        translationKey: 'Advertising.Metrics.Impressions',
        comparison: GREATER_THAN_OR_EQUAL_TO,
        value: '',
        selected: false,
      },
      {
        attribute: 'cost',
        translationKey: 'Advertising.Metrics.Cost',
        comparison: GREATER_THAN_OR_EQUAL_TO,
        value: '',
        selected: false,
      },
      {
        attribute: 'clicks',
        translationKey: 'Advertising.Metrics.Clicks',
        comparison: GREATER_THAN_OR_EQUAL_TO,
        value: '',
        selected: false,
      },
      {
        attribute: 'profit',
        translationKey: 'Advertising.Metrics.Profit',
        comparison: GREATER_THAN_OR_EQUAL_TO,
        value: '',
        selected: false,
      },
      {
        attribute: 'sales',
        translationKey: 'Advertising.Metrics.Sales',
        comparison: GREATER_THAN_OR_EQUAL_TO,
        value: '',
        selected: false,
      },
      {
        attribute: 'orders',
        translationKey: 'Advertising.Metrics.Orders',
        comparison: GREATER_THAN_OR_EQUAL_TO,
        value: '',
        selected: false,
      },
      {
        attribute: 'cpc',
        translationKey: 'Advertising.Metrics.CostPerClick',
        comparison: GREATER_THAN_OR_EQUAL_TO,
        value: '',
        selected: false,
      },
      {
        attribute: 'cr',
        translationKey: 'Advertising.Metrics.ConversionRate',
        comparison: GREATER_THAN_OR_EQUAL_TO,
        value: '',
        selected: false,
      },
      {
        attribute: 'ctr',
        translationKey: 'Advertising.Metrics.ClickThroughRate',
        comparison: GREATER_THAN_OR_EQUAL_TO,
        value: '',
        selected: false,
      },
      {
        attribute: 'acos',
        translationKey: 'Advertising.Metrics.ACOS',
        comparison: GREATER_THAN_OR_EQUAL_TO,
        value: '',
        selected: false,
      },
      {
        attribute: 'bid',
        translationKey: 'Advertising.Keyword.Bid',
        comparison: GREATER_THAN_OR_EQUAL_TO,
        value: '',
        selected: false,
        recordTypes: [KEYWORDS],
      },
      {
        attribute: 'bidUpdatedAtInDays',
        translationKey: 'Advertising.Keyword.BidLastUpdatedAt',
        comparison: GREATER_THAN_OR_EQUAL_TO,
        value: '',
        selected: false,
        recordTypes: [KEYWORDS],
        comparisons: [GREATER_THAN_OR_EQUAL_TO, GREATER_THAN],
      },
      {
        attribute: 'bid',
        translationKey: 'Advertising.Rule.Conditions.BidToCpc',
        comparison: GREATER_THAN_OR_EQUAL_TO,
        value: 'cpc',
        selected: false,
        recordTypes: [KEYWORDS],
        comparisons: [GREATER_THAN_OR_EQUAL_TO, GREATER_THAN],
      },
    ],
    actionCode: '',
    actionData: {},
  });

  useEffect(() => {
    dispatch(
      getRuleActionsAsync({ campaignType, recordType: form.recordType })
    );
  }, [dispatch, campaignType, form.recordType]);

  const onUpdateForm = (e) => {
    const { name, value } = e.target;
    let newForm = { ...form, [name]: value };

    // Reset Action Code
    if (name === 'recordType') {
      newForm.actionCode = '';
      newForm.filters = newForm.filters.map((filter) => {
        if (
          filter.recordTypes &&
          filter.recordTypes.includes(form.recordType)
        ) {
          filter.selected = false;
        }
        return filter;
      });
    }

    // Reset Action Data
    if (name === 'actionCode') {
      newForm.actionData = {};
    }

    setForm(newForm);
  };

  const useAsDefault = (e) => {
    setForm({ ...form, default: e.target.checked });
  };

  const onUpdateFormActionData = (actionData) => {
    setForm({ ...form, actionData });
  };

  const onUpdateFilterItem = (filter, index) => {
    let newForm = { ...form };
    newForm.filters[index] = filter;
    setForm(newForm);
  };

  const onUpdateCampaigns = (advCampaignIds) => {
    setForm({ ...form, advCampaignIds });
  };

  const onUpdatePortfolios = (advPortfolioIds) => {
    setForm({ ...form, advPortfolioIds });
  };

  const onUpdateProducts = (products) => {
    setForm({ ...form, products });
  };

  const saveRule = async () => {
    if (!userCan(user, 'ppc.rule.create')) return;

    let payload = { ...form };
    payload.marketplace = marketplace;
    payload.filters = payload.filters
      .filter((filter) => filter.selected)
      .filter((filter) => {
        return filter.recordTypes
          ? filter.recordTypes.includes(form.recordType)
          : true;
      })
      .map((filter) => {
        return pick(filter, ['attribute', 'comparison', 'value']);
      });

    try {
      await dispatch(createRuleAsync(payload));

      history.push(history.location.pathname.replace('create', ''));
    } catch (error) {
      setErrors(error);
    }
  };

  return (
    <div className="mt-5">
      <div className="grid grid-cols-2 gap-4 pb-4 mb-2 border-b">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            {t('Advertising.Rule.Name')}
          </label>
          <div className="mt-1">
            <input
              id="name"
              type="text"
              name="name"
              className="shadow-sm focus:outline-none focus:ring-0 focus:border-gray-300 block w-full sm:text-sm border-gray-300 rounded-md"
              value={form.name}
              onChange={onUpdateForm}
            />
            {errors.name && (
              <p className="text-xs text-red-600">{errors.name}</p>
            )}
          </div>
        </div>

        <div>
          <label
            htmlFor="recordType"
            className="block text-sm font-medium text-gray-700"
          >
            {t('Advertising.Rule.RecordType')}
          </label>
          <div className="mt-1">
            <select
              id="recordType"
              name="recordType"
              className="shadow-sm focus:outline-none focus:ring-0 focus:border-gray-300 block w-full sm:text-sm border-gray-300 rounded-md"
              value={form.recordType}
              onChange={onUpdateForm}
            >
              <option value={CAMPAIGNS}>Campaigns</option>
              <option value={KEYWORDS}>Keywords</option>
              <option value={SEARCH_TERMS}>Search Terms</option>
            </select>
          </div>
        </div>

        <div>
          <label
            htmlFor="action"
            className="block text-sm font-medium text-gray-700"
          >
            {t('Advertising.Rule.Action')}
          </label>
          <div className="mt-1">
            <select
              id="actionCode"
              name="actionCode"
              className="shadow-sm focus:outline-none focus:ring-0 focus:border-gray-300 block w-full sm:text-sm border-gray-300 rounded-md"
              value={form.actionCode}
              onChange={onUpdateForm}
            >
              <option value="">Select Action</option>
              {actions.rows.map((action) => {
                return (
                  <option key={action.code} value={action.code}>
                    {action.name}
                  </option>
                );
              })}
            </select>
            {errors.actionCode && (
              <p className="text-xs text-red-600">{errors.actionCode}</p>
            )}
          </div>
        </div>

        {(form.actionCode === SP_KEYWORDS_UPDATE_STATUS ||
          form.actionCode === SP_CAMPAIGNS_UPDATE_STATUS) && (
          <UpdateStatus
            errors={errors}
            data={form.actionData}
            onChangeData={onUpdateFormActionData}
          />
        )}
        {(form.actionCode === SP_KEYWORDS_UPDATE_BID ||
          form.actionCode === SP_CAMPAIGNS_UPDATE_BUDGET) && (
          <UpdateBid
            data={form.actionData}
            onChangeData={onUpdateFormActionData}
            errors={errors}
            label={
              form.recordType === CAMPAIGNS ? 'Update Budget' : 'Update Bid'
            }
          />
        )}
        {form.actionCode === SP_SEARCH_TERMS_CONVERT_AS_NEGATIVE_KEYWORD && (
          <ConvertAsNegativeKeyword
            errors={errors}
            data={form.actionData}
            onChangeData={onUpdateFormActionData}
          />
        )}

        <div className="col-span-2">
          <label className="flex items-center sm:text-sm font-normal text-gray-700 w-full">
            <Checkbox
              classes="mr-2"
              onChange={useAsDefault}
              checked={form.default}
            />
            <span className="font-medium capitalize ">
              {t('Advertising.Rule.Default')}
            </span>
          </label>
        </div>

        <div className="col-span-2 mt-4">
          <hr />

          <RuleCustomTarget
            accountId={accountId}
            marketplace={marketplace}
            campaignType={campaignType}
            advCampaignIds={form.advCampaignIds}
            advPortfolioIds={form.advPortfolioIds}
            ruleProducts={form.products}
            onUpdateCampaigns={onUpdateCampaigns}
            onUpdateRuleProducts={onUpdateProducts}
            onUpdatePortfolios={onUpdatePortfolios}
          />
        </div>
      </div>

      <ConditionsPicker
        form={form}
        errors={errors}
        recordType={form.recordType}
        filters={form.filters}
        updateFilterItem={onUpdateFilterItem}
      />

      <button
        onClick={saveRule}
        disabled={!userCan(user, 'ppc.rule.create')}
        className="my-8 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-md text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
      >
        {t('Advertising.Rule.Save')}
      </button>
    </div>
  );
};

export default withRouter(CreateRule);
