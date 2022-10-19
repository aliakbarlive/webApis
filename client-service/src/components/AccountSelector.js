import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  selectCurrentAccount,
  setCurrentAccount,
  selectCurrentMarketplace,
  setCurrentMarketplace,
} from 'features/auth/accountSlice';

import { Link } from 'react-router-dom';
import {
  Dropdown,
  DropdownMenu,
  DropdownToggle,
  Collapse,
  Button,
  DropdownItem,
} from 'reactstrap';

import usFlag from '../assets/img/flags/us.png';
import esFlag from '../assets/img/flags/es.png';
import deFlag from '../assets/img/flags/de.png';
import nlFlag from '../assets/img/flags/nl.png';
import mxFlag from '../assets/img/flags/mx.png';
import caFlag from '../assets/img/flags/ca.png';
import { ShoppingBag, CheckCircle } from 'react-feather';

const chooseFlag = (countryCode) => {
  let flag = usFlag;
  switch (countryCode) {
    case 'CA':
      flag = caFlag;
      break;
    case 'MX':
      flag = mxFlag;
    case 'ES':
      flag = esFlag;
    case 'DE':
      flag = deFlag;
    case 'NL':
      flag = nlFlag;
    default:
      break;
  }
  return flag;
};

const Account = ({
  account,
  isActive,
  currentMarketplace,
  onSelectMarketplace,
}) => {
  const [isOpen, setIsOpen] = useState(true);

  const toggle = () => setIsOpen(!isOpen);

  return (
    <div className="rounded border p-2 mt-2">
      <div className="mt-1" style={{ cursor: 'pointer' }} onClick={toggle}>
        <ShoppingBag /> <span>{account.name}</span>
      </div>
      <Collapse isOpen={isOpen}>
        <hr />
        {account.marketplaces.map((marketplace) => (
          <div
            key={marketplace.marketplaceId}
            className="ml-2 my-2"
            style={{ cursor: 'pointer' }}
            onClick={() => onSelectMarketplace(account, marketplace)}
          >
            <img
              key={`${marketplace.marketplaceId}-img`}
              src={chooseFlag(marketplace.countryCode)}
              alt={marketplace.name}
              width="20"
              className="align-middle mr-3"
            />
            <span key={`${marketplace.marketplaceId}-name`}>
              {marketplace.name}
            </span>
            <CheckCircle
              width="20"
              color="green"
              className={`float-right mr-2 ${
                isActive &&
                marketplace.marketplaceId == currentMarketplace.marketplaceId
                  ? 'visible'
                  : 'invisible'
              }`}
            />
          </div>
        ))}
      </Collapse>
    </div>
  );
};

const AccountSelector = ({ accounts }) => {
  const currentAccount = useSelector(selectCurrentAccount);
  const currentMarketplace = useSelector(selectCurrentMarketplace);
  const dispatch = useDispatch();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggleDropdown = () => setDropdownOpen((prevState) => !prevState);
  const onSelectMarketplace = (account, marketplace) => {
    if (
      currentAccount.accountId != account.accountId ||
      currentMarketplace.marketplaceId != marketplace.marketplaceId
    ) {
      dispatch(setCurrentAccount(account));
      dispatch(setCurrentMarketplace(marketplace));
      setDropdownOpen(false);
    }
  };

  return accounts && Array.isArray(accounts) && accounts.length ? (
    <Dropdown
      style={{ margin: '0.5rem 0rem 1rem 0rem' }}
      group
      size="lg"
      isOpen={dropdownOpen}
      toggle={toggleDropdown}
    >
      <DropdownToggle
        color="white"
        caret
        style={{ border: '1px solid rgb(216 216 216)', boxShadow: 'none' }}
      >
        <img
          src={chooseFlag(currentMarketplace.countryCode)}
          alt={currentMarketplace.name}
          width="25"
          className="align-middle mr-3"
        />
        {currentAccount.name}
      </DropdownToggle>
      <DropdownMenu right>
        <DropdownItem header>
          <div className="d-flex align-items-center">
            <h6 className="mr-5 mb-0">Accounts</h6>
            <Link to="/settings/accounts">
              <Button color="primary" size="sm">
                Manage Accounts
              </Button>
            </Link>
          </div>
        </DropdownItem>

        <div className="mx-3">
          {accounts.map((account) => (
            <Account
              account={account}
              key={account.accountId}
              isActive={account.accountId == currentAccount.accountId}
              currentMarketplace={currentMarketplace}
              onSelectMarketplace={onSelectMarketplace}
            />
          ))}
        </div>
      </DropdownMenu>
    </Dropdown>
  ) : null;
};

export default AccountSelector;
