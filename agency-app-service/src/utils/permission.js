export const userCan = (user, permissions) => {
  return user.role.permissions.some((p) =>
    permissions.split('|').includes(p.access)
  );
};
