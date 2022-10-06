import { useEffect, useState } from 'react';
import { Formik, Field, Form } from 'formik';
import { object } from 'yup';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { Card } from 'components';
import Label from 'components/Forms/Label';
import Button from 'components/Button';
import { setAlert } from 'features/alerts/alertsSlice';
import { joiAlertErrorsStringify, agoUTC } from 'utils/formatters';
import ConversationThread from './ConversationThread';

const ConversationForm = ({ id, liAccounts, formRef }) => {
  const [conversationData, setConversationData] = useState([]);
  const dispatch = useDispatch();
  const history = useHistory();
  const [initialValues, setInitialValues] = useState({
    sentFrom: '',
    siPlatForm: '',
    siPlatFormValue: '',
    leadPlatForm: '',
    leadPlatFormValue: '',
    sentTo: '',
    sentToValue: '',
    fullMessage: '',
    status: '',
  });

  const liAccountsOptions =
    liAccounts && liAccounts.rows ? liAccounts.rows : [];

  useEffect(() => {
    axios.get(`/agency/leads/${id}/conversation`).then((res) => {
      setConversationData(res.data.data);
    });
  }, []);

  const validationSchema = object().shape({
    // lead: string().required('Required'),
  });

  const onSubmit = async (values, { resetForm }) => {
    // console.log('+++++++formRef.current.values', formRef.current.values);

    if (values.sentFrom === 'Lead' && values.status === '') {
      alert('Type of Response is Required!');
    } else {
      try {
        const response = await axios.post(
          `/agency/leads/${id}/conversation`,
          values
        );
        if (response.data.success) {
          dispatch(setAlert('success', `Start Thread Successful`));
          axios.get(`/agency/leads/${id}/conversation`).then((res) => {
            setConversationData(res.data.data);
            resetForm();
          });
        }
      } catch (error) {
        const errorMessages = joiAlertErrorsStringify(error);
        dispatch(setAlert('error', error.response.data.message, errorMessages));
      }
    }
  };

  const platFormOptions = [
    'Linkedin',
    'Email',
    'Phone (call/text)',
    'IG',
    'FB',
  ];

  const onChangeSiPlatFormValue = (e, setFieldValue) => {
    const val = e.target.value;
    if (val === 'Linkedin') {
      const name = liAccountsOptions.find(
        (el) =>
          el.linkedInAccountId === formRef.current.values.linkedInAccountId
      ).name;

      setFieldValue('siPlatFormValue', name);
    } else {
      setFieldValue('siPlatFormValue', '');
    }
  };

  const onChangeSentTo = (e, setFieldValue) => {
    const val = e.target.value;
    if (val === 'Linkedin') {
      setFieldValue('sentToValue', formRef.current.values.linkedInProfileURL);
    }
  };

  return (
    <>
      <section aria-labelledby="conversation-title">
        <div className="bg-white shadow sm:rounded-lg sm:overflow-hidden">
          <div className="divide-y divide-gray-200">
            <div className="px-4 py-5 sm:px-6">
              <h2
                id="conversation-title"
                className="text-lg font-medium text-gray-900"
              >
                Conversation History
              </h2>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:px-6">
              <Formik
                initialValues={initialValues}
                onSubmit={onSubmit}
                validationSchema={validationSchema}
                enableReinitialize={true}
              >
                {({ handleChange, setFieldValue, values }) => (
                  <Form>
                    <div className="grid grid-cols-12 gap-4">
                      <div className="col-span-4">
                        <Label>Sent from</Label>
                        <Field
                          name="sentFrom"
                          as="select"
                          className="form-select text-sm"
                        >
                          <option value=""></option>
                          <option value="SI">SI</option>
                          <option value="Lead">Lead</option>
                        </Field>
                      </div>
                      {values.sentFrom === 'SI' && (
                        <>
                          <div className="col-span-4">
                            <Label>Platform</Label>
                            <Field
                              name="siPlatForm"
                              as="select"
                              className="form-select text-sm"
                              onChange={(e) => {
                                handleChange(e);
                                // setFieldValue('siPlatFormValue', '');
                                onChangeSiPlatFormValue(e, setFieldValue);
                              }}
                            >
                              <option value=""></option>
                              {platFormOptions.map((el) => {
                                return <option value={el}>{el}</option>;
                              })}
                            </Field>
                          </div>

                          {values.siPlatForm === 'Linkedin' ? (
                            <div className="col-span-4">
                              <Label>Value</Label>
                              <Field
                                name="siPlatFormValue"
                                as="select"
                                className="form-select text-sm"
                              >
                                <option value=""></option>
                                {liAccountsOptions.map((rec) => {
                                  return (
                                    <option value={rec.name}>{rec.name}</option>
                                  );
                                })}
                              </Field>
                            </div>
                          ) : (
                            <div className="col-span-4">
                              <Label>Value</Label>
                              <Field
                                name="siPlatFormValue"
                                placeholder="Value"
                                className="form-select text-sm"
                                type="text"
                                onKeyPress={(e) => {
                                  e.key === 'Enter' && e.preventDefault();
                                }}
                              />
                            </div>
                          )}
                        </>
                      )}

                      {values.sentFrom === 'Lead' && (
                        <>
                          <div className="col-span-2">
                            <Label>Platform</Label>
                            <Field
                              name="leadPlatForm"
                              as="select"
                              className="form-select text-sm"
                              onChange={(e) => {
                                handleChange(e);
                                setFieldValue('siPlatFormValue', '');
                              }}
                            >
                              <option value=""></option>
                              {platFormOptions.map((el) => {
                                return <option value={el}>{el}</option>;
                              })}
                            </Field>
                          </div>

                          <div className="col-span-4">
                            <Label>Value</Label>
                            <Field
                              name="leadPlatFormValue"
                              placeholder="Value"
                              className="form-select text-sm"
                              type="text"
                              onKeyPress={(e) => {
                                e.key === 'Enter' && e.preventDefault();
                              }}
                            />
                          </div>

                          <div className="col-span-2">
                            <Label>Type of Response</Label>
                            <Field
                              name="status"
                              as="select"
                              className="form-select text-sm"
                            >
                              <option value=""></option>
                              {[
                                'Direct-Booking',
                                'Positive-Response',
                                'Neutral-Response',
                                'Negative-Response',
                              ].map((el) => {
                                return <option value={el}>{el}</option>;
                              })}
                            </Field>
                          </div>
                        </>
                      )}
                    </div>

                    <div className="grid grid-cols-12 gap-4">
                      <div className="col-span-4">
                        <Label>Sent to Platform</Label>
                        <Field
                          name="sentTo"
                          as="select"
                          className="form-select text-sm"
                          onChange={(e) => {
                            handleChange(e);
                            onChangeSentTo(e, setFieldValue);
                          }}
                        >
                          <option value=""></option>
                          {platFormOptions.map((el) => {
                            return <option value={el}>{el}</option>;
                          })}
                        </Field>
                      </div>

                      {values.sentTo && (
                        <div className="col-span-4">
                          <Label>Value</Label>
                          <Field
                            name="sentToValue"
                            placeholder="Value"
                            className="form-select text-sm"
                            type="text"
                            onKeyPress={(e) => {
                              e.key === 'Enter' && e.preventDefault();
                            }}
                          />
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-12 gap-12">
                      <div className="col-span-12">
                        <Label>Full Message</Label>
                        <Field
                          name="fullMessage"
                          placeholder="Full Message"
                          className="form-select text-sm"
                          as="textarea"
                        />
                      </div>
                    </div>

                    <div className="flex justify-between">
                      <div></div>
                      <Button
                        // onClick={() => console.log('')}
                        type="submit"
                        classes="mt-2"
                      >
                        Start Thread
                      </Button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>

            <div className="bg-gray-50 px-4 py-3 sm:px-6">
              {conversationData.map((el) => {
                return (
                  <div className="p-4">
                    <ConversationThread el={el} />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
export default ConversationForm;
