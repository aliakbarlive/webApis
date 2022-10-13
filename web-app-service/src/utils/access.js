const planPermissions = {
  free: ['profit', 'products', 'orders', 'reviews', 'alerts', 'advertising'],
  basic: ['profit', 'products', 'orders', 'reviews', 'alerts', 'advertising'],
  pro: ['profit', 'products', 'orders', 'reviews', 'alerts', 'advertising'],
  agency: ['plan'],
};

exports.hasAccessTo = (user, account, module) => {
  if (!user) return false;
  if (!account) return false;
  if (!module) return false;

  // add more comflex condition here based on modules.
  return planPermissions[account.plan.name].includes(module);
};
