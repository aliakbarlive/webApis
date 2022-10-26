import { Formik, Field, Form, ErrorMessage, FieldArray } from 'formik';
import { object, string, number, date, array } from 'yup';
import axios from 'axios';
import {
  currencyFormatter,
  dateFormatterUTC,
  joiAlertErrorsStringify,
  nameFormatter,
} from 'utils/formatters';
import Label from 'components/Forms/Label';
import { useDispatch, useSelector } from 'react-redux';
import { selectAuthenticatedUser } from 'features/auth/authSlice';
import usePermissions from 'hooks/usePermissions';
import { Fragment, useEffect, useState } from 'react';
import ButtonLink from 'components/ButtonLink';
import Button from 'components/Button';
import {
  XIcon,
  PlusIcon,
  ChevronRightIcon,
  ClipboardCheckIcon,
  ArchiveIcon,
} from '@heroicons/react/outline';
import { setAlert } from 'features/alerts/alertsSlice';
import NextStepsModal from './NextStepsModal';
import DeleteUpsell from './DeleteUpsell';
import { fetchOneTimeAddons } from '../upsellsSlice';
import Badge from 'components/Badge';
import classnames from 'classnames';
import { isEqual } from 'lodash';
import ButtonDropdown from 'components/ButtonDropdown';
import { Menu } from '@headlessui/react';

