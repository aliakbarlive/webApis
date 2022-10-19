import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Popover, PopoverBody, Row, Col } from 'reactstrap';
import { Calendar } from 'react-feather';
import DayPicker, { DateUtils } from 'react-day-picker';
import Moment from 'react-moment';
import moment from 'moment-timezone';

import 'react-day-picker/lib/style.css';
import { setRange, selectDateRange } from './dateSlice';

const DatePicker = () => {
  moment.tz.setDefault('America/Toronto');

  const [popoverOpen, setPopoverOpen] = useState(false);
  const range = useSelector(selectDateRange);
  const { startDate, endDate } = range;
  const dispatch = useDispatch();

  const customDates = [
    {
      display: 'Yesterday',
      value: {
        endDate: moment().subtract(1, 'd').format('YYYY-MM-DD'),
        startDate: moment().subtract(1, 'd').format('YYYY-MM-DD'),
      },
    },
    {
      display: 'Today',
      value: {
        endDate: moment().format('YYYY-MM-DD'),
        startDate: moment().format('YYYY-MM-DD'),
      },
    },
    {
      display: 'Last Week',
      value: {
        endDate: moment().subtract(1, 'w').endOf('week').format('YYYY-MM-DD'),
        startDate: moment()
          .subtract(1, 'w')
          .startOf('week')
          .format('YYYY-MM-DD'),
      },
    },
    {
      display: 'Last 7 days',
      value: {
        endDate: moment().format('YYYY-MM-DD'),
        startDate: moment().subtract(7, 'd').format('YYYY-MM-DD'),
      },
    },
    {
      display: 'Last 30 days',
      value: {
        endDate: moment().format('YYYY-MM-DD'),
        startDate: moment().subtract(30, 'd').format('YYYY-MM-DD'),
      },
    },
    {
      display: 'Month to date',
      value: {
        endDate: moment().format('YYYY-MM-DD'),
        startDate: moment().startOf('month').format('YYYY-MM-DD'),
      },
    },
    {
      display: 'Last Month',
      value: {
        endDate: moment()
          .subtract(1, 'month')
          .endOf('month')
          .format('YYYY-MM-DD'),
        startDate: moment()
          .subtract(1, 'month')
          .startOf('month')
          .format('YYYY-MM-DD'),
      },
    },
    {
      display: 'Year to date',
      value: {
        endDate: moment().format('YYYY-MM-DD'),
        startDate: moment().startOf('year').format('YYYY-MM-DD'),
      },
    },
  ];

  const modifiers = { start: startDate, end: endDate };

  const toggle = () => setPopoverOpen(!popoverOpen);

  const handleDayClick = (day) => {
    const dateRange = DateUtils.addDayToRange(day, {
      from: startDate,
      to: endDate,
    });

    if (dateRange.to && dateRange.from) {
      dispatch(
        setRange({
          endDate: moment(dateRange.to).format('YYYY-MM-DD'),
          startDate: moment(dateRange.from).format('YYYY-MM-DD'),
        })
      );
    }
  };

  return (
    <>
      <Button
        color="light"
        id="popover"
        className="d-flex align-items-center bg-white shadow-lg"
        type="button"
      >
        {moment(startDate).format('ll') === moment(endDate).format('ll') ? (
          <>
            <Moment format="ll" className="mr-2">
              {startDate}
            </Moment>
            <Calendar size="16" />
          </>
        ) : (
          <>
            <Moment format="ll" className="mr-2">
              {startDate}
            </Moment>{' '}
            -{' '}
            <Moment format="ll" className="mr-2 ml-2">
              {endDate}
            </Moment>
            <Calendar size="16" />
          </>
        )}
      </Button>
      <Popover
        placement="bottom"
        className="datepicker"
        isOpen={popoverOpen}
        target="popover"
        toggle={toggle}
      >
        <PopoverBody>
          <Row>
            <Col>
              <DayPicker
                className="selectable"
                numberOfMonths={2}
                selectedDays={[startDate, { from: startDate, to: endDate }]}
                modifiers={modifiers}
                onDayClick={handleDayClick}
              />
            </Col>
          </Row>
          <Row className="mb-4">
            {customDates.map((customDate, index) => {
              return (
                <Col
                  md="3"
                  className={`mb-2 ${(index + 1) % 4 == 0 ? '' : 'pr-0'}`}
                  key={`customDate-${index}`}
                >
                  <Button
                    color="primary"
                    className="btn-block px-0"
                    style={{ fontSize: '0.75rem' }}
                    onClick={() => dispatch(setRange(customDate.value))}
                  >
                    {customDate.display}
                  </Button>
                </Col>
              );
            })}
          </Row>
          {/* <Row className="mb-2">
            <Col className="d-flex justify-content-end">
              <Button color="grey" onClick={toggle} className="mr-2">
                Cancel
              </Button>
              <Button color="primary" onClick={toggle}>
                Set Dates
              </Button>
            </Col>
          </Row> */}
        </PopoverBody>
      </Popover>
    </>
  );
};

export default DatePicker;
