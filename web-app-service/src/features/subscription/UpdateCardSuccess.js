import React, { useEffect } from 'react';
import axios from 'axios';

const UpdateCardSuccess = () => {
  useEffect(() => {
    let search = window.location.search;
    let params = new URLSearchParams(search);
    let hasHostedPageId = params.get('hostedpage_id') ? true : false;

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
            <div className="p-5 mt-10 bg-gray-50 rounded-lg sm:w-1/2 mx-auto">
              <h1 className="mt-0 text-xl font-extrabold text-gray-900 tracking-tight sm:text-2xl">
                Success
              </h1>
              <p className="mt-0 text-base text-gray-500">
                You have successfully updated your card!
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UpdateCardSuccess;
