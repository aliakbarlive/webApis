import { numberFormatter, percentageFormatter } from 'utils/formatters';
import './funnel.scss';

const Funnel = ({ data }) => {
  return (
    <div className="p-6 border border-gray-300 bg-white shadow hover:shadow-xl rounded-xl">
      <div className="flex justify-between items-center mb-16">
        <p className="text-sm xl:text-md leading-6 font-medium text-gray-700">
          PPC Funnel
        </p>
      </div>

      <div className="grid grid-cols-5 justify-center my-8">
        <div className="col-span-2">
          <div className="mt-6 xl:mt-8 2xl:mt-10 ml-8">
            {[
              { label: 'Impressions', color: '#fb3767' },
              { label: 'Clicked Through Rate', color: '#ff89a6' },
              { label: 'Clicks', color: '#002f5d' },
              { label: 'Conversion Rate', color: '#1879d8' },
              { label: 'PPC Orders', color: '#00ba88' },
            ].map((x) => (
              <p
                key={x.label}
                style={{ color: x.color }}
                className="text-xs md:text-sm lg:text-base xl:text-md 2xl:text-lg mb-12"
              >
                {x.label}
              </p>
            ))}
          </div>
        </div>
        <div className="max-w-xl w-full col-span-3">
          <div className="advertising-funnel text-white">
            <div className="trapezoid">
              <span className="text-xl py-2 font-medium">
                {numberFormatter(data.impressions)}
              </span>
            </div>
            <div className="trapezoid">
              <span className="text-xl py-2 font-medium">
                {percentageFormatter(data.ctr)}
              </span>
            </div>
            <div className="trapezoid">
              <span className="text-xl py-2 font-medium">
                {numberFormatter(data.clicks)}
              </span>
            </div>
            <div className="trapezoid">
              <span className="text-xl py-2 font-medium">
                {percentageFormatter(data.cr)}
              </span>
            </div>
            <div className="trapezoid">
              <span className="text-xl py-2 font-medium">
                {numberFormatter(data.orders)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Funnel;
