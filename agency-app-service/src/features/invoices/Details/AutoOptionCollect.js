import { StopIcon, PlayIcon, CreditCardIcon } from '@heroicons/react/solid';
import Button from 'components/Button';
import { dateFormatter } from 'utils/formatters';

const AutoOptionCollect = ({ invoice, saving, onChangePauseCollect }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto relative bg-white px-4 py-3 border-b">
        <div className="flex items-center justify-between">
          <span
            className={`text-xs ${
              invoice.custom_field_hash.cf_pause_collect &&
              invoice.custom_field_hash.cf_pause_collect_unformatted
                ? 'text-red-500'
                : 'text-green-500'
            }`}
          >
            <CreditCardIcon className="w-6 h-6 inline mr-2 text-gray-500" />
            {invoice.custom_field_hash.cf_pause_collect &&
            invoice.custom_field_hash.cf_pause_collect_unformatted ? (
              'Auto Collect OFF. This invoice must be collected manually'
            ) : (
              <>
                Auto Collect ON. This invoice will be collected automatically on
                <b className="ml-1 text-gray-500">
                  {dateFormatter(invoice.due_date)}
                </b>
              </>
            )}
          </span>

          <Button
            onClick={onChangePauseCollect}
            loading={saving}
            showLoading={true}
            color={
              invoice.custom_field_hash.cf_pause_collect &&
              invoice.custom_field_hash.cf_pause_collect_unformatted
                ? 'green'
                : 'red'
            }
          >
            {invoice.custom_field_hash.cf_pause_collect &&
            invoice.custom_field_hash.cf_pause_collect_unformatted ? (
              <>
                <PlayIcon className="w-5 h-5 inline mr-2" />
                Auto collect
              </>
            ) : (
              <>
                <StopIcon className="w-5 h-5 inline mr-2" />
                Stop auto collect
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AutoOptionCollect;
