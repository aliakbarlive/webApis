// import async from '../components/Async';

// import {
//   Bell as Bellicon,
//   BookOpen as BookOpenIcon,
//   Calendar as CalendarIcon,
//   CheckSquare as CheckSquareIcon,
//   Grid as GridIcon,
//   Heart as HeartIcon,
//   Layout as LayoutIcon,
//   List as ListIcon,
//   MapPin as MapPinIcon,
//   Monitor as MonitorIcon,
//   PieChart as PieChartIcon,
//   Sliders as SlidersIcon,
//   Users as UsersIcon,
// } from 'react-feather';

// // Landing
// import Landing from '../features/landing/Landing';

// // Auth
// import SignIn from '../features/auth/Login';
// import SignUp from '../features/auth/Register';
// import ResetPassword from '../features/auth/ForgotPassword';
// import Page404 from '../features/auth/Page404';
// import Page500 from '../features/auth/Page500';

// // Layouts
// import Boxed from '../features/layouts/Boxed';
// import SidebarCollapsed from '../features/layouts/SidebarCollapsed';
// import SidebarSticky from '../features/layouts/SidebarSticky';
// import ThemeClassic from '../features/layouts/ThemeClassic';
// import ThemeCorporate from '../features/layouts/ThemeCorporate';
// import ThemeModern from '../features/layouts/ThemeModern';

// // Misc
// import Blank from '../features/misc/Blank';

// // UI Elements
// import Alerts from '../features/ui-elements/Alerts';
// import Buttons from '../features/ui-elements/Buttons';
// import Cards from '../features/ui-elements/Cards';
// import Carousel from '../features/ui-elements/Carousel';
// import EmbedVideo from '../features/ui-elements/EmbedVideo';
// import General from '../features/ui-elements/General';
// import Grid from '../features/ui-elements/Grid';
// import Modals from '../features/ui-elements/Modals';
// import Tabs from '../features/ui-elements/Tabs';
// import Typography from '../features/ui-elements/Typography';

// // Notifications
// import Notifications from '../features/notifications/Notifications';

// // Pages
// import Profile from '../features/pages/Profile';
// import Settings from '../features/pages/Settings';
// import Clients from '../features/pages/Clients';
// import Projects from '../features/pages/Projects';
// import Invoice from '../features/pages/Invoice';
// import Pricing from '../features/pages/Pricing';
// import Tasks from '../features/pages/Tasks';
// import Chat from '../features/pages/Chat';

// // Documentation
// import Introduction from '../features/docs/Introduction';
// import GettingStarted from '../features/docs/GettingStarted';
// import EnvironmentVariables from '../features/docs/EnvironmentVariables';
// import Deployment from '../features/docs/Deployment';
// import StateManagement from '../features/docs/StateManagement';
// import Plugins from '../features/docs/Plugins';
// import Changelog from '../features/docs/Changelog';

// // Dashboards
// const Default = async(() => import('../features/dashboards/Default'));
// const Analytics = async(() => import('../features/dashboards/Analytics'));
// const Ecommerce = async(() => import('../features/dashboards/Ecommerce'));
// const Crypto = async(() => import('../features/dashboards/Crypto'));
// const Social = async(() => import('../features/dashboards/Social'));

// // Forms
// const Layouts = async(() => import('../features/forms/Layouts'));
// const BasicInputs = async(() => import('../features/forms/BasicInputs'));
// const AdvancedInputs = async(() => import('../features/forms/AdvancedInputs'));
// const InputGroups = async(() => import('../features/forms/InputGroups'));
// const Editors = async(() => import('../features/forms/Editors'));
// const Validation = async(() => import('../features/forms/Validation'));
// const Wizard = async(() => import('../features/forms/Wizard'));

// // Tables
// const BootstrapTables = async(() => import('../features/tables/Bootstrap'));
// const PaginationTables = async(() => import('../features/tables/Pagination'));
// const RowSelectionTables = async(() =>
//   import('../features/tables/RowSelection')
// );
// const ExportCsvTables = async(() => import('../features/tables/ExportCsv'));
// const ExpandableRowsTables = async(() =>
//   import('../features/tables/ExpandableRows')
// );

