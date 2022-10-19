import React, { useState } from 'react';
import {
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Button,
} from 'reactstrap';

const MetricsFilter = ({
  onApplyFilter,
  params,
  additionalMetric = [],
  salesAttribute = 'attributedSales30d',
  ordersAttribute = 'attributedConversions30d',
}) => {
  const [dropdownOpen, setOpen] = useState(false);

  const toggle = () => setOpen(!dropdownOpen);

  const [metrics, setMetrics] = useState([
    ...additionalMetric,
    { display: 'ACOS', key: 'acos', min: '', max: '' },
    {
      display: 'Impressions',
      key: 'impressions',
      min: '',
      max: '',
    },
    { display: 'Clicks', key: 'clicks', min: '', max: '' },
    { display: 'Spend', key: 'cost', min: '', max: '' },
    {
      display: 'Sales',
      key: salesAttribute,
      min: '',
      max: '',
    },
    {
      display: 'Orders',
      key: ordersAttribute,
      min: '',
      max: '',
    },
    { display: 'CPC', key: 'cpc', min: '', max: '' },
    { display: 'CTR', key: 'ctr', min: '', max: '' },
    { display: 'CR', key: 'cr', min: '', max: '' },
  ]);

  const applyFilter = () => {
    let newParams = { ...params, page: 1 };
    let metricsArray = [...metrics];

    metricsArray.forEach((metricFilter) => {
      const minQueryKey = `filter[${metricFilter.key}][gte]`;
      const maxQueryKey = `filter[${metricFilter.key}][lte]`;

      delete newParams[minQueryKey];
      delete newParams[maxQueryKey];

      if (metricFilter.min) {
        newParams[minQueryKey] = queryValue(metricFilter.key, metricFilter.min);
      }

      if (metricFilter.max) {
        newParams[maxQueryKey] = queryValue(metricFilter.key, metricFilter.max);
      }
    });
    onApplyFilter(newParams);
    toggle();
  };

  const queryValue = (attr, value) => {
    if (attr == 'acos' || attr == 'ctr' || attr == 'cr') {
      return parseFloat(value) / 100;
    }
    return parseFloat(value);
  };

  const clearFilters = () => {
    let newMetrics = [...metrics];
    newMetrics.map((metric) => {
      metric.min = '';
      metric.max = '';
      return metric;
    });
    setMetrics(newMetrics);
    applyFilter();
  };

  const updateValue = (e) => {
    const [i, as] = e.target.id.split('-');
    let newMetrics = [...metrics];
    newMetrics[i][as] = e.target.value;
    setMetrics(newMetrics);
  };

  return (
    <ButtonDropdown
      style={{ width: '100%' }}
      isOpen={dropdownOpen}
      toggle={toggle}
    >
      <DropdownToggle color="primary" caret>
        Metrics Filter
      </DropdownToggle>
      <DropdownMenu right>
        {metrics.map((metric, index) => {
          return (
            <DropdownItem header key={index}>
              <div className="container-fluid p-0">
                <div className="row">
                  <div className="col-4">
                    <p>{metric.display}</p>
                  </div>
                  <div className="col-4">
                    <input
                      id={`${index}-min`}
                      style={{ width: '100%' }}
                      type="number"
                      placeholder="min"
                      value={metric.min}
                      onChange={updateValue}
                    ></input>
                  </div>
                  <div className="col-4">
                    <input
                      id={`${index}-max`}
                      style={{ width: '100%' }}
                      type="number"
                      placeholder="max"
                      value={metric.max}
                      onChange={updateValue}
                    ></input>
                  </div>
                </div>
              </div>
            </DropdownItem>
          );
        })}
        <DropdownItem header>
          <div>
            <Button
              type="button"
              color="primary"
              size="sm"
              className="mr-2"
              onClick={applyFilter}
            >
              Apply filters
            </Button>
            <Button
              color="secondary"
              size="sm"
              onClick={clearFilters}
              disabled={!metrics.some((m) => m.min || m.max)}
            >
              Clear filters
            </Button>
          </div>
        </DropdownItem>
      </DropdownMenu>
    </ButtonDropdown>
  );
};

export default MetricsFilter;
