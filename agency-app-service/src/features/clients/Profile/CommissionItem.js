import Label from 'components/Forms/Label';
import {
  currencyFormatter,
  floatFormatter,
  numberFormatter,
} from 'utils/formatters';
import { PencilIcon } from '@heroicons/react/outline';
import { Fragment } from 'react';
import { userCan } from 'utils/permission';
import { useSelector } from 'react-redux';
import { selectAuthenticatedUser } from 'features/auth/authSlice';

const CommissionItem = ({
  commission,
  marketplace,
  marketplaces,
  showCommissionModal,
}) => {
  const authenticatedUser = useSelector(selectAuthenticatedUser);

  return (
    <div
      className={`sm:col-span-1 flex flex-col justify-start bg-gray-50 rounded-lg p-2 pb-10 relative ${
        commission.commencedAt ? 'bg-green-50' : 'bg-yellow-50'
      }`}
    >
      <b className="uppercase border-b mb-2">
        {commission.type === 'yearlySalesImprovement'
          ? 'Yearly Sales'
          : commission.type}
      </b>
      <span className="flex justify-between">
        <span>Marketplace</span>
        {marketplaces && marketplaces.length > 0 && (
          <b>{marketplace.countryCode}</b>
        )}
      </span>
      {commission.type !== 'tiered' ? (
        <span className="flex justify-between">
          <span>Rate</span>
          <b>%{commission.rate}</b>
        </span>
      ) : (
        <span>
          {commission.rules && (
            <>
              <span>Rules</span>
              <table
                cellPadding="0"
                cellSpacing="0"
                border="1"
                className="border bg-white mb-2 w-full"
              >
                <thead>
                  <tr>
                    <th className="border-b bg-gray-50 px-1">
                      <Label textSize="xs">Min. Gross</Label>
                    </th>
                    <th className="border-b bg-gray-50 px-1">
                      <Label textSize="xs">Max. Gross</Label>
                    </th>
                    <th className="border-b bg-gray-50 px-1">
                      <Label textSize="xs">Rate</Label>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {commission.rules.map((rule, i) => {
                    return (
                      <tr key={i}>
                        <td className="px-3 border-b">
                          {numberFormatter(rule.min)}
                        </td>
                        <td className="px-3 border-b">
                          {rule.max ? numberFormatter(rule.max) : <>&infin;</>}
                        </td>
                        <td className="px-3 border-b font-bold">
                          {rule.rate}%
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </>
          )}
        </span>
      )}
      {commission.type === 'benchmark' &&
        (!commission.managedAsins || commission.managedAsins.length <= 0) && (
          <span className="flex justify-between">
            <span>Baseline</span>
            <b>{commission.preContractAvgBenchmark}</b>
          </span>
        )}
      {(commission.type === 'rolling' || commission.type === 'benchmark') && (
        <span className="flex justify-between">
          <span>Month Threshold</span>
          <b>{commission.monthThreshold ?? ''}</b>
        </span>
      )}
      <span className="mb-3">
        {commission.managedAsins && commission.managedAsins.length > 0 && (
          <div className="flex flex-col">
            <span>Managed Asins</span>
            <p
              className={`border-t border-l border-r bg-white ${
                commission.type === 'benchmark'
                  ? 'grid grid-cols-2'
                  : 'flex flex-col'
              }
              `}
            >
              {commission.type === 'benchmark' && (
                <>
                  <label className="text-xs col-span-1 bg-gray-50 p-1 font-medium text-gray-500">
                    ASIN
                  </label>
                  <label className="text-xs col-span-1 bg-gray-50 p-1 font-medium text-gray-500">
                    Baseline
                  </label>
                </>
              )}
              {commission.managedAsins.map((ma, i) => {
                return (
                  <Fragment key={i}>
                    <span className="text-sm col-span-1 px-1 border-b">
                      {ma.asin}
                    </span>
                    {commission.type === 'benchmark' && (
                      <span className="text-sm col-span-1 px-1 border-b">
                        {floatFormatter(ma.baseline)}
                      </span>
                    )}
                  </Fragment>
                );
              })}
            </p>
          </div>
        )}
      </span>
      <span className="border-t mt-4 p-2 absolute bottom-0 left-0 w-full">
        <span
          className={`text-xs
            ${commission.commencedAt ? 'text-green-500' : 'text-yellow-500'}
          `}
        >
          <b>{commission.commencedAt ? 'Auto-added ' : 'Not auto-added '}</b>
          to a pending invoice
        </span>
      </span>
      {userCan(authenticatedUser, 'clients.commission.update') && (
        <span className="absolute right-2 top-2 ">
          <button
            type="button"
            className="hover:text-red-700"
            onClick={() => showCommissionModal(commission, 'edit')}
          >
            <PencilIcon className="w-4 h-4" />
          </button>
        </span>
      )}
    </div>
  );
};

export default CommissionItem;
