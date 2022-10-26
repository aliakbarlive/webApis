import { useTranslation } from 'react-i18next';

import Modal from 'components/Modal';
import ModalHeader from 'components/ModalHeader';
import SmartFilterItem from './SmartFilterItem';

import { CAN_COMPARE_WITH_CPC } from '../../utils/constants';

const SmartFilterModal = ({
  open,
  filter,
  setOpen,
  onChangeFilterItem,
  onClearFilters,
  onApplyFilters,
}) => {
  const { t } = useTranslation();

  return (
    <Modal open={open} setOpen={setOpen} as={'div'} align="top">
      <div className="inline-block w-full max-w-4xl my-8 text-left align-middle transition-all transform bg-white shadow-xl rounded-xl">
        <ModalHeader
          title={t('Advertising.Filters.SmartFilter')}
          setOpen={setOpen}
        />

        <ul className="divide-y divide-gray-200 px-6">
          {filter.values.map((filter, index) => {
            return (
              <SmartFilterItem
                index={index}
                filter={filter}
                key={filter.attribute}
                onChange={onChangeFilterItem}
                canCompareWithCPC={CAN_COMPARE_WITH_CPC.includes(
                  filter.attribute
                )}
              />
            );
          })}
        </ul>

        <div className="flex justify-end my-4 px-6 border-t pt-4">
          <button
            className="py-2 px-4 mr-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 focus:outline-none"
            onClick={onClearFilters}
          >
            {t('Advertising.Filters.Clear')}
          </button>

          <button
            className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none"
            onClick={onApplyFilters}
          >
            {t('Advertising.Filters.Filter')}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default SmartFilterModal;
