import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useFormik } from 'formik';
import axios from 'axios';
import moment from 'moment';
import { ACCOUNT_MANAGER, SENIOR_ACCOUNT_MANAGER } from 'utils/roles';
import SlideOver from 'components/SlideOver';
import TerminationDetails from './TerminationDetails';
import TerminationForm from './TerminationForm';
import { setAlert } from 'features/alerts/alertsSlice';
import { joiAlertErrorsStringify } from 'utils/formatters';
import usePermissions from 'hooks/usePermissions';

const TerminationSlideOver = ({
  open,
  setOpen,
  termination,
  client,
  updateDetails,
}) => {
  const dispatch = useDispatch();
  const { userCan } = usePermissions();
  const [loading, setLoading] = useState(false);
  const [pendingInvoices, setPendingInvoices] = useState(null);
  const [total, setTotal] = useState(0);
  const [accountManager, setAccountManager] = useState(null);
  const [seniorAccountManager, setSeniorAccountManager] = useState(null);
  const [terminationDate, setTerminationDate] = useState(null);
  const [showTerminationForm, setShowTerminationForm] = useState(false);

  useEffect(() => {
    const getPendingInvoices = async () => {
      const res = await axios.get(
        `/agency/subscription/${client.account.subscription.subscriptionId}/pendinginvoices`
      );

      if (res.data.output.code === 0) {
        const { invoices } = res.data.output;

        if (invoices && invoices.length > 0) {
          let t =
            invoices.length >= 1
              ? invoices.reduce((a, b) => a + b.balance, 0)
              : 0;

          setTotal(t);
        }
        setPendingInvoices(res.data.output);
      }
    };

    if (open) {
      setAccountManager(
        termination
          ? termination.accountManager
          : client.cells[0].users.find((x) => x.role.name === ACCOUNT_MANAGER)
      );

      setSeniorAccountManager(
        termination
          ? termination.seniorAccountManager
          : client.cells[0].pod.users.find(
              (x) => x.role.name === SENIOR_ACCOUNT_MANAGER
            )
      );

      let defaultTerminationDate = client.SubscriptionCycleDates.validUntil;

      if (!termination) {
        const parseStartDate =
          client.SubscriptionCycleDates[0].start.split('T');
        const monthDiff = moment().diff(parseStartDate[0], 'months');
        const parseEndDate =
          client.SubscriptionCycleDates[0].validUntil.split('T');
        defaultTerminationDate = moment(parseEndDate[0])
          .add(monthDiff, 'months')
          .subtract(1, 'day')
          .format();

        setShowTerminationForm(true);
      } else {
        if (termination.status === 'pending') {
          if (userCan('termination.update')) {
            setShowTerminationForm(true);
          } else if (userCan('termination.view')) {
            setShowTerminationForm(false);
          }
        } else {
          if (userCan('termination.approve')) {
            setShowTerminationForm(true);
          } else if (userCan('termination.view')) {
            setShowTerminationForm(false);
          }
        }
      }

      setTerminationDate(
        moment(
          termination ? termination.terminationDate : defaultTerminationDate
        ).utc()
      );

      if (userCan('termination.approve')) {
        getPendingInvoices();
      }
    }
  }, [open, client, termination]);

  const formik = useFormik({
    initialValues: {
      agencyClientId: client.agencyClientId,
      accountManagerId: accountManager ? accountManager.userId : null,
      terminationDate: terminationDate
        ? terminationDate.format('MM/DD/YYYY')
        : null,
      seniorAccountManagerId: seniorAccountManager?.userId,
      reason: termination ? termination.reason : '',
      moreInformation: termination ? termination.moreInformation : '',
      status: termination ? termination.status : 'pending',
    },
    enableReinitialize: true,
    validate: (values) => {
      const errors = {};
      if (!values.accountManagerId) {
        errors.accountManagerId =
          'Account Manager is required. Please check if the cell assigned to this client has an existing account manager';
      }
      if (!values.seniorAccountManagerId) {
        errors.seniorAccountManagerId =
          'Senior Account Manager is required. Please check if the pod assigned to this client has an existing senior account manager';
      }
      if (!values.reason) {
        errors.reason = 'Reason is required';
      }

      if (values.reason === 'Other') {
        if (!values.moreInformation) {
          errors.moreInformation =
            'Please add more information about your reason';
        }
      }

      return errors;
    },
    onSubmit: async (values) => {
      setLoading(true);
      const out = termination
        ? await axios.put(
            `/agency/terminations/${termination.terminationId}`,
            values
          )
        : await axios.post('/agency/terminations', values);

      if (out.data.success === true) {
        dispatch(
          setAlert(
            'success',
            'Termination form saved',
            out.data.output.tasks?.api.message
          )
        );
        updateDetails(out.data.output.out);
      } else {
        dispatch(
          setAlert(
            'error',
            'An error occurred. The termination form was not processed',
            out.data.output.tasks?.api.message
          )
        );
      }
      setLoading(false);
      setOpen(false);
    },
  });

  const deleteTermination = async () => {
    try {
      await axios.delete(`/agency/terminations/${termination.terminationId}`);
      dispatch(setAlert('success', `Termination request deleted`));

      updateDetails(null);
    } catch (error) {
      const errorMessages = joiAlertErrorsStringify(error);
      dispatch(setAlert('error', error.response.data.message, errorMessages));
    }

    setOpen(false);
  };

  return (
    <SlideOver
      open={open}
      setOpen={setOpen}
      title="Termination Request Details"
      titleClasses="capitalize"
      size="3xl"
      noOverlayClick={true}
    >
      <div className="flow-root">
        {showTerminationForm ? (
          <TerminationForm
            setOpen={setOpen}
            client={client}
            termination={termination}
            pendingInvoices={pendingInvoices}
            total={total}
            loading={loading}
            formik={formik}
            deleteTermination={deleteTermination}
            accountManager={accountManager}
            seniorAccountManager={seniorAccountManager}
          />
        ) : (
          //client.agencyClientId
          <TerminationDetails
            termination={termination}
            client={client}
            setOpen={setOpen}
          />
        )}
      </div>
    </SlideOver>
  );
};

export default TerminationSlideOver;
