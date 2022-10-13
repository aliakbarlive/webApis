import React from 'react';

const ListingImagesChanged = ({ alert }) => {
  const { data } = alert.data.listingChanges;

  const ImageList = ({ images }) => {
    return (
      <div className="grid gap-1 grid-cols-4">
        {images.map((image) => {
          return (
            <a
              key={image.link}
              href={image.link}
              target="_blank"
              rel="noreferrer"
            >
              <img
                className="h-16 w-16 border border-transparent sm:rounded-lg shadow"
                src={image.link}
                alt={image.variant}
              />
            </a>
          );
        })}
      </div>
    );
  };

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
      <div>
        <p className="text-sm text-gray-500">Previous Value</p>
        <div className="border p-2 text-sm mt-2 rounded  text-gray-700">
          <ImageList images={data.oldVal} />
        </div>
      </div>

      <div>
        <p className="text-sm text-gray-500">Updated Value</p>
        <div className="border p-2 text-sm mt-2 rounded  text-gray-700">
          <ImageList images={data.newVal} />
        </div>
      </div>
    </div>
  );
};

export default ListingImagesChanged;
