import { useState } from 'react';
import {
  XAxis,
  YAxis,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
  Bar,
  BarChart,
} from 'recharts';

const GranularChart = ({ data, stats, visibleStats, setVisibleStats }) => {
  const chartStyle = {
    fontSize: '0.65rem',
  };

  return (
    <div className="mt-4">
      <div className="w-full h-56">
        <ResponsiveContainer className="w-full" height="100%">
          <BarChart
            className="w-full"
            data={data.map((d) => {
              return {
                ...d,
                acos: d.acos * 100,
                ctr: d.ctr * 100,
                cr: d.cr * 100,
                tacos: d.tacos * 100,
                roas: d.roas * 100,
              };
            })}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" style={chartStyle} />
            <YAxis yAxisId="left" style={chartStyle} />
            <YAxis yAxisId="right" orientation="right" style={chartStyle} />

            <Legend
              iconSize={14}
              wrapperStyle={{ fontSize: '12px', marginTop: '4rem' }}
            />

            {stats
              .filter((stat) => visibleStats.includes(stat.key))
              .map((stat) => (
                <Bar
                  yAxisId={stat.axis}
                  key={stat.key}
                  dataKey={stat.key}
                  fill={stat.color}
                />
              ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default GranularChart;
