const { pick } = require('lodash');

const {
  advRuleActionAttributes,
  findAndCountAllAdvRuleAction,
} = require('../repositories/advRuleAction.repository');

exports.listAdvRuleActions = async (query) => {
  const { filter, page, pageSize, pageOffset, sort } = query;

  const { rows, count } = await findAndCountAllAdvRuleAction({
    where: pick(filter, advRuleActionAttributes),
    offset: pageOffset,
    limit: pageSize,
    order: sort,
  });

  return { page, pageSize, count, rows };
};
