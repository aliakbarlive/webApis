const useInvoice = (invoice) => {
  const isEditable = () => {
    return invoice.can_edit_items;
    // switch (invoice.status) {
    //   case 'paid':
    //   case 'void':
    //     return false;
    //   default:
    //     return true;
    // }
  };

  const needReasonForUpdate = () => {
    switch (invoice.status) {
      case 'sent':
      case 'overdue':
      case 'partially_paid':
        return true;
      default:
        return false;
    }
  };

  const pending = () => {
    return invoice.status === 'pending';
  };

  const sent = () => {
    return invoice.status === 'sent';
  };

  const overdue = () => {
    return invoice.status === 'overdue';
  };

  const partiallyPaid = () => {
    return invoice.status === 'partially_paid';
  };

  const paid = () => {
    return invoice.status === 'paid';
  };

  const unpaid = () => {
    return invoice.status !== 'paid';
  };

  const voided = () => {
    return invoice.status === 'void';
  };

  const open = () => {
    return invoice.status !== 'void';
  };

  const writtenOff = () => {
    return invoice.write_off_amount > 0;
  };

  const notWrittenOff = () => {
    return invoice.write_off_amount === 0;
  };

  return {
    isEditable,
    needReasonForUpdate,
    pending,
    sent,
    overdue,
    paid,
    partiallyPaid,
    unpaid,
    voided,
    open,
    writtenOff,
    notWrittenOff,
  };
};

export default useInvoice;
