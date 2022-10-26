import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useParams } from 'react-router';
import axios from 'axios';
import BillingSummary from './components/BillingSummary';
import Loading from 'components/Loading';
import OnboardingLayout from 'layouts/onboarding/OnboardingLayout';
import Button from 'components/Button';
import { useDispatch } from 'react-redux';
import { setAlert } from 'features/alerts/alertsSlice';

const BillingPreview = ({ tabs, client }) => {
  const { id } = useParams();
  const history = useHistory();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [subscription, setSubscription] = useState(null);
  const [upsell, setUpsell] = useState(null);
  const [generating, setGenerating] = useState(false);

  const getUpsell = async () => {
    setLoading(true);
    try {
      await axios.get(`/agency/upsells/${id}`).then((res) => {
        if (res.data.output.invoiceStatus === 'paid') {
          history.push('/invalid-request');
        }
        setUpsell(res.data.output);
        setSubscription(res.data.subscription);
      });
    } catch (error) {
      history.push('/invalid-request');
    }

    setLoading(false);
  };

  useEffect(() => {
    if (id) {
      getUpsell();
    }
  }, [id]);

  const proceed = async () => {
    setGenerating(true);
    const data = { subscriptionId: subscription.subscription_id };
    try {
      await axios
        .post(`/agency/upsells/${upsell.upsellId}/invoice/generate`, data)
        .then((res) => {
          dispatch(setAlert('success', 'Invoice generated.'));
          history.push('/plan');
        });
    } catch (error) {
      console.log(error);
      dispatch(setAlert('error', 'Error occurred'));
    }
    setGenerating(false);
  };

  return (
    <OnboardingLayout>
      <div className="sm:mx-auto sm:w-full sm:max-w-xl">
        <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-900">
          Upsell Billing Summary
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">&nbsp;</p>
      </div>
      <div className="mt-8 px-4 sm:px-0 sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {!loading && upsell && subscription ? (
            <>
              <h3 className="text-lg leading-6 font-medium text-gray-500 mb-4">
                Client:{' '}
                <span className="text-gray-700">
                  {upsell.agencyClient.client}
                </span>
              </h3>
              <BillingSummary upsell={upsell} subscription={subscription} />
            </>
          ) : (
            <Loading />
          )}
        </div>
      </div>
      {subscription && (
        <>
          {subscription.card && (
            <div className="mt-8 px-4 sm:px-0 sm:mx-auto sm:w-full sm:max-w-xl">
              <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                <div className="text-gray-500 border-b pb-1 mb-3 border-gray-200">
                  Payment Information
                </div>
                <div className="text-sm flex items-center space-x-3">
                  <div className="bg-gray-100 rounded-sm p-2 w-16">
                    <svg
                      class="card-logo align-bottom"
                      id="ae16618e-506c-471f-819d-1089c617863c"
                      data-name="Layer 1"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 999 323.68"
                    >
                      <defs>
                        <style>{`.bc21c412-974d-40f1-acb1-e6d771035958{fill:#1434cb;}`}</style>
                      </defs>
                      <path
                        class="bc21c412-974d-40f1-acb1-e6d771035958"
                        d="M651.19.5C580.25.5,516.86,37.27,516.86,105.19c0,77.9,112.43,83.28,112.43,122.42,0,16.48-18.89,31.23-51.14,31.23-45.77,0-80-20.61-80-20.61l-14.64,68.54s39.41,17.41,91.73,17.41c77.55,0,138.58-38.57,138.58-107.66C713.84,134.21,601,129,601,92.66c0-12.91,15.5-27,47.66-27,36.29,0,65.89,15,65.89,15l14.33-66.2S696.62.5,651.19.5Zm-649,5L.5,15.49S30.34,21,57.22,31.85c34.61,12.49,37.07,19.76,42.9,42.35L163.63,319h85.14L379.93,5.5H295L210.71,218.67,176.32,38C173.16,17.29,157.19,5.5,137.63,5.5Zm411.86,0L347.45,319h81L494.85,5.5Zm451.76,0C846.31,5.5,836,16,828.37,34.23L709.7,319h84.94l16.44-47.47H914.56l10,47.47h75L934.12,5.5Zm11,84.7,25.18,117.66H834.61L876.89,90.2Z"
                        transform="translate(-0.5 -0.5)"
                      ></path>
                    </svg>
                  </div>

                  <div className="flex flex-col">
                    <div>
                      <span className="text-gray-500 mr-2">Card Number:</span>
                      <span>
                        **** **** **** {subscription.card.last_four_digits}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500 mr-2">Expiry Date:</span>
                      <span>
                        {subscription.card.expiry_month}/
                        {subscription.card.expiry_year}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="mt-8 px-4 sm:px-0 sm:mx-auto sm:w-full sm:max-w-xl">
            <div className="flex justify-end">
              <Button
                bgColor="red-500"
                onClick={proceed}
                loading={generating}
                showLoading={true}
              >
                {subscription.auto_collect && subscription.card
                  ? 'Authorize Payment'
                  : 'Send Invoice'}
              </Button>
            </div>
          </div>
        </>
      )}
    </OnboardingLayout>
  );
};

export default BillingPreview;
