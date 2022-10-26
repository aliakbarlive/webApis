import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router';
import { mapValues } from 'lodash';
import moment from 'moment';

import { dateFormatterUTC } from 'utils/formatters';
import PageHeader from 'components/PageHeader';
import LeadForm from './components/LeadForm';
import LeadNoteForm from './components/LeadNoteForm';
// import ConversationForm from './components/ConversationForm';
import LeadProfile from './components/LeadProfile';
import { Card } from 'components';
import TabNav from 'components/TabNav';

const Overview = ({ tabs }) => {
  const { id } = useParams();
  const [refresh, setRefresh] = useState(false);
  const [variables, setVariables] = useState({});
  const [liAccounts, setLiAccounts] = useState({});
  const [selectedLeads, setSelectedLeads] = useState({
    lead: '',
    title: '',
    companyName: '',
    companyLI: '',
    website: '',
    country: '',
    amzStoreFBAstoreFront: '',
    leadScreenShotURL: '',
    competitorScreenShotURL: '',
    linkedInProfileURL: '',
    leadPhotoURL: '',
    remarks: '',
    leadType: 'None',
    leadQuality: 'None',
    status: 'Unprocessed New Leads',
    leadSource: 'LinkedIn',
    dateBooked: '',
    dateOfCall: '',
    dateTimeOfResponse: '',
    dateTimeWeResponded: '',
    pitchDate: '',
    pitchedDate: '',
    typeOfResponse: 'None',
    messageOverview: '',
    currentEarnings: '',
    revenue: '',
    competitorSalesUnits: '',
    competitorBrandName: '',

    source: '',
    amazonProduct: '',
    majorKeywordSearchPage: '',
    competitorsProduct: '',
    competitorsProduct2: '',
    competitorsWebsite: '',
    spokeTo: '',
    address: '',
    personsResponsible: '',
    mainObjectivePainPoints: '',
    otherSalesChannels: '',
    ppcSpend: '',
    avgACOS: '',
    quote: '',
    firstCallSummary: '',
    serviceConditionsForOP: '',
    email: '',
    mockListing: '',
    ownersFullName: '',
    phoneNumber: '',
    aboutUs: '',
    qualifiedFromLIAccount: '',
    qualifiedBy: '',
    totalOfASINSAndVariations: '',
    callRecording: '',
    productCategory: '',
    paymentStatus: '',
    paymentType: '',
    plan: '',
    stage: '',
    averageMonthlyAmazonSales: '',
    averageMonthlyOutsideAmazonSales: '',
    mainIssueWithAmazon: '',
    marketplace: '',
    rejectionReasons: '',
    storeFrontEarnings: '',
    processedByUser: {},
    requestedByUser: {},
    liAccountUsed: {},
    salesRep: '',
    linkedInAccountId: '',
    callAppointmentDate1: '',
    callAppointmentDate2: '',
    callAppointmentDate3: '',
    otherEmails: '',
    callRecording2: '',
    companyAverageMonthlyRevenue: '',
    linkedinContact: '',
    decisionMakersEmail: '',
    instagram: '',
    facebook: '',
    subCategory1: '',
    subCategory2: '',
    channelPartnerType: '',
    asinMajorKeyword: '',
    asinFullTitle: '',
    asinRevenueScreenshot: '',
    competitorAsinRevenueScreenshot: '',
    asinRevenueScreenshotDateStamp: '',
    competitorAsinRevenueScreenshotDateStamp: '',
    brandName: '',
    asinPrice: '',
    asinReviews: '',
    revisionText: '',
    leadLastName: '',
    asin: '',
    secondaryLeadFirstName: '',
    secondaryLeadLastName: '',
    secondaryPhoneNumber: '',
    secondaryEmailAddress: '',
    processedBy: '',
    approvedDate: '',
    revisionDate: '',
    rejectedDate: '',
    dateOfCallScreenshot: '',
    responseDateCallScreenshot: '',
    isFromOldLeads: false,
    prevStatus: '',
    isInSales: false,
    pitcher: '',
  });

  const bookedStatus = ['Direct-Booking', 'Call-Booked', 'RepliedTo', 'Client'];

  const options = {
    plan: [
      { label: '', value: '' },
      { label: 'Account Health', value: 'Account Health' },
      { label: 'Full account management', value: 'Full account management' },
      {
        label: 'Listing content creation only',
        value: 'Listing content creation only',
      },
      { label: 'Product category', value: 'Product category' },
      { label: 'Product research', value: 'Product research' },
      { label: 'Seller launch', value: 'Seller launch' },
      { label: 'Strategic placement', value: 'Strategic placement' },
    ],
    productCategory: [
      { label: '', value: '' },
      { label: 'Garden and outdoors', value: 'Garden and outdoors' },
      { label: 'Arts, Crafts & sewing', value: 'Arts, Crafts & sewing' },
      { label: 'Automotive', value: 'Automotive' },
      { label: 'Baby products', value: 'Baby products' },
      { label: 'Beauty', value: 'Beauty' },
      { label: 'Beauty and personal care', value: 'Beauty and personal care' },
      { label: 'Books', value: 'Books' },
      {
        label: 'Cell phones and accessories',
        value: 'Cell phones and accessories',
      },
      { label: 'Clothing shoes, jewelry', value: 'Clothing shoes, jewelry' },
      { label: 'Computer and accessories', value: 'Computer and accessories' },
      { label: 'Electronics', value: 'Electronics' },
      { label: 'Grocery & gourmet foods', value: 'Grocery & gourmet foods' },
      { label: 'Handmade products', value: 'Handmade products' },
      { label: 'Health and household', value: 'Health and household' },
      { label: 'Home and garden', value: 'Home and garden' },
      { label: 'Home and Kitchen', value: 'Home and Kitchen' },
      { label: 'Health and personal care', value: 'Health and personal care' },
      {
        label: 'Industrial and scientific',
        value: 'Industrial and scientific',
      },
      { label: 'Kitchen and dining', value: 'Kitchen and dining' },
      { label: 'Office supplies', value: 'Office supplies' },
      { label: 'Pet supplies', value: 'Pet supplies' },
      { label: 'Sports and outdoors', value: 'Sports and outdoors' },
      {
        label: 'Stationery and office supplies',
        value: 'Stationery and office supplies',
      },
      {
        label: 'Tools, home improvement & garden',
        value: 'Tools, home improvement & garden',
      },
      { label: 'Toys and games', value: 'Toys and games' },
      { label: 'Patio, lawn and garden', value: 'Patio, lawn and garden' },
      {
        label: 'Baby products (excluding apparel)',
        value: 'Baby products (excluding apparel)',
      },
      {
        label: 'Grocery & gourmet/grills & outdoor cooking/patio',
        value: 'Grocery & gourmet/grills & outdoor cooking/patio',
      },
      { label: 'Camera and photo', value: 'Camera and photo' },
      {
        label: 'UK - Laptop stand/ US- bitcoin wallet',
        value: 'UK - Laptop stand/ US- bitcoin wallet',
      },
      {
        label: 'Vitamins, minerals & supplements',
        value: 'Vitamins, minerals & supplements',
      },
      { label: 'Beer and wine', value: 'Beer and wine' },
      {
        label: 'Beauty and personal care and baby products',
        value: 'Beauty and personal care and baby products',
      },
      { label: 'Fine art', value: 'Fine art' },
      { label: 'Sports collectibles', value: 'Sports collectibles' },
      {
        label: 'Musical instruments and DJ',
        value: 'Musical instruments and DJ',
      },
    ],
    paymentStatus: [
      { label: '', value: '' },
      { label: 'Sent request', value: 'Sent request' },
      { label: 'Quote sent', value: 'Quote sent' },
      { label: 'Pending', value: 'Pending' },
      { label: 'Payment received', value: 'Payment received' },
      { label: 'n/a', value: 'n/a' },
    ],
    paymentType: [
      { label: '', value: '' },
      { label: 'Credit card', value: 'Credit card' },
      { label: 'Bank wire', value: 'Bank wire' },
      { label: 'Cheque', value: 'Cheque' },
    ],
    stage: [
      { label: '', value: '' },
      { label: 'Initial email sent', value: 'Initial email sent' },
      {
        label: 'Pending Approval email sent',
        value: 'Pending Approval email sent',
      },
      { label: 'Call appointment 1', value: 'Call appointment 1' },
      { label: 'Call appointment 2', value: 'Call appointment 2' },
      { label: 'Call appointment 3', value: 'Call appointment 3' },
      { label: 'Call appointment 4', value: 'Call appointment 4' },
      { label: 'Quote sent', value: 'Quote sent' },
      { label: 'Contract sent', value: 'Contract sent' },
      { label: 'Invoice sent', value: 'Invoice sent' },
      { label: 'Hand off to ops team', value: 'Hand off to ops team' },
      { label: 'Follow up', value: 'Follow up' },
      { label: 'Reschedule', value: 'Reschedule' },
      { label: 'Cancelled', value: 'Cancelled' },
      { label: 'Transfer lead to drip', value: 'Transfer lead to drip' },
      { label: 'No show', value: 'No show' },
      { label: 'Repitch', value: 'Repitch' },
    ],
    averageMonthlyAmazonSales: [
      { label: '', value: '' },
      {
        label: 'Not registered on Amazon yet.',
        value: 'Not registered on Amazon yet.',
      },
      { label: '$1 - $5,000', value: '$1 - $5,000' },
      { label: '$5,000 - $10,000', value: '$5,000 - $10,000' },
      { label: '$10,000 - $25,000', value: '$10,000 - $25,000' },
      { label: '$25,000 - $75,000', value: '$25,000 - $75,000' },
      { label: '$75,000 - $150,000', value: '$75,000 - $150,000' },
      { label: '$150,000 - $250,000', value: '$150,000 - $250,000' },
      { label: '$250,000+', value: '$250,000+' },
    ],
    averageMonthlyOutsideAmazonSales: [
      { label: '', value: '' },
      {
        label: 'Not registered on Amazon yet.',
        value: 'Not registered on Amazon yet.',
      },
      { label: '$1 - $5,000', value: '$1 - $5,000' },
      { label: '$5,000 - $10,000', value: '$5,000 - $10,000' },
      { label: '$10,000 - $25,000', value: '$10,000 - $25,000' },
      { label: '$25,000 - $75,000', value: '$25,000 - $75,000' },
      { label: '$75,000 - $150,000', value: '$75,000 - $150,000' },
      { label: '$150,000 - $250,000', value: '$150,000 - $250,000' },
      { label: '$250,000+', value: '$250,000+' },
    ],
    mainIssueWithAmazon: [
      { label: '', value: '' },
      { label: 'Sales Growth', value: 'Sales Growth' },
      { label: 'Profitability', value: 'Profitability' },
      { label: 'Amazon automation', value: 'Amazon automation' },
      { label: 'High acos', value: 'High acos' },
      { label: 'Account setup', value: 'Account setup' },
      {
        label: 'account/listing suspension',
        value: 'account/listing suspension',
      },
      { label: 'Other', value: 'Other' },
      {
        label: 'No time to focus on amazon',
        value: 'No time to focus on amazon',
      },
    ],
    source: [
      { label: '', value: '' },
      { label: 'Ads', value: 'Ads' },
      { label: 'Amazon authority', value: 'Amazon authority' },
      { label: 'Facebook', value: 'Facebook' },
      { label: 'Helpwise', value: 'Helpwise' },
      { label: 'Inbound call', value: 'Inbound call' },
      { label: 'Instagram', value: 'Instagram' },
      { label: 'Lemlist', value: 'Lemlist' },
      { label: 'Linkedin', value: 'Linkedin' },
      { label: 'Podcast', value: 'Podcast' },
      { label: 'Referral', value: 'Referral' },
      { label: 'Seller bites', value: 'Seller bites' },
      { label: 'Unknown', value: 'Unknown' },
      { label: 'Websites', value: 'Websites' },
      { label: 'Youtube', value: 'Youtube' },
      { label: 'Email', value: 'Email' },
      { label: 'Twitter', value: 'Twitter' },
      { label: 'Google ads', value: 'Google ads' },
    ],
  };

  const [status, setStatus] = useState('Unprocessed New Leads');

  const [title, setTitle] = useState('Create Leads');

  const left = (
    <div className="text-xs text-gray-400 flex items-center">[{status}]</div>
  );

  const [navTabs, setNavTabs] = useState([
    {
      name: 'Details',
      href: '#',
      count: '',
      current: true,
    },
    {
      name: 'Profile',
      href: '#',
      count: '',
      current: false,
    },
  ]);

  let currentTab = navTabs.find((t) => t.current === true);

  useEffect(() => {
    axios
      .get(`/agency/leads/variables`, { params: { pageSize: 1000 } })
      .then((res) => {
        setVariables(res.data.data);
      });

    axios
      .get(`/agency/leads/liAccounts?sort=name:asc`, {
        params: { pageSize: 1000 },
      })
      .then((res) => {
        setLiAccounts(res.data.data);
      });
    if (id !== 'create') {
      axios.get(`/agency/leads/${id}`).then((res) => {
        let newValues = { ...res.data.data };
        Object.keys(newValues).map(function (key, index) {
          if (!(key in selectedLeads)) delete newValues[key];
        });

        const valuesNoNull = mapValues(newValues, (val) =>
          val === null ? '' : val
        );

        if (valuesNoNull.pitchDate)
          valuesNoNull.pitchDate = moment(valuesNoNull.pitchDate)
            .utc()
            .format('DD MMM YYYY HH:mm');

        if (valuesNoNull.dateBooked)
          valuesNoNull.dateBooked = moment(valuesNoNull.dateBooked)
            .utc()
            .format('YYYY-MM-DD HH:mm:ss');

        if (valuesNoNull.dateOfCall)
          valuesNoNull.dateOfCall = moment(valuesNoNull.dateOfCall)
            .utc()
            .format('YYYY-MM-DD HH:mm:ss');

        if (valuesNoNull.dateTimeOfResponse)
          valuesNoNull.dateTimeOfResponse = moment(
            valuesNoNull.dateTimeOfResponse
          )
            .utc()
            .format('YYYY-MM-DD HH:mm:ss');

        if (valuesNoNull.dateTimeWeResponded)
          valuesNoNull.dateTimeWeResponded = moment(
            valuesNoNull.dateTimeWeResponded
          )
            .utc()
            .format('YYYY-MM-DD HH:mm:ss');

        if (valuesNoNull.pitchedDate)
          valuesNoNull.pitchedDate = moment(valuesNoNull.pitchedDate)
            .utc()
            .format('YYYY-MM-DD HH:mm:ss');

        if (valuesNoNull.callAppointmentDate1)
          valuesNoNull.callAppointmentDate1 = moment(
            valuesNoNull.callAppointmentDate1
          )
            .utc()
            .format('YYYY-MM-DD HH:mm:ss');

        if (valuesNoNull.callAppointmentDate2)
          valuesNoNull.callAppointmentDate2 = moment(
            valuesNoNull.callAppointmentDate2
          )
            .utc()
            .format('YYYY-MM-DD HH:mm:ss');

        if (valuesNoNull.callAppointmentDate3)
          valuesNoNull.callAppointmentDate3 = moment(
            valuesNoNull.callAppointmentDate3
          )
            .utc()
            .format('YYYY-MM-DD HH:mm:ss');

        if (valuesNoNull.asinRevenueScreenshotDateStamp)
          valuesNoNull.asinRevenueScreenshotDateStamp = moment(
            valuesNoNull.asinRevenueScreenshotDateStamp
          )
            .utc()
            .format('YYYY-MM-DD HH:mm:ss');

        if (valuesNoNull.competitorAsinRevenueScreenshotDateStamp)
          valuesNoNull.competitorAsinRevenueScreenshotDateStamp = moment(
            valuesNoNull.competitorAsinRevenueScreenshotDateStamp
          )
            .utc()
            .format('YYYY-MM-DD HH:mm:ss');

        if (valuesNoNull.approvedDate)
          valuesNoNull.approvedDate = moment(valuesNoNull.approvedDate)
            .utc()
            .format('YYYY-MM-DD HH:mm:ss');

        if (valuesNoNull.revisionDate)
          valuesNoNull.revisionDate = moment(valuesNoNull.revisionDate)
            .utc()
            .format('YYYY-MM-DD HH:mm:ss');
        if (valuesNoNull.rejectedDate)
          valuesNoNull.rejectedDate = moment(valuesNoNull.rejectedDate)
            .utc()
            .format('YYYY-MM-DD HH:mm:ss');

        setTitle(`${valuesNoNull.lead} / ${valuesNoNull.companyName}`);
        setStatus(valuesNoNull.status);
        setSelectedLeads(valuesNoNull);

        if (bookedStatus.includes(valuesNoNull.status)) {
          setNavTabs([
            {
              name: 'Details',
              href: '#',
              count: '',
              current: false,
            },
            {
              name: 'Profile',
              href: '#',
              count: '',
              current: true,
            },
          ]);
        }
      });
    }
  }, [id]);

  const onTabChange = (tab) => {};

  return (
    <>
      <PageHeader
        title={title}
        tabs={tabs.filter((e) => e.isTab)}
        containerClasses={''}
        left={left}
      />
      {bookedStatus.includes(status) && (
        <TabNav
          tabs={navTabs}
          setTabs={setNavTabs}
          onClick={(tab) => onTabChange(tab)}
        />
      )}

      <div className="grid grid-cols-4 gap-4 pt-4">
        {currentTab.name === 'Profile' ? (
          <div className="col-span-4">
            <Card>
              <LeadProfile
                selectedLeads={selectedLeads}
                initialValues={selectedLeads}
                status={status}
                refresh={refresh}
                setRefresh={setRefresh}
                options={options}
              />
            </Card>
          </div>
        ) : (
          <>
            <div className="col-span-4">
              <Card>
                <LeadForm
                  action={id === 'create' ? 'add' : 'update'}
                  selectedLeads={selectedLeads}
                  initialValues={selectedLeads}
                  status={status}
                  refresh={refresh}
                  setRefresh={setRefresh}
                  variables={variables}
                  liAccounts={liAccounts}
                  options={options}
                />
              </Card>
            </div>
            {/* {!['Old-Leads', 'Old-Lead Pending Approval', 'PrePitch'].includes(
              status
            ) && (
              <div className="col-span-4">
                <ConversationForm id={id} liAccounts={liAccounts} />
              </div>
            )} */}
          </>
        )}

        <div className="col-span-4">
          <LeadNoteForm
            selectedLeads={selectedLeads}
            refresh={refresh}
            setRefresh={setRefresh}
          />
        </div>
      </div>
    </>
  );
};

export default Overview;
