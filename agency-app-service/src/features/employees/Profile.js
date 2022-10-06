import React, { useEffect, Fragment } from 'react';
import { Switch, Route } from 'react-router-dom';
import { useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';

import PageHeader from 'components/PageHeader';
import Details from './Profile/Details';
import Client from './Profile/Client';
import { getClients } from './employeesSlice';

const Profile = ({ match, history }) => {
  const dispatch = useDispatch();
  const { url } = match;
  const { id } = useParams();
  const { employee, clients } = useSelector((state) => state.employees);

  const tabs = [
    // {
    //   name: 'Details',
    //   href: `${url}`,
    //   exact: true,
    // },
    {
      name: 'Client',
      href: `${url}/clients`,
    },
  ];

  useEffect(() => {
    dispatch(getClients(id));
  }, []);

  return (
    <Fragment>
      <PageHeader
        title={employee ? `${employee.firstName} ${employee.lastName}` : ''}
        tabs={tabs}
      />

      <Switch>
        {/* <Route
          path={`/employees/profile/${id}`}
          component={() => Details(clients, employee)}
          exact
        /> */}
        <Route
          path={`/employees/profile/${id}/clients`}
          component={() => Client(clients, employee)}
        />
      </Switch>
    </Fragment>
  );
};

export default Profile;
