import { useState } from 'react';
import { range } from 'lodash';
import { useTranslation } from 'react-i18next';
import MultipleFilter from 'components/Forms/MultipleFilter';

const Filter = ({ params, setParams }) => {
  const { t } = useTranslation();
  const [filters, setFilters] = useState({ rating: [], withNotes: [] });

  const options = {
    rating: range(1, 6).map((i) => {
      return {
        value: i.toString(),
        display: `${i} ${t('Reviews.Filter.StarRating')}`,
      };
    }),
    withNotes: [
      { value: 'true', display: t('Reviews.Filter.WithNotes') },
      { value: 'false', display: t('Reviews.Filter.WithoutNotes') },
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
      options={options}
      selected={filters}
      setSelected={onSelectFilters}
    />
  );
};

export default Filter;
