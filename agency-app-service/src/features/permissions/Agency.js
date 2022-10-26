import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';

import PageHeader from 'components/PageHeader';
import { PlusIcon } from '@heroicons/react/outline';
import Select from 'components/Forms/Select';
import Toggle from 'components/Toggle';
import Label from 'components/Forms/Label';
import { fetchRoles } from '../employees/employeesSlice';
import { selectAuthenticatedUser, setUser } from 'features/auth/authSlice';
import usePermissions from 'hooks/usePermissions';
import SlideOver from 'components/SlideOver';
import PermissionForm from './components/PermissionForm';
import {
  getPermissionsAsync,
  selectPermissionsGrouped,
  updateRolePermissions,
} from './permissionsSlice';

const Agency = ({ tabs }) => {
  const dispatch = useDispatch();
  const user = useSelector(selectAuthenticatedUser);

  const { userCan, isAgencySuperUser } = usePermissions();

  const [params, setParams] = useState({
    role: '',
    feature: '',
  });

  const [selected, setSelected] = useState({
    feature: '',
    access: '',
    description: '',
  });

  const [open, setOpen] = useState(false);

  const [access, setAccess] = useState([]);

  const permissions = useSelector(selectPermissionsGrouped);
  const features = Object.keys(permissions).map((key) => {
    return { value: key, label: key };
  });
  const { roles } = useSelector((state) => state.employees);

  useEffect(() => {
    dispatch(getPermissionsAsync());
    dispatch(fetchRoles());
  }, [dispatch]);

  const onChangeParams = async (value, par) => {
    let copyParams = { ...params, [par]: value };
    await setParams(copyParams);
    if (par === 'feature' && value !== '') {
      await setAccess(permissions[value]);
    }
    if (value === '') {
      setAccess([]);
    }
    if (copyParams.role !== '' && copyParams.feature !== '') {
      try {
        const res = await axios({
          method: 'GET',
          url: '/agency/permissions/featureRoles',
          params: { roleId: copyParams.role, feature: copyParams.feature },
        });
        let newAccess = [...permissions[copyParams.feature]];
        newAccess = newAccess.map((rec) => {
          return {
            ...rec,
            toggle: res.data.data.some(
              (el) => el.permissionId === rec.permissionId
            ),
          };
        });
        setAccess(newAccess);
      } catch (error) {
        console.log(error.message);
      }
    }
  };

  const onToggle = (val, i) => {
    let newAccess = [...access];
    let item = { ...newAccess[i] };
    item.toggle = val;
    newAccess[i] = item;
    dispatch(
      updateRolePermissions({
        roleId: params.role,
        permissionId: item.permissionId,
        toggle: item.toggle,
      })
    );
    setAccess(newAccess);

    // Update existing permissions role if user role is same
    let userRole = user.role.name;
    let { label } = roles.find((role) => role.value == params.role);
    if (userRole === label) {
      let userCopy = JSON.parse(JSON.stringify(user));
      let permissions = userCopy.role.permissions;
      if (item.toggle) {
        permissions.push({ access: item.access, feature: item.feature });
      } else {
        let index = permissions.findIndex((p) => p.access === item.access);
        permissions.splice(index, 1);
      }
      userCopy.role.permissions = permissions;

      dispatch(setUser(userCopy));
    }
  };

  return (
    <>
      <PageHeader
        title="Permissions"
        tabs={tabs}
        left={
          isAgencySuperUser() && (
            <button
              onClick={() => setOpen(true)}
              className="flex items-center uppercase px-2 rounded-sm py-1 border border-gray-300 text-xs text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-red-600 focus:ring-red-300"
            >
              <PlusIcon className="h-4 w-4" /> Add
            </button>
          )
        }
      />
      <div className="grid grid-cols-3 sm:grid-cols-4 xl:grid-cols-8 gap-4 mb-4 items-center">
        <div className="col-span-4 sm:col-span-2">
          <Label htmlFor="Squad">Role</Label>
          <Select
            id="role"
            label="Role"
            value={params.role}
            className="capitalize"
            onChange={(e) => onChangeParams(e.target.value, 'role')}
          >
            {[{ value: '', label: '' }, ...roles].map((role, i) => (
              <option key={i} value={role.value}>
                {role.label}
              </option>
            ))}
          </Select>
        </div>
        <div className="col-span-4 sm:col-span-2">
          <Label htmlFor="Squad">Feature</Label>
          <Select
            id="feature"
            label="Features"
            value={params.feature}
            onChange={(e) => onChangeParams(e.target.value, 'feature')}
            className="capitalize"
          >
            {[{ value: '', label: '' }, ...features].map((item, i) => (
              <option key={i} value={item.value}>
                {item.label}
              </option>
            ))}
          </Select>
        </div>
      </div>
      {access.length > 0 && params.role && params.feature && (
        <div className="mt-5 grid grid-cols-4 sm:grid-cols-4 xl:grid-cols-8 gap-4 mb-4 items-center">
          {access.map((item, i) => {
            return (
              <div key={item.access} className="m-3 col-span-4 sm:col-span-4">
                <span className="mb-4 capitalize">
                  {item.description
                    ? item.description
                    : item.access.replaceAll('.', ' ')}
                </span>
                <Toggle
                  onChange={(val) => onToggle(val, i)}
                  checked={item.toggle}
                  classes="float-right"
                />
              </div>
            );
          })}
        </div>
      )}

      <SlideOver
        open={open}
        setOpen={setOpen}
        title="Add Permission"
        titleClasses="capitalize"
        size="3xl"
      >
        <div className="flow-root">
          <PermissionForm
            data={selected}
            setOpen={setOpen}
            setSelected={setSelected}
          />
        </div>
      </SlideOver>
    </>
  );
};

export default Agency;
