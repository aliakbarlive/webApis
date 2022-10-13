const asyncHandler = require('@middleware/async');
const fs = require('fs');
const csv = require('fast-csv');
const moment = require('moment');
const { pick, keys } = require('lodash');

const {
  listUnassignedClients,
  findByAccountName,
  createCancelledClient,
} = require('./agencyClient.service');
const e = require('express');

exports.listUnassignedClients = asyncHandler(async (req, res, next) => {
  const response = await listUnassignedClients(req.query);

  res.status(response.code).json({
    success: response.status,
    message: response.message,
    data: response.data,
  });
});

exports.importCancelledClients = asyncHandler(async (req, res, next) => {
  let success = false;
  const temp = req.file;
  if (temp) {
    const { path, mimetype } = temp;
    if (
      mimetype === 'text/csv' ||
      mimetype === 'application/vnd.ms-excel' ||
      mimetype === 'text/x-csv' ||
      mimetype === 'text/plain'
    ) {
      success = true;
      const fd = fs.createReadStream(path);
      const dd = fd.pipe(csv.parse({ headers: true }));
      dd.on('error', (error) => console.error(error));
      dd.on('data', async (row) => {
        const { name, email, termination_date } = row;
        const client = await findByAccountName(name);
        // If the client does not exists, it will be added on the database
        if (!client) {
          const body = {
            client: name,
            siEmail: email,
            status: 'cancelled',
            cancelledAt: moment(termination_date).format(),
          };
          // Add the agencyClient
          await createCancelledClient(body);
        }
      });
      dd.on('end', (rowCount) => console.log(`Parsed ${rowCount} rows`));
    }
  }

  res.status(200).json({
    success: true,
  });
});
