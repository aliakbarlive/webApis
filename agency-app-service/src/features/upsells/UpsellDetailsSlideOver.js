import axios from 'axios';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

import { AnnotationIcon } from '@heroicons/react/solid';

import usePermissions from 'hooks/usePermissions';
import { selectAuthenticatedUser } from 'features/auth/authSlice';

import Button from 'components/Button';
import SlideOver from 'components/SlideOver';
import UpsellForm from './components/UpsellForm';
import UpsellDetails from './components/UpsellDetails';

import { dateFormatterUTC, nameFormatter } from 'utils/formatters';

const UpsellDetailsSlideOver = ({
  open,
  setOpen,
  upsell,
  client,
  getUpsells,
}) => {
  const user = useSelector(selectAuthenticatedUser);
  const { userCan } = usePermissions();
  const [logs, setLogs] = useState(null);
  const [newLog, setNewLog] = useState('');

  useEffect(() => {
    async function getLogs() {
      await axios.get(`/agency/upsells/${upsell.upsellId}/logs`).then((res) => {
        setLogs(res.data.output);
      });
    }

    if (open && upsell) {
      getLogs();
    } else {
      setLogs(null);
    }
  }, [open, upsell]);

  const addNewLog = () => {
    if (!upsell) return;

    axios
      .post('/agency/upsells/log', {
        upsellId: upsell.upsellId,
        description: newLog,
      })
      .then(() => {
        setNewLog('');
        axios.get(`/agency/upsells/${upsell.upsellId}/logs`).then((res) => {
          setLogs(res.data.output);
        });
      });
  };

  const deleteLog = (upsellLogId) => {
    if (!upsell) return;

    axios
      .delete(`/agency/upsells/${upsell.upsellId}/logs/${upsellLogId}`)
      .then(() => {
        axios.get(`/agency/upsells/${upsell.upsellId}/logs`).then((res) => {
          setLogs(res.data.output);
        });
      });
  };

  const viewOnlyExisting = () => {
    return upsell && userCan('upsells.view') && !userCan('upsells.update');
  };

  const canCreateUpsell = () => {
    return !upsell && userCan('upsells.create');
  };

  const canUpdateUpsellInProgress = () => {
    return upsell && userCan('upsells.update') && !upsell.invoiceId;
  };

  const approvedUpsell = () => {
    return (
      upsell &&
      userCan('upsells.view') &&
      upsell.status === 'approved' &&
      upsell.invoiceId
    );
  };

  return (
    <SlideOver
      open={open}
      setOpen={setOpen}
      title="Upsell Details"
      titleClasses="capitalize"
      size="2xl"
      noOverlayClick={canCreateUpsell() ? true : false}
    >
      <div className="flow-root">
        {viewOnlyExisting() && (
          <UpsellDetails
            upsell={upsell}
            client={client}
            setOpen={setOpen}
            getUpsells={getUpsells}
          />
        )}
        {canCreateUpsell() && (
          <UpsellForm
            action="add"
            client={client}
            setOpen={setOpen}
            getUpsells={getUpsells}
          />
        )}
        {canUpdateUpsellInProgress() &&
          (upsell.status !== 'rejected' ? (
            <UpsellForm
              action="update"
              upsell={upsell}
              client={client}
              setOpen={setOpen}
              getUpsells={getUpsells}
            />
          ) : (
            <UpsellDetails
              upsell={upsell}
              setOpen={setOpen}
              getUpsells={getUpsells}
            />
          ))}
        {approvedUpsell() && (
          <UpsellDetails
            upsell={upsell}
            setOpen={setOpen}
            getUpsells={getUpsells}
          />
        )}

        {logs && logs.length > 0 && (
          <div className="mt-8 bg-gray-50 rounded-lg p-4">
            <h3 className="mb-3 font-medium text-gray-900">
              Comments &amp; History
            </h3>
            {upsell && upsell.status !== 'rejected' && (
              <>
                <textarea
                  className="form-select text-sm"
                  placeholder="Add new logs"
                  onChange={(e) => setNewLog(e.target.value)}
                  value={newLog}
                ></textarea>
                <div className="text-right mb-8">
                  <Button
                    classes="mt-2 mr-2"
                    color="gray"
                    onClick={() => setNewLog('')}
                  >
                    Clear
                  </Button>
                  <Button
                    disabled={!newLog}
                    type="submit"
                    classes="mt-2 text-xs"
                    onClick={addNewLog}
                  >
                    Add
                  </Button>
                </div>
              </>
            )}

            <ul role="list" className="-mb-6">
              {logs.map((log, logIdx) => (
                <li key={log.upsellLogId}>
                  <div className="relative pb-6">
                    {logIdx !== logs.length - 1 ? (
                      <span
                        className="absolute top-3 left-3 -ml-px h-full w-0.5 bg-gray-200"
                        aria-hidden="true"
                      />
                    ) : null}
                    <div className="relative flex space-x-3">
                      <div>
                        <span className="bg-gray-400 h-6 w-6 rounded-full flex items-center justify-center ring-8 ring-gray-50">
                          <AnnotationIcon
                            className="h-4 w-4 text-white"
                            aria-hidden="true"
                          />
                        </span>
                      </div>
                      <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                        <div>
                          <p className="text-sm text-gray-500 whitespace-pre-wrap">
                            {log.description} by&nbsp;
                            <span className="font-medium text-gray-900">
                              {nameFormatter(log.addedByUser)}
                            </span>
                          </p>
                          {!log.isSystemGenerated &&
                            user.userId === log.addedByUser.userId && (
                              <p
                                className="mt-1 text-xs text-red-500 cursor-pointer"
                                onClick={() => deleteLog(log.upsellLogId)}
                              >
                                Delete
                              </p>
                            )}
                        </div>
                        <div className="text-right text-xs whitespace-nowrap text-gray-500">
                          {dateFormatterUTC(
                            log.createdAt,
                            'DD MMM YYYY HH:MMA'
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </SlideOver>
  );
};

export default UpsellDetailsSlideOver;
