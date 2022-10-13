import { useDispatch } from 'react-redux';
import { updateAccountMarketplaceAsync } from 'features/accounts/accountsSlice';

const AccountMarketplace = ({ accountId, marketplace }) => {
  const dispatch = useDispatch();

  const onClick = () => {
    if (!marketplace.isDefault) {
      dispatch(
        updateAccountMarketplaceAsync(accountId, marketplace.marketplaceId, {
          isDefault: true,
        })
      );
    }
  };

  return (
    <button
      className="inline-flex items-center px-2.5 py-1 border text-xs font-medium rounded shadow-sm focus:outline-none mr-2 hover:bg-gray-50 border-gray-300 text-gray-700 bg-white"
      title={!marketplace.isDefault ? 'Click to set as default.' : ''}
      onClick={onClick}
    >
      {marketplace.details.countryCode}

      {marketplace.isDefault && (
        <span className="font-normal ml-1 italic">(Default)</span>
      )}
    </button>
  );
};
export default AccountMarketplace;