// // Charts
// const Chartjs = async(() => import('../features/charts/Chartjs'));
// const ApexCharts = async(() => import('../features/charts/ApexCharts'));

// // Icons
// const FontAwesome = async(() => import('../features/icons/FontAwesome'));
// const Feather = async(() => import('../features/icons/Feather'));

// // Calendar
// const Calendar = async(() => import('../features/calendar/Calendar'));

// // Maps
// const VectorMaps = async(() => import('../features/maps/VectorMaps'));
// const GoogleMaps = async(() => import('../features/maps/GoogleMaps'));

// // Routes

// const landingRoutes = {
//   path: '/',
//   name: 'Landing Page',
//   component: Landing,
//   children: null,
// };

// const dashboardRoutes = {
//   path: '/dashboard',
//   name: 'Dashboards',
//   header: 'Pages',
//   badgeColor: 'primary',
//   badgeText: '5',
//   icon: SlidersIcon,
//   containsHome: true,
//   children: [
//     {
//       path: '/dashboard/default',
//       name: 'Default',
//       component: Default,
//     },
//     {
//       path: '/dashboard/analytics',
//       name: 'Analytics',
//       component: Analytics,
//     },
//     {
//       path: '/dashboard/e-commerce',
//       name: 'E-commerce',
//       component: Ecommerce,
//     },
//     {
//       path: '/dashboard/social',
//       name: 'Social',
//       component: Social,
//     },
//     {
//       path: '/dashboard/crypto',
//       name: 'Crypto',
//       component: Crypto,
//       badgeColor: 'primary',
//       badgeText: 'New',
//     },
//   ],
// };

// const pageRoutes = {
//   path: '/pages',
//   name: 'Pages',
//   icon: LayoutIcon,
//   children: [
//     {
//       path: '/pages/profile',
//       name: 'Profile',
//       component: Profile,
//     },
//     {
//       path: '/pages/settings',
//       name: 'Settings',
//       component: Settings,
//     },
//     {
//       path: '/pages/clients',
//       name: 'Clients',
//       component: Clients,
//     },
//     {
//       path: '/pages/projects',
//       name: 'Projects',
//       component: Projects,
//     },
//     {
//       path: '/pages/invoice',
//       name: 'Invoice',
//       component: Invoice,
//     },
//     {
//       path: '/pages/pricing',
//       name: 'Pricing',
//       component: Pricing,
//     },
//     {
//       path: '/pages/tasks',
//       name: 'Tasks',
//       component: Tasks,
//     },
//     {
//       path: '/pages/chat',
//       name: 'Chat',
//       component: Chat,
//       badgeColor: 'primary',
//       badgeText: 'New',
//     },
//     {
//       path: '/pages/blank',
//       name: 'Blank Page',
//       component: Blank,
//     },
//   ],
// };

// const authRoutes = {
//   path: '/auth',
//   name: 'Auth',
//   icon: UsersIcon,
//   badgeColor: 'secondary',
//   badgeText: 'Special',
//   children: [
//     {
//       path: '/auth/sign-in',
//       name: 'Sign In',
//       component: SignIn,
//     },
//     {
//       path: '/auth/sign-up',
//       name: 'Sign Up',
//       component: SignUp,
//     },
//     {
//       path: '/auth/reset-password',
//       name: 'Reset Password',
//       component: ResetPassword,
//     },
//     {
//       path: '/auth/404',
//       name: '404 Page',
//       component: Page404,
//     },
//     {
//       path: '/auth/500',
//       name: '500 Page',
//       component: Page500,
//     },
//   ],
// };

