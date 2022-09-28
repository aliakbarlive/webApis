const moment = require('moment');
const Validator = require('validatorjs');
const { keys, pick } = require('lodash');

const OptimizationReportItemOptionRepository = require('./optimizationReportItemOption.repository');

const Response = require('@utils/response');

const updateItemOption = async (profile, reportId, itemId, optionId, data) => {
  const option =
    await OptimizationReportItemOptionRepository.findByProfileIdReportIdItemIdAndOptionId(
      profile.advProfileId,
      reportId,
      itemId,
      optionId
    );

  if (!option) {
    return new Response()
      .failed()
      .withCode(400)
      .withMessage('Optimization report item option not found.');
  }

  let { selected, data: payload } = data;

  if (selected) {
    payload = { ...payload, ...option.rule.actionData };
    let validation = { ...option.rule.action.validation };

    keys(validation).forEach((key) => {
      if (key === 'campaign.startDate') {
        validation[key] =
          'required|date|after_or_equal:' + moment().format('YYYY-MM-DD');
      }

      if (key === 'campaign.endDate' && payload.campaign.startDate) {
        validation[key] = 'date|after_or_equal:' + payload.campaign.startDate;
      }
    });

    const validator = new Validator(payload, validation);
    payload = pick(payload, keys(validation));

    if (validator.fails()) {
      return new Response()
        .withCode(400)
        .withErrors(validator.errors.all())
        .withMessage('Invalid data.');
    }

    await OptimizationReportItemOptionRepository.markAsUnselectedByItemIdExept(
      itemId,
      optionId
    );
  }

  await option.update({ selected, data: payload });

  return new Response()
    .withCode(200)
    .withData(option)
    .withMessage('Optimization report item successfully updated.');
};

module.exports = {
  updateItemOption,
};
