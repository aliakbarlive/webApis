import { useEffect, Fragment, useState, useCallback, useRef } from 'react';
import { Formik, Field, Form, ErrorMessage, FieldArray } from 'formik';
import { object, string, number, date, array } from 'yup';
import axios from 'axios';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import {
  ClipboardIcon,
  XIcon,
  ExclamationIcon,
  UserCircleIcon,
  LinkIcon,
  ExternalLinkIcon,
  RefreshIcon,
  UploadIcon,
  PhotographIcon,
} from '@heroicons/react/outline';
import ReactTooltip from 'react-tooltip';
import { useHistory, Link } from 'react-router-dom';
import { useParams } from 'react-router';
import { debounce } from 'lodash';
import { Transition } from '@headlessui/react';

import Checkbox from 'components/Forms/Checkbox';
import { selectAuthenticatedUser } from 'features/auth/authSlice';
import { joiAlertErrorsStringify, agoUTC } from 'utils/formatters';
import Label from 'components/Forms/Label';
import Button from 'components/Button';
import { setAlert } from 'features/alerts/alertsSlice';
import usePermissions from 'hooks/usePermissions';
import ConfirmationModal from 'components/ConfirmationModal';
import ConversationForm from './ConversationForm';
import Loading from 'components/Loading';
import Modal from 'components/Modal';
import ModalHeader from 'components/ModalHeader';
import LeadStatusSlideOver from './LeadStatusSlideOver';

moment.tz.setDefault('America/Toronto');

