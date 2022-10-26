import QueryString from 'qs';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import {
  HomeIcon,
  CashIcon,
  ChartBarIcon,
  CollectionIcon,
  ArchiveIcon,
  ThumbUpIcon,
  UserGroupIcon,
  CogIcon,
  TableIcon,
  DocumentAddIcon,
  ExclamationIcon,
  CursorClickIcon,
  ShoppingBagIcon,
  ShoppingCartIcon,
  CurrencyDollarIcon,
  PresentationChartLineIcon,
  HandIcon,
  KeyIcon,
  TagIcon,
  BriefcaseIcon,
  TrendingUpIcon,
  PhoneIncomingIcon,
  UserIcon,
} from '@heroicons/react/outline';

import Sidebar from 'layouts/agency/components/Sidebar';
import MobileMenu from 'layouts/agency/components/MobileMenu';
import usePermissions from 'hooks/usePermissions';

const Navigations = ({
  user,
  account,
  marketplace,
  mobileMenuOpen,
  setMobileMenuOpen,
}) => {
  const { t } = useTranslation();
  const { userCan, isAgencyLevel, isApplicationLevel, isAgencySuperUser } =
    usePermissions();
  const { paginationParams: cpp } = useSelector((state) => state.clients);
  const { paginationParams: ipp } = useSelector((state) => state.invoices);
  const { upsellsPaginationParams } = useSelector((state) => state.upsells);
  const { leadsPaginationParams } = useSelector((state) => state.leads);

  const items = [
    {
      name: t('Dashboard.Clients'),
      href: '/clients',
      icon: HomeIcon,
      visible: () => userCan('clients.view.all'),
      query: () => {
        return {
          page: cpp.page ?? 1,
          status: cpp.status ?? '',
          pageSize: cpp.pageSize ?? 30,
          sort: cpp.sort ?? 'client:asc',
          migrateOnly: cpp.migrateOnly ?? false,
        };
      },
      children: [
        {
          name: 'List',
          href: '/clients',
          icon: TableIcon,
          visible: () => userCan('clients.view.all'),
        },
        {
          name: 'Assignments',
          href: '/client-assignments',
          icon: TableIcon,
          visible: () => userCan('clients.assignment.list'),
        },
      ],
    },
    {
      name: 'Billing',
      href: '/invoices',
      icon: CollectionIcon,
      visible: () => {
        return (
          isAgencyLevel() &&
          (userCan('invoices.view') ||
            userCan('creditNotes.list') ||
            userCan('upsells.list'))
        );
      },
      children: [
        {
          name: t('Dashboard.Invoices'),
          href: '/invoices',
          icon: CashIcon,
          visible: () => {
            return isAgencyLevel() && userCan('invoices.view');
          },
          query: () => {
            return {
              page: 1,
              status: 'Pending',
              sizePerPage: ipp.sizePerPage ?? 25,
            };
          },
        },
        {
          name: 'Credit Notes',
          href: '/credit-notes/pending',
          icon: DocumentAddIcon,
          visible: () => {
            return isAgencyLevel() && userCan('creditNotes.list');
          },
        },
        {
          name: 'Upsells',
          href: '/upsells',
          icon: TrendingUpIcon,
          visible: () => userCan('upsells.list'),
          query: () => {
            return {
              page: upsellsPaginationParams.page ?? 1,
              status: upsellsPaginationParams.status ?? 'pending',
              pageSize: upsellsPaginationParams.pageSize ?? 30,
              sort: upsellsPaginationParams.sort ?? 'createdAt:asc',
              client: '',
            };
          },
        },
      ],
    },
    {
      name: t('Dashboard.Profit'),
      href: '/accounts/:accountId/profit',
      icon: CurrencyDollarIcon,
      visible: () => userCan('profits.view'),
      requiresAccount: true,
      requiresMarketplace: true,
    },
    {
      name: t('Dashboard.Products'),
      href: '/accounts/:accountId/products',
      icon: ShoppingBagIcon,
      requiresAccount: true,
      requiresMarketplace: true,
      visible: () => userCan('products.view'),
    },
    {
      name: t('Dashboard.Orders'),
      href: '/accounts/:accountId/orders',
      icon: ShoppingCartIcon,
      requiresAccount: true,
      requiresMarketplace: true,
      visible: () => userCan('orders.view'),
    },
    {
      name: t('Dashboard.Reviews'),
      href: '/accounts/:accountId/reviews',
      icon: ThumbUpIcon,
      requiresAccount: true,
      requiresMarketplace: true,
      visible: () => userCan('reviews.view'),
    },
    {
      name: t('Dashboard.Advertising'),
      href: '/accounts/:accountId/advertising',
      icon: CursorClickIcon,
      visible: () => {
        return userCan('ppc.view') || userCan('ppc.changeRequest.list');
      },
      children: [
        {
          name: 'Manager',
          href: '/accounts/:accountId/advertising',
          icon: CursorClickIcon,
          requiresAccount: true,
          requiresMarketplace: true,
          visible: () => userCan('ppc.view'),
        },
        {
          name: userCan('ppc.changeRequest.evaluate')
            ? 'Opt. Approvals'
            : 'Opt. Requests',
          href: '/change-requests',
          icon: HandIcon,
          visible: () => userCan('ppc.changeRequest.list'),
        },
      ],
    },
    {
      name: 'Alerts',
      href: '/accounts/:accountId/alerts/configurations',
      icon: ExclamationIcon,
      requiresAccount: true,
      requiresMarketplace: true,
      visible: () => userCan('alerts.view'),
    },
    {
      name: 'Leads',
      href: '/leads',
      icon: PhoneIncomingIcon,
      visible: () => userCan('leads.list'),
      query: () => {
        return {
          page: leadsPaginationParams.page ?? 1,
          status: leadsPaginationParams.status ?? 'Unprocessed New Leads',
          pageSize: leadsPaginationParams.pageSize ?? 30,
          sort: leadsPaginationParams.sort ?? 'createdAt:asc',
        };
      },
      children: [
        {
          name: 'My Workplace',
          href: '/leads',
          icon: BriefcaseIcon,
          visible: () => userCan('leads.list'),
        },
        {
          name: 'Records',
          href: '/leads-data',
          icon: TableIcon,
          visible: () => userCan('leads.list'),
        },
        {
          name: 'Metrics',
          href: '/leads-metrics',
          icon: ChartBarIcon,
          visible: () => userCan('leads.metrics'),
        },
        {
          name: 'Profile',
          href: '/leads-dashboard',
          icon: UserIcon,
          visible: () => userCan('leads.profile'),
        },
        {
          name: 'Settings',
          href: '/leads-settings',
          icon: CogIcon,
          visible: () => userCan('leads.list'),
        },
        {
          name: 'Archived',
          href: '/leads-archived',
          icon: ArchiveIcon,
          visible: () => userCan('leads.list'),
        },
      ],
    },
    {
      name: 'Admin',
      href: '/employees',
      icon: BriefcaseIcon,
      visible: () => {
        return (
          isAgencyLevel() &&
          (userCan('employees.list') ||
            isAgencySuperUser() ||
            userCan('churn.view') ||
            userCan('reports.view'))
        );
      },
      children: [
        {
          name: t('Dashboard.Employees'),
          href: '/employees',
          icon: UserGroupIcon,
          visible: () => userCan('employees.list'),
        },
        {
          name: 'Permissions',
          href: '/permissions/agency',
          icon: KeyIcon,
          visible: () => isAgencyLevel() && isAgencySuperUser(),
        },
        {
          name: 'Roles',
          href: '/roles',
          icon: TagIcon,
          visible: () => isAgencyLevel() && isAgencySuperUser(),
        },
        {
          name: 'Churn',
          href: '/churn',
          icon: PresentationChartLineIcon,
          visible: () => {
            return isAgencyLevel() && userCan('churn.view');
          },
        },
        {
          name: 'Reports',
          href: '/reports',
          icon: ChartBarIcon,
          visible: () => isAgencyLevel() && userCan('reports.view'),
        },
      ],
    },
    {
      name: 'Plan',
      href: '/plan',
      icon: CurrencyDollarIcon,
      visible: () => isApplicationLevel(),
      query: () => {
        let q = {};
        if (account) {
          q.account = account.accountId;
        }

        if (marketplace) {
          q.marketplace = marketplace.details.countryCode;
        }

        return q;
      },
    },
  ]
    .filter(
      (item) =>
        item.visible() &&
        (item.requiresAccount ? !!account : true) &&
        (item.requiresMarketplace ? !!marketplace : true)
    )
    .map((item) => {
      if (account) {
        item.href = item.href.replace(':accountId', account.accountId);
      }

      let itemQuery = item.query ? item.query() : {};

      if (item.requiresMarketplace && marketplace) {
        itemQuery.marketplace = marketplace.details.countryCode;
      }

      item.href = `${item.href}?${QueryString.stringify(itemQuery)}`;

      if (item.children && item.children.length > 0) {
        let children = item.children
          .filter(
            (child) =>
              child.visible() &&
              (child.requiresAccount ? !!account : true) &&
              (child.requiresMarketplace ? !!marketplace : true)
          )
          .map((child) => {
            if (account) {
              child.href = child.href.replace(':accountId', account.accountId);
            }

            let itemQuery = child.query ? child.query() : {};

            if (child.requiresMarketplace && marketplace) {
              itemQuery.marketplace = marketplace.details.countryCode;
            }

            child.href = `${child.href}?${QueryString.stringify(itemQuery)}`;
            return child;
          });

        item.children = children;
      }

      return item;
    });

  return (
    <>
      {/* Sidebar */}
      <Sidebar sidebarNavigation={items} />

      {/* Mobile Menu */}
      <MobileMenu
        sidebarNavigation={items}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />
    </>
  );
};

export default Navigations;
