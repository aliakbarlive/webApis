import React, { useEffect, useState } from 'react';

import axios from 'axios';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ListGroup,
  ListGroupItem,
} from 'reactstrap';
import StarRatings from 'react-star-ratings';
import Moment from 'react-moment';

import { setProduct } from 'features/product/productSlice';

const ReviewsModal = ({ isOpen, toggle, asin }) => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      if (asin) {
        const res = await axios({
          method: 'post',
          url: '/product/my/reviews',
          data: { asin },
        });

        setReviews(res.data.data);
      }
    };

    fetchReviews();
  }, [asin]);

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="md" centered>
      <ModalHeader toggle={toggle}>
        <h6 class="text-uppercase text-muted mb-2">All Reviews</h6>
        {/* <h3 class="mb-0">{productId}</h3> */}
      </ModalHeader>
      <ModalBody>
        <ListGroup>
          {reviews &&
            reviews.map(({ profileName, body, title, reviewDate, rating }) => (
              <ListGroupItem>
                <h6 className="mb-0">{profileName}</h6>
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
                <h6 className="mt-1">{title}</h6>
                <p>{body}</p>
              </ListGroupItem>
            ))}
        </ListGroup>
      </ModalBody>
    </Modal>
  );
};

export default ReviewsModal;
