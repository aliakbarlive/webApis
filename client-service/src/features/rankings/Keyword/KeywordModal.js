import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Form,
  FormGroup,
} from 'reactstrap';

const KeywordModal = ({ isOpen, toggle, keywordsList, asin }) => {
  const [formData, setFormData] = useState({
    keywords: '',
  });
  const addKeywords = formData.keywords
    ? formData.keywords.split('\n').filter((rec) => rec !== '')
    : [];
  const [newKeywords, setNewKeywords] = useState(0);
  useEffect(() => {
    setNewKeywords(
      addKeywords.filter((rec) => !keywordsList.includes(rec) && rec !== '')
    );
  }, [formData]);
  let rows = 18;
  const onInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (formData.keywords) {
      const keywords = formData.keywords
        .split('\n')
        .filter((rec) => rec !== '');
      const newRecords = [];
      const response = [];
      const savedKeywords = [];

      for (let keywordText of keywords) {
        try {
          const query = {
            method: 'post',
            url: `/product/${asin}/keywords`,
            data: { keywordText },
          };

          const res = await axios(query);
          const { success, message } = res.data;

          savedKeywords.push({
            keywordText,
            asin,
          });

          newRecords.push(keywordText);
          response.push({ success, message });

          setFormData({ keywords: '' });
        } catch (err) {
          console.log(err);
        }
      }
      // Generate rankings for newly added keywords
      // TODO: need to refactor
      await axios({
        method: 'post',
        url: `/keywords/search-added-keyword`,
        data: { keywords: savedKeywords },
      });

      toggle(newRecords, response);
      // ++++++++++TODO: Alert response
    } else {
      toggle([]);
    }
  };

  const handleCancel = async () => {
    toggle([]);
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="md" centered>
      <ModalHeader toggle={toggle} as="div">
        <span className="mb-2">Add Keywords</span>
        <span className="text-muted mb-2">
          Keywords entered: {addKeywords.length} ({newKeywords.length} new)
        </span>
      </ModalHeader>
      <ModalBody>
        <Form>
          <FormGroup>
            <Input
              type="textarea"
              rows={rows}
              name="keywords"
              onChange={onInputChange}
            />
          </FormGroup>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={() => handleSave()}>
          Save
        </Button>{' '}
        <Button color="warning" onClick={() => handleCancel()}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default KeywordModal;
