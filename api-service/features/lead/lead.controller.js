const asyncHandler = require('@middleware/async');
const fs = require('fs');
const csv = require('fast-csv');
const moment = require('moment');
const {
  listLeads,
  listLeadsDuplicate,
  createLead,
  updateLead,
  deleteLead,
  getLead,
  listLeadNotesByLead,
  createLeadNote,
  deleteLeadNote,
  getLeadByCompanyName,
  getOverallMetrics,
  getGraphMetrics,
  getGroupMetrics,
  listLeadsVariables,
  createLeadVariable,
  updateLeadVariable,
  listLinkedInAccounts,
  createliAccount,
  updateliAccount,
  checkExistingLead,
  cleanExistingLeads,
  countLeads,
  listLeadConversation,
  createLeadConversation,
  addUnprocessedLead,
  checkBrandExists,
  cleanDuplicateLeads,
  getLeadSources,
} = require('./lead.service');

const roleService = require('@services/role.service');
const userService = require('@services/user.service');
const s3Service = require('@services/s3.service');
const userGroupService = require('@services/usergroup.service');
const dotenv = require('dotenv');
const leadSourceRepository = require('./leadSource.repository');
dotenv.config({ path: 'config/config.env' });

moment.tz.setDefault('America/Toronto');

// @desc     List leads.
// @route    GET /api/v1/agency/leads
// @access   Private
exports.listLeads = asyncHandler(async (req, res, next) => {
  // console.log('+++++++++=req.query', req.query)
  const response = await listLeads(req.query);

  res.status(response.code).json({
    success: response.status,
    message: response.message,
    data: response.data,
    user: req.user.userId,
  });
});

// @desc     List leads duplicate.
// @route    GET /api/v1/agency/leads/duplicate
// @access   Private
exports.listLeadsDuplicate = asyncHandler(async (req, res, next) => {
  const response = await listLeadsDuplicate(req.query);

  res.status(response.code).json({
    data: response.data,
  });
});

// @desc     Count leads assign.
// @route    GET /api/v1/agency/leads/count
// @access   Private
exports.countLeads = asyncHandler(async (req, res, next) => {
  const response = await countLeads(req.query);

  res.status(response.code).json({
    data: response.data,
  });
});

// @desc     List leads variables.
// @route    GET /api/v1/agency/leads/variables
// @access   Private
exports.listLeadsVariables = asyncHandler(async (req, res, next) => {
  const response = await listLeadsVariables(req.query);
  res.status(response.code).json({
    data: response.data,
  });
});

// @desc     Create lead variable.
// @route    POST /api/v1/agency/leads/variables
// @access   Private
exports.createLeadVariable = asyncHandler(async (req, res, next) => {
  const response = await createLeadVariable(req);

  res.status(response.code).json({
    success: response.status,
    message: response.message,
    data: response.data,
  });
});

// @desc     Create lead variable.
// @route    POST /api/v1/agency/leads/variables
// @access   Private
exports.updateLeadVariable = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const response = await updateLeadVariable(req, id);

  res.status(response.code).json({
    success: response.status,
    message: response.message,
    data: response.data,
  });
});

// @desc     List leads linkedIn Accounts.
// @route    GET /api/v1/agency/leads/linkedInAccounts
// @access   Private
exports.listLinkedInAccounts = asyncHandler(async (req, res, next) => {
  const response = await listLinkedInAccounts(req.query);
  res.status(response.code).json({
    data: response.data,
  });
});

// @desc     Create lead linkedIn Accounts.
// @route    POST /api/v1/agency/leads/liAccounts
// @access   Private
exports.createliAccount = asyncHandler(async (req, res, next) => {
  const response = await createliAccount(req);

  res.status(response.code).json({
    success: response.status,
    message: response.message,
    data: response.data,
  });
});

// @desc     Update li account
// @route    POST /api/v1/agency/leads/liAccounts
// @access   Private
exports.updateliAccount = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const response = await updateliAccount(req, id);

  res.status(response.code).json({
    success: response.status,
    message: response.message,
    data: response.data,
  });
});

