const InventoryItem = ({ inventory }) => {
  return (
    <>
      <img
        className="w-full p-2 rounded-full col-span-2"
        src={inventory.Listing.thumbnail}
        alt={inventory.productName}
      />
      <div className="ml-3 col-span-8">
        <p className="text-xs text-gray-700">{inventory.productName}</p>
        <div className="mt-1 flex text-xs text-gray-500">
          <p className="border-r pr-1">ASIN: {inventory.asin}</p>
          <p className="ml-1">SKU: {inventory.sellerSku}</p>
        </div>
      </div>
    </>
  );
};

export default InventoryItem;
