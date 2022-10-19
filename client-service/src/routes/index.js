import async from '../components/Async';

import {
  Home as HomeIcon,
  Package as PackageIcon,
  TrendingUp as TrendingUpIcon,
  Tag as TagIcon,
  DollarSign as DollarSignIcon,
  Bell as BellIcon,
  Users as UsersIcon,
  Activity as ActivityIcon,
  ShoppingCart as ShoppingCartIcon,
  RefreshCw as RefreshCwIcon,
  DownloadCloud as DownloadCloudIcon,
  Book as BookIcon,
  Layers,
  Box as BoxIcon,
} from 'react-feather';

// Auth
import Login from '../features/auth/Login';
import Register from '../features/auth/Register';
import ForgotPassword from '../features/auth/ForgotPassword';
import Onboarding from 'features/onboarding/Onboarding';
import OnboardingAgency from 'features/onboarding/OnboardingAgency';
import ForgotPasswordSuccess from 'features/auth/ForgotPasswordSuccess';
import ResetPassword from 'features/auth/ResetPassword';
import ResetPasswordSuccess from 'features/auth/ResetPasswordSuccess';

// Dashboard
import Dashboard from 'features/dashboard/Dashboard';
import Orders from 'features/orders/Orders';
// import KeywordRankings from 'features/rankings/KeywordRankings';
import RankingDashboard from 'features/rankings/RankingDashboard';
import KeywordPage from 'features/rankings/Keyword/KeywordPage';
import Refunds from 'features/refunds/Refunds';
import PPC from 'features/ppc';
// import Inventory from 'features/inventory/Inventory';
import Product from 'features/product/Product';
// import Products from 'features/products/Products';
import Alerts from 'features/alerts/Alerts';
import Users from 'features/users/Users';
import InitialSync from 'features/initialSyncs/initialSync';
import SyncRecords from 'features/admin/syncRecords/SyncRecords';
import SyncRecordReports from 'features/admin/syncRecords/SyncRecordReports';
import Reviews from 'features/reviews/Reviews';
import Settings from 'features/settings/Settings';
import Profit from 'features/profit/Profit';
import AgencyClients from 'features/admin/agencyClients/AgencyClients';
import AgencyClientProfile from 'features/admin/agencyClients/AgencyClientProfile';
import AgencyClientForm from 'features/admin/agencyClients/AgencyClientForm';
import Forecast from 'features/inventory/forecast/Forecast';
import Estimate from 'features/inventory/estimate/Estimate';
import Invoices from 'features/admin/invoices/Invoices';
import InvoiceDetails from 'features/admin/invoices/InvoiceDetails';
import UpdateCardSuccess from 'features/admin/agencyClients/updateCardSuccess';
import CostManager from 'features/costManager/CostManager';
import Notification from 'features/notifications/index';

// Routes

const login = {
  name: 'Login',
  path: '/login',
  component: Login,
  exact: true,
  type: 'public',
  restricted: 'true',
  children: null,
};

const register = {
  name: 'Register',
  path: '/register',
  children: [
    {
      name: 'Register',
      path: '/register',
      component: Register,
      exact: true,
      type: 'public',
      restricted: 'true',
    },
    {
      name: 'Reset Password',
      path: '/register/:inviteId',
      component: Register,
      exact: true,
      type: 'public',
      restricted: 'true',
      children: null,
    },
  ],
};

const forgotPassword = {
  name: 'Forgot Password',
  path: '/forgot-password',
  children: [
    {
      name: 'Forgot Password',
      path: '/forgot-password',
      component: ForgotPassword,
      exact: true,
      type: 'public',
      restricted: 'true',
      children: null,
    },
    {
      name: 'Forgot Password',
      path: '/forgot-password/success',
      component: ForgotPasswordSuccess,
      exact: true,
      type: 'public',
      restricted: 'true',
      children: null,
    },
  ],
};