// @desc     Create lead.
// @route    POST /api/v1/agency/leads
// @access   Private
exports.createLead = asyncHandler(async (req, res, next) => {
  const response = await createLead(req);

  res.status(response.code).json({
    success: response.status,
    message: response.message,
    data: response.data,
  });
});

// @desc     Update lead.
// @route    PUT /api/v1/agency/leads/:leadId
// @access   Private
exports.updateLead = asyncHandler(async (req, res, next) => {
  const { leadId } = req.params;
  const response = await updateLead(leadId, req);

  res.status(response.code).json({
    success: response.status,
    message: response.message,
    data: response.data,
  });
});

// @desc     Delete lead.
// @route    DELETE /api/v1/agency/leads/:leadId
// @access   Private
exports.deleteLead = asyncHandler(async (req, res, next) => {
  const { leadId } = req.params;
  const response = await deleteLead(leadId);

  res.status(response.code).json({
    success: response.status,
    message: response.message,
    data: response.data,
  });
});

// @desc     GET lead.
// @route    GET /api/v1/agency/leads/:leadId
// @access   Private
exports.getLead = asyncHandler(async (req, res, next) => {
  const { leadId } = req.params;
  const response = await getLead(leadId);

  res.status(response.code).json({
    success: response.status,
    message: response.message,
    data: response.data,
  });
});

exports.importSalesRepresentative = asyncHandler(async (req, res, next) => {
  const userRole = await roleService.getRole(
    'lead generation representative',
    'agency'
  );

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
        const {
          'First Name': firstName,
          'Last Name': lastName,
          'Email Address': email,
          REP: displayName,
        } = row;

        if (email) {
          let body = {
            firstName,
            lastName,
            email,
            displayName,
          };
          const user = await userService.getUserByEmail(email);
          if (!user) {
            body = {
              ...body,
              password: 'A6Bw1Tu6meAgVCk4',
              isEmailVerified: true,
              roleId: userRole.roleId,
            };

            try {
              await userService.createUser(body);
            } catch (error) {
              console.log(error);
            }
          } else {
            try {
              await userService.updateUser(body, {
                where: { userId: user.userId },
              });
            } catch (error) {
              console.log(error);
            }
          }
        }
      });
      dd.on('end', (rowCount) => console.log(`Parsed ${rowCount} rows`));
    }
  }

  res.status(200).json({
    success,
  });
});

