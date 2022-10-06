import moment from 'moment';
import {
  Line,
  XAxis,
  YAxis,
  Legend,
  Bar,
  BarChart,
  LineChart,
  CartesianGrid,
  ResponsiveContainer,
  LabelList,
} from 'recharts';

import { percentageFormatter } from 'utils/formatters';

const MonthlyReportCharts = ({ data }) => {
  const renderCustomizedLabel = (props) => {
    const { x, y } = props;

    return (
      <g style={{ fontSize: '0.6rem', fontWeight: '400' }}>
        <text
          style={{ fontSize: '0.6rem', color: 'rgb(107, 114, 128)' }}
          x={x + 40}
          y={y - 10}
        >
          {percentageFormatter(props.value)}
        </text>
      </g>
    );
  };

  const renderRoasCustomizedLabel = (props) => {
    const { x, y } = props;

    return (
      <g style={{ fontSize: '0.6rem', fontWeight: '400' }}>
        <text
          style={{ fontSize: '0.6rem', color: 'rgb(107, 114, 128)' }}
          x={x}
          y={y - 10}
        >
          {props.value}
        </text>
      </g>
    );
  };

  return (
    <div className="w-full mt-4 px-8">
      <div className="h-36 mx-auto pt-8 overflow-hidden">
        <ResponsiveContainer className="bg-gray-50" height="100%">
          <BarChart
            data={data}
            margin={{ top: 0, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid vertical={false} fill="white" />
            <XAxis
              dataKey="startDate"
              style={{
                fontSize: '0.7rem',
                fontWeight: '500',
              }}
              tickSize={0}
              dy={10}
              tickCount={5}
              axisLine={{ stroke: '#cbd5e1' }}
              tick={{ fontWeight: '500' }}
              tickFormatter={(value) => moment(value).format('MMMM YYYY')}
            />
            <YAxis
              style={{
                fontSize: '0.7rem',
              }}
              stroke="#94a3b8"
              axisLine={{ stroke: '#cbd5e1' }}
              tick={{ fontWeight: '500' }}
              tickFormatter={(value) => percentageFormatter(value)}
            />
            <Legend
              layout="horizontal"
              verticalAlign="top"
              align="right"
              className="text-black"
              wrapperStyle={{
                marginTop: '-30px',
                textTransform: 'uppercase',
              }}
            />

            <Bar dataKey="acos" fill="#ff89a6">
              <LabelList
                dataKey="acos"
                position="top"
                style={{
                  fontWeight: '600',
                  color: '#acacac',
                  fontSize: '0.7rem',
                }}
                content={renderCustomizedLabel}
              />
            </Bar>
            <Bar dataKey="tacos" fill="#4285f4">
              <LabelList
                dataKey="tacos"
                position="top"
                style={{
                  fontWeight: '600',
                  color: '#acacac',
                  fontSize: '0.7rem',
                }}
                content={renderCustomizedLabel}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="h-36 mt-2 mx-auto overflow-hidden">
        <ResponsiveContainer className="w-full bg-gray-50 h-full">
          <LineChart
            data={data}
            margin={{ top: 0, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid vertical={false} fill="white" />
            <XAxis
              dataKey="startDate"
              style={{
                fontSize: '0.7rem',
                fontWeight: '500',
              }}
              scale="point"
              dy={10}
              tickSize={0}
              tickCount={5}
              axisLine={{ stroke: '#cbd5e1' }}
              tick={{ fontWeight: '500' }}
              tickFormatter={(value) => moment(value).format('MMMM YYYY')}
              padding={{ left: 100, right: 100 }}
            />

            <YAxis
              style={{
                fontSize: '0.7rem',
              }}
              stroke="#94a3b8"
              axisLine={{ stroke: '#cbd5e1' }}
              tick={{ fontWeight: '500' }}
            />

            <Legend
              layout="horizontal"
              verticalAlign="top"
              align="right"
              wrapperStyle={{
                paddingBottom: '0.7rem',
                textTransform: 'uppercase',
              }}
            />

            <Line
              dataKey="roas"
              stroke="#ff89a6"
              type="linear"
              strokeWidth={4}
              dot={{ stroke: '#ff89a6', strokeWidth: 5 }}
              isAnimationActive={false}
            >
              <LabelList
                content={renderRoasCustomizedLabel}
                dataKey="roas"
                style={{
                  fontWeight: '600',
                  color: '#acacac',
                  fontSize: '0.7rem',
                  marginBottom: '4px',
                }}
              />
            </Line>
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="h-36 mt-2 mx-auto">
        <ResponsiveContainer className="w-full bg-gray-50 h-full">
          <LineChart
            data={data}
            margin={{ top: 0, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid vertical={false} fill="white" />
            <XAxis
              dataKey="startDate"
              style={{
                fontSize: '0.7rem',
                fontWeight: '500',
              }}
              axisLine={{ stroke: '#cbd5e1' }}
              tick={{ fontWeight: '500' }}
              tickFormatter={(value) => moment(value).format('MMMM YYYY')}
              padding={{ left: 100, right: 100 }}
            />
            <YAxis
              style={{
                fontSize: '0.7rem',
              }}
              stroke="#94a3b8"
              axisLine={{ stroke: '#cbd5e1' }}
              tick={{ fontWeight: '500' }}
              tickFormatter={(value) => percentageFormatter(value)}
            />

            <Legend
              layout="horizontal"
              verticalAlign="top"
              align="right"
              wrapperStyle={{
                paddingBottom: '0.7rem',
                textTransform: 'uppercase',
              }}
              formatter={(value) =>
                value === 'cr' ? 'Paid Conversion' : 'Organic Conversion'
              }
            />
            <Line
              dataKey="cr"
              stroke="#ff89a6"
              type="linear"
              strokeWidth={4}
              dot={{ stroke: '#ff89a6', strokeWidth: 5 }}
              isAnimationActive={false}
            >
              <LabelList
                content={renderCustomizedLabel}
                dataKey="cr"
                // position="top"
                style={{
                  fontWeight: '600',
                  color: '#acacac',
                  fontSize: '0.7rem',
                  marginBottom: '4px',
                }}
              />
            </Line>
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MonthlyReportCharts;
