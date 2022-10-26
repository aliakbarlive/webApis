import {
  ENABLED_STATUS,
  PAUSED_STATUS,
  ARCHIVED_STATUS,
  LESS_THAN,
  LESS_THAN_OR_EQUAL_TO,
  NOT_EQUAL_TO,
  EQUAL_TO,
  BETWEEN,
  GREATER_THAN,
  GREATER_THAN_OR_EQUAL_TO,
} from './constants';

export const stateFormatter = (state) => {
  let color = 'gray';

  switch (state) {
    case ENABLED_STATUS:
      color = 'green';
      break;
    case PAUSED_STATUS:
      color = 'yellow';
      break;
    case ARCHIVED_STATUS:
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
      {state}
    </span>
  );
};

export const filterToReadableText = ({ attribute, comparison, value }) => {
  switch (comparison) {
    case LESS_THAN:
      return `${attribute} < ${value}`;
    case LESS_THAN_OR_EQUAL_TO:
      return `${attribute} <= ${value}`;
    case NOT_EQUAL_TO:
      return `${attribute} != ${value}`;
    case EQUAL_TO:
      return `${attribute} = ${value}`;
    case BETWEEN:
      const [min, max] = value;
      return `${attribute} between ${min} - ${max}`;
    case GREATER_THAN:
      return `${attribute} > ${value}`;
    case GREATER_THAN_OR_EQUAL_TO:
      return `${attribute} >= ${value}`;

    default:
      return `${attribute} ${comparison} ${value}`;
  }
};
