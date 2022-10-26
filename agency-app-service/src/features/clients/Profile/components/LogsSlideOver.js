import React from 'react';
import SlideOver from 'components/SlideOver';
import Loading from 'components/Loading';
import moment from 'moment';
import { ArrowSmRightIcon } from '@heroicons/react/solid';

const LogsSlideOver = ({ open, setOpen, logs, name }) => {
  return (
    <SlideOver
      open={open}
      setOpen={setOpen}
      title={`Logs: ${name}`}
      titleClasses="capitalize"
      size="xl"
    >
      <div className="flow-root">
        {logs ? (
          <>
            <ul role="list" className="-my-5 divide-y divide-gray-200">
              {logs.map((log) => (
                <li key={log.logId} className="py-5">
                  <div className="relative focus-within:ring-2 focus-within:ring-indigo-500">
                    <h3 className="text-sm font-semibold text-gray-800 ">
                      <span className="absolute inset-0" aria-hidden="true" />
                      <ArrowSmRightIcon className="w-6 float-left mb-2" />
                      {log.name} ({' '}
                      {moment(log.createdAt).format('MMM. Do YYYY, h:mm a')} )
                    </h3>
                  </div>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <li>
            <Loading />
          </li>
        )}
      </div>
    </SlideOver>
  );
};

export default LogsSlideOver;
