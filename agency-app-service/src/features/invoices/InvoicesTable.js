import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  bulkCollectCharge,
  bulkEmail,
  fetchInvoices,
} from 'features/invoices/invoicesSlice';
import Button from 'components/Button';
import { MailIcon, CheckIcon, CreditCardIcon } from '@heroicons/react/outline';
import ConfirmationModal from 'components/ConfirmationModal';
import ZohoTable from 'components/Table/ZohoTable';
import usePermissions from 'hooks/usePermissions';
import useQuery from 'hooks/useQuery';

const InvoicesTable = ({ history, tableColumns, params, setParams }) => {
  let query = useQuery();
  const { userCan } = usePermissions();
  const { invoices } = useSelector((state) => state.invoices);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState([]);
  const [isOpenCollectModal, setIsOpenCollectModal] = useState(false);
  const [isOpenEmailModal, setIsOpenEmailModal] = useState(false);

  useEffect(() => {
    if (params.page > 0) {
      setLoading(true);
      dispatch(fetchInvoices(params)).then(() => {
        setLoading(false);
      });
    }
  }, [params, dispatch]);

  const onSelect = (row, isSelect) => {
    if (isSelect) {
      setSelected([...selected, row.invoice_id]);
    } else {
      let selectedRows = [...selected];
      selectedRows = selectedRows.filter((r) => r !== row.invoice_id);
      setSelected(selectedRows);
    }
  };

  const onSelectAll = (isSelect, rows) => {
    const ids = rows.map((r) => r.invoice_id);
    setSelected(isSelect ? ids : []);
  };

  const selectRow = {
    mode: 'checkbox',
    clickToSelect: false,
    classes: 'bg-red-50 bg-opacity-50',
    selectColumnStyle: { padding: '1rem' },
    onSelect,
    onSelectAll,
  };

  const onCollectCharge = () => {
    const selectedInvoices = selected.map((i) => {
      let currentInvoice = invoices.rows.find((i) => i.invoice_id);
      return {
        invoiceId: i,
        number: currentInvoice.number,
      };
    });

    dispatch(bulkCollectCharge(selectedInvoices)).then((res) => {
      setIsOpenCollectModal(false);
    });
  };

  const onEmail = () => {
    const body = selected.map((i) => {
      let currentInvoice = invoices.rows.find((i) => i.invoice_id);
      return {
        invoiceId: i,
        email: currentInvoice.email,
        zohoId: currentInvoice.customer_id,
        name: currentInvoice.customer_name,
        number: currentInvoice.number,
      };
    });

    dispatch(bulkEmail(body)).then((res) => {
      setIsOpenEmailModal(false);
    });
  };

  const selectedList = () => {
    return (
      <div className="">
        <ul className="sm:grid sm:grid-cols-3 sm:gap-1">
          {selected.map((id) => {
            let ci = invoices.rows.find((i) => i.invoice_id === id);
            return (
              <li key={id} className="py-1">
                <CheckIcon className="w-5 h-5 text-green-400 inline" />
                &nbsp; {ci.number}
              </li>
            );
          })}
        </ul>
      </div>
    );
  };

  return (
    <div className="flex flex-col">
      <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          {selected && selected.length > 0 && (
            <div className="pt-5 flex gap-2">
              {userCan('invoices.email.bulk') && (
                <Button title="Email" onClick={() => setIsOpenEmailModal(true)}>
                  <MailIcon className="w-4 h-4" />
                  &nbsp;Email
                </Button>
              )}

              {userCan('invoices.collect.bulk') && (
                <Button
                  title="Collect Charge"
                  onClick={() => setIsOpenCollectModal(true)}
                >
                  <CreditCardIcon className="w-5 h-5 mr-1 inline" /> Collect
                  charge
                </Button>
              )}
            </div>
          )}
          <div className="mt-5">
            <ZohoTable
              data={invoices}
              keyField="invoice_id"
              tableColumns={tableColumns}
              {...(userCan('invoices.collect.bulk|invoices.email.bulk') && {
                selectRow,
              })}
              loading={loading}
              localParams={params}
              setLocalParams={setParams}
              history={history}
              currentUrlParams={query}
            />
          </div>
        </div>
        <ConfirmationModal
          title="Collect charges for the ff. invoices?"
          content={selectedList()}
          open={isOpenCollectModal}
          setOpen={setIsOpenCollectModal}
          onOkClick={onCollectCharge}
          onCancelClick={() => setIsOpenCollectModal(false)}
          size="sm"
        />
        <ConfirmationModal
          title="Email the ff. invoices to their clients?"
          content={selectedList()}
          open={isOpenEmailModal}
          setOpen={setIsOpenEmailModal}
          onOkClick={onEmail}
          onCancelClick={() => setIsOpenEmailModal(false)}
          size="sm"
        />
      </div>
    </div>
  );
};
export default InvoicesTable;
