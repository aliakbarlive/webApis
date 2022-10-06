import { StopIcon, PlayIcon } from '@heroicons/react/solid';
import { AnnotationIcon } from '@heroicons/react/outline';
import Button from 'components/Button';

const AutoOptionEmail = ({ invoice, saving, onChangePauseEmail }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto relative bg-white px-4 py-3 border-b">
        <div className="flex items-center justify-between">
          <span
            className={`text-xs ${
              invoice.custom_field_hash.cf_pause_email &&
              invoice.custom_field_hash.cf_pause_email_unformatted
                ? 'text-red-500'
                : 'text-green-500'
            }`}
          >
            <AnnotationIcon className="w-5 h-5 inline mr-2 text-gray-500" />
            {invoice.custom_field_hash.cf_pause_email &&
            invoice.custom_field_hash.cf_pause_email_unformatted
              ? 'Auto Email OFF. This invoice must be sent manually'
              : 'Auto Email ON. This invoice will be sent automatically after 24 hours'}
          </span>

          <Button
            onClick={onChangePauseEmail}
            loading={saving}
            showLoading={true}
            color={
              invoice.custom_field_hash.cf_pause_email &&
              invoice.custom_field_hash.cf_pause_email_unformatted
                ? 'green'
                : 'red'
            }
          >
            {invoice.custom_field_hash.cf_pause_email &&
            invoice.custom_field_hash.cf_pause_email_unformatted ? (
              <>
                <PlayIcon className="w-5 h-5 inline mr-2" />
                Add to automatic send
              </>
            ) : (
              <>
                <StopIcon className="w-5 h-5 inline mr-2" />
                Stop automatic send
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AutoOptionEmail;
