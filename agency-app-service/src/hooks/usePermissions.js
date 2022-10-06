import { selectAuthenticatedUser } from 'features/auth/authSlice';
import { useSelector } from 'react-redux';
import { AGENCY_LEVEL, APPLICATION_LEVEL } from 'utils/constants';
import { AGENCY_SALES_ADMINISTRATOR, AGENCY_SUPER_USER } from 'utils/roles';

const usePermissions = () => {
  const user = useSelector(selectAuthenticatedUser);

  const userCan = (permissions) => {
    return user.role.permissions.some((p) =>
      permissions.split('|').includes(p.access)
    );
  };

  const userCanAll = (permissions) => {
    return permissions
      .split('|')
      .every((p) => user.role.permissions.find((pm) => pm.access === p));
  };

  const isAgencyLevel = () => {
    return user.role.level === AGENCY_LEVEL;
  };

  const isApplicationLevel = () => {
    return user.role.level === APPLICATION_LEVEL;
  };

  const isAgencySuperUser = () => {
    return user.role.name.toLowerCase() === AGENCY_SUPER_USER;
  };

  const isMine = (userId) => {
    return user.userId === userId;
  };

  const isSalesAdmin = () => {
    return user.role.name.toLowerCase() === AGENCY_SALES_ADMINISTRATOR;
  };

  const hasAccessToAllClients = () => {
    return user.role.hasAccessToAllClients;
  };

  return {
    userCan,
    userCanAll,
    isAgencyLevel,
    isApplicationLevel,
    isAgencySuperUser,
    isMine,
    isSalesAdmin,
    hasAccessToAllClients,
  };
};

export default usePermissions;
