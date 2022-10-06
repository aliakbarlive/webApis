import PageHeader from 'components/PageHeader';
import { FileDrop } from 'react-file-drop';
import { S3_LIMIT_SIZE } from 'utils/constants';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setAlert } from 'features/alerts/alertsSlice';
import { useRef, useState } from 'react';
import { PlusIcon } from '@heroicons/react/solid';
import { DocumentTextIcon } from '@heroicons/react/outline';
import Button from 'components/Button';

const Import = () => {
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [filesUp, setFilesUp] = useState(null);

  //* Triggered after selecting a file
  const onFileInputChange = (event) => {
    uploadFiles(event.target.files);
  };

  // * Upload CSV to bulk update the details
  const uploadFiles = (files) => {
    if (fileInputRef.current.files.length <= 0) {
      fileInputRef.current.files = files;
    }
    setFilesUp([...files]);
    setMessage('');
  };
  // * Triggered when the button for adding files is clicked
  const onTargetClick = () => {
    fileInputRef.current.click();
  };

  const onStartImport = async (e) => {
    e.stopPropagation();

    const files = fileInputRef.current.files;
    setLoading(true);
    for (let i = 0; i < files.length; i++) {
      let file = files[i];
      if (file.size <= S3_LIMIT_SIZE) {
        const formData = new FormData();
        formData.append('file', file);
        await axios
          .post(`/agency/leads/importleadsfromcsv`, formData)
          .then((res) => {
            if (res.data.success === true) {
              const {
                data: { inserted, skipped, totalRows },
              } = res.data;

              const message = `Total # of rows processed: ${totalRows} | inserted: ${inserted} | skipped: ${skipped}`;
              dispatch(
                setAlert('success', 'Bulk update was successful', message)
              );
              setMessage(message);
            } else {
              dispatch(setAlert('error', res.data.message));
            }
          });
      }
    }

    setLoading(false);
    fileInputRef.current.value = null;
  };

  return (
    <>
      <PageHeader title="Import Leads" />
      <div>
        <input
          onChange={onFileInputChange}
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept="text/csv"
          multiple
        />
        <FileDrop
          onTargetClick={onTargetClick}
          onDrop={(files, event) => uploadFiles(files)}
        >
          <div className="border border-dashed border-gray-300 p-5 text-center cursor-pointer bg-gray-100">
            <div className="flex items-center justify-center">
              <PlusIcon
                className="text-gray-500 mr-1 h-5 w-5 inline"
                aria-hidden="true"
              />
              <span className="text-gray-500 text-xl">
                Drop CSV file or click to select
              </span>
            </div>

            {filesUp && (
              <div className="mt-4">
                <ul className="text-sm mb-4">
                  {filesUp.map((file, i) => {
                    return (
                      <li key={i}>
                        <DocumentTextIcon className="inline w-4 h-4" />{' '}
                        <span className="text-gray-700">{file.name}</span>
                      </li>
                    );
                  })}
                </ul>
                {fileInputRef.current.value && (
                  <Button
                    color="green"
                    loading={loading}
                    showLoading={true}
                    onClick={onStartImport}
                  >
                    Upload &amp; Import
                  </Button>
                )}
                {message !== '' && (
                  <div className="mt-4">
                    <span className="text-yellow-600 text-sm bg-yellow-50 py-1 px-2">
                      {message}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </FileDrop>
      </div>
    </>
  );
};
export default Import;
