import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import moment from 'moment';
import { PlusIcon, TrashIcon } from '@heroicons/react/outline';
import classnames from 'classnames';

import PageHeader from 'components/PageHeader';
import Select from 'components/Forms/Select';
import Button from 'components/Button';
import SelectEmployee from 'components/SelectEmployee';
import {
  agoUTC,
  currencyFormatter,
  dateFormatterUTC,
  nameFormatter,
} from 'utils/formatters';
import Input from 'components/Forms/Input';
import { setAlert } from 'features/alerts/alertsSlice';
import usePermissions from 'hooks/usePermissions';
import Badge from 'components/Badge';

const OrderDetails = ({ tabs, client }) => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { userCan, isMine, isAgencySuperUser } = usePermissions();
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState(null);
  const [eta, setEta] = useState(null);
  const [upsell, setUpsell] = useState(null);
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState('');
  const [status, setStatus] = useState('pending'); //pending, in-progress, completed
  const [assignedTo, setAssignedTo] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const { user } = useSelector((state) => state.auth);

  const statuses = [
    { key: 'pending', value: 'Pending' },
    { key: 'in-progress', value: 'In Progress' },
    { key: 'completed', value: 'Completed' },
  ];

  const getUpsellOrderDetails = async () => {
    setLoading(true);
    await axios.get(`/agency/upsells/order/${id}`).then(async (res) => {
      setOrder(res.data.output);
      const { upsellId } = res.data.output;

      const { status, assignedTo, eta, upsell, assignedToUser } =
        res.data.output;
      setStatus(status);
      setAssignedTo(
        assignedToUser && {
          value: assignedToUser.userId,
          label: nameFormatter(assignedToUser),
        }
      );
      setEta(eta);
      setUpsell(upsell);
      await axios.get(`/agency/upsells/${upsellId}`).then(async (res1) => {
        setUpsell(res1.data.output);
        await axios.get(`/agency/upsells/order/${id}/comments`).then((res2) => {
          setComments(res2.data.output);
        });
      });
    });
    setLoading(false);
  };

  useEffect(() => {
    async function getData() {
      await getUpsellOrderDetails();
    }

    if (!loading) {
      getData();
    }
  }, [id, refresh]);

  const onChangeEta = (eta) => {
    setEta(eta);
  };

  const onChangeStatus = (status) => {
    setStatus(status);
  };

  const onChangeEmployee = (e) => {
    setAssignedTo(e);
  };

  const onAddComment = (e) => {
    e.preventDefault();
    if (comment.trim().length > 0) {
      axios
        .post(`/agency/upsells/order/comment`, { comment, upsellOrderId: id })
        .then((res) => {
          dispatch(setAlert('success', 'Upsell comment added!'));
          let newComment = {
            ...res.data.output,
            commentedByUser: user,
          };
          setComments([newComment, ...comments]);
          setComment('');
        });
    } else {
      dispatch(setAlert('error', 'Provide a comment!'));
    }
  };

  const onDelete = (id) => {
    axios.delete(`/agency/upsells/order/comment/${id}`).then((res) => {
      if (res.data.success) {
        let newComments = JSON.parse(JSON.stringify(comments)).filter(
          (el) => el.upsellCommentId !== id
        );
        setComments(newComments);
        dispatch(setAlert('success', 'Upsell comment deleted!'));
      } else {
        const errorMessages = Object.keys(res.data.errors)
          .map((key) => {
            return `- ${res.data.errors[key]}`;
          })
          .join('\n');
        dispatch(setAlert('error', res.data.errors.message, errorMessages));
      }
    });
  };

  const onSaveChanges = () => {
    const { upsellId, startedAt, completedAt } = order;
    const body = {
      upsellId,
      status,
      assignedTo: assignedTo.value,
      eta,
      startedAt: startedAt
        ? startedAt
        : status === 'in-progress' || status === 'completed'
        ? moment().format('YYYY-MM-DD')
        : null,
      completedAt: completedAt
        ? completedAt
        : status === 'completed'
        ? moment().format('YYYY-MM-DD')
        : null,
    };
    axios.put(`/agency/upsells/order/${id}`, body).then(({ data }) => {
      if (data.success) {
        dispatch(setAlert('success', 'Upsell Order updated')).then(() => {
          setRefresh(!refresh);
        });
      } else {
        const errorMessages = Object.keys(data.errors)
          .map((key) => {
            return `- ${data.errors[key]}`;
          })
          .join('\n');
        dispatch(setAlert('error', data.errors.message, errorMessages));
      }
    });
  };

  return (
    upsell && (
      <>
        <PageHeader
          title={client ? '' : `Upsell Order Details`}
          tabs={tabs}
          containerClasses={''}
        />
        <div className="mt-8 max-w-3xl grid grid-cols-1 gap-6 lg:max-w-full lg:grid-flow-col-dense lg:grid-cols-3">
          <div className="space-y-6 lg:col-start-1 lg:col-span-2">
            {/* Details list*/}
            <section aria-labelledby="applicant-information-title">
              <div className="bg-white shadow sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                  <h2
                    id="applicant-information-title"
                    className="text-lg leading-6 font-medium text-gray-900"
                  >
                    Details
                  </h2>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">
                    <b>Client Name: </b>
                    {upsell.agencyClient.client}
                  </p>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">
                    <b>Requested By: </b>
                    {nameFormatter(upsell.requestedByUser)}
                  </p>
                </div>
                <div
                  className={classnames(
                    'border-t border-gray-200 px-4 py-8 sm:px-6 overflow-y-auto max-h-96',
                    {
                      'bg-green-50': status === 'completed',
                      'bg-blue-50': status === 'in-progress',
                      'bg-yellow-50': status === 'pending',
                    }
                  )}
                >
                  <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-4">
                    {/* List of items */}
                    {upsell.details ? (
                      upsell.details.map((d, i) => (
                        <>
                          <div className="sm:col-span-1">
                            <dt className="text-sm font-medium text-gray-500">
                              Title
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900">
                              {d.name}
                            </dd>
                          </div>
                          <div className="sm:col-span-1">
                            <dt className="text-sm font-medium text-gray-500">
                              Description
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900">
                              {d.description}
                            </dd>
                          </div>
                          <div className="sm:col-span-1">
                            <dt className="text-sm font-medium text-gray-500 text-left lg:text-center">
                              Price
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 text-left lg:text-center">
                              {currencyFormatter(d.price)}
                            </dd>
                          </div>
                          <div className="sm:col-span-1">
                            <dt className="text-sm font-medium text-gray-500 text-left lg:text-center">
                              Quantity
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 text-left lg:text-center">
                              {d.qty}
                            </dd>
                          </div>

                          {i < upsell.details.length - 1 && (
                            <div className="sm:col-span-4">
                              <hr className="border-gray-200" />
                            </div>
                          )}
                        </>
                      ))
                    ) : (
                      <div className="sm:col-span-1">
                        <p>No items to display here.</p>
                      </div>
                    )}

                    {/* End List of items */}
                  </dl>
                </div>
                {order && (
                  <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                    <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-4">
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">
                          Date Started
                        </dt>
                        <dd className="mt-3 text-sm text-gray-900">
                          {order.startedAt
                            ? dateFormatterUTC(order.startedAt)
                            : 'Not yet started'}
                        </dd>
                      </div>
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">
                          Date Completed
                        </dt>
                        <dd className="mt-3 text-sm text-gray-900">
                          {order.completedAt
                            ? dateFormatterUTC(order.completedAt)
                            : 'Not yet completed'}
                        </dd>
                      </div>
                      <div className="sm:col-span-2">&nbsp;</div>
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">
                          Assigned To test
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          {userCan('upsells.orders.update') ? (
                            <SelectEmployee
                              onChange={onChangeEmployee}
                              defaultValue={assignedTo}
                            />
                          ) : (
                            nameFormatter(order.assignedToUser)
                          )}
                        </dd>
                      </div>
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">
                          ETA
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          {userCan('upsells.orders.update') ? (
                            <Input
                              type="date"
                              id="eta"
                              min={moment().format('YYYY-MM-DD')}
                              value={eta && dateFormatterUTC(eta, 'YYYY-MM-DD')}
                              onChange={(e) => onChangeEta(e.target.value)}
                            />
                          ) : eta ? (
                            dateFormatterUTC(order.eta)
                          ) : (
                            '-'
                          )}
                        </dd>
                      </div>

                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">
                          Status
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          {userCan('upsells.orders.update') ? (
                            <Select
                              id="status"
                              value={status}
                              onChange={(e) => onChangeStatus(e.target.value)}
                            >
                              {statuses.map((s) => {
                                const { key, value } = s;
                                return <option value={key}>{value}</option>;
                              })}
                            </Select>
                          ) : (
                            <Badge
                              color={classnames({
                                yellow: status === 'pending',
                                green: status === 'completed',
                                blue: status === 'in-progress',
                              })}
                              classes="uppercase"
                              rounded="md"
                            >
                              {status}
                            </Badge>
                          )}
                        </dd>
                      </div>
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">
                          &nbsp;
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900 text-center">
                          {userCan('upsells.orders.update') && (
                            <Button color="red" onClick={onSaveChanges}>
                              Save Changes
                            </Button>
                          )}
                        </dd>
                      </div>
                    </dl>
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* Comments*/}
          {userCan('upsells.order.comments.view') && (
            <section aria-labelledby="notes-title">
              <div className="bg-white shadow sm:rounded-lg sm:overflow-hidden">
                <div className="divide-y divide-gray-200">
                  <div className="px-4 py-5 sm:px-6">
                    <h2
                      id="notes-title"
                      className="text-lg font-medium text-gray-900"
                    >
                      Comments &amp; History
                    </h2>
                  </div>
                  {userCan('upsells.order.comments.create') && (
                    <div className="bg-gray-50 px-4 py-3 sm:px-6">
                      <div className="flex space-x-3">
                        <div className="min-w-0 flex-1">
                          <form action="#">
                            <div>
                              <label htmlFor="comment" className="sr-only">
                                Add comment
                              </label>
                              <textarea
                                id="comment"
                                name="comment"
                                rows={3}
                                className="shadow-sm block w-full focus:ring-red-500 focus:border-red-500 sm:text-sm border border-gray-300 rounded-md"
                                placeholder="Add a note"
                                onChange={(e) => setComment(e.target.value)}
                                value={comment}
                              />
                            </div>
                            <div className="text-right">
                              <button
                                type="submit"
                                className="btn-red text-xs"
                                onClick={(e) => onAddComment(e)}
                              >
                                <PlusIcon className="w-4 h-4 inline" />
                                Comment
                              </button>
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="px-4 pt-2 pb-12 sm:px-6 max-h-96 overflow-auto">
                    <ul
                      role="list"
                      className="space-y-3 divide-y divide-gray-200"
                    >
                      {comments.map((comment, i) => (
                        <li
                          className="pt-3 px-2 group"
                          key={comment.upsellCommentId}
                        >
                          <div className="flex justify-between">
                            <div className="col-span-3 text-sm text-gray-700 w-4/5">
                              <p className="whitespace-pre-wrap">
                                {comment.comment}
                              </p>
                            </div>
                            <div className="flex justify-end text-sm">
                              <span className="text-gray-500 text-xs">
                                {agoUTC(comment.createdAt)}
                              </span>
                            </div>
                          </div>

                          <div className="flex justify-between">
                            <span className="text-sm font-medium text-gray-900">
                              {nameFormatter(comment.commentedByUser)}
                            </span>
                            {userCan('upsells.order.comments.delete') &&
                              (isMine(comment.commentedByUser.userId) ||
                                isAgencySuperUser()) && (
                                <button
                                  type="button"
                                  className="text-red-700 hover:text-red-900 font-normal text-xs hidden group-hover:block"
                                  onClick={() =>
                                    onDelete(comment.upsellCommentId)
                                  }
                                >
                                  <TrashIcon className="w-4 h-4 inline mr-2" />
                                </button>
                              )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </section>
          )}
        </div>
      </>
    )
  );
};

export default OrderDetails;
