import React from 'react';

const ListingFeatureBulletsChanged = ({ alert }) => {
  const { data } = alert.data.listingChanges;

  const FeatureList = ({ features }) => {
    return (
      <ul className="list-decimal ml-3">
        {features.map((feature) => {
          return (
            <li className="mb-2" key={feature}>
              {feature}
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
      <div>
        <p className="text-sm text-gray-500">Previous Value</p>
        <div className="border p-2 text-sm mt-2 rounded  text-gray-700">
          <FeatureList features={data.oldVal} />
        </div>
      </div>

      <div>
        <p className="text-sm text-gray-500">Updated Value</p>
        <div className="border p-2 text-sm mt-2 rounded  text-gray-700">
          <FeatureList features={data.newVal} />
        </div>
      </div>
    </div>
  );
};

export default ListingFeatureBulletsChanged;
