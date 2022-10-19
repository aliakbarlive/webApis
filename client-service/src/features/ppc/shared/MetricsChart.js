import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardBody, CardHeader, CardTitle, Input } from 'reactstrap';
import Chart from 'react-apexcharts';
import moment from 'moment';
import _ from 'lodash';

import { selectCampaignType } from '../ppcSlice';
import { useSelector } from 'react-redux';

const MetricsChart = ({ url, selectedDates, profileId }) => {
  const campaignType = useSelector(selectCampaignType);

  const [chartData, setChartData] = useState([]);
  const [chartLabels, setChartLabels] = useState([]);
  const [selectedMetrics, setSelectedMetrics] = useState([
    {
      display: 'Impressions',
      key: 'impressions',
    },
    { display: 'Clicks', key: 'clicks' },
  ]);

  const metrics = [
    { display: 'ACOS', key: 'acos' },
    {
      display: 'Impressions',
      key: 'impressions',
    },
    { display: 'Clicks', key: 'clicks' },
    { display: 'Spend', key: 'cost' },
    {
      display: 'Sales',
      key: campaignType.salesAttr,
    },
    {
      display: 'Orders',
      key: campaignType.ordersAttr,
    },
    { display: 'CPC', key: 'cpc' },
    { display: 'CTR', key: 'ctr' },
    { display: 'CR', key: 'cr' },
  ];
  useEffect(() => {
    const { startDate, endDate } = selectedDates;

    axios
      .get(url, {
        params: {
          startDate: moment(startDate).format('YYYY-MM-DD'),
          endDate: moment(endDate).format('YYYY-MM-DD'),
          attributes: selectedMetrics.map((m) => m.key).join(','),
        },
      })
      .then((res) => {
        let { data } = res.data;
        const daysDiff = moment
          .duration(moment(endDate).diff(moment(startDate)))
          .asDays();

        if (Math.floor(daysDiff) >= data.length) {
          let ref = moment(startDate);
          while (ref.isSameOrBefore(moment(endDate).format('YYYY-MM-DD'))) {
            if (!data.find((r) => r.date == ref.format('YYYY-MM-DD'))) {
              let emptyValue = {
                date: ref.format('YYYY-MM-DD'),
              };
              selectedMetrics.forEach((m) => {
                emptyValue[m.key] = 0;
              });
              data.push(emptyValue);
            }
            ref.add(1, 'd');
          }
        }

        data = _.sortBy(data, 'date');

        const chartData = selectedMetrics.map((m) => {
          return {
            name: m.display,
            type: 'line',
            data: data.map((r) => {
              if (['acos', 'ctr', 'cr'].includes(m.key)) {
                return (parseFloat(r[m.key]) * 100).toFixed(2);
              }
              return r[m.key];
            }),
          };
        });

        setChartData(chartData);

        setChartLabels(data.map((r) => r.date));
      });
  }, [profileId, url, selectedDates, selectedMetrics]);

  const onChangeMetric = (e) => {
    const { id, value } = e.target;
    let newSelectedMetrics = [...selectedMetrics];
    newSelectedMetrics[id] = metrics.find((m) => m.key == value);
    setSelectedMetrics(newSelectedMetrics);
  };

  return (
    <Card>
      <CardHeader className="d-flex justify-content-between">
        <CardTitle className="mb-0">
          {selectedMetrics[0].display} Vs. {selectedMetrics[1].display}
        </CardTitle>
        <div className="d-flex">
          {selectedMetrics.map((sm, i) => {
            return (
              <Input
                key={`metric-selection-${i}`}
                type="select"
                className="ml-2"
                id={i}
                value={sm.key}
                onChange={onChangeMetric}
              >
                {metrics.map((m) => {
                  return (
                    <option key={`${m.key}-metric-${i}`} value={m.key}>
                      {m.display}
                    </option>
                  );
                })}
              </Input>
            );
          })}
        </div>
      </CardHeader>
      <CardBody>
        <div className="chart">
          <Chart
            options={{
              chart: {
                stacked: false,
                toolbar: {
                  show: true,
                  tools: {
                    selection: false,
                    zoom: false,
                    zoomin: false,
                    zoomout: false,
                    pan: false,
                    reset: false,
                  },
                },
              },
              stroke: {
                width: 3,
                curve: 'smooth',
              },
              fill: {
                opacity: [0.85, 0.75],
                gradient: {
                  inverseColors: false,
                  shade: 'light',
                  type: 'vertical',
                  opacityFrom: 0.85,
                  opacityTo: 0.55,
                  stops: [0, 100, 100, 100],
                },
              },
              labels: chartLabels,
              markers: {
                size: 4,
                strokeWidth: 2,
                hover: {
                  size: 7,
                },
              },
              xaxis: {
                type: 'datetime',
                labels: {
                  format: 'dd MMM',
                },
              },
              yaxis: [
                {
                  title: {
                    text: selectedMetrics[0].display,
                  },
                  labels: {
                    formatter: (value) => {
                      return ['acos', 'ctr', 'cr'].includes(
                        selectedMetrics[0].key
                      )
                        ? value
                        : Math.round(value);
                    },
                  },
                },
                {
                  opposite: true,
                  title: {
                    text: selectedMetrics[1].display,
                  },
                  labels: {
                    formatter: (value) => {
                      return ['acos', 'ctr', 'cr'].includes(
                        selectedMetrics[1].key
                      )
                        ? value
                        : Math.round(value);
                    },
                  },
                },
              ],
            }}
            series={chartData}
            type="line"
            height="350"
          />
        </div>
      </CardBody>
    </Card>
  );
};

export default MetricsChart;
