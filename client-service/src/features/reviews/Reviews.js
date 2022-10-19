import React, { useState, useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { getProductReviews, selectProductReviews } from './reviewsSlice';
import { selectCurrentMarketplace } from '../auth/accountSlice';

import {
  Container,
  Spinner,
  Card,
  CardBody,
  Row,
  Col,
  UncontrolledTooltip,
  Badge,
  Button,
} from 'reactstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import StarRatings from 'react-star-ratings';

import ReviewsModal from './ReviewsModal';
import Header from './Header';
import { setProduct } from 'features/product/productSlice';
import SearchBar from './SearchBar';
const Reviews = () => {
  const [page, setPage] = useState(1);
  const [sizePerPage, setSizePerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('title');
  const [sortOrder, setSortOrder] = useState('asc');

  const productReviews = useSelector(selectProductReviews);
  const currentMarketPlace = useSelector(selectCurrentMarketplace);
  const dispatch = useDispatch();

  const [asin, setAsin] = useState(null);
  const [reviewsModal, setReviewsModal] = useState(false);

  useEffect(() => {
    dispatch(
      getProductReviews({ page, sizePerPage, searchTerm, sortField, sortOrder })
    );
  }, [page, sizePerPage, searchTerm, sortField, sortOrder, currentMarketPlace]);

  const onTableChange = (type, { page, sizePerPage, sortField, sortOrder }) => {
    setSortField(sortField);
    setSortOrder(sortOrder);
    setSizePerPage(sizePerPage);
    setPage(page);
  };

  const onReviewsModalToggle = () => {
    setReviewsModal(!reviewsModal);
  };

  const onProductSelect = (asin) => {
    setAsin(asin);
    onReviewsModalToggle();
  };

  const onSearch = (e) => {
    setSearchTerm(e.target.value);

    if (page !== 1) {
      setPage(1);
    }
  };

  const noImageAvailableUrl =
    'https://images-na.ssl-images-amazon.com/images/I/01RmK%2BJ4pJL.gif';

  const productNameFormatter = (
    cell,
    { asin, listingImages, ProductRating }
  ) => (
    <div className="d-flex align-items-center">
      <img
        src={listingImages ? listingImages[0].link : noImageAvailableUrl}
        className="avatar-small rounded mr-3"
      />

      <div>
        <div id={`product-title-tooltip-${asin}`} className="mb-1">
          <Button
            color="link"
            className="p-0"
            onClick={() => onProductSelect(asin)}
          >
            {cell.length > 55 ? `${cell.substr(0, 55)}...` : cell}
          </Button>
        </div>

        <div>
          <UncontrolledTooltip
            placement="top"
            target={`product-title-tooltip-${asin}`}
          >
            {cell}
          </UncontrolledTooltip>
          <Badge className="badge-soft-secondary">
            <a
              className="text-muted"
              target="_blank"
              href={`https://www.amazon.com/gp/product/${asin}`}
            >
              {asin}
            </a>
          </Badge>
        </div>
      </div>
    </div>
  );

  const ratingFormatter = (cell, { Rating }) => (
    <>
      <span>{cell}</span>
      <div>
        <StarRatings
          starDimension="16px"
          starSpacing="1.5px"
          rating={Rating ? parseFloat(Rating.overallRating) : 0}
          starRatedColor="rgb(255,153,0)"
          numberOfStars={5}
          name="rating"
        />
      </div>
    </>
  );

  const columns = [
    {
      dataField: 'title',
      text: 'Product',
      headerStyle: {
        width: '500px',
      },
      sort: true,
      formatter: productNameFormatter,
    },
    {
      dataField: 'Rating.overallRating',
      text: 'Avg Rating',
      headerStyle: {
        width: '125px',
        textAlign: 'center',
      },
      formatter: ratingFormatter,
      style: {
        textAlign: 'center',
      },
    },
    {
      dataField: 'reviewsTotal',
      text: 'Reviews',
      headerStyle: {
        width: '100px',
        textAlign: 'center',
      },
      style: {
        textAlign: 'center',
      },
    },
    {
      dataField: 'Rating.breakdown.one_star.count',
      text: 'One Star',
      headerStyle: {
        width: '100px',
        textAlign: 'center',
      },
      style: {
        textAlign: 'center',
      },
      formatter: (cell) => (cell ? cell : 0),
    },
    {
      dataField: 'Rating.breakdown.two_star.count',
      text: 'Two Star',
      headerStyle: {
        width: '100px',
        textAlign: 'center',
      },
      style: {
        textAlign: 'center',
      },
      formatter: (cell) => (cell ? cell : 0),
    },
    {
      dataField: 'Rating.breakdown.three_star.count',
      text: 'Three Star',
      headerStyle: {
        width: '100px',
        textAlign: 'center',
      },
      style: {
        textAlign: 'center',
      },
      formatter: (cell) => (cell ? cell : 0),
    },
    {
      dataField: 'Rating.breakdown.four_star.count',
      text: 'Four Star',
      headerStyle: {
        width: '100px',
        textAlign: 'center',
      },
      style: {
        textAlign: 'center',
      },
      formatter: (cell) => (cell ? cell : 0),
    },
    {
      dataField: 'Rating.breakdown.five_star.count',
      text: 'Five Star',
      headerStyle: {
        width: '100px',
        textAlign: 'center',
      },
      style: {
        textAlign: 'center',
      },
      formatter: (cell) => (cell ? cell : 0),
    },
  ];

  const defaultSorted = [
    {
      dataField: 'title',
      order: 'asc',
    },
  ];

  return (
    <Container fluid className="p-0">
      {asin && (
        <ReviewsModal
          isOpen={reviewsModal}
          toggle={onReviewsModalToggle}
          asin={asin}
        />
      )}

      <Header title="Reviews" />
      <SearchBar onSearch={onSearch} />
      {productReviews.rows && productReviews.rows.length > 0 ? (
        <Card>
          <CardBody>
            <BootstrapTable
              remote
              keyField="listingId"
              bootstrap4
              wrapperClasses="table-responsive"
              hover
              striped
              bordered={false}
              data={productReviews.rows}
              columns={columns}
              pagination={paginationFactory({
                page,
                sizePerPage,
                totalSize: productReviews.count,
              })}
              onTableChange={onTableChange}
              defaultSorted={defaultSorted}
            />
          </CardBody>
        </Card>
      ) : (
        <span>
          <Spinner color="primary" className="d-flex mx-auto" />
        </span>
      )}
    </Container>
  );
};

export default Reviews;
