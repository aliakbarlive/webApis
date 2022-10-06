import { useEffect, Fragment, useState, useCallback } from 'react';
import { Formik, Field, Form, ErrorMessage, FieldArray } from 'formik';
import { object, string, number, date, array } from 'yup';
import axios from 'axios';
import { useParams } from 'react-router';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { joiAlertErrorsStringify } from 'utils/formatters';
import Label from 'components/Forms/Label';
import Button from 'components/Button';
import { setAlert } from 'features/alerts/alertsSlice';
import usePermissions from 'hooks/usePermissions';

const LeadProfile = ({ selectedLeads, refresh, setRefresh, options }) => {
  const history = useHistory();
  const { id } = useParams();
  const dispatch = useDispatch();
  const { userCan } = usePermissions();
  const [salesReps, setSalesReps] = useState([]);

  useEffect(async () => {
    const res = await axios.get('/agency/employees?roleId=35');
    setSalesReps(res.data.data.rows);
  }, []);

  const onSubmit = async (data) => {
    Object.keys(data).map(function (key, index) {
      if (data[key] === '') delete data[key];
    });

    delete data.processedByUser;
    delete data.requestedByUser;
    delete data.liAccountUsed;

    try {
      const response = await axios.put(`/agency/leads/${id}`, data);
      if (response.data.success) {
        dispatch(setAlert('success', 'Lead Updated'));
        setRefresh(!refresh);
        history.push('/leads');
      }
    } catch (error) {
      const errorMessages = joiAlertErrorsStringify(error);
      dispatch(setAlert('error', error.response.data.message, errorMessages));
    }
  };

  const validationSchema = object().shape({
    email: string().email(),
    otherEmails: string(),
    leadScreenShotURL: string().url().nullable(),
    competitorScreenShotURL: string().url().nullable(),
  });

  const onCancel = async (e) => {
    e.preventDefault();
    history.push('/leads');
  };

  const onLeadToClient = async (e) => {
    e.preventDefault();
    history.push(`/clients/add?leadId=${id}`);
  };

  return (
    <>
      <Formik
        initialValues={selectedLeads}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
        enableReinitialize={true}
      >
        {({ handleChange, setFieldValue, values }) => (
          <Form>
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-4 col-start-9">
                <Label>Sales Representative</Label>
                <Field
                  name="salesRep"
                  as="select"
                  className="form-select text-sm"
                  disabled={!userCan('leads.sales.profile.approve')}
                >
                  <option value=""></option>
                  {salesReps.map((el) => (
                    <option value={el.userId}>
                      {el.firstName} {el.lastName}
                    </option>
                  ))}
                </Field>
              </div>
              <div className="col-span-4 ">
                <Label>Call Appointment 1 Date</Label>
                <Field
                  name="callAppointmentDate1"
                  placeholder="Call Appointment 1 Date"
                  className="form-select text-sm"
                  onChange={(e) => handleChange(e)}
                  type="date"
                />
                <ErrorMessage
                  name="callAppointmentDate1"
                  component="div"
                  className="text-red-700 font-normal text-xs"
                />
              </div>
              <div className="col-span-4 ">
                <Label>Source</Label>
                <Field
                  name="source"
                  as="select"
                  className="form-select text-sm"
                >
                  {options.source.map((el) => {
                    return <option value={el.value}>{el.label}</option>;
                  })}
                </Field>
              </div>
              <div className="col-span-4">
                <Label>Website</Label>
                <Field
                  name="website"
                  placeholder="Website"
                  className="form-select text-sm"
                  onChange={(e) => handleChange(e)}
                  type="text"
                />
              </div>

              <div className="col-span-4">
                <Label>Lead Screen Shot URL</Label>
                <Field
                  name="leadScreenShotURL"
                  placeholder="Lead Screen Shot URL"
                  className="form-select text-sm"
                  onChange={(e) => handleChange(e)}
                  type="text"
                />
                <ErrorMessage
                  name="leadScreenShotURL"
                  component="div"
                  className="text-red-700 font-normal text-xs"
                />
              </div>

              <div className="col-span-4">
                <Label>Competitor ScreenShot URL</Label>
                <Field
                  name="competitorScreenShotURL"
                  placeholder="Competitor ScreenShot URL"
                  className="form-select text-sm"
                  onChange={(e) => handleChange(e)}
                  type="text"
                />
                <ErrorMessage
                  name="competitorScreenShotURL"
                  component="div"
                  className="text-red-700 font-normal text-xs"
                />
              </div>

              <div className="col-span-4">
                <Label>Product Category</Label>
                <Field
                  name="productCategory"
                  as="select"
                  className="form-select text-sm"
                >
                  {options.productCategory.map((el) => {
                    return <option value={el.value}>{el.label}</option>;
                  })}
                </Field>
              </div>

              <div className="col-span-4">
                <Label>Amazon Store / FBA Store Front</Label>
                <Field
                  name="amzStoreFBAstoreFront"
                  placeholder="Amazon Store / FBA Store Front"
                  className="form-select text-sm"
                  onChange={(e) => handleChange(e)}
                  type="text"
                />
                <ErrorMessage
                  name="amzStoreFBAstoreFront"
                  component="div"
                  className="text-red-700 font-normal text-xs"
                />
              </div>
              <div className="col-span-4">
                <Label>Amazon Product</Label>
                <Field
                  name="amazonProduct"
                  placeholder="Amazon Product"
                  className="form-select text-sm"
                  onChange={(e) => handleChange(e)}
                  type="text"
                />
              </div>

              <div className="col-span-4">
                <Label>Major Keyword Search Page</Label>
                <Field
                  name="majorKeywordSearchPage"
                  placeholder="Major Keyword Search Page"
                  className="form-select text-sm"
                  onChange={(e) => handleChange(e)}
                  type="text"
                />
              </div>

              <div className="col-span-4">
                <Label>Competitors Product</Label>
                <Field
                  name="competitorsProduct"
                  placeholder="Competitors Product"
                  className="form-select text-sm"
                  onChange={(e) => handleChange(e)}
                  type="text"
                />
              </div>

              <div className="col-span-4">
                <Label>Competitors Product 2</Label>
                <Field
                  name="competitorsProduct2"
                  placeholder="Competitors Product 2"
                  className="form-select text-sm"
                  onChange={(e) => handleChange(e)}
                  type="text"
                />
              </div>

              <div className="col-span-4">
                <Label>Spoke To</Label>
                <Field
                  name="spokeTo"
                  placeholder="Spoke To"
                  className="form-select text-sm"
                  onChange={(e) => handleChange(e)}
                  type="text"
                />
              </div>
              <div className="col-span-4">
                <Label>Persons Responsible</Label>
                <Field
                  name="personsResponsible"
                  placeholder="Persons Responsible"
                  className="form-select text-sm"
                  onChange={(e) => handleChange(e)}
                  type="text"
                />
              </div>
              <div className="col-span-4">
                <Label>Main Objective Pain Points</Label>
                <Field
                  name="mainObjectivePainPoints"
                  placeholder="Main Objective Pain Points"
                  className="form-select text-sm"
                  onChange={(e) => handleChange(e)}
                  type="text"
                />
              </div>
              <div className="col-span-4">
                <Label>Other Sales Channels</Label>
                <Field
                  name="otherSalesChannels"
                  placeholder="Other Sales Channels"
                  className="form-select text-sm"
                  onChange={(e) => handleChange(e)}
                  type="text"
                />
              </div>

              <div className="col-span-4">
                <Label>Company's Avg Revenue/month (Amazon)</Label>
                <Field
                  name="companyAverageMonthlyRevenue"
                  placeholder="Company's Avg Revenue/month (Amazon)"
                  className="form-select text-sm"
                  onChange={(e) => handleChange(e)}
                  type="text"
                />
              </div>

              <div className="col-span-4">
                <Label>PPC Spend</Label>
                <Field
                  name="ppcSpend"
                  placeholder="PPC Spend"
                  className="form-select text-sm"
                  onChange={(e) => handleChange(e)}
                  type="text"
                />
              </div>

              <div className="col-span-4">
                <Label>Average ACOS</Label>
                <Field
                  name="avgACOS"
                  placeholder="Average ACOS"
                  className="form-select text-sm"
                  onChange={(e) => handleChange(e)}
                  type="text"
                />
              </div>
              <div className="col-span-12">
                <Label>Quote (Parent ASIN's + Variations)</Label>
                <Field
                  name="quote"
                  placeholder="Quote"
                  className="form-select text-sm"
                  onChange={(e) => handleChange(e)}
                  type="text"
                />
              </div>

              <div className="col-span-12">
                <Label>Call Summary</Label>
                <Field
                  name="firstCallSummary"
                  placeholder="First Call Summary"
                  className="form-select text-sm"
                  onChange={(e) => handleChange(e)}
                  type="text"
                />
              </div>
              <div className="col-span-12">
                <Label>Service Conditions For OP</Label>
                <Field
                  name="serviceConditionsForOP"
                  placeholder="Service Conditions For OP"
                  className="form-select text-sm"
                  onChange={(e) => handleChange(e)}
                  type="text"
                />
              </div>
              <div className="col-span-4">
                <Label>Full Name</Label>
                <Field
                  name="ownersFullName"
                  placeholder="Owners Full Name"
                  className="form-select text-sm"
                  onChange={(e) => handleChange(e)}
                  type="text"
                />
              </div>
              <div className="col-span-4">
                <Label>Email</Label>
                <Field
                  name="email"
                  placeholder="Email"
                  className="form-select text-sm"
                  onChange={(e) => handleChange(e)}
                  type="text"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-700 font-normal text-xs"
                />
              </div>

              <div className="col-span-4">
                <Label>Other Emails</Label>
                <Field
                  name="otherEmails"
                  placeholder="Other Emails (separated by comma)"
                  className="form-select text-sm"
                  onChange={(e) => handleChange(e)}
                  type="text"
                />
                <ErrorMessage
                  name="otherEmails"
                  component="div"
                  className="text-red-700 font-normal text-xs"
                />
              </div>

              <div className="col-span-4">
                <Label>Phone Number</Label>
                <Field
                  name="phoneNumber"
                  placeholder="Phone Number"
                  className="form-select text-sm"
                  onChange={(e) => handleChange(e)}
                  type="text"
                />
              </div>

              <div className="col-span-4">
                <Label>About Us</Label>
                <Field
                  name="aboutUs"
                  placeholder="About Us"
                  className="form-select text-sm"
                  onChange={(e) => handleChange(e)}
                  type="text"
                />
              </div>

              <div className="col-span-4">
                <Label>Address</Label>
                <Field
                  name="address"
                  placeholder="Address"
                  className="form-select text-sm"
                  onChange={(e) => handleChange(e)}
                  type="text"
                />
              </div>

              <div className="col-span-4">
                <Label>Average Monthly Amazon Sales</Label>
                <Field
                  name="averageMonthlyAmazonSales"
                  as="select"
                  className="form-select text-sm"
                >
                  {options.averageMonthlyAmazonSales.map((el) => {
                    return <option value={el.value}>{el.label}</option>;
                  })}
                </Field>
              </div>

              <div className="col-span-4">
                <Label>Average Monthly Outside Amazon Sales</Label>
                <Field
                  name="averageMonthlyOutsideAmazonSales"
                  as="select"
                  className="form-select text-sm"
                >
                  {options.averageMonthlyOutsideAmazonSales.map((el) => {
                    return <option value={el.value}>{el.label}</option>;
                  })}
                </Field>
              </div>

              <div className="col-span-4">
                <Label>Main Issue With Amazon</Label>
                <Field
                  name="mainIssueWithAmazon"
                  as="select"
                  className="form-select text-sm"
                >
                  {options.mainIssueWithAmazon.map((el) => {
                    return <option value={el.value}>{el.label}</option>;
                  })}
                </Field>
              </div>

              <div className="col-span-4">
                <Label>Call Recording</Label>
                <Field
                  name="callRecording"
                  placeholder="Call Recording"
                  className="form-select text-sm"
                  onChange={(e) => handleChange(e)}
                  type="text"
                />
              </div>

              <div className="col-span-4">
                <Label>Call Recording 2</Label>
                <Field
                  name="callRecording2"
                  placeholder="Call Recording 2"
                  className="form-select text-sm"
                  onChange={(e) => handleChange(e)}
                  type="text"
                />
              </div>

              <div className="col-span-4">
                <Label>Qualified By</Label>
                <Field
                  name="qualifiedBy"
                  placeholder="Qualified By"
                  className="form-select text-sm"
                  onChange={(e) => handleChange(e)}
                  type="text"
                />
              </div>

              <div className="col-span-4">
                <Label>Plan</Label>
                <Field name="plan" as="select" className="form-select text-sm">
                  {options.plan.map((el) => {
                    return <option value={el.value}>{el.label}</option>;
                  })}
                </Field>
              </div>
              <div className="col-span-4">
                <Label>Stage</Label>
                <Field name="stage" as="select" className="form-select text-sm">
                  {options.stage.map((el) => {
                    return <option value={el.value}>{el.label}</option>;
                  })}
                </Field>
              </div>

              <div className="col-span-4">
                <Label>Payment Type</Label>
                <Field
                  name="paymentType"
                  as="select"
                  className="form-select text-sm"
                >
                  {options.paymentType.map((el) => {
                    return <option value={el.value}>{el.label}</option>;
                  })}
                </Field>
              </div>

              <div className="col-span-4">
                <Label>Total Of ASINS And Variations</Label>
                <Field
                  name="totalOfASINSAndVariations"
                  placeholder="Total Of ASINS And Variations"
                  className="form-select text-sm"
                  onChange={(e) => handleChange(e)}
                  type="text"
                />
              </div>

              <div className="col-span-4">
                <Label>Payment Status</Label>
                <Field
                  name="paymentStatus"
                  as="select"
                  className="form-select text-sm"
                >
                  {options.paymentStatus.map((el) => {
                    return <option value={el.value}>{el.label}</option>;
                  })}
                </Field>
              </div>

              {userCan('leads.sales.profile.manage') && (
                <div className="text-center col-span-4">
                  <Button
                    onClick={(e) => onLeadToClient(e)}
                    color={selectedLeads.status === 'Client' ? 'red' : 'green'}
                    classes="content-center text-center mt-6 block w-full"
                    disabled={selectedLeads.status === 'Client'}
                  >
                    {selectedLeads.status === 'Client'
                      ? 'Client Already'
                      : 'Convert Lead to Client'}
                  </Button>
                </div>
              )}

              {/* <div className="col-span-4">
                <Label>Competitors Website</Label>
                <Field
                  name="competitorsWebsite"
                  placeholder="Competitors Website"
                  className="form-select text-sm"
                  onChange={(e) => handleChange(e)}
                  type="text"
                />
              </div>

              <div className="col-span-4">
                <Label>Mock Listing</Label>
                <Field
                  name="mockListing"
                  placeholder="Mock Listing"
                  className="form-select text-sm"
                  onChange={(e) => handleChange(e)}
                  type="text"
                />
              </div>

              <div className="col-span-4">
                <Label>Qualified From LI Account</Label>
                <Field
                  name="qualifiedFromLIAccount"
                  placeholder="Qualified From LI Account"
                  className="form-select text-sm"
                  onChange={(e) => handleChange(e)}
                  type="text"
                />
              </div>

              

              */}
            </div>
            <div className="flex justify-between">
              <button
                onClick={(e) => onCancel(e)}
                className="mt-2"
                color="green"
              >
                Cancel
              </button>
              <Button
                onClick={() => console.log(values)}
                type="submit"
                classes="mt-2"
                disabled={!userCan('leads.sales.profile.manage')}
              >
                {userCan('leads.sales.profile.manage')
                  ? 'Save'
                  : 'You have no permission to save!'}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default LeadProfile;
