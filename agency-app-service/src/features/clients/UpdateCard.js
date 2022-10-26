import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ExclamationIcon, CheckCircleIcon } from '@heroicons/react/solid';
import { useParams } from 'react-router-dom';
import Loading from 'components/Loading';
import { useDispatch } from 'react-redux';
import { setAlert } from 'features/alerts/alertsSlice';

const UpdateCard = () => {
  const dispatch = useDispatch();
  const { token } = useParams();
  const [message, setMessage] = useState({
    success: null,
    body: '',
  });

  useEffect(() => {
    if (token) {
      const generateHostedPage = async (token) => {
        try {
          const output = await axios({
            method: 'POST',
            url: 'subscriptions/card/hosted-page',
            data: {
              token,
            },
          });
          setMessage({
            success: true,
            body: 'Redirecting to update card page...',
          });
          // //dispatch(setAlert('success', '"Redirecting to update card page..."'));
          window.location.href = output.data.output.url;
        } catch (error) {
          setMessage({
            success: false,
            body: 'Invalid Token',
          });

          console.log(error.response.data.message);

          // dispatch(
          //   setAlert('error', 'Update Card Failed', error.response.data.message)
          // );
        }
      };
      generateHostedPage(token);
    }
  }, []);

  return (
    <div className="min-h-screen pt-16 pb-12 flex flex-col bg-white">
      <main className="flex-grow flex flex-col justify-center max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-16">
          <div className="text-center">
            <img
              className="adapt-img inline"
              src="https://agency.betterseller.com/bs-si-logo.png"
              alt="betterseller logo"
              width="215"
            />
            {message.success === false || message.success === true ? (
              <div
                className={`p-5 mt-10 bg-gray-50 rounded-lg sm:w-1/2 mx-auto ${
                  message.success === true
                    ? 'bg-green-50 text-green-700'
                    : 'bg-red-50 text-red-700'
                } text-center`}
              >
                {message.success === true ? (
                  <CheckCircleIcon className="w-6 h-6 inline mr-1" />
                ) : (
                  <ExclamationIcon className="w-6 h-6 inline mr-1" />
                )}
                <span className="capitalize">{message.body}</span>
                {message.success === false && (
                  <div>Please contact the site administrator.</div>
                )}
              </div>
            ) : (
              <div className="p-5 mt-10 bg-gray-50 rounded-lg sm:w-1/2 mx-auto bg-yellow-50 text-yellow-700 flex text-center justify-center">
                Generating link. please wait&nbsp;&nbsp;
                <Loading />
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default UpdateCard;
