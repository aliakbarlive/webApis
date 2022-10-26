import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FileDrop } from 'react-file-drop';
import { PlusIcon, PlusSmIcon } from '@heroicons/react/solid';
import { LinkIcon, CloudIcon, TrashIcon } from '@heroicons/react/outline';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import isURL from 'validator/lib/isURL';
import { uniqueId } from 'lodash';
import prependHttp from 'prepend-http';

import { setAlert } from 'features/alerts/alertsSlice';
import { S3_LIMIT_SIZE } from 'utils/constants';

import {
  fetchClientChecklistsById,
  selectClientChecklist,
} from '../../clientChecklistsSlice';
import Loading from 'components/Loading';
import ConfirmationModal from 'components/ConfirmationModal';

const FileAction = ({ data, agencyClientId, setOpen }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);
  const [link, setLink] = useState('');
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [selectedFile, setSelectedFile] = useState({});
  const folder = `agency/clients/${agencyClientId}/assets`;
  const { clientChecklist } = data;
  const { clientChecklistId } = clientChecklist[0];
  const ccList = useSelector(selectClientChecklist);

  let value = ccList ? (ccList.value !== null ? [...ccList.value] : []) : [];

  // * Get the details of a client checklist
  useEffect(() => {
    if (clientChecklistId !== null) {
      dispatch(fetchClientChecklistsById(clientChecklistId)).then(() => {
        setLoading(false);
      });
    }
  }, [dispatch, refresh, clientChecklistId]);

  // * Update the value of the checklist
  const updateClientChecklist = (body) => {
    axios
      .post(`/agency/client/${agencyClientId}/checklists`, body)
      .then((res) => {
        dispatch(
          setAlert('success', t('Clients.ClientChecklists.UpdateChecklist'))
        );
        setRefresh(!refresh);
      });
  };

  // * Upload files to S3
  const uploadFiles = (files) => {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.size <= S3_LIMIT_SIZE) {
        const formData = new FormData();
        formData.append('folder', folder);
        formData.append('file', file);
        setLoading(true);
        axios
          .post(`/s3/files`, formData)
          .then((res) => {
            const { success, data } = res.data;
            const { fileName, originalName } = data;

            if (success) {
              value.push({
                type: 's3',
                originalName,
                fileName,
              });

              const body = {
                value,
                checklistId: ccList.checklistId,
              };

              updateClientChecklist(body);
            } else {
              dispatch(
                setAlert(
                  'error',
                  `${t(
                    'Clients.ClientChecklists.ClientAssets.SomethingWentWrongUpload'
                  )} ${file.name}`
                )
              );
              setLoading(false);
            }
          })
          .catch((err) => {
            console.log(err);
            dispatch(
              setAlert(
                'error',
                `${t('Clients.ClientChecklists.ClientAssets.UnableUpload')} ${
                  file.name
                }`
              )
            );
            setLoading(false);
          });
      } else {
        dispatch(
          setAlert(
            'error',
            `${file.name}: ${t(
              'Clients.ClientChecklists.ClientAssets.Exceeds5MB'
            )}`
          )
        );
        setLoading(false);
      }
    }
  };

  //* Triggered after selecting a file
  const onFileInputChange = (event) => {
    const { files } = event.target;
    uploadFiles(files);
  };

  // * Triggered when the button for adding files is clicked
  const onTargetClick = () => {
    fileInputRef.current.click();
  };

  // * Updates the value of the link
  const onHandleChange = (e) => {
    setLink(e.target.value);
  };

  // * Add Link to the checklist
  const onAddDriveLink = () => {
    if (isURL(link)) {
      value.push({
        type: 'link',
        originalName: link,
        fileName: uniqueId(`${link}-`),
      });
      const body = {
        value,
        checklistId: ccList.checklistId,
      };

      updateClientChecklist(body);
      setLink('');
    } else {
      dispatch(
        setAlert('error', t('Clients.ClientChecklists.ClientAssets.ValidUrl'))
      );
    }
  };

  // * if the file is S3 it will generate a unique url and get the file
  // * if the file is a link, it will open on a new tab
  const onViewLink = (e, file) => {
    e.preventDefault();
    if (file.type === 's3') {
      axios
        .get('/s3/files', {
          params: {
            path: `${folder}/${file.fileName}`,
          },
        })
        .then((res) => {
          const { success, data: url } = res.data;
          if (success) {
            window.open(prependHttp(url, { https: false }));
          }
        });
    } else {
      window.open(prependHttp(file.originalName, { https: false }));
    }
  };

  // * Stores the select file
  const onSelectAsset = (file) => {
    setSelectedFile(file);
    setConfirm(true);
  };

  // * Removes the files from the database
  // * If S3, also triggers the removal of the file on S3
  const onDeleteAsset = (file) => {
    const newList = value.filter((f) => {
      return f.fileName !== file.fileName;
    });

    setLoading(true);

    if (file.type === 's3') {
      axios
        .delete('/s3/files', {
          params: {
            path: `${folder}/${file.fileName}`,
          },
        })
        .then((res) => {
          dispatch(
            setAlert(
              'success',
              `${file.originalName} ${t(
                'Clients.ClientChecklists.ClientAssets.IsRemovedS3'
              )}`
            )
          );
        });
    }

    const body = {
      value: newList,
      checklistId: ccList.checklistId,
    };
    updateClientChecklist(body);
    setConfirm(false);
  };

  return (
    <>
      <input
        onChange={onFileInputChange}
        ref={fileInputRef}
        type="file"
        className="hidden"
      />
      <p>
        <label>{t('Clients.ClientChecklists.ClientAssets.Files')}</label>
      </p>
      <FileDrop
        onTargetClick={onTargetClick}
        onDrop={(files, event) => uploadFiles(files)}
      >
        <button
          type="button"
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
          {t('Clients.ClientChecklists.ClientAssets.AddDropFiles')}
        </button>
      </FileDrop>
      <p className="mt-5">
        <label>{t('Clients.ClientChecklists.ClientAssets.DriveLinks')}</label>
      </p>
      <p className="mb-5">
        <input
          type="text"
          value={link}
          placeholder="ex: https://drive.google.com/drive/"
          className="w-3/6 float-left"
          onChange={onHandleChange}
        />
        <button
          type="button"
          className="inline-flex items-center p-2.5 border border-transparent rounded-r shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          <PlusSmIcon
            className="h-5 w-5"
            aria-hidden="true"
            onClick={onAddDriveLink}
          />
        </button>
      </p>

      <ConfirmationModal
        title={t('Clients.ClientChecklists.ClientAssets.ConfirmTitle')}
        content={t('Clients.ClientChecklists.ClientAssets.ConfirmContent')}
        open={confirm}
        setOpen={setConfirm}
        onOkClick={() => onDeleteAsset(selectedFile)}
        onCancelClick={() => setConfirm(false)}
      />

      {!loading ? (
        <div className="flow-root pb-5">
          <ul className="-mb-8">
            {value &&
              value.map((file) => (
                <li key={file.fileName} class="mb-3">
                  <div className="relative flex space-x-3">
                    <div>
                      <span className="h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white bg-red-500">
                        {file.type === 's3' ? (
                          <CloudIcon
                            className="h-5 w-5 text-white"
                            aria-hidden="true"
                          />
                        ) : (
                          <LinkIcon
                            className="h-5 w-5 text-white"
                            aria-hidden="true"
                          />
                        )}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                      <div>
                        <p className="text-sm text-gray-500">
                          <a
                            href="/"
                            className="underline"
                            onClick={(e) => onViewLink(e, file)}
                          >
                            {file.originalName}
                          </a>
                        </p>
                      </div>
                      <div className="text-right text-sm whitespace-nowrap text-gray-500">
                        <TrashIcon
                          className="w-5 h-5 text-red cursor-pointer hover:text-red"
                          onClick={() => onSelectAsset(file)}
                        />
                      </div>
                    </div>
                  </div>
                </li>
              ))}
          </ul>
        </div>
      ) : (
        <Loading className="w-10" />
      )}
    </>
  );
};

export default FileAction;
