import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XIcon, TrashIcon, PlusIcon } from '@heroicons/react/outline';
import { useDispatch, useSelector } from 'react-redux';
import React, { useState, useEffect } from 'react';
import { startCase, groupBy } from 'lodash';

import { setAlert } from '../alerts/alertsSlice';
import Select from 'components/Forms/Select';
import Input from 'components/Forms/Input';
import ConfirmationModal from 'components/ConfirmationModal';
import { fetchRoles, updateGroups, removeGroup } from './employeesSlice';
import Label from 'components/Forms/Label';
import Button from 'components/Button';
import { userCan } from 'utils/permission';
import { selectAuthenticatedUser } from 'features/auth/authSlice';

const OrgSlideOver = ({
  open,
  setOpen,
  selectedGroup,
  employeesGroupedByRole,
  groupsByLevel,
  onReload,
}) => {
  const dispatch = useDispatch();
  const { roles } = useSelector((state) => state.employees);
  const user = useSelector(selectAuthenticatedUser);
  // const parent = selectedGroup.level === 'pod' ? 'squad' : 'cell';
  const squadRoles = roles
    .filter((role) => {
      return (
        role.groupLevel === 'squad' && role.department === selectedGroup.type
      );
    })
    .map((l) => {
      return Array(l.allowPerGroup).fill(l);
    })
    .flat()
    .sort((a, b) => a.value - b.value);

  const podRoles = roles
    .filter((role) => {
      return (
        role.groupLevel === 'pod' && role.department === selectedGroup.type
      );
    })
    .map((l) => {
      return Array(l.allowPerGroup).fill(l);
    })
    .flat()
    .sort((a, b) => a.value - b.value);

  const cellRoles = roles
    .filter((role) => {
      return (
        role.groupLevel === 'cell' && role.department === selectedGroup.type
      );
    })
    .map((l) => {
      return Array(l.allowPerGroup).fill(l);
    })
    .flat()
    .sort((a, b) => a.value - b.value);

  let levelRoles =
    selectedGroup.level === 'squad'
      ? squadRoles
      : selectedGroup.level === 'pod'
      ? podRoles
      : selectedGroup.level === 'cell'
      ? cellRoles
      : [];

  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [params, setParams] = useState({
    name: '',
    id: '',
    level: '',
    type: '',
    rolesData: [],
    parentId: '',
    child: [],
  });

  const onChangeName = (name) => {
    setParams({ ...params, name });
  };

  const onCancel = (e) => {
    if (e) e.preventDefault();
    setParams({
      name: '',
      id: '',
      level: '',
      type: '',
      rolesData: [],
      parentId: '',
      child: [],
    });
    setOpen(false);
  };

  const onSave = () => {
    if (params.name.trim().length > 0) {
      dispatch(updateGroups(params)).then((res) => {
        setOpen(false);
        dispatch(setAlert('success', 'Successfully saved!'));
        onReload();
      });
    } else {
      dispatch(setAlert('warning', 'Please provide group name!'));
    }
  };

  const onChangeUser = (val, i) => {
    console.log('onChangeUser', val, i);
    let newRolesData = [...params.rolesData];
    newRolesData[i].userId = val;
    setParams({
      ...params,
      rolesData: newRolesData,
    });
  };

  const onChangeParent = (val) => {
    setParams({
      ...params,
      parentId: val,
    });
  };

  const onDelete = () => {
    setIsOpenDeleteModal(false);
    setOpen(false);
    dispatch(removeGroup({ id: params.id, level: params.level }));
    dispatch(setAlert('success', 'Deleted!'));
    onReload();
  };

  const addChild = () => {
    setParams({
      ...params,
      child: [...params.child, { name: '' }],
    });
  };

  const onChangeChildName = (name, i) => {
    let newChild = [...params.child];
    newChild[i].name = name;
    setParams({
      ...params,
      child: newChild,
    });
  };

  useEffect(() => {
    let users = selectedGroup.users
      ? JSON.parse(JSON.stringify(selectedGroup.users))
      : [];
    levelRoles = levelRoles.map((el, i) => {
      let user = users.find((u) => u.User.role.roleId === el.value)
        ? users.find((u) => u.User.role.roleId === el.value)
        : {};

      let userIndex = users.indexOf(user);
      if (userIndex > -1) {
        users.splice(userIndex, 1);
      }
      return {
        ...el,
        userId: user ? user.userId : '',
        firstName: user ? user.firstName : '',
        lastName: user ? user.lastName : '',
      };
    });

    setParams({
      ...selectedGroup,
      rolesData: levelRoles,
      child: [],
    });
    dispatch(fetchRoles()).then(() => {
      setLoading(false);
    });
  }, [selectedGroup]);

  useEffect(() => {
    setLoading(true);
    dispatch(fetchRoles()).then(() => {
      setLoading(false);
    });
  }, [dispatch, selectedGroup]);

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
                        {selectedGroup.name ? selectedGroup.name : 'New Squad'}
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
                  <div className="px-6 py-4 sm:px-8">
                    <div className="flex flex-col">
                      <Label shtmlFor="role">
                        {selectedGroup.level !== 'add squad'
                          ? startCase(selectedGroup.level)
                          : ''}{' '}
                        Name
                      </Label>
                      <span className="col-span-2 text-gray-900">
                        <Input
                          id="name"
                          label="name"
                          value={params.name}
                          type="text"
                          onChange={(e) => onChangeName(e.target.value)}
                        />
                      </span>
                    </div>
                  </div>
                  {params.child.length > 0 &&
                    params.child.map((c, i) => {
                      return (
                        <div key={i} className="px-6 py-4 sm:px-8">
                          <div className="flex flex-col">
                            <Label shtmlFor="role">
                              New {params.level === 'squad' ? 'Pod' : 'Cell'}{' '}
                              Name
                            </Label>
                            <span className="col-span-2 text-gray-900">
                              <Input
                                id="name"
                                label="name"
                                value={params.child[i].name}
                                type="text"
                                onChange={(e) =>
                                  onChangeChildName(e.target.value, i)
                                }
                              />
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  {params.level !== 'squad' && params.level !== 'add squad' ? (
                    <div className="px-6 py-4 sm:px-8">
                      <Label htmlFor="role">
                        Parent {params.level === 'pod' ? 'Squad' : 'Pod'}
                      </Label>
                      <span className="col-span-2 text-gray-900">
                        <Select
                          id="user"
                          label="user"
                          value={params.parentId}
                          onChange={(e) => onChangeParent(e.target.value)}
                        >
                          {/* <option value=""></option> */}
                          {params.level === 'pod'
                            ? groupsByLevel.squad.map((g) => {
                                return (
                                  <option key={g.id} value={g.id}>
                                    {startCase(g.name)}
                                  </option>
                                );
                              })
                            : params.level === 'cell'
                            ? groupsByLevel.pod.map((g) => {
                                return (
                                  <option key={g.id} value={g.id}>
                                    {startCase(g.name)}
                                  </option>
                                );
                              })
                            : ''}
                        </Select>
                      </span>
                    </div>
                  ) : (
                    ''
                  )}

                  <div className="px-6 py-4 sm:px-8">
                    {params.rolesData.map((role, i) => {
                      return (
                        <div key={i} className="flex flex-col">
                          <Label htmlFor="role">{startCase(role.label)}</Label>
                          <span className="col-span-2 text-gray-900">
                            <Select
                              id="user"
                              label="user"
                              value={role.userId}
                              onChange={(e) => onChangeUser(e.target.value, i)}
                            >
                              <option value=""></option>
                              {employeesGroupedByRole[role.label]
                                ? employeesGroupedByRole[role.label].map(
                                    (u) => {
                                      return (
                                        <option key={u.userId} value={u.userId}>
                                          {startCase(
                                            `${u.firstName} ${u.lastName}`
                                          )}
                                        </option>
                                      );
                                    }
                                  )
                                : ''}
                            </Select>
                          </span>
                        </div>
                      );
                    })}

                    <div className={`flex items-start  justify-between mt-10`}>
                      {params.level !== 'add squad' ? (
                        <div>
                          <Button
                            disabled={!userCan(user, 'employees.groups.delete')}
                            bgColor="white"
                            hoverColor="gray-50"
                            textColor="red-900"
                            onClick={() => setIsOpenDeleteModal(true)}
                            title="Delete"
                          >
                            <TrashIcon className="w-4 h-4 inline mr-2" /> Delete
                          </Button>
                          {params.level !== 'cell' && (
                            <Button
                              bgColor="white"
                              hoverColor="gray-50"
                              textColor="red-900"
                              onClick={() => addChild()}
                              title="Clear"
                            >
                              <PlusIcon className="w-4 h-4 inline mr-2" />
                              Add {params.level === 'squad' ? 'Pod' : 'Cell'}
                            </Button>
                          )}
                        </div>
                      ) : (
                        <div></div>
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
                        <Button onClick={onSave} classes="ml-2">
                          Save Changes
                        </Button>
                      </div>
                    </div>
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

export default OrgSlideOver;
