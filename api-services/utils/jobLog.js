const moment = require('moment');
const { Job } = require('../models');

exports.add = async (queue, data, options = null, message = null) => {
  return await Job.create({
    queue,
    data,
    options,
    message,
  });
};

exports.addAutoStarted = async (
  queue,
  data,
  options = null,
  message = null
) => {
  return await Job.create({
    queue,
    data,
    options,
    status: 'active',
    message,
    startDate: moment().format(),
  });
};

exports.started = async (job) => {
  return await job.update({
    status: 'active',
    startDate: moment().format(),
  });
};

exports.completed = async (job) => {
  return await job.update({
    status: 'completed',
    startDate: job.startDate ?? moment().format(),
    completedAt: moment().format(),
    message: null,
  });
};

exports.failed = async (job, message) => {
  return await job.update({
    status: 'failed',
    completedAt: null,
    message,
  });
};

exports.error = async (job, message) => {
  return await job.update({
    status: 'error',
    completedAt: null,
    message,
  });
};

exports.get = async (jobId) => {
  return await Job.findByPk(jobId);
};
