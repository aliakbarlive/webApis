import React, { useEffect, useState } from 'react';

import { useDispatch } from 'react-redux';
import { updateInventoryItemAsync } from '../inventorySlice';

import { Input, InputGroup, InputGroupAddon, InputGroupText } from 'reactstrap';

const CogInput = ({ cell, row }) => {
  const { inventoryItemId } = row;
  const dispatch = useDispatch();
  const [value, setValue] = useState(null);

  const onInputBlur = (e) => {
    const input = e.target.value;
    const newValue = input !== '' ? input : 0;

    setValue(newValue);
    dispatch(
      updateInventoryItemAsync(inventoryItemId, {
        defaultCog: newValue,
        queryType: 'estimate',
      })
    );
  };

  return (
    <InputGroup>
      <InputGroupAddon addonType="prepend">
        <InputGroupText className="currency-add-on">$</InputGroupText>
      </InputGroupAddon>
      <Input
        key={inventoryItemId}
        type="number"
        min="0.00"
        step="0.01"
        defaultValue={cell}
        value={value}
        onBlur={onInputBlur}
      />
    </InputGroup>
  );
};

export default CogInput;
