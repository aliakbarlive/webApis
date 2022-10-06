const { percentageFormatter } = require('utils/formatters');

const ActiveCampaigns = ({ data, className }) => {
  return (
    <div
      className={`grid lg:grid-cols-3 bg-red-500 p-4 rounded-md ${className}`}
    >
      <div className="text-white flex items-center mb-4 lg:mb-0">
        <p className="text-base md:text-lg lg:text-xl xl:text-3xl 2xl:text-5xl font-bold">
          {data.total.count}
        </p>
        <p className="ml-2 text-sm md:text-base lg:text-lg xl:xl 2xl:text-2xl">
          Active Campaigns
        </p>
      </div>

      <div className="text-xs lg:text-sm leading-normal text-white w-full border-t lg:border-t-0 border-b lg:border-b-0 py-4 lg:py-0 lg:border-l lg:border-r lg:px-4 mb-4 lg:mb-0">
        <table className="w-full">
          <thead className="font-bold">
            <tr className="">
              <td width="30%" className="pb-2 lg:text-center">
                Type
              </td>
              <td width="30%" className="pb-2 lg:text-center">
                # of campaigns
              </td>
              <td width="30%" className="pb-2 lg:text-center">
                Sales %
              </td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td width="30%" className="lg:text-center">
                SP
              </td>
              <td width="30%" className="lg:text-center">
                {data.sp.count}
              </td>
              <td width="30%" className="lg:text-center">
                {percentageFormatter(
                  data.total.sales ? data.sp.sales / data.total.sales : 0
                )}
              </td>
            </tr>
            <tr>
              <td width="30%" className="lg:text-center">
                SB
              </td>
              <td width="30%" className="lg:text-center">
                {data.sb.count}
              </td>
              <td width="30%" className="lg:text-center">
                {percentageFormatter(
                  data.total.sales ? data.sb.sales / data.total.sales : 0
                )}
              </td>
            </tr>
            <tr>
              <td width="30%" className="lg:text-center">
                SD
              </td>
              <td width="30%" className="lg:text-center">
                {data.sd.count}
              </td>
              <td width="30%" className="lg:text-center">
                {percentageFormatter(
                  data.total.sales ? data.sd.sales / data.total.sales : 0
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="text-xs lg:text-sm leading-normal text-white w-full lg:px-4">
        <table className="w-full">
          <thead className="font-bold">
            <tr>
              <td width="30%" className="pb-2 lg:text-center">
                Targeting Type
              </td>
              <td width="30%" className="pb-2 lg:text-center">
                # of campaigns
              </td>
              <td width="30%" className="pb-2 lg:text-center">
                Sales %
              </td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td width="30%" className="lg:text-center">
                Automatic
              </td>
              <td width="30%" className="lg:text-center">
                {data.auto.count}
              </td>
              <td width="30%" className="lg:text-center">
                {percentageFormatter(
                  data.total.sales ? data.auto.sales / data.total.sales : 0
                )}
              </td>
            </tr>
            <tr>
              <td width="30%" className="lg:text-center">
                Manual
              </td>
              <td width="30%" className="lg:text-center">
                {data.manual.count}
              </td>
              <td width="30%" className="lg:text-center">
                {percentageFormatter(
                  data.total.sales ? data.manual.sales / data.total.sales : 0
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ActiveCampaigns;
