import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Col,
  FormGroup,
  Label,
  Input,
  CustomInput,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Button,
} from 'reactstrap';
import { Cashify } from 'cashify';
import currency from 'currency.js';
import {
  fetchAddons,
  getData,
} from 'features/admin/agencyClients/agencyClientsSlice';
import AddOn from './AddOn';
import { PlusSquare as PlusSquareIcon } from 'react-feather';

const SubscriptionForm = ({ operation, formData, onDataChange }) => {
  const [convertDisabled, setConvertDisabled] = useState(true);
  const [noExpiry, setNoExpiry] = useState(true);
  const {
    plans,
    addons,
    currencies,
    exchangeRates,
    dataLoaded,
    clientLoaded,
    hasNewAddons,
  } = useSelector((state) => state.agencyClients);

  const dispatch = useDispatch();

  useEffect(() => {
    if (!dataLoaded) {
      dispatch(getData());
    }
  }, [dataLoaded]);

  useEffect(() => {
    if (operation == 'add') {
      if (dataLoaded) {
        const plan = plans[0];
        loadPlan(plan.plan_code);
        setNoExpiry(true);
      }
    }
  }, [dataLoaded, clientLoaded]);

  useEffect(() => {
    if (hasNewAddons) {
      dispatch(fetchAddons());
    }
  }, [hasNewAddons]);

  useEffect(() => {
    if (operation == 'edit') {
      if (dataLoaded && clientLoaded) {
        setNoExpiry(
          formData.billing_cycles == '' || formData.billing_cycles == 0
            ? true
            : false
        );
      }
    }
  }, [formData.billing_cycles]);

  useEffect(() => {
    if (operation == 'edit') {
      if (dataLoaded && clientLoaded) {
        setConvertDisabled(
          formData.convert_retainer_cycle == '' ||
            formData.convert_retainer_cycle == 0
            ? true
            : false
        );
      }
    }
  }, [formData.convert_retainer_cycle]);

  const onInputChange = (e) => {
    onDataChange({ [e.target.name]: e.target.value });
  };

  function loadPlan(plan_code) {
    const plan = plans.find((p) => p.plan_code == plan_code);

    let { recurring_price: price, description: plan_description } = plan;
    let currency_code = 'USD';
    let pricebook_id = '';

    onDataChange({
      plan_code,
      plan_description,
      currency_code,
      price,
      pricebook_id,
    });
  }

  const onPlanChange = (e) => {
    const value = e.target.value;
    if (value !== '') {
      loadPlan(value);
    }
  };

  function convertPrice(price, from, to) {
    const cashify = new Cashify({
      base: exchangeRates.base,
      rates: exchangeRates.rates,
    });

    const converted = cashify.convert(price, {
      from,
      to,
    });

    return currency(converted, { precision: 2 });
  }

  const onCurrencyChange = (e) => {
    const { name, value } = e.target;

    if (value !== '') {
      const pricebook = currencies.find((c) => c.currencyCode == value);
      const pricebook_id = value == 'USD' ? '' : pricebook.pricebookId;

      let update_values = {
        [name]: value,
        price: convertPrice(formData.price, formData.currency_code, value),
        pricebook_id,
      };

      if (formData.retainer_after_convert !== '') {
        update_values = {
          ...update_values,
          retainer_after_convert: convertPrice(
            formData.retainer_after_convert,
            formData.currency_code,
            value
          ),
        };
      }

      if (formData.addons) {
        let myAddons = formData.addons.slice();

        myAddons.forEach((addon, i) => {
          myAddons = [
            ...myAddons.slice(0, i),
            {
              ...addon,
              price: convertPrice(addon.price, formData.currency_code, value),
            },
          ];
        });

        update_values = {
          ...update_values,
          addons: myAddons,
        };
      }
      onDataChange(update_values);
    }
  };

  const onConvertChange = (e) => {
    setConvertDisabled(!e.target.checked);
    if (!e.target.checked) {
      onDataChange({
        convert_retainer_cycle: '',
        retainer_after_convert: '',
      });
    }
  };

  const onExpiryChange = (e) => {
    setNoExpiry(e.target.checked);
    if (e.target.checked) {
      onDataChange({
        billing_cycles: '',
      });
    }
  };

  const addAddon = (e) => {
    e.preventDefault();

    onDataChange({
      addons: [
        ...formData.addons,
        {
          addon_description: '',
          addon_code: '',
          price: 0,
          quantity: 1,
          type: 'one_time',
        },
      ],
    });
  };

  const onAddonChange = (data, index) => {
    const { name, value } = data;
    let myAddons = formData.addons.slice();

    if (name == 'addon_code') {
      if (value !== '') {
        let myAddon = addons.find((a) => a.addon_code == value);
        if (myAddon) {
          myAddons[index] = {
            addon_code: value,
            addon_description: myAddon.description,
            price: myAddon.price_brackets[0].price,
            type: myAddon.type,
            quantity: myAddon.quantity ? myAddon.quantity : 1,
          };
        } else {
          // create
          myAddons[index] = {
            addon_code: value,
            addon_description: '',
            price: 0,
            type: 'one_time',
            quantity: 1,
          };
        }
      } else {
        //reset
        myAddons[index] = {
          addon_code: '',
          addon_description: '',
          price: 0,
          type: 'one_time',
          quantity: 1,
        };
      }
    } else {
      myAddons[index] = { ...myAddons[index], [name]: value };
    }

    onDataChange({
      addons: myAddons,
    });
  };

  const onAddonRemove = (index) => {
    // console.log('remove', index);
    // let myAddons = formData.addons.slice();

    // array.splice(index, 1);

    let myAddons = [...formData.addons]; // make a separate copy of the array
    myAddons.splice(index, 1);
    //this.setState({people: array});
    onDataChange({
      addons: myAddons,
    });
  };

  return (
    <div
      className={
        (dataLoaded && clientLoaded && operation == 'edit') ||
        (dataLoaded && operation == 'add')
          ? ''
          : 'loading-overlay'
      }
    >
      <FormGroup row>
        <Label className="" for="plan" sm={2}>
          Plan
        </Label>
        <Col sm={10}>
          <CustomInput
            type="select"
            name="plan"
            id="plan"
            value={formData.plan_code}
            onChange={onPlanChange}
            required
          >
            {plans.map((plan) => (
              <option key={plan.plan_code} value={plan.plan_code}>
                {plan.plan_code}
              </option>
            ))}
          </CustomInput>
        </Col>
      </FormGroup>
      <FormGroup row>
        <Label className="" for="price" sm={2}>
          Price
        </Label>
        <Col xs={9} sm={3}>
          <Input
            type="text"
            name="price"
            id="price"
            value={formData.price}
            required
            onChange={onInputChange}
          />
        </Col>
        <Col xs={3} sm={2} className="pl-0">
          <CustomInput
            type="select"
            name="currency_code"
            id="currency_code"
            onChange={onCurrencyChange}
            value={formData.currency_code}
            required
          >
            {currencies.map((currency) => (
              <option key={currency.pricebookId} value={currency.currencyCode}>
                {currency.currencyCode}
              </option>
            ))}
          </CustomInput>
        </Col>
      </FormGroup>

      <FormGroup row>
        <Label className="" for="billing_cycles" sm={2}>
          Expires After
        </Label>
        <Col sm={5}>
          <InputGroup>
            <Input
              type="text"
              name="billing_cycles"
              id="billing_cycles"
              value={formData.billing_cycles}
              onChange={onInputChange}
              required={!noExpiry}
              disabled={noExpiry}
            />
            <InputGroupAddon addonType="append">
              <InputGroupText>cycles</InputGroupText>
            </InputGroupAddon>
          </InputGroup>
        </Col>
        <Col sm={3}>
          <CustomInput
            type="checkbox"
            id="no-expiry"
            name="no-expiry"
            label="Never Expires"
            checked={noExpiry}
            onChange={onExpiryChange}
          />
        </Col>
      </FormGroup>
      <FormGroup row className="mb-0">
        <Label className="" for="autoconvert" sm={2}>
          Convert Retainer
        </Label>
        <Col sm={9}>
          <CustomInput
            type="checkbox"
            id="autoconvert"
            name="autoconvert"
            label="Enable auto-conversion of retainer fee after X months"
            checked={!convertDisabled}
            onChange={onConvertChange}
          />
        </Col>
        <Col md={2}>&nbsp;</Col>
        <Col md={5}>
          <FormGroup>
            <Label for="convert_retainer_cycle">Convert After</Label>
            <InputGroup>
              <Input
                type="text"
                name="convert_retainer_cycle"
                id="convert_retainer_cycle"
                value={formData.convert_retainer_cycle}
                onChange={onInputChange}
                disabled={convertDisabled}
              />
              <InputGroupAddon addonType="append">
                <InputGroupText>cycles</InputGroupText>
              </InputGroupAddon>
            </InputGroup>
          </FormGroup>
        </Col>
        <Col md={4}>
          <FormGroup>
            <Label for="retainer_after_convert">Convert Price</Label>
            <InputGroup>
              <Input
                type="text"
                name="retainer_after_convert"
                id="retainer_after_convert"
                value={formData.retainer_after_convert}
                onChange={onInputChange}
                disabled={convertDisabled}
              />
              <InputGroupAddon addonType="append">
                <InputGroupText>{formData.currency_code}</InputGroupText>
              </InputGroupAddon>
            </InputGroup>
          </FormGroup>
        </Col>
      </FormGroup>
      <FormGroup row>
        <Label className="" for="planDescription" sm={2}>
          Plan Description
        </Label>
        <Col sm={10}>
          <Input
            type="textarea"
            name="plan_description"
            id="plan_description"
            value={formData.plan_description}
            onChange={onInputChange}
          />
        </Col>
      </FormGroup>

      <FormGroup row>
        <Label className="" for="exampleCheckbox" sm={2}>
          Addons
        </Label>
        <Col sm={10}>
          <a href="#" onClick={addAddon}>
            <PlusSquareIcon />
          </a>
        </Col>
      </FormGroup>
      <FormGroup row>
        <Label className="" for="exampleCheckbox" sm={2}>
          &nbsp;
        </Label>
        <Col sm={10}>
          {formData.addons.map((a, index) => (
            <AddOn
              key={index}
              addons={addons}
              formData={a}
              currencyCode={formData.currency_code}
              onChange={(e) => onAddonChange(e, index)}
              onRemove={(e) => onAddonRemove(index)}
            />
          ))}
        </Col>
      </FormGroup>
    </div>
  );
};
export default SubscriptionForm;
