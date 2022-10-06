import {
  getClientAsync,
  selectClientList,
} from 'features/clients/clientsSlice';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';

const SelectClient = ({
  isMulti = false,
  onChange,
  placeholder = 'Filter by client...',
  defaultValue = null,
  menuPlacement = 'auto',
}) => {
  const dispatch = useDispatch();
  const { rows: clients } = useSelector(selectClientList);
  const [options, setOptions] = useState([]);

  useEffect(() => {
    if (!clients) {
      dispatch(getClientAsync()).then(({ rows }) => {
        mapOptions(rows);
      });
    } else {
      mapOptions(clients);
    }
  }, [clients, dispatch]);

  const mapOptions = (rows) => {
    setOptions(
      rows.map((c) => {
        return {
          value: c.agencyClientId,
          label: c.client,
        };
      })
    );
  };

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      '*': {
        boxShadow: 'none !important',
      },
    }),
  };

  return (
    <Select
      isClearable
      placeholder={placeholder}
      defaultValue={defaultValue}
      onChange={(e) => onChange(e)}
      menuPlacement={menuPlacement}
      options={options}
      isMulti={isMulti}
      theme={(theme) => ({
        ...theme,
        colors: {
          ...theme.colors,
          primary25: 'rgba(239,68,68,0.5)',
          primary: 'rgb(239,68,68)',
        },
      })}
      styles={customStyles}
    />
  );
};

export default SelectClient;
