import SlideOver from 'components/SlideOver';
import { useEffect, Fragment, useState, useCallback } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import { object, string } from 'yup';
import ReactTooltip from 'react-tooltip';
import {
  ClipboardIcon,
  XIcon,
  ExclamationIcon,
  UserCircleIcon,
  LinkIcon,
  ExternalLinkIcon,
  RefreshIcon,
  UploadIcon,
} from '@heroicons/react/outline';

import Label from 'components/Forms/Label';
import Button from 'components/Button';

const LeadSlideOver = ({
  open,
  setOpen,
  onUpdateLead,
  formRef,
  copyToClipboard,
  onUploadImage,
  onPhasteImage,
}) => {
  useEffect(() => {
    ReactTooltip.rebuild();
  }, []);

  const timezoneList ={
    newYork: "America/New_York", // -5:00 (-4)
  }

  const timezone = timezoneList.newYork

  const validationSchema = object().shape({
    date: string().required(),
    time: string().required(),
    screenShot: string().required(),
  });
  const data = {
    date: '',
    time: '',
    screenShot: '',
    screenShotDate: '',
  };

  const onSubmit = (values) => {
    let status = formRef.current.values.status;
    let newData = {};
    if (
      ['Positive-Response', 'Neutral-Response', 'Negative-Response'].includes(
        status
      )
    ) {
      newData.dateTimeOfResponse = `${values.date} ${values.time}:00`;
      newData.responseDateCallScreenshot = values.screenShot;
      newData.dateTimeWeResponded = values.screenShotDate;
    } else {
      newData.dateOfCall = `${values.date} ${values.time}:00`;
      newData.dateOfCallScreenshot = values.screenShot;
      newData.dateBooked = values.screenShotDate;
    }
    onUpdateLead({ ...formRef.current.values, ...newData });
    setOpen(false);
  };

  return (
    <SlideOver
      open={open}
      setOpen={setOpen}
      title={
        formRef &&
        formRef.current &&
        ['Positive-Response', 'Neutral-Response', 'Negative-Response'].includes(
          formRef.current.values.status
        )
          ? 'Response'
          : 'Book'
      }
      titleClasses="capitalize"
      size="3xl"
    >
      <div className="flow-root">
        <Formik
          initialValues={data}
          onSubmit={onSubmit}
          validationSchema={validationSchema}
          enableReinitialize={true}
        >
          {({ handleChange, setFieldValue, values }) => (
            <Form>
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-6">
                  <Label>DATE</Label>
                  <Field
                    name="date"
                    placeholder="Key"
                    className="form-select text-sm"
                    onChange={(e) => handleChange(e)}
                    type="date"
                    timezone={timezone}
                  />
                  <ErrorMessage
                    name="date"
                    component="div"
                    className="text-red-700 font-normal text-xs"
                  />
                </div>
                <div className="col-span-6">
                  <Label>TIME (EST)</Label>
                  <Field
                    name="time"
                    placeholder="TIME (EST)"
                    className="form-select text-sm"
                    onChange={(e) => handleChange(e)}
                    type="time"
                    timezone={timezone}
                  />
                  <ErrorMessage
                    name="time"
                    component="div"
                    className="text-red-700 font-normal text-xs"
                  />
                </div>
                {values.screenShot ? (
                  <div className="col-span-12">
                    <Label>
                      Screenshot
                      <XIcon
                        onClick={() => setFieldValue('screenShot', '')}
                        className="cursor-pointer ml-2 inline h-5 w-5"
                        color="gray"
                        data-tip="Change screenshot"
                      />
                      <ExternalLinkIcon
                        onClick={() => {
                          let image = new Image();
                          image.src = values.screenShot;
                          window.open('').document.write(image.outerHTML);
                        }}
                        className="cursor-pointer ml-2 inline h-5 w-5"
                        color="gray"
                        data-tip="Open in new tab"
                      />
                      <ClipboardIcon
                        onClick={() => copyToClipboard(values.screenShot)}
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
                      src={values.screenShot}
                      data-tip={values.screenShotDate}
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
                  <div className="col-span-12">
                    <div className="flex flex-row justify-between">
                      <div>
                        <Label>Screenshot</Label>
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
                              'screenShot',
                              'screenShotDate'
                            )
                          }
                        />
                      </div>
                    </div>

                    <Field
                      name="screenShot"
                      placeholder="Paste image here"
                      className="form-select text-sm"
                      onPaste={(e) =>
                        onPhasteImage(
                          e,
                          setFieldValue,
                          'screenShot',
                          'screenShotDate'
                        )
                      }
                      as="textarea"
                    />
                    <ErrorMessage
                      name="screenShot"
                      component="div"
                      className="text-red-700 font-normal text-xs"
                    />
                  </div>
                )}
              </div>
              <div className="flex justify-between">
                <button
                  onClick={() => setOpen(false)}
                  className="mt-2"
                  color="green"
                >
                  Cancel
                </button>
                <Button
                  onClick={() => console.log(values)}
                  type="submit"
                  classes="mt-2"
                >
                  Save
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </SlideOver>
  );
};

export default LeadSlideOver;
