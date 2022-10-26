import { fetchEmployees } from 'features/employees/employeesSlice';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import Select from 'react-select';
import { nameFormatter } from 'utils/formatters';

const SelectEmployee = ({
  isMulti = false,
  onChange,
  placeholder = 'Select an employee...',
  defaultValue = null,
  menuPlacement = 'auto',
}) => {
  const dispatch = useDispatch();
  const [options, setOptions] = useState([]);
  const [employees, setEmployees] = useState(null);

  useEffect(() => {
    if (!employees) {
      dispatch(fetchEmployees({ pageSize: 1000 })).then(
        ({ payload: { rows } }) => {
          mapOptions(rows);
          setEmployees(rows);
        }
      );
    } else {
      mapOptions(employees);
    }
  }, [employees, dispatch]);

  const mapOptions = (rows) => {
    setOptions(
      rows.map((e) => {
        return {
          value: e.userId,
          label: nameFormatter(e),
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

export default SelectEmployee;
