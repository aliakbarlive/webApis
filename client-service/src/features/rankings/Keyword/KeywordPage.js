import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectKeyword, getKeywordAsync } from './keywordSlice';

import { ExternalLink } from 'react-feather';
import { useParams } from 'react-router-dom';
import KeywordLineChart from './KeywordLineChart';
// import ProductTable from './ProductTable';

import {
  Card,
  // CardText,
  CardBody,
  CardTitle,
  Badge,
  Button,
  ButtonGroup,
  Container,
  Row,
  Col,
} from 'reactstrap';

const KeywordPage = () => {
  const keyword = useSelector(selectKeyword);
  // const { KeywordRankingRecords } = keyword;
  // const [myProductTable, setMyProductTable] = useState([]);
  const dispatch = useDispatch();
  const { keywordId } = useParams();
  useEffect(() => {
    dispatch(getKeywordAsync(keywordId));
  }, []);

  return (
    <>
      <Container fluid={true}>
        <Row>
          <Col sm="6">
            <Card>
              <CardBody>
                <Container fluid={true}>
                  <Row className="mb-4 mt-4">
                    <Col sm={8}>
                      <h4>Keyword: {keyword.keywordText}</h4>
                    </Col>
                    <Col>
                      <span>Show keyword on amazon</span>
                      <a
                        href={`https://www.amazon.com/s?k=${keyword.keywordText}`}
                        target="_blank"
                      >
                        <ExternalLink
                          size={16}
                          className="align-middle ml-2 mb-1"
                          color="green"
                        />
                      </a>
                    </Col>
                  </Row>
                </Container>
              </CardBody>
            </Card>
          </Col>
          <Col sm="6">
            <Card>
              <CardBody>
                <Container fluid={true}>
                  {keyword.Listing ? (
                    <Row>
                      <Col sm={2}>
                        <img
                          src={
                            keyword.Listing.listingImages
                              ? keyword.Listing.listingImages[0].link
                              : 'https://images-na.ssl-images-amazon.com/images/I/01RmK%2BJ4pJL.gif'
                          }
                          className="avatar-small rounded"
                        />
                      </Col>
                      <Col>
                        <Row>
                          <a href={`/products/${keyword.Listing.asin}`}>
                            {keyword.Listing.title}
                          </a>
                        </Row>
                        <Badge className="mt-2 badge-soft-secondary">
                          <a
                            className="text-muted"
                            target="_blank"
                            href={`https://www.amazon.com/gp/product/${keyword.Listing.asin}`}
                          >
                            {keyword.Listing.asin}
                          </a>
                        </Badge>
                      </Col>
                    </Row>
                  ) : (
                    ''
                  )}
                </Container>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col sm="12">
            <Card>
              <CardBody>
                <CardTitle tag="h4">
                  Keyword ranking:
                  <ButtonGroup>
                    <Button active={true}>1 WEEK</Button>
                    <Button>1 MONTH</Button>
                    <Button>3 MONTHS</Button>
                  </ButtonGroup>
                </CardTitle>

                <Container fluid={true}>
                  {keyword && <KeywordLineChart />}
                </Container>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default KeywordPage;
