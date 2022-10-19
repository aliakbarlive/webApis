import React, { useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { connect } from 'react-redux';

import { Card, CardBody, Row, Col } from 'reactstrap';

const KeywordLineChart = ({ row }) => {
  const { KeywordRankingRecords } = row;
  const latest =
    KeywordRankingRecords.length > 0
      ? KeywordRankingRecords[KeywordRankingRecords.length - 1]
      : { rankings: 0, total_pages: 1 };
  const prevLatest =
    KeywordRankingRecords.length > 1
      ? KeywordRankingRecords[KeywordRankingRecords.length - 2]
      : { rankings: 0, total_pages: 1 };
  const total_pages = !latest.total_pages
    ? 1
    : latest.total_pages > 5
    ? 5
    : latest.total_pages;

  const data = {
    labels: KeywordRankingRecords.map((rec) => `Position: ${rec.rankings}`),
    datasets: [
      {
        label: '',
        fill: true,
        backgroundColor: 'rgb(255, 255, 255, 0.1)',
        borderWidth: 2,
        borderColor: '#fff',
        data: KeywordRankingRecords.map((rec) => rec.rankings),
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
          display: false,
          reverse: true,
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
            stepSize: latest.totalRecords / total_pages,
            beginAtZero: true,
            max: latest.totalRecords,
            precision: 0,
            callback: function (label, index, labels) {
              return label === 0
                ? ''
                : `pg:${Math.round(
                    label / (latest.totalRecords / total_pages)
                  )}`;
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
        <Row className="text-white ">
          <Col>
            <h3 className="text-white mb-0">
              Current rankings:{latest.rankings}
            </h3>
            <p className="fs--1 font-weight-semi-bold">
              Previous rankings:
              <span className="opacity-50">{prevLatest.rankings}</span>
            </p>
          </Col>
          <Col xs="auto" className="d-none d-sm-block"></Col>
        </Row>
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
