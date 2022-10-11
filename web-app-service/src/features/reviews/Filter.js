import { useState } from 'react';
import { MultipleFilter } from 'components';

const Filter = ({ params, setParams }) => {
  const [filters, setFilters] = useState({ rating: [], withNotes: [] });

  const options = {
    rating: [
      { value: '1', display: '1 Star Rating' },
      { value: '2', display: '2 Star Rating' },
      { value: '3', display: '3 Star Rating' },
      { value: '4', display: '4 Star Rating' },
      { value: '5', display: '5 Star Rating' },
    ],
    withNotes: [
      { value: 'true', display: 'With notes' },
      { value: 'false', display: 'Without notes' },
    ],
  };

  const onSelectFilters = (filters) => {
    setFilters(filters);
    const newParams = { ...params, page: 1 };

    // Reset filters.
    delete newParams.rating;
    delete newParams.withNotes;

    // Rating filters.
    if (filters.rating.length && filters.rating.length !== 5) {
      newParams.rating = filters.rating.join();
    }

    // With notes filter.
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
