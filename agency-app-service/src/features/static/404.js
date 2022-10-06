import React from 'react';
import logo from 'assets/logos/logo-orange.png';
import permissionDeniedImg from 'assets/images/permission_denied.svg';

const Error404 = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <main className="flex-grow flex flex-col justify-center max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <a href="/">
            <img
              className="mx-auto h-12 w-auto rounded-md"
              src={logo}
              alt="Logo"
            />
          </a>
          <div className="relative mt-12">
            <h1 className="text-7xl text-gray-700 font-medium my-8 absolute left-1/2 transform -translate-x-1/2">
              404
            </h1>
            <span className="inline-block w-96 h-96">
              <img
                className="w-full"
                alt="permission-denied"
                src={permissionDeniedImg}
              />
            </span>
          </div>

          <h3 className="text-xl text-gray-600 font-light">
            Ooops! We couldn't find the page you're looking for.
          </h3>
        </div>
      </main>
    </div>
  );
};

export default Error404;
