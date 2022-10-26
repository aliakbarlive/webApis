import React, { useCallback, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Editor from 'components/Editor';
import axios from 'axios';
import { setAlert } from 'features/alerts/alertsSlice';
import { useTranslation } from 'react-i18next';
import _ from 'lodash';

const ManageEmails = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  let copiesUrlHtml = '';
  let listingImageUrlHtml = '';
  let aPlusContentUrlHtml = '';
  let brandPageUrlHtml = '';

  const [introduction, setIntroduction] = useState(null);
  const [getAccess, setGetAccess] = useState(null);
  const [stats, setStats] = useState(null);
  const [checklist, setChecklist] = useState(null);
  const [refresh, setRefresh] = useState(false);

  if (checklist !== null) {
    const { defaultValue } = checklist;
    const { copiesUrl, listingImageUrl, aPlusContentUrl, brandPageUrl } =
      defaultValue;
    copiesUrlHtml = copiesUrl;
    listingImageUrlHtml = listingImageUrl;
    aPlusContentUrlHtml = aPlusContentUrl;
    brandPageUrlHtml = brandPageUrl;
  }

  useEffect(() => {
    axios.get(`/agency/client/checklist/1`).then((res1) => {
      axios.get(`/agency/client/checklist/2`).then((res2) => {
        axios.get(`/agency/client/checklist/5`).then((res3) => {
          axios.get(`/agency/client/checklist/6`).then((res) => {
            setIntroduction(res1.data.data);
            setStats(res3.data.data);
            setGetAccess(res2.data.data);
            setChecklist(res.data.data);
          });
        });
      });
    });
  }, [refresh]);

  const debounceEditIntroduction = useCallback(
    _.debounce((value) => setIntroduction(value), 500),
    []
  );

  const debounceEditGetAccess = useCallback(
    _.debounce((value) => setGetAccess(value), 500),
    []
  );

  const debounceSetStatsAccess = useCallback(
    _.debounce((value) => setStats(value), 500),
    []
  );

  const onIntroductionChange = (val) => {
    let defaultValue = [];
    defaultValue[0] = { ...introduction.defaultValue[0], value: val };
    debounceEditIntroduction({ ...introduction, defaultValue });
  };
  const onGetAccessChange = (val) => {
    let defaultValue = [];
    defaultValue[0] = { ...getAccess.defaultValue[0], value: val };
    debounceEditGetAccess({ ...getAccess, defaultValue });
  };
  const onStatsChange = (val, index) => {
    let defaultValue = [...stats.defaultValue];
    defaultValue[index] = { ...defaultValue[index], value: val };
    debounceSetStatsAccess({ ...stats, defaultValue });
  };

  const onCopiesChange = (val) => {
    copiesUrlHtml = val;
  };
  const onListingImageChange = (val) => {
    listingImageUrlHtml = val;
  };
  const onAPlusContentChange = (val) => {
    aPlusContentUrlHtml = val;
  };
  const onBrandPageChange = (val) => {
    brandPageUrlHtml = val;
  };

  const onSave = () => {
    const body = {
      defaultValue: {
        copiesUrl: copiesUrlHtml,
        listingImageUrl: listingImageUrlHtml,
        aPlusContentUrl: aPlusContentUrlHtml,
        brandPageUrl: brandPageUrlHtml,
      },
    };

    axios.post(`/agency/client/checklist/6`, body).then((res) => {
      setRefresh(!refresh);
      dispatch(setAlert('success', 'Email Templates Saved!'));
    });
  };

  const onSaveCheckList = (id) => {
    let defaultValue = [];
    let title = '';
    if (id == 1) {
      title = 'Introduction';
      defaultValue = introduction.defaultValue;
    } else if (id == 2) {
      title = 'Get Amazon Sub User Access and MWS Token';
      defaultValue = getAccess.defaultValue;
    } else if (id == 5) {
      title = 'Setup Manage By Stats';
      defaultValue = stats.defaultValue;
    }
    const body = {
      defaultValue,
    };

    axios.post(`/agency/client/checklist/${id}`, body).then((res) => {
      setRefresh(!refresh);
      dispatch(setAlert('success', `${title} email updated!`));
    });
  };

  return (
    <>
      <h1>Manage Introduction Email Template</h1>
      <div className="w-9/12">
        {introduction && (
          <Editor
            initialValue={
              introduction.defaultValue && introduction.defaultValue[0].value
            }
            onEditorChange={onIntroductionChange}
          />
        )}
      </div>
      <p>
        <button
          onClick={() => onSaveCheckList(1)}
          className="w-32 text-center text-sm items-center p-2.5 mb-4 mt-2 border border-transparent rounded shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          {t('Save')}
        </button>
      </p>
      <h1>Manage Get Access Email Template</h1>
      <div className="w-9/12">
        {getAccess && (
          <Editor
            initialValue={
              getAccess.defaultValue && getAccess.defaultValue[0].value
            }
            onEditorChange={onGetAccessChange}
          />
        )}
      </div>
      <p>
        <button
          onClick={() => onSaveCheckList(2)}
          className="w-32 text-center text-sm items-center p-2.5 mb-4 mt-2 border border-transparent rounded shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          {t('Save')}
        </button>
      </p>

      <h1>Manage Setup Manage By Stats Template</h1>
      <h2>Setup Email</h2>
      <div className="w-9/12">
        {stats && (
          <Editor
            initialValue={stats.defaultValue[0] && stats.defaultValue[0].value}
            onEditorChange={(val) => {
              onStatsChange(val, 0);
            }}
          />
        )}
      </div>
      <h2>Follow Up Email</h2>
      <div className="w-9/12">
        {stats && (
          <Editor
            initialValue={stats.defaultValue[1] && stats.defaultValue[1].value}
            onEditorChange={(val) => {
              onStatsChange(val, 1);
            }}
          />
        )}
      </div>
      <p>
        <button
          onClick={() => onSaveCheckList(5)}
          className="w-32 text-center text-sm items-center p-2.5 mb-4 mt-2 border border-transparent rounded shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          {t('Save')}
        </button>
      </p>

      <h1>{t('Profile.Checklist.ManageEmailTemplateUrlHeader')}</h1>
      <h2>{t('Profile.Checklist.CopiesUrl')}</h2>
      <div className="w-9/12">
        <Editor initialValue={copiesUrlHtml} onEditorChange={onCopiesChange} />
      </div>
      <p>
        <button
          onClick={() => onSave()}
          className="w-32 text-center text-sm items-center p-2.5 mb-4 mt-2 border border-transparent rounded shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          {t('Save')}
        </button>
      </p>
      <h2>{t('Profile.Checklist.ListingImageUrl')}</h2>
      <div className="w-9/12">
        <Editor
          initialValue={listingImageUrlHtml}
          onEditorChange={onListingImageChange}
        />
      </div>
      <p>
        <button
          onClick={() => onSave()}
          className="w-32 text-center text-sm items-center p-2.5 mb-4 mt-2 border border-transparent rounded shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          {t('Save')}
        </button>
      </p>
      <h2>{t('Profile.Checklist.APlusCOntentUrl')}</h2>
      <div className="w-9/12">
        <Editor
          initialValue={aPlusContentUrlHtml}
          onEditorChange={onAPlusContentChange}
        />
      </div>
      <p>
        <button
          onClick={() => onSave()}
          className="w-32 text-center text-sm items-center p-2.5 mb-4 mt-2 border border-transparent rounded shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          {t('Save')}
        </button>
      </p>
      <h2>{t('Profile.Checklist.BrandPageUrl')}</h2>
      <div className="w-9/12">
        <Editor
          initialValue={brandPageUrlHtml}
          onEditorChange={onBrandPageChange}
        />
      </div>
      <p>
        <button
          onClick={() => onSave()}
          className="w-32 text-center text-sm items-center p-2.5 mb-4 mt-2 border border-transparent rounded shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          {t('Save')}
        </button>
      </p>
    </>
  );
};

export default ManageEmails;