const resetPassword = {
  name: 'Reset Password',
  path: '/reset-password',
  children: [
    {
      name: 'Reset Password',
      path: '/reset-password/success',
      component: ResetPasswordSuccess,
      exact: true,
      type: 'public',
      restricted: 'true',
      children: null,
    },
    {
      name: 'Reset Password',
      path: '/reset-password/:token',
      component: ResetPassword,
      exact: true,
      type: 'public',
      restricted: 'true',
      children: null,
    },
  ],
};

const onboarding = {
  name: 'Onboarding',
  path: '/onboarding',
  children: [
    {
      name: 'Onboarding',
      path: '/onboarding',
      component: Onboarding,
      exact: true,
      type: 'private',
      children: null,
    },
    {
      name: 'Onboarding',
      path: '/onboarding/agency',
      component: OnboardingAgency,
      exact: true,
      type: 'private',
      children: null,
    },
  ],
};

const dashboard = {
  name: 'Dashboard',
  path: '/dashboard',
  icon: HomeIcon,
  component: Dashboard,
  children: null,
  roles: ['client', 'client-premium', 'super-admin'],
};

const profit = {
  name: 'Profit',
  path: '/profit',
  icon: DollarSignIcon,
  roles: ['client', 'client-premium'],
  children: [
    {
      name: 'Sales & Profit',
      path: '/profit/sales-profit',
      component: Profit,
      exact: true,
      type: 'private',
      children: null,
    },
    {
      name: 'Orders',
      path: '/profit/orders',
      component: Orders,
      exact: true,
      type: 'private',
      children: null,
    },
    {
      name: 'Refunds',
      path: '/profit/refunds',
      component: Refunds,
      exact: true,
      type: 'private',
      children: null,
    },
    {
      name: 'Cost Manager',
      path: '/profit/cost-manager',
      component: CostManager,
      exact: true,
      type: 'private',
      children: null,
    },
  ],
};

const order = {
  name: 'Order Manager',
  path: '/orders',
  icon: BoxIcon,
  roles: ['client', 'client-premium'],
  component: Orders,
  exact: true,
  type: 'private',
  children: null,
};

// const salesMetrics = {
//   name: 'Sales Metrics',
//   icon: DollarSignIcon,
//   path: '/sales-metrics',
//   roles: ['client', 'client-premium'],
//   children: null
// };

const alerts = {
  name: 'Smart Alerts',
  path: '/alerts',
  icon: BellIcon,
  component: Notification,
  children: null,
  roles: ['client', 'client-premium'],
};

// const products = {
//   name: 'Products',
//   path: '/products',
//   icon: ShoppingCartIcon,
//   component: Products,
//   exact: true,
//   children: null,
//   roles: ['client', 'client-premium'],
// };

const ppcDashboard = {
  name: 'PPC',
  path: '/ppc/:campaignType',
  icon: ActivityIcon,
  roles: ['client', 'client-premium'],
  component: PPC,
  children: [
    {
      name: 'Products',
      path: '/ppc/sp/campaigns',
      exact: true,
      type: 'private',
    },
    {
      name: 'Brands',
      path: '/ppc/sb/campaigns',
      exact: true,
      type: 'private',
      children: null,
    },
    {
      name: 'Display',
      path: '/ppc/sd/campaigns',
      exact: true,
      type: 'private',
      children: null,
    },
  ],
};

const rankings = {
  name: 'Rankings',
  path: '/rankings',
  icon: TrendingUpIcon,
  component: RankingDashboard,
  exact: true,
  children: null,
  roles: ['client', 'client-premium'],
};

const keyword = {
  name: 'KeywordPage',
  path: '/rankings/keyword/:keywordId',
  icon: TrendingUpIcon,
  component: KeywordPage,
  children: null,
  roles: ['client', 'client-premium'],
};
// const inventory = {
//   name: 'Inventory',
//   path: '/inventory',
//   icon: PackageIcon,
//   component: Inventory,
//   children: null,
//   roles: ['client', 'client-premium'],
// };

