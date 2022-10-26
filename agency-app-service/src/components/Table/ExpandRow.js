import { PlusIcon, MinusIcon } from '@heroicons/react/outline';

const ExpandRow = ({
  className = '',
  renderer,
  onlyOneExpanding = true,
  showExpandColumn = true,
  expandByColumnOnly = true,
  hideHeaderColumn = false,
}) => {
  const collapsedCol = (
    <b className="ml-5 cursor-pointer">
      <MinusIcon className="w-4 h-4 inline" />
    </b>
  );

  const expandedCol = (
    <b className="ml-5 cursor-pointer">
      <PlusIcon className="w-4 h-4 inline" />
    </b>
  );

  return {
    className,
    renderer,
    onlyOneExpanding,
    showExpandColumn,
    expandByColumnOnly,
    expandHeaderColumnRenderer: ({ isAnyExpands }) => {
      if (hideHeaderColumn) {
        return '';
      } else {
        if (isAnyExpands) {
          return collapsedCol;
        }
        return expandedCol;
      }
    },
    expandColumnRenderer: ({ expanded }) => {
      if (expanded) {
        return collapsedCol;
      }
      return expandedCol;
    },
  };
};
export default ExpandRow;
