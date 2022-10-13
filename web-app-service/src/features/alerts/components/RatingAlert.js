import React from 'react';

const RatingAlert = ({ alert }) => {
  const { rating } = alert.data;

  return (
    <div className="p-4 border mb-2 rounded text-sm text-gray-700">
      <div className="border-b w-full pb-3">
        <p className="font-medium">Overall Rating: {rating.overallRating}</p>
      </div>
      <div>
        <p className="my-2">Breakdowns:</p>
        <ul className="grid grid-cols-1 md:grid-cols-5 gap-1">
          <li className="border p-2 rounded">
            1 star: {rating.breakdown.one_star.count}
          </li>
          <li className="border p-2 rounded">
            2 star: {rating.breakdown.two_star.count}
          </li>
          <li className="border p-2 rounded">
            3 star: {rating.breakdown.three_star.count}
          </li>
          <li className="border p-2 rounded">
            4 star: {rating.breakdown.four_star.count}
          </li>
          <li className="border p-2 rounded">
            5 star: {rating.breakdown.five_star.count}
          </li>
        </ul>
      </div>
    </div>
  );
};

export default RatingAlert;
