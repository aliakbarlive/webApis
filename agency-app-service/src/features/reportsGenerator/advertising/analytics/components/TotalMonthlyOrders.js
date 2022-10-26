import moment from 'moment';
import {
  XAxis,
  YAxis,
  Bar,
  BarChart,
  LabelList,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';
import { numberFormatter, percentageFormatter } from 'utils/formatters';

const TotalMonthlyOrders = ({ data, performance }) => {
  const renderCustomizedLabel = (props) => {
    const { x, y, width, height } = props;

    return (
      <g style={{ paddingTop: '10px' }}>
        <text x={x + width / 2 - 10} y={y + 15}>
          {props.value}
        </text>
      </g>
    );
  };

  return (
    <div className="my-8 px-8">
      <p className="text-xl font-bold text-graay-800 font-body">Total Orders</p>

      <div className="grid grid-cols-2 gap-4 h-36 h-full">
        <ResponsiveContainer height="100%" className="max-w-xl h-full mr-8">
          <BarChart data={data} className="pt-2">
            <CartesianGrid vertical={false} horizontal={false} />
            <XAxis
              dataKey="startDate"
              style={{
                fontSize: '0.7rem',
                fontWeight: '500',
              }}
              tickSize={0}
              tickLine={false}
              axisLine={false}
              dy={12}
              tickCount={0}
              tickFormatter={(value) => moment(value).format('MMMM YYYY')}
            />

            <YAxis tickCount={0} tickLine={false} hide={true} />
            <Bar dataKey="orders" fill="#ff89a6" maxBarSize={100}>
              <LabelList
                content={renderCustomizedLabel}
                dataKey="orders"
                position="center"
                style={{
                  fontWeight: '600',
                  color: '#acacac',
                  fontSize: '0.9rem',
                }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        <div className="flex justify-between items-center font-body">
          <div className="flex flex-col justify-between items-end text-right w-2/4 h-full ">
            <p
              className="text-xs font-semibold ml-6"
              style={{ color: '#fb3767' }}
            >
              Impressions
            </p>
            <p
              className="text-xs font-semibold whitespace-nowrap ml-6"
              style={{ color: '#ff89a6' }}
            >
              Clicked Through Rate
            </p>
            <p className="text-xs font-semibold" style={{ color: '#002f5d' }}>
              Clicks
            </p>
            <p className="text-xs font-semibold" style={{ color: '#1879d8' }}>
              Conversion Rate
            </p>
            <p className="text-xs font-semibold" style={{ color: '#00ba88' }}>
              PPC Orders
            </p>
          </div>
          <div className="flex flex-col justify-center items-center text-right w-2/4 h-full">
            <div className="flex h-1/5 justify-center w-full items-center">
              <div className="trapezoid1 h-full">
                <p className="text-white text-2xl font-normal">
                  {numberFormatter(performance.current.data.impressions)}
                </p>
              </div>
            </div>

            <div className="flex h-1/5 justify-center w-full items-center">
              <div className="trapezoid2 h-full">
                <p className="text-white text-2xl font-normal">
                  {percentageFormatter(performance.current.data.ctr)}
                </p>
              </div>
            </div>
            <div className="flex h-1/5 justify-center w-full items-center">
              <div className="trapezoid3 h-full">
                <p className="text-white text-2xl font-normal">
                  {numberFormatter(performance.current.data.clicks)}
                </p>
              </div>
            </div>
            <div className="flex h-1/5 justify-center w-full items-center">
              <div className="trapezoid4 h-full">
                <p className="text-white text-2xl font-normal">
                  {percentageFormatter(performance.current.data.cr)}
                </p>
              </div>
            </div>
            <div className="flex h-1/5 justify-center w-full items-center">
              <div className="trapezoid5 h-full">
                <p className="text-white text-2xl font-normal">
                  {numberFormatter(performance.current.data.orders)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TotalMonthlyOrders;
