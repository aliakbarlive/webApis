import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import ordersReducer from '../features/orders/ordersSlice';
import reviewsReducer from '../features/reviews/reviewsSlice';
import accountsReducer from 'features/accounts/accountsSlice';
import inventoryReducer from 'features/products/inventory/inventorySlice';
import appNotificationReducer from 'features/appNotifications/appNotificationSlice';
import onboardingReducer from 'features/onboarding/onboardingSlice';
import keywordReducer from 'features/products/keywords/keywordSlice';
import advertisingReducer from 'features/advertising/advertisingSlice';
import datePickerReducer from 'features/datePicker/datePickerSlice';
import productsReducer from 'features/products/productsSlice';
import costReducer from 'features/profit/CostManager/costManagerSlice';
import alertsReducer from 'features/alerts/alertsSlice';
import profitReducer from 'features/profit/profitSlice';
import snapshotReducer from 'features/profit/Snapshots/snapshotSlice';
import notesReducer from 'features/notes/notesSlice';

export default configureStore({
  reducer: {
    auth: authReducer,
    alerts: alertsReducer,
    orders: ordersReducer,
    reviews: reviewsReducer,
    accounts: accountsReducer,
    inventory: inventoryReducer,
    appNotifications: appNotificationReducer,
    onboarding: onboardingReducer,
    keyword: keywordReducer,
    advertising: advertisingReducer,
    datePicker: datePickerReducer,
    products: productsReducer,
    costs: costReducer,
    profit: profitReducer,
    snapshot: snapshotReducer,
    notes: notesReducer,
  },
});
