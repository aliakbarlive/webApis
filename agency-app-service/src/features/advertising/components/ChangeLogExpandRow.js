import axios from 'axios';
import { startCase, lowerCase } from 'lodash';
import { useEffect, useState } from 'react';

const ChangeLogExpandRow = ({
  accountId,
  marketplace,
  timestamp,
  advCampaignId,
}) => {
  const [items, setItems] = useState({ rows: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    axios
      .get('/advertising/history', {
        params: {
          accountId,
          marketplace,
          timestamp,
          advCampaignId,
        },
      })
      .then((response) => setItems(response.data.data))
      .then(() => setLoading(false));
  }, [accountId, marketplace, advCampaignId, timestamp]);

  const formatter = {
    CAMPAIGN: {
      UPDATED: ({ newValue, previousValue, changeType }) => {
        return `Update campaign ${lowerCase(
          startCase(changeType)
        )} from "${previousValue}" to "${newValue}"`;
      },
      CREATED: ({ metadata }) => {
        return `Create new campaign "${metadata.name}"`;
      },
    },
    AD_GROUP: {
      UPDATED: ({ newValue, previousValue, changeType }) => {
        return `Update ad group ${lowerCase(
          startCase(changeType)
        )} from "${previousValue}" to "${newValue}"`;
      },
      CREATED: ({ metadata }) => {
        return `Create new ad group "${metadata.name}"`;
      },
    },
    AD: {
      UPDATED: ({ newValue, previousValue, changeType }) => {
        return `Update product ad ${lowerCase(
          startCase(changeType)
        )} from "${previousValue}" to "${newValue}"`;
      },
      CREATED: ({ metadata }) => {
        return `Create new product ad "${metadata.asin}"`;
      },
    },
    KEYWORD: {
      UPDATED: ({ newValue, previousValue, changeType, metadata }) => {
        return `Update (${metadata.keyword}) keyword ${lowerCase(
          startCase(changeType)
        )} from "${previousValue}" to "${newValue}"`;
      },
      CREATED: ({ metadata }) => {
        return `Create new keyword "${
          metadata.keyword
        }" - ${metadata.keywordType.replace('KEYWORD_', '')}`;
      },
    },
    PRODUCT_TARGETING: {
      UPDATED: ({ newValue, previousValue, changeType }) => {
        return `Update product target ${lowerCase(
          startCase(changeType)
        )} from "${previousValue}" to "${newValue}"`;
      },
      CREATED: ({ metadata }) => {
        const desc =
          metadata.targetingExpression ?? metadata.productTargetingType;
        return `Create new product target "${desc}"`;
      },
    },
    NEGATIVE_KEYWORD: {
      UPDATED: ({ newValue, previousValue, changeType }) => {
        return `Update negative keyword ${lowerCase(
          startCase(changeType)
        )} from "${previousValue}" to "${newValue}"`;
      },
      CREATED: ({ metadata }) => {
        return `Create new negative keyword "${metadata.keyword}" - ${metadata.negativeTargetingType}`;
      },
    },
    NEGATIVE_PRODUCT_TARGETING: {
      UPDATED: ({ newValue, previousValue, changeType }) => {
        return `Update negative product target ${lowerCase(
          startCase(changeType)
        )} from "${previousValue}" to "${newValue}"`;
      },
      CREATED: ({ metadata }) => {
        const desc =
          metadata.targetingExpression ?? metadata.productTargetingType;
        return `Create new negative product target "${desc}"`;
      },
    },
  };

  return (
    <ul className="text-xs text-gray-700 pl-10 py-2">
      {items.rows.map((item) => {
        const action = item.changeType === 'CREATED' ? 'CREATED' : 'UPDATED';
        return (
          <li className="list-disc" key={`${item.entityId}-${item.changeType}`}>
            {formatter[item.entityType][action](item)}
          </li>
        );
      })}
    </ul>
  );
};

export default ChangeLogExpandRow;
