import Button from 'components/Button';

import { TrashIcon } from '@heroicons/react/outline';
import { currencyFormatter } from 'utils/formatters';
import Label from 'components/Forms/Label';
import Select from 'components/Forms/Select';
import Textarea from 'components/Forms/Textarea';
import RequiredAsterisk from 'components/Forms/RequiredAsterisk';
import classNames from 'utils/classNames';
import { nameFormatter } from 'utils/formatters';
import { ExclamationIcon } from '@heroicons/react/solid';
import { Link } from 'react-router-dom';
import usePermissions from 'hooks/usePermissions';

const TerminationForm = ({
  setOpen,
  client,
  termination,
  pendingInvoices,
  total,
  loading,
  formik,
  deleteTermination,
  accountManager,
  seniorAccountManager,
}) => {
  const { userCan } = usePermissions();

  return (
    <div>
      {userCan('termination.approve') &&
        pendingInvoices?.invoices &&
        pendingInvoices.invoices.length > 0 && (
          <div className="bg-yellow-50 rounded-lg text-gray-700 text-sm p-3 mb-3 sm:flex">
            <span>
              <ExclamationIcon className="w-7 h-7 text-red-700 mr-2" />
            </span>
            <p>
              Upon cancellation, Zoho Subscriptions will not charge the customer
              for any open invoices. Currently there are
              <b className="text-red-500">
                &nbsp;{pendingInvoices.invoices.length}&nbsp;
              </b>
              open invoices amounting
              <b className="text-red-500">
                &nbsp;{currencyFormatter(total)}&nbsp;
              </b>
              due for payment.&nbsp;
              <span className="text-yellow-700">
                You can collect offline payment and mark the invoices as closed
                or in the event of non-payment, mark it as void or write off.
              </span>
              &nbsp;
              <span className="mt-1 block w-full ">
                <Link
                  className="bg-yellow-200 hover:bg-yellow-300 py-1 px-2 text-xs text-gray-700 rounded-md"
                  to={`/clients/profile/${client.agencyClientId}/invoicehistory`}
                >
                  View Invoices
                </Link>
              </span>
            </p>
          </div>
        )}
      <form
        name="terminationRequest"
        onSubmit={(e) => {
          e.preventDefault();
          formik.handleSubmit(e);
        }}
      >
        <div className="mb-3">
          <div className={`flex flex-col space-y-2 text-left bg-transparent`}>
            <div className="col-span-2">
              <Label htmlFor="client" classes="text-left">
                Client
              </Label>
              <div className="text-md px-2">
                <Link
                  className="text-red-500 "
                  to={`/clients/profile/${client.agencyClientId}`}
                >
                  {client.client}
                </Link>
              </div>
            </div>
            <div className="sm:grid grid-cols-2">
              <div className="col-span-1 sm:flex flex-col">
                <Label htmlFor="accountManager" classes="text-left">
                  Account Manager
                </Label>
                <span className="text-sm px-2">
                  {accountManager && (
                    <>
                      {nameFormatter(accountManager)}
                      <br />
                      <a
                        href={`mailto:${accountManager.email}`}
                        className="text-red-500"
                      >
                        {accountManager.email}
                      </a>
                    </>
                  )}
                  {formik.touched.accountManagerId &&
                    formik.errors.accountManagerId && (
                      <p className="text-xs text-red-600 bg-red-50 p-2 rounded-sm">
                        {formik.errors.accountManagerId}
                      </p>
                    )}
                  {/* <Input
            type="text"
            id="accountManager"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.accountManager}
            classes={classNames(
              formik.touched.accountManager && formik.errors.accountManager
                ? 'border-red-300'
                : 'border-gray-300'
            )}
          />
          {formik.touched.accountManager && formik.errors.accountManager && (
            <p className="mt-2 text-sm text-red-600">
              {formik.errors.accountManager}
            </p>
          )} */}
                </span>
              </div>
              <div className="col-span-1 sm:flex flex-col">
                <Label htmlFor="seniorAccountManager" classes="text-left">
                  Senior Account Manager
                </Label>
                <span className="px-2 text-sm">
                  {seniorAccountManager && (
                    <>
                      {nameFormatter(seniorAccountManager)}
                      <br />
                      <a
                        href={`mailto:${seniorAccountManager.email}`}
                        className="text-red-500"
                      >
                        {seniorAccountManager.email}
                      </a>
                    </>
                  )}
                  {formik.touched.seniorAccountManagerId &&
                    formik.errors.seniorAccountManagerId && (
                      <p className="text-xs text-red-600 bg-red-50 p-2 rounded-sm">
                        {formik.errors.seniorAccountManagerId}
                      </p>
                    )}
                  {/* <Select
            id="seniorAccountManager"
            value={formik.values.seniorAccountManager}
            onChange={formik.handleChange}
            className={classNames(
              formik.touched.seniorAccountManager &&
                formik.errors.seniorAccountManager
                ? 'border-red-300'
                : 'border-gray-300'
            )}
          >
            <option value="">Choose One</option>
          </Select>
          {formik.touched.seniorAccountManager &&
            formik.errors.seniorAccountManager && (
              <p className="mt-2 text-sm text-red-600">
                {formik.errors.seniorAccountManager}
              </p>
            )} */}
                </span>
              </div>
            </div>
            <div className="col-span-2">
              <Label htmlFor="terminationDate" classes="text-left">
                Termination Date
              </Label>
              <div className="px-2 text-sm">
                {formik.values.terminationDate}
              </div>
              {/* <div className="sm:grid grid-cols-6">
          <div className="col-span-1 ">
            <Label htmlFor="mm" classes="text-left text-xs text-gray-50">
              MM
            </Label>
            <div className="flex items-center">
              <Input
                id="terminationDateMm"
                name="terminationDateMm"
                type="number"
                min={1}
                max={12}
                value={formik.values.terminationDateMm}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                touched={formik.touched.terminationDateMm}
                classes={classNames(
                  formik.touched.terminationDateMm &&
                    formik.errors.terminationDate
                    ? 'border-red-300'
                    : 'border-gray-300'
                )}
              />
              <span className="px-1">/</span>
            </div>
          </div>
          <div className="col-span-1 ">
            <Label htmlFor="dd" classes="text-left text-xs text-gray-50">
              DD
            </Label>
            <div className="flex items-center">
              <Input
                id="terminationDateDd"
                name="terminationDateDd"
                type="number"
                min={1}
                max={31}
                value={formik.values.terminationDateDd}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                touched={formik.touched.terminationDateDd}
                classes={classNames(
                  formik.touched.terminationDateDd &&
                    formik.errors.terminationDate
                    ? 'border-red-300'
                    : 'border-gray-300'
                )}
              />
              <span className="px-1">/</span>
            </div>
          </div>
          <div className="col-span-1 ">
            <Label htmlFor="yy" classes="text-left text-xs text-gray-50">
              YYYY
            </Label>
            <div className="flex items-center">
              <Input
                id="terminationDateYy"
                name="terminationDateYy"
                type="number"
                min={minYear.getFullYear()}
                value={formik.values.terminationDateYy}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                touched={formik.touched.terminationDateYy}
                classes={classNames(
                  formik.touched.terminationDateYy &&
                    formik.errors.terminationDate
                    ? 'border-red-300'
                    : 'border-gray-300'
                )}
              />
            </div>
          </div>
          <div className="col-span-6">
            {formik.touched.terminationDateMm &&
              formik.touched.terminationDateDd &&
              formik.touched.terminationDateYy &&
              formik.errors.terminationDate && (
                <p className="mt-2 text-sm text-red-600">
                  {formik.errors.terminationDate}
                </p>
              )}
          </div>
        </div> */}
            </div>
            <div className="col-span-2">
              <Label htmlFor="reason" classes="text-left">
                Reason <RequiredAsterisk />
              </Label>
              <div>
                <Select
                  id="reason"
                  value={formik.values.reason}
                  onChange={formik.handleChange}
                  className={classNames(
                    formik.touched.reason && formik.errors.reason
                      ? 'border-red-300'
                      : 'border-gray-300'
                  )}
                >
                  <option value="">Choose One</option>
                  <option value="PPC Issues">PPC Issues</option>
                  <option value="Communication Issues">
                    Communication Issues
                  </option>
                  <option value="Design Issues">Design Issues</option>
                  <option value="Writing Issues">Writing Issues</option>
                  <option value="Poor Sales Growth">Poor Sales Growth</option>
                  <option value="Client Side Issue (Going out of business, unable to afford us, hired inhouse team etc)">
                    Client Side Issue (Going out of business, unable to afford
                    us, hired inhouse team etc)
                  </option>
                  <option value="Lack of Reporting/Strategies">
                    Lack of Reporting/Strategies
                  </option>
                  <option value="Other">Other</option>
                  <option value="SI Terminated">SI Terminated</option>
                </Select>
                {formik.touched.reason && formik.errors.reason && (
                  <p className="mt-2 text-sm text-red-600">
                    {formik.errors.reason}
                  </p>
                )}
              </div>
            </div>
            <div className="col-span-2">
              <Label htmlFor="moreInformation" classes="text-left">
                More Information
              </Label>
              <div>
                <Textarea
                  id="moreInformation"
                  value={formik.values.moreInformation}
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  rows={8}
                />
                {formik.touched.moreInformation &&
                  formik.errors.moreInformation && (
                    <p className="mt-2 text-sm text-red-600">
                      {formik.errors.moreInformation}
                    </p>
                  )}
              </div>
            </div>
            <div className="col-span-2">
              <Label htmlFor="status" classes="text-left">
                Status
              </Label>
              <div>
                <Select
                  id="status"
                  value={formik.values.status}
                  onChange={formik.handleChange}
                >
                  <option value="pending">Pending</option>
                  {userCan('termination.approve') && (
                    <>
                      <option value="approved">Approved</option>
                      <option value="cancelled">Cancelled</option>
                    </>
                  )}
                </Select>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between">
          <div>
            {termination &&
              (termination.status === 'pending' ||
                termination.status === 'cancelled') &&
              userCan('termination.delete') && (
                <Button
                  classes="mt-2 mr-2"
                  bgColor="gray-50"
                  textColor="red-700"
                  hoverColor="gray-100"
                  onClick={deleteTermination}
                >
                  <TrashIcon className="w-5 h-5 inline" />
                </Button>
              )}
          </div>
          <div className="text-right">
            <Button
              classes="mt-2 mr-2"
              color="gray"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              classes="mt-2"
              loading={loading}
              showLoading={true}
            >
              Submit
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default TerminationForm;
