import { Card } from 'components';
import { joiAlertErrorsStringify, agoUTC } from 'utils/formatters';

const ConversationThread = ({ el }) => {
  return (
    <Card>
      <div className="grid grid-cols-12 gap-4">
        {el.sentFrom && (
          <div className="col-span-8">
            <span className="text-sm whitespace-pre-wrap">
              Sent From: {el.sentFrom} -
            </span>

            <span className="text-sm font-medium text-gray-700">
              {el.siPlatFormValue}
              {el.leadPlatForm}
            </span>
            <span className="text-sm font-medium text-gray-600">
              &nbsp;[{el.siPlatForm}
              {el.leadPlatFormValue}]
            </span>
          </div>
        )}
        {el.sentTo && (
          <div className="col-span-8">
            <span className="text-sm font-medium text-gray-700">
              Sent To: {el.sentTo}
            </span>
            <span className="text-sm font-medium text-gray-600">
              &nbsp;[{el.sentToValue}]
            </span>
          </div>
        )}
        <div className="col-span-8">{el.fullMessage}</div>
        <div className="col-span-4">
          <div className="flex justify-end text-sm">
            <span className="text-gray-500 text-xs">
              {agoUTC(el.createdAt)}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ConversationThread;
