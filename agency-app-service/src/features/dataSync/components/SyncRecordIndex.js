import { Route, Switch } from 'react-router';
import SyncRecords from './SyncRecords';
import SyncReports from './SyncReports';

const SyncRecordIndex = () => {
  return (
    <Switch>
      <Route exact path="/data-sync/records" component={SyncRecords} />

      <Route
        exact
        path="/data-sync/records/:recordId"
        component={SyncReports}
      />
    </Switch>
  );
};

export default SyncRecordIndex;
