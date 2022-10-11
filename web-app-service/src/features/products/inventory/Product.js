import ReactTooltip from 'react-tooltip';

const Product = (cell, { productName, asin, sellerSku, listingImages }) => {
  return (
    <div className="flex">
      <div className="mr-4 flex-shrink-0">
        {listingImages ? (
          <img
            className="h-16 w-16 border border-transparent sm:rounded-lg shadow"
            src={listingImages[0].link}
            alt={productName}
          />
        ) : (
          <svg
            className="h-16 w-16 border border-transparent bg-white text-gray-300 sm:rounded-lg shadow"
            preserveAspectRatio="none"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 200 200"
            aria-hidden="true"
          >
            <path
              vectorEffect="non-scaling-stroke"
              strokeWidth={1}
              d="M0 0l200 200M0 200L200 0"
            />
          </svg>
        )}
      </div>
      <div>
        <p
          data-tip={productName}
          className="text-sm font-medium text-gray-900 mb-1.5"
        >
          {productName.length > 40
            ? `${productName.substr(0, 40)}...`
            : productName}
        </p>
        <ReactTooltip
          place="top"
          className="max-w-xs text-black"
          backgroundColor="rgba(229, 231, 235, var(--tw-bg-opacity))"
          textColor="rgba(17, 24, 39, var(--tw-text-opacity))"
        />

        <p className="text-sm text-gray-500">ASIN: {asin}</p>
        <p className="text-sm text-gray-500">SKU: {sellerSku}</p>
      </div>
    </div>
  );
};

export default Product;
