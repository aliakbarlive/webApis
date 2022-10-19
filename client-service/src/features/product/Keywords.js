import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectKeywordItems,
  getKeywordItemsAsync,
  setProductKeywords,
} from './productKeywordSlice';

import KeywordLineChart from './KeywordLineChart';
import KeywordModal from '../rankings/Keyword/KeywordModal';
import { Line } from 'react-chartjs-2';
import BootstrapTable from 'react-bootstrap-table-next';

import axios from 'axios';

import { ArrowUp, ArrowDown, ArrowRight } from 'react-feather';

import { Nav, NavItem, NavLink, Navbar, Button, CustomInput } from 'reactstrap';

const Keywords = ({ asin }) => {
  const keywordItems = useSelector(selectKeywordItems);
  const [keywordModal, setKeyModal] = useState(false);
  const keywordsList = keywordItems.map((rec) => rec.keywordText);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getKeywordItemsAsync(asin));
  }, []);

  const onKeywordModalToggle = (newRecords, response) => {
    if (newRecords && newRecords.length > 0) {
      const toAdd = newRecords.map((rec) => {
        return {
          keywordText: rec,
          status: 'ACTIVE',
          KeywordRankingRecords: [],
        };
      });
      dispatch(setProductKeywords([...keywordItems, ...toAdd]));
    }
    if (response) {
      console.log(response);
    }
    setKeyModal(!keywordModal);
  };

  const onSwitch = async (oldStatus, index) => {
    const status = oldStatus === 'ACTIVE' ? 'IN-ACTIVE' : 'ACTIVE';
    const res = await axios.post('/keywords/status', {
      status,
      keywordId: keywordItems[index].keywordId,
    });

    console.log(res.data);
    dispatch(
      setProductKeywords(
        keywordItems.map((rec, i) => (index === i ? { ...rec, status } : rec))
      )
    );
  };

  const statusFormatter = (cell, { status, keywordId }, index) => (
    <CustomInput
      type="switch"
      id={keywordId}
      onChange={() => onSwitch(status, index)}
      defaultChecked={status == 'ACTIVE' ? true : false}
      name="customSwitch"
    />
  );

  const rankingFormatter = (cell, { KeywordRankingRecords }) => {
    const latest =
      KeywordRankingRecords.length > 0
        ? KeywordRankingRecords[KeywordRankingRecords.length - 1]
        : { rankings: 0 };
    const prevLatest =
      KeywordRankingRecords.length > 1
        ? KeywordRankingRecords[KeywordRankingRecords.length - 2]
        : { rankings: 0 };
    const diff =
      latest.rankings && prevLatest.rankings
        ? latest.rankings - prevLatest.rankings
        : 0;
    return (
      KeywordRankingRecords && (
        <div>
          <span style={{ color: 'grey', fontSize: '10px' }}>
            pg. {latest.current_page}
          </span>
          &nbsp;&nbsp;
          <span>{latest.rankings}</span>
          {diff > 0 ? (
            <ArrowDown
              size={14}
              className="align-middle mb-2 ml-2"
              color="red"
            />
          ) : diff < 0 ? (
            <ArrowUp
              size={14}
              className="align-middle mb-2 ml-2"
              color="green"
            />
          ) : (
            <ArrowRight
              size={14}
              className="align-middle mb-2 ml-2"
              color="grey"
            />
          )}
          &nbsp;
          <span style={{ color: 'grey', fontSize: '12px' }}>
            {diff > 0 ? diff : diff * -1}
          </span>
        </div>
      )
    );
  };

  const trendFormatter = (cell, { KeywordRankingRecords }) => {
    const data = {
      labels: KeywordRankingRecords.map((rec) => rec.rankings),
      datasets: [
        {
          data: KeywordRankingRecords.map((rec) => rec.rankings),
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
        },
      ],
    };

    const options = {
      responsive: true,
      maintainAspectRatio: true,
      legend: {
        display: false,
      },
      tooltips: {
        callbacks: {
          label: function (tooltipItem) {
            return '';
          },
        },
        displayColors: false,
      },
      scales: {
        xAxes: [
          {
            display: false, //156*58
          },
        ],
        yAxes: [
          {
            display: false,
            ticks: {
              reverse: true,
            },
          },
        ],
      },
    };
    return <Line data={data} options={options} />;
  };

  const expandRow = {
    renderer: (row) => (
      <div>
        <KeywordLineChart row={row} />
      </div>
    ),
  };

  const tableColumns = [
    {
      dataField: 'keywordText',
      text: 'Keyword',
      sort: true,
      headerStyle: {
        width: '350px',
      },
    },
    {
      dataField: 'KeywordRankingRecords',
      text: 'Trend',
      formatter: trendFormatter,
      headerStyle: {
        width: '140px',
      },
    },
    {
      dataField:
        'KeywordRankingRecords[KeywordRankingRecords.length -2].rankings',
      text: '',
      headerStyle: {
        width: '140px',
      },
    },
    {
      dataField:
        'KeywordRankingRecords[KeywordRankingRecords.length -1].rankings',
      text: 'Current Ranking',
      formatter: rankingFormatter,
    },
    {
      dataField: 'status',
      text: 'Status',
      formatter: statusFormatter,
    },
  ];

  return (
    <>
      <Navbar color="light" light expand="md">
        <Nav className="mr-auto" navbar>
          <NavItem>
            <NavLink>More actions</NavLink>
          </NavItem>
        </Nav>
        <Button color="primary" onClick={() => onKeywordModalToggle()}>
          Add Keyword
        </Button>
      </Navbar>
      <KeywordModal
        isOpen={keywordModal}
        toggle={onKeywordModalToggle}
        keywordsList={keywordsList}
        asin={asin}
      />
      {keywordItems && (
        <BootstrapTable
          remote
          bootstrap4
          wrapperClasses="table-responsive"
          hover
          striped
          bordered={false}
          keyField="keywordId"
          data={keywordItems}
          columns={tableColumns}
          expandRow={expandRow}
          // pagination={paginationFactory({
          //   page,
          //   sizePerPage: pageSize,
          //   totalSize: keywordItems.length,
          // })}
          // defaultSorted={defaultSorted}
          // onTableChange={onTableChange}
        />
      )}
    </>
  );
};

export default Keywords;
