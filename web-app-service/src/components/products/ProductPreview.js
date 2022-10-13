import { useEffect } from 'react';
import ReactTooltip from 'react-tooltip';

const ProductPreview = ({
  productName,
  asin,
  sku,
  image,
  displayImage = true,
  rebuildTooltip = false,
}) => {
  useEffect(() => {
    if (rebuildTooltip) {
      ReactTooltip.rebuild();
    }
  }, [rebuildTooltip]);

  let imageUrl = image
    ? image
    : 'https://images-na.ssl-images-amazon.com/images/I/01RmK%2BJ4pJL.gif';

  if (image && Array.isArray(image) && image[0].link) {
    imageUrl = image[0].link;
  }

  return (
    <div className="flex">
      {displayImage && (
        <div className="mr-4 flex-shrink-0 self-center">
          <img
            className="h-16 w-16 border border-transparent sm:rounded-lg shadow"
            src={imageUrl}
            alt={productName}
          />
        </div>
      )}
      <div>
        {productName && (
          <>
            <p
              data-tip={productName}
              className="text-sm font-medium text-gray-900 mb-1.5"
            >
              {productName && productName.length > 35
                ? `${productName.substr(0, 35)}...`
                : productName}
            </p>
            <ReactTooltip
              place="top"
              className="max-w-xs text-black"
              backgroundColor="rgba(229, 231, 235, var(--tw-bg-opacity))"
              textColor="rgba(17, 24, 39, var(--tw-text-opacity))"
            />
          </>
        )}

        {asin && (
          <div>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 mb-1">
              <a href={`https://www.amazon.com/gp/product/${asin}`}>
                ASIN: {asin}
              </a>
            </span>
          </div>
        )}
        {sku && (
          <div>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              SKU: {sku}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductPreview;
