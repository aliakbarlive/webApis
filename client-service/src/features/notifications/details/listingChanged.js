import React from 'react';
import parse from 'html-react-parser';

import { Row, Col, Container } from 'reactstrap';

const ValueDisplay = ({ dataType, value }) => {
  switch (dataType) {
    case 'categories':
      return (
        <>
          <ul className="mt-2">
            {value.map((value, index) => {
              return (
                <li key={index}>
                  <a href={value.link} target="_blank">
                    {value.name}
                  </a>
                </li>
              );
            })}
          </ul>
        </>
      );
      break;
    case 'keywords':
    case 'featureBullets':
      value = Array.isArray(value) ? value : value.split(',');
      return (
        <>
          <ul className="mt-2">
            {value.map((value, index) => {
              return <li key={index}>{value}</li>;
            })}
          </ul>
        </>
      );
      break;
    case 'listingImages':
      return (
        <Container fluid className="p-0">
          <Row className="mx-0">
            {value.map((value, index) => {
              return (
                <Col className="p-0 mb-2" md="3" key={index}>
                  <a href={value.link} target="_blank">
                    <img
                      className="avatar rounded"
                      src={value.link}
                      alter={value.variant}
                      title={value.variant}
                    />
                  </a>
                </Col>
              );
            })}
          </Row>
        </Container>
      );
      break;
    case 'description':
      return parse(value);
      break;
    case 'link':
      return (
        <a href={value} target="_blank">
          {value}
        </a>
      );
      break;
    default:
      return value;
      break;
  }
};

const ListingChanged = ({ notification }) => {
  return (
    <Row className="mb-4">
      <Col>
        <div className="p-2 bg-light rounded">
          <div className="border-bottom pb-2 text-primary">
            <strong>Before</strong>
          </div>
          <div className="mt-2">
            <ValueDisplay
              dataType={notification.data.listingChanges.dataType}
              value={notification.data.listingChanges.data.oldVal}
            />
          </div>
        </div>
      </Col>
      <Col>
        <div className="p-2 bg-light rounded">
          <div className="border-bottom pb-2 text-primary">
            <strong>After</strong>
          </div>
          <div className="mt-2">
            <ValueDisplay
              dataType={notification.data.listingChanges.dataType}
              value={notification.data.listingChanges.data.newVal}
            />
          </div>
        </div>
      </Col>
    </Row>
  );
};

export default ListingChanged;
