import { useSelector } from 'react-redux';
import { selectAlerts } from './alertsSlice';
import MultiAlert from './MultiAlert';

const Alerts = () => {
  const alerts = useSelector(selectAlerts);

  return (
    <div
      aria-live="assertive"
      className="z-20 fixed inset-0 flex items-end px-4 py-6 pointer-events-none sm:p-6 sm:items-start"
    >
      <div className="w-full flex flex-col items-center space-y-4 sm:items-end">
        {alerts && alerts.length > 0 && <MultiAlert alerts={alerts} />}
      </div>
    </div>
  );
};

export default Alerts;
