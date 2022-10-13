import React, { useState, useEffect } from 'react';
import { XIcon, TrashIcon } from '@heroicons/react/outline';
import Moment from 'react-moment';

import Modal from 'components/Modal';
import { useDispatch, useSelector } from 'react-redux';

import {
  addNoteAsync,
  getNotesAsync,
  deleteNoteAsync,
  selectNotesEntity,
  selectNotesList,
} from './notesSlice';

const NotesModal = ({ open, setOpen, title, keyField, onChange }) => {
  const dispatch = useDispatch();
  const entity = useSelector(selectNotesEntity);
  const notes = useSelector(selectNotesList);
  const [body, setBody] = useState('');

  useEffect(() => {
    if (open) {
      dispatch(getNotesAsync(entity));
    }
  }, [dispatch, open, entity]);

  const addNote = async () => {
    await dispatch(addNoteAsync({ body, ...entity }));
    await dispatch(getNotesAsync(entity));
    setBody('');
    onChange();
  };

  const deleteNote = async (noteId) => {
    await dispatch(deleteNoteAsync(noteId));
    await dispatch(getNotesAsync(entity));
    onChange();
  };

  return (
    <Modal open={open} setOpen={setOpen}>
      <div className="inline-block align-bottom bg-white rounded-lg pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle md:max-w-md md:w-full">
        <div className="hidden sm:block absolute top-0 right-0 pt-4 pr-4">
          <button
            type="button"
            className="bg-red rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
            onClick={() => setOpen(false)}
          >
            <span className="sr-only">Close</span>
            <XIcon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        <div className="px-4 md:px-6 border-b-2 pb-3">
          <h3 className="text-md leading-6 font-medium text-gray-800">
            {title}
          </h3>
        </div>
        <div className="text-center pt-4 px-4 md:px-6 pb-4s">
          <textarea
            id="addNote"
            name="addNote"
            rows="3"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Add notes here..."
            className="max-w-lg shadow-sm block w-full focus:ring-red-500 focus:border-red-500 sm:text-sm border border-gray-300 rounded-md"
          ></textarea>
          <div className="text-right my-5">
            <button
              type="button"
              className="inline-flex items-center px-2.5 py-1.5 border text-xs font-medium rounded shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 "
              onClick={addNote}
            >
              Add Note
            </button>
          </div>
        </div>

        <div
          className="pb-4 px-4 md:px-6 pb-4s modal-content"
          style={{ overflowY: 'auto', maxHeight: '400px' }}
        >
          <ul className="divide-y divide-gray-200">
            {notes.rows.map((note, i) => (
              <li key={note.noteId} className="py-4 text-gray-700">
                <div className="flex space-x-3">
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium">
                        <Moment format="lll">{note.createdAt}</Moment>
                      </h3>
                      <button>
                        <TrashIcon
                          onClick={() => deleteNote(note.noteId)}
                          className="h-5 w-5"
                        />
                      </button>
                    </div>
                    <p className="text-sm">{note.body}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Modal>
  );
};

export default NotesModal;
