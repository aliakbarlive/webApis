import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import alertsReducer from '../features/alerts/alertsSlice';
import clientsReducer from '../features/clients/clientsSlice';
import clientChecklistsReducer from '../features/clients/clientChecklistsSlice';
import employeesReducer from '../features/employees/employeesSlice';
import invoicesReducer from '../features/invoices/invoicesSlice';
import subscriptionsReducer from '../features/clients/subscriptionsSlice';
import commissionsReducer from '../features/clients/commissionsSlice';
import accountsReducer from '../features/accounts/accountsSlice';
import advertisingReducer from 'features/advertising/advertisingSlice';
import datePickerReducer from '../features/datePicker/datePickerSlice';
import keywordReducer from '../features/products/keywords/keywordSlice';
import productsReducer from 'features/products/productsSlice';
import inventoryReducer from 'features/products/inventory/inventorySlice';
import profitReducer from 'features/profit/profitSlice';
import snapshotReducer from 'features/profit/snapshotSlice';
import ordersReducer from 'features/orders/ordersSlice';
import costReducer from 'features/profit/costManagerSlice';
import profitProductReducer from 'features/profit/productSlice';
import notesReducer from 'features/notes/notesSlice';
import reviewsReducer from '../features/reviews/reviewsSlice';
import productAlertReducer from 'features/productAlerts/productAlertSlice';
import onboardingReducer from 'features/onboarding/onboardingSlice';
import creditNotesReducer from 'features/creditNotes/creditNotesSlice';
import changeRequestsReducer from 'features/changeRequests/changeRequestsSlice';
import permissionsReducer from 'features/permissions/permissionsSlice';
import advertisingOptimizationReducer from 'features/advertising/optimizations/optimizationSlice';
import advertisingCampaignReducer from 'features/advertising/campaigns/campaignSlice';
import advertisingAdGroupReducer from 'features/advertising/adGroups/adGroupSlice';
import churnReducer from 'features/churn/churnSlice';
import upsellsReducer from 'features/upsells/upsellsSlice';
import upsellItemsReducer from 'features/upsells/upsellItemsSlice';
import leadsReducer from 'features/leads/leadsSlice';
import notificationsReducer from '../layouts/components/NotificationSlice';

export default configureStore({
  reducer: {
    auth: authReducer,
    alerts: alertsReducer,
    clients: clientsReducer,
    clientChecklists: clientChecklistsReducer,
    employees: employeesReducer,
    invoices: invoicesReducer,
    subscriptions: subscriptionsReducer,
    commissions: commissionsReducer,
    accounts: accountsReducer,
    datePicker: datePickerReducer,
    advertising: advertisingReducer,
    keyword: keywordReducer,
    products: productsReducer,
    inventory: inventoryReducer,
    orders: ordersReducer,
    profit: profitReducer,
    snapshot: snapshotReducer,
    costs: costReducer,
    profitProduct: profitProductReducer,
    notes: notesReducer,
    reviews: reviewsReducer,
    productAlerts: productAlertReducer,
    onboarding: onboardingReducer,
    creditNotes: creditNotesReducer,
    changeRequests: changeRequestsReducer,
    permissions: permissionsReducer,
    advertisingCampaign: advertisingCampaignReducer,
    advertisingAdGroup: advertisingAdGroupReducer,
    advertisingOptimization: advertisingOptimizationReducer,
    churn: churnReducer,
    upsells: upsellsReducer,
    leads: leadsReducer,
    upsellItems: upsellItemsReducer,
    notifications: notificationsReducer,
  },
});
