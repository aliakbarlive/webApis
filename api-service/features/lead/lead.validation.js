const Joi = require('joi');

const leadRequest = {
  body: Joi.object().keys({
    lead: Joi.string().required(),
    salesRep: Joi.string().guid().allow('', null),
    leadsRep: Joi.string().guid().allow('', null),
    processedBy: Joi.string().guid().allow('', null),
    companyName: Joi.string().required(),
    title: Joi.string().allow('', null),
    website: Joi.string().allow('', null),
    country: Joi.string().allow('', null),
    companyLI: Joi.string().allow('', null),
    amzStoreFBAstoreFront: Joi.string().allow('', null),
    leadScreenShotURL: Joi.string().allow('', null),
    competitorScreenShotURL: Joi.string().allow('', null),
    linkedInProfileURL: Joi.string().allow('', null),
    leadPhotoURL: Joi.string().allow('', null),
    remarks: Joi.string().allow('', null),
    sentFromAcct: Joi.string().allow('', null),
    typeOfResponse: Joi.string().allow('', null), // change this
    messageOverview: Joi.string().allow('', null),
    position: Joi.string().allow('', null),
    liAccount: Joi.string().allow('', null),
    competitorBrandName: Joi.string().allow('', null),
    currentEarnings: Joi.number().allow('', null),
    podId: Joi.number().allow('', null),
    revenue: Joi.number().allow('', null),
    competitorSalesUnits: Joi.number().allow('', null),
    leadSource: Joi.string().allow('', null), // not include in db (in-case will be needed)
    pitchTemplate: Joi.string().allow('', null), // not include in db (in-case will be needed)
    notes: Joi.array(), // not include in db
    leadType: Joi.string().allow('', null),
    leadQuality: Joi.string().valid(
      'None',
      'Low',
      'Medium',
      'High',
      'Ultra-High'
    ),
    status: Joi.string().valid(
      'Old-Leads',
      // 'Old-Lead Pending Approval',
      'Unprocessed New Leads',
      'New Leads',
      'No LinkedIn Available',
      'Unqualified',
      'Approved',
      'Revision',
      'Rejected',
      'Pitched-LL',
      'Direct-Booking',
      'Positive-Response',
      'Neutral-Response',
      'Call-Booked',
      'RepliedTo'
    ),
    dateBooked: Joi.date().allow('', null),
    dateOfCall: Joi.date().allow('', null),
    pitchedDate: Joi.date().allow('', null),
    dateTimeOfResponse: Joi.date().allow('', null),
    dateTimeWeResponded: Joi.date().allow('', null),
    pitchDate: Joi.date().allow('', null),
    source: Joi.string().allow('', null),
    amazonProduct: Joi.string().allow('', null),
    majorKeywordSearchPage: Joi.string().allow('', null),
    competitorsProduct: Joi.string().allow('', null),
    competitorsWebsite: Joi.string().allow('', null),
    spokeTo: Joi.string().allow('', null),
    personsResponsible: Joi.string().allow('', null),
    mainObjectivePainPoints: Joi.string().allow('', null),
    otherSalesChannels: Joi.string().allow('', null),
    ppcSpend: Joi.string().allow('', null),
    avgACOS: Joi.string().allow('', null),
    quote: Joi.string().allow('', null),
    firstCallSummary: Joi.string().allow('', null),
    serviceConditionsForOP: Joi.string().allow('', null),
    email: Joi.string().allow('', null),
    mockListing: Joi.string().allow('', null),
    ownersFullName: Joi.string().allow('', null),
    phoneNumber: Joi.string().allow('', null),
    aboutUs: Joi.string().allow('', null),
    qualifiedFromLIAccount: Joi.string().allow('', null),
    qualifiedBy: Joi.string().allow('', null),
    totalOfASINSAndVariations: Joi.string().allow('', null),
    callRecording: Joi.string().allow('', null),
    productCategory: Joi.string().allow('', null),
    paymentStatus: Joi.string().allow('', null),
    paymentType: Joi.string().allow('', null),
    plan: Joi.string().allow('', null),
    stage: Joi.string().allow('', null),
    averageMonthlyAmazonSales: Joi.string().allow('', null),
    averageMonthlyOutsideAmazonSales: Joi.string().allow('', null),
    mainIssueWithAmazon: Joi.string().allow('', null),
    marketplace: Joi.string().allow('', null),
    storeFrontEarnings: Joi.number().allow('', null),
    rejectionReasons: Joi.string().allow('', null),
    linkedInAccountId: Joi.string().guid().allow('', null),
    competitorsProduct2: Joi.string().allow('', null),
    address: Joi.string().allow('', null),
    callAppointmentDate1: Joi.date().allow('', null),
    callAppointmentDate2: Joi.date().allow('', null),
    callAppointmentDate3: Joi.date().allow('', null),
    otherEmails: Joi.string().allow('', null),
    callRecording2: Joi.string().allow('', null),
    companyAverageMonthlyRevenue: Joi.string().allow('', null),
    linkedinContact: Joi.string().allow('', null),
    decisionMakersEmail: Joi.string().allow('', null),
    instagram: Joi.string().allow('', null),
    facebook: Joi.string().allow('', null),
    subCategory1: Joi.string().allow('', null),
    subCategory2: Joi.string().allow('', null),
    channelPartnerType: Joi.string().allow('', null),
    asinMajorKeyword: Joi.string().allow('', null),
    asinFullTitle: Joi.string().allow('', null),
    asinRevenueScreenshot: Joi.string().allow('', null),
    competitorAsinRevenueScreenshot: Joi.string().allow('', null),
    asinRevenueScreenshotDateStamp: Joi.date().allow('', null),
    competitorAsinRevenueScreenshotDateStamp: Joi.date().allow('', null),
    brandName: Joi.string().allow('', null),
    asinPrice: Joi.number().allow('', null),
    asinReviews: Joi.string().allow('', null),
    revisionText: Joi.string().allow('', null),
    leadLastName: Joi.string().allow('', null),
    asin: Joi.string().allow('', null),
    approvedDate: Joi.date().allow('', null),
    revisionDate: Joi.date().allow('', null),
    rejectedDate: Joi.date().allow('', null),
    dateOfCallScreenshot: Joi.string().allow('', null),
    responseDateCallScreenshot: Joi.string().allow('', null),
    isFromOldLeads: Joi.boolean().allow('', null),
  }),
};

const leadIdParam = {
  params: Joi.object().keys({
    leadId: Joi.string().guid().required(),
  }),
};

const leadNoteIdParam = {
  params: Joi.object().keys({
    leadNoteId: Joi.string().guid().required(),
  }),
};

const leadNoteRequest = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    description: Joi.string().required(),
  }),
};

const leadVariableRequest = {
  body: Joi.object().keys({
    key: Joi.string().required(),
    value: Joi.string().required(),
    description: Joi.string().allow('', null),
  }),
};

const liAccountRequest = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().allow('', null),
    status: Joi.string().allow('', null),
    gender: Joi.string().allow('', null),
    counter: Joi.number().allow('', null),
    category: Joi.number().allow('', null),
  }),
};

module.exports = {
  leadRequest,
  leadIdParam,
  leadNoteIdParam,
  leadNoteRequest,
  leadVariableRequest,
  liAccountRequest,
};
