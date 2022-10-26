import { startCase } from 'lodash';

export const statusFormatter = (state) => {
  let color = '';

  switch (state) {
    case 'PENDING':
    case 'STARTED':
      color = 'gray';
      break;
    case 'REQUESTED':
    case 'IN-PROGRESS':
      color = 'blue';
      break;
    case 'REQUESTING':
      color = 'purple';
      break;
    case 'PROCESSED':
      color = 'green';
      break;
    case 'PROCESSING':
    case 'COMPLETED':
      color = 'yellow';
      break;
    case 'FAILED':
      color = 'red';
      break;
    default:
      color = 'gray';
      break;
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${color}-100 text-${color}-800`}
    >
      {startCase(state)}
    </span>
  );
};
