import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input,
  CustomInput,
  Row,
  Col,
  FormText,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
} from 'reactstrap';
import { setHasNewHostedPage, subscribe } from './subscriptionsSlice';
import { Cashify } from 'cashify';
import currency from 'currency.js';

const SubscriptionModal = (props) => {
  const { buttonLabel, className } = props;
  const [open, setOpen] = useState(false);
  const [convertDisabled, setConvertDisabled] = useState(true);
  const [noExpiry, setNoExpiry] = useState(true);
  const [formData, setFormData] = useState({
    sellingPartnerId: '',
    customer_name: '',
    email: '',
    currency_code: 'USD',
    pricebook_id: '',
    plan_code: process.env.REACT_APP_PLAN_CODE,
    plan_description: '',
    price: 0,
    convert_retainer_cycle: '',
    retainer_after_convert: '',
    starts_at: moment().format('YYYY-MM-DD'),
    billing_cycles: '',
    addons: [],
  });
  const [planAddons, setPlanAddons] = useState([]);
  const {
    hostedPage,
    hasNewHostedPage,
    prepData: { nonSubscribers, plans, currencies, exchangeRates },
  } = useSelector((state) => state.subscriptions);
  const dispatch = useDispatch();

  const toggle = () => {
    setOpen(!open);
  };

  const closeCleanup = () => {
    setOpen(!open);
    dispatch(setHasNewHostedPage(false));
  };

  useEffect(() => {
    /**
     * run only when popup is open
     * preload 1st plan and set default checked to never expires
     * */
    if (open && plans.length > 0) {
      //console.log(prepData);
      loadPlan(process.env.REACT_APP_PLAN_CODE);
      setNoExpiry(true);
    }
  }, [open]);

  useEffect(() => {
    if (hasNewHostedPage) {
      console.log(hasNewHostedPage, 'yaep');
      console.log(hostedPage);
      //alert(hostedPage.url);
      //dispatch(setHasNewHostedPage(false));
    }
  }, [hostedPage, hasNewHostedPage]);

  const onInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSellingPartnerChange = (e) => {
    const value = e.target.value;

    if (value !== '') {
      const nonSubscriber = nonSubscribers.find(
        (x) => x.sellingPartnerId == value
      );

      const {
        sellingPartnerId,
        User: { firstName, lastName, email },
      } = nonSubscriber;

      setFormData({
        ...formData,
        sellingPartnerId,
        email,
        customer_name: firstName + ' ' + lastName,
      });
    } else {
      setFormData({
        ...formData,
        sellingPartnerId: '',
        customer_name: '',
        email: '',
      });
    }
  };

  function loadPlan(plan_code) {
    const plan = plans.find((p) => p.plan_code == plan_code);

    const { recurring_price, description, addons } = plan;

    setPlanAddons(addons);

    setFormData({
      ...formData,
      plan_code,
      plan_description: description,
      currency_code: 'USD',
      price: recurring_price,
      pricebook_id: '',
    });
  }

  const onPlanChange = (e) => {
    const value = e.target.value;

    if (value !== '') {
      loadPlan(value);
    }
  };

  const onCurrencyChange = (e) => {
    const value = e.target.value;
    const cashify = new Cashify({
      base: exchangeRates.base,
      rates: exchangeRates.rates,
    });

    if (value !== '') {
      const converted = cashify.convert(formData.price, {
        from: formData.currency_code,
        to: value,
      });
      const price = currency(converted, { precision: 2 });

      const pricebook = currencies.find((c) => c.currencyCode == value);
      const pricebook_id = value == 'USD' ? '' : pricebook.pricebookId;

      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
        price,
        pricebook_id,
      });
    }
  };

  const onCheckboxChange = (e) => {
    let addon = e.target.name;

    let addons = e.target.checked
      ? [...formData.addons, e.target.name]
      : [...formData.addons].filter((a) => a !== addon);

    setFormData({ ...formData, addons });
  };

  const onConvertChange = (e) => {
    let checked = e.target.checked;

    setConvertDisabled(!checked);

    if (!checked) {
      setFormData({
        ...formData,
        convert_retainer_cycle: '',
        retainer_after_convert: '',
      });
    }
  };

  const onExpiryChange = (e) => {
    let checked = e.target.checked;

    setNoExpiry(checked);

    if (checked) {
      setFormData({
        ...formData,
        billing_cycles: '',
      });
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(subscribe(formData));
  };

  return (
    <div>
      <Button color="light" onClick={toggle}>
        {buttonLabel}
      </Button>
      <Modal isOpen={open} className={className}>
        <ModalHeader>New Subscription</ModalHeader>
        <ModalBody>
          <div className={hasNewHostedPage ? '' : 'd-none'}>
            {Object.entries(hostedPage).length > 0 ? (
              <Row>
                <Col sm={12}>
                  <h3 className="">Hosted Page created!</h3>
                  <h5>Please send this link to the seller</h5>
                </Col>
                <Col sm={12}>
                  <Input
                    type="textarea"
                    name=""
                    id="plan_description"
                    rows={3}
                    readonly
                    value={hostedPage.url}
                  />
                  <a href={hostedPage.url} target="_blank">
                    Open in new tab
                  </a>
                </Col>

                <Col className="text-right" sm={12}>
                  <Button color="dark" onClick={closeCleanup}>
                    Close
                  </Button>
                </Col>
              </Row>
            ) : null}
          </div>
          <div className={hasNewHostedPage ? 'd-none' : ''}>
            <Form method="POST" onSubmit={onSubmit}>
              <FormGroup row>
                <Label for="sellingPartner" sm={3}>
                  Selling Partner
                </Label>
                <Col sm={9}>
                  <CustomInput
                    type="select"
                    name="sellingPartner"
                    id="sellingPartner"
                    onChange={onSellingPartnerChange}
                    required
                  >
                    <option value="">Select Selling Partner...</option>
                    {nonSubscribers.map((p) => (
                      <option
                        key={p.sellingPartnerId}
                        value={p.sellingPartnerId}
                      >
                        {`${p.User.firstName} ${p.User.lastName}`}
                      </option>
                    ))}
                  </CustomInput>
                </Col>
              </FormGroup>
              <FormGroup row>
                <Label for="customerEmail" sm={3}>
                  Email
                </Label>
                <Col sm={9}>
                  <Input
                    type="email"
                    name="email"
                    id="email"
                    value={formData.email}
                    required
                    onChange={onInputChange}
                  />
                </Col>
              </FormGroup>

              <FormGroup row>
                <Label for="plan" sm={3}>
                  Plan
                </Label>
                <Col sm={5}>
                  <CustomInput
                    type="select"
                    name="plan"
                    id="plan"
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
                <Label for="price" sm={3}>
                  Plan Price
                </Label>
                <Col sm={3}>
                  <Input
                    type="text"
                    name="price"
                    id="price"
                    value={formData.price}
                    required
                    onChange={onInputChange}
                  />
                </Col>
                <Col sm={2} className="pl-0">
                  <CustomInput
                    type="select"
                    name="currency_code"
                    id="currency_code"
                    onChange={onCurrencyChange}
                    value={formData.currency_code}
                    required
                  >
                    {currencies.map((currency) => (
                      <option
                        key={currency.pricebookId}
                        value={currency.currencyCode}
                      >
                        {currency.currencyCode}
                      </option>
                    ))}
                  </CustomInput>
                </Col>
              </FormGroup>
              <FormGroup row>
                <Label for="price" sm={3}>
                  Starts on
                </Label>
                <Col sm={5}>
                  <Input
                    type="date"
                    name="starts_at"
                    id="starts_at"
                    value={formData.starts_at}
                    onChange={onInputChange}
                    required
                    placeholder="date placeholder"
                  />
                </Col>
              </FormGroup>

              <FormGroup row>
                <Label for="billing_cycles" sm={3}>
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
                    defaultChecked={noExpiry}
                    onChange={onExpiryChange}
                  />
                </Col>
              </FormGroup>
              <FormGroup row className="mb-0">
                <Label for="autoconvert" sm={3}>
                  Convert Retainer
                </Label>
                <Col sm={9}>
                  <CustomInput
                    type="checkbox"
                    id="autoconvert"
                    name="autoconvert"
                    label="Enable auto-conversion of retainer fee after X months"
                    onChange={onConvertChange}
                  />
                </Col>
                <Col md={3}>&nbsp;</Col>
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
                        <InputGroupText>
                          {formData.currency_code}
                        </InputGroupText>
                      </InputGroupAddon>
                    </InputGroup>
                  </FormGroup>
                </Col>
              </FormGroup>

              <FormGroup>
                <Label for="planDescription">Plan Description</Label>
                <Input
                  type="textarea"
                  name="plan_description"
                  id="plan_description"
                  value={formData.plan_description}
                  onChange={onInputChange}
                />
              </FormGroup>

              <FormGroup>
                <Label for="exampleCheckbox">Addons: </Label>
                <div>
                  {planAddons.map((a) => (
                    <CustomInput
                      type="checkbox"
                      key={a.addon_code}
                      id={a.addon_code}
                      name={a.addon_code}
                      label={a.name}
                      inline
                      onChange={onCheckboxChange}
                    />
                  ))}
                </div>
              </FormGroup>

              <Row form>
                <Col className="text-right mt-4">
                  <Button className="mr-2" color="primary">
                    Sign up
                  </Button>
                  <Button color="dark" onClick={toggle}>
                    Cancel
                  </Button>
                </Col>
              </Row>
            </Form>
          </div>
        </ModalBody>
      </Modal>
    </div>
  );
};

export default SubscriptionModal;
