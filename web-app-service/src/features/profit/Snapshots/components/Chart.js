import React from 'react';
import _ from 'lodash';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import graphAttributes from '../data/graph-attributes.json';

const Chart = ({ data, graphType, prevData, showPrev = false }) => {
  let keys = [];
  if (data.length > 0) {
    keys = Object.keys(data[0]).filter((key) => {
      return key !== 'date';
    });
  }

  let prevKeys = [];
  if (prevData && prevData.length > 0 && showPrev === true) {
    prevKeys = Object.keys(prevData[0]).filter((key) => {
      return key !== 'prevDate';
    });
  }

  let combineData = data;
  if (prevData && showPrev === true) {
    combineData = [];
    data.forEach((e1) => {
      prevData.forEach((e2) => {
        if (e1.date === e2.prevDate) {
          const cData = { ...e1, ...e2 };
          combineData.push(cData);
        }
      });
    });
  }

  const getAttr = (key) => {
    const attribute = graphAttributes.filter((attr) => {
      return attr.key === key;
    });
    return attribute.length > 0 ? attribute[0] : { color: 'd12d74' };
  };

  const formatName = (key) => {
    return `${_.startCase(key.replace('Amount', ''))} ${getAttr(key).suffix}`;
  };

  return (
    <>
      {graphType ? (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={combineData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />

            {showPrev ? (
              prevKeys.map((key) => (
                <Bar
                  key={key}
                  dataKey={key}
                  fill={getAttr(key).color}
                  name={formatName(key)}
                />
              ))
            ) : (
              <></>
            )}

            {keys.map((key) => (
              <Bar
                key={key}
                dataKey={key}
                fill={getAttr(key).color}
                name={formatName(key)}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={combineData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />

            {showPrev ? (
              prevKeys.map((key) => (
                <Line
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stroke={getAttr(key).color}
                  name={formatName(key)}
                />
              ))
            ) : (
              <></>
            )}

            {keys.map((key) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke={getAttr(key).color}
                strokeWidth={2}
                activeDot={{ r: 8 }}
                name={formatName(key)}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      )}
    </>
  );
};

export default Chart;
