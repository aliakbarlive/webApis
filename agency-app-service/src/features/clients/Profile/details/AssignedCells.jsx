import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { SaveIcon } from '@heroicons/react/outline';

import { Card } from 'components';
import Label from 'components/Forms/Label';
import { setAlert } from 'features/alerts/alertsSlice';
import Select from 'components/Forms/Select';
import Button from 'components/Button';
import usePermissions from 'hooks/usePermissions';

const AssignedCells = ({ client, updateDetails }) => {
  const dispatch = useDispatch();
  const { userCan } = usePermissions();
  const { agencyClientId } = client;
  const [cells, setCells] = useState({});
  const [operations, setOperations] = useState([]);
  const [ppc, setPpc] = useState([]);
  const [ppcValue, setPpcValue] = useState({});
  const [operationsValue, setOperationsValue] = useState({});
  const [loading, setLoading] = useState(false);

  const disabled = !userCan('clients.assignToCell');

  const getCells = async () => {
    setLoading(true);
    try {
      const res = await axios({
        method: 'GET',
        url: `/agency/client/${agencyClientId}/cells`,
      });

      setCells(res.data.agencyClient);
      setOperations(res.data.options.cellsOperation);
      setPpc(res.data.options.cellsPpc);
      setPpcValue(
        res.data.agencyClient.cells.find((e) => e.type === 'ppc')
          ? res.data.agencyClient.cells.find((e) => e.type === 'ppc')
          : { name: '', cellId: 0, type: 'ppc' }
      );
      setOperationsValue(
        res.data.agencyClient.cells.find((e) => e.type === 'operations')
          ? res.data.agencyClient.cells.find((e) => e.type === 'operations')
          : { name: '', cellId: 0, type: 'operations' }
      );
    } catch (error) {
      await dispatch(setAlert('error', error.response.data.message));
    }

    setLoading(false);
  };

  useEffect(() => {
    getCells();
  }, []);

  const onChange = (e, type) => {
    if (type === 'ppc') {
      setPpcValue({ ...ppcValue, cellId: e.target.value });
    } else {
      setOperationsValue({ ...operationsValue, cellId: e.target.value });
    }
  };

  const onSave = async (data) => {
    setLoading(true);
    try {
      const res = await axios({
        method: 'POST',
        url: `/agency/client/${agencyClientId}/cells`,
        data: data,
      });

      updateDetails(res.data);
      dispatch(setAlert('success', 'Sucessfully Saved!'));
    } catch (err) {
      dispatch(setAlert('error', 'An error occurred during saving'));
      console.log(err);
    }
    setLoading(false);
  };

  return (
    <div>
      <div className="py-6">
        <h3 className="mb-4 text-xl font-bold">Cells Assigned</h3>
        <Card>
          <div className="grid grid-cols-4 justify-items-stretch gap-x-2 gap-y-1">
            <div className="col-span-4">
              <Label htmlFor="role" classes="">
                Operations
              </Label>
            </div>
            <div className="col-span-4 flex">
              <Select
                name="operationsValue"
                className="font-medium text-sm md:mb-0 capitalize mr-2 w-3/4"
                id="operation"
                value={operationsValue.cellId}
                disabled={disabled}
                onChange={(e) => onChange(e, 'operations')}
              >
                {cells &&
                  [
                    { cellId: 0, name: '', type: 'operations' },
                    ...operations,
                  ].map((option) => {
                    return (
                      <option key={option.cellId} value={option.cellId}>
                        {option.name}
                      </option>
                    );
                  })}
              </Select>
              <Button
                disabled={disabled}
                onClick={() => onSave(operationsValue)}
                loading={loading}
              >
                <SaveIcon className="w-5 h-5 inline" />
              </Button>
            </div>
          </div>
          <div className="mt-2 grid grid-cols-4 justify-items-stretch gap-x-2 gap-y-1">
            <div className="col-span-4">
              <Label htmlFor="role" classes="">
                PPC
              </Label>
            </div>
            <div className="col-span-4 flex">
              <Select
                name="ppcValue"
                className="font-medium text-sm mb-2 md:mb-0 capitalize mr-2 w-3/4"
                value={ppcValue.cellId}
                id="ppcValue"
                disabled={disabled}
                onChange={(e) => onChange(e, 'ppc')}
              >
                {cells &&
                  [{ cellId: 0, name: '', type: 'ppc' }, ...ppc].map(
                    (option) => {
                      return (
                        <option key={option.cellId} value={option.cellId}>
                          {option.name}
                        </option>
                      );
                    }
                  )}
              </Select>
              <Button
                disabled={disabled}
                className="disabled"
                onClick={() => onSave(ppcValue)}
                loading={loading}
              >
                <SaveIcon className="w-5 h-5 inline" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AssignedCells;