exports.importCSV = asyncHandler(async (req, res, next) => {
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
        const {
          Date: date, //createdAt if new record, updatedAt if record is existing
          REP: leadGenRepName, // employee
          'SENT FROM ACCT': sentFromAcct,
          'TYPE OF RESPONSE': typeOfResponse1,
          'MESSAGE OVERVIEW': messageOverview,
          'LEADS NAME': lead, //version1
          "LEAD'S NAME": lead2, //version2
          LEAD: lead3, //version 3
          POSITION: position,
          TITLE: title,
          'COMPANY NAME': companyName,
          'COMPANY/BRAND': companyName2,
          'COMPANY LI': companyLI,
          "LEAD'S LI URL": leadsLIURL,
          'LI ACCOUNT': liAccount,
          STATUS: status1,
          WEBSITE: website,
          'LEAD TYPE': leadType1,
          fan: leadType2,
          COUNTRY: country,
          'LEAD QUALITY': leadQuality1,
          'TOTAL REVENUE': totalRevenue1,
          'AMZ STORE/FBA STOREFRONT': amzStoreFBAstoreFront,
          'Lead Screenshot URL': leadScreenShotURL,
          'Lead URL': leadScreenShotURL2,
          'Competitor Screenshot URL': competitorScreenShotURL,
          'Competitor URL': competitorScreenShotURL2,
          'LinkedIn Profile URL': linkedInProfileURL,
          'Lead Photo URL': leadPhotoURL,
          REMARKS: remarks,
          'DATE BOOKED': dateBooked,
          'DATE OF CALL': dateOfCall,
          'DATE & TIME OF RESPONSE': dateTimeOfResponse,
          'DATE & TIME WE RESPONDED': dateTimeWeResponded,
        } = row;

        let typeOfResponse = typeOfResponse1
          ? typeOfResponse1.toLowerCase()
          : '';
        if (
          typeOfResponse == 'positive response' ||
          typeOfResponse.includes('positive response')
        ) {
          typeOfResponse = 'PositiveResponse';
        } else if (typeOfResponse == 'direct booking') {
          typeOfResponse = 'DirectBooking';
        } else if (
          typeOfResponse == 'neutral response' ||
          typeOfResponse.includes('neutral response')
        ) {
          typeOfResponse = 'NeutralResponse';
        } else {
          typeOfResponse = 'None';
        }

        let leadType = leadType2
          ? leadType2 && leadType2.toLowerCase()
          : leadType1
          ? leadType1.toLowerCase()
          : '';

        if (leadType.includes('fba')) {
          leadType = 'FBA';
        } else if (leadType.includes('amz')) {
          leadType = 'AMZ';
        } else {
          leadType = 'None';
        }

        let leadQuality = leadQuality1
          ? leadQuality1.toLowerCase()
          : totalRevenue1
          ? totalRevenue1.toLowerCase()
          : '';
        if (leadQuality == 'mid - high') {
          leadQuality = 'Mid-High';
        } else if (leadQuality == 'low') {
          leadQuality = 'Low';
        } else if (leadQuality.includes('mid') || leadQuality == 'medium') {
          leadQuality = 'Mid';
        } else if (leadQuality == 'high' || leadQuality == 'hligh') {
          leadQuality = 'High';
        } else if (leadQuality == 'u high' || leadQuality == 'u-high') {
          leadQuality = 'Ultra-High';
        } else {
          leadQuality = 'None';
        }

        let status = status1 ? status1.toLowerCase() : '';
        if (status.includes('booked')) {
          status = 'Call-Booked';
        } else if (status.includes('replied')) {
          status = 'RepliedTo';
        } else {
          status = 'Pending Approval';
        }

        let totalRevenue = totalRevenue1 ? totalRevenue1 : '';

        const lName = lead3 ? lead3 : lead2 ? lead2 : lead ? lead : '';

        const cName = companyName2
          ? companyName2
          : companyName != null
          ? companyName
          : '';

        const existLead = await getLeadByCompanyName(
          lName.trim(),
          cName.trim()
        );

        const cLi = companyLI ? companyLI : leadsLIURL ? leadsLIURL : '';

        let body = {
          leadGenRepName: leadGenRepName ? leadGenRepName.trim() : '',
          sentFromAcct: existLead
            ? existLead.sentFromAcct == null
              ? sentFromAcct
              : existLead.sentFromAcct
            : sentFromAcct,
          typeOfResponse: existLead
            ? existLead.typeOfResponse == null
              ? typeOfResponse
              : existLead.typeOfResponse
            : typeOfResponse,
          messageOverview: existLead
            ? existLead.messageOverview == null
              ? messageOverview
              : existLead.messageOverview
            : messageOverview,
          lead: lName.trim(),
          position: existLead
            ? existLead.position == null
              ? position
              : existLead.position
            : position,
          title: existLead
            ? existLead.title == null
              ? title
              : existLead.title
            : title,
          companyName: cName.trim(),
          companyLI: existLead
            ? existLead.companyLI == null
              ? cLi
              : existLead.companyLI
            : cLi,
          liAccount: existLead
            ? existLead.liAccount == null
              ? liAccount
              : existLead.liAccount
            : liAccount,
          website: existLead
            ? existLead.website == null
              ? website
              : existLead.website
            : website,
          country: existLead
            ? existLead.country == null
              ? country
              : existLead.country
            : country,
          amzStoreFBAstoreFront: existLead
            ? existLead.amzStoreFBAstoreFront == null
              ? amzStoreFBAstoreFront
              : existLead.amzStoreFBAstoreFront
            : amzStoreFBAstoreFront,
          leadScreenShotURL: existLead
            ? existLead.leadScreenShotURL == null
              ? leadScreenShotURL2
              : leadScreenShotURL
              ? leadScreenShotURL
              : existLead.leadScreenShotURL
            : leadScreenShotURL2
            ? leadScreenShotURL2
            : leadScreenShotURL,
          competitorScreenShotURL: existLead
            ? existLead.leadScreenShotURL == null
              ? competitorScreenShotURL2
              : competitorScreenShotURL
              ? competitorScreenShotURL
              : existLead.leadScreenShotURL
            : competitorScreenShotURL2
            ? competitorScreenShotURL2
            : competitorScreenShotURL,
          linkedInProfileURL: existLead
            ? existLead.linkedInProfileURL == null
              ? linkedInProfileURL
              : existLead.linkedInProfileURL
            : linkedInProfileURL,
          leadPhotoURL: existLead
            ? existLead.leadPhotoURL == null
              ? leadPhotoURL
              : existLead.leadPhotoURL
            : leadPhotoURL,
          remarks: existLead
            ? existLead.remarks == null
              ? remarks
              : existLead.leadPhotoURL
            : remarks,
          dateBooked: existLead
            ? existLead.dateBooked == null
              ? dateBooked
                ? moment(dateBooked).isValid()
                  ? moment(dateBooked).format()
                  : null
                : null
              : existLead.dateBooked
            : dateBooked
            ? moment(dateBooked).format()
            : null,
          dateOfCall: existLead
            ? existLead.dateOfCall == null
              ? dateOfCall
                ? moment(dateOfCall).isValid()
                  ? moment(dateOfCall).format()
                  : null
                : null
              : existLead.dateOfCall
            : dateOfCall
            ? moment(dateOfCall).format()
            : null,
          dateTimeOfResponse: existLead
            ? existLead.dateTimeOfResponse == null
              ? dateTimeOfResponse
                ? moment(dateTimeOfResponse).isValid()
                  ? moment(dateTimeOfResponse).format()
                  : null
                : null
              : existLead.dateTimeOfResponse
            : dateTimeOfResponse
            ? moment(dateTimeOfResponse).isValid()
              ? moment(dateTimeOfResponse).format()
              : null
            : null,
          dateTimeWeResponded: existLead
            ? existLead.dateTimeWeResponded == null
              ? dateTimeWeResponded
                ? moment(dateTimeWeResponded).isValid()
                  ? moment(dateTimeWeResponded).format()
                  : null
                : null
              : existLead.dateTimeWeResponded
            : dateTimeWeResponded
            ? moment(dateTimeWeResponded).isValid()
              ? moment(dateTimeWeResponded).format()
              : null
            : null,
          leadType: existLead
            ? existLead.leadType == null
              ? leadType
              : existLead.leadType
            : leadType,
          leadQuality: existLead
            ? existLead.leadQuality == null
              ? leadQuality
              : existLead.leadQuality
            : leadQuality,
          totalRevenue: existLead
            ? existLead.totalRevenue == null
              ? totalRevenue
              : existLead.totalRevenue
            : totalRevenue,
          status:
            status != 'Pending Approval'
              ? status
                ? status
                : 'Pending Approval'
              : 'Pending Approval',
        };

        const exists = await checkExistingLead();
        if (date && body.companyName !== '') {
          let displayName = leadGenRepName ? leadGenRepName.trim() : '';
          switch (displayName) {
            case 'Camlle':
              displayName = 'Camille';
              break;
            case '519cris':
              displayName = 'Cris L';
              break;
            default:
              break;
          }

          if (displayName) {
            const user = await userService.getUserByDisplayName(displayName);
            if (user) {
              body = { ...body, leadsRep: user.userId };
            }
          }

          const dateAddedTemp =
            date && moment(date).isValid() ? moment(date) : moment();

          const dateAdded = dateAddedTemp.format();
          const startingDate = moment('2022-01-01'); // starting year
          if (dateAddedTemp < startingDate) {
            body.status = 'Old-Leads';
          } else {
            body.status =
              body.status === 'Pending Approval' ? 'Pitched-LL' : body.status;
          }

          if (existLead && lead3 && body.status == 'Old-Leads') {
            // update the lead
            await updateLead(existLead.leadId, {
              body: {
                ...body,
                pitchedDate: dateAdded,
              },
              user: req.user,
              log: false,
            });
          } else {
            let proceed = true;
            if (body.lead !== '') {
              const client = await checkExistingLead(body.lead);
              if (client) {
                proceed = false; // skip if the lead already exists as a client
              }
            }
            if (proceed) {
              //To save on the table
              let pitchDate = dateAdded;
              let pitchedDate = null;
              if (lead3 || body.status === 'Pitched-LL') {
                pitchedDate = dateAdded;
              }
              try {
                await createLead({
                  body: {
                    ...body,
                    pitchDate,
                    pitchedDate,
                    remarks:
                      lead3 && pitchedDate == null
                        ? body.remarks !== null
                          ? body.remarks
                          : ''
                        : body.remarks !== null
                        ? body.remarks + ' Duplicate'
                        : 'Duplicate',
                  },
                  user: req.user,
                });
              } catch (error) {
                console.log(error);
              }
            }
          }
        }
      });
      dd.on('end', (rowCount) => console.log(`Parsed ${rowCount} rows`));
    }
  }
  res.status(200).json({
    success,
  });
});

