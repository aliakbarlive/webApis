import axios from 'axios';
import { groupBy } from 'lodash';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { selectReport } from '../optimizationSlice';
import { setAlert } from 'features/alerts/alertsSlice';

import Button from 'components/Button';
import OptimizationSummary from './summary/OptimizationSummary';

const ProceedButton = ({ accountId, marketplace }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const report = useSelector(selectReport);

  const [openSummary, setOpenSummary] = useState(false);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState({});

  const onClick = async () => {
    setLoading(true);

    const response = await axios.get(
      `ppc/optimizations/reports/${report.advOptimizationReportId}`,
      {
        params: {
          accountId,
          marketplace,
          include: ['selectedItems'],
        },
      }
    );

    const reportItems = response.data.data.items;

    if (!reportItems.length) {
      dispatch(
        setAlert(
          'error',
          'No selected items',
          'Please select at least one to proceed'
        )
      );
    }

    if (reportItems.length) {
      const formattedItems = reportItems.map((item) => {
        item.selectedOption = item.options[0];
        delete item.options;
        return item;
      });

      setItems(groupBy(formattedItems, 'selectedOption.rule.action.code'));
      setOpenSummary(true);
    }

    setLoading(false);
  };

  return (
    <>
      {report && (
        <OptimizationSummary
          items={items}
          open={openSummary}
          accountId={accountId}
          setOpen={setOpenSummary}
          marketplace={marketplace}
          recordType={report.recordType}
          reportId={report.advOptimizationReportId}
        />
      )}

      <Button
        classes="disabled:opacity-75 w-full flex justify-center"
        disabled={!report || loading}
        loading={loading}
        showLoading
        onClick={onClick}
      >
        {t('Advertising.Optimization.Proceed')}
      </Button>
    </>
  );
};
export default ProceedButton;
