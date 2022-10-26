import axios from 'axios';
import Button from 'components/Button';
import Modal from 'components/Modal';
import ModalHeader from 'components/ModalHeader';
import { useEffect, useState } from 'react';
import { CheckIcon } from '@heroicons/react/outline';
import { sum } from 'lodash';
import Badge from 'components/Badge';
import { useDispatch } from 'react-redux';
import { setAlert } from 'features/alerts/alertsSlice';
import usePermissions from 'hooks/usePermissions';
import Loading from 'components/Loading';
import BillingSummary from './BillingSummary';

const NextStepsModal = ({
  upsell,
  open,
  setOpen,
  closeSlideOver,
  onOkClick,
}) => {
  const dispatch = useDispatch();
  const { userCan } = usePermissions();
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [sending, setSending] = useState(false);
  const [subscription, setSubscription] = useState(null);

  const getClient = async () => {
    setLoading(true);
    await axios
      .get(`/agency/subscription/client/${upsell.agencyClientId}`)
      .then((res) => {
        setSubscription(res.data.subscription);
      });
    setLoading(false);
  };

  useEffect(() => {
    if (upsell && open === true) {
      getClient();
    }
  }, [upsell, open]);

  const proceed = async () => {
    setGenerating(true);
    const data = { subscriptionId: subscription.subscription_id };
    try {
      await axios
        .post(`/agency/upsells/${upsell.upsellId}/invoice/generate`, data)
        .then((res) => {
          dispatch(setAlert('success', 'Upsell saved. Invoice generated.'));
          setOpen(false);
          onOkClick();
        });
    } catch (error) {
      console.log(error);
      dispatch(setAlert('error', 'Error occurred'));
    }
    setGenerating(false);
  };

  const send = async () => {
    setSending(true);
    const data = { subscriptionId: subscription.subscription_id };
    try {
      await axios
        .post(`/agency/upsells/${upsell.upsellId}/send`, data)
        .then((res) => {
          dispatch(setAlert('success', 'Email sent.'));
          setOpen(false);
          onOkClick();
        });
    } catch (error) {
      console.log(error);
      dispatch(setAlert('error', 'Email not sent. An error occurred'));
    }
    setSending(false);
  };

  return (
    <Modal
      open={open}
      setOpen={setOpen}
      align="top"
      as={'div'}
      noOverlayClick={true}
    >
      <div className="inline-block w-full max-w-xl my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-xl">
        <ModalHeader title="Upsell Approved" setOpen={setOpen} />

        <div className="sm:flex sm:items-start text-left py-4 px-6">
          <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
            <CheckIcon className="h-6 w-6 text-green-600" aria-hidden="true" />
          </div>
          <div className="mt-3 text-left sm:mt-0 sm:ml-4 w-full">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Next Steps
            </h3>
            {!loading && subscription ? (
              <>
                <div className="mt-4 bg-gray-50 border rounded-lg py-4 px-6">
                  <BillingSummary upsell={upsell} subscription={subscription} />
                </div>
                <div className="mt-8 flex justify-between items-center">
                  <div>
                    <span>Send Billing Summary</span>
                    <p className="mt-1 text-xs">
                      Customer will be able to checkout manually
                    </p>
                  </div>

                  <Button
                    bgColor="red-500"
                    onClick={send}
                    loading={sending}
                    showLoading={true}
                  >
                    Send Mail
                  </Button>
                </div>
                {userCan('upsells.invoice.operation') ? (
                  <div className="border-t pt-4 mt-4 flex justify-between items-end">
                    <div>
                      Charge the customer for this request
                      {!loading && (
                        <div className="text-xs">
                          {subscription && subscription.auto_collect ? (
                            <>
                              <Badge color="green" rounded="md">
                                Online payment mode
                              </Badge>
                              <p className="mt-1">
                                Customer will be charged <b>immediately</b>
                              </p>
                            </>
                          ) : (
                            <>
                              <Badge color="red" rounded="md">
                                Offline payment mode
                              </Badge>
                              <p className="mt-1">
                                An invoice will be sent to the customer and they
                                will have to pay manually
                              </p>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                    <div>
                      <Button
                        bgColor="red-500"
                        onClick={proceed}
                        loading={generating}
                        showLoading={true}
                      >
                        Charge
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="mt-4 text-red-600 text-xs">
                    Client must be billed/charged to continue this process.
                  </div>
                )}
              </>
            ) : (
              <div className="mt-4">
                <Loading />
              </div>
            )}
          </div>
        </div>
        <div className="text-right mt-4 p-4 border-t">
          <Button
            color="gray"
            onClick={() => {
              setOpen(false);
              closeSlideOver();
            }}
            classes="mr-2"
            loading={loading}
          >
            Later
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default NextStepsModal;
