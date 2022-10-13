import React from 'react';

const ListingBuyboxWinnerChanged = ({ alert }) => {
  const { data } = alert.data.listingChanges;

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
      <div>
        <p className="text-sm text-gray-500">Previous Value</p>
        <div className="border p-2 text-sm mt-2 rounded  text-gray-700">
          {data.oldVal}
        </div>
      </div>
      <div>
        <p className="text-sm text-gray-500">Updated Value</p>
        <div className="border p-2 text-sm mt-2 rounded  text-gray-700">
          {data.newVal}
        </div>
      </div>
    </div>
  );
};

export default ListingBuyboxWinnerChanged;
