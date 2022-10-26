import React, { useEffect } from 'react';
import axios from 'axios';
import { ExclamationIcon, CheckCircleIcon } from '@heroicons/react/solid';

const UpdateCardSuccess = () => {
  let search = window.location.search;
  let params = new URLSearchParams(search);
  let hasHostedPageId = params.get('hostedpage_id') ? true : false;
  console.log(hasHostedPageId, 'hp');

  useEffect(() => {
    if (hasHostedPageId) {
      const cardAfterSuccess = async (hostedPageId) => {
        await axios({
          method: 'GET',
          url: 'subscriptions/card-after-success',
          params: {
            hostedPageId,
          },
        });
      };

      cardAfterSuccess(params.get('hostedpage_id'));
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
            {hasHostedPageId ? (
              <div className="p-5 mt-10 bg-gray-50 rounded-lg sm:w-1/2 mx-auto bg-green-50 text-green-700">
                <CheckCircleIcon className="inline w-7 h-7" /> You have
                successfully updated your card!
              </div>
            ) : (
              <div className="p-5 mt-10 bg-gray-50 rounded-lg sm:w-1/2 mx-auto bg-red-50 text-red-400">
                <ExclamationIcon className="inline w-7 h-7" /> Missing Token
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default UpdateCardSuccess;
