import { isEmpty } from 'lodash';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import useQuery from './useQuery';

const useQueryParams = (defaults) => {
  let query = useQuery();
  const history = useHistory();

  // if URLSearchParams is empty use defaults
  const [params, setParams] = useState(
    isEmpty(Object.fromEntries(query)) ? defaults : Object.fromEntries(query)
  );

  // merge/replace existing params
  const updateParams = (newParams, search = false) => {
    let mergeParams = {
      ...params,
      ...newParams,
    };
    setParams(mergeParams);

    Object.keys(mergeParams).forEach((key) => {
      query.set(key, mergeParams[key]);
    });

    if (search) {
      if (mergeParams.search === '') {
        query.delete('search');
      } else {
        query.set('search', mergeParams.search);
      }
    }

    history.push(window.location.pathname + '?' + query.toString());
  };

  // if sort is available
  const sortParam = params.sort ? params.sort.split(':') : null;

  return {
    params,
    updateParams,
    sortParam,
  };
};

export default useQueryParams;
