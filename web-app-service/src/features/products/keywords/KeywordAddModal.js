import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

import Modal from 'components/Modal';
import ModalHeader from 'components/ModalHeader';
import { Input } from 'components';

import { addKeywordsAsync, getKeywordRankingsAsync } from './keywordSlice';

const KeywordAddModal = ({ open, setOpen, asin, params, dateRange }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [keywords, setKeywords] = useState([]);

  const onChangeInput = (text) => {
    setKeywords(text.split('\n').filter((e) => e !== ''));
  };

  const onAdd = async () => {
    await Promise.all(
      keywords.map(async (keyword) => {
        await dispatch(
          addKeywordsAsync(
            { keywordText: keyword, asin: asin },
            {
              success: `${t('Products.Keywords.SuccessfullyAdded')} ${keyword}`,
            }
          )
        );
      })
    );

    await dispatch(
      getKeywordRankingsAsync({
        ...params,
        ...dateRange,
      })
    );

    setOpen(false);
  };

  return (
    <>
      <Modal
        open={open}
        setOpen={setOpen}
        align="top"
        as={'div'}
        noOverlayClick={true}
      >
        <div className="inline-block w-full max-w-4xl my-8 text-left align-middle transition-all transform bg-white shadow-xl rounded-xl">
          <ModalHeader title="Add Keyword" setOpen={setOpen} />
          <div className="py-4 px-2 w-full">
            <Input
              label="Product"
              placeholder={asin}
              className="ml-4"
              disabled={true}
            />
          </div>
          <div className="px-4 my-4 ml-2">
            <label
              htmlFor="keywords"
              className="block text-sm font-medium text-gray-700"
            >
              Keywords
            </label>
            <div className="">
              <textarea
                id="keywords"
                name="keywords"
                rows={3}
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
                defaultValue=""
                onChange={(e) => onChangeInput(e.target.value)}
              />
            </div>
          </div>
          <div className="text-right my-5 mr-2">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="m-2 inline-flex py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 "
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => onAdd()}
              className="m-2 inline-flex py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 "
            >
              Add
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default KeywordAddModal;
