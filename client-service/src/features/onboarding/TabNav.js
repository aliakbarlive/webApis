import React from 'react';

import styled from 'styled-components';
import { Nav, NavItem, NavLink } from 'reactstrap';

const S_Nav = styled(Nav)`
  &.nav-tabs {
    display: flex;
    justify-content: space-around;
    margin-bottom: 2.5rem;
    border: none;
    // border-bottom: 0.05rem solid #e3ebf6;
  }

  .nav-item {
    flex: 1 1 0px;
  }

  .nav-link {
    color: #3f4b57;
    text-align: center;
    display: flex;
    flex-direction: column;
    border: none;
    border-bottom: 0.05rem solid #e3ebf6;

    :hover {
      border-bottom: 0.05rem solid red;
    }
  }

  .nav-item .active {
    color: red;
    background: none;
    border-bottom: 0.05rem solid red;
  }
`;

const TabNav = () => {
  return (
    <S_Nav tabs>
      <NavItem>
        <NavLink
          className={classnames({
            active: activeTab === '1',
          })}
          onClick={() => {
            setActiveTab('1');
          }}
        >
          <h5>Step 1</h5>
          <span>Verify Email</span>
        </NavLink>
      </NavItem>
      <NavItem>
        <NavLink
          className={classnames({
            active: activeTab === '2',
          })}
          onClick={() => {
            setActiveTab('2');
          }}
        >
          <h5>Step 2</h5>
          <span>Seller Central</span>
        </NavLink>
      </NavItem>
      <NavItem>
        <NavLink
          className={classnames({
            active: activeTab === '3',
          })}
          onClick={() => {
            setActiveTab('3');
          }}
        >
          <h5>Step 3</h5>
          <span>Finish</span>
        </NavLink>
      </NavItem>
    </S_Nav>
  );
};

export default TabNav;
