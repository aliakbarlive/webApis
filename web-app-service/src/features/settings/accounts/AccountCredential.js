import { CheckIcon, XCircleIcon } from '@heroicons/react/outline';
import classNames from 'utils/classNames';

const AccountCredential = ({ credentials }) => {
  const services = [
    { key: 'spApi', display: 'Selling Partner API' },
    { key: 'advApi', display: 'Advertising API' },
  ];

  return (
    <div className="flex md:justify-end items-center h-full">
      {services.map((service, i) => {
        const integrated = credentials.find((c) => c.service === service.key);
        const Icon = integrated ? CheckIcon : XCircleIcon;

        return (
          <button
            key={service.key}
            className={classNames(
              i === 0 ? 'mr-2' : 'mr-0',
              integrated
                ? 'bg-red-600 hover:bg-red-700 border-transparent text-white'
                : 'bg-white hover:bg-gray-50 border-gray-300 text-gray-700 bg-white',
              'inline-flex items-center px-2.5 py-1.5 border text-xs font-medium rounded shadow-sm focus:outline-none'
            )}
          >
            <Icon className="w-5 h-5 mr-1" /> {service.display}
          </button>
        );
      })}
    </div>
  );
};

export default AccountCredential;
