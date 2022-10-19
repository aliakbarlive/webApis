const authorize = (user, allowedRoles) => {
  const userRoles = user.roles.map((role) => role.roleName);

  return userRoles.some((userRole) => allowedRoles.includes(userRole));
};

export default authorize;
