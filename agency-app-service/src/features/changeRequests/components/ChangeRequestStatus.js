const ChangeRequestStatus = ({ status, count }) => {
  let color = 'green';
  switch (status) {
    case 'pending':
      color = 'yellow';
      break;
    case 'rejected':
      color = 'red';
      break;
    default:
      color = 'green';
      break;
  }

  return (
    <span
      className={`inline-flex mr-1 items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${color}-100 text-${color}-800`}
    >
      <span className="mr-1">{count}</span>
      {status}
    </span>
  );
};
export default ChangeRequestStatus;
