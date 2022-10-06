import { withRouter } from 'react-router-dom';
import classnames from 'classnames';

const SidebarSubmenuLink = ({ onOpen, open, currentItem, item }) => {
  const isSelectedMenu = () => {
    return currentItem && open && currentItem.name === item.name;
  };

  const markSelected = () => {
    return currentItem && !open && currentItem.name === item.name;
  };

  return (
    <div
      className={classnames(
        'flex-col text-white rounded-md hover:bg-white hover:text-red-500 flex relative cursor-pointer w-full p-3 text-xs items-center focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75',
        {
          'bg-white text-red-500': isSelectedMenu(),
        },
        {
          'bg-white text-red-500': markSelected(),
        }
      )}
      onClick={() => onOpen(item)}
    >
      <item.icon className="h-6 w-6" aria-hidden="true" />
      <span
        className={classnames(
          'mt-2 flex items-center before-arrow',
          {
            expand: isSelectedMenu(),
          },
          {
            'is-selected': markSelected(),
          }
        )}
      >
        {item.name}
      </span>
    </div>
  );
};

export default withRouter(SidebarSubmenuLink);
