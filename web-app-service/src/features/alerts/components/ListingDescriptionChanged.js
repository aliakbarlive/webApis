import React from 'react';
import parse from 'html-react-parser';

const ListingDescriptionChanged = ({ alert }) => {
  const { data } = alert.data.listingChanges;

  return (
    <div className="flex flex-col">
      {data.oldVal && (
        <div className="mb-4">
          <p className="text-sm text-gray-500">Previous Value</p>
          <div className="border p-2 text-sm mt-2 rounded  text-gray-700">
            {parse(data.oldVal)}
          </div>
        </div>
      )}

      {data.newVal && (
        <div className="border-t pt-2">
          <p className="text-sm text-gray-500">Updated Value</p>
          <div className="border p-2 text-sm mt-2 rounded  text-gray-700">
            {parse(data.newVal)}
          </div>
        </div>
      )}
    </div>
  );
};

export default ListingDescriptionChanged;
