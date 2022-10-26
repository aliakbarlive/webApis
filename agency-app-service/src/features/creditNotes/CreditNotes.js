import { Route } from 'react-router';
import { useTranslation } from 'react-i18next';
import DashboardLayout from 'layouts/dashboard/DashboardLayout';
import Pages from './Pages';

const CreditNotes = () => {
  const { t } = useTranslation();

  const tabs = [
    {
      name: t('All'),
      href: `/credit-notes`,
      exact: true,
    },
    {
      name: t('Pending'),
      href: `/credit-notes/pending`,
      exact: true,
    },
    {
      name: t('Queued'),
      href: `/credit-notes/queued`,
      exact: true,
    },
    {
      name: t('Approved'),
      href: `/credit-notes/approved`,
      exact: true,
    },
    {
      name: t('Denied'),
      href: `/credit-notes/denied`,
      exact: true,
    },
    {
      name: t('Cancelled'),
      href: `/credit-notes/cancelled`,
      exact: true,
    },
    {
      name: t('ManuallyApproved'),
      href: `/credit-notes/manually-approved`,
      exact: true,
    },
  ];

  return (
    <DashboardLayout>
      <Route
        path="/credit-notes/:status?"
        component={() => Pages({ tabs })}
        exact
      />
    </DashboardLayout>
  );
};

export default CreditNotes;
