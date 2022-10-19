import React from 'react';

import Chart from 'react-apexcharts';
import { Card, CardBody, CardHeader } from 'reactstrap';

const ProfitTrend = ({ trendAnalysis }) => {
  const {
    categories,
    group,
    sales: salesArray,
    costs: costsArray,
    profits: profitsArray,
  } = trendAnalysis;

  let sales = [];
  let costs = [];
  let profits = [];

  if (salesArray !== undefined) {
    sales = salesArray.map((a) => a.amount);
  }
  if (costsArray !== undefined) {
    costs = costsArray.map((a) => a.amount);
  }
  if (profitsArray !== undefined) {
    profits = profitsArray.map((a) => a.amount);
  }

  return (
    <Card className="flex-fill">
      <CardHeader>Trend Analysis ({group})</CardHeader>
      <CardBody className="py-4">
        <Chart
          options={{
            chart: {
              height: 350,
              type: 'line',
              zoom: {
                enabled: false,
              },
            },
            dataLabels: {
              enabled: false,
            },
            stroke: {
              curve: 'straight',
            },
            // title: {
            //   text: 'Product Trends by Month',
            //   align: 'left',
            // },
            grid: {
              row: {
                colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
                opacity: 0.5,
              },
            },
            xaxis: {
              categories,
            },
          }}
          series={[
            {
              name: 'Sales',
              data: sales,
            },
            {
              name: 'Cost',
              data: costs,
            },
            {
              name: 'Profit',
              data: profits,
            },
          ]}
          type="line"
          height={350}
        />
      </CardBody>
    </Card>
  );
};

export default ProfitTrend;