const UpsellForm = ({ upsell, client, action, setOpen, getUpsells }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [isOpenNextSteps, setIsOpenNextSteps] = useState(false);
  const { addons } = useSelector((state) => state.upsells);
  const { hasNewAddons } = useSelector((state) => state.clients);
  const [oneTimeAddons, setOneTimeAddons] = useState(null);
  const { userCan } = usePermissions();
  const prevStatus = upsell ? upsell.status : '';
  const me = useSelector(selectAuthenticatedUser);
  const [updatedUpsell, setUpdatedUpsell] = useState(upsell);
  const [formStatus, setFormStatus] = useState('save');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (hasNewAddons || addons.length <= 0) {
      setLoading(true);
      dispatch(fetchOneTimeAddons());
      setLoading(false);
    }
  }, [hasNewAddons, addons, dispatch]);

  useEffect(() => {
    if (addons) {
      setOneTimeAddons(addons.filter((a) => a.status === 'active'));
    }
  }, [addons]);

  const add = () => {
    return action === 'add';
  };

  const approved = () => {
    return upsell && upsell.status === 'approved';
  };

  const newItem = add()
    ? {
        addonId: '',
        code: '',
        type: '',
        name: '',
        description: '',
        qty: 1,
        price: 0,
      }
    : {
        upsellDetailId: '',
        upsellId: '',
        addonId: '',
        code: '',
        type: '',
        name: '',
        description: '',
        qty: 1,
        price: 0,
      };

  const initialValues = add()
    ? {
        agencyClientId: client.agencyClientId,
        requestedBy: me.userId,
        status: 'pending',
        note: '',
        details: [newItem],
        commissionAmount: '',
        soldBy: '',
      }
    : {
        agencyClientId: upsell.agencyClientId,
        requestedBy: upsell.requestedBy,
        status: upsell.status,
        soldBy: upsell.soldBy,
        commissionAmount: upsell.commissionAmount,
        details: upsell.details.map((d) => {
          return {
            upsellDetailId: d.upsellDetailId,
            upsellId: d.upsellId,
            addonId: d.addonId,
            code: d.code,
            type: d.type,
            name: d.name,
            description: d.description,
            qty: d.qty,
            price: d.price,
          };
        }),
      };

  const onDetailsChange = (e, index, setFieldValue) => {
    const selectedItem = oneTimeAddons.filter(
      (i) => i.addon_code === e.target.value
    )[0];

    if (selectedItem) {
      setFieldValue(`details.${index}.addonId`, selectedItem.addon_id);
      setFieldValue(`details.${index}.name`, selectedItem.name);
      setFieldValue(`details.${index}.description`, selectedItem.description);
      setFieldValue(`details.${index}.code`, selectedItem.addon_code);
      setFieldValue(`details.${index}.type`, selectedItem.type);
      setFieldValue(
        `details.${index}.price`,
        selectedItem.price_brackets[0].price
      );
      if (!add()) {
        setFieldValue(`details.${index}.upsellId`, upsell.upsellId);
      }
    }
  };

  const onSubmit = async (values) => {
    try {
      let logStatus = '';
      const changed = !isEqual(initialValues, values);

      let payload = { ...values };
      if (formStatus === 'save') {
        payload.status = changed ? 'pending' : payload.status;
        logStatus = changed ? `Moved to ${payload.status} tab` : '';
      }

      if (formStatus === 'approve') {
        payload.status = 'approved';
        logStatus = `Moved to approved tab`;
      }

      if (formStatus === 'reject') {
        payload.status = 'rejected';
        logStatus = `Moved to rejected tab`;
      }

      if (payload.soldBy === '') {
        payload.soldBy = null;
      }

      if (payload.commissionAmount === '') {
        payload.commissionAmount = null;
      }

      const out = add()
        ? await axios.post('/agency/upsells', payload)
        : await axios.put(`/agency/upsells/${upsell.upsellId}`, payload);

      if (out.data.success === true) {
        if (values.status === 'approved' && prevStatus !== 'approved') {
          setUpdatedUpsell(out.data.output.out);
          setIsOpenNextSteps(true);
        } else {
          dispatch(setAlert('success', `Upsell Saved`, logStatus));
          setOpen(false);
        }
        getUpsells();
      } else {
        console.log('err');
        dispatch(setAlert('error', 'An error occurred. Upsell was not saved'));
      }
    } catch (error) {
      const errorMessages = joiAlertErrorsStringify(error);
      dispatch(setAlert('error', error.response.data.message, errorMessages));
    }
  };

  const validationSchema = object().shape({
    agencyClientId: string().required('Required'),
    requestedBy: string().required('Required'),
    commissionAmount: number().min(0).nullable(),
    details: array().of(
      object().shape({
        code: string().required('Item is required'),
        name: string().required('Required'),
        description: string().trim().required('Description is required'),
        qty: number()
          .required('Required')
          .positive('Invalid')
          .integer('Invalid'),
        price: number().required('Required'),
      })
    ),
    status: string().required('Required'),
  });

  const onEmailDraft = async () => {
    setSending(true);
    const data = {
      subscriptionId: upsell.agencyClient.account.subscription.subscriptionId,
    };
    try {
      await axios
        .post(`/agency/upsells/${upsell.upsellId}/send`, data)
        .then((res) => {
          dispatch(
            setAlert(
              'success',
              'Email sent to client',
              upsell.agencyClient.defaultContact.email
            )
          );
          setOpen(false);
        });
    } catch (error) {
      console.log(error);
      dispatch(setAlert('error', 'Email not sent. An error occurred'));
    }
    setSending(false);
  };

  return (
    addons &&
    addons.length > 0 &&
    !loading && (
      <>
        <Formik
          initialValues={initialValues}
          onSubmit={onSubmit}
          validationSchema={validationSchema}
        >
          {({ handleChange, handleSubmit, setFieldValue, values }) => (
            <Form>
              <div className="flex flex-col">
                <Label>Client</Label>
                <span className="text-sm">
                  {add() ? client.client : upsell.agencyClient?.client}
                </span>
                <span className="text-xs text-red-500">
                  {add()
                    ? client?.defaultContact.email
                    : upsell.agencyClient?.defaultContact.email}
                </span>
              </div>
              <div className="flex flex-col mt-3">
                <Label>Requested By</Label>
                <span className="text-sm">
                  {nameFormatter(add() ? me : upsell.requestedByUser)}
                </span>
              </div>
              {approved() && (
                <div className="sm:flex flex-row mt-3">
                  <div className="w-1/2 sm:flex flex-col">
                    <Label>Date Approved</Label>
                    <span className="text-sm">
                      {dateFormatterUTC(upsell.approvedAt)}
                    </span>
                  </div>
                  <div className="w-1/2 sm:flex flex-col">
                    <Label>Approved By</Label>
                    <span>{nameFormatter(upsell.approvedByUser)}</span>
                  </div>
                </div>
              )}
              <div className="flex flex-col mt-3">
                <Label>Details</Label>
                <table className="min-w-full divide-y divide-gray-300">
                  <thead>
                    <tr>
                      <th
                        scope="col"
                        className="pl-4 pr-3 w-3/5 text-left text-sm font-medium text-gray-500 sm:pl-6 md:pl-0"
                      >
                        Item
                      </th>
                      <th
                        scope="col"
                        className="px-3 w-1/5 text-left text-sm font-medium text-gray-500"
                      >
                        Qty
                      </th>
                      <th
                        scope="col"
                        className="px-3 w-1/5 text-left text-sm font-medium text-gray-500"
                      >
                        Price
                      </th>
                      <th
                        scope="col"
                        className="relative pl-3 pr-4 sm:pr-6 md:pr-0 text-right"
                      >
                        &nbsp;
                      </th>
                    </tr>
                  </thead>

                  <FieldArray name="details">
                    {({ insert, remove, push }) => (
                      <tbody className="">
                        {values.details.length > 0 &&
                          values.details.map((detail, index) => (
                            <Fragment key={index}>
                              <tr>
                                <td className="whitespace-nowrap pt-3 pl-4 text-sm font-medium text-gray-900 sm:pl-6 md:pl-0">
                                  <span className="text-sm">
                                    <Field
                                      name={`details.${index}.code`}
                                      as="select"
                                      className="form-select text-sm"
                                      onChange={(e) => {
                                        onDetailsChange(
                                          e,
                                          index,
                                          setFieldValue
                                        );
                                        handleChange(e);
                                      }}
                                    >
                                      <option
                                        className="text-sm"
                                        value=""
                                        disabled
                                      >
                                        Select Item...
                                      </option>
                                      {oneTimeAddons &&
                                        oneTimeAddons.map((item) => (
                                          <option
                                            className="text-sm"
                                            value={item.addon_code}
                                            key={item.addon_code}
                                          >
                                            {item.name}
                                          </option>
                                        ))}
                                    </Field>
                                    <ErrorMessage
                                      name={`details.${index}.code`}
                                      component="div"
                                      className="text-red-700 font-normal text-xs"
                                    />
                                  </span>
                                </td>
                                <td className="whitespace-nowrap pt-3 pl-2 text-sm text-gray-500 align-top">
                                  <Field
                                    name={`details.${index}.qty`}
                                    type="number"
                                    min="1"
                                    className="form-input text-sm"
                                  />
                                  <ErrorMessage
                                    name={`details.${index}.qty`}
                                    component="div"
                                    className="text-red-700 font-normal text-xs"
                                  />
                                </td>
                                <td className="whitespace-nowrap pt-3 pl-2 text-sm text-gray-500 align-top">
                                  <Field
                                    name={`details.${index}.price`}
                                    type="number"
                                    className="form-input text-sm"
                                  />
                                  <ErrorMessage
                                    name={`details.${index}.price`}
                                    component="div"
                                    className="text-red-700 font-normal text-xs"
                                  />
                                </td>
                                <td className="whitespace-nowrap pt-2 pl-2 text-sm text-gray-500 text-right">
                                  &nbsp;
                                </td>
                              </tr>
                              <tr>
                                <td className="whitespace-nowrap pl-4 text-sm font-medium text-gray-900 sm:pl-6 md:pl-0">
                                  <div className="mt-1">
                                    <Field
                                      name={`details.${index}.description`}
                                      placeholder="Description"
                                      as="textarea"
                                      rows={2}
                                      className="form-select text-sm"
                                    />
                                    <ErrorMessage
                                      name={`details.${index}.description`}
                                      component="div"
                                      className="text-red-700 font-normal text-xs"
                                    />
                                  </div>
                                </td>
                                <td
                                  className="whitespace-nowrap pl-2 text-sm text-gray-500 align-top text-right"
                                  colSpan={2}
                                >
                                  <div className="pt-3 pl-3 flex justify-between">
                                    <span>Total Amount:</span>
                                    <span className="font-semibold">
                                      {currencyFormatter(
                                        parseFloat(detail.price) *
                                          parseInt(detail.qty)
                                      )}
                                    </span>
                                  </div>
                                </td>
                                <td className="whitespace-nowrap pl-2 text-sm text-gray-500 align-bottom">
                                  {index > 0 && (
                                    <ButtonLink onClick={() => remove(index)}>
                                      <XIcon className="w-4 h-4 inline" />
                                    </ButtonLink>
                                  )}
                                </td>
                              </tr>
                              <tr>
                                <td colSpan={4} className="pt-3 pb-2">
                                  <hr />
                                </td>
                              </tr>
                            </Fragment>
                          ))}
                        <tr>
                          <td colSpan={4}>
                            <button
                              type="button"
                              className={`text-center w-full text-red-500 py-1 border border-dotted border-red-400 text-sm rounded-lg hover:bg-red-100`}
                              onClick={() => push(newItem)}
                            >
                              <PlusIcon className="w-4 h-4 inline" /> Add Item
                            </button>
                          </td>
                        </tr>
                      </tbody>
                    )}
                  </FieldArray>
                </table>
              </div>

              <div className="flex flex-col mt-3">
                <Label>Status</Label>
                <span>
                  <Badge
                    color={classnames({
                      gray: values.status === 'draft',
                      yellow: values.status === 'pending',
                      green: values.status === 'approved',
                      red: values.status === 'rejected',
                    })}
                    classes="uppercase"
                    rounded="md"
                  >
                    {values.status}
                  </Badge>
                </span>
              </div>

              <div className="flex flex-col mt-3">
                <Label>Sold By</Label>
                <span className="text-sm">
                  <Field
                    name="soldBy"
                    as="select"
                    className="form-select text-sm"
                  >
                    <option value="">Unassigned</option>
                    {client.cells.find((cell) => cell.type === 'operations') &&
                      client.cells
                        .find((cell) => cell.type === 'operations')
                        .users.map((user) => {
                          return (
                            <option
                              key={user.userId}
                              value={user.userId}
                            >{`${user.firstName} ${user.lastName}`}</option>
                          );
                        })}
                  </Field>
                </span>
              </div>

              <div className="flex flex-col mt-3">
                <Label>Commission Amount</Label>
                <span className="text-sm">
                  <Field
                    name="commissionAmount"
                    type="number"
                    className="form-input text-sm"
                  />

                  <ErrorMessage
                    name="commissionAmount"
                    component="div"
                    className="text-red-700 font-normal text-xs"
                  />
                </span>
              </div>

              {action === 'add' && (
                <div className="flex flex-col mt-3">
                  <Label>Note</Label>
                  <span className="text-sm">
                    <Field
                      name="note"
                      as="textarea"
                      placeholder="Note"
                      className="form-select text-sm"
                    ></Field>
                  </span>
                </div>
              )}
              <div className="flex justify-between mt-3">
                <div>
                  {!approved() && userCan('upsells.delete') && (
                    <DeleteUpsell
                      upsell={upsell}
                      getUpsells={getUpsells}
                      closeSlideOver={() => setOpen(false)}
                    />
                  )}
                </div>
                <div className="text-right space-x-2">
                  <Button
                    classes="mt-2"
                    color="gray"
                    onClick={() => setOpen(false)}
                  >
                    Cancel
                  </Button>
                  {upsell && values.status === 'pending' && (
                    <Button
                      classes="mt-2"
                      bgColor="yellow-300"
                      hoverColor="yellow-400"
                      textColor="gray-700"
                      onClick={onEmailDraft}
                    >
                      Email Draft
                    </Button>
                  )}

                  {values.status === 'pending' && userCan('upsells.approve') ? (
                    <ButtonDropdown
                      loading={loading}
                      showLoading={true}
                      buttonTitle="Save"
                      buttonType="submit"
                    >
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            type="submit"
                            onClick={() => {
                              setFormStatus('approve');
                              handleSubmit();
                            }}
                            className={classnames(
                              active ? 'bg-green-100 text-gray-900' : '',
                              'block px-4 py-2 text-sm font-medium w-full text-left text-green-700'
                            )}
                          >
                            <ClipboardCheckIcon className="w-4 h-4 inline mr-2" />
                            Save &amp; Approve
                          </button>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            type="submit"
                            onClick={() => {
                              setFormStatus('reject');
                              handleSubmit();
                            }}
                            className={classnames(
                              active ? 'bg-red-100 text-gray-900' : '',
                              'block px-4 py-2 text-sm font-medium w-full text-left text-red-700'
                            )}
                          >
                            <ArchiveIcon className="w-4 h-4 inline mr-2" /> Save
                            &amp; Reject
                          </button>
                        )}
                      </Menu.Item>
                    </ButtonDropdown>
                  ) : (
                    <Button
                      type="submit"
                      classes="mt-2"
                      loading={loading}
                      showLoading={true}
                      onClick={() => setFormStatus('save')}
                    >
                      {approved() ? 'Update' : 'Save'}
                    </Button>
                  )}

                  {approved() && (
                    <Button
                      onClick={() => setIsOpenNextSteps(true)}
                      color="green"
                      classes="ml-2 mt-2"
                    >
                      Next <ChevronRightIcon className="w-4 h-4 inline" />
                    </Button>
                  )}
                </div>
              </div>
            </Form>
          )}
        </Formik>
        <NextStepsModal
          upsell={updatedUpsell}
          open={isOpenNextSteps}
          setOpen={setIsOpenNextSteps}
          closeSlideOver={() => setOpen(false)}
          onOkClick={() => {
            setOpen(false);
            getUpsells();
          }}
        />
      </>
    )
  );
};

export default UpsellForm;