// @desc     Create lead note
// @route    POST /api/v1/agency/leads/:leadId/notes
// @access   Private
exports.createLeadNote = asyncHandler(async (req, res, next) => {
  const { leadId } = req.params;
  const { userId: addedBy } = req.user;
  const response = await createLeadNote({ leadId, ...req.body, addedBy });

  res.status(response.code).json({
    success: response.status,
    message: response.message,
    data: response.data,
  });
});

// @desc     List note by lead.
// @route    GET /api/v1/agency/leads/:leadId/notes
// @access   Private
exports.listLeadNotes = asyncHandler(async (req, res, next) => {
  const { leadId } = req.params;
  const response = await listLeadNotesByLead(leadId, req.query);

  res.status(response.code).json({
    success: response.status,
    message: response.message,
    data: response.data,
  });
});

// @desc     List conversation by leadId.
// @route    GET /api/v1/agency/leads/:leadId/conversation
// @access   Private
exports.listLeadConversation = asyncHandler(async (req, res, next) => {
  const { leadId } = req.params;
  const response = await listLeadConversation(leadId);

  res.status(response.code).json({
    success: response.status,
    message: response.message,
    data: response.data,
  });
});

// @desc     List conversation by leadId.
// @route    POST /api/v1/agency/leads/:leadId/conversation
// @access   Private
exports.createLeadConversation = asyncHandler(async (req, res, next) => {
  const { leadId } = req.params;
  const response = await createLeadConversation(leadId, req);

  res.status(response.code).json({
    success: response.status,
    message: response.message,
    data: response.data,
  });
});

