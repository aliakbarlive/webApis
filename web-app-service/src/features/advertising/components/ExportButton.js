import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import Loader from 'react-loader-spinner';

import { selectCurrentDateRange } from 'features/datePicker/datePickerSlice';
import {
  selectCurrentAccount,
  selectCurrentMarketplace,
} from 'features/accounts/accountsSlice';

import classNames from 'utils/classNames';

const ExportButton = ({ recordType, params }) => {
  const account = useSelector(selectCurrentAccount);
  const marketplace = useSelector(selectCurrentMarketplace);
  const selectedDates = useSelector(selectCurrentDateRange);

  const [exporting, setExporting] = useState(false);

  const onExport = () => {
    setExporting(true);
    const payload = {
      ...params,
      ...selectedDates,
      recordType,
      accountId: account.accountId,
      marketplace: marketplace.details.countryCode,
    };

    delete payload.page;
    delete payload.pageSize;

    axios({
      method: 'GET',
      url: '/ppc/export',
      params: payload,
      responseType: 'arraybuffer',
    })
      .then((response) => {
        const type = response.headers['content-type'];

        const date = new Date().valueOf();
        let fileName = `${recordType}-${date}.csv`;

        if (response.headers['Content-Disposition']) {
          fileName = response.headers['Content-Disposition']
            .replace('attachment; filename="', '')
            .replace('"', '');
        }

        const blob = new Blob([response.data], {
          type: type,
          encoding: 'UTF-8',
        });

        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = fileName;
        link.click();
      })
      .finally(() => setExporting(false));
  };

  return (
    <button
      type="submit"
      className={classNames(
        exporting && 'disabled:opacity-50',
        'w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'
      )}
      disabled={exporting ? true : false}
      onClick={onExport}
    >
      {exporting && (
        <Loader
          type="Oval"
          color="#FFF"
          height={20}
          width={20}
          className="mr-2"
        />
      )}
      Export
    </button>
  );
};

export default ExportButton;
