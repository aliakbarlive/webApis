import { Popover } from '@headlessui/react';
import classNames from 'utils/classNames';

const BsPopover = ({ title, titleClass, children }) => {
  return (
    <Popover>
      {({ open }) => (
        <>
          <Popover.Button
            className={classNames(open && 'opened', titleClass && titleClass)}
          >
            {title}
          </Popover.Button>
          <Popover.Panel>{children}</Popover.Panel>
        </>
      )}
    </Popover>
  );
};

export default BsPopover;