// const layoutRoutes = {
//   path: '/layouts',
//   name: 'Layouts',
//   icon: MonitorIcon,
//   children: [
//     {
//       path: '/layouts/sidebar-sticky',
//       name: 'Sticky Sidebar',
//       component: SidebarSticky,
//     },
//     {
//       path: '/layouts/sidebar-collapsed',
//       name: 'Sidebar Collapsed',
//       component: SidebarCollapsed,
//     },
//     {
//       path: '/layouts/boxed',
//       name: 'Boxed Layout',
//       component: Boxed,
//     },
//     {
//       path: '/layouts/theme-classic',
//       name: 'Classic Theme',
//       component: ThemeClassic,
//     },
//     {
//       path: '/layouts/theme-corporate',
//       name: 'Corporate Theme',
//       component: ThemeCorporate,
//       badgeColor: 'primary',
//       badgeText: 'New',
//     },
//     {
//       path: '/layouts/theme-modern',
//       name: 'Modern Theme',
//       component: ThemeModern,
//       badgeColor: 'primary',
//       badgeText: 'New',
//     },
//   ],
// };

// const documentationRoutes = {
//   path: '/docs',
//   name: 'Documentation',
//   icon: BookOpenIcon,
//   children: [
//     {
//       path: '/docs/introduction',
//       name: 'Introduction',
//       component: Introduction,
//     },
//     {
//       path: '/docs/getting-started',
//       name: 'Getting Started',
//       component: GettingStarted,
//     },
//     {
//       path: '/docs/environment-variables',
//       name: 'Environment Variables',
//       component: EnvironmentVariables,
//     },
//     {
//       path: '/docs/deployment',
//       name: 'Deployment',
//       component: Deployment,
//     },
//     {
//       path: '/docs/state-management',
//       name: 'State Management',
//       component: StateManagement,
//     },
//     {
//       path: '/docs/plugins',
//       name: 'Plugins',
//       component: Plugins,
//     },
//     {
//       path: '/docs/changelog',
//       name: 'Changelog',
//       component: Changelog,
//     },
//   ],
// };

// const uiRoutes = {
//   path: '/ui',
//   name: 'UI Elements',
//   header: 'Tools & Components',
//   icon: GridIcon,
//   children: [
//     {
//       path: '/ui/alerts',
//       name: 'Alerts',
//       component: Alerts,
//     },
//     {
//       path: '/ui/buttons',
//       name: 'Buttons',
//       component: Buttons,
//     },
//     {
//       path: '/ui/cards',
//       name: 'Cards',
//       component: Cards,
//     },
//     {
//       path: '/ui/carousel',
//       name: 'Carousel',
//       component: Carousel,
//     },
//     {
//       path: '/ui/embed-video',
//       name: 'Embed Video',
//       component: EmbedVideo,
//     },
//     {
//       path: '/ui/general',
//       name: 'General',
//       component: General,
//       badgeColor: 'info',
//       badgeText: '10+',
//     },
//     {
//       path: '/ui/grid',
//       name: 'Grid',
//       component: Grid,
//     },
//     {
//       path: '/ui/modals',
//       name: 'Modals',
//       component: Modals,
//     },
//     {
//       path: '/ui/tabs',
//       name: 'Tabs',
//       component: Tabs,
//     },
//     {
//       path: '/ui/typography',
//       name: 'Typography',
//       component: Typography,
//     },
//   ],
// };

// const iconRoutes = {
//   path: '/icons',
//   name: 'Icons',
//   icon: HeartIcon,
//   badgeColor: 'info',
//   badgeText: '1500+',
//   children: [
//     {
//       path: '/icons/feather',
//       name: 'Feather',
//       component: Feather,
//     },
//     {
//       path: '/icons/font-awesome',
//       name: 'Font Awesome',
//       component: FontAwesome,
//     },
//   ],
// };

// const formRoutes = {
//   path: '/forms',
//   name: 'Forms',
//   icon: CheckSquareIcon,
//   children: [
//     {
//       path: '/forms/layouts',
//       name: 'Layouts',
//       component: Layouts,
//     },
//     {
//       path: '/forms/basic-inputs',
//       name: 'Basic Inputs',
//       component: BasicInputs,
//     },
//     {
//       path: '/forms/input-groups',
//       name: 'Input Groups',
//       component: InputGroups,
//     },
//   ],
// };

// const tableRoutes = {
//   path: '/tables',
//   name: 'Tables',
//   icon: ListIcon,
//   component: BootstrapTables,
//   children: null,
// };