const LeadForm = ({
  action,
  initialValues,
  status,
  refresh,
  setRefresh,
  variables,
  liAccounts,
  options,
}) => {
  const { id } = useParams();
  const history = useHistory();
  const { userCan } = usePermissions();
  const me = useSelector(selectAuthenticatedUser);
  const dispatch = useDispatch();
  const [params, setParams] = useState({
    lead: '',
    companyName: '',
    leadLastName: '',
  });
  const [rejectionChecklist, setRejectionChecklist] = useState([
    { key: 'competitor product not relevant', value: false },
    { key: 'competitor product revenue too low', value: false },
    {
      key: 'competitor product revenue too high / brand too established',
      value: false,
    },
    { key: 'Poor screenshots', value: false },
    { key: 'Lead is Reseller / AMZ Vendor Central', value: false },
    { key: 'Lead storefront Revenue under $5000', value: false },
  ]);
  const [isOpenConfirmation, setIsOpenConfirmation] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [isOpenConfirmationUpdate, setIsOpenConfirmationUpdate] =
    useState(false);
  const [showRevisionChecklist, setShowRevisionChecklist] = useState(false);
  const [notes, setNotes] = useState([]);
  const [like, setLike] = useState([]);
  const [maxLike, setMaxLike] = useState(5);
  const [isAdd, setIsAdd] = useState(action === 'add' ? true : false);
  const [newLeadId, setNewLeadId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showAssignedButton, setShowAssignedButton] = useState(false);
  const [newVal, setNewVal] = useState({});
  const [calendlyUrl, setCalendlyUrl] = useState('');
  const [secondaryInfoModal, setSecondaryInfoModal] = useState(false);
  const [isQualified, setIsQualified] = useState(true);
  const [linkedInAvailable, setLinkedInAvailable] = useState(true);
  const ninetyDays = 7776000000;

  const [pitchCondition, setPitchCondition] = useState(false);
  const variablesOptions =
    variables && variables.rows
      ? variables.rows
          .find((el) => el.key === 'leadMarketPlace')
          .value.split('\n')
      : [];

  const liAccountsOptions =
    liAccounts && liAccounts.rows ? liAccounts.rows : [];

  const exactMatch =
    like.length > 0
      ? like.find(
          (el) =>
            el.companyName.toLowerCase() == params.companyName.toLowerCase()
        )
      : undefined;
  const isDisabled =
    (params.companyName.length < 1 && initialValues.companyName.length < 1) ||
    showAssignedButton ||
    like.length > 0
      ? true
      : false;

  useEffect(() => {
    ReactTooltip.rebuild();
  }, []);

  const currencyGetter = (m) => {
    const mpCurrency = [
      { mp: '.com', currency: '$' },
      { mp: '.ca', currency: '$' },
      { mp: '.de', currency: '€' },
      { mp: '.uk', currency: '£' },
      { mp: '.co.uk', currency: '£' },
    ];
    return mpCurrency.find((el) => el.mp === m)
      ? mpCurrency.find((el) => el.mp === m).currency
      : '';
  };

  const urlGetter = (type, varValue) => {
    let url = '';
    if (type === 'Low') {
      url = varValue.rows.find((el) => el.key === 'lowCalendlyUrl').value;
    } else if (type === 'Medium') {
      url = varValue.rows.find((el) => el.key === 'mediumCalendlyUrl').value;
    } else if (type == 'High') {
      url = varValue.rows.find((el) => el.key === 'highCalendlyUrl').value;
    } else {
      url = varValue.rows.find((el) => el.key === 'ultraHighCalendlyUrl').value;
    }
    return url;
  };

  const numConverter = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const pitchTemplateMaker = (
    {
      lead,
      competitorBrandName,
      brandName,
      revenue,
      currentEarnings,
      leadQuality,
      productCategory,
      companyName,
      asinMajorKeyword,
      competitorSalesUnits,
      leadLastName,
      asinReviews,
      asinPrice,
      asin,
      marketplace,
      linkedInAccountId,
    },
    varValue
  ) => {
    if (varValue && varValue.rows) {
      // aaaaaaaaa
      return `Subject: We found your ASIN: ${asin}              	

Hi ${lead},

Our Amazon team found some insights that you may find interesting. We are looking to expand in the ${productCategory} category and happen to come across your product ${brandName} - ${asinMajorKeyword} for ${currencyGetter(
        marketplace
      )}${numConverter(
        asinPrice
      )} with ${asinReviews} reviews. From your Amazon Listing, you seem to have a solid product.

You can see in the attached screenshot of how your competitor is doing. Brand ${competitorBrandName} earns ${currencyGetter(
        marketplace
      )}${numConverter(revenue)} per month.

${
  currentEarnings > 999
    ? `Your product on Amazon is currently earning ${currencyGetter(
        marketplace
      )}${numConverter(
        currentEarnings
      )}. We believe that it should be doing much better! \n\n`
    : ``
}Do you have a plan in place to address this? If not, we can show you how to close the gap.

Let me know if it is something you want to look into. Here’s the calendar of one of our Amazon Specialists, they won’t mind sharing the market report with you during the call: ${urlGetter(
        leadQuality,
        varValue
      )}

If you'd like to learn more about the call, please visit the link provided below.
https://sellerinteractive.com/book-a-call/LI/

We not only have our own in-house brands, but we have a verifiable track record on Amazon that you can see for yourself. Please visit Ashtonbee Baby, and Kitchables on Amazon.com ${me.firstName.charAt(
        0
      )}${me.lastName.charAt(0)}

Thanks,
${
  linkedInAccountId &&
  liAccountsOptions.find((el) => el.linkedInAccountId === linkedInAccountId)
    ? liAccountsOptions.find((el) => el.linkedInAccountId === linkedInAccountId)
        .name
    : ''
}
      
      `;
    } else {
      return '';
    }
  };

  useEffect(() => {
    initialValues.pitchTemplate = pitchTemplateMaker(initialValues, variables);
    if (initialValues.rejectionReasons) {
      let rejectionReasons = initialValues.rejectionReasons.split(',');
      let newRejectionChecklist = [...rejectionChecklist];

      setRejectionChecklist(
        newRejectionChecklist.map((el) => {
          return {
            ...el,
            value: rejectionReasons.includes(el.key),
          };
        })
      );
    }
    if (
      // (status === 'Old-Leads' || status === 'Unprocessed New Leads') &&
      (action !== 'add' &&
        !initialValues.processedBy &&
        ['Unprocessed New Leads', 'Old-Leads'].includes(status)) ||
      (!initialValues.pitcher &&
        ['Approved'].includes(status) &&
        userCan('leads.pitcher'))
    ) {
      setShowAssignedButton(true);
    } else {
      setShowAssignedButton(false);
    }
  }, [initialValues]);

  useEffect(() => {
    if (
      //params.lead.length > 1 ||
      params.companyName.length > 1
      // params.leadLastName.length > 1
    ) {
      setIsLoading(true);
      axios.get(`/agency/leads/duplicate`, { params }).then((res) => {
        let likeData = res.data.data.filter((el) => el.leadId !== id);
        setPitchCondition(
          likeData.find(
            (el) =>
              params.companyName.toLowerCase() ===
                el.companyName.toLowerCase() &&
              Date.now() < Date.parse(el.pitchedDate) + ninetyDays
          )
        );

        setLike(res.data.data.filter((el) => el.leadId !== id));

        setMaxLike(5);
        setIsLoading(false);
      });
    }
  }, [params]);

  const onCreateLead = async (values) => {
    values.podId = me.memberId && me.memberId.podId ? me.memberId.podId : null;
    values.processedBy = me.userId;
    values.leadsRep = me.userId;
    values.notes = notes;
    // values.status = 'New Leads';
    Object.keys(values).map(function (key, index) {
      if (values[key] === '') delete values[key];
    });
    delete values.processedByUser;
    delete values.requestedByUser;
    delete values.liAccountUsed;
    delete values.requestedByUser;
    try {
      setIsLoading(true);
      const response = await axios.post('/agency/leads', values);
      if (response.data.success) {
        dispatch(setAlert('success', 'Lead Profile Saved'));
        setIsAdd(false);
        setNewLeadId(response.data.data.leadId);
        setIsLoading(false);
      }
    } catch (error) {
      const errorMessages = joiAlertErrorsStringify(error);
      dispatch(setAlert('error', error.response.data.message, errorMessages));
    }
  };

  const onUpdateLead = async (data) => {
    // Delete unused fields
    Object.keys(data).map(function (key, index) {
      if (data[key] === '') delete data[key];
    });

    // On pitched
    if (status !== data.status && data.status === 'Pitched-LL') {
      data.pitchedDate = moment().format('YYYY-MM-DD HH:mm:ss');
    }

    if (status !== data.status && data.status === 'Approved') {
      data.approvedDate = moment().format('YYYY-MM-DD HH:mm:ss');
    }

    if (status !== data.status && data.status === 'Revision') {
      data.revisionDate = moment().format('YYYY-MM-DD HH:mm:ss');
    }

    if (status !== data.status && data.status === 'Rejected') {
      data.rejectedDate = moment().format('YYYY-MM-DD HH:mm:ss');
    }

    if (
      status !== data.status &&
      (data.status === 'Call-Booked' || data.status === 'Direct-Booking')
    ) {
      data.dateBooked = moment().format('YYYY-MM-DD HH:mm:ss');
    }

    if (status === 'Unprocessed New Leads') {
      data.podId = me.memberId && me.memberId.podId ? me.memberId.podId : null;
      data.processedBy = me.userId;
      data.leadsRep = me.userId;
    }

    if (status === 'Unprocessed New Leads' || status === 'Old-Leads') {
      data.prevStatus = status;
    }

    // if (data.status === 'Unqualified') {
    //   // data.status = data.prevStatus ? data.prevStatus : 'Old-Leads';
    //   data.podId = null;
    //   data.processedBy = null;
    //   data.leadsRep = null;
    //   data.pitchDate = null;
    // }

    if (rejectionChecklist.filter((el) => el.value).length > 0) {
      let rejectionReasons = rejectionChecklist
        .filter((el) => el.value)
        .map((el) => el.key)
        .toString();

      data.rejectionReasons = rejectionReasons;
      data.notes = [
        ...notes,
        { name: 'Rejected', description: rejectionReasons },
      ];
    }

    delete data.processedByUser;
    delete data.requestedByUser;
    delete data.liAccountUsed;
    delete data.pitchDate;

    let leadId = id !== 'create' ? id : newLeadId;

    try {
      setIsLoading(true);
      const response = await axios.put(`/agency/leads/${leadId}`, data);
      if (response.data.success) {
        dispatch(setAlert('success', 'Lead Profile Saved'));
        setIsLoading(false);
      }
    } catch (error) {
      const errorMessages = joiAlertErrorsStringify(error);
      dispatch(setAlert('error', error.response.data.message, errorMessages));
    }
  };

  const onSubmit = (values) => {
    if (isAdd) {
      onCreateLead(values);
    } else {
      if (
        status !== values.status &&
        [
          'Direct-Booking',
          'Positive-Response',
          'Neutral-Response',
          'Negative-Response',
          'Call-Booked',
        ].includes(values.status)
      ) {
        // Create Dialog
        setIsStatusOpen(true);
        // alert('show dialog');
      } else {
        onUpdateLead(values);
      }
    }
  };

  const onCancel = async (e, values) => {
    e.preventDefault();
    history.push('/leads');
  };

  const onCopyTemplate = async (e, template) => {
    e.preventDefault();
    navigator.clipboard.writeText(template);
    ReactTooltip.rebuild();
  };

  const updateParamsSearch = async (
    { lead, companyName, leadLastName, params },
    type
  ) => {
    if (type === 'lead') {
      setParams({ ...params, lead });
    } else if (type === 'companyName') {
      setParams({ ...params, companyName });
    } else if (type === 'leadLastName') {
      setParams({ ...params, leadLastName });
    }
  };

  const debouncedUpdateSearch = useCallback(
    debounce((value, type) => updateParamsSearch(value, type), 200),
    []
  );

  const onSearchLead = (e) => {
    debouncedUpdateSearch({ lead: e.target.value, params }, 'lead');
  };

  const onSearchCompanyName = (e) => {
    debouncedUpdateSearch(
      { companyName: e.target.value, params },
      'companyName'
    );
  };

  const onSearchLeadLastName = (e) => {
    debouncedUpdateSearch(
      { leadLastName: e.target.value, params },
      'leadLastName'
    );
  };

  const validationSchema = object().shape(
    !isQualified || !linkedInAvailable
      ? {}
      : {
          lead: string().required('Lead First Name - Required'),
          leadLastName: string().required('Lead Last Name - Required'),
          secondaryLeadFirstName: string(),
          secondaryLeadLastName: string(),
          secondaryPhoneNumber: string(),
          secondaryEmailAddress: string(),

          // title: string().required('Required'), aaaaaaa
          companyName: string().required('Company Name - Required'),
          marketplace: string().required('Marketplace - Required'),
          linkedInAccountId: string().required('LinkedIn Account - Required'),
          leadType: string().required('Fulfilment - Required'),
          productCategory: string().required('Product Category - Required'),
          subCategory1: string().required('Sub category 1 - Required'),
          subCategory2: string().required('Sub category 2 - Required'),
          brandName: string().required('Brand Name- Required'),
          amzStoreFBAstoreFront: string()
            .url()
            .required('Amazon Store Front URL - Required'),
          asin: string().required('ASIN - Required'),
          asinFullTitle: string().required('ASIN Full Title- Required'),
          asinMajorKeyword: string().required('ASIN Major Keyword - Required'),
          asinPrice: number().min(0).required('ASIN Price - Required'),
          asinReviews: string().required('ASIN Reviews - Required'),
          asinRevenueScreenshot: string().required(
            'ASIN Revenue Screenshot - Required'
          ),
          storeFrontEarnings: number()
            .min(0)
            .required('Storefront Revenue - Required'),
          competitorBrandName: string().required(
            'Competitor Brand Name - Required'
          ),
          competitorAsinRevenueScreenshot: string().required(
            'Competitor ASIN Revenue Screenshot - Required'
          ),
          revenue: number()
            .min(0)
            .required('Competitor ASIN Revenue - Required'),
          leadScreenShotURL: string().url().required('ASIN URL - Required'),
          competitorScreenShotURL: string()
            .url()
            .required('Competitor ASIN URL - Required'),
          linkedInProfileURL: string()
            .url()
            .required('LinkedIn Profile URL - Required'),
          currentEarnings: number().min(0).required('ASIN Revenue - Required'),
        }
  );

  const statusOptions = [
    {
      for: 'Old-Leads',
      options: userCan('leads.approve')
        ? [
            'Old-Leads',
            'Approved',
            'No LinkedIn Available',
            'Unqualified',
            'Out of Stock',
            'Less than $5000',
          ]
        : [
            'Old-Leads',
            'Approved',
            'No LinkedIn Available',
            'Unqualified',
            'Out of Stock',
            'Less than $5000',
          ],
    },
    {
      for: 'Old-Lead Pending Approval',
      options: userCan('leads.approve')
        ? ['Old-Lead Pending Approval', 'Approved', 'Revision', 'Rejected']
        : ['Old-Lead Pending Approval'],
    },
    {
      for: 'Pending Approval',
      options: userCan('leads.approve')
        ? ['Pending Approval', 'Approved', 'Revision', 'Rejected']
        : ['Pending Approval'],
    },
    {
      for: 'New Leads',
      options: userCan('leads.approve')
        ? ['New Leads', 'No LinkedIn Available', 'Unqualified', 'Approved']
        : ['New Leads', 'No LinkedIn Available', 'Unqualified', 'Approved'],
    },
    {
      for: 'No LinkedIn Available',
      options: userCan('leads.approve')
        ? [
            'No LinkedIn Available',
            'Approved',
            'Unprocessed New Leads',
            'Unqualified',
            'Out of Stock',
            'Less than $5000',
          ]
        : [
            'No LinkedIn Available',
            'Approved',
            'Unprocessed New Leads',
            'Unqualified',
            'Out of Stock',
            'Less than $5000',
          ],
    },
    {
      for: 'Duplicate',
      options: userCan('leads.approve')
        ? ['Duplicate', 'Unprocessed New Leads', 'Unqualified', 'Approved']
        : ['Duplicate', 'Unprocessed New Leads', 'Unqualified', 'Approved'],
    },
    {
      for: 'Unprocessed New Leads',
      options:
        action === 'add'
          ? ['Unprocessed New Leads', 'Approved']
          : [
              'Unprocessed New Leads',
              'Approved',
              'No LinkedIn Available',
              'Unqualified',
              'Out of Stock',
              'Less than $5000',
            ],
    },
    { for: 'Approved', options: ['Approved', 'Pitched-LL'] },
    {
      for: 'Revision',
      options: userCan('leads.approve')
        ? ['Revision', 'Approved']
        : ['Revision', 'Approved'],
    },
    {
      for: 'Rejected',
      options: userCan('leads.approve')
        ? ['Rejected', 'Approved']
        : ['Rejected', 'Approved'],
    },
    {
      for: 'Pitched-LL',
      options: userCan('leads.approve')
        ? [
            'Pitched-LL',
            'Direct-Booking',
            'Positive-Response',
            'Neutral-Response',
            'Negative-Response',
          ]
        : ['Pitched-LL'],
    },
    {
      for: 'Direct-Booking',
      options: userCan('leads.approve')
        ? ['Direct-Booking']
        : ['Direct-Booking'],
    },
    {
      for: 'Positive-Response',
      options: userCan('leads.approve')
        ? ['Positive-Response', 'Call-Booked']
        : ['Positive-Response', 'Call-Booked'],
    },
    {
      for: 'Neutral-Response',
      options: userCan('leads.approve')
        ? ['Neutral-Response', 'Call-Booked']
        : ['Neutral-Response', 'Call-Booked'],
    },
    {
      for: 'Negative-Response',
      options: userCan('leads.approve')
        ? ['Negative-Response', 'Call-Booked']
        : ['Negative-Response', 'Call-Booked'],
    },
    {
      for: 'Call-Booked',
      options: userCan('leads.approve') ? ['Call-Booked'] : ['Call-Booked'],
    },
    {
      for: 'RepliedTo',
      options: userCan('leads.approve')
        ? ['RepliedTo', 'Call-Booked']
        : ['RepliedTo'],
    },
    // {
    //   for: 'New Response',
    //   options: userCan('leads.approve')
    //     ? ['New Response', 'Booked']
    //     : ['New Response'],
    // },
    {
      for: 'Client',
      options: userCan('leads.approve') ? ['Client'] : ['Client'],
    },
  ];

  const reponseOptions = [
    'Pitched-LL',
    'Direct-Booking',
    'Positive-Response',
    'Neutral-Response',
    'Call-Booked',
    'RepliedTo',
    'Client',
  ];

  const onUpdateExistingRecord = () => {
    setIsOpenConfirmation(false);
    setLike([]);
    history.push(`/leads/profile/${exactMatch.leadId}`);
  };

  const onContinueAnyway = (e) => {
    if (exactMatch) {
      setIsOpenConfirmation(true);
    } else {
      const noteLike = like.map((el) => {
        return `Lead: ${el.lead} & Company Name: ${el.companyName}`;
      });
      setNotes([
        ...notes,
        { name: 'Continue Anyway', description: noteLike.toString() },
      ]);
      setLike([]);
    }

    e.preventDefault();
  };

  const onChangeStatus = (e) => {
    e.preventDefault();
    let value = e.target.value;
    if (value === 'Revision') {
      setShowRevisionChecklist(true);
    } else {
      setShowRevisionChecklist(false);
    }
  };

  const onConfirmUpdate = () => {
    onUpdateLead(newVal);
  };

  const onCheck = (e, el, i) => {
    let copy = [...rejectionChecklist];
    copy[i].value = !copy[i].value;
    setRejectionChecklist(copy);
  };

  const onUpdatePitchTemplate = (e, field, values, setFieldValue) => {
    setFieldValue(
      'pitchTemplate',
      pitchTemplateMaker({ ...values, [field]: e.target.value }, variables)
    );
  };

  const onChangeStoreFront = (e, values, setFieldValue) => {
    let val = parseInt(e.target.value);
    if (val < 10000) {
      setFieldValue('leadQuality', 'Low');
      setFieldValue(
        'pitchTemplate',
        pitchTemplateMaker({ ...values, leadQuality: 'Low' }, variables)
      );
    } else if (val < 50000) {
      setFieldValue('leadQuality', 'Medium');
      setFieldValue(
        'pitchTemplate',
        pitchTemplateMaker({ ...values, leadQuality: 'Medium' }, variables)
      );
    } else if (val < 150000) {
      setFieldValue('leadQuality', 'High');
      setFieldValue(
        'pitchTemplate',
        pitchTemplateMaker({ ...values, leadQuality: 'High' }, variables)
      );
    } else {
      setFieldValue('leadQuality', 'Ultra-High');
      setFieldValue(
        'pitchTemplate',
        pitchTemplateMaker({ ...values, leadQuality: 'Ultra-High' }, variables)
      );
    }
  };

  const onPhasteImage = (e, setFieldValue, field, fieldStamp) => {
    const dT = e.clipboardData || window.clipboardData;
    const file = dT.files[0];
    if (file) {
      getBase64(file)
        .then((result) => {
          setFieldValue(field, result);
          setFieldValue(fieldStamp, moment().format('YYYY-MM-DD HH:mm:ss'));
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      setFieldValue(field, '');
      alert('No image found');
    }
  };

  const onUploadImage = (e, setFieldValue, field, fieldStamp) => {
    const file = e.target.files[0];
    if (file) {
      getBase64(file)
        .then((result) => {
          setFieldValue(field, result);
          setFieldValue(fieldStamp, moment().format('YYYY-MM-DD HH:mm:ss'));
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      setFieldValue(field, '');
      alert('No image found');
    }
  };

  const getBase64 = (file) => {
    return new Promise((resolve) => {
      let baseURL = '';
      // Make new FileReader
      let reader = new FileReader();

      // Convert the file to base64 text
      reader.readAsDataURL(file);

      // on reader load somthing...
      reader.onload = () => {
        baseURL = reader.result;
        resolve(baseURL);
      };
    });
  };

  const copyToClipboard = async (img) => {
    fetch(img)
      .then((res) => res.blob())
      .then(async (blob) => {
        const item = new window.ClipboardItem({ 'image/png': blob });
        await navigator.clipboard.write([item]);
      });
  };

  const RequiredField = ({ short }) => {
    return (
      <span className="text-red-600 text-xs font-light tracking-tighter">
        {short ? '[*Req]' : '[*Required]'}
      </span>
    );
  };

  const onKeyDown = (keyEvent) => {
    if ((keyEvent.charCode || keyEvent.keyCode) === 13) {
      keyEvent.preventDefault();
    }
  };

  const checkErrors = (errors) => {
    Object.keys(errors).map(function (key) {
      dispatch(setAlert('error', errors[key]));
    });
  };

  const onMarkedAsDuplicate = async (e) => {
    e.preventDefault();
    let data = {
      status: 'Duplicate',
    };

    try {
      setIsLoading(true);
      const response = await axios.put(`/agency/leads/${id}`, data);
      if (response.data.success) {
        dispatch(setAlert('success', 'Lead Profile Saved'));
        setIsLoading(false);
        setShowAssignedButton(false);
      }
    } catch (error) {
      const errorMessages = joiAlertErrorsStringify(error);
      dispatch(setAlert('error', error.response.data.message, errorMessages));
    }
  };

  const onAssignToMe = async (e) => {
    e.preventDefault();
    let data =
      status === 'Approved'
        ? {
            pitcher: me.userId,
          }
        : {
            processedBy: me.userId,
            leadsRep: me.userId,
            pitchDate: moment().format('YYYY-MM-DD HH:mm:ss'),
          };

    try {
      setIsLoading(true);
      const response = await axios.put(`/agency/leads/${id}`, data);
      if (response.data.success) {
        dispatch(setAlert('success', 'Lead Profile Saved'));
        setIsLoading(false);
        setShowAssignedButton(false);
      }
    } catch (error) {
      const errorMessages = joiAlertErrorsStringify(error);
      dispatch(setAlert('error', error.response.data.message, errorMessages));
    }
  };

  const onUnAssign = async (e) => {
    e.preventDefault();
    let data =
      status === 'Approved' && initialValues.pitcher
        ? { pitcher: null }
        : {
            podId: null,
            processedBy: null,
            leadsRep: null,
            pitchDate: null,
          };

    try {
      setIsLoading(true);
      const response = await axios.put(`/agency/leads/${id}`, data);
      if (response.data.success) {
        dispatch(setAlert('success', 'Lead Profile Saved'));
        setIsLoading(false);
        setShowAssignedButton(true);
      }
    } catch (error) {
      const errorMessages = joiAlertErrorsStringify(error);
      dispatch(setAlert('error', error.response.data.message, errorMessages));
    }
  };

  const formRef = useRef();

  return (
    <>
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
        enableReinitialize={true}
        innerRef={formRef}
      >
        {({ handleChange, setFieldValue, values, errors }) => (
          <Form onKeyDown={onKeyDown}>
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-12">
                <div className="flex justify-between">
                  {showAssignedButton && !isLoading ? (
                    <Button
                      onClick={(e) => onAssignToMe(e)}
                      classes="mt-2 text-center"
                    >
                      Assign to me
                    </Button>
                  ) : [
                      'Approved',
                      'Old-Leads',
                      'Unprocessed New Leads',
                    ].includes(status) &&
                    !isLoading &&
                    action !== 'add' ? (
                    <Button
                      onClick={(e) => onUnAssign(e)}
                      classes="mt-2 text-center"
                    >
                      Unassign
                    </Button>
                  ) : (
                    <span>&nbsp;</span>
                  )}
                  {userCan('leads.mark.duplicate') && action !== 'add' && (
                    <Button
                      onClick={(e) => onMarkedAsDuplicate(e)}
                      classes="mt-2 text-center"
                    >
                      Marked as duplicate
                    </Button>
                  )}
                </div>
              </div>

              {/* {initialValues.isFromOldLeads &&
                moment().format('YYYY-MM-DD  HH:mm:ss') >
                  moment(initialValues.pitchDate, 'DD MMM YYYY HH:mm')
                    .add(1, 'days')
                    .format('YYYY-MM-DD  HH:mm:ss') &&
                !initialValues.pitchedDate && (
                  <div className="col-span-12">
                    <Button
                      onClick={(e) => onUnAssign(e)}
                      classes="mt-2 text-center"
                    >
                      Unassign/Unqualified (return to prev Status)
                    </Button>
                  </div>
                )} */}
              {['Unprocessed New Leads', 'Old-Leads', 'Approved'].includes(
                status
              ) &&
                action !== 'add' && (
                  <div className="col-span-12">
                    <div className="flex justify-between">
                      <Label>
                        Pitch Template
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            setFieldValue(
                              'pitchTemplate',
                              pitchTemplateMaker(values, variables)
                            );
                          }}
                          data-tip="Reload Template"
                          className="pl-2 pb-0"
                        >
                          <RefreshIcon className="h-5 w-5" color="gray" />
                          <ReactTooltip
                            place="top"
                            className="max-w-xs text-black"
                            backgroundColor="rgba(229, 231, 235, var(--tw-bg-opacity))"
                            textColor="rgba(17, 24, 39, var(--tw-text-opacity))"
                          />
                        </button>
                      </Label>
                      <button
                        onClick={(e) => onCopyTemplate(e, values.pitchTemplate)}
                        data-tip="Copy template"
                        className="pb-1"
                      >
                        <ClipboardIcon className="h-5 w-5" color="gray" />
                        <ReactTooltip
                          place="top"
                          className="max-w-xs text-black"
                          backgroundColor="rgba(229, 231, 235, var(--tw-bg-opacity))"
                          textColor="rgba(17, 24, 39, var(--tw-text-opacity))"
                        />
                      </button>
                    </div>

                    <Field
                      name="pitchTemplate"
                      as="textarea"
                      rows={12}
                      placeholder="Description"
                      className="form-select text-sm"
                    ></Field>
                  </div>
                )}
              <div className="col-span-8">
                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-4">
                    <Label>
                      Lead First Name <RequiredField />
                    </Label>
                    <Field
                      name="lead"
                      placeholder="Lead First Name"
                      className="form-select text-sm"
                      onChange={(e) => (
                        handleChange(e),
                        onSearchLead(e),
                        onUpdatePitchTemplate(e, 'lead', values, setFieldValue)
                      )}
                      type="text"
                    />
                    {/* <ErrorMessage
                      name="lead"
                      component="div"
                      className="text-red-700 font-normal text-xs"
                    /> */}
                  </div>
                  <div className="col-span-4">
                    <Label>
                      Lead Last Name <RequiredField />
                    </Label>
                    <Field
                      name="leadLastName"
                      placeholder="Lead Last Name"
                      className="form-select text-sm"
                      onChange={(e) => (
                        handleChange(e),
                        onSearchLeadLastName(e),
                        onUpdatePitchTemplate(
                          e,
                          'leadLastName',
                          values,
                          setFieldValue
                        )
                      )}
                      type="text"
                    />
                    <ErrorMessage
                      name="leadLastName"
                      component="div"
                      className="text-red-700 font-normal text-xs"
                    />
                  </div>
                  <div className="col-span-4">
                    <Label>
                      Company Name <RequiredField />
                    </Label>
                    <Field
                      name="companyName"
                      placeholder="Company Name"
                      className="form-select text-sm"
                      onChange={(e) => (
                        handleChange(e),
                        onSearchCompanyName(e),
                        onUpdatePitchTemplate(
                          e,
                          'companyName',
                          values,
                          setFieldValue
                        )
                      )}
                      type="text"
                    />
                    {/* <ErrorMessage
                      name="companyName"
                      component="div"
                      className="text-red-700 font-normal text-xs"
                    /> */}
                  </div>
                  <div className="col-span-12">
                    <Transition
                      show={like.length > 0}
                      as={Fragment}
                      enter="transform ease-out duration-300 transition"
                      enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
                      enterTo="translate-y-0 opacity-100 sm:translate-x-0"
                      leave="transition ease-in duration-100"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                    >
                      <div className="overflow-y-auto max-h-100 bg-red-200 shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 ">
                        <div className="p-4">
                          <div className="flex justify-between">
                            <div>
                              <button className="rounded-md inline-flex text-gray-800 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                                <ExclamationIcon
                                  className="mt-2 h-5 w-5"
                                  aria-hidden="true"
                                />
                              </button>
                              <span className="pl-2 text-lg">
                                Might duplicate record with:
                              </span>
                            </div>

                            <div>
                              <button
                                className="bg-white rounded-md inline-flex text-red-600 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                onClick={(e) => onContinueAnyway(e)}
                              >
                                <span className="sr-only">Close</span>
                                <XIcon className="h-5 w-5" aria-hidden="true" />
                              </button>
                            </div>
                          </div>

                          <div>
                            <ul className="pl-2 list-inside list-none text-red-400">
                              <li
                                key="header"
                                className="text-lg py-1 text-red-600"
                              >
                                <div className="grid grid-cols-6 gap-4">
                                  <div>Lead First Name</div>
                                  <div>Lead Last Name</div>
                                  <div>Company Name</div>
                                  <div>Status</div>
                                  <div>Pitch Date</div>
                                  <div>Profile</div>
                                </div>
                              </li>
                              {like.map((rec, i) => {
                                return i < maxLike ? (
                                  <li
                                    key={rec.leadId}
                                    className={
                                      rec.lead
                                        ? 'text-gray-900 break-words'
                                        : 'text-blue-900 break-words'
                                    }
                                  >
                                    <div className={'grid grid-cols-6 gap-4'}>
                                      {rec.lead ? (
                                        <div>{rec.lead}</div>
                                      ) : (
                                        <div className="font-medium ">
                                          Existing Client
                                        </div>
                                      )}

                                      {rec.lead ? (
                                        <div>{rec.leadLastName}</div>
                                      ) : (
                                        <div className="font-medium ">-</div>
                                      )}

                                      <div>{rec.companyName}</div>
                                      <div>{rec.status}</div>
                                      <div>
                                        {rec.pitchedDate
                                          ? agoUTC(rec.pitchedDate)
                                          : ''}
                                      </div>
                                      <div>
                                        {Date.now() <
                                          Date.parse(rec.pitchedDate) +
                                            ninetyDays &&
                                        !userCan('leads.approve') ? (
                                          <UserCircleIcon
                                            className="h-5 w-5 text-gray-500"
                                            aria-hidden="true"
                                          />
                                        ) : (
                                          <Link
                                            to={`/${
                                              rec.lead ? 'leads' : 'clients'
                                            }/profile/${rec.leadId}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                          >
                                            {' '}
                                            <UserCircleIcon
                                              className="h-5 w-5"
                                              aria-hidden="true"
                                            />{' '}
                                          </Link>
                                        )}
                                      </div>
                                    </div>
                                  </li>
                                ) : (
                                  ''
                                );
                              })}
                            </ul>
                          </div>

                          <div className="pt-4 flex justify-between">
                            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                              <Link to={`/leads`}>Cancel</Link>
                            </button>
                            {maxLike === 5 && maxLike < like.length && (
                              <button
                                onClick={(e) => {
                                  setMaxLike(100);
                                  e.preventDefault();
                                }}
                                className=" bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                              >
                                Show All
                              </button>
                            )}

                            <button
                              onClick={(e) => onContinueAnyway(e)}
                              className={
                                pitchCondition
                                  ? ' bg-gray-300 text-white font-bold py-2 px-4 rounded'
                                  : ' bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded'
                              }
                              disabled={pitchCondition ? true : false}
                            >
                              Continue Anyway
                            </button>
                          </div>
                        </div>
                      </div>
                    </Transition>
                  </div>
                  <div className="col-span-6">
                    <Label>Website</Label>
                    <Field
                      name="website"
                      placeholder="Website"
                      className="form-select text-sm"
                      onChange={(e) => handleChange(e)}
                      type="text"
                      disabled={isDisabled}
                    />
                    <ErrorMessage
                      name="website"
                      component="div"
                      className="text-red-700 font-normal text-xs"
                    />
                  </div>
                  {/* <div className="col-span-3">
                    <Label>Country</Label>
                    <Field
                      name="country"
                      placeholder="Country"
                      className="form-select text-sm"
                      onChange={(e) => handleChange(e)}
                      type="text"
                      disabled={isDisabled}
                    />
                    <ErrorMessage
                      name="country"
                      component="div"
                      className="text-red-700 font-normal text-xs"
                    />
                  </div> */}
                  <div className="col-span-3">
                    <Label>
                      Marketplace <RequiredField />
                    </Label>
                    <Field
                      name="marketplace"
                      as="select"
                      className="form-select text-sm"
                      onChange={(e) => (
                        handleChange(e),
                        onUpdatePitchTemplate(
                          e,
                          'marketplace',
                          values,
                          setFieldValue
                        )
                      )}
                      disabled={isDisabled}
                    >
                      <option value=""></option>
                      {variablesOptions.map((rec) => {
                        return <option value={rec}>{rec}</option>;
                      })}
                    </Field>
                  </div>
                  {/* {initialValues.status !== 'PrePitch' && ( */}
                  <div className="col-span-3">
                    <Label>
                      LinkedIn Account <RequiredField />
                    </Label>
                    <Field
                      name="linkedInAccountId"
                      as="select"
                      className="form-select text-sm"
                      disabled={isDisabled}
                      onChange={(e) => {
                        handleChange(e);
                        onUpdatePitchTemplate(
                          e,
                          'linkedInAccountId',
                          values,
                          setFieldValue
                        );
                      }}
                      // aaa
                    >
                      <option value=""></option>
                      {liAccountsOptions.map((rec) => {
                        return (
                          <option value={rec.linkedInAccountId}>
                            {rec.name}
                          </option>
                        );
                      })}
                    </Field>
                  </div>
                  {/* )} */}
                  <div className="col-span-3">
                    <Label>Phone Number</Label>
                    <Field
                      name="phoneNumber"
                      placeholder="Number"
                      className="form-select text-sm"
                      onChange={(e) => handleChange(e)}
                      type="text"
                      disabled={isDisabled}
                    />
                    <ErrorMessage
                      name="phoneNumber"
                      component="div"
                      className="text-red-700 font-normal text-xs"
                    />
                  </div>

                  <div className="col-span-6">
                    <Label>Email</Label>
                    <Field
                      name="email"
                      placeholder="Email"
                      className="form-select text-sm"
                      onChange={(e) => handleChange(e)}
                      type="text"
                      disabled={isDisabled}
                    />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="text-red-700 font-normal text-xs"
                    />
                  </div>

                  {/* <div className="col-span-4">
                    <Label>
                      Linkedin Contact <RequiredField />
                    </Label>
                    <Field
                      name="linkedinContact"
                      placeholder="Linkedin Contact"
                      className="form-select text-sm"
                      onChange={(e) => handleChange(e)}
                      type="text"
                      disabled={isDisabled}
                    />
                    <ErrorMessage
                      name="asinFullTitle"
                      component="div"
                      className="text-red-700 font-normal text-xs"
                    />
                  </div> */}
                  {/* <div className="col-span-4">
                    <Label>Decision Maker's Email</Label>
                    <Field
                      name="decisionMakersEmail"
                      placeholder="Decision Maker's Email"
                      className="form-select text-sm"
                      onChange={(e) => handleChange(e)}
                      type="text"
                      disabled={isDisabled}
                    />
                    <ErrorMessage
                      name="decisionMakersEmail"
                      component="div"
                      className="text-red-700 font-normal text-xs"
                    />
                  </div> */}
                  <div className="col-span-6">
                    <Label>
                      Instagram URL{' '}
                      {values.instagram && (
                        <LinkIcon
                          onClick={() =>
                            window.open(values.instagram, '_blank')
                          }
                          className="cursor-pointer ml-2 inline h-5 w-5"
                          color="gray"
                        />
                      )}
                    </Label>
                    <Field
                      name="instagram"
                      placeholder="Instagram URL"
                      className="form-select text-sm"
                      onChange={(e) => handleChange(e)}
                      type="text"
                      disabled={isDisabled}
                    />
                    <ErrorMessage
                      name="instagram"
                      component="div"
                      className="text-red-700 font-normal text-xs"
                    />
                  </div>
                  <div className="col-span-6">
                    <Label>
                      Facebook URL{' '}
                      {values.facebook && (
                        <LinkIcon
                          onClick={() => window.open(values.facebook, '_blank')}
                          className="cursor-pointer ml-2 inline h-5 w-5"
                          color="gray"
                        />
                      )}
                    </Label>
                    <Field
                      name="facebook"
                      placeholder="Facebook URL"
                      className="form-select text-sm"
                      onChange={(e) => handleChange(e)}
                      type="text"
                      disabled={isDisabled}
                    />
                    <ErrorMessage
                      name="facebook"
                      component="div"
                      className="text-red-700 font-normal text-xs"
                    />
                  </div>

                  <div className="col-span-6">
                    <Label>
                      LinkedIn Profile URL (none-Sales Navigator)
                      <RequiredField />{' '}
                      {values.linkedInProfileURL && (
                        <LinkIcon
                          onClick={() =>
                            window.open(values.linkedInProfileURL, '_blank')
                          }
                          className="cursor-pointer ml-2 inline h-5 w-5"
                          color="gray"
                        />
                      )}
                    </Label>
                    <Field
                      name="linkedInProfileURL"
                      placeholder="LinkedIn Profile URL"
                      className="form-select text-sm"
                      onChange={(e) => handleChange(e)}
                      type="text"
                      disabled={isDisabled}
                    />
                    <ErrorMessage
                      name="linkedInProfileURL"
                      component="div"
                      className="text-red-700 font-normal text-xs"
                    />
                  </div>
                </div>
              </div>
              <div className="col-span-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-1">
                    <Label>Status</Label>
                    <Field
                      name="status"
                      as="select"
                      className="form-select text-sm"
                      disabled={isDisabled}
                      onChange={(e) => {
                        handleChange(e);
                        onChangeStatus(e);
                        setIsQualified(
                          e.target.value === 'Unqualified' ? false : true
                        );
                        setLinkedInAvailable(
                          e.target.value === 'No LinkedIn Available' ||
                            e.target.value === 'Out of Stock' ||
                            e.target.value === 'Less than $5000'
                            ? false
                            : true
                        );
                      }}
                    >
                      {statusOptions.find((e) => e.for === status) &&
                        statusOptions
                          .find((e) => e.for === status)
                          .options.map((s) => {
                            return (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            );
                          })}
                    </Field>
                  </div>
                  <div className="col-span-1 pt-3">
                    {isLoading ? (
                      <Loading />
                    ) : (
                      <Button
                        onClick={() => checkErrors(errors)}
                        type="submit"
                        classes="mt-2 w-full"
                        disabled={isDisabled}
                      >
                        Update Status & Save
                      </Button>
                    )}
                  </div>
                  {((showRevisionChecklist && action !== 'add') ||
                    status === 'Revision') && (
                    <div className="col-span-2">
                      {rejectionChecklist.map((el, i) => {
                        return (
                          <div key={el.key}>
                            <Checkbox
                              id={el.key}
                              checked={el.value}
                              onChange={(e) => onCheck(e, el, i)}
                            />
                            <span className="pl-4">{el.key}</span>
                          </div>
                        );
                      })}
                      <Label>Other Reason for Revision</Label>
                      <Field
                        name="revisionText"
                        placeholder="Other Reason for Revision"
                        className="form-select text-sm"
                        onChange={(e) => handleChange(e)}
                        type="text"
                        disabled={isDisabled}
                      />
                      <ErrorMessage
                        name="revisionText"
                        component="div"
                        className="text-red-700 font-normal text-xs"
                      />
                    </div>
                  )}
                  {reponseOptions.includes(initialValues.status) && (
                    <>
                      <div className="col-span-1">
                        <Label>Type Of Response </Label>
                        <Field
                          name="typeOfResponse"
                          as="select"
                          className="form-select text-sm"
                          disabled={isDisabled}
                        >
                          <option value="None">None</option>
                          <option value="DirectBooking">DirectBooking</option>
                          <option value="NeutralResponse">
                            NeutralResponse
                          </option>
                          <option value="NeutralResponsetoBookedCall">
                            NeutralResponsetoBookedCall
                          </option>
                          <option value="PositiveResponse">
                            PositiveResponse
                          </option>
                          <option value="PositiveResponsetoBookedCall">
                            PositiveResponsetoBookedCall
                          </option>
                        </Field>
                      </div>
                      <div className="col-span-1">
                        <Label>Remarks</Label>
                        <Field
                          name="remarks"
                          placeholder="Remarks"
                          className="form-select text-sm"
                          onChange={(e) => handleChange(e)}
                          type="text"
                          disabled={isDisabled}
                        />
                        <ErrorMessage
                          name="remarks"
                          component="div"
                          className="text-red-700 font-normal text-xs"
                        />
                      </div>
                    </>
                  )}

                  <div className="col-span-1">
                    <Label>
                      Fulfilment <RequiredField />
                    </Label>
                    <Field
                      name="leadType"
                      as="select"
                      className="form-select text-sm"
                      disabled={isDisabled}
                    >
                      <option value="None">None</option>
                      <option value="FBA">FBA</option>
                      <option value="FBM">FBM</option>
                      {/* <option value="AMZ">AMZ</option>
                      <option value="Wholesales to reseller">
                        Wholesales to reseller
                      </option>
                      <option value="Channel Partner">Channel Partner</option> */}
                    </Field>
                  </div>

                  <div className="col-span-1">
                    <Label>Lead Quality</Label>
                    <Field
                      name="leadQuality"
                      as="select"
                      className="form-select text-sm"
                      disabled={true}
                    >
                      <option key="Low" value="Low">
                        Low
                      </option>
                      <option key="Medium" value="Medium">
                        Medium
                      </option>
                      <option key="High" value="High">
                        High
                      </option>
                      <option key="Ultra-High" value="Ultra-High">
                        Ultra-High
                      </option>
                    </Field>
                  </div>
                  {values.leadType === 'Channel Partner' && (
                    <div className="col-span-2">
                      <Label>Channel Partner Type</Label>
                      <Field
                        name="channelPartnerType"
                        placeholder="Channel Partner Type"
                        className="form-select text-sm"
                        onChange={(e) => handleChange(e)}
                        type="text"
                        disabled={isDisabled}
                      />
                      <ErrorMessage
                        name="channelPartnerType"
                        component="div"
                        className="text-red-700 font-normal text-xs"
                      />
                    </div>
                  )}

                  <div className="col-span-2">
                    <Label>Message Overview</Label>
                    <Field
                      name="messageOverview"
                      placeholder="Message Overview"
                      className="form-select text-sm"
                      onChange={(e) => handleChange(e)}
                      // type="text"
                      as="textarea"
                      disabled={isDisabled}
                    />
                    <ErrorMessage
                      name="messageOverview"
                      component="div"
                      className="text-red-700 font-normal text-xs"
                    />
                  </div>
                  <Button
                    onClick={() => setSecondaryInfoModal(true)}
                    classes="mt-2 w-full text-center"
                    disabled={false}
                  >
                    {values.secondaryEmailAddress ||
                    values.secondaryPhoneNumber ||
                    values.secondaryLeadFirstName ||
                    values.secondaryLeadLastName
                      ? 'View and Update Contact'
                      : 'Add Contact'}
                  </Button>

                  <Modal
                    open={secondaryInfoModal}
                    setOpen={setSecondaryInfoModal}
                    as={'div'}
                    align="top"
                    noOverlayClick={true}
                    persistent={true}
                  >
                    <div className="inline-block w-full max-w-xl my-8 text-left align-middle transition-all transform bg-white shadow-xl rounded-xl">
                      <ModalHeader
                        title="Secondary Contact Information"
                        titleClasses="text-sm font-normal"
                        setOpen={setSecondaryInfoModal}
                        showCloseButton={true}
                      />
                      <div className="flex flex-row justify-around	py-4">
                        <div className="basis-1/2">
                          <Label>Lead First Name</Label>
                          <Field
                            name="secondaryLeadFirstName"
                            placeholder="First Name"
                            className="form-select text-sm"
                            onChange={(e) => handleChange(e)}
                            type="text"
                          />
                          <ErrorMessage
                            name="secondaryLeadFirstName"
                            component="div"
                            className="text-red-700 font-normal text-xs"
                          />
                        </div>
                        <div className="basis-1/2">
                          <Label>Lead Last Name</Label>
                          <Field
                            name="secondaryLeadLastName"
                            placeholder="Last Name"
                            className="form-select text-sm"
                            onChange={(e) => handleChange(e)}
                            type="text"
                          />
                          <ErrorMessage
                            name="secondaryLeadLastName"
                            component="div"
                            className="text-red-700 font-normal text-xs"
                          />
                        </div>
                      </div>
                      <div className="flex flex-row justify-around	py-4">
                        <div className="basis-1/2">
                          <Label>Phone Number</Label>
                          <Field
                            name="secondaryPhoneNumber"
                            placeholder="Phone Number"
                            className="form-select text-sm"
                            onChange={(e) => handleChange(e)}
                            type="text"
                          />
                          <ErrorMessage
                            name="secondaryPhoneNumber"
                            component="div"
                            className="text-red-700 font-normal text-xs"
                          />
                        </div>
                        <div className="basis-1/2">
                          <Label>Email Address</Label>
                          <Field
                            name="secondaryEmailAddress"
                            placeholder="Email Address"
                            className="form-select text-sm"
                            onChange={(e) => handleChange(e)}
                            type="text"
                          />
                          <ErrorMessage
                            name="secondaryEmailAddress"
                            component="div"
                            className="text-red-700 font-normal text-xs"
                          />
                        </div>
                      </div>
                      <div className="flex flex-row justify-center	py-4">
                        <div className="basis-1/2 px-2">
                          <Button
                            onClick={() => {
                              onSubmit(values);

                              setSecondaryInfoModal(false);
                            }}
                            classes="mt-2 w-full text-center"
                            disabled={false}
                          >
                            Save New Contact
                          </Button>
                        </div>
                        <div className="basis-1/2 px-2">
                          <Button
                            onClick={() => {
                              let tempLead = values.lead;
                              let tempLeadLastName = values.leadLastName;
                              let tempPhone = values.phoneNumber;
                              let tempEmail = values.email;

                              values.lead = values.secondaryLeadFirstName;
                              values.leadLastName =
                                values.secondaryLeadLastName;
                              values.phoneNumber = values.secondaryPhoneNumber;
                              values.email = values.secondaryEmailAddress;

                              values.secondaryLeadFirstName = tempLead;
                              values.secondaryLeadLastName = tempLeadLastName;
                              values.secondaryPhoneNumber = tempPhone;
                              values.secondaryEmailAddress = tempEmail;
                              setSecondaryInfoModal(false);
                            }}
                            classes="mt-2 w-full text-center"
                            disabled={false}
                          >
                            Change To Primary
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Modal>
                </div>
              </div>
              <div className="col-span-8">
                <div className="pr-2 grid grid-cols-12 gap-4">
                  <div className="col-span-12 py-4">
                    <p className="border-b-4 uppercase text-base font-semibold">
                      Amazon store and product details
                    </p>
                  </div>

                  <div className="col-span-4">
                    <Label>
                      Product Category <RequiredField />
                    </Label>
                    <Field
                      name="productCategory"
                      as="select"
                      className="form-select text-sm"
                      onChange={(e) => {
                        handleChange(e);
                        onUpdatePitchTemplate(
                          e,
                          'productCategory',
                          values,
                          setFieldValue
                        );
                      }}
                      disabled={isDisabled}
                    >
                      {options.productCategory.map((el) => {
                        return <option value={el.value}>{el.label}</option>;
                      })}
                    </Field>
                  </div>

                  <div className="col-span-4">
                    <Label>
                      Sub category 1 <RequiredField />
                    </Label>
                    <Field
                      name="subCategory1"
                      placeholder="Sub category 1"
                      className="form-select text-sm"
                      onChange={(e) => handleChange(e)}
                      type="text"
                      disabled={isDisabled}
                    />
                    <ErrorMessage
                      name="subCategory1"
                      component="div"
                      className="text-red-700 font-normal text-xs"
                    />
                  </div>

                  <div className="col-span-4">
                    <Label>
                      Sub category 2 <RequiredField />
                    </Label>
                    <Field
                      name="subCategory2"
                      placeholder="Sub category 2"
                      className="form-select text-sm"
                      onChange={(e) => handleChange(e)}
                      type="text"
                      disabled={isDisabled}
                    />
                    <ErrorMessage
                      name="subCategory2"
                      component="div"
                      className="text-red-700 font-normal text-xs"
                    />
                  </div>

                  <div className="col-span-4">
                    <Label>
                      Brand Name <RequiredField />
                    </Label>
                    <Field
                      name="brandName"
                      placeholder="Brand Name"
                      className="form-select text-sm"
                      onChange={(e) => {
                        handleChange(e);
                        onUpdatePitchTemplate(
                          e,
                          'brandName',
                          values,
                          setFieldValue
                        );
                      }}
                      type="text"
                      disabled={isDisabled}
                    />
                    <ErrorMessage
                      name="brandName"
                      component="div"
                      className="text-red-700 font-normal text-xs"
                    />
                  </div>
                  <div className="col-span-8">
                    <Label>
                      Amazon Store Front URL <RequiredField />{' '}
                      {values.amzStoreFBAstoreFront && (
                        <LinkIcon
                          onClick={() =>
                            window.open(values.amzStoreFBAstoreFront, '_blank')
                          }
                          className="cursor-pointer ml-2 inline h-5 w-5"
                          color="gray"
                        />
                      )}
                    </Label>
                    <Field
                      name="amzStoreFBAstoreFront"
                      placeholder="Amazon Store Front URL"
                      className="form-select text-sm"
                      onChange={(e) => handleChange(e)}
                      type="text"
                      disabled={isDisabled}
                    />
                    <ErrorMessage
                      name="amzStoreFBAstoreFront"
                      component="div"
                      className="text-red-700 font-normal text-xs"
                    />
                  </div>

                  <div className="col-span-6">
                    <Label>
                      ASIN URL <RequiredField />{' '}
                      {values.leadScreenShotURL && (
                        <LinkIcon
                          onClick={() =>
                            window.open(values.leadScreenShotURL, '_blank')
                          }
                          className="cursor-pointer ml-2 inline h-5 w-5"
                          color="gray"
                        />
                      )}
                    </Label>
                    <Field
                      name="leadScreenShotURL"
                      placeholder="ASIN URL"
                      className="form-select text-sm"
                      onChange={(e) => handleChange(e)}
                      type="text"
                      disabled={isDisabled}
                    />
                    <ErrorMessage
                      name="leadScreenShotURL"
                      component="div"
                      className="text-red-700 font-normal text-xs"
                    />
                  </div>

                  <div className="col-span-6"></div>

                  <div className="col-span-2">
                    <Label>
                      ASIN <RequiredField />
                    </Label>
                    <Field
                      name="asin"
                      placeholder="ASIN"
                      className="form-select text-sm"
                      onChange={(e) => {
                        handleChange(e);
                        onUpdatePitchTemplate(e, 'asin', values, setFieldValue);
                      }}
                      type="text"
                      disabled={isDisabled}
                    />
                    <ErrorMessage
                      name="asin"
                      component="div"
                      className="text-red-700 font-normal text-xs"
                    />
                  </div>

                  <div className="col-span-2">
                    <Label>
                      ASIN Full Title <RequiredField short={true} />
                    </Label>
                    <Field
                      name="asinFullTitle"
                      placeholder="ASIN Full Title"
                      className="form-select text-sm"
                      onChange={(e) => handleChange(e)}
                      type="text"
                      disabled={isDisabled}
                    />
                    <ErrorMessage
                      name="asinFullTitle"
                      component="div"
                      className="text-red-700 font-normal text-xs"
                    />
                  </div>

                  <div className="col-span-4">
                    <Label>
                      ASIN Major Keyword <RequiredField />
                    </Label>
                    <Field
                      name="asinMajorKeyword"
                      placeholder="ASIN Major Keyword"
                      className="form-select text-sm"
                      onChange={(e) => {
                        handleChange(e);
                        onUpdatePitchTemplate(
                          e,
                          'asinMajorKeyword',
                          values,
                          setFieldValue
                        );
                      }}
                      type="text"
                      disabled={isDisabled}
                    />
                    <ErrorMessage
                      name="asinMajorKeyword"
                      component="div"
                      className="text-red-700 font-normal text-xs"
                    />
                  </div>

                  <div className="col-span-2">
                    <Label>
                      ASIN Price <RequiredField />
                    </Label>
                    <Field
                      name="asinPrice"
                      placeholder="ASIN Price"
                      className="form-select text-sm"
                      onChange={(e) => {
                        handleChange(e);
                        onUpdatePitchTemplate(
                          e,
                          'asinPrice',
                          values,
                          setFieldValue
                        );
                      }}
                      type="number"
                      disabled={isDisabled}
                    />
                    <ErrorMessage
                      name="asinPrice"
                      component="div"
                      className="text-red-700 font-normal text-xs"
                    />
                  </div>
                  <div className="col-span-2">
                    <Label>
                      ASIN Reviews
                      <RequiredField short={true} />
                    </Label>
                    <Field
                      name="asinReviews"
                      placeholder="ASIN Reviews"
                      className="form-select text-sm"
                      onChange={(e) => {
                        handleChange(e);
                        onUpdatePitchTemplate(
                          e,
                          'asinReviews',
                          values,
                          setFieldValue
                        );
                      }}
                      type="text"
                      disabled={isDisabled}
                    />
                    <ErrorMessage
                      name="asinReviews"
                      component="div"
                      className="text-red-700 font-normal text-xs"
                    />
                  </div>

                  {values.asinRevenueScreenshot ? (
                    <div className="col-span-6">
                      <Label>
                        ASIN Revenue Screenshot <RequiredField />
                        <XIcon
                          onClick={() =>
                            setFieldValue('asinRevenueScreenshot', '')
                          }
                          className="cursor-pointer ml-2 inline h-5 w-5"
                          color="gray"
                          data-tip="Change screenshot"
                        />
                        <ExternalLinkIcon
                          onClick={() => {
                            let image = new Image();
                            image.src = values.asinRevenueScreenshot;
                            window.open('').document.write(image.outerHTML);
                          }}
                          className="cursor-pointer ml-2 inline h-5 w-5"
                          color="gray"
                          data-tip="Open in new tab"
                        />
                        <ClipboardIcon
                          onClick={() =>
                            copyToClipboard(values.asinRevenueScreenshot)
                          }
                          className="cursor-pointer ml-2 inline h-5 w-5"
                          color="gray"
                          data-tip="Copy image"
                        />
                        <ReactTooltip
                          place="bottom"
                          className="max-w-xs text-black"
                          backgroundColor="rgba(229, 231, 235, var(--tw-bg-opacity))"
                          textColor="rgba(17, 24, 39, var(--tw-text-opacity))"
                        />
                      </Label>

                      <img
                        id="target"
                        src={values.asinRevenueScreenshot}
                        data-tip={values.asinRevenueScreenshotDateStamp}
                        className="border-2 border-indigo-600"
                      />
                      <ReactTooltip
                        place="bottom"
                        className="max-w-xs text-black"
                        backgroundColor="rgba(229, 231, 235, var(--tw-bg-opacity))"
                        textColor="rgba(17, 24, 39, var(--tw-text-opacity))"
                      />
                    </div>
                  ) : (
                    <div className="col-span-6">
                      <div className="flex flex-row justify-between">
                        <div>
                          <Label>
                            ASIN Revenue Screenshot <RequiredField />
                          </Label>
                        </div>
                        <div>
                          <label for="upload" title="Upload image">
                            <UploadIcon
                              className="h-5 w-5 cursor-pointer"
                              color="gray"
                              data-tip="Upload image"
                            />
                          </label>
                          <input
                            id="upload"
                            type="file"
                            accept="image/*"
                            hidden
                            onChange={(e) =>
                              onUploadImage(
                                e,
                                setFieldValue,
                                'asinRevenueScreenshot',
                                'asinRevenueScreenshotDateStamp'
                              )
                            }
                          />
                        </div>
                      </div>

                      <Field
                        name="asinRevenueScreenshot"
                        placeholder="Paste image here"
                        className="form-select text-sm"
                        onPaste={(e) =>
                          onPhasteImage(
                            e,
                            setFieldValue,
                            'asinRevenueScreenshot',
                            'asinRevenueScreenshotDateStamp'
                          )
                        }
                        as="textarea"
                        disabled={isDisabled}
                      />
                      <ErrorMessage
                        name="asinRevenueScreenshot"
                        component="div"
                        className="text-red-700 font-normal text-xs"
                      />
                    </div>
                  )}

                  <div className="col-span-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-1">
                        <Label>
                          ASIN Revenue &nbsp; &nbsp; &nbsp;
                          <RequiredField />
                        </Label>
                        <Field
                          name="currentEarnings"
                          placeholder="ASIN Revenue"
                          className="form-select text-sm"
                          onChange={(e) => {
                            handleChange(e);
                            onUpdatePitchTemplate(
                              e,
                              'currentEarnings',
                              values,
                              setFieldValue
                            );
                          }}
                          type="number"
                          disabled={isDisabled}
                        />
                        <ErrorMessage
                          name="currentEarnings"
                          component="div"
                          className="text-red-700 font-normal text-xs"
                        />
                      </div>
                      <div className="col-span-1"></div>
                      <div className="col-span-1">
                        <Label>
                          Storefront Revenue <RequiredField />
                        </Label>
                        <Field
                          name="storeFrontEarnings"
                          placeholder="Storefront Revenue"
                          className="form-select text-sm"
                          onChange={(e) => {
                            handleChange(e);
                            onChangeStoreFront(e, values, setFieldValue);
                          }}
                          type="number"
                          disabled={isDisabled}
                        />
                        <ErrorMessage
                          name="storeFrontEarnings"
                          component="div"
                          className="text-red-700 font-normal text-xs"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {initialValues.status !== 'Old-Leads' && (
                <div className="col-span-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-1">
                      <Label>Pitch Date Added</Label>
                      <p className="text-sm py-2">
                        {initialValues.pitchDate
                          ? initialValues.pitchDate
                          : 'N/A'}
                      </p>
                    </div>

                    {/* <div className="col-span-1">
                      <Label>Approved Date</Label>
                      <p className="text-sm py-2">
                        {initialValues.approvedDate
                          ? initialValues.approvedDate
                          : 'N/A'}
                      </p>
                    </div> */}

                    <div className="col-span-1">
                      <Label>Pitched Date</Label>
                      <p className="text-sm py-2">
                        {initialValues.pitchedDate
                          ? initialValues.pitchedDate
                          : 'N/A'}
                      </p>
                    </div>

                    <div className="col-span-2">
                      <Label>
                        Date and Time Lead Responded to Pitch
                        {initialValues.responseDateCallScreenshot && (
                          <PhotographIcon
                            onClick={() => {
                              let image = new Image();
                              image.src =
                                initialValues.responseDateCallScreenshot;
                              window.open('').document.write(image.outerHTML);
                            }}
                            className="cursor-pointer ml-2 inline h-5 w-5"
                            color="gray"
                            data-tip="Show screenshot in new tab"
                          />
                        )}
                      </Label>
                      <p className="text-sm py-2">
                        {initialValues.dateTimeOfResponse
                          ? initialValues.dateTimeOfResponse
                          : 'N/A'}
                      </p>
                    </div>

                    <div className="col-span-2">
                      <Label>Date and Time We Responded</Label>
                      <p className="text-sm py-2">
                        {initialValues.dateTimeWeResponded
                          ? initialValues.dateTimeWeResponded
                          : 'N/A'}
                      </p>
                    </div>

                    <div className="col-span-2">
                      <Label>
                        Date of Scheduled Call
                        {initialValues.dateOfCallScreenshot && (
                          <PhotographIcon
                            onClick={() => {
                              let image = new Image();
                              image.src = initialValues.dateOfCallScreenshot;
                              window.open('').document.write(image.outerHTML);
                            }}
                            className="cursor-pointer ml-2 inline h-5 w-5"
                            color="gray"
                            data-tip="Show screenshot in new tab"
                          />
                        )}
                      </Label>
                      <p className="text-sm py-2">
                        {initialValues.dateOfCall
                          ? initialValues.dateOfCall
                          : 'N/A'}
                      </p>
                    </div>

                    <div className="col-span-2">
                      <Label>Date Lead Booked Call w/ SI</Label>
                      <p className="text-sm py-2">
                        {initialValues.dateBooked
                          ? initialValues.dateBooked
                          : 'N/A'}
                      </p>
                    </div>

                    {/* <div className="col-span-2">
                      <Label>Date and Time Lead Responded to Pitch</Label>
                      <p className="text-sm py-2">
                        {initialValues.dateTimeOfResponse
                          ? initialValues.dateTimeOfResponse
                          : 'N/A'}
                      </p>
                    </div> */}

                    {/* <div className="col-span-2">
                      <Label>Date Of Call</Label>
                      <Field
                        name="dateOfCall"
                        placeholder="Date Of Call"
                        className="form-select text-sm"
                        onChange={(e) => handleChange(e)}
                        type="date"
                        disabled={isDisabled}
                      />
                      <ErrorMessage
                        name="dateOfCall"
                        component="div"
                        className="text-red-700 font-normal text-xs"
                      />
                    </div>
                    <div className="col-span-2">
                      <Label>Date Time Of Response</Label>
                      <Field
                        name="dateTimeOfResponse"
                        placeholder="Date Time Of Response"
                        className="form-select text-sm"
                        onChange={(e) => handleChange(e)}
                        type="date"
                        disabled={isDisabled}
                      />
                      <ErrorMessage
                        name="dateTimeOfResponse"
                        component="div"
                        className="text-red-700 font-normal text-xs"
                      />
                    </div>
                    <div className="col-span-2">
                      <Label>Date Time We Responded</Label>
                      <Field
                        name="dateTimeWeResponded"
                        placeholder="Date Time We Responded"
                        className="form-select text-sm"
                        onChange={(e) => handleChange(e)}
                        type="date"
                        disabled={isDisabled}
                      />
                      <ErrorMessage
                        name="dateTimeWeResponded"
                        component="div"
                        className="text-red-700 font-normal text-xs"
                      />
                    </div> */}
                  </div>
                </div>
              )}
              <div className="col-span-8">
                <div className="grid grid-cols-4 gap-4">
                  <div className="col-span-4 py-4">
                    <p className="border-b-4 uppercase text-base font-semibold">
                      Competitor Comparable
                    </p>
                  </div>
                  <div className="col-span-2">
                    <Label>
                      Competitor Brand Name <RequiredField />
                    </Label>
                    <Field
                      name="competitorBrandName"
                      placeholder="Competitor Brand Name"
                      className="form-select text-sm"
                      onChange={(e) => {
                        handleChange(e);
                        onUpdatePitchTemplate(
                          e,
                          'competitorBrandName',
                          values,
                          setFieldValue
                        );
                      }}
                      type="text"
                      disabled={isDisabled}
                    />
                    <ErrorMessage
                      name="competitorBrandName"
                      component="div"
                      className="text-red-700 font-normal text-xs"
                    />
                  </div>
                  <div className="col-span-2">
                    <Label>
                      Competitor ASIN URL <RequiredField />
                      {values.competitorScreenShotURL && (
                        <LinkIcon
                          onClick={() =>
                            window.open(
                              values.competitorScreenShotURL,
                              '_blank'
                            )
                          }
                          className="cursor-pointer ml-2 inline h-5 w-5"
                          color="gray"
                        />
                      )}
                    </Label>
                    <Field
                      name="competitorScreenShotURL"
                      placeholder="Competitor ASIN URL"
                      className="form-select text-sm"
                      onChange={(e) => handleChange(e)}
                      type="text"
                      disabled={isDisabled}
                    />
                    <ErrorMessage
                      name="competitorScreenShotURL"
                      component="div"
                      className="text-red-700 font-normal text-xs"
                    />
                  </div>

                  {/* {values.competitorScreenShotURL && (
                    <div className="col-span-2">
                      <img src={values.competitorScreenShotURL} alt="pic n/a" />
                    </div>
                  )} */}

                  {values.competitorAsinRevenueScreenshot ? (
                    <div className="col-span-2">
                      <Label>
                        Competitor ASIN Revenue Screenshot
                        <XIcon
                          onClick={() =>
                            setFieldValue('competitorAsinRevenueScreenshot', '')
                          }
                          className="cursor-pointer ml-2 inline h-5 w-5"
                          color="gray"
                          data-tip="Change screenshot"
                        />
                        <ExternalLinkIcon
                          onClick={() => {
                            let image = new Image();
                            image.src = values.competitorAsinRevenueScreenshot;
                            window.open('').document.write(image.outerHTML);
                          }}
                          className="cursor-pointer ml-2 inline h-5 w-5"
                          color="gray"
                          data-tip="Open in new tab"
                        />
                        <ClipboardIcon
                          onClick={() =>
                            copyToClipboard(
                              values.competitorAsinRevenueScreenshot
                            )
                          }
                          className="cursor-pointer ml-2 inline h-5 w-5"
                          color="gray"
                          data-tip="Copy image"
                        />
                        <ReactTooltip
                          place="bottom"
                          className="max-w-xs text-black"
                          backgroundColor="rgba(229, 231, 235, var(--tw-bg-opacity))"
                          textColor="rgba(17, 24, 39, var(--tw-text-opacity))"
                        />
                      </Label>

                      <img
                        id="target"
                        src={values.competitorAsinRevenueScreenshot}
                        data-tip={
                          values.competitorAsinRevenueScreenshotDateStamp
                        }
                        className="border-2 border-indigo-600"
                      />
                      <ReactTooltip
                        place="bottom"
                        className="max-w-xs text-black"
                        backgroundColor="rgba(229, 231, 235, var(--tw-bg-opacity))"
                        textColor="rgba(17, 24, 39, var(--tw-text-opacity))"
                      />
                    </div>
                  ) : (
                    <div className="col-span-2">
                      <div className="flex flex-row justify-between">
                        <div>
                          <Label>
                            Competitor ASIN Revenue Screenshot <RequiredField />
                          </Label>
                        </div>
                        <div>
                          <label for="upload" title="Upload image">
                            <UploadIcon
                              className="h-5 w-5 cursor-pointer"
                              color="gray"
                              data-tip="Upload image"
                            />
                          </label>
                          <input
                            id="upload"
                            type="file"
                            accept="image/*"
                            hidden
                            onChange={(e) =>
                              onUploadImage(
                                e,
                                setFieldValue,
                                'competitorAsinRevenueScreenshot',
                                'competitorAsinRevenueScreenshotDateStamp'
                              )
                            }
                          />
                        </div>
                      </div>

                      <Field
                        name="competitorAsinRevenueScreenshot"
                        placeholder="Paste image here"
                        className="form-select text-sm"
                        onPaste={(e) =>
                          onPhasteImage(
                            e,
                            setFieldValue,
                            'competitorAsinRevenueScreenshot',
                            'competitorAsinRevenueScreenshotDateStamp'
                          )
                        }
                        as="textarea"
                        disabled={isDisabled}
                      />
                      <ErrorMessage
                        name="competitorAsinRevenueScreenshot"
                        component="div"
                        className="text-red-700 font-normal text-xs"
                      />
                    </div>
                  )}

                  <div className="col-span-1">
                    <Label>
                      Competitor ASIN Revenue <RequiredField />
                    </Label>
                    <Field
                      name="revenue"
                      placeholder="Competitor ASIN Revenue"
                      className="form-select text-sm"
                      onChange={(e) => handleChange(e)}
                      type="number"
                      disabled={isDisabled}
                    />
                    <ErrorMessage
                      name="revenue"
                      component="div"
                      className="text-red-700 font-normal text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>
          </Form>
        )}
      </Formik>

      <LeadStatusSlideOver
        open={isStatusOpen}
        setOpen={setIsStatusOpen}
        onUpdateLead={onUpdateLead}
        formRef={formRef}
        copyToClipboard={copyToClipboard}
        onUploadImage={onUploadImage}
        onPhasteImage={onPhasteImage}
      />

      {!['Old-Leads', 'Unprocessed New Leads', 'New Leads'].includes(
        status
      ) && (
        <div className="pt-4 border-t-4">
          <ConversationForm id={id} liAccounts={liAccounts} formRef={formRef} />
        </div>
      )}

      <ConfirmationModal
        title={
          pitchCondition
            ? `Exact Match!`
            : 'Exact Match Found, Do you want update anyway?'
        }
        content={
          pitchCondition ? (
            <div>
              <span>Cannot be updated until 3 months after pitched date.</span>
            </div>
          ) : (
            <div>
              <label className="text-xs mt-4 mx-5 flex justify-center items-center">
                <span className="ml-2 text-red-700 text-left">
                  Lead Name: {exactMatch ? exactMatch.lead : ''}
                </span>
              </label>
              <label className="text-xs mt-4 mx-5 flex justify-center items-center">
                <span className="ml-2 text-red-700 text-left">
                  Company Name: {exactMatch ? exactMatch.companyName : ''}
                </span>
              </label>
            </div>
          )
        }
        open={isOpenConfirmation}
        setOpen={setIsOpenConfirmation}
        onOkClick={() => onUpdateExistingRecord()}
        onCancelClick={() => setIsOpenConfirmation(false)}
        showButtons={!pitchCondition}
      />

      <ConfirmationModal
        title={`Update this record?`}
        content={
          <div>
            <label className="text-xs mt-4 mx-5 flex justify-center items-center">
              <p className="ml-2 text-gray-700 text-left">
                Lead Name: {newVal.lead}
              </p>
              <p className="ml-2 text-gray-700 text-left">
                Company Name: {newVal.companyName}
              </p>
            </label>
            <label className="text-xs mt-4 mx-5 flex justify-center items-center">
              <span className="ml-2 text-red-700 text-left">
                Status: {status} to {newVal.status}
              </span>
            </label>
          </div>
        }
        open={isOpenConfirmationUpdate}
        setOpen={setIsOpenConfirmationUpdate}
        onOkClick={() => onConfirmUpdate()}
        onCancelClick={() => setIsOpenConfirmationUpdate(false)}
      />
    </>
  );
};

export default LeadForm;
