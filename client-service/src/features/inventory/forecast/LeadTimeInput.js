import React, { useEffect, useState } from 'react';

import { useDispatch } from 'react-redux';
import { updateInventoryItemAsync } from '../inventorySlice';

import { Input } from 'reactstrap';

const LeadTimeInput = ({ cell, row }) => {
  const { inventoryItemId } = row;
  const dispatch = useDispatch();
  const [leadTime, setLeadTime] = useState(null);

  const onInputBlur = (e) => {
    const input = e.target.value;
    const newValue = input !== '' ? input : 0;

    setLeadTime(newValue);

    dispatch(
      updateInventoryItemAsync(inventoryItemId, {
        leadTime: parseInt(newValue),
        queryType: 'forecast',
      })
    );
  };

  return (
    <Input
      type="number"
      min="0"
      defaultValue={cell}
      value={leadTime}
      onBlur={onInputBlur}
    />
  );
};

export default LeadTimeInput;
