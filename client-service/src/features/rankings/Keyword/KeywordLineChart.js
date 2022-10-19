import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { connect } from 'react-redux';
import { useSelector } from 'react-redux';
import { selectKeyword } from './keywordSlice';
import { Card, CardBody } from 'reactstrap';
import moment from 'moment';

const KeywordLineChart = () => {
  const keyword = useSelector(selectKeyword);
  const { KeywordRankingRecords } = keyword;

  const [dateLabels, setDateLabels] = useState([]);
  const total = KeywordRankingRecords
    ? KeywordRankingRecords[0].totalRecords
    : 0;
  const rankingRecords = dateLabels.map((rec) => {
    const record = KeywordRankingRecords
      ? KeywordRankingRecords.find((el) => el.createdAt.startsWith(rec))
      : '';
    return record ? record.rankings : total * 1.2; // create and put in the bottom of the charts if no record found for that specific date
  });

  const nDays = 7;
  useEffect(() => {
    const resultDates = [];
    const current = moment();

    // Get last 7 days
    let n = nDays; // Should be based from request
    while (n > 0) {
      resultDates.push(current.format('YYYY-MM-DD'));
      current.subtract(1, 'day');
      n--;
    }
    setDateLabels(resultDates.reverse());
  }, [keyword]);

  const data = {
    labels: dateLabels,
    datasets: [
      {
        label: 'My First Dataset',
        data: rankingRecords,
        fill: true,
        borderColor: 'rgb(75, 192, 192)',
        borderWidth: 2,
      },
    ],
  };

  const options = {
    layout: {
      padding: {
        top: 5,
      },
    },
    maintainAspectRatio: false,
    legend: {
      display: false,
    },
    tooltips: {
      intersect: false,
    },
    hover: {
      intersect: true,
    },
    plugins: {
      filler: {
        propagate: false,
      },
    },
    scales: {
      xAxes: [
        {
          ticks: {
            fontColor: 'rgb(255, 255, 255, 0.7)',
            fontStyle: 600,
          },
          gridLines: {
            color: 'rgb(255, 255, 255, 0.1)',
            zeroLineColor: 'rgb(255, 255, 255, 0.1)',
            lineWidth: 1,
          },
        },
      ],
      yAxes: [
        {
          ticks: {
            fontColor: 'rgb(255, 255, 255, 0.7)',
            fontStyle: 600,
            reverse: true,
            beginAtZero: true,
            max: total,
            precision: 0,
            callback: function (label, index, labels) {
              return label === 0
                ? `Top rank`
                : label === total
                ? ''
                : `rank:${label}`;
            },
          },
          borderDash: [5, 5],
          gridLines: {
            color: 'transparent',
            zeroLineColor: 'rgb(255, 255, 255, 0.1)',
            lineWidth: 1,
          },
        },
      ],
    },
  };

  return (
    <Card className="flex-fill w-100">
      <CardBody className="bg-gradient rounded-lg">
        <div className="chart chart-sm">
          <Line data={data} options={options} />
        </div>
      </CardBody>
    </Card>
  );
};

export default connect((store) => ({
  theme: store.theme.currentTheme,
}))(KeywordLineChart);
