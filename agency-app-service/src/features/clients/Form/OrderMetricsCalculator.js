import InputOverlappedLabel from 'components/Forms/InputOverlappedLabel';
import moment from 'moment';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Button from 'components/Button';
import classNames from 'utils/classNames';
import { numberFormatter } from 'utils/formatters';
import ButtonLink from 'components/ButtonLink';
import BsPopover from 'components/BsPopover';
import { CalculatorIcon } from '@heroicons/react/solid';
import { Popover } from '@headlessui/react';

const OrderMetricsCalculator = ({
  data,
  account,
  setCalculatedValue,
  asin,
  index,
}) => {
  const [computed, setComputed] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [computing, setComputing] = useState(false);
  const [benchmark, setBenchmark] = useState(0);

  useEffect(() => {
    setStartDate(
      moment(account.subscription?.activatedAt)
        .clone()
        .subtract(data.monthThreshold, 'months')
        .startOf('month')
        .format('YYYY-MM-DD')
    );

    setEndDate(
      moment(account.subscription?.activatedAt)
        .clone()
        .subtract(1, 'month')
        .endOf('month')
        .format('YYYY-MM-DD')
    );
  }, [data.monthThreshold]);

  const getMetrics = async () => {
    setComputing(true);
    let op = asin
      ? {
          accountId: account.accountId,
          marketplaceId: data.marketplaceId,
          startDate,
          endDate,
          asin,
        }
      : {
          accountId: account.accountId,
          marketplaceId: data.marketplaceId,
          startDate,
          endDate,
        };

    const output = await axios.post('/agency/commission/metrics', op);
    setComputed(output.data.output);
    setBenchmark(
      parseFloat(output.data.output.totalSales.amount) / data.monthThreshold
    );
    setComputing(false);
  };

  const apply = () => {
    if (asin) {
      setCalculatedValue(benchmark.toFixed(2), index);
    } else {
      setCalculatedValue(benchmark.toFixed(2));
    }
  };

  return (
    <BsPopover
      title={
        <span className="px-1 inline-flex items-center border rounded-xl text-sm font-sans font-normal text-white bg-gray-600 hover:bg-red-500">
          <CalculatorIcon className="w-6 h-6" />
        </span>
      }
    >
      <div className="absolute bg-white shadow-lg border p-2 rounded-lg w-96 divide-y-2 z-10 right-0 bottom-5">
        <div>
          <div className="text-xs mb-3 flex justify-between text-yellow-500">
            <span className="text-red-500 font-medium">{asin ?? ' '}</span>
            <div>
              <b>Baseline</b> = Total {asin ? 'ASIN' : ''} Sales / Month
              Threshold
            </div>
          </div>
          <div className="flex space-x-4">
            <div
              className={classNames(
                !computing && computed ? 'w-1/2' : 'w-full',
                'space-y-4'
              )}
            >
              <InputOverlappedLabel
                label="Start Date"
                name="startdate"
                placeholder="YYYY-MM-DD"
                value={startDate}
                required={true}
                onChange={(e) => setStartDate(e.target.value)}
              />
              <InputOverlappedLabel
                label="End Date"
                name="enddate"
                placeholder="YYYY-MM-DD"
                value={endDate}
                required={true}
                onChange={(e) => setEndDate(e.target.value)}
              />
              <Button
                loading={computing}
                showLoading={true}
                onClick={getMetrics}
                textSize="xs"
                px={2}
                py={1}
              >
                Compute
              </Button>
              <Button textSize="xs" px={2} py={1} color="gray" classes="ml-1">
                <Popover.Button className="font-medium">Close</Popover.Button>
              </Button>
            </div>
            {!computing && computed && (
              <div className="text-xs flex flex-col w-1/2">
                <dl className="text-gray-500 flex justify-between">
                  <dt>Order Count:</dt>
                  <dd className="text-gray-800">{computed.orderCount}</dd>
                </dl>
                <dl className="text-gray-500 flex justify-between">
                  <dt>Total Sales ({computed.totalSales.currencyCode}):</dt>
                  <dd className="text-gray-800">
                    {numberFormatter(computed.totalSales.amount)}
                  </dd>
                </dl>
                <dl className="text-gray-500 flex justify-between mb-1">
                  <dt>Month Threshold:</dt>
                  <dd className="text-gray-800">{data.monthThreshold}</dd>
                </dl>
                <hr />
                <dl className="text-gray-500 flex justify-between mt-1 flex-grow">
                  <dt>Benchmark ({computed.totalSales.currencyCode}):</dt>
                  <dd className="text-green-800 font-medium">
                    {numberFormatter(benchmark)}
                  </dd>
                </dl>
                <span className="text-right mt-2">
                  <ButtonLink color="white" onClick={apply}>
                    <Popover.Button className="bg-green-500 hover:bg-green-700 text-xs py-1 px-2 rounded-md">
                      Apply
                    </Popover.Button>
                  </ButtonLink>
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </BsPopover>
  );
};
export default OrderMetricsCalculator;
