import { percentageFormatter } from 'utils/formatters';
import { useEffect, useState } from 'react';

const CampaignSummary = ({ data = {} }) => {

  useEffect(() => {
    console.log("campaignsummary ", data)
  }, []);

  const getSalesPercentage = (sales, totalSales) =>
    totalSales ? sales / totalSales : 0;

  const getPercentCircle = (percentage) => {
    return (
      <div
        className="w-5 h-5 rounded-full flex justify-center items-center"
        style={{
          background:
            percentage == 0
              ? '#fecaca'
              : percentage == 100
              ? '#f87171'
              : `conic-gradient(#f87171 ${percentage * 100}%, #fecaca 0)`,
        }}
      >
        <div className="w-3 h-3 rounded-full bg-white"></div>
      </div>
    );
  };

  return (
    <div className="font-body w-full break-after-always pagebreak h-screen">
      <div className="h-1/6 flex flex-col justify-center">
        <p className="text-sm ml-16 font-extrabold">
          PPC Performance Report
        </p>
        <p className="ml-14 font-black mt-1" style={{fontSize: '34px', lineHeight: '60px'}}>
          Campaigns Summary
        </p>
      </div>

      <div className="ring-1 ring-black ring-opacity-5 h-4/6 w-11/12 mx-auto mt-2">
        <table
          className="min-w-full h-full divide-y divide-gray-30 table-fix"
          style={{ fontSize: '12px' }}
        >
          <thead className="bg-gray-100">
            <tr className="divide-x divide-gray-200 border-b">
              <th
                scope="col"
                colSpan={6}
                className="py-3.5 pl-4 pr-4 text-center font-extrabold text-sm"
              >
                {data.total.count} Active Campaigns
              </th>
            </tr>
            <tr className="divide-x divide-gray-200 bg-black text-sm">
              <th
                scope="col"
                className="py-3.5 pl-4 pr-4 text-center font-bold text-white"
              >
                Campaign Type
              </th>
              <th
                scope="col"
                className="py-3.5 pl-4 pr-4 text-center font-bold text-white"
              >
                # of campaigns
              </th>
              <th
                scope="col"
                className="py-3.5 pl-4 pr-4 text-center font-bold text-white"
              >
                Sales %
              </th>
              <th
                scope="col"
                className="py-3.5 pl-4 pr-4 text-center font-bold text-white"
              >
                Targeting Type
              </th>
              <th
                scope="col"
                className="py-3.5 pl-4 pr-4 text-center font-bold text-white"
              >
                # of campaigns
              </th>
              <th
                scope="col"
                className="py-3.5 pl-4 pr-4 text-center font-bold text-white"
              >
                Sales %
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            <tr className="divide-x divide-gray-200">
              <td className="whitespace-nowrap text-center py-3.5 px-2 text-white bg-custom-pink">
                <div className="flex justify-center items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                    />
                  </svg>
                  <p className="ml-1 text-sm font-light">
                    Sponsored <br />
                    Products
                  </p>
                </div>
              </td>
              <td className="whitespace-nowrap text-center py-3.5 px-2 text-sm">
                {data.sp.count}
              </td>
              <td className="whitespace-nowrap text-center py-3.5 px-2">
                <div className="flex justify-evenly item-center text-sm">
                  {/* {getPercentCircle(
                    getSalesPercentage(data.sp.sales, data.total.sales)
                  )} */}
                  {percentageFormatter(
                    getSalesPercentage(data.sp.sales, data.total.sales)
                  )}
                </div>
              </td>
              <td className="whitespace-nowrap text-center py-3.5 px-2 text-sm">
                Automatic
              </td>
              <td className="whitespace-nowrap text-center py-3.5 px-2 text-sm">
                {data.auto.count}
              </td>
              <td className="whitespace-nowrap text-center py-3.5 px-2">
                <div className="flex justify-evenly item-center text-sm">
                  {/* {getPercentCircle(
                    getSalesPercentage(data.auto.sales, data.total.sales)
                  )} */}
                  {percentageFormatter(
                    getSalesPercentage(data.auto.sales, data.total.sales)
                  )}
                </div>
              </td>
            </tr>
            <tr className="divide-x divide-gray-200 text-sm">
              <td className="whitespace-nowrap text-center py-3.5 px-2 bg-custom-pink text-white">
                <div className="flex justify-center items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-12 w-12"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9"
                    />
                  </svg>
                  <p className="ml-1 text-sm font-light">
                    Sponsored <br /> Brands
                  </p>
                </div>
              </td>
              <td className="whitespace-nowrap text-center py-3.5 px-2">
                {data.sb.count}
              </td>
              <td className="whitespace-nowrap text-center py-3.5 px-2">
                <div className="flex justify-evenly item-center">
                  {/* {getPercentCircle(
                    getSalesPercentage(data.sb.sales, data.total.sales)
                  )} */}
                  {percentageFormatter(
                    getSalesPercentage(data.sb.sales, data.total.sales)
                  )}
                </div>
              </td>
              <td className="whitespace-nowrap text-center py-3.5 px-2">
                Manual
              </td>
              <td className="whitespace-nowrap text-center py-3.5 px-2">
                {data.manual.count}
              </td>
              <td className="whitespace-nowrap text-center py-3.5 px-2">
                <div className="flex justify-evenly item-center">
                  {/* {getPercentCircle(
                    getSalesPercentage(data.manual.sales, data.total.sales)
                  )} */}
                  {percentageFormatter(
                    getSalesPercentage(data.manual.sales, data.total.sales)
                  )}
                </div>
              </td>
            </tr>
            <tr className="divide-x divide-gray-200 text-sm">
              <td className="whitespace-nowrap text-center text-white py-3.5 px-2 bg-custom-pink">
                <div className="flex justify-center items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                    />
                  </svg>
                  <p className="ml-1 text-sm font-light">
                    Sponsored <br /> Display
                  </p>
                </div>
              </td>
              <td className="whitespace-nowrap text-center py-3.5 px-2">
                {data.sd.count}
              </td>
              <td className="whitespace-nowrap text-center py-3.5 px-2">
                <div className="flex justify-evenly item-center">
                  {/* {getPercentCircle(
                    getSalesPercentage(data.sd.sales, data.total.sales)
                  )} */}
                  {percentageFormatter(
                    getSalesPercentage(data.sd.sales, data.total.sales)
                  )}
                </div>
              </td>
              <td className="whitespace-nowrap text-center py-3.5 px-2"></td>
              <td className="whitespace-nowrap text-center py-3.5 px-2"></td>
              <td className="whitespace-nowrap text-center py-3.5 px-2"></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CampaignSummary;
