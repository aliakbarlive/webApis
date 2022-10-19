import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Row,
  Col,
  CustomInput,
} from 'reactstrap';
import { isArray, isObject, keys, startCase } from 'lodash';
import { setAlert } from 'features/alert/alertSlice';

import axios from 'axios';

const ConfigurationModal = ({ isOpen, toggle, config, onUpdate, count }) => {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [endpoint, setEndpoint] = useState('');
  const [additionalParams, setAdditionalParams] = useState({});

  const [form, setForm] = useState({
    title: false,
    description: false,
    price: false,
    featureBullets: false,
    listingImages: false,
    buyboxWinner: false,
    categories: false,
    reviews: false,
  });

  useEffect(() => {
    setTitle(`Update ${count} configurations`);

    // If single update
    if (isObject(config) && 'listingAlertConfigurationId' in config) {
      setTitle(config.listing.title);
      setEndpoint(
        `/listings/alert-configs/${config.listingAlertConfigurationId}`
      );

      const initialValue = { ...form };
      Object.keys(form).forEach((key) => {
        initialValue[key] = config[key];
      });
      setForm(initialValue);
    }

    if (config == '*') {
      setEndpoint(`/listings/alert-configs/bulk`);
      setAdditionalParams({ listingAlertConfigurationIds: '*' });
    }

    if (isArray(config)) {
      setEndpoint(`/listings/alert-configs/bulk`);
      setAdditionalParams({ listingAlertConfigurationIds: config });
    }
  }, [config]);

  const reset = () => {
    setTitle('');
    setEndpoint('');
    setAdditionalParams({});
    setForm({
      title: false,
      description: false,
      price: false,
      featureBullets: false,
      listingImages: false,
      buyboxWinner: false,
      categories: false,
      reviews: false,
    });
  };

  const onClick = () => {
    setLoading(true);
    axios
      .put(endpoint, { ...form, ...additionalParams })
      .then((res) => {
        onUpdate();
        toggle();
        reset();
        dispatch(setAlert(res.data.message, 'success', 3000));
      })
      .finally(() => setLoading(false));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newVal = { ...form };
    const ref = form[name] ? 'on' : 'off';
    newVal[name] = value != ref;
    setForm(newVal);
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="sm">
      <ModalHeader tag="div" toggle={toggle}>
        <Row>
          <Col>
            <h4 className="text-primary">Product Monitoring Settings</h4>
            <h6 className="text-dark">{title}</h6>
          </Col>
        </Row>
      </ModalHeader>
      <ModalBody>
        {Object.keys(form).map((key) => (
          <CustomInput
            className="mb-2"
            key={key}
            type="switch"
            id={key}
            name={key}
            label={startCase(key)}
            checked={form[key]}
            onChange={handleChange}
          />
        ))}
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={onClick} disabled={loading}>
          Save
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default ConfigurationModal;