// @desc     Delete lead.
// @route    DELETE /api/v1/agency/leads/notes/:leadNoteId
// @access   Private
exports.deleteLeadNote = asyncHandler(async (req, res, next) => {
  const { leadNoteId } = req.params;
  const response = await deleteLeadNote(leadNoteId);

  res.status(response.code).json({
    success: response.status,
    message: response.message,
    data: response.data,
  });
});

exports.getOverallMetrics = asyncHandler(async (req, res, next) => {
  const { startDate, endDate } = req.query;
  const stats = await getOverallMetrics(startDate, endDate);

  res.status(200).json({
    success: true,
    data: stats,
  });
});

exports.getGraphMetrics = asyncHandler(async (req, res, next) => {
  const { startDate, endDate, podId } = req.query;
  const data = await getGraphMetrics(startDate, endDate, podId);

  res.status(200).json({
    success: true,
    data,
  });
});

exports.getGroupMetrics = asyncHandler(async (req, res, next) => {
  const { startDate, endDate } = req.query;
  const data = await getGroupMetrics(startDate, endDate);

  res.status(200).json({
    success: true,
    data,
  });
});

exports.cleanExistingLeads = asyncHandler(async (req, res, next) => {
  await cleanExistingLeads();
  res.status(200).json({
    success: true,
  });
});

