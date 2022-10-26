import permissionDeniedImg from 'assets/images/permission_denied.svg';

import { ExclamationIcon } from '@heroicons/react/outline';
import OnboardingLayout from 'layouts/onboarding/OnboardingLayout';
import { Link } from 'react-router-dom';

const InvalidRequest = () => {
  return (
    <OnboardingLayout>
      <div className="sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="p-2 rounded-lg bg-red-500 shadow-lg sm:p-3">
          <div className="flex items-center justify-between flex-wrap">
            <div className="w-0 flex-1 flex items-center">
              <span className="flex p-2 rounded-lg bg-red-600">
                <ExclamationIcon
                  className="h-6 w-6 text-white"
                  aria-hidden="true"
                />
              </span>
              <p className="ml-3 font-medium text-white text-sm">
                <span>
                  Whoops!! You visited an invalid URL. Please contact your
                  administrator if there seems to be a mistake
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 sm:mt-16 sm:mx-auto sm:w-full sm:max-w-sm">
        <img alt="permission-denied" src={permissionDeniedImg} />
      </div>
      <div className="mt-4 sm:mt-16 sm:mx-auto sm:w-full sm:max-w-sm text-center">
        <Link className="btn-green" to="/plan">
          Go to my dashboard
        </Link>
      </div>
    </OnboardingLayout>
  );
};

export default InvalidRequest;
