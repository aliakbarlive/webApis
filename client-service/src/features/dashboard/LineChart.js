import React from 'react';
import { Line } from 'react-chartjs-2';
import { connect } from 'react-redux';
import { useSelector } from 'react-redux';
import { selectTheme } from 'features/theme/themeSlice';

import { Card, CardBody, Row, Col } from 'reactstrap';
import DatePicker from 'components/datePicker/DatePicker';

const LineChart = () => {
  const theme = useSelector(selectTheme);

  // const ctx = canvas.getContext('2d');
  // const gradientFill = ctx.createLinearGradient(0, 0, 0, 250);

  // gradientFill.addColorStop(0, 'rgba(255, 255, 255, 0.3)');

  // gradientFill.addColorStop(1, 'rgba(255, 255, 255, 0)');

  const data = {
    labels: [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ],
    datasets: [
      {
        label: 'Sales ($)',
        fill: true,
        backgroundColor: 'rgb(255, 255, 255, 0.1)',
        borderWidth: 2,
        borderColor: '#fff',
        data: [
          2015, 1465, 1487, 1796, 1387, 2123, 2866, 2548, 3902, 4938, 3917,
          4927,
        ],
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
          scaleLabel: {
            show: true,
            labelString: 'Month',
          },
          ticks: {
            fontColor: 'rgb(255, 255, 255, 0.7)',
            fontStyle: 600,
          },
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
          },
          display: false,
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
            <h3 className="text-white mb-0">Today $764.39</h3>
            <p className="fs--1 font-weight-semi-bold">
              Yesterday <span className="opacity-50">$684.87</span>
            </p>
          </Col>
          <Col xs="auto" className="d-none d-sm-block">
            <DatePicker />
          </Col>
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
}))(LineChart);