exports.importLeadsFromCSV = asyncHandler(async (req, res, next) => {
  const { userId } = req.user;
  const temp = req.file;
  const liStatus = ['No LI Available', 'No LinkedIn Available'];
  let totalRows = 0;
  let inserted = 0;
  let skipped = 0;

  if (temp) {
    const { originalname, path, mimetype, filename, size } = temp;

    if (
      mimetype === 'text/csv' ||
      mimetype === 'application/vnd.ms-excel' ||
      mimetype === 'text/x-csv' ||
      mimetype === 'text/plain'
    ) {
      const arrName = originalname.split('.');
      const ext = arrName[arrName.length - 1];
      const key = `leads/sources/${filename}.${ext}`;

      if (size <= process.env.S3_LIMIT_SIZE) {
        const body = fs.readFileSync(path);

        s3Service.uploadFile({
          key,
          body,
        });
      }
      //  else {
      //   res
      //     .status(400)
      //     .json({ success: false, message: 'Maximum size allowed: 5MB' });
      // }

      const leadSource = await leadSourceRepository.create({
        filename: originalname,
        extension: ext,
        s3file: key,
        uploadedBy: userId,
      });

      const stream = fs
        .createReadStream(path)
        .pipe(csv.parse({ headers: true }))
        .on('headers', (headers) => {
          if (headers.includes('Brand') && headers.includes('ASIN')) {
            console.log(`correct`);
          } else {
            stream.destroy();
            leadSource.destroy();

            res
              .status(200)
              .json({ success: false, message: 'Fields do not match' });
          }
        })
        .on('error', (error) => console.error(error))
        .on('data', async (row) => {
          totalRows += 1;
          try {
            stream.pause();
            const exists = await checkBrandExists(row['Brand']);
            if (!exists && row['Seller'] !== 'Amazon') {
              let data = {
                leadSourceId: leadSource.leadSourceId,
                leadScreenShotURL: row['URL'],
                asin: row['ASIN'],
                asinFullTitle: row['Title'],
                leadType: row['Fulfillment'],
                productCategory: row['Category'],
                subCategory1: row['Subcategory'],
                asinPrice: row['Price'],
                currentEarnings: row['Monthly Revenue'],
                asinReviews: row['Review Count'],
                brandName: row['Brand'],
                linkedInProfileURL: row['LinkedIn Profile URL'],
                lead: row['Lead First Name'],
                leadLastName: row['Lead Last Name'],
                website: row['Website'],
                marketplace: row['Marketplace'],
                companyName: row['Seller'],
                status: liStatus.includes(row['Status'])
                  ? 'No LinkedIn Available'
                  : 'Unprocessed New Leads',
              };
              await addUnprocessedLead(data);
              inserted += 1;
            } else {
              skipped += 1;
            }
          } catch (error) {
            console.log(error);
          } finally {
            stream.resume();
          }
        })
        .on('end', async () => {
          setTimeout(() => {
            console.log(filename, totalRows, inserted, skipped, 'done');

            leadSourceRepository.update(
              {
                totalRows,
                inserted,
                skipped,
              },
              { where: { leadSourceId: leadSource.leadSourceId } }
            );

            res.status(200).json({
              success: true,
              message: 'Import Success!',
              data: {
                totalRows,
                inserted,
                skipped,
              },
            });
          }, 500);
        });
    } else {
      res.status(200).json({ success: false, message: 'Invalid File Type' });
    }
  }
});

// @desc     GET All lead sources.
// @route    GET /api/v1/agency/leads/leadSources
// @access   Private
exports.getLeadSources = asyncHandler(async (req, res, next) => {
  const response = await getLeadSources(req.query);

  res.status(response.code).json({
    success: response.status,
    message: response.message,
    data: response.data,
    user: req.user.userId,
  });
});

//Delete the duplicate leads with status:"Pitched-LL"
exports.cleanDuplicateLeads = asyncHandler(async (req, res, next) => {
  const data = await cleanDuplicateLeads();
  res.status(200).json({
    success: true,
    data,
  });
});
