import { useEffect, Fragment, useState, useCallback } from 'react';
import { PlusIcon, TrashIcon } from '@heroicons/react/outline';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { useParams } from 'react-router';

import { agoUTC, nameFormatter } from 'utils/formatters';
import { setAlert } from 'features/alerts/alertsSlice';

import usePermissions from 'hooks/usePermissions';

const LeadNoteForm = ({ refresh, setRefresh }) => {
  const dispatch = useDispatch();
  const [notes, setNotes] = useState([]);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const { id } = useParams();

  const { userCan, isMine, isAgencySuperUser } = usePermissions();
  const { user } = useSelector((state) => state.auth);

  const getLeadNotes = async () => {
    setLoading(true);
    await axios.get(`/agency/leads/${id}/notes`).then((res) => {
      setNotes(res.data.data.rows);
    });
    setLoading(false);
  };

  useEffect(() => {
    async function getData() {
      await getLeadNotes();
    }

    if (!loading && id !== 'create') {
      getData();
    }
  }, [id, refresh]);

  const onAddNote = (e) => {
    e.preventDefault();
    if (note.trim().length > 0) {
      if (id !== 'create') {
        axios
          .post(`/agency/leads/${id}/notes`, {
            name: 'Lead note added',
            description: note,
          })
          .then((res) => {
            dispatch(setAlert('success', 'Lead notes added!'));
            let newNotes = {
              ...res.data.data,
              addedByUser: user,
            };
            setNotes([newNotes, ...notes]);
            setNote('');
          });
      } else {
        dispatch(
          setAlert('error', 'Please the lead first before adding a note!')
        );
      }
    } else {
      dispatch(setAlert('error', 'Provide a note!'));
    }
  };

  const onDelete = (leadNoteId) => {
    axios.delete(`/agency/leads/notes/${leadNoteId}`).then((res) => {
      if (res.data.success) {
        let newNotes = JSON.parse(JSON.stringify(notes)).filter(
          (el) => el.leadNoteId !== leadNoteId
        );
        setNotes(newNotes);
        dispatch(setAlert('success', 'Lead note deleted!'));
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

  const duplicateFormatter = (text) => {
    return text.split(',').join('\n');
  };

  return (
    id !== 'create' && (
      <>
        <section aria-labelledby="notes-title">
          <div className="bg-white shadow sm:rounded-lg sm:overflow-hidden">
            <div className="divide-y divide-gray-200">
              <div className="px-4 py-5 sm:px-6">
                <h2
                  id="notes-title"
                  className="text-lg font-medium text-gray-900"
                >
                  Lead Notes
                </h2>
              </div>

              {userCan('leads.notes.create') && (
                <div className="bg-gray-50 px-4 py-3 sm:px-6">
                  <div className="flex space-x-3">
                    <div className="min-w-0 flex-1">
                      <form action="#">
                        <div>
                          <label htmlFor="note" className="sr-only">
                            Add lead note
                          </label>
                          <textarea
                            id="leadNote"
                            name="leadNote"
                            rows={3}
                            className="shadow-sm block w-full focus:ring-red-500 focus:border-red-500 sm:text-sm border border-gray-300 rounded-md"
                            placeholder="Add a note"
                            onChange={(e) => setNote(e.target.value)}
                            value={note}
                          />
                        </div>
                        <div className="text-right">
                          <button
                            type="submit"
                            className="btn-red text-xs"
                            onClick={(e) => onAddNote(e)}
                          >
                            <PlusIcon className="w-4 h-4 inline" />
                            Save
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              )}

              <div className="px-4 pt-2 pb-12 sm:px-6 max-h-96 overflow-auto">
                <ul role="list" className="space-y-3 divide-y divide-gray-200">
                  {notes.map((note, i) => (
                    <li className="pt-3 px-2 group" key={note.leadNoteId}>
                      <div className="flex justify-between">
                        <div className="col-span-3 text-sm text-gray-700 w-4/5">
                          <p className="whitespace-pre-wrap">
                            {note.name === 'Continue Anyway'
                              ? duplicateFormatter(note.description)
                              : note.description}
                          </p>
                        </div>
                        <div className="flex justify-end text-sm">
                          <span className="text-gray-500 text-xs">
                            {agoUTC(note.createdAt)}
                          </span>
                        </div>
                      </div>

                      <div className="flex justify-between">
                        <div>
                          <span className="text-sm font-medium text-gray-900">
                            {nameFormatter(note.addedByUser)}
                          </span>
                          <span className="pl-4 text-sm font-medium text-gray-500">
                            [{note.name}]
                          </span>
                        </div>

                        {userCan('leads.notes.delete') &&
                          (isMine(note.addedByUser.userId) ||
                            isAgencySuperUser()) && (
                            <button
                              type="button"
                              className="text-red-700 hover:text-red-900 font-normal text-xs hidden group-hover:block"
                              onClick={() => onDelete(note.leadNoteId)}
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
      </>
    )
  );
};
export default LeadNoteForm;
