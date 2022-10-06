import React from 'react';
import { useTranslation } from 'react-i18next';

const GraphSwitcher = ({ graphType, onToggleGraphType }) => {
  const { t } = useTranslation();
  return (
    <div className="flex justify-center rounded-lg text-sm" role="group">
      <button
        className={`${
          graphType ? 'bg-white text-red-500' : 'bg-red-500 text-white'
        }  hover:bg-red-500 hover:text-white border border-r-1 border-red-500 px-2 py-2 mx-0 outline-none focus:shadow-outline w-16`}
        onClick={() => onToggleGraphType(false)}
      >
        {t('Snapshots.PerformanceGraphModal.Line')}
      </button>
      <button
        className={`${
          graphType ? 'bg-red-500 text-white' : 'bg-white text-red-500'
        } hover:bg-red-500 hover:text-white border border-l-0 border-red-500 px-2 py-2 mx-0 outline-none focus:shadow-outline w-16`}
        onClick={() => onToggleGraphType(true)}
      >
        {t('Snapshots.PerformanceGraphModal.Bar')}
      </button>
    </div>
  );
};

export default GraphSwitcher;
