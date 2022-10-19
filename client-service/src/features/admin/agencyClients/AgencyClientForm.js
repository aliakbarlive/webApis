import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  Container,
  Card,
  CardBody,
  Row,
  Col,
  Form,
  CardTitle,
  CustomInput,
  Button,
  Spinner,
} from 'reactstrap';
import {
  fetchClientById,
  updateAgencyClient,
  getData,
} from './agencyClientsSlice';
import { createAgencyClient } from './agencyClientsSlice';
import { useParams } from 'react-router';
import ClientDetailsForm from 'components/agencyClient/form/ClientDetailsForm';
import SubscriptionForm from 'components/agencyClient/form/SubscriptionForm';

const AgencyClientForm = ({ history }) => {
  const { operation, id } = useParams();
  const [formData, setFormData] = useState({
    client: '',
    address: '',
    siEmail: '',
    website: '',
    aboutUs: '',
    overview: '',
    painPoints: '',
    goals: '',
    productCategories: '',
    amazonPageUrl: '',
    asinsToOptimize: '',
    otherNotes: '',
    email: '',
    pricebook_id: '',
    currency_code: 'USD',
    plan_code: process.env.REACT_APP_PLAN_CODE,
    plan_description: '',
    price: 0,
    convert_retainer_cycle: '',
    retainer_after_convert: '',
    billing_cycles: '',
    mailInvite: 0,
    addons: [],
  });

  const { agencyClient, dataLoaded, clientLoaded } = useSelector(
    (state) => state.agencyClients
  );
  const dispatch = useDispatch();

  useEffect(() => {
    if (operation == 'edit') {
      dispatch(fetchClientById(id));
    }
  }, []);

  useEffect(() => {
    if (operation == 'edit') {
      if (dataLoaded && clientLoaded) {
        loadAgencyClient();
      }
    }
  }, [dataLoaded, clientLoaded]);

  function loadAgencyClient() {
    const {
      client,
      address,
      siEmail,
      website,
      aboutUs,
      overview,
      painPoints,
      goals,
      productCategories,
      amazonPageUrl,
      asinsToOptimize,
      otherNotes,
      hostedpageDetails: {
        email,
        price,
        addons,
        plan_code,
        plan_description,
        currency_code,
        convert_retainer_cycle,
        retainer_after_convert,
        billing_cycles,
        pricebook_id,
      },
    } = agencyClient;

    setFormData({
      ...formData,
      client,
      address,
      siEmail,
      website,
      aboutUs,
      overview,
      painPoints,
      goals,
      productCategories,
      amazonPageUrl,
      asinsToOptimize,
      otherNotes,
      email,
      pricebook_id,
      currency_code,
      plan_code,
      plan_description,
      price,
      convert_retainer_cycle,
      retainer_after_convert,
      billing_cycles,
      addons,
    });
  }

  function updateFormData(data) {
    setFormData({ ...formData, ...data });
  }

  const onSubmit = (e) => {
    e.preventDefault();
    if (operation == 'edit') {
      dispatch(updateAgencyClient(id, formData, history));
    } else {
      dispatch(createAgencyClient(formData, history));
    }
  };

  const sendInvite = (e) => {
    let checked = e.target.checked ? 1 : 0;

    setFormData({
      ...formData,
      mailInvite: checked,
    });
  };

  return (
    <Container fluid className="p-0">
      <Card className="bg-primary">
        <CardBody>
          <Row className="align-items-center">
            <Col>
              <h3 className="mb-0 text-white text-capitalize">
                {operation} Client
              </h3>
            </Col>
          </Row>
        </CardBody>
      </Card>

      <Form method="POST" onSubmit={onSubmit}>
        <Row>
          <Col lg={6}>
            <Card>
              <CardBody>
                <CardTitle tag="h5">Subscription Details</CardTitle>
                <SubscriptionForm
                  operation={operation}
                  formData={formData}
                  onDataChange={updateFormData}
                />
              </CardBody>
            </Card>
            <Card>
              <CardBody className="text-center">
                <CustomInput
                  type="checkbox"
                  id="mailInvite"
                  name="mailInvite"
                  label="Send Email Invite"
                  inline
                  onChange={sendInvite}
                />
                <Button className="mr-2" color="primary">
                  Submit
                </Button>
                <Link to="/clients">
                  <Button color="dark">Cancel</Button>
                </Link>
              </CardBody>
            </Card>
          </Col>
          <Col lg={6}>
            <Card>
              <CardBody>
                <CardTitle tag="h5">Client Details</CardTitle>
                <ClientDetailsForm
                  formData={formData}
                  onDataChange={updateFormData}
                />
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Form>
    </Container>
  );
};

export default AgencyClientForm;
