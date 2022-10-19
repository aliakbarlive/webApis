import React from 'react';

import styled from 'styled-components';

import { useSelector, useDispatch } from 'react-redux';
import { selectAlerts } from './alertSlice';

import { UncontrolledAlert } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-regular-svg-icons';

const AlertContainer = styled('div')`
  position: fixed;
  width: 500px;
  left: 50%;
  transform: translateX(-50%);
  margin-top: 2rem;
  text-align: center;
  z-index: 9999;
`;

const Alert = () => {
  const alerts = useSelector(selectAlerts);

  return (
    <AlertContainer>
      {alerts
        ? alerts.map(({ id, color, message }) => (
            <UncontrolledAlert
              color={color}
              className="alert-outline-coloured"
              key={id}
            >
              {/* <div className="alert-icon">
                <FontAwesomeIcon icon={faBell} fixedWidth />
              </div> */}
              <div className="alert-message">{message}</div>
            </UncontrolledAlert>
          ))
        : null}
    </AlertContainer>
  );
};

export default Alert;
