import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import Loader from 'react-loader-spinner';

import { selectCurrentDateRange } from 'features/datePicker/datePickerSlice';

import {
  selectExporting,
  exportDataAsync,
} from 'features/advertising/advertisingSlice';

import classNames from 'utils/classNames';

const ExportButton = ({
  accountId,
  marketplace,
  recordType,
  params,
  className,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const selectedDates = useSelector(selectCurrentDateRange);
  const exporting = useSelector(selectExporting);

  const onExport = () => {
    const payload = {
      ...params,
      ...selectedDates,
      recordType,
      accountId,
      marketplace,
    };

    delete payload.page;
    delete payload.pageSize;

    dispatch(exportDataAsync(payload));
  };

  return (
    <button
      type="submit"
      className={classNames(
        exporting && 'disabled:opacity-50',
        `w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 ${className}`
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
      {t('Advertising.ExportButton')}
    </button>
  );
};

export default ExportButton;
