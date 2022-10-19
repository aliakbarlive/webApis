import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';

import {
  getNotificationsAsync,
  selectNotificationList,
} from './notificationSlice';

import {
  selectCurrentAccount,
  selectCurrentMarketplace,
} from '../auth/accountSlice';

import NotificationModal from './NotificationModal';
import { startCase, camelCase } from 'lodash';

import {
  Row,
  Col,
  Card,
  CardBody,
  CardFooter,
  Container,
  ListGroup,
  ListGroupItem,
  ListGroupItemHeading,
  ListGroupItemText,
  Pagination,
  PaginationItem,
  PaginationLink,
} from 'reactstrap';

const Notification = () => {
  const list = useSelector(selectNotificationList);
  const currentAccount = useSelector(selectCurrentAccount);
  const currentMarketplace = useSelector(selectCurrentMarketplace);

  const dispatch = useDispatch();

  const [params, setParams] = useState({
    page: 1,
    pageSize: 10,
    'sort[createdAt]': 'DESC',
  });

  const [modalVisible, setModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  const [currentNotif, setCurrentNotif] = useState(null);

  useEffect(() => {
    dispatch(getNotificationsAsync(params));
  }, [currentAccount, currentMarketplace, params]);

  const onNotificationClick = async (notification) => {
    const response = await axios.get(
      `/notifications/${notification.notificationId}`
    );

    setCurrentNotif(response.data.data);
    toggleModal();
  };

  const goToPreviousPage = (e) => {
    e.preventDefault();
    const newParams = { ...params };
    newParams.page = params.page - 1;
    setParams(newParams);
  };

  const goToNextPage = (e) => {
    e.preventDefault();
    const newParams = { ...params };
    newParams.page = params.page + 1;
    setParams(newParams);
  };

  return (
    <Container fluid className="p-0">
      <NotificationModal
        isOpen={modalVisible}
        toggle={toggleModal}
        notification={currentNotif}
      />

      <Card>
        <CardBody>
          <ListGroup>
            {list.rows.length
              ? list.rows.map((notification) => (
                  <ListGroupItem
                    key={notification.notificationId}
                    tag="button"
                    onClick={() => onNotificationClick(notification)}
                  >
                    <Row>
                      <Col xs="auto" className="d-flex align-items-center">
                        <img
                          src={notification.data.thumbnail}
                          className="avatar rounded"
                        />
                      </Col>
                      <Col>
                        <ListGroupItemHeading className="text-left text-primary">
                          {startCase(camelCase(notification.type))}
                        </ListGroupItemHeading>
                        <ListGroupItemText className="text-left text-dark">
                          {notification.title}
                        </ListGroupItemText>
                      </Col>
                    </Row>
                  </ListGroupItem>
                ))
              : 'No data'}
          </ListGroup>
        </CardBody>

        {list.rows.length ? (
          <CardFooter className="d-flex justify-content-end">
            <Pagination>
              <PaginationItem disabled={list.page == 1}>
                <PaginationLink previous onClick={goToPreviousPage} />
              </PaginationItem>
              <PaginationItem
                disabled={Math.ceil(list.count / list.pageSize) == list.page}
              >
                <PaginationLink next onClick={goToNextPage} />
              </PaginationItem>
            </Pagination>
          </CardFooter>
        ) : (
          ''
        )}
      </Card>
    </Container>
  );
};

export default Notification;
