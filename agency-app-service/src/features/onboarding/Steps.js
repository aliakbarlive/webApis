import React from 'react';
import { CheckIcon } from '@heroicons/react/solid';
import classNames from 'utils/classNames';

const Steps = ({ activeStep = 0 }) => {
  const setStatus = (step) => {
    if (step < activeStep) {
      return 'complete';
    } else if (step > activeStep) {
      return 'upcoming';
    } else if (step === activeStep) {
      return 'current';
    }
  };

  const steps = [
    { name: '0', step: 0, href: '/onboarding/start', status: setStatus(0) },
    {
      name: '1',
      step: 1,
      href: '/onboarding/start',
      status: setStatus(1),
    },
    {
      name: '2',
      step: 2,
      href: '/onboarding/start',
      status: setStatus(2),
    },
    {
      name: '2',
      step: 3,
      href: '/onboarding/start',
      status: setStatus(3),
    },
  ];

  return (
    <nav aria-label="Progress">
      <ol className="flex items-center justify-center">
        {steps.map((step, stepIdx) => (
          <li
            key={step.name}
            className={classNames(
              stepIdx !== steps.length - 1 ? 'pr-8 sm:pr-20' : '',
              'relative'
            )}
          >
            {step.status === 'complete' ? (
              <>
                <div
                  className="absolute inset-0 flex items-center"
                  aria-hidden="true"
                >
                  <div className="h-0.5 w-full bg-red-600" />
                </div>
                <div className="relative w-8 h-8 flex items-center justify-center bg-red-600 rounded-full">
                  <CheckIcon
                    className="w-5 h-5 text-white"
                    aria-hidden="true"
                  />
                  <span className="sr-only">{step.name}</span>
                </div>
              </>
            ) : step.status === 'current' ? (
              <>
                <div
                  className="absolute inset-0 flex items-center"
                  aria-hidden="true"
                >
                  <div className="h-0.5 w-full bg-gray-200" />
                </div>
                <div
                  className="relative w-8 h-8 flex items-center justify-center bg-white border-2 border-red-600 rounded-full"
                  aria-current="step"
                >
                  <span
                    className="h-2.5 w-2.5 bg-red-600 rounded-full"
                    aria-hidden="true"
                  />
                  <span className="sr-only">{step.name}</span>
                </div>
              </>
            ) : (
              <>
                <div
                  className="absolute inset-0 flex items-center"
                  aria-hidden="true"
                >
                  <div className="h-0.5 w-full bg-gray-200" />
                </div>
                <div className="group relative w-8 h-8 flex items-center justify-center bg-white border-2 border-gray-300 rounded-full">
                  <span
                    className="h-2.5 w-2.5 bg-transparent rounded-full "
                    aria-hidden="true"
                  />
                  <span className="sr-only">{step.name}</span>
                </div>
              </>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Steps;
