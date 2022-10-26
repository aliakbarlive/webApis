import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XIcon, TrashIcon } from '@heroicons/react/outline';
import { useDispatch, useSelector } from 'react-redux';
import React, { useState, useEffect } from 'react';
import { startCase } from 'lodash';

import { setAlert } from '../alerts/alertsSlice';
import Select from 'components/Forms/Select';
import Input from 'components/Forms/Input';
import ConfirmationModal from 'components/ConfirmationModal';
import {
  updateEmployeeRole,
  removeEmployee,
  sendInvite,
  getGroups,
} from './employeesSlice';
import Label from 'components/Forms/Label';
import Button from 'components/Button';
import ResetPassword from 'features/clients/Profile/details/ResetPassword';
import usePermissions from 'hooks/usePermissions';

const EmployeesSlideOver = ({
  open,
  setOpen,
  row,
  roles,
  employees,
  refresh,
  setRefresh,
  employeeParams,
}) => {
  const dispatch = useDispatch();
  const { groups, types } = useSelector((state) => state.employees);
  const defaultValue = { label: '', value: 0 };
  const [selectedRole, setSelectedRole] = useState(defaultValue);
  const [selectedSquad, setSelectedSquad] = useState(defaultValue);
  const [selectedPod, setSelectedPod] = useState(defaultValue);
  const [selectedCell, setSelectedCell] = useState(defaultValue);
  const [type, setType] = useState({
    value: row ? row.role?.department : 'operations',
    label: row ? row.role?.department.toUpperCase() : 'Operations',
  });
  const [email, setEmail] = useState('');
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
  const [params, setParams] = useState({ type: 'operations' });
  const [filteredRoles, setFilteredRoles] = useState(roles);
  const { isAgencySuperUser, userCan } = usePermissions();

  useEffect(() => {
    if (open) {
      if (row.role) {
        // setType({
        //   value: row.role.department,
        //   label: startCase(row.role.department),
        // });
        const filtered = roles.filter(
          (role) => role.department === row.role.department
        );
        console.log(
          row.role,
          row.role.department,
          filtered,
          filtered.find((role) => role.label === row.role.name)
        );
        setFilteredRoles(filtered);
        setSelectedRole(filtered.find((role) => role.label === row.role.name));
      } else {
        setType({ value: 'operations', label: 'Operations' });
        onChangeType('operations');
      }

      if (row.memberId) {
        const { cell, pod, squad } = row.memberId;

        if (squad) {
          setParams({ type: squad.type });
          setSelectedSquad({ value: squad.squadId, label: squad.name });
        } else {
          setSelectedSquad(defaultValue);
        }

        if (pod) {
          setSelectedPod({ value: pod.podId, label: pod.name });
        } else {
          setSelectedPod(defaultValue);
        }

        if (cell) {
          setSelectedCell({ value: cell.cellId, label: cell.name });
        } else {
          setSelectedCell(defaultValue);
        }
      } else {
        clearUserGroup();
      }

      if (!row.firstName) {
        setSelectedRole({ label: '', value: 0 });
        setEmail('');
      }
    }
  }, [open, row, roles]);

  useEffect(() => {
    dispatch(getGroups(params));
  }, [dispatch, params]);

  const onCancel = (e) => {
    if (e) e.preventDefault();
    setOpen(false);
  };

  const onChangeRole = (roleId) => {
    let role = roles.find((el) => el.value === parseInt(roleId));
    setSelectedSquad(defaultValue);
    setSelectedRole(role);
  };

  const getSelectedSquad = (squadId) => {
    let squad = null;
    if (groups.length > 0) {
      const { Squads } = groups[0];
      squad = Squads.find((e) => e.id === parseInt(squadId));
    }
    return squad;
  };

  const getSelectedPod = (podId) => {
    let pod = null;
    const Squad = getSelectedSquad(selectedSquad.value);
    if (Squad) {
      const { Pods } = Squad;
      if (Pods) {
        pod = Pods.find((e) => e.id === parseInt(podId));
      }
    }
    return pod;
  };

  const getSelectedCell = (cellId) => {
    let cell = null;
    const Pod = getSelectedPod(selectedPod.value);
    if (Pod) {
      const { Cells } = Pod;
      if (Cells) {
        cell = Cells.find((e) => e.id === parseInt(cellId));
      }
    }
    return cell;
  };

  const onChangeType = (type) => {
    setType(type);
    setSelectedRole(defaultValue);
    clearUserGroup();
    setParams({ type });
    setFilteredRoles(roles.filter((role) => role.department === type));
  };

  const onChangeSquad = (squadId) => {
    setSelectedPod(defaultValue); // set default pod
    let squad = defaultValue;
    const sq = getSelectedSquad(squadId);
    if (sq) {
      squad = { value: sq.id, label: sq.name };
    }
    setSelectedSquad(squad);
  };

  const onChangePod = (podId) => {
    setSelectedCell(defaultValue); // set default cell
    let pod = defaultValue;
    const p = getSelectedPod(podId);
    if (p) {
      pod = { value: p.id, label: p.name };
    }
    setSelectedPod(pod);
  };

  const onChangeCell = (cellId) => {
    let cell = defaultValue;
    const c = getSelectedCell(cellId);
    if (c) {
      cell = { value: c.id, label: c.name };
    }
    setSelectedCell(cell);
  };

  const onChangeEmail = (userEmail) => {
    setEmail(userEmail);
  };

  const buildUserGroup = () => {
    const userGroup = {
      type: type.value,
      departmentId: 1,
      squadId: selectedSquad.value !== 0 ? selectedSquad.value : null,
      podId: selectedPod.value !== 0 ? selectedPod.value : null,
      cellId: selectedCell.value !== 0 ? selectedCell.value : null,
    };
    return userGroup;
  };

  const onSave = () => {
    const userGroup = buildUserGroup();
    dispatch(
      updateEmployeeRole(
        row.userId,
        selectedRole,
        employees,
        userGroup,
        employeeParams
      )
    );
    setRefresh(!refresh);
    setOpen(false);
  };

  const onDelete = () => {
    setIsOpenDeleteModal(false);
    setOpen(false);
    dispatch(removeEmployee(row.userId, employees));
  };

  const onSendInvite = () => {
    const userGroup = buildUserGroup();
    if (selectedRole.value === 0) {
      dispatch(setAlert('error', 'Role is required'));
    } else {
      dispatch(sendInvite(selectedRole, email, userGroup)).then((res) => {
        setOpen(!res);
      });
    }
  };

  const showSquadsDropdown = () => {
    if (groups.length > 0) {
      const { Squads } = groups[0];
      if (selectedRole.value !== 0) {
        return (
          <>
            <Label htmlFor="role" classes="mt-2">
              Squad
            </Label>
            <span className="col-span-2 text-gray-900">
              <Select
                id="squad"
                label="squad"
                value={selectedSquad.value}
                onChange={(e) => onChangeSquad(e.target.value)}
              >
                <option value="">Select Squad</option>
                {Squads.map((sq) => {
                  return (
                    <option key={sq.id} value={sq.id}>
                      {startCase(sq.name)}
                    </option>
                  );
                })}
              </Select>
            </span>
          </>
        );
      } else {
        return null;
      }
    }
  };

  const showPodsDropdown = () => {
    if (
      groups.length > 0 &&
      selectedRole.value !== 0 &&
      selectedSquad.value !== 0
    ) {
      const Squad = getSelectedSquad(selectedSquad.value);
      if (Squad) {
        const { Pods } = Squad;
        return (
          <>
            <Label htmlFor="role" classes="mt-2">
              Pod
            </Label>
            <span className="col-span-2 text-gray-900">
              <Select
                id="pod"
                label="pod"
                value={selectedPod.value}
                onChange={(e) => onChangePod(e.target.value)}
              >
                <option value="">Select Pod</option>
                {Pods.map((pod) => {
                  return (
                    <option key={pod.id} value={pod.id}>
                      {startCase(pod.name)}
                    </option>
                  );
                })}
              </Select>
            </span>
          </>
        );
      }
    } else {
      return null;
    }
  };

  const showCellsDropdown = () => {
    if (
      groups.length > 0 &&
      selectedRole.value !== 0 &&
      selectedSquad.value !== 0 &&
      selectedPod.value !== 0
    ) {
      const Pod = getSelectedPod(selectedPod.value);
      if (Pod) {
        const { Cells } = Pod;
        return (
          <>
            <Label htmlFor="role" classes="mt-2">
              Cell
            </Label>
            <span className="col-span-2 text-gray-900">
              <Select
                id="cell"
                label="cell"
                value={selectedCell.value}
                onChange={(e) => onChangeCell(e.target.value)}
              >
                <option value="">Select Cell</option>
                {Cells.map((cell) => {
                  return (
                    <option key={cell.id} value={cell.id}>
                      {startCase(cell.name)}
                    </option>
                  );
                })}
              </Select>
            </span>
          </>
        );
      }
    } else {
      return null;
    }
  };

  const clearUserGroup = () => {
    setSelectedSquad(defaultValue);
    setSelectedPod(defaultValue);
    setSelectedCell(defaultValue);
  };

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        static
        className="fixed inset-0 overflow-hidden z-10"
        open={open}
        onClose={setOpen}
      >
        <div className="absolute inset-0 overflow-hidden">
          <Transition.Child
            as={Fragment}
            enter="ease-in-out duration-500"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in-out duration-500"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>
          <ConfirmationModal
            title="Delete this record?"
            open={isOpenDeleteModal}
            setOpen={setIsOpenDeleteModal}
            onOkClick={() => onDelete()}
            onCancelClick={() => setIsOpenDeleteModal(false)}
            size="sm"
          />

          <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex">
            <Transition.Child
              as={Fragment}
              enter="transform transition ease-in-out duration-500 sm:duration-700"
              enterFrom="translate-x-full"
              enterTo="translate-x-0"
              leave="transform transition ease-in-out duration-500 sm:duration-700"
              leaveFrom="translate-x-0"
              leaveTo="translate-x-full"
            >
              <div className="w-screen max-w-lg">
                <div className="h-full flex flex-col py-6 bg-white shadow-xl overflow-y-scroll">
                  <div className="px-4 sm:px-6">
                    <div className="flex items-start justify-between">
                      <Dialog.Title className="text-lg font-medium text-gray-900">
                        {row.firstName
                          ? 'Employee Information'
                          : 'Invite Employee'}
                      </Dialog.Title>

                      <div className="ml-3 h-7 flex items-center">
                        <button
                          className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                          onClick={() => onCancel()}
                        >
                          <span className="sr-only">Close panel</span>
                          <XIcon className="h-6 w-6" aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="px-4 py-4 sm:px-6">
                    <hr />
                  </div>
                  <div className="px-6 py-6 sm:px-8">
                    <div className="flex flex-col">
                      {row.firstName ? (
                        // Update employee
                        <>
                          <Label>Customer Name</Label>
                          <span className="col-span-2 text-gray-900 mb-2 mx-2">
                            {row.firstName} {row.lastName}
                          </span>
                          <Label>Email</Label>
                          <span className="col-span-2 text-gray-900 mx-2">
                            {row.email}
                          </span>
                        </>
                      ) : (
                        // Invite employee
                        <>
                          <Label htmlFor="role">Email</Label>
                          <span className="col-span-2 text-gray-900">
                            <Input
                              id="role"
                              label="role"
                              type="email"
                              value={email}
                              onChange={(e) => onChangeEmail(e.target.value)}
                            />
                          </span>
                        </>
                      )}
                      <Label htmlFor="type" classes="mt-2">
                        Type
                      </Label>
                      <span className="col-span-2 text-gray-900">
                        <Select
                          id="type"
                          label="type"
                          value={type.value}
                          onChange={(e) => onChangeType(e.target.value)}
                        >
                          {types.map((type) => (
                            <option key={type.value} value={type.value}>
                              {type.label}
                            </option>
                          ))}
                        </Select>
                      </span>
                      <Label htmlFor="role" classes="mt-2">
                        Role
                      </Label>
                      <span className="col-span-2 text-gray-900">
                        <Select
                          id="role"
                          label="role"
                          value={selectedRole.value}
                          onChange={(e) => onChangeRole(e.target.value)}
                        >
                          {[{ label: '', value: 0 }, ...filteredRoles].map(
                            (role) => (
                              <option key={role.value} value={role.value}>
                                {startCase(role.label)}
                              </option>
                            )
                          )}
                        </Select>
                      </span>
                      {/* Squad here */}
                      {showSquadsDropdown()}
                      {/* Pod here */}
                      {showPodsDropdown()}
                      {/* Cell here */}
                      {showCellsDropdown()}
                    </div>
                    <div
                      className={`flex items-start  justify-${
                        row.firstName ? 'between' : 'end'
                      } mt-10`}
                    >
                      {row.firstName && (
                        <>
                          <Button
                            bgColor="white"
                            hoverColor="gray-50"
                            textColor="red-900"
                            onClick={() => setIsOpenDeleteModal(true)}
                            title="Delete"
                          >
                            <TrashIcon className="w-4 h-4 inline mr-2" /> Delete
                          </Button>
                          <Button
                            bgColor="white"
                            hoverColor="gray-50"
                            textColor="red-900"
                            onClick={() => clearUserGroup()}
                            title="Clear"
                          >
                            Clear
                          </Button>
                        </>
                      )}
                      <div>
                        <Button
                          bgColor="gray-50"
                          hoverColor="gray-300"
                          textColor="gray-700"
                          onClick={onCancel}
                        >
                          Cancel
                        </Button>
                        <Button
                          classes="ml-2"
                          onClick={
                            row.firstName
                              ? () => onSave()
                              : () => onSendInvite()
                          }
                        >
                          {row.firstName ? 'Save Changes' : 'Send Invite'}
                        </Button>
                      </div>
                    </div>
                    {row.firstName &&
                      isAgencySuperUser() &&
                      userCan('employees.reset.password.update') && (
                        <div className="pt-4 mt-4">
                          <ResetPassword userId={row.userId} type="employee" />
                        </div>
                      )}
                  </div>
                </div>
              </div>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default EmployeesSlideOver;
