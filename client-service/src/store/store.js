import { configureStore } from '@reduxjs/toolkit';
import authReducer from 'features/auth/authSlice';
import accountReducer from 'features/auth/accountSlice';
import alertReducer from 'features/alert/alertSlice';
import onboardingReducer from 'features/onboarding/onboardingSlice';
import themeReducer from 'features/theme/themeSlice';
import layoutReducer from 'components/layout/layoutSlice';
import ordersReducer from 'features/orders/ordersSlice';
import statesReducer from 'features/orders/statesSlice';
import productSlice from 'features/product/productSlice';
import productMetricSlice from 'features/product/productMetricSlice';
import shipmentSlice from 'features/product/shipmentSlice';
import productKeywordSlice from 'features/product/productKeywordSlice';
import dashboardReducer from 'features/dashboard/dashboardSlice';
import ppcReducer from 'features/ppc/ppcSlice';
import inventoryReducer from 'features/inventory/inventorySlice';
import refundsReducer from 'features/refunds/refundsSlice';
import productsReducer from 'features/products/productsSlice';
import alertsReducer from 'features/alerts/alertsSlice';
import reviewsReducer from 'features/reviews/reviewsSlice';
import usersReducer from 'features/users/usersSlice';
import initialSyncReducer from 'features/initialSyncs/initialSyncSlice';
import syncRecordsReducer from 'features/admin/syncRecords/syncRecordsSlice';
import keywordSlice from 'features/rankings/Keyword/keywordSlice';
import categorySlice from 'features/rankings/Category/categorySlice';
import profitReducer from 'features/profit/profitSlice';
import dateReducer from 'components/datePicker/dateSlice';
import agencyClientsReducer from 'features/admin/agencyClients/agencyClientsSlice';
import subscriptionsReducer from 'features/admin/agencyClients/subscriptionsSlice';
import invoicesReducer from 'features/admin/invoices/invoicesSlice';
import commissionsReducer from 'features/admin/agencyClients/commissionsSlice';

import notificationReducer from 'features/notifications/notificationSlice';
import costManagerSlice from 'features/costManager/costManagerSlice';

export default configureStore({
  reducer: {
    auth: authReducer,
    account: accountReducer,
    alert: alertReducer,
    onboarding: onboardingReducer,
    theme: themeReducer,
    layout: layoutReducer,
    orders: ordersReducer,
    states: statesReducer,
    product: productSlice,
    productMetric: productMetricSlice,
    shipments: shipmentSlice,
    dashboard: dashboardReducer,
    ppc: ppcReducer,
    inventory: inventoryReducer,
    refunds: refundsReducer,
    products: productsReducer,
    alerts: alertsReducer,
    reviews: reviewsReducer,
    users: usersReducer,
    initialSync: initialSyncReducer,
    syncRecords: syncRecordsReducer,
    keyword: keywordSlice,
    category: categorySlice,
    productKeyword: productKeywordSlice,
    profit: profitReducer,
    date: dateReducer,
    agencyClients: agencyClientsReducer,
    subscriptions: subscriptionsReducer,
    invoices: invoicesReducer,
    notification: notificationReducer,
    commissions: commissionsReducer,
    costManager: costManagerSlice,
  },
});
