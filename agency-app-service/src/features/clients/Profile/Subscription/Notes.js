import React, { useState } from 'react';
import { DocumentTextIcon, TrashIcon } from '@heroicons/react/outline';
import { dateFormatter } from 'utils/formatters';
import AddNotesPopover from './AddNotesPopover';
import { ConfirmationModal } from 'components';
import { useDispatch } from 'react-redux';
import { deleteNote } from 'features/clients/subscriptionsSlice';
import usePermissions from 'hooks/usePermissions';

const Notes = ({ subscription, setSubscription }) => {
  const { userCan } = usePermissions();
  const { notes } = subscription;
  const [isOpen, setIsOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [note, setNote] = useState(null);
  const dispatch = useDispatch();

  const deleteThisNote = (note) => {
    setNote(note);
    setIsOpen(true);
  };

  const onDeleteNote = async () => {
    setSaving(true);
    dispatch(deleteNote(subscription.subscription_id, note.note_id)).then(
      (res) => {
        if (res.output.code === 0) {
          let notes = [...subscription.notes];
          const idx = notes.findIndex((n) => n.note_id === note.note_id);
          notes.splice(idx, 1);
          setSubscription({
            ...subscription,
            notes,
          });
        }
        setIsOpen(false);
        setSaving(false);
      }
    );
  };

  return (
    <>
      <div className="text-sm text-gray-500 sm:px-5 mb-1 flex items-center">
        <span className="mr-4">Notes</span>
        {userCan('clients.subscription.note.add') && (
          <AddNotesPopover
            subscription={subscription}
            setSubscription={setSubscription}
          />
        )}
      </div>
      {notes && notes.length > 0 ? (
        notes.map((note) => {
          return (
            <div className="flex sm:px-5 sm:py-1 " key={note.note_id}>
              <div className="flex-none w-14">
                <DocumentTextIcon className="w-6 h-6" />
              </div>
              <div className="w-3/5 text-sm">
                <span className="whitespace-pre-wrap">{note.description}</span>
                <br />
                <span className="italic text-gray-400">
                  - {note.commented_by}
                </span>
              </div>
              <div className="sm:pl-4 w-1/4 text-sm text-gray-400">
                <div className="flex items-center">
                  <span className="">{dateFormatter(note.commented_time)}</span>
                  {userCan('clients.subscription.note.delete') && (
                    <button
                      type="button"
                      className="hover:text-red-700"
                      onClick={() => deleteThisNote(note)}
                    >
                      <TrashIcon className="ml-2 w-5 h-5 inline" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <span className="sm:px-5 sm:py-1 text-sm">
          There are no notes added for this subscription.
        </span>
      )}

      <ConfirmationModal
        title="Delete Note"
        content={`Are you sure you want to delete this note?`}
        open={isOpen}
        setOpen={setIsOpen}
        onOkClick={onDeleteNote}
        onCancelClick={() => setIsOpen(false)}
        okLoading={saving}
        showOkLoading={true}
      />
    </>
  );
};
export default Notes;