const inventory = {
  name: 'Inventory',
  path: '/inventory',
  icon: PackageIcon,
  roles: ['client', 'client-premium'],
  children: [
    {
      name: 'Forecast',
      path: '/inventory/forecast',
      component: Forecast,
      exact: true,
      type: 'private',
    },
    {
      name: 'Estimate',
      path: '/inventory/estimate',
      component: Estimate,
      exact: true,
      type: 'private',
    },
  ],
};

const reviews = {
  name: 'Reviews',
  path: '/reviews',
  icon: UsersIcon,
  component: Reviews,
  children: null,
  roles: ['client', 'client-premium'],
};

const product = {
  name: 'Product',
  path: '/products/:asin',
  icon: PackageIcon,
  component: Product,
  children: null,
  roles: ['client', 'client-premium'],
};

const users = {
  name: 'Users',
  path: '/users',
  icon: UsersIcon,
  component: Users,
  type: 'private',
  children: null,
  roles: ['super-admin'],
};

const initialSync = {
  name: 'Initial Sync',
  path: '/initial-sync',
  icon: DownloadCloudIcon,
  component: InitialSync,
  type: 'private',
  children: null,
  roles: ['super-admin'],
};

const syncRecords = {
  name: 'Sync Records',
  path: '/sync-records',
  icon: RefreshCwIcon,
  component: SyncRecords,
  type: 'private',
  children: null,
  exact: true,
  roles: ['super-admin'],
};

const syncRecordReports = {
  name: 'Products',
  path: '/sync-records/:syncRecordId',
  component: SyncRecordReports,
  icon: PackageIcon,
  children: null,
  exact: true,
  roles: ['super-admin'],
};

const agencyClients = {
  name: 'Clients',
  path: '/clients',
  icon: BookIcon,
  component: AgencyClients,
  type: 'private',
  children: null,
  exact: true,
  roles: ['super-admin'],
};

const agencyClientProfile = {
  name: 'Clients',
  path: '/clients/profile/:id',
  icon: BookIcon,
  component: AgencyClientProfile,
  type: 'private',
  children: null,
  exact: true,
  roles: ['super-admin'],
};

const agencyClientForm = {
  name: 'Clients',
  path: '/clients/:operation/:id?',
  icon: BookIcon,
  component: AgencyClientForm,
  type: 'private',
  children: null,
  exact: true,
  roles: ['super-admin'],
};

const invoices = {
  name: 'invoices',
  path: '/invoices',
  icon: Layers,
  component: Invoices,
  type: 'private',
  children: null,
  exact: true,
  roles: ['super-admin'],
};

const invoiceDetails = {
  name: 'invoices',
  path: '/invoices/:invoiceId',
  icon: Layers,
  component: InvoiceDetails,
  type: 'private',
  children: null,
  exact: true,
  roles: ['super-admin'],
};

const updateCardSuccess = {
  name: 'updateCardSuccess',
  path: '/update-card-success',
  component: UpdateCardSuccess,
  type: 'public',
  children: null,
  exact: true,
  restricted: 'true',
};

export const rootRoutes = [
  login,
  register,
  forgotPassword,
  resetPassword,
  onboarding,
  updateCardSuccess,
];

export const dashboardRoutes = [
  dashboard,
  profit,
  order,
  // salesMetrics,
  // products,
  alerts,
  ppcDashboard,
  rankings,
  inventory,
  reviews,
  users,
  initialSync,
  syncRecords,
  agencyClients,
  invoices,
];

export const settings = {
  name: 'Settings',
  path: '/settings',
  component: Settings,
  type: 'private',
  roles: ['client', 'client-premium'],
};

export const singlePageRoutes = [
  product,
  settings,
  syncRecordReports,
  keyword,
  agencyClientProfile,
  agencyClientForm,
  invoiceDetails,
];

// All routes
export default [...dashboardRoutes];
