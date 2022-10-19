import React, { useEffect, useState } from 'react';
import {
  Col,
  Row,
  FormGroup,
  Input,
  CustomInput,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
} from 'reactstrap';
import CreatableSelect from 'react-select/creatable';
import { Trash2 as Trash2Icon } from 'react-feather';

const AddOn = ({ addons, formData, currencyCode, onChange, onRemove }) => {
  const [addonExists, setAddonExists] = useState(true);
  const [zIndex, setZIndex] = useState(1);

  const options =
    addons &&
    addons.map((a) => {
      return { label: a.addon_code, value: a.addon_code };
    });

  const customStyles = {
    control: (provided) => ({
      ...provided,
      minHeight: '30px',
      height: '30px',
    }),

    valueContainer: (provided) => ({
      ...provided,
      height: '30px',
      padding: '0 6px',
    }),
    // input: (provided) => ({
    //   ...provided,
    //   margin: '0px',
    // }),
    // indicatorSeparator: (state) => ({
    //   display: 'none',
    // }),
    indicatorsContainer: (provided, state) => ({
      ...provided,
      height: '30px',
    }),
    dropdownIndicator: (styles) => ({
      ...styles,
      paddingTop: 6,
      paddingBottom: 6,
      paddingLeft: 6,
      paddingRight: 6,
    }),
    clearIndicator: (styles) => ({
      ...styles,
      paddingTop: 6,
      paddingBottom: 6,
      paddingLeft: 6,
      paddingRight: 6,
    }),
  };

  // const selectStyles = {
  //   dropdownIndicator: (styles) => ({ ...styles, padding: '4px' }),
  // };

  const onInputChange = (e) => {
    onChange({ name: e.target.name, value: e.target.value });
  };

  const handleChange = (e) => {
    const value = e ? e.value.replace(/\s/g, '-') : '';

    const addonExisting = addons.find((a) => a.addon_code == value);

    setAddonExists(addonExisting);

    onChange({
      name: 'addon_code',
      value,
    });

    // console.group('Value Changed');
    // console.log('hc');
    // console.log(e);
    // // console.log(`action: ${actionMeta.action}`);
    // console.groupEnd();
  };

  // const handleInputChange = (e) => {
  //   let value = e.target.value;

  //   //onChange({ name: 'addon_code', value: e ? e.value : '' });

  //   value.replace(/\s/g , "-");
  //   //onInputChange={this.handleInputChange}

  //   //console.group('Input Changed');
  //   //console.log('ic');
  //   // console.log(inputValue);
  //   // console.log(`action: ${actionMeta.action}`);
  //   console.groupEnd();
  // };

  const removeAddon = (e) => {
    e.preventDefault();
    onRemove();
  };

  return (
    <FormGroup row>
      <Col xs={12} style={{ zIndex: zIndex }}>
        <Row>
          <Col xs={11}>
            <CreatableSelect
              isClearable
              name="addon_code"
              placeholder="Addon"
              onChange={handleChange}
              onFocus={(e) => setZIndex(5)}
              onBlur={(e) => setZIndex(1)}
              value={{ label: formData.addon_code, value: formData.addon_code }}
              required
              options={options}
              styles={customStyles}
            />
            <Input
              type="textarea"
              name="addon_description"
              value={formData.addon_description}
              onChange={onInputChange}
              className="mt-2"
              placeholder="Addon Description"
              required
            />
          </Col>
          <Col xs={1}>
            <a href="#" onClick={removeAddon}>
              <Trash2Icon size={16} />
            </a>
          </Col>
        </Row>
      </Col>
      <Col className="mt-2" xs={11} lg={3}>
        <CustomInput
          type="select"
          name="type"
          id="type"
          onChange={onInputChange}
          disabled={addonExists}
          value={formData.type}
          required
        >
          <option value="one_time">One Time</option>
          <option value="recurring">Recurring</option>
        </CustomInput>
      </Col>

      <Col className="mt-2" xs={4} lg={2}>
        <Input
          type="number"
          name="quantity"
          min={1}
          placeholder="Qty"
          value={formData.quantity}
          onChange={onInputChange}
        />
      </Col>
      <Col className="mt-2" xs={4} lg={3}>
        <InputGroup>
          <Input
            type="number"
            name="price"
            className="no-arrow"
            placeholder="Unit Price"
            value={formData.price}
            onChange={onInputChange}
          />
          <InputGroupAddon addonType="append">
            <InputGroupText>{currencyCode}</InputGroupText>
          </InputGroupAddon>
        </InputGroup>
      </Col>
      <Col
        className="text-right d-flex justify-content-between align-items-center"
        xs={4}
        lg={3}
      >
        <span>=</span>
        <span>
          {(formData.price * formData.quantity).toFixed(2)}&nbsp;
          {currencyCode}
        </span>
      </Col>
      <Col xs={12}>
        <span className="w-100 d-block mb-2 border-bottom">&nbsp;</span>
      </Col>
    </FormGroup>
  );
};
export default AddOn;
