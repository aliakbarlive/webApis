import { useState } from 'react';
import { MultipleFilter } from 'components';

const Filter = ({ params, setParams }) => {
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
      { value: 'true', display: 'With notes' },
      { value: 'false', display: 'Without notes' },
    ],
    orderStatus: [
      'Pending',
      'Unshipped',
      'Shipping',
      'Shipped',
      'Delivered',
      'Returned',
      'Cancelled',
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
      label="Filter"
      options={options}
      noSelectedText="No Filters selected"
      selected={filters}
      setSelected={onSelectFilters}
    />
  );
};

export default Filter;
