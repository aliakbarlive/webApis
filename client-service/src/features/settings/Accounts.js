import React, { useEffect, useState } from 'react';

import { Button, Card, CardBody, CardHeader, CardTitle } from 'reactstrap';
import { ShoppingBag, Check, X } from 'react-feather';
import axios from 'axios';

const ServiceAuthorized = ({ service, isAuthorized }) => {
  const IconComponent = isAuthorized ? Check : X;

  return (
    <Button
      color="primary"
      className="btn-sm mr-2"
      outline
      disabled={!isAuthorized}
    >
      <IconComponent size={12} className="mr-1" />
      {service}
    </Button>
  );
};

const Account = ({ account }) => {
  return (
    <div className="d-flex border rounded p-3 mb-3 justify-content-between">
      <div className="d-flex align-items-center">
        <ShoppingBag />
        <div className="ml-3">
          <h4 className="mb-0 text-primary">{account.name}</h4>
          <small>Seller ID: {account.accountId}</small>
        </div>
      </div>
      <div className="d-flex align-items-center">
        <ServiceAuthorized
          service="SP API"
          isAuthorized={account.spApiAuthorized}
        ></ServiceAuthorized>

        <ServiceAuthorized
          service="Advertising API"
          isAuthorized={account.advApiAuthorized}
        ></ServiceAuthorized>
      </div>
    </div>
  );
};

const Accounts = () => {
  const [accounts, setAccounts] = useState([]);
  useEffect(() => {
    axios({
      method: 'GET',
      url: '/auth/me/accounts',
    }).then((res) => {
      setAccounts(res.data.data);
    });
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle tag="h5" className="mb-0">
          Amazon Accounts
        </CardTitle>
      </CardHeader>
      <CardBody>
        {accounts.map((account) => (
          <Account key={account.accountId} account={account} />
        ))}
      </CardBody>
    </Card>
  );
};

export default Accounts;