// const formPluginsRoutes = {
//   path: '/form-plugins',
//   name: 'Form Plugins',
//   icon: CheckSquareIcon,
//   header: 'Plugin & Addons',
//   children: [
//     {
//       path: '/form-plugins/advanced-inputs',
//       name: 'Advanced Inputs',
//       component: AdvancedInputs,
//     },
//     {
//       path: '/form-plugins/editors',
//       name: 'Editors',
//       component: Editors,
//     },
//     {
//       path: '/form-plugins/validation',
//       name: 'Validation',
//       component: Validation,
//     },
//     {
//       path: '/form-plugins/wizard',
//       name: 'Wizard',
//       component: Wizard,
//     },
//   ],
// };

// const advancedTablesRoutes = {
//   path: '/advanced-tables',
//   name: 'Advanced Tables',
//   icon: ListIcon,
//   children: [
//     {
//       path: '/advanced-tables/pagination',
//       name: 'Pagination',
//       component: PaginationTables,
//     },
//     {
//       path: '/advanced-tables/row-selection',
//       name: 'Row Selection',
//       component: RowSelectionTables,
//     },
//     {
//       path: '/advanced-tables/expandable-rows',
//       name: 'Expandable Rows',
//       component: ExpandableRowsTables,
//     },
//     {
//       path: '/advanced-tables/export-csv',
//       name: 'Export CSV',
//       component: ExportCsvTables,
//     },
//   ],
// };

// const chartRoutes = {
//   path: '/charts',
//   name: 'Charts',
//   icon: PieChartIcon,
//   badgeColor: 'primary',
//   badgeText: 'New',
//   children: [
//     {
//       path: '/charts/chartjs',
//       name: 'Chart.js',
//       component: Chartjs,
//     },
//     {
//       path: '/charts/apexcharts',
//       name: 'ApexCharts',
//       component: ApexCharts,
//       badgeColor: 'primary',
//       badgeText: 'New',
//     },
//   ],
// };

// const notificationsRoutes = {
//   path: '/notifications',
//   name: 'Notifications',
//   icon: Bellicon,
//   component: Notifications,
//   children: null,
// };

// const mapRoutes = {
//   path: '/maps',
//   name: 'Maps',
//   icon: MapPinIcon,
//   children: [
//     {
//       path: '/maps/google-maps',
//       name: 'Google Maps',
//       component: GoogleMaps,
//     },
//     {
//       path: '/maps/vector-maps',
//       name: 'Vector Maps',
//       component: VectorMaps,
//     },
//   ],
// };

// const calendarRoutes = {
//   path: '/calendar',
//   name: 'Calendar',
//   icon: CalendarIcon,
//   component: Calendar,
//   children: null,
// };

// // This route is not visisble in the sidebar
// const privateRoutes = {
//   path: '/private',
//   name: 'Private',
//   children: [
//     {
//       path: '/private/blank',
//       name: 'Blank Page',
//       component: Blank,
//     },
//   ],
// };

// // Dashboard specific routes
// export const dashboard = [
//   dashboardRoutes,
//   pageRoutes,
//   layoutRoutes,
//   documentationRoutes,
//   uiRoutes,
//   iconRoutes,
//   formRoutes,
//   tableRoutes,
//   formPluginsRoutes,
//   advancedTablesRoutes,
//   chartRoutes,
//   notificationsRoutes,
//   mapRoutes,
//   calendarRoutes,
//   privateRoutes,
// ];

// // Landing specific routes
// export const landing = [landingRoutes];

// // Auth specific routes
// export const page = [authRoutes];

// // All routes
// export default [
//   dashboardRoutes,
//   pageRoutes,
//   authRoutes,
//   layoutRoutes,
//   documentationRoutes,
//   uiRoutes,
//   iconRoutes,
//   formRoutes,
//   tableRoutes,
//   formPluginsRoutes,
//   advancedTablesRoutes,
//   chartRoutes,
//   notificationsRoutes,
//   mapRoutes,
//   calendarRoutes,
// ];
