import React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import moment from 'moment';

import { selectCurrentDateRange } from '../../datePicker/datePickerSlice';

const KeywordChart = ({ row, height, width, td }) => {
  const { t } = useTranslation();
  const dateRange = useSelector(selectCurrentDateRange);

  const records = row.records.map((rec) => ({
    ...rec,
    createdAt: moment(rec.createdAt).format('YYYY-MM-DD'),
  }));
  const maxRecord = Math.max(...records.map((el) => el.rankings));
  const minRecord = Math.min(...records.map((el) => el.rankings));

  // Create array of date
  const dateArr = (startDate, endDate) => {
    let dateArray = [];
    let currentDate = startDate;
    while (currentDate <= endDate) {
      dateArray.push(currentDate);
      currentDate = moment(currentDate, 'YYYY-MM-DD')
        .add(1, 'days')
        .format('YYYY-MM-DD');
    }
    return dateArray;
  };

  let data = dateArr(dateRange.startDate, dateRange.endDate).map((rec) => {
    return {
      createdAt: moment(rec, 'YYYY-MM-DD').format('MM-DD'),
      rankings: records.some((el) => el.createdAt === rec)
        ? records.find((el) => el.createdAt === rec).rankings
        : maxRecord * 1.3,
      position: records.some((el) => el.createdAt === rec)
        ? records.find((el) => el.createdAt === rec).position
        : '',
      currentPage: records.some((el) => el.createdAt === rec)
        ? records.find((el) => el.createdAt === rec).currentPage
        : '',
    };
  });

  const chartStyle = {
    fontSize: '0.8rem',
  };

  return (
    <>
      <div className={`h-${height} w-${width} m-2 cursor-pointer`}>
        <ResponsiveContainer width="99%" height={td ? '100%' : 300}>
          <LineChart data={data} cursor="pointer">
            <XAxis dataKey="createdAt" hide={td} />
            <YAxis reversed domain={[minRecord, maxRecord]} hide={td} />
            <Tooltip
              wrapperStyle={chartStyle}
              formatter={function (value, name, props) {
                return value === maxRecord * 1.3
                  ? t('Products.Keywords.NoRecords')
                  : `${value}, page: ${props.payload.currentPage}, position: ${props.payload.position}`;
              }}
            />
            {!td && <CartesianGrid stroke="#eee" strokeDasharray="5 5" />}

            <Line type="monotone" dataKey="rankings" stroke="#f04354" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </>
  );
};

export default KeywordChart;
