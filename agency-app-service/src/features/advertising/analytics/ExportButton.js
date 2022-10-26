import moment from 'moment';
import axios from 'axios';
import { object, string } from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { useState, Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/solid';
import { Formik, Field, Form, ErrorMessage } from 'formik';

import Modal from 'components/Modal';
import Button from 'components/Button';
import Label from 'components/Forms/Label';
import ModalHeader from 'components/ModalHeader';

import { selectCurrentDateRange } from 'features/datePicker/datePickerSlice';
import { setAlert } from 'features/alerts/alertsSlice';
import {
  selectDisplayCampaignTypeChart,
  selectDisplayTargetingTypeChart,
} from '../advertisingSlice';

import classNames from 'utils/classNames';

const ExportButton = ({ accountId, marketplace, startDate, endDate }) => {
  const dispatch = useDispatch();
  const selectedDates = useSelector(selectCurrentDateRange);

  const displayCampaignTypeChart = useSelector(selectDisplayCampaignTypeChart);
  const displayTargetingTypeChart = useSelector(
    selectDisplayTargetingTypeChart
  );

  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const doExport = (
    type = 'analytics',
    data = { analysis: '', passAction: '', futurePlanOfAction: '' }
  ) => {
    setLoading(true);

    let payload = {
      accountId,
      marketplace,
      startDate: moment()
        .subtract(1, 'month')
        .startOf('month')
        .format('YYYY-MM-DD'),
      endDate: moment()
        .subtract(1, 'month')
        .endOf('month')
        .format('YYYY-MM-DD'),
      type,
      data,
      options: { displayCampaignTypeChart, displayTargetingTypeChart },
    };

    if (type === 'interactive-analytics') {
      payload.startDate = selectedDates.startDate;
      payload.endDate = selectedDates.endDate;
    }

    axios.post('/advertising/reports', payload).then(() => {
      setLoading(false);
      dispatch(
        setAlert(
          'success',
          'Export reports successful.',
          'Please go to reports page.'
        )
      );
    });
  };

  const onSubmit = async (values) => {
    await doExport(values);
    setOpenModal(false);
  };

  const onCancel = (e) => {
    e.preventDefault();
    setOpenModal(false);
  };

  const validationSchema = object().shape({
    analysis: string().required('Required'),
    passAction: string().required('Required'),
    futurePlanOfAction: string().required('Required'),
  });

  return (
    <>
      <Modal
        open={openModal}
        setOpen={setOpenModal}
        as={'div'}
        align="top"
        noOverlayClick={true}
        persistent={true}
      >
        <div className="inline-block w-full max-w-xl my-8 text-left align-middle transition-all transform bg-white shadow-xl rounded-xl">
          <ModalHeader
            title="Summary"
            titleClasses="text-sm font-normal"
            setOpen={setOpenModal}
            showCloseButton={false}
          />

          <div className="px-4 pb-10">
            <div className="mb-4">
              <Formik
                initialValues={{
                  analysis: '',
                  passAction: '',
                  futurePlanOfAction: '',
                }}
                onSubmit={onSubmit}
                validationSchema={validationSchema}
                enableReinitialize={true}
              >
                {({ handleChange, setFieldValue, values }) => (
                  <Form>
                    <div className="grid grid-cols-12 gap-4">
                      <div className="col-span-12">
                        <Label>Analysis</Label>
                        <Field
                          name="analysis"
                          className="form-select text-xs"
                          onChange={(e) => handleChange(e)}
                          as="textarea"
                        />
                        <ErrorMessage
                          name="analysis"
                          component="div"
                          className="text-red-700 font-normal text-xs"
                        />
                      </div>

                      <div className="col-span-12">
                        <Label>Pass Action</Label>
                        <Field
                          name="passAction"
                          className="form-select text-xs"
                          onChange={(e) => handleChange(e)}
                          as="textarea"
                        />
                        <ErrorMessage
                          name="passAction"
                          component="div"
                          className="text-red-700 font-normal text-xs"
                        />
                      </div>

                      <div className="col-span-12">
                        <Label>Future Plan Of Action</Label>
                        <Field
                          name="futurePlanOfAction"
                          className="form-select text-xs"
                          onChange={(e) => handleChange(e)}
                          as="textarea"
                        />
                        <ErrorMessage
                          name="futurePlanOfAction"
                          component="div"
                          className="text-red-700 font-normal text-xs"
                        />
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <button
                        onClick={(e) => {
                          onCancel(e);
                        }}
                        className="mt-2"
                        color="green"
                      >
                        Cancel
                      </button>
                      <Button type="submit" classes="mt-2">
                        Export
                      </Button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </Modal>

      <Menu as="div" className="relative inline-block text-left">
        <div>
          <Menu.Button className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500">
            Export
            <ChevronDownIcon
              className="-mr-1 ml-2 h-5 w-5"
              aria-hidden="true"
            />
          </Menu.Button>
        </div>

        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="z-50 origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="py-1">
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={() => doExport()}
                    disabled={loading}
                    className={classNames(
                      active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                      'text-left block px-4 py-2 text-sm w-full'
                    )}
                  >
                    Export Monthly Report
                  </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={() => doExport('interactive-analytics')}
                    disabled={loading}
                    className={classNames(
                      active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                      'text-left block px-4 py-2 text-sm w-full'
                    )}
                  >
                    Export Interactive Report
                  </button>
                )}
              </Menu.Item>
              {/* <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={() => setOpenModal(true)}
                    disabled={loading}
                    className={classNames(
                      active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                      'text-left block px-4 py-2 text-sm w-full'
                    )}
                  >
                    Export with Analysis
                  </button>
                )}
              </Menu.Item> */}
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </>
  );
};

export default ExportButton;
