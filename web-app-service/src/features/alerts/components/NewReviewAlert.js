import React from 'react';
import { StarIcon } from '@heroicons/react/solid';
import { range } from 'lodash';

const NewReviewAlert = ({ alert }) => {
  const { review } = alert.data;

  return (
    <div>
      <div className="mb-2">
        <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-gray-400">
          <span className="font-medium leading-none text-white">
            {review.profileName.charAt(0)}
          </span>
        </span>
        <a
          className="ml-2 hover:text-red-500 text-sm text-gray-700"
          href={review.profileLink}
          target="_blank"
          rel="noreferrer"
        >
          {review.profileName}
        </a>
      </div>
      <div className="p-4 border mb-2 rounded text-sm text-gray-700">
        <div className="w-full pb-3">
          <a
            href={review.link}
            target="_blank"
            rel="noreferrer"
            className="font-medium text-sm hover:text-red-500"
          >
            {review.title}
          </a>
          <div className="flex">
            {range(1, 6).map((i) => (
              <StarIcon
                key={i}
                className={`h-5 w-5 mt-1 text-${
                  review.rating >= i ? 'yellow' : 'gray'
                }-400`}
                aria-hidden="true"
              />
            ))}
          </div>
          <p className="font-sm text-sm">{review.body}</p>
        </div>
      </div>
    </div>
  );
};

export default NewReviewAlert;
