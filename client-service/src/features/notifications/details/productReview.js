import React from 'react';
import Moment from 'react-moment';

import { ListGroupItem, Col, ListGroup } from 'reactstrap';
import StarRatings from 'react-star-ratings';

const ProductReview = ({ notification }) => {
  const { profileName, body, title, reviewDate, rating, link, profileLink } =
    notification.data.productReview;
  return (
    <ListGroup>
      <ListGroupItem>
        <a href={profileLink} target="_blank">
          <h6 className="mb-0 text-primary">{profileName}</h6>
        </a>

        <p className="text-muted mb-1">
          <Moment format="lll">{reviewDate}</Moment>
        </p>

        <StarRatings
          starDimension="16px"
          starSpacing="1.5px"
          rating={rating ? parseInt(rating) : 0}
          starRatedColor="rgb(255,153,0)"
          numberOfStars={5}
          name="rating"
        />
        <a href={link} target="_blank">
          <h6 className="mt-4 text-primary">{title}</h6>
        </a>
        <p>{body}</p>
      </ListGroupItem>
    </ListGroup>
  );
};

export default ProductReview;
