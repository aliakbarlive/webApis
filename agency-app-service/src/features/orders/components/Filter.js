import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import MultipleFilter from 'components/Forms/MultipleFilter';

const Filter = ({ params, setParams }) => {
  const { t } = useTranslation();
  const [filters, setFilters] = useState({
    fulfillmentChannel: [],
    withNotes: [],
    orderStatus: [],
  });

  const options = {
    fulfillmentChannel: [
      { value: 'AFN', display: 'FBA' },
      { value: 'MFN', display: 'FBM' },
    ],
    withNotes: [
      { value: 'true', display: t('Orders.WithNotes') },
      { value: 'false', display: t('Orders.WithoutNotes') },
    ],
    orderStatus: [
      t('Orders.Status.Pending'),
      t('Orders.Status.Unshipped'),
      t('Orders.Status.Shipping'),
      t('Orders.Status.Shipped'),
      t('Orders.Status.Delivered'),
      t('Orders.Status.Returned'),
      t('Orders.Status.Cancelled'),
    ],
  };
  const onSelectFilters = (filters) => {
    setFilters(filters);
    const newParams = { ...params };

    if ('page' in params) newParams.page = 1;

    // Order status filters.
    delete newParams.orderStatus;
    if (filters.orderStatus.length) {
      newParams.orderStatus = filters.orderStatus.join();
    }

    // Order fulfillment channel filters.
    delete newParams.fulfillmentChannel;
    if (filters.fulfillmentChannel.length) {
      newParams.fulfillmentChannel = filters.fulfillmentChannel.join();
    }

    // With notes filter.
    delete newParams.withNotes;
    if (filters.withNotes.length === 1) {
      newParams.withNotes = filters.withNotes[0] === 'true';
    }
    setParams(newParams);
  };

  return (
    <MultipleFilter
      className="text-sm mx-4"
      label={t('Orders.Filter')}
      options={options}
      noSelectedText={t('Orders.NoFiltersSelected')}
      selected={filters}
      setSelected={onSelectFilters}
    />
  );
};

export default Filter;
