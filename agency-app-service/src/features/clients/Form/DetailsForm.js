import React, { Fragment, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ReactTooltip from 'react-tooltip';
import axios from 'axios';
import Input from 'components/Forms/Input';
import MultipleSelect from 'components/Forms/MultipleSelect';
import Select from 'components/Forms/Select';
import Textarea from 'components/Forms/Textarea';
import Label from 'components/Forms/Label';
import RequiredAsterisk from 'components/Forms/RequiredAsterisk';
import { TrashIcon, PlusIcon } from '@heroicons/react/outline';
import { QuestionMarkCircleIcon } from '@heroicons/react/solid';
import { setAlert } from 'features/alerts/alertsSlice';
import Commission from './Commission';
import { trim } from 'lodash';
import Error from 'components/Forms/Error';
import moment from 'moment';
import Toggle from 'components/Forms/Toggle';
import classNames from 'utils/classNames';

const DetailsForm = ({ formData, onDataChange, editProfile = 0, errors }) => {
  const [asinVal, setAsinVal] = useState('');
  const [asinList, setAsinList] = useState([]);
  const [isZohoClient, setIsZohoClient] = useState(false);
  const [zohoId, setZohoId] = useState('');
  const [categories, setCategories] = useState({ categories: [] });
  const { marketplaces } = useSelector((state) => state.clients);
  const dispatch = useDispatch();

  useEffect(() => {
    if (formData.asinList) {
      setAsinList(formData.asinList);
    } else {
      formData.asinList = [];
    }
    if (formData.categoryList) {
      setCategories({
        categories: formData.categoryList.map((rec) => rec.category),
      });
    } else {
      formData.categoryList = [];
    }
    if (formData.zohoId) {
      setIsZohoClient(true);
      setZohoId(formData.zohoId);
    }
  }, [formData]);

  const onInputChange = (e) => {
    onDataChange({ [e.target.name]: e.target.value ? e.target.value : '' });
  };

  const toggleZohoClient = () => {
    setIsZohoClient(!isZohoClient);
    setZohoId('');
    onDataChange({ zohoId: null, client: '', email: '' });
  };

  const loadZohoClient = async (value) => {
    if (value !== '') {
      const res = await axios.get(`/agency/client/zoho/${trim(value)}`);
      const { output } = res.data;
      if (output.code === 0) {
        onDataChange({
          zohoId: output.customer.customer_id,
          client: output.customer.company_name,
          email: output.customer.email,
        });
      } else {
        onDataChange({ zohoId: null, client: '', email: '' });
        dispatch(
          setAlert('error', 'Invalid Zoho Customer', output.message, 3000)
        );
      }
    } else {
      onDataChange({ zohoId: null, client: '', email: '' });
    }
  };

  const onFetchZohoClient = async (e) => {
    setZohoId(trim(e.target.value));
    await loadZohoClient(e.target.value);
  };

  const onAsinChange = (e) => {
    setAsinVal(e.target.value);
  };

  const onAsinKeyDown = (e) => {
    if (e.key === 'Enter') {
      onAddAsin();
    }
  };

  const onRemoveAsin = (i) => {
    formData.asinList.splice(i, 1);
    let newAsinList = JSON.parse(JSON.stringify(asinList));
    newAsinList.splice(i, 1);
    setAsinList(newAsinList);
  };

  const onAddAsin = () => {
    if (asinVal.length !== 10) {
      dispatch(setAlert('error', 'Invalid asin'));
      return;
    }
    if (asinList.some((el) => el.asin === asinVal)) {
      dispatch(setAlert('error', 'Asin already added'));
      return;
    }

    setAsinList([...asinList, { asin: asinVal }]);
    formData.asinList.push({ asin: asinVal });
    setAsinVal('');
  };

  const categoriesOptions = {
    categories: [
      { value: 'Amazon Device Accessories' },
      { value: 'Amazon Kindle' },
      { value: 'Automotive & Powersports' },
      { value: 'Baby Products (excluding apparel)' },
      { value: 'Beauty' },
      { value: 'Books' },
      { value: 'Camera & Photo' },
      { value: 'Cell Phones & Accessories' },
      { value: 'Collectible Coins' },
      { value: 'Consumer Electronics' },
      { value: 'Entertainment Collectibles' },
      { value: 'Fine Art' },
      { value: 'Grocery & Gourmet Food' },
      { value: 'Health & Personal Care' },
      { value: 'Home & Garden' },
      { value: 'Independent Design' },
      { value: 'Industrial & Scientific' },
      {
        value: 'Kindle Accessories and Amazon Fire TV Accessories',
        display: 'Kindle Accessories and Amazon Fire Tv Acc...',
      },
      { value: 'Major Appliances' },
      { value: 'Music' },
      { value: 'Musical Instruments' },
      { value: 'Office Products' },
      { value: 'Outdoors' },
      { value: 'Personal Computers' },
      { value: 'Pet Supplies' },
      { value: 'Software' },
      { value: 'Sports' },
      { value: 'Sports Collectibles' },
      { value: 'Tools & Home Improvement' },
      { value: 'Toys & Games' },
      { value: 'Video, DVD & Blu-ray' },
      { value: 'Video Games' },
      { value: 'Watches' },
    ],
  };

  const services = [
    'AH ISSUE',
    'Full Service',
    'Listing Optimization',
    'PPC',
    'Seller Launch',
  ];
  const accountStatuses = [
    'AH ISSUE',
    'Consultation',
    'For Onboarding',
    'LOW SALES',
    'MAINTENANCE',
    'MONITORING',
    'NEW ACCOUNT',
    'Ongoing LO',
    'Suspended',
    'WAITING FOR PRODUCTS',
  ];

  const onCategoryChange = (categories) => {
    setCategories(categories);
    formData.categoryList = categories.categories.map((category) => {
      return { category };
    });
  };

  const onNoCommission = (e) => {
    onDataChange({ noCommission: !formData.noCommission });
  };

  return (
    <Fragment>
      <div className="mt-10 sm:mt-0">
        <div className="md:grid md:grid-cols-3 md:gap-6">
          {!editProfile && (
            <div className="md:col-span-1">
              <div className="px-4 sm:px-0">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  Client Details
                </h3>
                <p className="mt-1 text-sm text-gray-600">
                  Detailed information about the client
                </p>
              </div>
            </div>
          )}
          <div
            className={`mt-5 md:mt-0 ${
              editProfile ? 'md:col-span-3' : 'md:col-span-2'
            } `}
          >
            <div className="shadow overflow-hidden sm:rounded-t-md">
              <div className="px-4 py-5 bg-white sm:p-6">
                <div className="grid grid-cols-1 gap-3">
                  <div>
                    {!isZohoClient ? (
                      <>
                        <Label htmlFor="client">
                          Client <RequiredAsterisk />
                        </Label>
                        <Input
                          id="client"
                          type="text"
                          value={formData.client}
                          onChange={onInputChange}
                          required
                        />
                        <Error>{errors?.client}</Error>
                      </>
                    ) : (
                      <>
                        <Label htmlFor="client">
                          Zoho Customer ID
                          <RequiredAsterisk />
                        </Label>
                        <Input
                          id="zohoId"
                          type="text"
                          value={zohoId}
                          onChange={onFetchZohoClient}
                          required
                        />
                      </>
                    )}

                    {!editProfile && (
                      <>
                        <div className="flex items-center">
                          <button
                            type="button"
                            className="text-xs text-green-500 hover:text-green-700 flex"
                            onClick={toggleZohoClient}
                          >
                            <span className="mt-1">
                              {!isZohoClient ? (
                                <>
                                  Use existing zoho customer ID
                                  <span>
                                    <QuestionMarkCircleIcon
                                      className="inline w-5 h-5 text-gray-400 ml-1 cursor-pointer"
                                      data-tip
                                      data-for="testp"
                                    />
                                  </span>
                                  <ReactTooltip
                                    id="testp"
                                    type="info"
                                    effect="solid"
                                    place="right"
                                  >
                                    <span>
                                      fetch client name/email from zoho
                                    </span>
                                  </ReactTooltip>
                                </>
                              ) : (
                                'Cancel'
                              )}
                            </span>
                          </button>
                        </div>

                        {isZohoClient && (
                          <div className="bg-green-50 mt-2 py-2 px-3 rounded-lg">
                            <div>
                              <Label>Client:</Label>&nbsp;
                              {formData.client}
                            </div>
                            <div>
                              <Label>Email:</Label>&nbsp;{formData.email}
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  {!editProfile && (
                    <>
                      {!isZohoClient && (
                        <div>
                          <div>
                            <div>
                              <Label htmlFor="email">
                                Email <RequiredAsterisk />
                              </Label>
                              <Input
                                id="email"
                                type="text"
                                value={formData.email}
                                onChange={onInputChange}
                                required
                              />
                              <Error>{errors?.email}</Error>
                            </div>
                          </div>
                          <div className="col-span-1 w-1/5 mt-1">
                            <Label
                              htmlFor="defaultMarketplace"
                              classes="text-left sm:mt-0"
                            >
                              Default Marketplace
                            </Label>
                            <div>
                              <Select
                                id="defaultMarketplace"
                                value={formData.defaultMarketplace}
                                onChange={onInputChange}
                                required
                              >
                                {marketplaces.map((marketplace) => {
                                  return (
                                    <option
                                      value={marketplace.marketplaceId}
                                      key={marketplace.marketplaceId}
                                    >
                                      {marketplace.countryCode}
                                    </option>
                                  );
                                })}
                              </Select>
                            </div>
                          </div>
                        </div>
                      )}
                      <div>
                        <label className="text-xs mt-2 flex items-center mb-2">
                          <Toggle
                            onChange={onNoCommission}
                            checked={!formData.noCommission}
                          />
                          <span className="ml-2 text-sm font-medium text-gray-500">
                            Commission
                          </span>
                          <span
                            className={classNames(
                              formData.noCommission
                                ? 'bg-yellow-100'
                                : 'bg-green-100',
                              'text-xs uppercase ml-1 p-1 leading-none rounded-md text-gray-700'
                            )}
                          >
                            {formData.noCommission ? 'No' : 'Yes'}
                          </span>
                        </label>

                        {formData.noCommission ? (
                          <div className="col-span-full bg-gray-50 p-3 rounded-lg shadow-sm">
                            <Label
                              htmlFor="reason"
                              classes="text-left whitespace-nowrap"
                            >
                              Reason for no commission <RequiredAsterisk />
                            </Label>
                            <div>
                              <Textarea
                                id="noCommissionReason"
                                value={formData.noCommissionReason}
                                onChange={onInputChange}
                                disabled={!formData.noCommission}
                              />
                              <Error>{errors?.noCommissionReason}</Error>
                            </div>
                            <Error>{errors?.monthThreshold}</Error>
                          </div>
                        ) : (
                          <Commission
                            formData={formData}
                            marketplaces={marketplaces}
                            onDataChange={onDataChange}
                            errors={errors}
                          />
                        )}
                      </div>
                    </>
                  )}

                  <div>
                    <Label htmlFor="serviceAgreementLink">
                      Service Agreement Link
                    </Label>
                    <Input
                      id="serviceAgreementLink"
                      type="text"
                      label="Service Agreement Link"
                      value={formData.serviceAgreementLink}
                      onChange={onInputChange}
                    />
                    <Error>{errors?.serviceAgreementLink}</Error>
                  </div>

                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Textarea
                      id="address"
                      value={formData.address}
                      onChange={onInputChange}
                      rows={2}
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      type="text"
                      label="Phone"
                      value={formData.phone}
                      onChange={onInputChange}
                    />
                  </div>

                  <div>
                    <Label htmlFor="siEmail">SI Email</Label>
                    <Input
                      id="siEmail"
                      type="email"
                      label="SI Email"
                      value={formData.siEmail}
                      onChange={onInputChange}
                    />
                    <Error>{errors?.siEmail}</Error>
                  </div>

                  <div>
                    <Label htmlFor="contractSigned">Contract Signed</Label>
                    <Input
                      id="contractSigned"
                      type="date"
                      label="Contract Signed"
                      value={moment(formData.contractSigned).format(
                        'YYYY-MM-DD'
                      )}
                      max={moment().format('YYYY-MM-DD')}
                      onChange={onInputChange}
                    />
                    <Error>{errors?.contractSigned}</Error>
                  </div>

                  <div>
                    <Label htmlFor="contactName">Contact Name</Label>
                    <Input
                      id="contactName"
                      type="text"
                      label="Contact Name"
                      value={formData.contactName}
                      onChange={onInputChange}
                    />
                    <Error>{errors?.contactName}</Error>
                  </div>

                  <div>
                    <Label htmlFor="contactName2">Contact Name 2</Label>
                    <Input
                      id="contactName2"
                      type="text"
                      label="Contact Name"
                      value={formData.contactName2}
                      onChange={onInputChange}
                    />
                    <Error>{errors?.contactName2}</Error>
                  </div>

                  <div>
                    <Label htmlFor="primaryEmail">Primary Email</Label>
                    <Input
                      id="primaryEmail"
                      type="email"
                      label="Primary Email"
                      value={formData.primaryEmail}
                      onChange={onInputChange}
                    />
                    <Error>{errors?.primaryEmail}</Error>
                  </div>

                  <div>
                    <Label htmlFor="secondaryEmail">Secondary Email</Label>
                    <Input
                      id="secondaryEmail"
                      type="email"
                      label="Secondary Email"
                      value={formData.secondaryEmail}
                      onChange={onInputChange}
                    />
                    <Error>{errors?.secondaryEmail}</Error>
                  </div>

                  <div>
                    <Label htmlFor="thirdEmail">Third Email</Label>
                    <Input
                      id="thirdEmail"
                      type="email"
                      label="Third Email"
                      value={formData.thirdEmail}
                      onChange={onInputChange}
                    />
                    <Error>{errors?.thirdEmail}</Error>
                  </div>

                  <div>
                    <Label htmlFor="service">Service</Label>
                    <Select
                      id="service"
                      label="Service"
                      value={formData.service}
                      onChange={onInputChange}
                    >
                      <option value="">Select Service</option>
                      {services.map((s) => {
                        return (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        );
                      })}
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="accountStatus">Account Status</Label>
                    <Select
                      id="accountStatus"
                      label="Account Status"
                      value={formData.accountStatus}
                      onChange={onInputChange}
                    >
                      <option value="">Select Account Status</option>
                      {accountStatuses.map((as) => {
                        return (
                          <option key={as} value={as}>
                            {as}
                          </option>
                        );
                      })}
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      type="text"
                      value={formData.website}
                      onChange={onInputChange}
                    />
                    <Error>{errors?.website}</Error>
                  </div>

                  <div>
                    <Label htmlFor="aboutUs">About Us</Label>
                    <Textarea
                      id="aboutUs"
                      value={formData.aboutUs}
                      onChange={onInputChange}
                    />
                  </div>

                  <div>
                    <Label htmlFor="overview">Overview</Label>
                    <Textarea
                      id="overview"
                      value={formData.overview}
                      onChange={onInputChange}
                    />
                  </div>

                  <div>
                    <Label htmlFor="painPoints">Pain Points</Label>
                    <Textarea
                      id="painPoints"
                      value={formData.painPoints}
                      onChange={onInputChange}
                    />
                  </div>

                  <div>
                    <Label htmlFor="goals">Goals</Label>
                    <Textarea
                      id="goals"
                      value={formData.goals}
                      onChange={onInputChange}
                    />
                  </div>

                  <MultipleSelect
                    className="text-sm block text-gray-900"
                    label="Product Categories"
                    options={categoriesOptions}
                    noSelectedText="No categories selected"
                    selected={categories}
                    setSelected={onCategoryChange}
                    containerClass="p-3 sm:grid lg:grid-cols-2 xl:grid-cols-3 sm:gap-x-2 sm:gap-y-1"
                  />

                  <div>
                    <Label htmlFor="productCategories">Amazon Page URL</Label>
                    <Input
                      id="amazonPageUrl"
                      type="text"
                      value={formData.amazonPageUrl}
                      onChange={onInputChange}
                    />
                    <Error>{errors?.amazonPageUrl}</Error>
                  </div>

                  <div>
                    <Label htmlFor="asinsToOptimize">ASINs to Optimize</Label>
                    <div className="grid sm:grid-cols-4 sm:gap-x-2 gap-y-1 sm:gap-y-2">
                      {asinList.map((rec, i) => {
                        return (
                          <React.Fragment key={i}>
                            <div className="sm:col-span-1 flex items-center justify-between py-1 px-2 bg-gray-100 rounded-lg text-sm">
                              {rec.asin}
                              <button
                                type="button"
                                className="text-red-700 p-1"
                                onClick={() => onRemoveAsin(i)}
                              >
                                <TrashIcon
                                  className="h-4 w-4"
                                  aria-hidden="true"
                                />
                              </button>
                            </div>
                            <div className="sm:col-span-3"></div>
                          </React.Fragment>
                        );
                      })}

                      <div className="sm:col-span-1">
                        <Input
                          id="asinsToOptimize"
                          type="text"
                          value={asinVal}
                          onChange={onAsinChange}
                          onKeyDown={onAsinKeyDown}
                          placeholder="Type ASIN here"
                        />
                      </div>
                      <div className="sm:col-span-1 flex items-center justify-center sm:justify-start border sm:border-0 py-1 sm:py-0 mt-2 sm:mt-0">
                        <button
                          type="button"
                          className="bg-red-500 rounded-full hover:bg-red-900 text-white mx-1"
                          onClick={() => onAddAsin()}
                        >
                          <PlusIcon className="h-4 w-4" aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                    <div className="text-xs mt-1 px-1 text-red-500 italic">
                      Tip: you can press enter to add an asin
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="otherNotes">Other Notes</Label>
                    <Textarea
                      id="otherNotes"
                      value={formData.otherNotes}
                      onChange={onInputChange}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};
export default DetailsForm;
