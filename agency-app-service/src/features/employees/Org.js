import React, { useEffect, useState } from 'react';
import PageHeader from 'components/PageHeader';
import OrgTree from 'react-org-tree';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { groupBy } from 'lodash';
import { PlusIcon, PencilIcon } from '@heroicons/react/outline';
import { UserGroupIcon, UserCircleIcon } from '@heroicons/react/solid';

import {
  getGroups,
  selectGroups,
  fetchGroupsByLevel,
  fetchRoles,
} from './employeesSlice';
import Label from 'components/Forms/Label';
import Select from 'components/Forms/Select';
import OrgSlideOver from './OrgSlideOver';
import { selectAuthenticatedUser } from 'features/auth/authSlice';
import classNames from 'utils/classNames';
import { Link } from 'react-router-dom';
import usePermissions from 'hooks/usePermissions';

const Org = ({ tabs }) => {
  const dispatch = useDispatch();
  const groups = useSelector(selectGroups);
  const user = useSelector(selectAuthenticatedUser);
  const { userCan } = usePermissions();
  const { groupsByLevel, roles, types, selectedType } = useSelector(
    (state) => state.employees
  );
  const [selectedSquad, setSelectedSquad] = useState({});
  const [selectedSquadIndex, setSelectedSquadIndex] = useState(0);
  const [params, setParams] = useState({
    type:
      user.role.department ?? selectedType.value
        ? selectedType.value
        : 'operations',
    reload: false,
  });

  const [orgSlideOver, setOrgSlideOver] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState({});
  const [employeesGroupedByRole, setEmployeesGroupedByRole] = useState({});

  useEffect(() => {
    dispatch(getGroups(params));
    axios.get(`/agency/employees/all/${params.type}`).then((response) => {
      let grouped = groupBy(response.data.output, (e) => e.role.name);
      setEmployeesGroupedByRole(grouped);
    });
    dispatch(fetchGroupsByLevel(params));
    dispatch(fetchRoles());
  }, [dispatch, params]);

  useEffect(() => {
    if (groups.length > 0) {
      let groupData = groups[0].Squads[selectedSquadIndex];
      groupData = {
        label: labelFormatter(
          groupData.name,
          groupData.UserGroups,
          groupData.id,
          'red',
          'squad',
          groupData.id
        ),
        expand: true,
        id: groupData.id,
        children: groupData.Pods.map((pod) => {
          return {
            label: labelFormatter(
              pod.name,
              pod.UserGroups,
              pod.id,
              'green',
              'pod',
              groupData.id
            ),
            id: pod.id,
            children: pod.Cells.map((cell) => {
              return {
                label: labelFormatter(
                  cell.name,
                  cell.UserGroups,
                  cell.id,
                  'yellow',
                  'cell',
                  pod.id
                ),
                id: cell.id,
                children: cell.clients.map((client) => {
                  return {
                    id: client.agencyClientId,
                    label: (
                      <Link
                        to={`/clients/profile/${client.agencyClientId}`}
                        className="px-3 w-full text-left text-sm block text-red-500 hover:text-red-800 hover:bg-red-50"
                      >
                        {client.client}
                      </Link>
                    ),
                  };
                }),
              };
            }),
          };
        }),
      };
      setSelectedSquad(groupData);
    } else {
      setSelectedSquad({});
    }
  }, [groups, selectedSquadIndex]);

  const onChangeOrgType = (val) => {
    setSelectedSquadIndex(0);
    setParams({
      ...params,
      type: val,
    });
  };

  const onSelectGroup = (val) => {
    setSelectedGroup(val);
    setOrgSlideOver(true);
  };

  const onReload = () => {
    setParams({
      ...params,
      reload: !params.reload,
    });
  };

  const getAvailableRoles = (level) => {
    return roles
      .filter((r) => {
        return r.groupLevel === level && r.department === params.type;
      })
      .map((r) => r.value);
  };

  const labelFormatter = (name, users, id, color, level, parentId) => {
    return (
      <div className="space-y-2" key={id}>
        <button
          disabled={!userCan('employees.groups.update')}
          onClick={() =>
            onSelectGroup({
              name,
              users,
              id,
              level,
              type: params.type,
              parentId,
            })
          }
          className="w-full"
        >
          <h1
            className={classNames(
              `bg-${color}-50`,
              `text-${color}-500`,
              'text-sm uppercase py-1 flex justify-between px-2 items-center'
            )}
          >
            <span className="flex items-center">
              <UserGroupIcon className="w-4 h-4 inline mr-1 text-gray-400" />
              {name}
            </span>
            {userCan('employees.groups.update') && (
              <PencilIcon
                className={`w-4 h-4 ml-1 inline text-${color}-700 hover:text-${color}-800`}
              />
            )}
          </h1>
        </button>

        {users.map((user) => {
          return getAvailableRoles(level).includes(user.User.role.roleId) ? (
            <div className="flex space-x-1 pl-2">
              <UserCircleIcon className="w-4 h-4 text-gray-400" />
              <div
                key={user.User.firstName}
                className="text-left flex flex-col"
              >
                <span className="capitalize text-sm leading-none">
                  {user.User.firstName} {user.User.lastName}
                </span>
                <span className="capitalize font-light text-xs text-inherit text-red-900">
                  {user.User.role.name}
                </span>
              </div>
            </div>
          ) : (
            ''
          );
        })}
      </div>
    );
  };

  return (
    <div className="">
      <PageHeader title="Organizational Chart" tabs={tabs} />
      <div className="flex justify-end">
        <div className="px-4">
          <Label htmlFor="org" classes="mt-2">
            Type
          </Label>
          <span className="text-gray-900">
            <Select
              id="org"
              label="Type"
              value={params.type}
              onChange={(e) => onChangeOrgType(e.target.value)}
            >
              {types.map((type, i) => (
                <option key={i} value={type.value}>
                  {type.label}
                </option>
              ))}
            </Select>
          </span>
        </div>
        <div className="px-4">
          <Label htmlFor="org" classes="mt-2">
            Squad
          </Label>
          <span className="text-gray-900">
            <Select
              id="squad"
              label="Squad"
              value={selectedSquadIndex}
              onChange={(e) => setSelectedSquadIndex(e.target.value)}
            >
              {groups.length > 0
                ? groups[0].Squads.map((squad, i) => (
                    <option key={i} value={i}>
                      {squad.name}
                    </option>
                  ))
                : ''}
            </Select>
          </span>
        </div>
        {userCan('employees.groups.update') && (
          <div className="col-span-1 pt-5">
            <button
              onClick={() =>
                onSelectGroup({
                  name: '',
                  level: 'add squad',
                  type: params.type,
                })
              }
              className="bg-red-500 hover:bg-red-700 rounded-lg text-white py-2 px-4"
            >
              <PlusIcon className="w-4 h-4 inline mr-2" /> Add Squad
            </button>
          </div>
        )}
      </div>

      <OrgSlideOver
        open={orgSlideOver}
        setOpen={setOrgSlideOver}
        selectedGroup={selectedGroup}
        employeesGroupedByRole={employeesGroupedByRole}
        groupsByLevel={groupsByLevel}
        onReload={onReload}
      />

      {selectedSquad && (
        <div className="text-left">
          <OrgTree
            data={selectedSquad}
            collapsable={true}
            horizontal={true}
            expandAll={true}
            labelWidth={250}
            labelClassName="org-employees"
          />
        </div>
      )}
    </div>
  );
};
export default Org;
