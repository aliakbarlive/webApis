import ReactTooltip from 'react-tooltip';
import { FolderOpenIcon } from '@heroicons/react/outline';

const ChangeRequestActions = ({ changeRequestId, onClick }) => {
  return (
    <div>
      <ReactTooltip
        place="top"
        className="max-w-xs text-black"
        backgroundColor="rgba(229, 231, 235, var(--tw-bg-opacity))"
        textColor="rgba(17, 24, 39, var(--tw-text-opacity))"
      />
      <FolderOpenIcon
        className="h-6 w-6 cursor-pointer"
        data-tip="Click to view details"
        onClick={() => onClick(changeRequestId)}
      />
    </div>
  );
};

export default ChangeRequestActions;
