import { useSelector } from 'react-redux';
import { selectAppNotifications } from './appNotificationSlice';
import AppNotification from './AppNotification';

const AppNotifications = () => {
  const appNotifications = useSelector(selectAppNotifications);

  return (
    <div
      aria-live="assertive"
      className="z-20 fixed inset-0 flex items-end px-4 py-6 pointer-events-none sm:p-6 sm:items-start"
    >
      <div className="w-full flex flex-col items-center space-y-4 sm:items-end">
        {appNotifications.map((appNotification) => (
          <AppNotification
            key={appNotification.id}
            appNotification={appNotification}
          />
        ))}
      </div>
    </div>
  );
};

export default AppNotifications;
